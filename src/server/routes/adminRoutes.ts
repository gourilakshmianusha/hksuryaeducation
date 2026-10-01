import { Router, Response } from 'express';
import { query, queryOne, run } from '../db';
import { requireAdmin, AuthenticatedRequest } from '../auth';

export const adminRouter = Router();

// Apply requireAdmin to all admin endpoints
adminRouter.use(requireAdmin);

// ================= 1. DASHBOARD =================
adminRouter.get('/dashboard', (req: AuthenticatedRequest, res: Response) => {
  const totalStudents = queryOne<{ count: number }>("SELECT count(*) as count FROM users WHERE role = 'student'")?.count || 0;
  const totalCourses = queryOne<{ count: number }>('SELECT count(*) as count FROM courses')?.count || 0;
  const totalEnrollments = queryOne<{ count: number }>('SELECT count(*) as count FROM enrollments')?.count || 0;
  const totalRevenue = queryOne<{ total: number }>("SELECT COALESCE(SUM(amount), 0) as total FROM payments WHERE status = 'succeeded'")?.total || 0;
  const pendingInquiries = queryOne<{ count: number }>("SELECT count(*) as count FROM contact_messages WHERE status = 'unread'")?.count || 0;
  const issuedCertificates = queryOne<{ count: number }>('SELECT count(*) as count FROM certificates')?.count || 0;

  const recentEnrollments = query<any>(
    `SELECT e.id, e.status, e.progress_percentage as progressPercentage, e.enrolled_at as enrolledAt,
            u.name as studentName, u.email as studentEmail, c.title as courseTitle
     FROM enrollments e
     JOIN users u ON e.student_id = u.id
     JOIN courses c ON e.course_id = c.id
     ORDER BY e.enrolled_at DESC
     LIMIT 8`
  );

  const recentPayments = query<any>(
    `SELECT p.id, p.amount, p.currency, p.status, p.payment_method as paymentMethod, p.created_at as createdAt,
            u.name as studentName, c.title as courseTitle
     FROM payments p
     JOIN users u ON p.student_id = u.id
     JOIN courses c ON p.course_id = c.id
     ORDER BY p.created_at DESC
     LIMIT 8`
  );

  const categoriesDistribution = query<any>(
    `SELECT cat.name, COUNT(c.id) as coursesCount
     FROM categories cat
     LEFT JOIN courses c ON cat.id = c.category_id
     GROUP BY cat.id, cat.name`
  );

  return res.json({
    kpis: {
      totalRevenue,
      totalStudents,
      totalCourses,
      totalEnrollments,
      pendingInquiries,
      issuedCertificates,
    },
    recentEnrollments,
    recentPayments,
    categoriesDistribution,
  });
});

// ================= 2. COURSES CRUD =================
adminRouter.get('/courses', (req: AuthenticatedRequest, res: Response) => {
  const courses = query<any>(
    `SELECT c.*, cat.name as category, t.name as trainerName
     FROM courses c
     JOIN categories cat ON c.category_id = cat.id
     JOIN trainers t ON c.trainer_id = t.id
     ORDER BY c.created_at DESC`
  );

  return res.json(
    courses.map((c) => ({
      ...c,
      price: c.price,
      originalPrice: c.original_price,
      enrolledCount: c.enrolled_count,
      published: Boolean(c.published),
      featured: Boolean(c.featured),
      highlights: c.highlights_json ? JSON.parse(c.highlights_json) : [],
      skillsAcquired: c.skills_json ? JSON.parse(c.skills_json) : [],
      technologies: c.technologies_json ? JSON.parse(c.technologies_json) : [],
      syllabus: c.syllabus_json ? JSON.parse(c.syllabus_json) : [],
    }))
  );
});

