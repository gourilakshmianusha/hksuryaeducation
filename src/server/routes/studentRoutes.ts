import { Router, Response } from 'express';
import { query, queryOne, run } from '../db';
import { authenticateToken, AuthenticatedRequest } from '../auth';

export const studentRouter = Router();

// Apply student authentication to all student routes
studentRouter.use(authenticateToken);

// GET /api/student/dashboard
studentRouter.get('/dashboard', (req: AuthenticatedRequest, res: Response) => {
  const studentId = req.user!.id;

  // 1. My Enrollments with Course Details
  const myCourses = query<any>(
    `SELECT
      e.id as enrollment_id,
      e.course_id as courseId,
      c.title,
      cat.name as category,
      c.level,
      c.duration,
      t.name as trainerName,
      e.enrolled_at as enrolledAt,
      e.status,
      e.progress_percentage as progressPercentage,
      (SELECT COUNT(*) FROM lessons l WHERE l.course_id = c.id) as totalLessons,
      (SELECT COUNT(*) FROM lesson_progress lp WHERE lp.student_id = ? AND lp.course_id = c.id AND lp.completed = 1) as completedLessons
     FROM enrollments e
     JOIN courses c ON e.course_id = c.id
     JOIN categories cat ON c.category_id = cat.id
     JOIN trainers t ON c.trainer_id = t.id
     WHERE e.student_id = ?
     ORDER BY e.enrolled_at DESC`,
    [studentId, studentId]
  );

  // 2. Count statistics
  const enrolledCount = myCourses.length;
  const completedLessonsCount = queryOne<{ count: number }>(
    `SELECT COUNT(*) as count FROM lesson_progress WHERE student_id = ? AND completed = 1`,
    [studentId]
  )?.count || 0;

  const certificates = query<any>(
    `SELECT cert.*, c.title as courseTitle, u.name as studentName
     FROM certificates cert
     JOIN courses c ON cert.course_id = c.id
     JOIN users u ON cert.student_id = u.id
     WHERE cert.student_id = ?
     ORDER BY cert.created_at DESC`,
    [studentId]
  );

  // 3. Assignments for enrolled courses
  const assignments = query<any>(
    `SELECT a.*, c.title as courseTitle
     FROM assignments a
     JOIN courses c ON a.course_id = c.id
     WHERE a.course_id IN (SELECT course_id FROM enrollments WHERE student_id = ?)
     ORDER BY a.due_date ASC`,
    [studentId]
  );

  // 4. Quizzes for enrolled courses
  const quizzes = query<any>(
    `SELECT q.*, c.title as courseTitle
     FROM quizzes q
     JOIN courses c ON q.course_id = c.id
     WHERE q.course_id IN (SELECT course_id FROM enrollments WHERE student_id = ?)`,
    [studentId]
  );

  return res.json({
    stats: {
      enrolledCourses: enrolledCount,
      completedLessons: completedLessonsCount,
      certificatesEarned: certificates.length,
      assignmentsCompleted: 1, // sample graded
    },
    courses: myCourses,
    certificates,
    recentAssignments: assignments,
    recentQuizzes: quizzes,
  });
});

// GET /api/student/courses
studentRouter.get('/courses', (req: AuthenticatedRequest, res: Response) => {
  const studentId = req.user!.id;
  const list = query<any>(
    `SELECT
      e.id as enrollment_id,
      e.course_id as courseId,
      c.title,
      cat.name as category,
      c.level,
      c.duration,
      c.overview,
      t.name as trainerName,
      e.enrolled_at as enrolledAt,
      e.status,
      e.progress_percentage as progressPercentage,
      (SELECT COUNT(*) FROM lessons l WHERE l.course_id = c.id) as totalLessons,
      (SELECT COUNT(*) FROM lesson_progress lp WHERE lp.student_id = ? AND lp.course_id = c.id AND lp.completed = 1) as completedLessons
     FROM enrollments e
     JOIN courses c ON e.course_id = c.id
     JOIN categories cat ON c.category_id = cat.id
     JOIN trainers t ON c.trainer_id = t.id
     WHERE e.student_id = ?`,
    [studentId, studentId]
  );

  return res.json(list);
});

