export interface Course {
  id: string;
  title: string;
  category: 'Full Stack' | 'AI & ML' | 'Cloud & DevOps' | 'Cybersecurity' | 'Data Science';
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string;
  rating: number;
  reviewsCount: number;
  studentsCount: number;
  badge?: string;
  price: number;
  originalPrice: number;
  trainer: {
    name: string;
    role: string;
    company: string;
    avatar: string;
  };
  overview: string;
  highlights: string[];
  syllabus: {
    module: string;
    duration: string;
    lessons: string[];
  }[];
  skillsAcquired: string[];
  technologies: string[];
  certificateIncluded: boolean;
  nextCohortDate: string;
}

export interface Trainer {
  id: string;
  name: string;
  role: string;
  company: string;
  experience: string;
  studentsTaught: number;
  coursesCount: number;
  rating: number;
  avatar: string;
  bio: string;
  specialties: string[];
}

export interface LearningPath {
  id: string;
  title: string;
  duration: string;
  targetRole: string;
  avgSalary: string;
  description: string;
  color: string;
  coursesCount: number;
  steps: {
    step: number;
    title: string;
    desc: string;
    duration: string;
  }[];
}

export interface BlogPost {
  id: string;
  title: string;
  category: string;
  readTime: string;
  date: string;
  author: string;
  authorRole: string;
  excerpt: string;
  content: string;
}