adminRouter.post('/courses', (req: AuthenticatedRequest, res: Response) => {
  const data = req.body;
  if (!data.title || !data.categoryId) {
    return res.status(400).json({ error: 'Title and categoryId are required' });
  }

  const id = `course-${Date.now()}`;
  const slug = data.slug || data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const trainerId = data.trainerId || queryOne<{ id: string }>('SELECT id FROM trainers LIMIT 1')?.id || 'trainer-surya';

  run(
    `INSERT INTO courses (
      id, title, slug, category_id, level, duration, price, original_price, trainer_id,
      overview, highlights_json, skills_json, technologies_json, syllabus_json,
      certificate_included, next_cohort_date, featured, published, enrolled_count
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0)`,
    [
      id,
      data.title,
      slug,
      data.categoryId,
      data.level || 'Intermediate',
      data.duration || '12 Weeks',
      Number(data.price) || 499,
      Number(data.originalPrice) || 899,
      trainerId,
      data.overview || '',
      JSON.stringify(data.highlights || ['Enterprise project architecture']),
      JSON.stringify(data.skillsAcquired || ['Full Stack']),
      JSON.stringify(data.technologies || ['TypeScript']),
      JSON.stringify(data.syllabus || []),
      data.certificateIncluded !== false ? 1 : 0,
      data.nextCohortDate || 'Upcoming Cohort',
      data.featured ? 1 : 0,
      data.published !== false ? 1 : 0,
    ]
  );

  const created = queryOne('SELECT * FROM courses WHERE id = ?', [id]);
  return res.status(201).json(created);
});

adminRouter.put('/courses/:id', (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const data = req.body;

  const current = queryOne<any>('SELECT * FROM courses WHERE id = ?', [id]);
  if (!current) return res.status(404).json({ error: 'Course not found' });

  run(
    `UPDATE courses SET
      title = ?, level = ?, duration = ?, price = ?, original_price = ?,
      overview = ?, category_id = ?, featured = ?, published = ?, updated_at = datetime('now')
     WHERE id = ?`,
    [
      data.title || current.title,
      data.level || current.level,
      data.duration || current.duration,
      Number(data.price ?? current.price),
      Number(data.originalPrice ?? current.original_price),
      data.overview ?? current.overview,
      data.categoryId || current.category_id,
      data.featured ? 1 : 0,
      data.published ? 1 : 0,
      id,
    ]
  );

  return res.json({ message: 'Course updated successfully', id });
});

adminRouter.delete('/courses/:id', (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  run('DELETE FROM courses WHERE id = ?', [id]);
  return res.json({ message: 'Course deleted successfully' });
});

// ================= 3. CATEGORIES CRUD =================
adminRouter.get('/categories', (req: AuthenticatedRequest, res: Response) => {
  const categories = query<any>('SELECT * FROM categories ORDER BY name ASC');
  return res.json(categories);
});

adminRouter.post('/categories', (req: AuthenticatedRequest, res: Response) => {
  const { name, description } = req.body;
  if (!name) return res.status(400).json({ error: 'Category name is required' });

  const id = `cat-${Date.now()}`;
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  run('INSERT INTO categories (id, name, slug, description) VALUES (?, ?, ?, ?)', [
    id,
    name.trim(),
    slug,
    description || '',
  ]);

  return res.status(201).json({ id, name, slug, description });
});

adminRouter.put('/categories/:id', (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const { name, description } = req.body;

  run('UPDATE categories SET name = ?, description = ?, updated_at = datetime("now") WHERE id = ?', [
    name,
    description,
    id,
  ]);

  return res.json({ message: 'Category updated', id });
});

adminRouter.delete('/categories/:id', (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  run('DELETE FROM categories WHERE id = ?', [id]);
  return res.json({ message: 'Category deleted' });
});

// ================= 4. LEARNING PATHS CRUD =================
adminRouter.get('/learning-paths', (req: AuthenticatedRequest, res: Response) => {
  const paths = query<any>('SELECT * FROM learning_paths ORDER BY created_at ASC');
  return res.json(
    paths.map((p) => ({
      ...p,
      avgSalary: p.avg_salary,
      targetRole: p.target_role,
      steps: p.steps_json ? JSON.parse(p.steps_json) : [],
    }))
  );
});

