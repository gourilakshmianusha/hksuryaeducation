import fs from 'fs';
import path from 'path';
import initSqlJs, { Database } from 'sql.js';
import bcrypt from 'bcryptjs';

const DATA_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.resolve(DATA_DIR, 'hksurya.sqlite');

let dbInstance: Database | null = null;
let isInitialized = false;

// Convert SQLite query results to array of objects
function resultToObjects<T = any>(result: any): T[] {
  if (!result || !result.columns || !result.values) return [];
  const columns = result.columns;
  return result.values.map((row: any[]) => {
    const obj: any = {};
    columns.forEach((col: string, idx: number) => {
      obj[col] = row[idx];
    });
    return obj as T;
  });
}

// Save database bytes to disk
export function persistDb(): void {
  if (!dbInstance) return;
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  const data = dbInstance.export();
  const buffer = Buffer.from(data);
  const tempFile = `${DB_FILE}.tmp.${Date.now()}`;
  fs.writeFileSync(tempFile, buffer);
  fs.renameSync(tempFile, DB_FILE);
}

// SQL Query helper
export function query<T = any>(sql: string, params: any[] = []): T[] {
  if (!dbInstance) throw new Error('Database not initialized');
  const stmt = dbInstance.prepare(sql);
  try {
    if (params.length > 0) stmt.bind(params);
    const results: T[] = [];
    while (stmt.step()) {
      results.push(stmt.getAsObject() as T);
    }
    return results;
  } finally {
    stmt.free();
  }
}

// Single-record query helper
export function queryOne<T = any>(sql: string, params: any[] = []): T | null {
  const rows = query<T>(sql, params);
  return rows.length > 0 ? rows[0] : null;
}

// Run mutation (INSERT, UPDATE, DELETE) and persist
export function run(sql: string, params: any[] = []): { changes: number } {
  if (!dbInstance) throw new Error('Database not initialized');
  dbInstance.run(sql, params);
  const changes = dbInstance.getRowsModified();
  persistDb();
  return { changes };
}