export const COURSES: Course[] = [
  {
    id: 'fullstack-modern-web',
    title: 'Enterprise Full Stack Web Development (Next.js & TypeScript)',
    category: 'Full Stack',
    level: 'Intermediate',
    duration: '16 Weeks',
    rating: 4.95,
    reviewsCount: 1420,
    studentsCount: 8400,
    badge: 'Most Popular',
    price: 499,
    originalPrice: 899,
    trainer: {
      name: 'Dr. Surya K.',
      role: 'Principal Engineer & Founder',
      company: 'Ex-Google / HKSURYA Lead',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    },
    overview: 'Master production-grade modern web development from high-performance React 19 architecture to distributed microservices, Tailwind CSS, PostgreSQL, and scalable Docker deployments.',
    highlights: [
      'Build 5 production-ready enterprise applications',
      'Real-world CI/CD pipeline and cloud architecture',
      '1-on-1 weekly code reviews and architecture teardowns',
      'Guaranteed interview referrals upon graduation',
    ],
    syllabus: [
      {
        module: 'Module 1: Modern TypeScript & React 19 Architecture',
        duration: '3 Weeks',
        lessons: ['TypeScript Type Systems & Generics', 'React 19 Server Components & Actions', 'State Orchestration & Performance Profiling'],
      },
      {
        module: 'Module 2: Enterprise Backend & REST/GraphQL API Design',
        duration: '4 Weeks',
        lessons: ['Node.js & Express Microservice Architecture', 'PostgreSQL & Drizzle ORM Schema Modeling', 'Authentication & OAuth2 Security Patterns'],
      },
      {
        module: 'Module 3: Cloud Infrastructure & DevOps',
        duration: '4 Weeks',
        lessons: ['Docker Containerization & Multi-stage Builds', 'Kubernetes Cluster Orchestration', 'Automated CI/CD with GitHub Actions'],
      },
      {
        module: 'Module 4: Capstone Engineering & Production Launch',
        duration: '5 Weeks',
        lessons: ['High-throughput Distributed Systems Design', 'Load Testing & Monitoring with Grafana', 'Final Capstone Project Defense'],
      },
    ],
    skillsAcquired: ['React 19', 'Next.js', 'TypeScript', 'Node.js', 'PostgreSQL', 'Docker', 'AWS'],
    technologies: ['React', 'Next.js', 'Node.js', 'PostgreSQL', 'Docker', 'Tailwind CSS', 'Redis'],
    certificateIncluded: true,
    nextCohortDate: 'Starts October 15, 2026',
  },
  {
    id: 'applied-generative-ai',
    title: 'Applied Generative AI & Large Language Models Engineering',
    category: 'AI & ML',
    level: 'Advanced',
    duration: '14 Weeks',
    rating: 4.98,
    reviewsCount: 980,
    studentsCount: 4200,
    badge: 'Trending',
    price: 649,
    originalPrice: 1099,
    trainer: {
      name: 'Aditi Sharma',
      role: 'Staff AI Research Engineer',
      company: 'Ex-DeepMind / AI Fellow',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80',
    },
    overview: 'Design, fine-tune, and deploy state-of-the-art LLM architectures, RAG pipelines, autonomous multi-agent systems, and multimodal reasoning systems in production.',
    highlights: [
      'Advanced RAG with hybrid dense-sparse vector search',
      'Fine-tuning open weights models using LoRA / QLoRA',
      'Multi-agent orchestration with LangGraph and AutoGen',
      'Model safety, evaluation benchmarks, and guardrails',
    ],
    syllabus: [
      {
        module: 'Module 1: Transformer Foundations & Attention Mechanics',
        duration: '3 Weeks',
        lessons: ['Self-Attention & Multi-Head Attention Mathematics', 'Tokenization, Embeddings & Vector Spaces', 'Modern Architecture Comparison (Llama, Gemini, Mistral)'],
      },
      {
        module: 'Module 2: Advanced Retrieval-Augmented Generation (RAG)',
        duration: '4 Weeks',
        lessons: ['Chunking Strategies & Context Enrichment', 'Vector Databases & Hybrid BM25/Cosine Search', 'Reranking & HyDE Query Transformations'],
      },
      {
        module: 'Module 3: Fine-Tuning & Parameter Efficient Methods',
        duration: '3 Weeks',
        lessons: ['Supervised Fine-Tuning (SFT) Data Curation', 'LoRA & QLoRA Quantization Deep Dive', 'Direct Preference Optimization (DPO)'],
      },
      {
        module: 'Module 4: Autonomous Multi-Agent Frameworks',
        duration: '4 Weeks',
        lessons: ['Tool-calling & Function Calling Protocols', 'Memory Hierarchies & Agent Reflection Loops', 'Production Guardrails & Hallucination Prevention'],
      },
    ],
    skillsAcquired: ['PyTorch', 'Hugging Face', 'Vector DBs', 'RAG Architecture', 'Model Fine-tuning', 'Prompt Engineering'],
    technologies: ['Python', 'PyTorch', 'LangChain', 'ChromaDB', 'Transformers', 'FastAPI'],
    certificateIncluded: true,
    nextCohortDate: 'Starts October 22, 2026',
  },
  {
    id: 'cloud-devops-architect',
    title: 'Cloud Solutions Architect & Kubernetes DevOps Masterclass',
    category: 'Cloud & DevOps',
    level: 'Intermediate',
    duration: '12 Weeks',
    rating: 4.91,
    reviewsCount: 1100,
    studentsCount: 6100,
    badge: 'Industry Certified',
    price: 449,
    originalPrice: 799,
    trainer: {
      name: 'Rohan Mehra',
      role: 'Principal Cloud Architect',
      company: 'AWS APN Ambassador',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    },
    overview: 'Master multi-cloud design, Terraform Infrastructure as Code (IaC), zero-downtime Kubernetes clustering, Prometheus monitoring, and disaster recovery.',
    highlights: [
      'Terraform multi-environment IaC from scratch',
      'Production Kubernetes cluster administration & Helm',
      'Zero-trust network architecture and IAM governance',
      'AWS & GCP Solutions Architect exam readiness',
    ],
    syllabus: [
      {
        module: 'Module 1: Multi-Cloud Network Architecture',
        duration: '3 Weeks',
        lessons: ['VPC Peering, Transit Gateways & Subnetting', 'IAM Roles, Policies & Least Privilege Access', 'DNS & Global Load Balancing Strategy'],
      },
      {
        module: 'Module 2: Infrastructure as Code with Terraform',
        duration: '3 Weeks',
        lessons: ['Declarative Configuration & State File Locking', 'Reusable Terraform Modules & Workspaces', 'Automated Drift Detection in CI Pipelines'],
      },
      {
        module: 'Module 3: Enterprise Kubernetes (EKS & GKE)',
        duration: '3 Weeks',
        lessons: ['Pod Scheduling, Ingress & Service Meshes', 'Persistent Volumes & StatefulSets Storage', 'ArgoCD GitOps Deployment Strategies'],
      },
      {
        module: 'Module 4: Observability, SRE & Chaos Engineering',
        duration: '3 Weeks',
        lessons: ['Prometheus Metrics & Grafana Dashboards', 'Distributed Tracing with OpenTelemetry', 'SLO/SLI Error Budgets & Chaos Mesh Drills'],
      },
    ],
    skillsAcquired: ['Kubernetes', 'Terraform', 'AWS', 'GCP', 'Docker', 'CI/CD', 'Prometheus'],
    technologies: ['Kubernetes', 'Terraform', 'AWS', 'Helm', 'ArgoCD', 'Grafana', 'Linux'],
    certificateIncluded: true,
    nextCohortDate: 'Starts November 01, 2026',
  },
  {
    id: 'cybersecurity-offensive-defensive',
    title: 'Offensive & Defensive Cybersecurity Engineering',
    category: 'Cybersecurity',
    level: 'Intermediate',
    duration: '14 Weeks',
    rating: 4.93,
    reviewsCount: 750,
    studentsCount: 3800,
    badge: 'High Demand',
    price: 529,
    originalPrice: 949,
    trainer: {
      name: 'Elena Rostova',
      role: 'Lead Security Consultant',
      company: 'Ex-FireEye / DefCon Speaker',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
    },
    overview: 'Hands-on ethical hacking, penetration testing labs, SOC incident response, reverse engineering, and threat hunting in enterprise cyber ranges.',
    highlights: [
      'Interactive CTF labs in simulated corporate networks',
      'OWASP Top 10 web application exploit deep dives',
      'SIEM configuration (Splunk, Elastic SIEM) and threat detection',
      'OSCP & CEH certification alignment',
    ],
    syllabus: [
      {
        module: 'Module 1: Network Protocols & Reconnaissance',
        duration: '3 Weeks',
        lessons: ['OSINT & Active Network Enumeration', 'Packet Analysis with Wireshark & tcpdump', 'Port Scanning, Banner Grabbing & Vulnerability Profiling'],
      },
      {
        module: 'Module 2: Web Application Penetration Testing',
        duration: '4 Weeks',
        lessons: ['SQL Injection, XSS, CSRF & Server-Side Request Forgery', 'Authentication Bypasses & JWT Vulnerabilities', 'Burp Suite Pro Automation & Exploit Scripting'],
      },
      {
        module: 'Module 3: Internal Network Pivoting & Active Directory',
        duration: '4 Weeks',
        lessons: ['Kerberos Attacks (Kerberoasting, AS-REP Roasting)', 'Privilege Escalation in Linux & Windows', 'Lateral Movement & Pass-the-Hash Techniques'],
      },
      {
        module: 'Module 4: Blue Team Defense & Incident Response',
        duration: '3 Weeks',
        lessons: ['Splunk Detection Rules & Sigma Queries', 'Forensic Memory Dump Analysis with Volatility', 'Ransomware Containment & Incident Post-Mortems'],
      },
    ],
    skillsAcquired: ['Penetration Testing', 'SIEM', 'Active Directory Security', 'Wireshark', 'Burp Suite', 'Python Scripting'],
    technologies: ['Kali Linux', 'Burp Suite', 'Metasploit', 'Splunk', 'Wireshark', 'Python'],
    certificateIncluded: true,
    nextCohortDate: 'Starts November 08, 2026',
  },
  {
    id: 'data-engineering-spark',
    title: 'Modern Data Engineering & Distributed Analytics',
    category: 'Data Science',
    level: 'Advanced',
    duration: '12 Weeks',
    rating: 4.89,
    reviewsCount: 620,
    studentsCount: 3100,
    badge: 'Career Accelerator',
    price: 479,
    originalPrice: 849,
    trainer: {
      name: 'Vikram Joshi',
      role: 'Staff Data Architect',
      company: 'Ex-Uber / Apache Contributor',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    },
    overview: 'Design petabyte-scale data pipelines using Apache Spark, Kafka event streaming, Snowflake/BigQuery lakehouses, and dbt data transformations.',
    highlights: [
      'Real-time streaming pipelines with Apache Kafka & Flink',
      'Medallion architecture on Snowflake & Databricks Lakehouse',
      'dbt data modeling and automated data quality tests',
      'Airflow DAG orchestration and data observability',
    ],
    syllabus: [
      {
        module: 'Module 1: Distributed Storage & SQL Optimization',
        duration: '3 Weeks',
        lessons: ['Columnar Storage Formats (Parquet, ORC, Avro)', 'Advanced SQL Window Functions & Partitioning', 'Lakehouse Architectures (Delta Lake, Apache Iceberg)'],
      },
      {
        module: 'Module 2: Apache Spark Processing Engine',
        duration: '3 Weeks',
        lessons: ['Spark DataFrames & Catalyst Optimizer', 'Broadcast Joins & Skew Optimization', 'PySpark Performance Tuning & Garbage Collection'],
      },
      {
        module: 'Module 3: Streaming Systems with Apache Kafka',
        duration: '3 Weeks',
        lessons: ['Kafka Brokers, Topics & Partition Mechanics', 'Exactly-Once Semantics & Consumer Group Rebalancing', 'Spark Structured Streaming with Real-Time Sinks'],
      },
      {
        module: 'Module 4: Orchestration & Data Quality with dbt',
        duration: '3 Weeks',
        lessons: ['Airflow Directed Acyclic Graphs (DAGs)', 'dbt Semantic Layer & Jinja Templating', 'Great Expectations for Data Contract Enforcement'],
      },
    ],
    skillsAcquired: ['Apache Spark', 'Kafka', 'dbt', 'Snowflake', 'Airflow', 'Python', 'SQL'],
    technologies: ['Apache Spark', 'Apache Kafka', 'dbt', 'Snowflake', 'Airflow', 'Databricks'],
    certificateIncluded: true,
    nextCohortDate: 'Starts November 15, 2026',
  },
  {
    id: '3d-web-graphics-threejs',
    title: 'Creative 3D Web Graphics, WebGL & Three.js Studio',
    category: 'Full Stack',
    level: 'Intermediate',
    duration: '10 Weeks',
    rating: 4.97,
    reviewsCount: 540,
    studentsCount: 2900,
    badge: 'Creative Tech',
    price: 429,
    originalPrice: 749,
    trainer: {
      name: 'Maya Chen',
      role: 'Creative Director & 3D Engineer',
      company: 'Awwwards Judge / Studio Founder',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
    },
    overview: 'Build interactive 3D web experiences, custom GLSL shaders, camera choreography, physics simulation, and immersive storytelling with React Three Fiber.',
    highlights: [
      'Write custom vertex and fragment GLSL shaders',
      'Realistic PBR lighting, post-processing blooms and reflections',
      'Optimizing 3D assets for 60fps mobile execution',
      'Build 4 award-winning portfolio spatial sites',
    ],
    syllabus: [
      {
        module: 'Module 1: Three.js Coordinates, Meshes & Materials',
        duration: '2 Weeks',
        lessons: ['Vector Math, Matrices & Quaternions', 'PBR Materials, Roughness & Metalness Calibration', 'HDRI Environment Maps & Studio Lighting'],
      },
      {
        module: 'Module 2: React Three Fiber & Drei Ecosystem',
        duration: '3 Weeks',
        lessons: ['R3F Component Lifecycles & useFrame Hooks', 'Camera Choreography & Scroll Parallax Links', 'GLTF/GLB Asset Optimization & Compression'],
      },
      {
        module: 'Module 3: GLSL Shaders & Post-Processing FX',
        duration: '3 Weeks',
        lessons: ['Vertex Displacement & Sine Wave Ripples', 'Fragment Shaders, Perlin Noise & Glow FX', 'Selective Bloom, Vignette & Depth of Field'],
      },
      {
        module: 'Module 4: Performance Profiling & Launch',
        duration: '2 Weeks',
        lessons: ['Draw Call Batching & InstancedMesh', 'Memory Leak Prevention & WebGL Context Safety', 'Final Interactive 3D Showcase Deployment'],
      },
    ],
    skillsAcquired: ['Three.js', 'React Three Fiber', 'GLSL Shaders', 'WebGL', 'Blender Optimization', 'TypeScript'],
    technologies: ['Three.js', 'React Three Fiber', 'Drei', 'GLSL', 'Vite', 'Tailwind CSS'],
    certificateIncluded: true,
    nextCohortDate: 'Starts October 28, 2026',
  },
];