adminRouter.post('/learning-paths', (req: AuthenticatedRequest, res: Response) => {
  const data = req.body;
  if (!data.title || !data.targetRole) {
    return res.status(400).json({ error: 'Title and target role required' });
  }

  const id = `path-${Date.now()}`;
  const slug = data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');

  run(
    `INSERT INTO learning_paths (id, title, slug, duration, target_role, avg_salary, description, color, steps_json)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      id,
      data.title,
      slug,
      data.duration || '6 Months',
      data.targetRole,
      data.avgSalary || '$135,000 / year',
      data.description || '',
      data.color || '#00D2FF',
      JSON.stringify(data.steps || []),
    ]
  );

  return res.status(201).json({ id, title: data.title });
});

adminRouter.put('/learning-paths/:id', (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const data = req.body;

  run(
    `UPDATE learning_paths SET title = ?, duration = ?, target_role = ?, avg_salary = ?, description = ?, updated_at = datetime('now')
     WHERE id = ?`,
    [data.title, data.duration, data.targetRole, data.avgSalary, data.description, id]
  );

  return res.json({ message: 'Path updated', id });
});

adminRouter.delete('/learning-paths/:id', (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  run('DELETE FROM learning_paths WHERE id = ?', [id]);
  return res.json({ message: 'Path deleted' });
});

// ================= 5. LESSONS CRUD =================
adminRouter.get('/lessons', (req: AuthenticatedRequest, res: Response) => {
  const { courseId } = req.query;
  let sql = 'SELECT * FROM lessons';
  const params: any[] = [];

  if (courseId) {
    sql += ' WHERE course_id = ?';
    params.push(String(courseId));
  }
  sql += ' ORDER BY course_id, order_index ASC';

  const rows = query<any>(sql, params);
  return res.json(
    rows.map((l) => ({
      ...l,
      courseId: l.course_id,
      moduleTitle: l.module_title,
      orderIndex: l.order_index,
      videoUrl: l.video_url,
      resources: l.resources_json ? JSON.parse(l.resources_json) : [],
    }))
  );
});

adminRouter.post('/lessons', (req: AuthenticatedRequest, res: Response) => {
  const data = req.body;
  if (!data.courseId || !data.title) {
    return res.status(400).json({ error: 'Course ID and title required' });
  }

  const id = `lesson-${Date.now()}`;
  run(
    `INSERT INTO lessons (id, course_id, module_title, title, duration, video_url, content, order_index, resources_json)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      id,
      data.courseId,
      data.moduleTitle || 'Core Module',
      data.title,
      data.duration || '40 mins',
      data.videoUrl || '',
      data.content || '',
      Number(data.orderIndex) || 1,
      JSON.stringify(data.resources || []),
    ]
  );

  return res.status(201).json({ id, title: data.title });
});

adminRouter.put('/lessons/:id', (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const data = req.body;

  run(
    `UPDATE lessons SET title = ?, module_title = ?, duration = ?, video_url = ?, content = ?, order_index = ?, updated_at = datetime('now')
     WHERE id = ?`,
    [data.title, data.moduleTitle, data.duration, data.videoUrl, data.content, Number(data.orderIndex) || 1, id]
  );

  return res.json({ message: 'Lesson updated', id });
});

adminRouter.delete('/lessons/:id', (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  run('DELETE FROM lessons WHERE id = ?', [id]);
  return res.json({ message: 'Lesson deleted' });
});

