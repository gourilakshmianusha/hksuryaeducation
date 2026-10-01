import { Router, Request, Response } from 'express';
import { query, queryOne, run } from '../db';

export const publicRouter = Router();

// GET /api/courses
publicRouter.get('/courses', (req: Request, res: Response) => {
  const { category, search } = req.query;

  let sql = `
    SELECT
      c.id, c.title, c.slug, c.level, c.duration, c.price, c.original_price as originalPrice,
      c.overview, c.highlights_json, c.skills_json, c.technologies_json, c.syllabus_json,
      c.certificate_included as certificateIncluded, c.next_cohort_date as nextCohortDate,
      c.featured, c.published, c.enrolled_count as enrolledCount, c.rating, c.reviews_count as reviewsCount,
      cat.name as category,
      t.name as trainerName, t.role as trainerRole, t.company as trainerCompany, t.avatar as trainerAvatar
    FROM courses c
    JOIN categories cat ON c.category_id = cat.id
    JOIN trainers t ON c.trainer_id = t.id
    WHERE c.published = 1
  `;
  const params: any[] = [];

  if (category && category !== 'All') {
    sql += ` AND LOWER(cat.name) = LOWER(?)`;
    params.push(String(category));
  }

  if (search) {
    sql += ` AND (LOWER(c.title) LIKE ? OR LOWER(c.overview) LIKE ? OR LOWER(c.skills_json) LIKE ?)`;
    const term = `%${String(search).toLowerCase()}%`;
    params.push(term, term, term);
  }

  sql += ` ORDER BY c.featured DESC, c.created_at DESC`;

  const rows = query<any>(sql, params);
  const formatted = rows.map((r) => ({
    ...r,
    highlights: r.highlights_json ? JSON.parse(r.highlights_json) : [],
    skillsAcquired: r.skills_json ? JSON.parse(r.skills_json) : [],
    technologies: r.technologies_json ? JSON.parse(r.technologies_json) : [],
    syllabus: r.syllabus_json ? JSON.parse(r.syllabus_json) : [],
    featured: Boolean(r.featured),
    certificateIncluded: Boolean(r.certificateIncluded),
    trainer: {
      name: r.trainerName,
      role: r.trainerRole,
      company: r.trainerCompany,
      avatar: r.trainerAvatar,
    },
  }));

  return res.json(formatted);
});

// GET /api/courses/:id
publicRouter.get('/courses/:id', (req: Request, res: Response) => {
  const sql = `
    SELECT
      c.id, c.title, c.slug, c.level, c.duration, c.price, c.original_price as originalPrice,
      c.overview, c.highlights_json, c.skills_json, c.technologies_json, c.syllabus_json,
      c.certificate_included as certificateIncluded, c.next_cohort_date as nextCohortDate,
      c.featured, c.published, c.enrolled_count as enrolledCount, c.rating, c.reviews_count as reviewsCount,
      cat.name as category,
      t.name as trainerName, t.role as trainerRole, t.company as trainerCompany, t.avatar as trainerAvatar, t.bio as trainerBio
    FROM courses c
    JOIN categories cat ON c.category_id = cat.id
    JOIN trainers t ON c.trainer_id = t.id
    WHERE c.id = ? OR c.slug = ?
  `;

  const r = queryOne<any>(sql, [req.params.id, req.params.id]);
  if (!r) return res.status(404).json({ error: 'Course not found' });

  const lessonsCount = queryOne<{ count: number }>('SELECT count(*) as count FROM lessons WHERE course_id = ?', [
    r.id,
  ])?.count || 0;

  return res.json({
    ...r,
    highlights: r.highlights_json ? JSON.parse(r.highlights_json) : [],
    skillsAcquired: r.skills_json ? JSON.parse(r.skills_json) : [],
    technologies: r.technologies_json ? JSON.parse(r.technologies_json) : [],
    syllabus: r.syllabus_json ? JSON.parse(r.syllabus_json) : [],
    featured: Boolean(r.featured),
    certificateIncluded: Boolean(r.certificateIncluded),
    trainer: {
      name: r.trainerName,
      role: r.trainerRole,
      company: r.trainerCompany,
      avatar: r.trainerAvatar,
      bio: r.trainerBio,
    },
    lessonsCount,
  });
});

// GET /api/categories
publicRouter.get('/categories', (req: Request, res: Response) => {
  const categories = query<any>(`
    SELECT cat.*,
      (SELECT COUNT(*) FROM courses c WHERE c.category_id = cat.id AND c.published = 1) as coursesCount
    FROM categories cat
    ORDER BY cat.name ASC
  `);
  return res.json(categories);
});