export const TRAINERS: Trainer[] = [
  {
    id: 'surya-k',
    name: 'Dr. Surya K.',
    role: 'Founder & Principal Engineering Fellow',
    company: 'Ex-Google / HKSURYA Lead',
    experience: '16+ Years Experience',
    studentsTaught: 24500,
    coursesCount: 6,
    rating: 4.96,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    bio: 'Pioneer in distributed systems and modern web architecture. Trained over 24,000 engineers who now work across Google, Microsoft, Amazon, and top startups globally.',
    specialties: ['Distributed Systems', 'React 19 & Next.js', 'TypeScript Architecture', 'System Design'],
  },
  {
    id: 'aditi-sharma',
    name: 'Aditi Sharma',
    role: 'Staff AI Research Scientist',
    company: 'Ex-DeepMind / AI Fellow',
    experience: '11+ Years Experience',
    studentsTaught: 18200,
    coursesCount: 4,
    rating: 4.98,
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80',
    bio: 'Specialist in generative models, parameter-efficient fine-tuning, and agentic workflows. Authored 9 IEEE papers on transformer efficiency.',
    specialties: ['Large Language Models', 'PyTorch', 'Autonomous Agents', 'RAG Optimization'],
  },
  {
    id: 'rohan-mehra',
    name: 'Rohan Mehra',
    role: 'Principal Cloud Architect',
    company: 'AWS APN Ambassador / Cloud Lead',
    experience: '13+ Years Experience',
    studentsTaught: 19800,
    coursesCount: 5,
    rating: 4.92,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    bio: 'Architected cloud backbones handling 100M+ daily transactions. Dedicated to teaching practical Infrastructure as Code and zero-downtime Kubernetes.',
    specialties: ['Kubernetes', 'Multi-Cloud Architecture', 'Terraform', 'Site Reliability'],
  },
  {
    id: 'elena-rostova',
    name: 'Elena Rostova',
    role: 'Lead Security Consultant',
    company: 'Ex-FireEye / DefCon Speaker',
    experience: '12+ Years Experience',
    studentsTaught: 14600,
    coursesCount: 3,
    rating: 4.94,
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
    bio: 'Seasoned ethical hacker, red team operator, and blue team consultant. Has secured infrastructure for FinTech unicorns and Fortune 500 banks.',
    specialties: ['Red Team Pentesting', 'Incident Response', 'Active Directory Defense', 'Threat Hunting'],
  },
];