// ================= 6. STUDENTS MANAGEMENT =================
adminRouter.get('/students', (req: AuthenticatedRequest, res: Response) => {
  const students = query<any>(
    `SELECT u.id, u.name, u.email, u.status, u.bio, u.created_at as createdAt,
            s.phone, s.github_url as githubUrl, s.target_role as targetRole,
            (SELECT COUNT(*) FROM enrollments e WHERE e.student_id = u.id) as enrollmentsCount,
            (SELECT COUNT(*) FROM certificates c WHERE c.student_id = u.id) as certificatesCount
     FROM users u
     LEFT JOIN students s ON u.id = s.user_id
     WHERE u.role = 'student'
     ORDER BY u.created_at DESC`
  );

  return res.json(students);
});

adminRouter.put('/students/:id/status', (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;

  if (status !== 'active' && status !== 'suspended') {
    return res.status(400).json({ error: 'Invalid status' });
  }

  run('UPDATE users SET status = ?, updated_at = datetime("now") WHERE id = ?', [status, id]);
  return res.json({ message: `Student status updated to ${status}` });
});

adminRouter.post('/students/enroll-manual', (req: AuthenticatedRequest, res: Response) => {
  const { studentId, courseId } = req.body;

  const existing = queryOne('SELECT id FROM enrollments WHERE student_id = ? AND course_id = ?', [
    studentId,
    courseId,
  ]);
  if (existing) {
    return res.status(400).json({ error: 'Student already enrolled in this course' });
  }

  const id = `enroll-${Date.now()}`;
  run(
    `INSERT INTO enrollments (id, student_id, course_id, enrolled_at, status, progress_percentage)
     VALUES (?, ?, ?, datetime('now'), 'active', 0)`,
    [id, studentId, courseId]
  );
  run('UPDATE courses SET enrolled_count = enrolled_count + 1 WHERE id = ?', [courseId]);

  return res.status(201).json({ message: 'Student successfully enrolled manually', id });
});

// ================= 7. TRAINERS CRUD =================
adminRouter.get('/trainers', (req: AuthenticatedRequest, res: Response) => {
  const trainers = query<any>('SELECT * FROM trainers ORDER BY name ASC');
  return res.json(
    trainers.map((t) => ({
      ...t,
      studentsTaught: t.students_taught,
      specialties: t.specialties_json ? JSON.parse(t.specialties_json) : [],
    }))
  );
});

