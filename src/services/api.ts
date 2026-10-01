// Frontend API Client for HKSURYA Learning Platform

const API_BASE = '/api';

function getAuthHeader(): HeadersInit {
  const token = localStorage.getItem('hksurya_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...getAuthHeader(),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || data.message || `Request failed with status ${response.status}`);
  }

  return data;
}

export const api = {
  // ================= AUTH =================
  auth: {
    login: (credentials: { email: string; password: string }) =>
      request<{ token: string; user: any }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
      }),
    register: (userData: { name: string; email: string; password: string; role?: string }) =>
      request<{ token: string; user: any }>('/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData),
      }),
    forgotPassword: (email: string) =>
      request<{ message: string }>('/auth/forgot-password', {
        method: 'POST',
        body: JSON.stringify({ email }),
      }),
    getMe: () => request<{ user: any }>('/auth/me'),
    updateProfile: (data: any) =>
      request<{ message: string; user: any }>('/auth/profile', {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
  },

  // ================= STUDENT PORTAL =================
  student: {
    getDashboard: () => request<any>('/student/dashboard'),
    getCourses: () => request<any[]>('/student/courses'),
    enroll: (courseId: string, paymentMethod?: string) =>
      request<any>('/student/enroll', {
        method: 'POST',
        body: JSON.stringify({ courseId, paymentMethod }),
      }),
    getCourseLearn: (courseId: string) => request<any>(`/student/courses/${courseId}/learn`),
    toggleLesson: (lessonId: string) =>
      request<any>(`/student/lessons/${lessonId}/toggle`, {
        method: 'POST',
      }),
    getAssignments: () => request<any[]>('/student/assignments'),
    submitAssignment: (assignmentId: string, submissionText: string) =>
      request<any>(`/student/assignments/${assignmentId}/submit`, {
        method: 'POST',
        body: JSON.stringify({ submissionText }),
      }),
    getQuizzes: () => request<any[]>('/student/quizzes'),
    submitQuiz: (quizId: string, answers: number[]) =>
      request<any>(`/student/quizzes/${quizId}/submit`, {
        method: 'POST',
        body: JSON.stringify({ answers }),
      }),
    getCertificates: () => request<any[]>('/student/certificates'),
  },

  // ================= PUBLIC =================
  public: {
    getCourses: (params?: { category?: string; search?: string }) => {
      const q = new URLSearchParams();
      if (params?.category) q.set('category', params.category);
      if (params?.search) q.set('search', params.search);
      return request<any[]>(`/courses?${q.toString()}`);
    },
    getCourse: (id: string) => request<any>(`/courses/${id}`),
    getCategories: () => request<any[]>('/categories'),
    getLearningPaths: () => request<any[]>('/learning-paths'),
    getTrainers: () => request<any[]>('/trainers'),
    getBlog: () => request<any[]>('/blog'),
    getBlogPost: (id: string) => request<any>(`/blog/${id}`),
    submitContact: (data: { name: string; email: string; topic?: string; message: string }) =>
      request<{ message: string }>('/contact', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    subscribeNewsletter: (email: string) =>
      request<{ message: string }>('/newsletter', {
        method: 'POST',
        body: JSON.stringify({ email }),
      }),
    verifyCertificate: (code: string) => request<any>(`/certificates/verify/${code}`),
  },

  // ================= ADMIN MANAGEMENT =================
  admin: {
    getDashboard: () => request<any>('/admin/dashboard'),
    // Courses
    getCourses: () => request<any[]>('/admin/courses'),
    createCourse: (data: any) =>
      request<any>('/admin/courses', { method: 'POST', body: JSON.stringify(data) }),
    updateCourse: (id: string, data: any) =>
      request<any>(`/admin/courses/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    deleteCourse: (id: string) =>
      request<any>(`/admin/courses/${id}`, { method: 'DELETE' }),
    // Categories
    getCategories: () => request<any[]>('/admin/categories'),
    createCategory: (data: any) =>
      request<any>('/admin/categories', { method: 'POST', body: JSON.stringify(data) }),
    updateCategory: (id: string, data: any) =>
      request<any>(`/admin/categories/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    deleteCategory: (id: string) =>
      request<any>(`/admin/categories/${id}`, { method: 'DELETE' }),
    // Learning Paths
    getLearningPaths: () => request<any[]>('/admin/learning-paths'),
    createLearningPath: (data: any) =>
      request<any>('/admin/learning-paths', { method: 'POST', body: JSON.stringify(data) }),
    updateLearningPath: (id: string, data: any) =>
      request<any>(`/admin/learning-paths/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    deleteLearningPath: (id: string) =>
      request<any>(`/admin/learning-paths/${id}`, { method: 'DELETE' }),
    // Lessons
    getLessons: (courseId?: string) =>
      request<any[]>(`/admin/lessons${courseId ? `?courseId=${courseId}` : ''}`),
    createLesson: (data: any) =>
      request<any>('/admin/lessons', { method: 'POST', body: JSON.stringify(data) }),
    updateLesson: (id: string, data: any) =>
      request<any>(`/admin/lessons/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    deleteLesson: (id: string) =>
      request<any>(`/admin/lessons/${id}`, { method: 'DELETE' }),
    // Students
    getStudents: () => request<any[]>('/admin/students'),
    updateStudentStatus: (id: string, status: 'active' | 'suspended') =>
      request<any>(`/admin/students/${id}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status }),
      }),
    enrollStudentManual: (studentId: string, courseId: string) =>
      request<any>('/admin/students/enroll-manual', {
        method: 'POST',
        body: JSON.stringify({ studentId, courseId }),
      }),
    // Trainers
    getTrainers: () => request<any[]>('/admin/trainers'),
    createTrainer: (data: any) =>
      request<any>('/admin/trainers', { method: 'POST', body: JSON.stringify(data) }),
    updateTrainer: (id: string, data: any) =>
      request<any>(`/admin/trainers/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    deleteTrainer: (id: string) =>
      request<any>(`/admin/trainers/${id}`, { method: 'DELETE' }),
    // Enrollments
    getEnrollments: () => request<any[]>('/admin/enrollments'),
    updateEnrollment: (id: string, data: any) =>
      request<any>(`/admin/enrollments/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    deleteEnrollment: (id: string) =>
      request<any>(`/admin/enrollments/${id}`, { method: 'DELETE' }),
    // Payments
    getPayments: () => request<any[]>('/admin/payments'),
    // Testimonials
    getTestimonials: () => request<any[]>('/admin/testimonials'),
    createTestimonial: (data: any) =>
      request<any>('/admin/testimonials', { method: 'POST', body: JSON.stringify(data) }),
    deleteTestimonial: (id: string) =>
      request<any>(`/admin/testimonials/${id}`, { method: 'DELETE' }),
    // Blog
    getBlog: () => request<any[]>('/admin/blog'),
    createBlogPost: (data: any) =>
      request<any>('/admin/blog', { method: 'POST', body: JSON.stringify(data) }),
    updateBlogPost: (id: string, data: any) =>
      request<any>(`/admin/blog/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    deleteBlogPost: (id: string) =>
      request<any>(`/admin/blog/${id}`, { method: 'DELETE' }),
    // Certificates
    getCertificates: () => request<any[]>('/admin/certificates'),
    issueCertificate: (data: { studentId: string; courseId: string; grade?: string }) =>
      request<any>('/admin/certificates/issue', { method: 'POST', body: JSON.stringify(data) }),
    revokeCertificate: (id: string) =>
      request<any>(`/admin/certificates/${id}`, { method: 'DELETE' }),
    // Contact Messages
    getContactMessages: () => request<any[]>('/admin/contact'),
    updateContactMessage: (id: string, data: any) =>
      request<any>(`/admin/contact/${id}/status`, { method: 'PUT', body: JSON.stringify(data) }),
    deleteContactMessage: (id: string) =>
      request<any>(`/admin/contact/${id}`, { method: 'DELETE' }),
    // Newsletter
    getNewsletter: () => request<any[]>('/admin/newsletter'),
    deleteNewsletter: (id: string) =>
      request<any>(`/admin/newsletter/${id}`, { method: 'DELETE' }),
    // Settings
    getSettings: () => request<any>('/admin/settings'),
    updateSettings: (data: any) =>
      request<any>('/admin/settings', { method: 'PUT', body: JSON.stringify(data) }),
    // Assignments CRUD
    getAssignments: (courseId?: string) =>
      request<any[]>(`/admin/assignments${courseId ? `?courseId=${courseId}` : ''}`),
    createAssignment: (data: any) =>
      request<any>('/admin/assignments', { method: 'POST', body: JSON.stringify(data) }),
    updateAssignment: (id: string, data: any) =>
      request<any>(`/admin/assignments/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    deleteAssignment: (id: string) =>
      request<any>(`/admin/assignments/${id}`, { method: 'DELETE' }),
    // Quizzes CRUD
    getQuizzes: (courseId?: string) =>
      request<any[]>(`/admin/quizzes${courseId ? `?courseId=${courseId}` : ''}`),
    createQuiz: (data: any) =>
      request<any>('/admin/quizzes', { method: 'POST', body: JSON.stringify(data) }),
    updateQuiz: (id: string, data: any) =>
      request<any>(`/admin/quizzes/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    deleteQuiz: (id: string) =>
      request<any>(`/admin/quizzes/${id}`, { method: 'DELETE' }),
  },
};