export const LEARNING_PATHS: LearningPath[] = [
  {
    id: 'path-fullstack',
    title: 'Full Stack Engineering Track',
    duration: '6 Months (24 Weeks)',
    targetRole: 'Senior Full Stack Engineer',
    avgSalary: '$145,000 / year',
    description: 'From modern frontend foundations to high-throughput cloud backends and DevOps deployment.',
    color: '#00D2FF',
    coursesCount: 4,
    steps: [
      { step: 1, title: 'TypeScript & React Architecture', desc: 'Master deep component systems, closures, state machines, and hooks.', duration: '6 Weeks' },
      { step: 2, title: 'Backend APIs & Database Design', desc: 'Build scalable microservices with Node.js, Express, and PostgreSQL.', duration: '6 Weeks' },
      { step: 3, title: 'Cloud Infrastructure & CI/CD', desc: 'Deploy with Docker, Kubernetes, and automated test pipelines.', duration: '6 Weeks' },
      { step: 4, title: 'Capstone & System Design Defense', desc: 'Architect a 100k-concurrent-user real-world distributed web app.', duration: '6 Weeks' },
    ],
  },
  {
    id: 'path-ai-ml',
    title: 'Artificial Intelligence & LLM Track',
    duration: '7 Months (28 Weeks)',
    targetRole: 'Staff AI / Machine Learning Engineer',
    avgSalary: '$168,000 / year',
    description: 'Transform into an industry-ready AI engineer capable of training, fine-tuning, and deploying intelligent agent systems.',
    color: '#FF7A00',
    coursesCount: 5,
    steps: [
      { step: 1, title: 'Deep Learning & PyTorch Core', desc: 'Neural network math, backpropagation, and loss landscape optimization.', duration: '7 Weeks' },
      { step: 2, title: 'Transformer & Attention Systems', desc: 'Dissect Llama, Gemini, and Mistral architectures line by line.', duration: '7 Weeks' },
      { step: 3, title: 'RAG & Vector Knowledge Bases', desc: 'Hybrid retrieval, semantic embeddings, and context reranking engines.', duration: '7 Weeks' },
      { step: 4, title: 'Autonomous Multi-Agent Deployments', desc: 'Tool calling, memory retention, evaluation frameworks, and guardrails.', duration: '7 Weeks' },
    ],
  },
  {
    id: 'path-cloud',
    title: 'Cloud & Kubernetes Solutions Track',
    duration: '5 Months (20 Weeks)',
    targetRole: 'Lead Cloud Architect / DevOps Lead',
    avgSalary: '$152,000 / year',
    description: 'Master enterprise multi-cloud engineering, immutable infrastructure, and zero-trust security postures.',
    color: '#38BDF8',
    coursesCount: 3,
    steps: [
      { step: 1, title: 'Networking, IAM & Cloud Security', desc: 'VPC design, subnet routing, least privilege IAM policies.', duration: '5 Weeks' },
      { step: 2, title: 'Infrastructure as Code (Terraform)', desc: 'Modular infrastructure provisioning and drift management.', duration: '5 Weeks' },
      { step: 3, title: 'Kubernetes Administration', desc: 'Cluster networking, Ingress controllers, Helm charts, and GitOps.', duration: '5 Weeks' },
      { step: 4, title: 'Observability & SRE Reliability', desc: 'Prometheus, Grafana, OpenTelemetry, and disaster recovery runs.', duration: '5 Weeks' },
    ],
  },
];