adminRouter.post('/trainers', (req: AuthenticatedRequest, res: Response) => {
  const data = req.body;
  if (!data.name || !data.email) {
    return res.status(400).json({ error: 'Name and email are required' });
  }

  const id = `trainer-${Date.now()}`;
  run(
    `INSERT INTO trainers (id, name, email, role, company, experience, bio, avatar, specialties_json)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      id,
      data.name,
      data.email,
      data.role || 'Staff Instructor',
      data.company || 'HKSURYA Learning',
      data.experience || '8+ Years',
      data.bio || '',
      data.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      JSON.stringify(data.specialties || ['Full Stack']),
    ]
  );

  return res.status(201).json({ id, name: data.name });
});

adminRouter.put('/trainers/:id', (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const data = req.body;

  run(
    `UPDATE trainers SET name = ?, email = ?, role = ?, company = ?, experience = ?, bio = ?, updated_at = datetime('now')
     WHERE id = ?`,
    [data.name, data.email, data.role, data.company, data.experience, data.bio, id]
  );

  return res.json({ message: 'Trainer updated', id });
});

adminRouter.delete('/trainers/:id', (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  run('DELETE FROM trainers WHERE id = ?', [id]);
  return res.json({ message: 'Trainer deleted' });
});

// ================= 8. ENROLLMENTS & PAYMENTS =================
adminRouter.get('/enrollments', (req: AuthenticatedRequest, res: Response) => {
  const list = query<any>(
    `SELECT e.*, u.name as studentName, u.email as studentEmail, c.title as courseTitle
     FROM enrollments e
     JOIN users u ON e.student_id = u.id
     JOIN courses c ON e.course_id = c.id
     ORDER BY e.enrolled_at DESC`
  );
  return res.json(list);
});

adminRouter.put('/enrollments/:id', (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const { status, progressPercentage } = req.body;

  run(
    `UPDATE enrollments SET
       status = COALESCE(?, status),
       progress_percentage = COALESCE(?, progress_percentage),
       last_accessed_at = datetime('now')
     WHERE id = ?`,
    [status, progressPercentage, id]
  );

  return res.json({ message: 'Enrollment updated', id });
});

adminRouter.delete('/enrollments/:id', (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  run('DELETE FROM enrollments WHERE id = ?', [id]);
  return res.json({ message: 'Enrollment deleted' });
});

adminRouter.get('/payments', (req: AuthenticatedRequest, res: Response) => {
  const payments = query<any>(
    `SELECT p.*, u.name as studentName, u.email as studentEmail, c.title as courseTitle
     FROM payments p
     JOIN users u ON p.student_id = u.id
     JOIN courses c ON p.course_id = c.id
     ORDER BY p.created_at DESC`
  );
  return res.json(payments);
});

// ================= 9. TESTIMONIALS CRUD =================
adminRouter.get('/testimonials', (req: AuthenticatedRequest, res: Response) => {
  const list = query<any>('SELECT * FROM testimonials ORDER BY created_at DESC');
  return res.json(list);
});

adminRouter.post('/testimonials', (req: AuthenticatedRequest, res: Response) => {
  const data = req.body;
  if (!data.name || !data.text) return res.status(400).json({ error: 'Name and text required' });

  const id = `test-${Date.now()}`;
  run(
    `INSERT INTO testimonials (id, name, role, company, avatar, text, rating, course_id, published)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      id,
      data.name,
      data.role || 'Software Engineer',
      data.company || 'Tech Leader',
      data.avatar || '',
      data.text,
      Number(data.rating) || 5,
      data.courseId || null,
      data.published !== false ? 1 : 0,
    ]
  );

  return res.status(201).json({ id, name: data.name });
});

adminRouter.delete('/testimonials/:id', (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  run('DELETE FROM testimonials WHERE id = ?', [id]);
  return res.json({ message: 'Testimonial deleted' });
});

// ================= 10. BLOG CRUD =================
adminRouter.get('/blog', (req: AuthenticatedRequest, res: Response) => {
  const posts = query<any>('SELECT * FROM blogs ORDER BY created_at DESC');
  return res.json(posts);
});

adminRouter.post('/blog', (req: AuthenticatedRequest, res: Response) => {
  const data = req.body;
  if (!data.title || !data.content) {
    return res.status(400).json({ error: 'Title and content required' });
  }

  const id = `blog-${Date.now()}`;
  const slug = data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');

  run(
    `INSERT INTO blogs (id, title, slug, category, read_time, date, author, author_role, excerpt, content, published)
     VALUES (?, ?, ?, ?, ?, date('now'), ?, ?, ?, ?, ?)`,
    [
      id,
      data.title,
      slug,
      data.category || 'Engineering',
      data.readTime || '6 min read',
      data.author || 'Dr. Surya K.',
      data.authorRole || 'Founder, HKSURYA Learning',
      data.excerpt || data.content.substring(0, 140) + '...',
      data.content,
      data.published !== false ? 1 : 0,
    ]
  );

  return res.status(201).json({ id, title: data.title });
});

adminRouter.put('/blog/:id', (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const data = req.body;

  run(
    `UPDATE blogs SET title = ?, category = ?, content = ?, excerpt = ?, published = ?, updated_at = datetime('now')
     WHERE id = ?`,
    [data.title, data.category, data.content, data.excerpt, data.published ? 1 : 0, id]
  );

  return res.json({ message: 'Article updated', id });
});

adminRouter.delete('/blog/:id', (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  run('DELETE FROM blogs WHERE id = ?', [id]);
  return res.json({ message: 'Article deleted' });
});