// Initialize Database, create 20 relational tables, indexes, and seed initial records
export async function initDb(): Promise<Database> {
  if (dbInstance && isInitialized) return dbInstance;

  const SQL = await initSqlJs();

  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  let fileBuffer: Buffer | null = null;
  if (fs.existsSync(DB_FILE)) {
    try {
      fileBuffer = fs.readFileSync(DB_FILE);
    } catch (e) {
      console.error('Error reading existing sqlite file:', e);
    }
  }

  dbInstance = fileBuffer ? new SQL.Database(fileBuffer) : new SQL.Database();
  dbInstance.run('PRAGMA foreign_keys = ON;');

  // ================= 20 RELATIONAL TABLES & INDEXES =================
  dbInstance.run(`
    -- 1. USERS
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      name TEXT NOT NULL,
      role TEXT NOT NULL CHECK(role IN ('student', 'trainer', 'admin')),
      avatar TEXT,
      bio TEXT,
      status TEXT NOT NULL DEFAULT 'active' CHECK(status IN ('active', 'suspended')),
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    -- 2. STUDENTS (Child profile of users)
    CREATE TABLE IF NOT EXISTS students (
      id TEXT PRIMARY KEY,
      user_id TEXT UNIQUE NOT NULL,
      phone TEXT,
      github_url TEXT,
      linkedin_url TEXT,
      target_role TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    -- 3. ADMINS (Child profile of users)
    CREATE TABLE IF NOT EXISTS admins (
      id TEXT PRIMARY KEY,
      user_id TEXT UNIQUE NOT NULL,
      department TEXT DEFAULT 'Academic Leadership',
      permissions TEXT DEFAULT 'all',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    -- 4. CATEGORIES
    CREATE TABLE IF NOT EXISTS categories (
      id TEXT PRIMARY KEY,
      name TEXT UNIQUE NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      description TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    -- 5. TRAINERS (Faculty)
    CREATE TABLE IF NOT EXISTS trainers (
      id TEXT PRIMARY KEY,
      user_id TEXT UNIQUE,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      role TEXT NOT NULL,
      company TEXT NOT NULL,
      experience TEXT NOT NULL,
      bio TEXT,
      avatar TEXT,
      specialties_json TEXT,
      rating REAL DEFAULT 5.0,
      students_taught INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
    );

    -- 6. COURSES
    CREATE TABLE IF NOT EXISTS courses (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      category_id TEXT NOT NULL,
      level TEXT NOT NULL,
      duration TEXT NOT NULL,
      price REAL NOT NULL,
      original_price REAL,
      trainer_id TEXT NOT NULL,
      overview TEXT,
      highlights_json TEXT,
      skills_json TEXT,
      technologies_json TEXT,
      syllabus_json TEXT,
      certificate_included INTEGER DEFAULT 1,
      next_cohort_date TEXT,
      featured INTEGER DEFAULT 0,
      published INTEGER DEFAULT 1,
      enrolled_count INTEGER DEFAULT 0,
      rating REAL DEFAULT 5.0,
      reviews_count INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE RESTRICT,
      FOREIGN KEY (trainer_id) REFERENCES trainers(id) ON DELETE RESTRICT
    );

    -- 7. LEARNING_PATHS
    CREATE TABLE IF NOT EXISTS learning_paths (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      duration TEXT NOT NULL,
      target_role TEXT NOT NULL,
      avg_salary TEXT,
      description TEXT,
      color TEXT DEFAULT '#00D2FF',
      published INTEGER DEFAULT 1,
      steps_json TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    -- 8. LESSONS
    CREATE TABLE IF NOT EXISTS lessons (
      id TEXT PRIMARY KEY,
      course_id TEXT NOT NULL,
      module_title TEXT NOT NULL,
      title TEXT NOT NULL,
      duration TEXT NOT NULL,
      video_url TEXT,
      content TEXT,
      order_index INTEGER DEFAULT 1,
      resources_json TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
    );

    -- 9. ENROLLMENTS
    CREATE TABLE IF NOT EXISTS enrollments (
      id TEXT PRIMARY KEY,
      student_id TEXT NOT NULL,
      course_id TEXT NOT NULL,
      enrolled_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      status TEXT DEFAULT 'active' CHECK(status IN ('active', 'completed', 'refunded', 'cancelled')),
      progress_percentage INTEGER DEFAULT 0,
      last_accessed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
      UNIQUE(student_id, course_id)
    );

    -- 10. LESSON_PROGRESS
    CREATE TABLE IF NOT EXISTS lesson_progress (
      id TEXT PRIMARY KEY,
      student_id TEXT NOT NULL,
      course_id TEXT NOT NULL,
      lesson_id TEXT NOT NULL,
      completed INTEGER DEFAULT 0,
      completed_at DATETIME,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
      FOREIGN KEY (lesson_id) REFERENCES lessons(id) ON DELETE CASCADE,
      UNIQUE(student_id, lesson_id)
    );

    -- 11. ASSIGNMENTS
    CREATE TABLE IF NOT EXISTS assignments (
      id TEXT PRIMARY KEY,
      course_id TEXT NOT NULL,
      title TEXT NOT NULL,
      description TEXT,
      due_date TEXT,
      max_score INTEGER DEFAULT 100,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
    );

    -- 12. QUIZZES
    CREATE TABLE IF NOT EXISTS quizzes (
      id TEXT PRIMARY KEY,
      course_id TEXT NOT NULL,
      title TEXT NOT NULL,
      passing_score INTEGER DEFAULT 80,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
    );

    -- 13. QUIZ_QUESTIONS
    CREATE TABLE IF NOT EXISTS quiz_questions (
      id TEXT PRIMARY KEY,
      quiz_id TEXT NOT NULL,
      question TEXT NOT NULL,
      options_json TEXT NOT NULL,
      correct_index INTEGER NOT NULL,
      explanation TEXT,
      order_index INTEGER DEFAULT 1,
      FOREIGN KEY (quiz_id) REFERENCES quizzes(id) ON DELETE CASCADE
    );

    -- 14. CERTIFICATES
    CREATE TABLE IF NOT EXISTS certificates (
      id TEXT PRIMARY KEY,
      certificate_code TEXT UNIQUE NOT NULL,
      student_id TEXT NOT NULL,
      course_id TEXT NOT NULL,
      issue_date TEXT NOT NULL,
      grade TEXT NOT NULL,
      verified INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
    );

    -- 15. PAYMENTS
    CREATE TABLE IF NOT EXISTS payments (
      id TEXT PRIMARY KEY,
      student_id TEXT NOT NULL,
      course_id TEXT NOT NULL,
      amount REAL NOT NULL,
      currency TEXT DEFAULT 'USD',
      status TEXT DEFAULT 'succeeded',
      payment_method TEXT,
      transaction_ref TEXT UNIQUE NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
    );

    -- 16. TESTIMONIALS
    CREATE TABLE IF NOT EXISTS testimonials (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      role TEXT NOT NULL,
      company TEXT NOT NULL,
      avatar TEXT,
      text TEXT NOT NULL,
      rating INTEGER DEFAULT 5,
      course_id TEXT,
      published INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE SET NULL
    );

    -- 17. BLOGS
    CREATE TABLE IF NOT EXISTS blogs (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      category TEXT NOT NULL,
      read_time TEXT DEFAULT '5 min read',
      date TEXT NOT NULL,
      author TEXT NOT NULL,
      author_role TEXT,
      excerpt TEXT,
      content TEXT NOT NULL,
      published INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    -- 18. CONTACT_MESSAGES
    CREATE TABLE IF NOT EXISTS contact_messages (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      topic TEXT DEFAULT 'Admissions & Enrollment',
      message TEXT NOT NULL,
      status TEXT DEFAULT 'unread' CHECK(status IN ('unread', 'read', 'replied')),
      reply_note TEXT,
      received_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    -- 19. NEWSLETTER_SUBSCRIBERS
    CREATE TABLE IF NOT EXISTS newsletter_subscribers (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      subscribed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      active INTEGER DEFAULT 1
    );

    -- 20. SETTINGS
    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    -- INDEXES FOR PERFORMANCE
    CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
    CREATE INDEX IF NOT EXISTS idx_courses_category ON courses(category_id);
    CREATE INDEX IF NOT EXISTS idx_courses_trainer ON courses(trainer_id);
    CREATE INDEX IF NOT EXISTS idx_lessons_course ON lessons(course_id);
    CREATE INDEX IF NOT EXISTS idx_enrollments_student ON enrollments(student_id);
    CREATE INDEX IF NOT EXISTS idx_enrollments_course ON enrollments(course_id);
    CREATE INDEX IF NOT EXISTS idx_lesson_progress ON lesson_progress(student_id, course_id, lesson_id);
    CREATE INDEX IF NOT EXISTS idx_certificates_code ON certificates(certificate_code);
    CREATE INDEX IF NOT EXISTS idx_payments_student ON payments(student_id);
    CREATE INDEX IF NOT EXISTS idx_blogs_slug ON blogs(slug);
  `);

  // Check if initial seeding is needed
  const userCount = queryOne<{ count: number }>('SELECT count(*) as count FROM users');
  if (!userCount || userCount.count === 0) {
    seedDatabase();
  }

  isInitialized = true;
  persistDb();
  return dbInstance;
}