export const BLOG_POSTS: BlogPost[] = [
  {
    id: 'future-of-ai-engineering-2026',
    title: 'The AI Engineering Paradigm Shift: Beyond Simple Prompting in 2026',
    category: 'AI Trends',
    readTime: '6 min read',
    date: 'Sep 24, 2026',
    author: 'Dr. Surya K.',
    authorRole: 'Founder, HKSURYA Learning',
    excerpt: 'Why software engineering teams are shifting from prompt hacking to deterministic agent architectures, evaluation harnesses, and synthetic training data.',
    content: `Modern tech companies no longer seek engineers who merely know how to call an LLM API. The industry demand has matured into structural AI engineering: creating verifiable deterministic systems, robust vector databases, self-correcting agent chains, and parameter-efficient adapters. At HKSURYA Learning, our curriculum focuses on first-principles understanding so you can build robust systems that survive production traffic.`,
  },
  {
    id: 'react-19-server-components-scale',
    title: 'Architecting High-Throughput Applications with React 19 & Server Components',
    category: 'Full Stack',
    readTime: '8 min read',
    date: 'Sep 18, 2026',
    author: 'Maya Chen',
    authorRole: 'Creative Director & 3D Engineer',
    excerpt: 'A practical breakdown of how React 19 eliminates client-side waterfall bottlenecks and transforms frontend architectures.',
    content: `React 19 brings unified Server Actions, simplified form state handling, and seamless asset preloading. When combined with modern 3D graphics in WebGL, web applications can now deliver desktop-grade performance directly inside modern browsers. Here is how we structure our enterprise projects at HKSURYA Learning.`,
  },
  {
    id: 'zero-trust-cloud-architecture',
    title: 'Zero-Trust Cloud Architecture: How Modern Teams Secure Kubernetes',
    category: 'Cloud & Security',
    readTime: '7 min read',
    date: 'Sep 11, 2026',
    author: 'Rohan Mehra',
    authorRole: 'Principal Cloud Architect',
    excerpt: 'Why traditional perimeter security has failed, and how mutual TLS (mTLS) and identity-based policies provide true defense in depth.',
    content: `As Kubernetes clusters stretch across multi-cloud regions, the notion of an "internal safe network" has evaporated. Security must follow identity, workload attestation, and cryptographically verified policies. In this guide, we examine service meshes and automated certificate rotation.`,
  },
];