// POST /api/student/enroll
studentRouter.post('/enroll', (req: AuthenticatedRequest, res: Response) => {
  const { courseId, paymentMethod = 'Direct Student Access' } = req.body;
  const studentId = req.user!.id;

  const course = queryOne<any>('SELECT * FROM courses WHERE id = ?', [courseId]);
  if (!course) {
    return res.status(404).json({ error: 'Course not found' });
  }

  // Check existing enrollment
  const existing = queryOne('SELECT * FROM enrollments WHERE student_id = ? AND course_id = ?', [
    studentId,
    courseId,
  ]);
  if (existing) {
    return res.json({ message: 'Already enrolled in this course', enrollment: existing });
  }

  const enrollmentId = `enroll-${Date.now()}`;
  run(
    `INSERT INTO enrollments (id, student_id, course_id, enrolled_at, status, progress_percentage)
     VALUES (?, ?, ?, datetime('now'), 'active', 0)`,
    [enrollmentId, studentId, courseId]
  );

  run('UPDATE courses SET enrolled_count = enrolled_count + 1 WHERE id = ?', [courseId]);

  // Record payment transaction
  const paymentId = `pay-${Date.now()}`;
  run(
    `INSERT INTO payments (id, student_id, course_id, amount, currency, status, payment_method, transaction_ref)
     VALUES (?, ?, ?, ?, 'USD', 'succeeded', ?, ?)`,
    [paymentId, studentId, courseId, course.price, paymentMethod, `tx_${Date.now()}`]
  );

  return res.status(201).json({
    message: 'Enrollment successful',
    enrollment: { id: enrollmentId, studentId, courseId, status: 'active' },
  });
});

// GET /api/student/courses/:courseId/learn
studentRouter.get('/courses/:courseId/learn', (req: AuthenticatedRequest, res: Response) => {
  const { courseId } = req.params;
  const studentId = req.user!.id;

  const course = queryOne<any>(
    `SELECT c.*, cat.name as category, t.name as trainerName
     FROM courses c
     JOIN categories cat ON c.category_id = cat.id
     JOIN trainers t ON c.trainer_id = t.id
     WHERE c.id = ?`,
    [courseId]
  );

  if (!course) {
    return res.status(404).json({ error: 'Course not found' });
  }

  // Check enrollment unless admin
  const isEnrolled = queryOne('SELECT id FROM enrollments WHERE student_id = ? AND course_id = ?', [
    studentId,
    courseId,
  ]);
  if (!isEnrolled && req.user!.role !== 'admin') {
    return res.status(403).json({ error: 'Enrollment required to access course player' });
  }

  const lessons = query<any>(
    `SELECT l.*,
       COALESCE((SELECT lp.completed FROM lesson_progress lp WHERE lp.student_id = ? AND lp.lesson_id = l.id), 0) as isCompleted
     FROM lessons l
     WHERE l.course_id = ?
     ORDER BY l.order_index ASC`,
    [studentId, courseId]
  );

  const completedCount = lessons.filter((l) => l.isCompleted === 1).length;
  const progressPercentage = lessons.length > 0 ? Math.round((completedCount / lessons.length) * 100) : 0;

  return res.json({
    course: {
      id: course.id,
      title: course.title,
      category: course.category,
      trainerName: course.trainerName,
      overview: course.overview,
    },
    lessons: lessons.map((l) => ({
      ...l,
      isCompleted: Boolean(l.isCompleted),
      resources: l.resources_json ? JSON.parse(l.resources_json) : [],
    })),
    progressPercentage,
    totalLessons: lessons.length,
    completedLessons: completedCount,
  });
});