// Seed initial relational data
function seedDatabase(): void {
  const salt = bcrypt.genSaltSync(10);
  const adminHash = bcrypt.hashSync('Admin@Hksurya2026', salt);
  const studentHash = bcrypt.hashSync('Student@2026', salt);

  // 1. Users
  run(
    `INSERT INTO users (id, email, password_hash, name, role, bio, status) VALUES
     (?, ?, ?, ?, ?, ?, ?),
     (?, ?, ?, ?, ?, ?, ?);`,
    [
      'user-admin-01', 'admin@hksuryalearning.com', adminHash, 'Administrator', 'admin', 'Chief Academic Director & Lead Administrator at HKSURYA Learning', 'active',
      'user-student-01', 'student@hksuryalearning.com', studentHash, 'Alex Chen', 'student', 'Software engineer transitioning into AI and Distributed Systems', 'active',
    ]
  );

  // 2. Admins & Students
  run(`INSERT INTO admins (id, user_id, department, permissions) VALUES (?, ?, ?, ?);`, [
    'admin-rel-01', 'user-admin-01', 'Academic Leadership', 'all',
  ]);

  run(`INSERT INTO students (id, user_id, phone, github_url, target_role) VALUES (?, ?, ?, ?, ?);`, [
    'student-rel-01', 'user-student-01', '+1 415 555 2671', 'https://github.com/alexchen', 'Senior Full Stack & AI Architect',
  ]);

  // 3. Categories
  run(
    `INSERT INTO categories (id, name, slug, description) VALUES
     (?, ?, ?, ?),
     (?, ?, ?, ?),
     (?, ?, ?, ?),
     (?, ?, ?, ?),
     (?, ?, ?, ?);`,
    [
      'cat-fullstack', 'Full Stack', 'full-stack', 'Modern TypeScript, React 19, Node.js, and Cloud backends',
      'cat-aiml', 'AI & ML', 'ai-ml', 'Generative AI, Large Language Models, PyTorch, and RAG pipelines',
      'cat-cloud', 'Cloud & DevOps', 'cloud-devops', 'Kubernetes, Terraform IaC, AWS/GCP architecture and SRE',
      'cat-cyber', 'Cybersecurity', 'cybersecurity', 'Offensive ethical hacking, SIEM, and SOC operations',
      'cat-data', 'Data Science', 'data-science', 'Apache Spark, Kafka real-time streaming, and Snowflake lakehouses',
    ]
  );

  // 4. Trainers
  run(
    `INSERT INTO trainers (id, name, email, role, company, experience, bio, avatar, specialties_json, rating, students_taught) VALUES
     (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?),
     (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?),
     (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?),
     (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
    [
      'trainer-surya', 'Dr. Surya K.', 'surya@hksuryalearning.com', 'Principal Engineer & Founder', 'Ex-Google / HKSURYA Lead', '16+ Years Experience',
      'Pioneer in distributed systems and modern web architecture. Trained over 24,000 engineers globally.',
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      JSON.stringify(['Distributed Systems', 'React 19 & Next.js', 'System Architecture', 'Performance']), 4.96, 24500,

      'trainer-aditi', 'Aditi Sharma', 'aditi@hksuryalearning.com', 'Staff AI Research Engineer', 'Ex-DeepMind / AI Fellow', '11+ Years Experience',
      'Specialist in generative models, parameter-efficient fine-tuning, and agentic workflows.',
      'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80',
      JSON.stringify(['Large Language Models', 'PyTorch', 'Autonomous Agents', 'RAG Optimization']), 4.98, 18200,

      'trainer-rohan', 'Rohan Mehra', 'rohan@hksuryalearning.com', 'Principal Cloud Architect', 'AWS APN Ambassador', '13+ Years Experience',
      'Architected cloud backbones handling 100M+ daily transactions. Expert in Kubernetes and Terraform.',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
      JSON.stringify(['Kubernetes', 'Multi-Cloud Architecture', 'Terraform', 'Site Reliability']), 4.92, 19800,

      'trainer-elena', 'Elena Rostova', 'elena@hksuryalearning.com', 'Lead Security Consultant', 'Ex-FireEye / DefCon Speaker', '12+ Years Experience',
      'Seasoned ethical hacker, red team operator, and blue team consultant for Fortune 500 banks.',
      'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
      JSON.stringify(['Red Team Pentesting', 'Incident Response', 'Active Directory Defense', 'Threat Hunting']), 4.94, 14600,
    ]
  );

  // 5. Courses
  run(
    `INSERT INTO courses (
      id, title, slug, category_id, level, duration, price, original_price, trainer_id,
      overview, highlights_json, skills_json, technologies_json, syllabus_json,
      certificate_included, next_cohort_date, featured, published, enrolled_count, rating, reviews_count
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?),
             (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?),
             (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
    [
      // Course 1
      'course-fullstack-01', 'Enterprise Full Stack Web Development (Next.js & TypeScript)', 'enterprise-fullstack-web-dev',
      'cat-fullstack', 'Intermediate', '16 Weeks', 499, 899, 'trainer-surya',
      'Master production-grade modern web development from high-performance React 19 architecture to distributed microservices, Tailwind CSS, PostgreSQL, and scalable Docker deployments.',
      JSON.stringify(['Build 5 production-ready enterprise applications', 'Real-world CI/CD pipeline and cloud architecture', '1-on-1 weekly code reviews and architecture teardowns']),
      JSON.stringify(['React 19', 'Next.js', 'TypeScript', 'Node.js', 'PostgreSQL', 'Docker', 'AWS']),
      JSON.stringify(['React', 'Next.js', 'Node.js', 'PostgreSQL', 'Docker', 'Tailwind CSS', 'Redis']),
      JSON.stringify([
        { module: 'Module 1: Modern TypeScript & React 19 Architecture', duration: '3 Weeks', lessons: ['TypeScript Type Systems & Generics', 'React 19 Server Components & Actions'] },
        { module: 'Module 2: Enterprise Backend & REST/GraphQL API Design', duration: '4 Weeks', lessons: ['Node.js & Express Microservice Architecture', 'PostgreSQL Schema Modeling'] },
      ]),
      1, 'Starts October 15, 2026', 1, 1, 8420, 4.95, 1420,

      // Course 2
      'course-ai-01', 'Applied Generative AI & Large Language Models Engineering', 'applied-generative-ai-llms',
      'cat-aiml', 'Advanced', '14 Weeks', 649, 1099, 'trainer-aditi',
      'Design, fine-tune, and deploy state-of-the-art LLM architectures, RAG pipelines, autonomous multi-agent systems, and multimodal reasoning systems in production.',
      JSON.stringify(['Advanced RAG with hybrid dense-sparse vector search', 'Fine-tuning open weights models using LoRA / QLoRA', 'Multi-agent orchestration with LangGraph and AutoGen']),
      JSON.stringify(['PyTorch', 'Hugging Face', 'Vector DBs', 'RAG Architecture', 'Model Fine-tuning']),
      JSON.stringify(['Python', 'PyTorch', 'LangChain', 'ChromaDB', 'Transformers', 'FastAPI']),
      JSON.stringify([
        { module: 'Module 1: Transformer Foundations & Attention Mechanics', duration: '3 Weeks', lessons: ['Self-Attention & Multi-Head Attention Mathematics', 'Tokenization & Vector Spaces'] },
        { module: 'Module 2: Advanced Retrieval-Augmented Generation (RAG)', duration: '4 Weeks', lessons: ['Chunking Strategies & Context Enrichment', 'Vector Databases & Hybrid Search'] },
      ]),
      1, 'Starts October 22, 2026', 1, 1, 4210, 4.98, 980,

      // Course 3
      'course-cloud-01', 'Cloud Solutions Architect & Kubernetes DevOps Masterclass', 'cloud-solutions-architect-kubernetes',
      'cat-cloud', 'Intermediate', '12 Weeks', 449, 799, 'trainer-rohan',
      'Master multi-cloud design, Terraform Infrastructure as Code (IaC), zero-downtime Kubernetes clustering, Prometheus monitoring, and disaster recovery.',
      JSON.stringify(['Terraform multi-environment IaC from scratch', 'Production Kubernetes cluster administration & Helm', 'Zero-trust network architecture and IAM governance']),
      JSON.stringify(['Kubernetes', 'Terraform', 'AWS', 'GCP', 'Docker', 'CI/CD', 'Prometheus']),
      JSON.stringify(['Kubernetes', 'Terraform', 'AWS', 'Helm', 'ArgoCD', 'Grafana', 'Linux']),
      JSON.stringify([
        { module: 'Module 1: Multi-Cloud Network Architecture', duration: '3 Weeks', lessons: ['VPC Peering, Transit Gateways & Subnetting', 'IAM Roles & Policies'] },
        { module: 'Module 2: Infrastructure as Code with Terraform', duration: '3 Weeks', lessons: ['Declarative Configuration & State Locking', 'Reusable Terraform Modules'] },
      ]),
      1, 'Starts November 01, 2026', 0, 1, 6150, 4.91, 1100,
    ]
  );

  // 6. Lessons
  run(
    `INSERT INTO lessons (id, course_id, module_title, title, duration, video_url, content, order_index, resources_json) VALUES
     (?, ?, ?, ?, ?, ?, ?, ?, ?),
     (?, ?, ?, ?, ?, ?, ?, ?, ?),
     (?, ?, ?, ?, ?, ?, ?, ?, ?),
     (?, ?, ?, ?, ?, ?, ?, ?, ?);`,
    [
      'lesson-fs-101', 'course-fullstack-01', 'Module 1: Modern TypeScript & React 19 Architecture', 'TypeScript Type Systems & Generics', '45 mins',
      'https://www.youtube.com/embed/dQw4w9WgXcQ', 'In this lesson we dissect advanced TypeScript types: Conditional Types, Template Literal Types, Utility Generics, and Covariance/Contravariance in production APIs.',
      1, JSON.stringify([{ name: 'Type Cheatsheet PDF', url: '#' }, { name: 'Starter Repo GitHub', url: '#' }]),

      'lesson-fs-102', 'course-fullstack-01', 'Module 1: Modern TypeScript & React 19 Architecture', 'React 19 Server Components & Actions', '55 mins',
      'https://www.youtube.com/embed/dQw4w9WgXcQ', 'Explore how React 19 revolutionizes form states, server-side data streaming, asset preloading, and eliminates client bundle bloat.',
      2, JSON.stringify([{ name: 'React 19 Action Templates', url: '#' }]),

      'lesson-fs-103', 'course-fullstack-01', 'Module 1: Modern TypeScript & React 19 Architecture', 'State Orchestration & Performance Profiling', '50 mins',
      'https://www.youtube.com/embed/dQw4w9WgXcQ', 'Learn how to detect re-renders, use React DevTools Profiler, and structure scalable atomic state stores.',
      3, JSON.stringify([{ name: 'Performance Checklist', url: '#' }]),

      'lesson-ai-101', 'course-ai-01', 'Module 1: Transformer Foundations', 'Self-Attention & Multi-Head Attention Mathematics', '65 mins',
      'https://www.youtube.com/embed/dQw4w9WgXcQ', 'Deep mathematical derivation of scaled dot-product attention QK^T / sqrt(d_k) and multi-head projection tensors.',
      1, JSON.stringify([{ name: 'PyTorch Attention Notebook', url: '#' }]),
    ]
  );

  // 7. Learning Paths
  run(
    `INSERT INTO learning_paths (id, title, slug, duration, target_role, avg_salary, description, color, published, steps_json) VALUES
     (?, ?, ?, ?, ?, ?, ?, ?, ?, ?),
     (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
    [
      'path-fullstack', 'Full Stack Engineering Track', 'full-stack-track', '6 Months (24 Weeks)', 'Senior Full Stack Engineer', '$145,000 / year',
      'From modern frontend foundations to high-throughput cloud backends and DevOps deployment.', '#00D2FF', 1,
      JSON.stringify([
        { step: 1, title: 'TypeScript & React Architecture', desc: 'Master deep component systems, closures, state machines, and hooks.', duration: '6 Weeks' },
        { step: 2, title: 'Backend APIs & Database Design', desc: 'Build scalable microservices with Node.js, Express, and PostgreSQL.', duration: '6 Weeks' },
        { step: 3, title: 'Cloud Infrastructure & CI/CD', desc: 'Deploy with Docker, Kubernetes, and automated test pipelines.', duration: '6 Weeks' },
        { step: 4, title: 'Capstone & System Design Defense', desc: 'Architect a 100k-concurrent-user real-world distributed web app.', duration: '6 Weeks' },
      ]),

      'path-ai-ml', 'Artificial Intelligence & LLM Track', 'ai-llm-track', '7 Months (28 Weeks)', 'Staff AI / Machine Learning Engineer', '$168,000 / year',
      'Transform into an industry-ready AI engineer capable of training, fine-tuning, and deploying intelligent agent systems.', '#FF7A00', 1,
      JSON.stringify([
        { step: 1, title: 'Deep Learning & PyTorch Core', desc: 'Neural network math, backpropagation, and loss landscape optimization.', duration: '7 Weeks' },
        { step: 2, title: 'Transformer & Attention Systems', desc: 'Dissect Llama, Gemini, and Mistral architectures line by line.', duration: '7 Weeks' },
        { step: 3, title: 'RAG & Vector Knowledge Bases', desc: 'Hybrid retrieval, semantic embeddings, and context reranking engines.', duration: '7 Weeks' },
        { step: 4, title: 'Autonomous Multi-Agent Deployments', desc: 'Tool calling, memory retention, evaluation frameworks, and guardrails.', duration: '7 Weeks' },
      ]),
    ]
  );

  // 8. Enrollments
  run(
    `INSERT INTO enrollments (id, student_id, course_id, enrolled_at, status, progress_percentage) VALUES
     (?, ?, ?, datetime('now', '-14 days'), 'active', 66);`,
    ['enroll-01', 'user-student-01', 'course-fullstack-01']
  );

  // 9. Lesson Progress
  run(
    `INSERT INTO lesson_progress (id, student_id, course_id, lesson_id, completed, completed_at) VALUES
     (?, ?, ?, ?, 1, datetime('now', '-7 days')),
     (?, ?, ?, ?, 1, datetime('now', '-2 days'));`,
    [
      'prog-01', 'user-student-01', 'course-fullstack-01', 'lesson-fs-101',
      'prog-02', 'user-student-01', 'course-fullstack-01', 'lesson-fs-102',
    ]
  );

  // 10. Assignments
  run(
    `INSERT INTO assignments (id, course_id, title, description, due_date, max_score) VALUES
     (?, ?, ?, ?, ?, ?),
     (?, ?, ?, ?, ?, ?);`,
    [
      'assign-01', 'course-fullstack-01', 'Milestone 1: Resilient Type-Safe Form Action System',
      'Implement a complete React 19 Server Action form with Zod schema validation, optimistic UI updates, and error boundary fallback.', '2026-10-20', 100,

      'assign-02', 'course-fullstack-01', 'Milestone 2: Distributed Redis Session Cache & Express Middleware',
      'Build an express authentication middleware utilizing sliding window rate limiting and JWT revocation in Redis.', '2026-11-05', 100,
    ]
  );

  // 11. Quizzes
  run(
    `INSERT INTO quizzes (id, course_id, title, passing_score) VALUES (?, ?, ?, ?);`,
    ['quiz-01', 'course-fullstack-01', 'React 19 & TypeScript Architectural Proficiency Check', 80]
  );

  // 12. Quiz Questions
  run(
    `INSERT INTO quiz_questions (id, quiz_id, question, options_json, correct_index, explanation, order_index) VALUES
     (?, ?, ?, ?, ?, ?, ?),
     (?, ?, ?, ?, ?, ?, ?),
     (?, ?, ?, ?, ?, ?, ?);`,
    [
      'q1', 'quiz-01', 'What is the primary benefit of React 19 Server Components over traditional client-rendered components?',
      JSON.stringify([
        'They remove heavy JavaScript dependencies from the client bundle and render on the server',
        'They replace CSS stylesheets entirely',
        'They force all database queries to run in browser memory',
        'They only run inside React Native apps'
      ]), 0, 'React Server Components execute strictly on the server and stream serialized UI without client bundle bloat.', 1,

      'q2', 'quiz-01', 'In TypeScript, what does the keyof operator produce when applied to an interface?',
      JSON.stringify([
        'A runtime array of object keys',
        'A union type of string or numeric literal keys of the given type',
        'A new class constructor',
        'A boolean check for property existence'
      ]), 1, 'keyof T yields a union of all known public property names of type T at compile time.', 2,

      'q3', 'quiz-01', 'Which HTTP status code is most appropriate when a client request lacks valid authentication credentials?',
      JSON.stringify(['400 Bad Request', '401 Unauthorized', '403 Forbidden', '404 Not Found']),
      1, '401 Unauthorized signifies that the request requires user authentication.', 3,
    ]
  );

  // 13. Certificates
  run(
    `INSERT INTO certificates (id, certificate_code, student_id, course_id, issue_date, grade, verified) VALUES
     (?, ?, ?, ?, ?, ?, ?);`,
    ['cert-01', 'HKS-2026-FS-9482', 'user-student-01', 'course-fullstack-01', '2026-09-15', 'Distinction (98%)', 1]
  );

  // 14. Payments
  run(
    `INSERT INTO payments (id, student_id, course_id, amount, currency, status, payment_method, transaction_ref, created_at) VALUES
     (?, ?, ?, ?, ?, ?, ?, ?, datetime('now', '-14 days'));`,
    ['pay-101', 'user-student-01', 'course-fullstack-01', 499, 'USD', 'succeeded', 'Credit Card (Stripe ····4242)', 'tx_stripe_99248271']
  );

  // 15. Testimonials
  run(
    `INSERT INTO testimonials (id, name, role, company, text, rating, course_id, published) VALUES
     (?, ?, ?, ?, ?, ?, ?, ?),
     (?, ?, ?, ?, ?, ?, ?, ?);`,
    [
      'test-01', 'David Vance', 'Senior Staff Engineer', 'Google Cloud',
      'The distributed systems and Kubernetes lab work gave our engineers direct production skills. Hands down the highest quality curriculum in modern engineering.',
      5, 'course-cloud-01', 1,

      'test-02', 'Sarah Lin', 'AI Research Lead', 'Stripe',
      'Moving beyond simple prompting into mathematical attention mechanisms and autonomous agent loops made all the difference in my career velocity.',
      5, 'course-ai-01', 1,
    ]
  );

  // 16. Blogs
  run(
    `INSERT INTO blogs (id, title, slug, category, read_time, date, author, author_role, excerpt, content, published) VALUES
     (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?),
     (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
    [
      'blog-01', 'The AI Engineering Paradigm Shift: Beyond Simple Prompting in 2026', 'ai-engineering-paradigm-shift-2026',
      'AI Trends', '6 min read', 'Sep 24, 2026', 'Dr. Surya K.', 'Founder, HKSURYA Learning',
      'Why software engineering teams are shifting from prompt hacking to deterministic agent architectures, evaluation harnesses, and synthetic training data.',
      'Modern tech companies no longer seek engineers who merely know how to call an LLM API. The industry demand has matured into structural AI engineering: creating verifiable deterministic systems, robust vector databases, self-correcting agent chains, and parameter-efficient adapters. At HKSURYA Learning, our curriculum focuses on first-principles understanding so you can build robust systems that survive production traffic.',
      1,

      'blog-02', 'Architecting High-Throughput Applications with React 19 & Server Components', 'react-19-server-components-architecture',
      'Full Stack', '8 min read', 'Sep 18, 2026', 'Maya Chen', 'Creative Director & 3D Engineer',
      'A practical breakdown of how React 19 eliminates client-side waterfall bottlenecks and transforms frontend architectures.',
      'React 19 brings unified Server Actions, simplified form state handling, and seamless asset preloading. When combined with modern 3D graphics in WebGL, web applications can now deliver desktop-grade performance directly inside modern browsers. Here is how we structure our enterprise projects at HKSURYA Learning.',
      1,
    ]
  );

  // 17. Contact Messages
  run(
    `INSERT INTO contact_messages (id, name, email, topic, message, status, received_at) VALUES
     (?, ?, ?, ?, ?, 'unread', datetime('now', '-2 days'));`,
    ['msg-01', 'Michael Vance', 'mvance@acmecloud.com', 'Enterprise Team Training', 'Looking to upskill 25 cloud engineers on our squad to Kubernetes and Terraform. Can we schedule a syllabus discussion?']
  );

  // 18. Newsletter Subscribers
  run(
    `INSERT INTO newsletter_subscribers (id, email, active) VALUES
     (?, ?, 1),
     (?, ?, 1);`,
    ['sub-01', 'techlead@startup.io', 'sub-02', 'alex.chen@gmail.com']
  );

  // 19. Settings
  run(
    `INSERT INTO settings (key, value) VALUES
     ('siteName', 'HKSURYA LEARNING'),
     ('tagline', 'Learn Today. Build Tomorrow.'),
     ('supportEmail', 'admissions@hksuryalearning.com'),
     ('admissionsPhone', '+1 (800) 457-8792'),
     ('currency', 'USD ($)'),
     ('enrollmentsOpen', 'true'),
     ('maintenanceMode', 'false'),
     ('announcementBanner', 'Fall 2026 Cohort Admissions Now Open · 45% Limited Early Bird Tuition Available');`
  );
}