// ================= 11. CERTIFICATES =================
adminRouter.get('/certificates', (req: AuthenticatedRequest, res: Response) => {
  const certs = query<any>(
    `SELECT cert.*, u.name as studentName, u.email as studentEmail, c.title as courseTitle
     FROM certificates cert
     JOIN users u ON cert.student_id = u.id
     JOIN courses c ON cert.course_id = c.id
     ORDER BY cert.created_at DESC`
  );
  return res.json(certs);
});

adminRouter.post('/certificates/issue', (req: AuthenticatedRequest, res: Response) => {
  const { studentId, courseId, grade = 'Distinction (95%)' } = req.body;

  const id = `cert-${Date.now()}`;
  const code = `HKS-2026-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

  run(
    `INSERT INTO certificates (id, certificate_code, student_id, course_id, issue_date, grade, verified)
     VALUES (?, ?, ?, ?, date('now'), ?, 1)`,
    [id, code, studentId, courseId, grade]
  );

  return res.status(201).json({ id, certificateCode: code });
});

adminRouter.delete('/certificates/:id', (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  run('DELETE FROM certificates WHERE id = ?', [id]);
  return res.json({ message: 'Certificate revoked' });
});

// ================= 12. CONTACT INBOX =================
adminRouter.get('/contact', (req: AuthenticatedRequest, res: Response) => {
  const msgs = query<any>('SELECT * FROM contact_messages ORDER BY received_at DESC');
  return res.json(msgs);
});

adminRouter.put('/contact/:id/status', (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const { status, replyNote } = req.body;

  run('UPDATE contact_messages SET status = ?, reply_note = ? WHERE id = ?', [status, replyNote, id]);
  return res.json({ message: 'Status updated', id });
});

adminRouter.delete('/contact/:id', (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  run('DELETE FROM contact_messages WHERE id = ?', [id]);
  return res.json({ message: 'Inquiry deleted' });
});

// ================= 13. NEWSLETTER =================
adminRouter.get('/newsletter', (req: AuthenticatedRequest, res: Response) => {
  const subs = query<any>('SELECT * FROM newsletter_subscribers ORDER BY subscribed_at DESC');
  return res.json(subs);
});

adminRouter.delete('/newsletter/:id', (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  run('DELETE FROM newsletter_subscribers WHERE id = ?', [id]);
  return res.json({ message: 'Subscriber removed' });
});

// ================= 14. SETTINGS =================
adminRouter.get('/settings', (req: AuthenticatedRequest, res: Response) => {
  const settingsRows = query<{ key: string; value: string }>('SELECT key, value FROM settings');
  const settingsMap: any = {};
  settingsRows.forEach((r) => {
    settingsMap[r.key] = r.value;
  });
  return res.json(settingsMap);
});

adminRouter.put('/settings', (req: AuthenticatedRequest, res: Response) => {
  const updates = req.body;
  Object.keys(updates).forEach((k) => {
    run(
      `INSERT INTO settings (key, value, updated_at) VALUES (?, ?, datetime('now'))
       ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at`,
      [k, String(updates[k])]
    );
  });

  return res.json({ message: 'Settings saved to database' });
});

// ================= 15. ASSIGNMENTS CRUD =================
adminRouter.get('/assignments', (req: AuthenticatedRequest, res: Response) => {
  const { courseId } = req.query;
  let sql = `
    SELECT a.*, c.title as courseTitle
    FROM assignments a
    JOIN courses c ON a.course_id = c.id
  `;
  const params: any[] = [];
  if (courseId) {
    sql += ' WHERE a.course_id = ?';
    params.push(String(courseId));
  }
  sql += ' ORDER BY a.created_at DESC';

  const list = query<any>(sql, params);
  return res.json(
    list.map((a) => ({
      ...a,
      courseId: a.course_id,
      dueDate: a.due_date,
      maxScore: a.max_score,
      createdAt: a.created_at,
    }))
  );
});

adminRouter.post('/assignments', (req: AuthenticatedRequest, res: Response) => {
  const { courseId, title, description, dueDate, maxScore = 100 } = req.body;
  if (!courseId || !title) {
    return res.status(400).json({ error: 'Course ID and title are required' });
  }

  const id = `assign-${Date.now()}`;
  run(
    `INSERT INTO assignments (id, course_id, title, description, due_date, max_score)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [id, courseId, title.trim(), description || '', dueDate || '2026-12-01', Number(maxScore) || 100]
  );

  return res.status(201).json({ id, title });
});