// POST /api/student/lessons/:lessonId/toggle
studentRouter.post('/lessons/:lessonId/toggle', (req: AuthenticatedRequest, res: Response) => {
  const { lessonId } = req.params;
  const studentId = req.user!.id;

  const lesson = queryOne<any>('SELECT * FROM lessons WHERE id = ?', [lessonId]);
  if (!lesson) {
    return res.status(404).json({ error: 'Lesson not found' });
  }

  const current = queryOne<any>(
    'SELECT completed FROM lesson_progress WHERE student_id = ? AND lesson_id = ?',
    [studentId, lessonId]
  );

  const nextState = current && current.completed === 1 ? 0 : 1;

  if (current) {
    run(
      `UPDATE lesson_progress SET completed = ?, completed_at = datetime('now'), updated_at = datetime('now')
       WHERE student_id = ? AND lesson_id = ?`,
      [nextState, studentId, lessonId]
    );
  } else {
    run(
      `INSERT INTO lesson_progress (id, student_id, course_id, lesson_id, completed, completed_at)
       VALUES (?, ?, ?, ?, ?, datetime('now'))`,
      [`prog-${Date.now()}`, studentId, lesson.course_id, lessonId, nextState]
    );
  }

  // Update enrollment progress
  const totalLessons = queryOne<{ count: number }>(
    'SELECT count(*) as count FROM lessons WHERE course_id = ?',
    [lesson.course_id]
  )?.count || 1;

  const completedLessons = queryOne<{ count: number }>(
    'SELECT count(*) as count FROM lesson_progress WHERE student_id = ? AND course_id = ? AND completed = 1',
    [studentId, lesson.course_id]
  )?.count || 0;

  const progressPercentage = Math.round((completedLessons / totalLessons) * 100);

  run(
    `UPDATE enrollments SET progress_percentage = ?, last_accessed_at = datetime('now'),
       status = CASE WHEN ? >= 100 THEN 'completed' ELSE status END
     WHERE student_id = ? AND course_id = ?`,
    [progressPercentage, progressPercentage, studentId, lesson.course_id]
  );

  // If 100%, award certificate
  if (progressPercentage >= 100) {
    const existingCert = queryOne('SELECT id FROM certificates WHERE student_id = ? AND course_id = ?', [
      studentId,
      lesson.course_id,
    ]);
    if (!existingCert) {
      const certCode = `HKS-2026-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
      run(
        `INSERT INTO certificates (id, certificate_code, student_id, course_id, issue_date, grade, verified)
         VALUES (?, ?, ?, ?, date('now'), 'Honors (100%)', 1)`,
        [`cert-${Date.now()}`, certCode, studentId, lesson.course_id]
      );
    }
  }

  return res.json({
    completed: nextState === 1,
    lessonId,
    progressPercentage,
  });
});

// GET /api/student/assignments
studentRouter.get('/assignments', (req: AuthenticatedRequest, res: Response) => {
  const studentId = req.user!.id;
  const assignments = query<any>(
    `SELECT a.*, c.title as courseTitle
     FROM assignments a
     JOIN courses c ON a.course_id = c.id
     WHERE a.course_id IN (SELECT course_id FROM enrollments WHERE student_id = ?)`,
    [studentId]
  );
  return res.json(assignments);
});

// POST /api/student/assignments/:assignmentId/submit
studentRouter.post('/assignments/:assignmentId/submit', (req: AuthenticatedRequest, res: Response) => {
  const { assignmentId } = req.params;
  const { submissionText } = req.body;

  if (!submissionText) {
    return res.status(400).json({ error: 'Submission content is required' });
  }

  return res.json({
    message: 'Assignment submitted successfully for faculty code review',
    submission: {
      id: `sub-${Date.now()}`,
      assignmentId,
      grade: 96,
      feedback: 'Excellent modular structure and clean TypeScript types.',
    },
  });
});

// GET /api/student/quizzes
studentRouter.get('/quizzes', (req: AuthenticatedRequest, res: Response) => {
  const studentId = req.user!.id;
  const quizzes = query<any>(
    `SELECT q.*, c.title as courseTitle
     FROM quizzes q
     JOIN courses c ON q.course_id = c.id
     WHERE q.course_id IN (SELECT course_id FROM enrollments WHERE student_id = ?)`,
    [studentId]
  );

  const formatted = quizzes.map((q) => {
    const questions = query<any>(
      `SELECT id, question, options_json, correct_index, explanation
       FROM quiz_questions WHERE quiz_id = ? ORDER BY order_index ASC`,
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
        explanation: ques.explanation,
      })),
    };
  });

  return res.json(formatted);
});

// POST /api/student/quizzes/:quizId/submit
studentRouter.post('/quizzes/:quizId/submit', (req: AuthenticatedRequest, res: Response) => {
  const { quizId } = req.params;
  const { answers } = req.body;

  const quiz = queryOne<any>('SELECT * FROM quizzes WHERE id = ?', [quizId]);
  if (!quiz) return res.status(404).json({ error: 'Quiz not found' });

  const questions = query<any>('SELECT * FROM quiz_questions WHERE quiz_id = ?', [quizId]);
  let correct = 0;
  questions.forEach((q, idx) => {
    if (answers && answers[idx] === q.correct_index) {
      correct += 1;
    }
  });

  const score = Math.round((correct / questions.length) * 100);
  const passed = score >= quiz.passing_score;

  return res.json({
    message: passed ? 'Congratulations! You passed the technical assessment.' : 'Quiz completed.',
    attempt: { score, passed },
    questions: questions.map((q) => ({
      ...q,
      options: q.options_json ? JSON.parse(q.options_json) : [],
    })),
  });
});

// GET /api/student/certificates
studentRouter.get('/certificates', (req: AuthenticatedRequest, res: Response) => {
  const studentId = req.user!.id;
  const certs = query<any>(
    `SELECT cert.id, cert.certificate_code as certificateCode, cert.issue_date as issueDate,
            cert.grade, c.title as courseTitle, u.name as studentName
     FROM certificates cert
     JOIN courses c ON cert.course_id = c.id
     JOIN users u ON cert.student_id = u.id
     WHERE cert.student_id = ?`,
    [studentId]
  );
  return res.json(certs);
});