// GET /api/learning-paths
publicRouter.get('/learning-paths', (req: Request, res: Response) => {
  const paths = query<any>(`SELECT * FROM learning_paths WHERE published = 1 ORDER BY created_at ASC`);
  return res.json(
    paths.map((p) => ({
      id: p.id,
      title: p.title,
      slug: p.slug,
      duration: p.duration,
      targetRole: p.target_role,
      avgSalary: p.avg_salary,
      description: p.description,
      color: p.color,
      steps: p.steps_json ? JSON.parse(p.steps_json) : [],
    }))
  );
});

// GET /api/trainers
publicRouter.get('/trainers', (req: Request, res: Response) => {
  const trainers = query<any>(`SELECT * FROM trainers ORDER BY rating DESC`);
  return res.json(
    trainers.map((t) => ({
      id: t.id,
      name: t.name,
      email: t.email,
      role: t.role,
      company: t.company,
      experience: t.experience,
      bio: t.bio,
      avatar: t.avatar,
      rating: t.rating,
      studentsTaught: t.students_taught,
      specialties: t.specialties_json ? JSON.parse(t.specialties_json) : [],
    }))
  );
});

// GET /api/blog
publicRouter.get('/blog', (req: Request, res: Response) => {
  const blogs = query<any>(`SELECT * FROM blogs WHERE published = 1 ORDER BY created_at DESC`);
  return res.json(
    blogs.map((b) => ({
      id: b.id,
      title: b.title,
      slug: b.slug,
      category: b.category,
      readTime: b.read_time,
      date: b.date,
      author: b.author,
      authorRole: b.author_role,
      excerpt: b.excerpt,
      content: b.content,
    }))
  );
});

// GET /api/testimonials
publicRouter.get('/testimonials', (req: Request, res: Response) => {
  const list = query<any>(`SELECT * FROM testimonials WHERE published = 1 ORDER BY created_at DESC`);
  return res.json(list);
});

// POST /api/contact
publicRouter.post('/contact', (req: Request, res: Response) => {
  const { name, email, topic, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Name, email, and message are required' });
  }

  const id = `msg-${Date.now()}`;
  run(
    `INSERT INTO contact_messages (id, name, email, topic, message, status) VALUES (?, ?, ?, ?, ?, 'unread')`,
    [id, name.trim(), email.trim().toLowerCase(), topic || 'General Inquiry', message.trim()]
  );

  return res.status(201).json({
    message: 'Thank you for reaching out! Our admissions advisory team will respond within 4 hours.',
    success: true,
  });
});

// POST /api/newsletter
publicRouter.post('/newsletter', (req: Request, res: Response) => {
  const { email } = req.body;
  if (!email || !email.includes('@')) {
    return res.status(400).json({ error: 'Valid email address required' });
  }

  const normalized = email.trim().toLowerCase();
  const existing = queryOne('SELECT id FROM newsletter_subscribers WHERE email = ?', [normalized]);
  if (existing) {
    return res.json({ message: 'You are already subscribed to HKSURYA Research briefings.' });
  }

  run(`INSERT INTO newsletter_subscribers (id, email) VALUES (?, ?)`, [`sub-${Date.now()}`, normalized]);

  return res.status(201).json({
    message: 'Successfully subscribed to HKSURYA Learning engineering publications.',
    success: true,
  });
});

// GET /api/certificates/verify/:code
publicRouter.get('/certificates/verify/:code', (req: Request, res: Response) => {
  const cert = queryOne<any>(
    `SELECT cert.*, c.title as courseTitle, u.name as studentName
     FROM certificates cert
     JOIN courses c ON cert.course_id = c.id
     JOIN users u ON cert.student_id = u.id
     WHERE UPPER(cert.certificate_code) = UPPER(?)`,
    [req.params.code]
  );

  if (!cert) {
    return res.status(404).json({ error: 'Certificate code could not be verified' });
  }

  return res.json({
    valid: true,
    certificate: cert,
  });
});

// GET /api/settings/public
publicRouter.get('/settings/public', (req: Request, res: Response) => {
  const settingsRows = query<{ key: string; value: string }>('SELECT key, value FROM settings');
  const settingsMap: any = {};
  settingsRows.forEach((r) => {
    settingsMap[r.key] = r.value;
  });
  return res.json(settingsMap);
});