adminRouter.put('/assignments/:id', (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const { title, description, dueDate, maxScore } = req.body;

  run(
    `UPDATE assignments SET title = ?, description = ?, due_date = ?, max_score = ?, updated_at = datetime('now')
     WHERE id = ?`,
    [title, description, dueDate, Number(maxScore) || 100, id]
  );

  return res.json({ message: 'Assignment updated', id });
});

adminRouter.delete('/assignments/:id', (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  run('DELETE FROM assignments WHERE id = ?', [id]);
  return res.json({ message: 'Assignment deleted' });
});

// ================= 16. QUIZZES CRUD =================
adminRouter.get('/quizzes', (req: AuthenticatedRequest, res: Response) => {
  const { courseId } = req.query;
  let sql = `
    SELECT q.*, c.title as courseTitle
    FROM quizzes q
    JOIN courses c ON q.course_id = c.id
  `;
  const params: any[] = [];
  if (courseId) {
    sql += ' WHERE q.course_id = ?';
    params.push(String(courseId));
  }
  sql += ' ORDER BY q.created_at DESC';

  const list = query<any>(sql, params);
  const formatted = list.map((q) => {
    const questions = query<any>(
      'SELECT * FROM quiz_questions WHERE quiz_id = ? ORDER BY order_index ASC',
      [q.id]
    );
    return {
      id: q.id,
      courseId: q.course_id,
      courseTitle: q.courseTitle,
      title: q.title,
      passingScore: q.passing_score,
      questionsCount: questions.length,
      questions: questions.map((ques) => ({
        id: ques.id,
        question: ques.question,
        options: ques.options_json ? JSON.parse(ques.options_json) : [],
        correctIndex: ques.correct_index,
        explanation: ques.explanation,
        orderIndex: ques.order_index,
      })),
    };
  });

  return res.json(formatted);
});

adminRouter.post('/quizzes', (req: AuthenticatedRequest, res: Response) => {
  const { courseId, title, passingScore = 80, questions = [] } = req.body;
  if (!courseId || !title) {
    return res.status(400).json({ error: 'Course ID and title are required' });
  }

  const id = `quiz-${Date.now()}`;
  run(
    `INSERT INTO quizzes (id, course_id, title, passing_score)
     VALUES (?, ?, ?, ?)`,
    [id, courseId, title.trim(), Number(passingScore) || 80]
  );

  if (Array.isArray(questions)) {
    questions.forEach((q: any, idx: number) => {
      const qId = `q-${Date.now()}-${idx}`;
      run(
        `INSERT INTO quiz_questions (id, quiz_id, question, options_json, correct_index, explanation, order_index)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          qId,
          id,
          q.question || `Question ${idx + 1}`,
          JSON.stringify(q.options || ['Option A', 'Option B', 'Option C', 'Option D']),
          Number(q.correctIndex) || 0,
          q.explanation || '',
          idx + 1,
        ]
      );
    });
  }

  return res.status(201).json({ id, title });
});

adminRouter.put('/quizzes/:id', (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const { title, passingScore } = req.body;

  run(
    `UPDATE quizzes SET title = ?, passing_score = ?, updated_at = datetime('now')
     WHERE id = ?`,
    [title, Number(passingScore) || 80, id]
  );

  return res.json({ message: 'Quiz updated', id });
});

adminRouter.delete('/quizzes/:id', (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  run('DELETE FROM quizzes WHERE id = ?', [id]);
  return res.json({ message: 'Quiz deleted' });
});
