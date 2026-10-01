import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Logo } from '../Logo';
import {
  LayoutDashboard,
  BookOpen,
  FolderTree,
  Compass,
  Video,
  Users,
  GraduationCap,
  ClipboardList,
  CreditCard,
  MessageSquareQuote,
  FileEdit,
  Award,
  Inbox,
  Mail,
  Settings,
  LogOut,
  Plus,
  Trash2,
  Edit,
  CheckCircle,
  X,
  Search,
  Menu,
  ChevronRight,
  TrendingUp,
  DollarSign,
  AlertCircle,
  ArrowLeft,
  FileText,
  HelpCircle,
} from 'lucide-react';

interface AdminPanelProps {
  onExit: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ onExit }) => {
  const [activeSection, setActiveSection] = useState<string>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  // Data states
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [courses, setCourses] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [learningPaths, setLearningPaths] = useState<any[]>([]);
  const [lessons, setLessons] = useState<any[]>([]);
  const [assignments, setAssignments] = useState<any[]>([]);
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [trainers, setTrainers] = useState<any[]>([]);
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [blogPosts, setBlogPosts] = useState<any[]>([]);
  const [certificates, setCertificates] = useState<any[]>([]);
  const [contactMessages, setContactMessages] = useState<any[]>([]);
  const [subscribers, setSubscribers] = useState<any[]>([]);
  const [siteSettings, setSiteSettings] = useState<any>(null);

  // Modal / Form states
  const [modalMode, setModalMode] = useState<string | null>(null);
  const [activeItem, setActiveItem] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const showToast = (msg: string) => {
    setFeedback(msg);
    setTimeout(() => setFeedback(null), 4000);
  };

  // Load Section Data
  const loadSection = async (section: string) => {
    setLoading(true);
    try {
      if (section === 'dashboard') {
        const data = await api.admin.getDashboard();
        setDashboardData(data);
      } else if (section === 'courses') {
        const [cList, catList, tList] = await Promise.all([
          api.admin.getCourses(),
          api.admin.getCategories(),
          api.admin.getTrainers(),
        ]);
        setCourses(cList);
        setCategories(catList);
        setTrainers(tList);
      } else if (section === 'categories') {
        const data = await api.admin.getCategories();
        setCategories(data);
      } else if (section === 'learningPaths') {
        const data = await api.admin.getLearningPaths();
        setLearningPaths(data);
      } else if (section === 'lessons') {
        const [lList, cList] = await Promise.all([api.admin.getLessons(), api.admin.getCourses()]);
        setLessons(lList);
        setCourses(cList);
      } else if (section === 'assignments') {
        const [aList, cList] = await Promise.all([api.admin.getAssignments(), api.admin.getCourses()]);
        setAssignments(aList);
        setCourses(cList);
      } else if (section === 'quizzes') {
        const [qList, cList] = await Promise.all([api.admin.getQuizzes(), api.admin.getCourses()]);
        setQuizzes(qList);
        setCourses(cList);
      } else if (section === 'students') {
        const [sList, cList] = await Promise.all([api.admin.getStudents(), api.admin.getCourses()]);
        setStudents(sList);
        setCourses(cList);
      } else if (section === 'trainers') {
        const data = await api.admin.getTrainers();
        setTrainers(data);
      } else if (section === 'enrollments') {
        const [eList, sList, cList] = await Promise.all([
          api.admin.getEnrollments(),
          api.admin.getStudents(),
          api.admin.getCourses(),
        ]);
        setEnrollments(eList);
        setStudents(sList);
        setCourses(cList);
      } else if (section === 'payments') {
        const data = await api.admin.getPayments();
        setPayments(data);
      } else if (section === 'testimonials') {
        const data = await api.admin.getTestimonials();
        setTestimonials(data);
      } else if (section === 'blog') {
        const data = await api.admin.getBlog();
        setBlogPosts(data);
      } else if (section === 'certificates') {
        const [certList, sList, cList] = await Promise.all([
          api.admin.getCertificates(),
          api.admin.getStudents(),
          api.admin.getCourses(),
        ]);
        setCertificates(certList);
        setStudents(sList);
        setCourses(cList);
      } else if (section === 'contact') {
        const data = await api.admin.getContactMessages();
        setContactMessages(data);
      } else if (section === 'newsletter') {
        const data = await api.admin.getNewsletter();
        setSubscribers(data);
      } else if (section === 'settings') {
        const data = await api.admin.getSettings();
        setSiteSettings(data);
      }
    } catch (err: any) {
      console.error(err);
      showToast(err.message || 'Error loading data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSection(activeSection);
  }, [activeSection]);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'courses', label: 'Courses CRUD', icon: BookOpen },
    { id: 'categories', label: 'Categories CRUD', icon: FolderTree },
    { id: 'learningPaths', label: 'Learning Paths CRUD', icon: Compass },
    { id: 'lessons', label: 'Lessons CRUD', icon: Video },
    { id: 'assignments', label: 'Assignments CRUD', icon: FileText },
    { id: 'quizzes', label: 'Quizzes CRUD', icon: HelpCircle },
    { id: 'students', label: 'Students Management', icon: Users },
    { id: 'trainers', label: 'Trainers CRUD', icon: GraduationCap },
    { id: 'enrollments', label: 'Enrollments', icon: ClipboardList },
    { id: 'payments', label: 'Payments Ledger', icon: CreditCard },
    { id: 'testimonials', label: 'Testimonials CRUD', icon: MessageSquareQuote },
    { id: 'blog', label: 'Blog CRUD', icon: FileEdit },
    { id: 'certificates', label: 'Certificates', icon: Award },
    { id: 'contact', label: 'Contact Messages', icon: Inbox },
    { id: 'newsletter', label: 'Newsletter', icon: Mail },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#040816] text-slate-100 flex flex-col antialiased">
      {/* Top Mobile Bar */}
      <div className="lg:hidden bg-[#070D22] border-b border-white/10 px-4 py-3 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg bg-white/5 border border-white/10 text-white"
          >
            <Menu className="w-5 h-5" />
          </button>
          <Logo size="sm" variant="mark" />
          <span className="text-sm font-bold text-white">HKSURYA Admin</span>
        </div>
        <button
          onClick={onExit}
          className="text-xs text-rose-400 bg-rose-500/10 px-3 py-1.5 rounded-lg border border-rose-500/20"
        >
          Exit
        </button>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* ================= SIDEBAR ================= */}
        <aside
          className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#070D22] border-r border-white/10 flex flex-col justify-between transition-transform duration-300 lg:static lg:translate-x-0 ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div>
            {/* Sidebar Brand Zone */}
            <div className="p-5 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Logo size="sm" variant="dark" showTagline={false} />
              </div>
              <button
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden p-1 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="px-4 py-2 text-[11px] font-bold text-[#00D2FF] tracking-wider uppercase">
              Management Portal
            </div>

            {/* Navigation Link List */}
            <nav className="px-2 py-1 space-y-1 max-h-[calc(100vh-190px)] overflow-y-auto scrollbar-none">
              {navItems.map((item) => {
                const IconComp = item.icon;
                const isActive = activeSection === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveSection(item.id);
                      setSidebarOpen(false);
                      setModalMode(null);
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                      isActive
                        ? 'bg-gradient-to-r from-[#00D2FF]/20 to-[#FF7A00]/20 text-white border border-[#00D2FF]/40 shadow-sm'
                        : 'text-slate-300 hover:text-white hover:bg-white/[0.04]'
                    }`}
                  >
                    <IconComp
                      className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#00D2FF]' : 'text-slate-400'}`}
                    />
                    <span className="truncate">{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Sidebar Footer */}
          <div className="p-4 border-t border-white/10 space-y-2">
            <button
              onClick={onExit}
              className="w-full py-2.5 px-3 rounded-xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/10 text-xs font-semibold text-slate-300 hover:text-white flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 text-[#00D2FF]" />
              <span>Back to Public Site</span>
            </button>
          </div>
        </aside>

        {/* ================= MAIN CONTENT AREA ================= */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-8 bg-[#050A1A]">
          {/* Toast Notice */}
          {feedback && (
            <div className="mb-6 p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in">
              <CheckCircle className="w-4 h-4 shrink-0" />
              <span>{feedback}</span>
            </div>
          )}

          {/* ================= 1. DASHBOARD ================= */}
          {activeSection === 'dashboard' && dashboardData && (
            <div className="space-y-8 max-w-7xl mx-auto">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl sm:text-3xl font-black text-white">Platform Overview</h2>
                  <p className="text-xs text-slate-400 mt-1">Live metrics from the central database</p>
                </div>
                <button
                  onClick={() => loadSection('dashboard')}
                  className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-slate-300 flex items-center gap-1.5 self-start"
                >
                  <TrendingUp className="w-3.5 h-3.5 text-[#00D2FF]" />
                  <span>Refresh Metrics</span>
                </button>
              </div>

              {/* KPI Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-6 rounded-3xl bg-[#091129] border border-white/10 shadow-xl">
                  <div className="text-xs text-slate-400 font-semibold mb-1">Total Revenue</div>
                  <div className="text-2xl sm:text-3xl font-black text-white tabular-nums">
                    ${dashboardData.kpis.totalRevenue.toLocaleString()}
                  </div>
                  <div className="text-xs text-emerald-400 font-medium mt-1">Succeeded Payments</div>
                </div>

                <div className="p-6 rounded-3xl bg-[#091129] border border-white/10 shadow-xl">
                  <div className="text-xs text-slate-400 font-semibold mb-1">Total Students</div>
                  <div className="text-2xl sm:text-3xl font-black text-[#00D2FF] tabular-nums">
                    {dashboardData.kpis.totalStudents}
                  </div>
                  <div className="text-xs text-slate-400 mt-1">Registered Learners</div>
                </div>

                <div className="p-6 rounded-3xl bg-[#091129] border border-white/10 shadow-xl">
                  <div className="text-xs text-slate-400 font-semibold mb-1">Course Enrollments</div>
                  <div className="text-2xl sm:text-3xl font-black text-[#FF7A00] tabular-nums">
                    {dashboardData.kpis.totalEnrollments}
                  </div>
                  <div className="text-xs text-slate-400 mt-1">Active & Completed</div>
                </div>

                <div className="p-6 rounded-3xl bg-[#091129] border border-white/10 shadow-xl">
                  <div className="text-xs text-slate-400 font-semibold mb-1">Inquiries & Leads</div>
                  <div className="text-2xl sm:text-3xl font-black text-[#FBBF24] tabular-nums">
                    {dashboardData.kpis.pendingInquiries}
                  </div>
                  <div className="text-xs text-slate-400 mt-1">Unread Admissions Requests</div>
                </div>
              </div>

              {/* Recent Activity: Enrollments & Payments */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Enrollments */}
                <div className="p-6 rounded-3xl bg-[#091129] border border-white/10 shadow-xl">
                  <h3 className="text-base font-bold text-white mb-4">Recent Enrollments</h3>
                  <div className="space-y-3">
                    {dashboardData.recentEnrollments.map((enr: any) => (
                      <div
                        key={enr.id}
                        className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-between text-xs"
                      >
                        <div>
                          <div className="font-bold text-white">{enr.studentName}</div>
                          <div className="text-slate-400 text-[11px]">{enr.courseTitle}</div>
                        </div>
                        <div className="text-right">
                          <span className="font-semibold text-[#00D2FF]">{enr.progressPercentage}%</span>
                          <div className="text-[10px] text-slate-500">{enr.status}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recent Payments */}
                <div className="p-6 rounded-3xl bg-[#091129] border border-white/10 shadow-xl">
                  <h3 className="text-base font-bold text-white mb-4">Payment Transactions</h3>
                  <div className="space-y-3">
                    {dashboardData.recentPayments.map((pay: any) => (
                      <div
                        key={pay.id}
                        className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-between text-xs"
                      >
                        <div>
                          <div className="font-bold text-white">${pay.amount} USD</div>
                          <div className="text-slate-400 text-[11px]">{pay.studentName} · {pay.paymentMethod}</div>
                        </div>
                        <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 text-[11px] font-bold">
                          {pay.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ================= 2. COURSES CRUD ================= */}
          {activeSection === 'courses' && (
            <div className="space-y-6 max-w-7xl mx-auto">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-white">Courses Management</h2>
                  <p className="text-xs text-slate-400 mt-1">Create, edit, and organize curricula</p>
                </div>
                <button
                  onClick={() => {
                    setActiveItem({
                      title: '',
                      categoryId: categories[0]?.id || '',
                      level: 'Intermediate',
                      duration: '12 Weeks',
                      price: 499,
                      originalPrice: 899,
                      overview: '',
                      published: true,
                    });
                    setModalMode('createCourse');
                  }}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#00D2FF] to-[#38BDF8] text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Course</span>
                </button>
              </div>

              {/* Table */}
              <div className="rounded-3xl bg-[#091129] border border-white/10 overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-300">
                    <thead className="bg-white/[0.03] text-slate-400 font-semibold uppercase tracking-wider border-b border-white/5">
                      <tr>
                        <th className="p-4">Title</th>
                        <th className="p-4">Category</th>
                        <th className="p-4">Price</th>
                        <th className="p-4">Students</th>
                        <th className="p-4">Status</th>
                        <th className="p-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {courses.map((course) => (
                        <tr key={course.id} className="hover:bg-white/[0.02]">
                          <td className="p-4 font-bold text-white max-w-xs truncate">{course.title}</td>
                          <td className="p-4 text-[#00D2FF]">{course.category}</td>
                          <td className="p-4 font-bold text-white">${course.price}</td>
                          <td className="p-4">{course.enrolledCount} enrolled</td>
                          <td className="p-4">
                            <span
                              className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                                course.published
                                  ? 'bg-emerald-500/10 text-emerald-400'
                                  : 'bg-rose-500/10 text-rose-400'
                              }`}
                            >
                              {course.published ? 'Published' : 'Draft'}
                            </span>
                          </td>
                          <td className="p-4 text-right space-x-2">
                            <button
                              onClick={() => {
                                setActiveItem(course);
                                setModalMode('editCourse');
                              }}
                              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={async () => {
                                if (confirm(`Delete course ${course.title}?`)) {
                                  await api.admin.deleteCourse(course.id);
                                  showToast('Course deleted');
                                  loadSection('courses');
                                }
                              }}
                              className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Course Create/Edit Modal */}
              {(modalMode === 'createCourse' || modalMode === 'editCourse') && (
                <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
                  <div className="w-full max-w-2xl bg-[#091129] border border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto relative">
                    <button
                      onClick={() => setModalMode(null)}
                      className="absolute top-5 right-5 p-2 rounded-full bg-white/10 text-slate-300"
                    >
                      <X className="w-5 h-5" />
                    </button>
                    <h3 className="text-xl font-bold text-white mb-6">
                      {modalMode === 'createCourse' ? 'Create New Course' : 'Edit Course'}
                    </h3>

                    <form
                      onSubmit={async (e) => {
                        e.preventDefault();
                        if (modalMode === 'createCourse') {
                          await api.admin.createCourse(activeItem);
                          showToast('Course created successfully');
                        } else {
                          await api.admin.updateCourse(activeItem.id, activeItem);
                          showToast('Course updated');
                        }
                        setModalMode(null);
                        loadSection('courses');
                      }}
                      className="space-y-4 text-xs"
                    >
                      <div>
                        <label className="block text-slate-300 font-semibold mb-1">Course Title</label>
                        <input
                          type="text"
                          required
                          value={activeItem.title}
                          onChange={(e) => setActiveItem({ ...activeItem, title: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-slate-300 font-semibold mb-1">Category</label>
                          <select
                            value={activeItem.categoryId}
                            onChange={(e) =>
                              setActiveItem({ ...activeItem, categoryId: e.target.value })
                            }
                            className="w-full px-4 py-2.5 rounded-xl bg-[#091129] border border-white/10 text-white"
                          >
                            {categories.map((c) => (
                              <option key={c.id} value={c.id}>
                                {c.name}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-slate-300 font-semibold mb-1">Level</label>
                          <select
                            value={activeItem.level}
                            onChange={(e) => setActiveItem({ ...activeItem, level: e.target.value })}
                            className="w-full px-4 py-2.5 rounded-xl bg-[#091129] border border-white/10 text-white"
                          >
                            <option value="Beginner">Beginner</option>
                            <option value="Intermediate">Intermediate</option>
                            <option value="Advanced">Advanced</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <label className="block text-slate-300 font-semibold mb-1">Duration</label>
                          <input
                            type="text"
                            value={activeItem.duration}
                            onChange={(e) => setActiveItem({ ...activeItem, duration: e.target.value })}
                            className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-slate-300 font-semibold mb-1">Price ($)</label>
                          <input
                            type="number"
                            value={activeItem.price}
                            onChange={(e) => setActiveItem({ ...activeItem, price: e.target.value })}
                            className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-slate-300 font-semibold mb-1">Original ($)</label>
                          <input
                            type="number"
                            value={activeItem.originalPrice}
                            onChange={(e) =>
                              setActiveItem({ ...activeItem, originalPrice: e.target.value })
                            }
                            className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-slate-300 font-semibold mb-1">Overview Description</label>
                        <textarea
                          rows={3}
                          value={activeItem.overview}
                          onChange={(e) => setActiveItem({ ...activeItem, overview: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white"
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full py-3 rounded-xl font-bold text-slate-950 bg-gradient-to-r from-[#00D2FF] to-[#38BDF8]"
                      >
                        Save Course
                      </button>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ================= 3. CATEGORIES CRUD ================= */}
          {activeSection === 'categories' && (
            <div className="space-y-6 max-w-7xl mx-auto">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-white">Categories CRUD</h2>
                  <p className="text-xs text-slate-400">Manage course classification categories</p>
                </div>
                <button
                  onClick={() => {
                    setActiveItem({ name: '', description: '' });
                    setModalMode('createCategory');
                  }}
                  className="px-4 py-2 rounded-xl bg-[#00D2FF] text-slate-950 font-bold text-xs"
                >
                  + Add Category
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {categories.map((cat) => (
                  <div
                    key={cat.id}
                    className="p-5 rounded-2xl bg-[#091129] border border-white/10 flex items-center justify-between"
                  >
                    <div>
                      <h4 className="font-bold text-white text-sm">{cat.name}</h4>
                      <p className="text-xs text-slate-400 mt-1">{cat.description}</p>
                    </div>
                    <button
                      onClick={async () => {
                        if (confirm(`Delete ${cat.name}?`)) {
                          await api.admin.deleteCategory(cat.id);
                          showToast('Category deleted');
                          loadSection('categories');
                        }
                      }}
                      className="p-2 text-rose-400 hover:bg-rose-500/10 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              {modalMode === 'createCategory' && (
                <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
                  <div className="w-full max-w-md bg-[#091129] border border-white/15 rounded-3xl p-6 relative space-y-4">
                    <button onClick={() => setModalMode(null)} className="absolute top-5 right-5 text-slate-400">
                      <X className="w-5 h-5" />
                    </button>
                    <h3 className="text-lg font-bold text-white">New Category</h3>
                    <input
                      type="text"
                      placeholder="Category Name"
                      value={activeItem.name}
                      onChange={(e) => setActiveItem({ ...activeItem, name: e.target.value })}
                      className="w-full p-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-xs"
                    />
                    <textarea
                      placeholder="Description"
                      value={activeItem.description}
                      onChange={(e) => setActiveItem({ ...activeItem, description: e.target.value })}
                      className="w-full p-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-xs"
                    />
                    <button
                      onClick={async () => {
                        await api.admin.createCategory(activeItem);
                        showToast('Category created');
                        setModalMode(null);
                        loadSection('categories');
                      }}
                      className="w-full py-2.5 bg-[#00D2FF] text-slate-950 font-bold rounded-xl text-xs"
                    >
                      Create Category
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ================= 4. STUDENTS MANAGEMENT ================= */}
          {activeSection === 'students' && (
            <div className="space-y-6 max-w-7xl mx-auto">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-white">Students Management</h2>
                  <p className="text-xs text-slate-400">Inspect registered learners and enrollment records</p>
                </div>
                <div className="relative w-full sm:w-64">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search student..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white"
                  />
                </div>
              </div>

              <div className="rounded-3xl bg-[#091129] border border-white/10 overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-300">
                    <thead className="bg-white/[0.03] text-slate-400 uppercase tracking-wider border-b border-white/5">
                      <tr>
                        <th className="p-4">Name</th>
                        <th className="p-4">Email</th>
                        <th className="p-4">Enrollments</th>
                        <th className="p-4">Status</th>
                        <th className="p-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {students
                        .filter(
                          (s) =>
                            s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            s.email.toLowerCase().includes(searchQuery.toLowerCase())
                        )
                        .map((s) => (
                          <tr key={s.id} className="hover:bg-white/[0.02]">
                            <td className="p-4 font-bold text-white">{s.name}</td>
                            <td className="p-4 text-slate-400">{s.email}</td>
                            <td className="p-4">
                              <span className="font-semibold text-[#00D2FF]">{s.enrollmentsCount} courses</span>
                            </td>
                            <td className="p-4">
                              <span
                                className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                  s.status === 'active'
                                    ? 'bg-emerald-500/10 text-emerald-400'
                                    : 'bg-rose-500/10 text-rose-400'
                                }`}
                              >
                                {s.status}
                              </span>
                            </td>
                            <td className="p-4 text-right space-x-2">
                              <button
                                onClick={async () => {
                                  const next = s.status === 'active' ? 'suspended' : 'active';
                                  await api.admin.updateStudentStatus(s.id, next as any);
                                  showToast(`Student status changed to ${next}`);
                                  loadSection('students');
                                }}
                                className="px-2.5 py-1 bg-white/5 hover:bg-white/10 rounded-lg text-[11px]"
                              >
                                {s.status === 'active' ? 'Suspend' : 'Activate'}
                              </button>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ================= 5. CONTACT INBOX ================= */}
          {activeSection === 'contact' && (
            <div className="space-y-6 max-w-7xl mx-auto">
              <div>
                <h2 className="text-2xl font-bold text-white">Contact & Admissions Inbox</h2>
                <p className="text-xs text-slate-400">Incoming inquiries from prospective students and enterprises</p>
              </div>

              <div className="space-y-3">
                {contactMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className="p-5 rounded-2xl bg-[#091129] border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div className="space-y-1 max-w-2xl">
                      <div className="flex items-center gap-2 text-xs">
                        <span className="font-bold text-white">{msg.name}</span>
                        <span className="text-slate-500">·</span>
                        <span className="text-[#00D2FF]">{msg.email}</span>
                        <span className="text-slate-500">·</span>
                        <span className="text-[#FF7A00] font-semibold">{msg.topic}</span>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed pt-1">{msg.message}</p>
                    </div>

                    <div className="flex items-center gap-2 self-end md:self-center">
                      <button
                        onClick={async () => {
                          await api.admin.updateContactMessage(msg.id, {
                            status: msg.status === 'read' ? 'replied' : 'read',
                          });
                          showToast('Updated status');
                          loadSection('contact');
                        }}
                        className="px-3 py-1.5 rounded-lg bg-white/5 text-xs text-slate-300 hover:text-white"
                      >
                        {msg.status === 'read' ? 'Mark Replied' : 'Mark Read'}
                      </button>
                      <button
                        onClick={async () => {
                          await api.admin.deleteContactMessage(msg.id);
                          showToast('Message removed');
                          loadSection('contact');
                        }}
                        className="p-1.5 text-rose-400 hover:bg-rose-500/10 rounded-lg"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ================= 6. SETTINGS ================= */}
          {activeSection === 'settings' && siteSettings && (
            <div className="max-w-2xl mx-auto space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-white">Platform Settings</h2>
                <p className="text-xs text-slate-400">Configure global educational portal behaviors</p>
              </div>

              <div className="p-6 rounded-3xl bg-[#091129] border border-white/10 space-y-4 text-xs">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Site Title</label>
                  <input
                    type="text"
                    value={siteSettings.siteName}
                    onChange={(e) => setSiteSettings({ ...siteSettings, siteName: e.target.value })}
                    className="w-full p-2.5 bg-white/5 border border-white/10 rounded-xl text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Tagline</label>
                  <input
                    type="text"
                    value={siteSettings.tagline}
                    onChange={(e) => setSiteSettings({ ...siteSettings, tagline: e.target.value })}
                    className="w-full p-2.5 bg-white/5 border border-white/10 rounded-xl text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Admissions Support Email</label>
                  <input
                    type="email"
                    value={siteSettings.supportEmail}
                    onChange={(e) =>
                      setSiteSettings({ ...siteSettings, supportEmail: e.target.value })
                    }
                    className="w-full p-2.5 bg-white/5 border border-white/10 rounded-xl text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Announcement Banner</label>
                  <input
                    type="text"
                    value={siteSettings.announcementBanner}
                    onChange={(e) =>
                      setSiteSettings({ ...siteSettings, announcementBanner: e.target.value })
                    }
                    className="w-full p-2.5 bg-white/5 border border-white/10 rounded-xl text-white"
                  />
                </div>

                <button
                  onClick={async () => {
                    await api.admin.updateSettings(siteSettings);
                    showToast('Platform settings saved successfully');
                  }}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-[#00D2FF] to-[#38BDF8] text-slate-950 font-bold"
                >
                  Save Global Settings
                </button>
              </div>
            </div>
          )}

          {/* ================= 7. LEARNING PATHS CRUD ================= */}
          {activeSection === 'learningPaths' && (
            <div className="space-y-6 max-w-7xl mx-auto">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-white">Learning Paths CRUD</h2>
                  <p className="text-xs text-slate-400">Manage career transition roadmaps and milestones</p>
                </div>
                <button
                  onClick={() => {
                    setActiveItem({
                      title: '',
                      targetRole: 'Senior Full Stack Engineer',
                      duration: '6 Months',
                      avgSalary: '$140,000 / year',
                      description: '',
                      color: '#00D2FF',
                    });
                    setModalMode('createLearningPath');
                  }}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#00D2FF] to-[#38BDF8] text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Learning Path</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {learningPaths.map((path) => (
                  <div key={path.id} className="p-6 rounded-3xl bg-[#091129] border border-white/10 shadow-xl flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-white/5" style={{ color: path.color || '#00D2FF' }}>
                          {path.duration}
                        </span>
                        <span className="text-xs font-bold text-emerald-400">{path.avgSalary}</span>
                      </div>
                      <h3 className="text-lg font-bold text-white mb-1">{path.title}</h3>
                      <div className="text-xs text-[#00D2FF] font-semibold mb-2">Target: {path.targetRole}</div>
                      <p className="text-xs text-slate-400 leading-relaxed mb-4">{path.description}</p>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-white/5">
                      <span className="text-[11px] text-slate-500">{Array.isArray(path.steps) ? path.steps.length : 0} Milestone Steps</span>
                      <button
                        onClick={async () => {
                          if (confirm(`Delete learning path ${path.title}?`)) {
                            await api.admin.deleteLearningPath(path.id);
                            showToast('Learning path deleted');
                            loadSection('learningPaths');
                          }
                        }}
                        className="p-1.5 text-rose-400 hover:bg-rose-500/10 rounded-lg text-xs flex items-center gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {modalMode === 'createLearningPath' && (
                <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
                  <div className="w-full max-w-lg bg-[#091129] border border-white/15 rounded-3xl p-6 relative space-y-4">
                    <button onClick={() => setModalMode(null)} className="absolute top-5 right-5 text-slate-400"><X className="w-5 h-5" /></button>
                    <h3 className="text-lg font-bold text-white">Create Learning Path</h3>
                    <input
                      type="text"
                      placeholder="Path Title"
                      value={activeItem.title}
                      onChange={(e) => setActiveItem({ ...activeItem, title: e.target.value })}
                      className="w-full p-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-xs"
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="text"
                        placeholder="Target Role"
                        value={activeItem.targetRole}
                        onChange={(e) => setActiveItem({ ...activeItem, targetRole: e.target.value })}
                        className="w-full p-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-xs"
                      />
                      <input
                        type="text"
                        placeholder="Duration (e.g. 6 Months)"
                        value={activeItem.duration}
                        onChange={(e) => setActiveItem({ ...activeItem, duration: e.target.value })}
                        className="w-full p-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-xs"
                      />
                    </div>
                    <input
                      type="text"
                      placeholder="Average Salary (e.g. $145,000 / year)"
                      value={activeItem.avgSalary}
                      onChange={(e) => setActiveItem({ ...activeItem, avgSalary: e.target.value })}
                      className="w-full p-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-xs"
                    />
                    <textarea
                      placeholder="Description"
                      rows={3}
                      value={activeItem.description}
                      onChange={(e) => setActiveItem({ ...activeItem, description: e.target.value })}
                      className="w-full p-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-xs"
                    />
                    <button
                      onClick={async () => {
                        if (!activeItem.title) return alert('Title required');
                        await api.admin.createLearningPath(activeItem);
                        showToast('Learning path created successfully');
                        setModalMode(null);
                        loadSection('learningPaths');
                      }}
                      className="w-full py-2.5 bg-[#00D2FF] text-slate-950 font-bold rounded-xl text-xs"
                    >
                      Save Path
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ================= 8. LESSONS CRUD ================= */}
          {activeSection === 'lessons' && (
            <div className="space-y-6 max-w-7xl mx-auto">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-white">Lessons & Modules CRUD</h2>
                  <p className="text-xs text-slate-400">Curate video and architectural syllabus lessons</p>
                </div>
                <button
                  onClick={() => {
                    setActiveItem({
                      courseId: courses[0]?.id || '',
                      moduleTitle: 'Module 1: Foundations',
                      title: '',
                      duration: '45 mins',
                      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
                      content: '',
                      orderIndex: lessons.length + 1,
                    });
                    setModalMode('createLesson');
                  }}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#00D2FF] to-[#38BDF8] text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Lesson</span>
                </button>
              </div>

              <div className="rounded-3xl bg-[#091129] border border-white/10 overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-300">
                    <thead className="bg-white/[0.03] text-slate-400 uppercase tracking-wider border-b border-white/5">
                      <tr>
                        <th className="p-4">Lesson Title</th>
                        <th className="p-4">Module</th>
                        <th className="p-4">Course</th>
                        <th className="p-4">Duration</th>
                        <th className="p-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {lessons.map((lesson) => {
                        const course = courses.find((c) => c.id === lesson.courseId);
                        return (
                          <tr key={lesson.id} className="hover:bg-white/[0.02]">
                            <td className="p-4 font-bold text-white max-w-xs truncate">{lesson.title}</td>
                            <td className="p-4 text-slate-400 text-[11px]">{lesson.moduleTitle}</td>
                            <td className="p-4 text-[#00D2FF] text-[11px] truncate max-w-[180px]">{course?.title || lesson.courseId}</td>
                            <td className="p-4 text-slate-400">{lesson.duration}</td>
                            <td className="p-4 text-right">
                              <button
                                onClick={async () => {
                                  if (confirm(`Delete lesson ${lesson.title}?`)) {
                                    await api.admin.deleteLesson(lesson.id);
                                    showToast('Lesson deleted');
                                    loadSection('lessons');
                                  }
                                }}
                                className="p-1.5 text-rose-400 hover:bg-rose-500/10 rounded-lg"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {modalMode === 'createLesson' && (
                <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
                  <div className="w-full max-w-lg bg-[#091129] border border-white/15 rounded-3xl p-6 relative space-y-4">
                    <button onClick={() => setModalMode(null)} className="absolute top-5 right-5 text-slate-400"><X className="w-5 h-5" /></button>
                    <h3 className="text-lg font-bold text-white">Create New Lesson</h3>
                    <div>
                      <label className="block text-slate-400 mb-1 text-[11px]">Associated Course</label>
                      <select
                        value={activeItem.courseId}
                        onChange={(e) => setActiveItem({ ...activeItem, courseId: e.target.value })}
                        className="w-full p-2.5 bg-[#091129] border border-white/10 rounded-xl text-white text-xs"
                      >
                        {courses.map((c) => (
                          <option key={c.id} value={c.id}>{c.title}</option>
                        ))}
                      </select>
                    </div>
                    <input
                      type="text"
                      placeholder="Module Title (e.g. Module 1: Core Mechanics)"
                      value={activeItem.moduleTitle}
                      onChange={(e) => setActiveItem({ ...activeItem, moduleTitle: e.target.value })}
                      className="w-full p-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-xs"
                    />
                    <input
                      type="text"
                      placeholder="Lesson Title"
                      value={activeItem.title}
                      onChange={(e) => setActiveItem({ ...activeItem, title: e.target.value })}
                      className="w-full p-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-xs"
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="text"
                        placeholder="Duration (e.g. 50 mins)"
                        value={activeItem.duration}
                        onChange={(e) => setActiveItem({ ...activeItem, duration: e.target.value })}
                        className="w-full p-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-xs"
                      />
                      <input
                        type="text"
                        placeholder="Video Embed URL"
                        value={activeItem.videoUrl}
                        onChange={(e) => setActiveItem({ ...activeItem, videoUrl: e.target.value })}
                        className="w-full p-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-xs"
                      />
                    </div>
                    <textarea
                      placeholder="Lesson Syllabus Notes & Guide"
                      rows={3}
                      value={activeItem.content}
                      onChange={(e) => setActiveItem({ ...activeItem, content: e.target.value })}
                      className="w-full p-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-xs"
                    />
                    <button
                      onClick={async () => {
                        if (!activeItem.title) return alert('Lesson title required');
                        await api.admin.createLesson(activeItem);
                        showToast('Lesson created successfully');
                        setModalMode(null);
                        loadSection('lessons');
                      }}
                      className="w-full py-2.5 bg-[#00D2FF] text-slate-950 font-bold rounded-xl text-xs"
                    >
                      Publish Lesson
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ================= 9. ASSIGNMENTS CRUD ================= */}
          {activeSection === 'assignments' && (
            <div className="space-y-6 max-w-7xl mx-auto">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-white">Assignments CRUD</h2>
                  <p className="text-xs text-slate-400">Milestone challenges and code review assignments</p>
                </div>
                <button
                  onClick={() => {
                    setActiveItem({
                      courseId: courses[0]?.id || '',
                      title: '',
                      description: '',
                      dueDate: '2026-11-15',
                      maxScore: 100,
                    });
                    setModalMode('createAssignment');
                  }}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#00D2FF] to-[#38BDF8] text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Assignment</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {assignments.map((assign) => (
                  <div key={assign.id} className="p-6 rounded-3xl bg-[#091129] border border-white/10 shadow-xl flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[11px] font-semibold text-[#FF7A00]">{assign.courseTitle}</span>
                        <span className="text-[11px] font-bold text-slate-400">Due {assign.dueDate}</span>
                      </div>
                      <h3 className="text-base font-bold text-white mb-2">{assign.title}</h3>
                      <p className="text-xs text-slate-400 leading-relaxed mb-4">{assign.description}</p>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-white/5">
                      <span className="text-xs text-[#00D2FF] font-semibold">Max Score: {assign.maxScore} pts</span>
                      <button
                        onClick={async () => {
                          if (confirm(`Delete assignment ${assign.title}?`)) {
                            await api.admin.deleteAssignment(assign.id);
                            showToast('Assignment deleted');
                            loadSection('assignments');
                          }
                        }}
                        className="p-1.5 text-rose-400 hover:bg-rose-500/10 rounded-lg text-xs flex items-center gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {modalMode === 'createAssignment' && (
                <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
                  <div className="w-full max-w-lg bg-[#091129] border border-white/15 rounded-3xl p-6 relative space-y-4">
                    <button onClick={() => setModalMode(null)} className="absolute top-5 right-5 text-slate-400"><X className="w-5 h-5" /></button>
                    <h3 className="text-lg font-bold text-white">New Assignment</h3>
                    <div>
                      <label className="block text-slate-400 mb-1 text-[11px]">Course</label>
                      <select
                        value={activeItem.courseId}
                        onChange={(e) => setActiveItem({ ...activeItem, courseId: e.target.value })}
                        className="w-full p-2.5 bg-[#091129] border border-white/10 rounded-xl text-white text-xs"
                      >
                        {courses.map((c) => (
                          <option key={c.id} value={c.id}>{c.title}</option>
                        ))}
                      </select>
                    </div>
                    <input
                      type="text"
                      placeholder="Assignment Title"
                      value={activeItem.title}
                      onChange={(e) => setActiveItem({ ...activeItem, title: e.target.value })}
                      className="w-full p-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-xs"
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="date"
                        value={activeItem.dueDate}
                        onChange={(e) => setActiveItem({ ...activeItem, dueDate: e.target.value })}
                        className="w-full p-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-xs"
                      />
                      <input
                        type="number"
                        placeholder="Max Score"
                        value={activeItem.maxScore}
                        onChange={(e) => setActiveItem({ ...activeItem, maxScore: e.target.value })}
                        className="w-full p-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-xs"
                      />
                    </div>
                    <textarea
                      placeholder="Assignment requirements, instructions, and rubrics"
                      rows={3}
                      value={activeItem.description}
                      onChange={(e) => setActiveItem({ ...activeItem, description: e.target.value })}
                      className="w-full p-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-xs"
                    />
                    <button
                      onClick={async () => {
                        if (!activeItem.title) return alert('Title required');
                        await api.admin.createAssignment(activeItem);
                        showToast('Assignment created successfully');
                        setModalMode(null);
                        loadSection('assignments');
                      }}
                      className="w-full py-2.5 bg-[#00D2FF] text-slate-950 font-bold rounded-xl text-xs"
                    >
                      Publish Assignment
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ================= 10. QUIZZES CRUD ================= */}
          {activeSection === 'quizzes' && (
            <div className="space-y-6 max-w-7xl mx-auto">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-white">Quizzes & Assessments CRUD</h2>
                  <p className="text-xs text-slate-400">Technical knowledge assessments and questions</p>
                </div>
                <button
                  onClick={() => {
                    setActiveItem({
                      courseId: courses[0]?.id || '',
                      title: '',
                      passingScore: 80,
                      question: '',
                      optionA: '',
                      optionB: '',
                      optionC: '',
                      optionD: '',
                      correctIndex: 0,
                      explanation: '',
                    });
                    setModalMode('createQuiz');
                  }}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#00D2FF] to-[#38BDF8] text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Technical Quiz</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {quizzes.map((quiz) => (
                  <div key={quiz.id} className="p-6 rounded-3xl bg-[#091129] border border-white/10 shadow-xl flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[11px] font-semibold text-[#00D2FF]">{quiz.courseTitle}</span>
                        <span className="text-xs font-bold text-emerald-400">Pass: {quiz.passingScore}%</span>
                      </div>
                      <h3 className="text-base font-bold text-white mb-2">{quiz.title}</h3>
                      <div className="text-xs text-slate-400 mb-4">{quiz.questionsCount} Multiple-Choice Questions</div>

                      {quiz.questions && quiz.questions.length > 0 && (
                        <div className="p-3 bg-white/[0.02] border border-white/5 rounded-xl mb-4 text-xs space-y-1">
                          <div className="font-semibold text-slate-300 truncate">Q: {quiz.questions[0].question}</div>
                          <div className="text-[11px] text-slate-500">{quiz.questions[0].options?.length} Answer Choices</div>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-end pt-4 border-t border-white/5">
                      <button
                        onClick={async () => {
                          if (confirm(`Delete quiz ${quiz.title}?`)) {
                            await api.admin.deleteQuiz(quiz.id);
                            showToast('Quiz deleted');
                            loadSection('quizzes');
                          }
                        }}
                        className="p-1.5 text-rose-400 hover:bg-rose-500/10 rounded-lg text-xs flex items-center gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {modalMode === 'createQuiz' && (
                <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
                  <div className="w-full max-w-lg bg-[#091129] border border-white/15 rounded-3xl p-6 relative space-y-4 max-h-[90vh] overflow-y-auto">
                    <button onClick={() => setModalMode(null)} className="absolute top-5 right-5 text-slate-400"><X className="w-5 h-5" /></button>
                    <h3 className="text-lg font-bold text-white">Create Technical Quiz</h3>
                    <div>
                      <label className="block text-slate-400 mb-1 text-[11px]">Course</label>
                      <select
                        value={activeItem.courseId}
                        onChange={(e) => setActiveItem({ ...activeItem, courseId: e.target.value })}
                        className="w-full p-2.5 bg-[#091129] border border-white/10 rounded-xl text-white text-xs"
                      >
                        {courses.map((c) => (
                          <option key={c.id} value={c.id}>{c.title}</option>
                        ))}
                      </select>
                    </div>
                    <input
                      type="text"
                      placeholder="Quiz Assessment Title"
                      value={activeItem.title}
                      onChange={(e) => setActiveItem({ ...activeItem, title: e.target.value })}
                      className="w-full p-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-xs"
                    />
                    <input
                      type="number"
                      placeholder="Passing Score % (e.g. 80)"
                      value={activeItem.passingScore}
                      onChange={(e) => setActiveItem({ ...activeItem, passingScore: e.target.value })}
                      className="w-full p-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-xs"
                    />
                    <div className="pt-2 border-t border-white/5 space-y-2">
                      <div className="text-xs font-bold text-white">Initial Question</div>
                      <input
                        type="text"
                        placeholder="Question Prompt"
                        value={activeItem.question}
                        onChange={(e) => setActiveItem({ ...activeItem, question: e.target.value })}
                        className="w-full p-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-xs"
                      />
                      <input
                        type="text"
                        placeholder="Option A (Correct Answer)"
                        value={activeItem.optionA}
                        onChange={(e) => setActiveItem({ ...activeItem, optionA: e.target.value })}
                        className="w-full p-2 bg-white/5 border border-white/10 rounded-xl text-white text-xs"
                      />
                      <input
                        type="text"
                        placeholder="Option B"
                        value={activeItem.optionB}
                        onChange={(e) => setActiveItem({ ...activeItem, optionB: e.target.value })}
                        className="w-full p-2 bg-white/5 border border-white/10 rounded-xl text-white text-xs"
                      />
                      <input
                        type="text"
                        placeholder="Option C"
                        value={activeItem.optionC}
                        onChange={(e) => setActiveItem({ ...activeItem, optionC: e.target.value })}
                        className="w-full p-2 bg-white/5 border border-white/10 rounded-xl text-white text-xs"
                      />
                      <input
                        type="text"
                        placeholder="Option D"
                        value={activeItem.optionD}
                        onChange={(e) => setActiveItem({ ...activeItem, optionD: e.target.value })}
                        className="w-full p-2 bg-white/5 border border-white/10 rounded-xl text-white text-xs"
                      />
                      <input
                        type="text"
                        placeholder="Explanation for Answer"
                        value={activeItem.explanation}
                        onChange={(e) => setActiveItem({ ...activeItem, explanation: e.target.value })}
                        className="w-full p-2 bg-white/5 border border-white/10 rounded-xl text-white text-xs"
                      />
                    </div>
                    <button
                      onClick={async () => {
                        if (!activeItem.title) return alert('Quiz title required');
                        await api.admin.createQuiz({
                          courseId: activeItem.courseId,
                          title: activeItem.title,
                          passingScore: activeItem.passingScore,
                          questions: [
                            {
                              question: activeItem.question || 'Core Concept Check',
                              options: [
                                activeItem.optionA || 'Primary architecture strategy',
                                activeItem.optionB || 'Secondary pattern',
                                activeItem.optionC || 'Deprecated approach',
                                activeItem.optionD || 'Antipattern',
                              ],
                              correctIndex: 0,
                              explanation: activeItem.explanation || 'Verified industry standard pattern.',
                            },
                          ],
                        });
                        showToast('Quiz created successfully');
                        setModalMode(null);
                        loadSection('quizzes');
                      }}
                      className="w-full py-2.5 bg-[#00D2FF] text-slate-950 font-bold rounded-xl text-xs"
                    >
                      Save Quiz & Questions
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ================= 11. TRAINERS CRUD ================= */}
          {activeSection === 'trainers' && (
            <div className="space-y-6 max-w-7xl mx-auto">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-white">Faculty & Trainers CRUD</h2>
                  <p className="text-xs text-slate-400">Manage instructor profiles, credentials, and bios</p>
                </div>
                <button
                  onClick={() => {
                    setActiveItem({
                      name: '',
                      email: '',
                      role: 'Staff Systems Architect',
                      company: 'Ex-Google / Cloud Lead',
                      experience: '10+ Years',
                      bio: '',
                    });
                    setModalMode('createTrainer');
                  }}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#00D2FF] to-[#38BDF8] text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Trainer</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {trainers.map((tr) => (
                  <div key={tr.id} className="p-6 rounded-3xl bg-[#091129] border border-white/10 shadow-xl flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 rounded-2xl bg-[#0B2564] border border-[#00D2FF]/30 flex items-center justify-center font-bold text-[#00D2FF]">
                          {tr.name.charAt(0)}
                        </div>
                        <div>
                          <h4 className="font-bold text-white text-sm">{tr.name}</h4>
                          <div className="text-xs text-[#00D2FF]">{tr.role}</div>
                          <div className="text-[11px] text-slate-400">{tr.company}</div>
                        </div>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed line-clamp-3 mb-4">{tr.bio}</p>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-white/5 text-xs">
                      <span className="text-slate-400">{tr.studentsTaught ? tr.studentsTaught.toLocaleString() : 0} Students</span>
                      <button
                        onClick={async () => {
                          if (confirm(`Delete trainer ${tr.name}?`)) {
                            await api.admin.deleteTrainer(tr.id);
                            showToast('Trainer deleted');
                            loadSection('trainers');
                          }
                        }}
                        className="p-1.5 text-rose-400 hover:bg-rose-500/10 rounded-lg flex items-center gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {modalMode === 'createTrainer' && (
                <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
                  <div className="w-full max-w-md bg-[#091129] border border-white/15 rounded-3xl p-6 relative space-y-4">
                    <button onClick={() => setModalMode(null)} className="absolute top-5 right-5 text-slate-400"><X className="w-5 h-5" /></button>
                    <h3 className="text-lg font-bold text-white">Add Faculty Instructor</h3>
                    <input
                      type="text"
                      placeholder="Full Name"
                      value={activeItem.name}
                      onChange={(e) => setActiveItem({ ...activeItem, name: e.target.value })}
                      className="w-full p-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-xs"
                    />
                    <input
                      type="email"
                      placeholder="Email"
                      value={activeItem.email}
                      onChange={(e) => setActiveItem({ ...activeItem, email: e.target.value })}
                      className="w-full p-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-xs"
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="text"
                        placeholder="Title / Role"
                        value={activeItem.role}
                        onChange={(e) => setActiveItem({ ...activeItem, role: e.target.value })}
                        className="w-full p-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-xs"
                      />
                      <input
                        type="text"
                        placeholder="Company Affiliation"
                        value={activeItem.company}
                        onChange={(e) => setActiveItem({ ...activeItem, company: e.target.value })}
                        className="w-full p-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-xs"
                      />
                    </div>
                    <textarea
                      placeholder="Biography and engineering leadership credentials"
                      rows={3}
                      value={activeItem.bio}
                      onChange={(e) => setActiveItem({ ...activeItem, bio: e.target.value })}
                      className="w-full p-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-xs"
                    />
                    <button
                      onClick={async () => {
                        if (!activeItem.name || !activeItem.email) return alert('Name and email required');
                        await api.admin.createTrainer(activeItem);
                        showToast('Trainer created successfully');
                        setModalMode(null);
                        loadSection('trainers');
                      }}
                      className="w-full py-2.5 bg-[#00D2FF] text-slate-950 font-bold rounded-xl text-xs"
                    >
                      Save Trainer
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ================= 12. ENROLLMENTS ================= */}
          {activeSection === 'enrollments' && (
            <div className="space-y-6 max-w-7xl mx-auto">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-white">Enrollments Management</h2>
                  <p className="text-xs text-slate-400">Direct database enrollments and active progress</p>
                </div>
                <button
                  onClick={() => {
                    setActiveItem({
                      studentId: students[0]?.id || '',
                      courseId: courses[0]?.id || '',
                    });
                    setModalMode('manualEnroll');
                  }}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#00D2FF] to-[#38BDF8] text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow"
                >
                  <Plus className="w-4 h-4" />
                  <span>Manual Enroll Student</span>
                </button>
              </div>

              <div className="rounded-3xl bg-[#091129] border border-white/10 overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-300">
                    <thead className="bg-white/[0.03] text-slate-400 uppercase tracking-wider border-b border-white/5">
                      <tr>
                        <th className="p-4">Student</th>
                        <th className="p-4">Course</th>
                        <th className="p-4">Progress</th>
                        <th className="p-4">Status</th>
                        <th className="p-4">Enrolled At</th>
                        <th className="p-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {enrollments.map((enr) => (
                        <tr key={enr.id} className="hover:bg-white/[0.02]">
                          <td className="p-4 font-bold text-white">
                            {enr.studentName}
                            <div className="text-[11px] text-slate-400 font-normal">{enr.studentEmail}</div>
                          </td>
                          <td className="p-4 text-[#00D2FF] max-w-xs truncate">{enr.courseTitle}</td>
                          <td className="p-4 font-semibold">{enr.progress_percentage ?? enr.progressPercentage}%</td>
                          <td className="p-4">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400">
                              {enr.status}
                            </span>
                          </td>
                          <td className="p-4 text-slate-400 text-[11px]">{enr.enrolled_at || enr.enrolledAt}</td>
                          <td className="p-4 text-right">
                            <button
                              onClick={async () => {
                                if (confirm(`Revoke enrollment for ${enr.studentName}?`)) {
                                  await api.admin.deleteEnrollment(enr.id);
                                  showToast('Enrollment cancelled');
                                  loadSection('enrollments');
                                }
                              }}
                              className="p-1.5 text-rose-400 hover:bg-rose-500/10 rounded-lg"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {modalMode === 'manualEnroll' && (
                <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
                  <div className="w-full max-w-md bg-[#091129] border border-white/15 rounded-3xl p-6 relative space-y-4">
                    <button onClick={() => setModalMode(null)} className="absolute top-5 right-5 text-slate-400"><X className="w-5 h-5" /></button>
                    <h3 className="text-lg font-bold text-white">Manual Student Enrollment</h3>
                    <div>
                      <label className="block text-slate-400 mb-1 text-[11px]">Select Student</label>
                      <select
                        value={activeItem.studentId}
                        onChange={(e) => setActiveItem({ ...activeItem, studentId: e.target.value })}
                        className="w-full p-2.5 bg-[#091129] border border-white/10 rounded-xl text-white text-xs"
                      >
                        {students.map((s) => (
                          <option key={s.id} value={s.id}>{s.name} ({s.email})</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-slate-400 mb-1 text-[11px]">Select Course</label>
                      <select
                        value={activeItem.courseId}
                        onChange={(e) => setActiveItem({ ...activeItem, courseId: e.target.value })}
                        className="w-full p-2.5 bg-[#091129] border border-white/10 rounded-xl text-white text-xs"
                      >
                        {courses.map((c) => (
                          <option key={c.id} value={c.id}>{c.title}</option>
                        ))}
                      </select>
                    </div>
                    <button
                      onClick={async () => {
                        await api.admin.enrollStudentManual(activeItem.studentId, activeItem.courseId);
                        showToast('Student enrolled successfully');
                        setModalMode(null);
                        loadSection('enrollments');
                      }}
                      className="w-full py-2.5 bg-[#00D2FF] text-slate-950 font-bold rounded-xl text-xs"
                    >
                      Authorize Enrollment
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ================= 13. PAYMENTS ================= */}
          {activeSection === 'payments' && (
            <div className="space-y-6 max-w-7xl mx-auto">
              <div>
                <h2 className="text-2xl font-bold text-white">Payments & Tuition Ledger</h2>
                <p className="text-xs text-slate-400">Direct transaction records and payment verification</p>
              </div>

              <div className="rounded-3xl bg-[#091129] border border-white/10 overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-300">
                    <thead className="bg-white/[0.03] text-slate-400 uppercase tracking-wider border-b border-white/5">
                      <tr>
                        <th className="p-4">Transaction Ref</th>
                        <th className="p-4">Student</th>
                        <th className="p-4">Course</th>
                        <th className="p-4">Amount</th>
                        <th className="p-4">Method</th>
                        <th className="p-4">Status</th>
                        <th className="p-4">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {payments.map((p) => (
                        <tr key={p.id} className="hover:bg-white/[0.02]">
                          <td className="p-4 font-mono text-[11px] text-[#00D2FF]">{p.transaction_ref || p.transactionRef}</td>
                          <td className="p-4 font-bold text-white">{p.studentName}</td>
                          <td className="p-4 max-w-xs truncate">{p.courseTitle}</td>
                          <td className="p-4 font-bold text-emerald-400">${p.amount} {p.currency}</td>
                          <td className="p-4 text-slate-400">{p.payment_method || p.paymentMethod}</td>
                          <td className="p-4">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400">
                              {p.status}
                            </span>
                          </td>
                          <td className="p-4 text-slate-400 text-[11px]">{p.created_at || p.createdAt}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ================= 14. TESTIMONIALS CRUD ================= */}
          {activeSection === 'testimonials' && (
            <div className="space-y-6 max-w-7xl mx-auto">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-white">Testimonials CRUD</h2>
                  <p className="text-xs text-slate-400">Alumni career transformation reviews</p>
                </div>
                <button
                  onClick={() => {
                    setActiveItem({
                      name: '',
                      role: 'Senior Software Engineer',
                      company: 'Microsoft',
                      text: '',
                      rating: 5,
                    });
                    setModalMode('createTestimonial');
                  }}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#00D2FF] to-[#38BDF8] text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Testimonial</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {testimonials.map((t) => (
                  <div key={t.id} className="p-6 rounded-3xl bg-[#091129] border border-white/10 shadow-xl flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="font-bold text-white">{t.name}</div>
                        <div className="text-xs font-bold text-[#FF7A00]">{'★'.repeat(t.rating)}</div>
                      </div>
                      <div className="text-xs text-[#00D2FF] mb-3">{t.role} · {t.company}</div>
                      <p className="text-xs text-slate-300 italic leading-relaxed mb-4">"{t.text}"</p>
                    </div>

                    <div className="flex justify-end pt-3 border-t border-white/5">
                      <button
                        onClick={async () => {
                          if (confirm(`Delete testimonial from ${t.name}?`)) {
                            await api.admin.deleteTestimonial(t.id);
                            showToast('Testimonial deleted');
                            loadSection('testimonials');
                          }
                        }}
                        className="p-1.5 text-rose-400 hover:bg-rose-500/10 rounded-lg text-xs flex items-center gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {modalMode === 'createTestimonial' && (
                <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
                  <div className="w-full max-w-md bg-[#091129] border border-white/15 rounded-3xl p-6 relative space-y-4">
                    <button onClick={() => setModalMode(null)} className="absolute top-5 right-5 text-slate-400"><X className="w-5 h-5" /></button>
                    <h3 className="text-lg font-bold text-white">Add Alumni Testimonial</h3>
                    <input
                      type="text"
                      placeholder="Graduate Name"
                      value={activeItem.name}
                      onChange={(e) => setActiveItem({ ...activeItem, name: e.target.value })}
                      className="w-full p-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-xs"
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="text"
                        placeholder="Job Title"
                        value={activeItem.role}
                        onChange={(e) => setActiveItem({ ...activeItem, role: e.target.value })}
                        className="w-full p-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-xs"
                      />
                      <input
                        type="text"
                        placeholder="Hiring Company"
                        value={activeItem.company}
                        onChange={(e) => setActiveItem({ ...activeItem, company: e.target.value })}
                        className="w-full p-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-xs"
                      />
                    </div>
                    <textarea
                      placeholder="Student review quote"
                      rows={3}
                      value={activeItem.text}
                      onChange={(e) => setActiveItem({ ...activeItem, text: e.target.value })}
                      className="w-full p-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-xs"
                    />
                    <button
                      onClick={async () => {
                        if (!activeItem.name || !activeItem.text) return alert('Name and quote text required');
                        await api.admin.createTestimonial(activeItem);
                        showToast('Testimonial published');
                        setModalMode(null);
                        loadSection('testimonials');
                      }}
                      className="w-full py-2.5 bg-[#00D2FF] text-slate-950 font-bold rounded-xl text-xs"
                    >
                      Publish Testimonial
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ================= 15. BLOG CRUD ================= */}
          {activeSection === 'blog' && (
            <div className="space-y-6 max-w-7xl mx-auto">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-white">Engineering Blog CRUD</h2>
                  <p className="text-xs text-slate-400">Publish architectural articles and research publications</p>
                </div>
                <button
                  onClick={() => {
                    setActiveItem({
                      title: '',
                      category: 'Architecture',
                      readTime: '6 min read',
                      content: '',
                      excerpt: '',
                    });
                    setModalMode('createBlog');
                  }}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#00D2FF] to-[#38BDF8] text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow"
                >
                  <Plus className="w-4 h-4" />
                  <span>Write Article</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {blogPosts.map((post) => (
                  <div key={post.id} className="p-6 rounded-3xl bg-[#091129] border border-white/10 shadow-xl flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 text-[11px] text-slate-400 mb-2">
                        <span className="text-[#00D2FF] font-semibold">{post.category}</span>
                        <span>·</span>
                        <span>{post.read_time || post.readTime}</span>
                        <span>·</span>
                        <span>{post.date}</span>
                      </div>
                      <h3 className="text-base font-bold text-white mb-2">{post.title}</h3>
                      <p className="text-xs text-slate-400 leading-relaxed mb-4 line-clamp-3">{post.excerpt || post.content}</p>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-white/5 text-xs">
                      <span className="text-slate-500">By {post.author}</span>
                      <button
                        onClick={async () => {
                          if (confirm(`Delete article ${post.title}?`)) {
                            await api.admin.deleteBlogPost(post.id);
                            showToast('Article deleted');
                            loadSection('blog');
                          }
                        }}
                        className="p-1.5 text-rose-400 hover:bg-rose-500/10 rounded-lg flex items-center gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {modalMode === 'createBlog' && (
                <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
                  <div className="w-full max-w-xl bg-[#091129] border border-white/15 rounded-3xl p-6 relative space-y-4 max-h-[90vh] overflow-y-auto">
                    <button onClick={() => setModalMode(null)} className="absolute top-5 right-5 text-slate-400"><X className="w-5 h-5" /></button>
                    <h3 className="text-lg font-bold text-white">Publish New Article</h3>
                    <input
                      type="text"
                      placeholder="Article Title"
                      value={activeItem.title}
                      onChange={(e) => setActiveItem({ ...activeItem, title: e.target.value })}
                      className="w-full p-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-xs"
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="text"
                        placeholder="Category (e.g. AI Trends, Full Stack)"
                        value={activeItem.category}
                        onChange={(e) => setActiveItem({ ...activeItem, category: e.target.value })}
                        className="w-full p-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-xs"
                      />
                      <input
                        type="text"
                        placeholder="Read Time (e.g. 7 min read)"
                        value={activeItem.readTime}
                        onChange={(e) => setActiveItem({ ...activeItem, readTime: e.target.value })}
                        className="w-full p-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-xs"
                      />
                    </div>
                    <textarea
                      placeholder="Excerpt / Summary"
                      rows={2}
                      value={activeItem.excerpt}
                      onChange={(e) => setActiveItem({ ...activeItem, excerpt: e.target.value })}
                      className="w-full p-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-xs"
                    />
                    <textarea
                      placeholder="Full Article Content (Markdown or Text)"
                      rows={6}
                      value={activeItem.content}
                      onChange={(e) => setActiveItem({ ...activeItem, content: e.target.value })}
                      className="w-full p-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-xs"
                    />
                    <button
                      onClick={async () => {
                        if (!activeItem.title || !activeItem.content) return alert('Title and content required');
                        await api.admin.createBlogPost(activeItem);
                        showToast('Article published to blog');
                        setModalMode(null);
                        loadSection('blog');
                      }}
                      className="w-full py-2.5 bg-[#00D2FF] text-slate-950 font-bold rounded-xl text-xs"
                    >
                      Publish Article
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ================= 16. CERTIFICATES ================= */}
          {activeSection === 'certificates' && (
            <div className="space-y-6 max-w-7xl mx-auto">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-white">Issued Certificates</h2>
                  <p className="text-xs text-slate-400">Verified graduate credentials with cryptographic verification codes</p>
                </div>
                <button
                  onClick={() => {
                    setActiveItem({
                      studentId: students[0]?.id || '',
                      courseId: courses[0]?.id || '',
                      grade: 'Distinction (96%)',
                    });
                    setModalMode('issueCert');
                  }}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#00D2FF] to-[#38BDF8] text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow"
                >
                  <Plus className="w-4 h-4" />
                  <span>Issue Certificate</span>
                </button>
              </div>

              <div className="rounded-3xl bg-[#091129] border border-white/10 overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-300">
                    <thead className="bg-white/[0.03] text-slate-400 uppercase tracking-wider border-b border-white/5">
                      <tr>
                        <th className="p-4">Certificate Code</th>
                        <th className="p-4">Graduate Student</th>
                        <th className="p-4">Course</th>
                        <th className="p-4">Grade</th>
                        <th className="p-4">Issued Date</th>
                        <th className="p-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {certificates.map((cert) => (
                        <tr key={cert.id} className="hover:bg-white/[0.02]">
                          <td className="p-4 font-mono font-bold text-[#00D2FF]">{cert.certificate_code || cert.certificateCode}</td>
                          <td className="p-4 font-bold text-white">
                            {cert.studentName}
                            <div className="text-[11px] text-slate-400 font-normal">{cert.studentEmail}</div>
                          </td>
                          <td className="p-4 max-w-xs truncate">{cert.courseTitle}</td>
                          <td className="p-4 font-semibold text-emerald-400">{cert.grade}</td>
                          <td className="p-4 text-slate-400 text-[11px]">{cert.issue_date || cert.issueDate}</td>
                          <td className="p-4 text-right">
                            <button
                              onClick={async () => {
                                if (confirm(`Revoke certificate ${cert.certificate_code || cert.certificateCode}?`)) {
                                  await api.admin.revokeCertificate(cert.id);
                                  showToast('Certificate revoked');
                                  loadSection('certificates');
                                }
                              }}
                              className="p-1.5 text-rose-400 hover:bg-rose-500/10 rounded-lg"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {modalMode === 'issueCert' && (
                <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
                  <div className="w-full max-w-md bg-[#091129] border border-white/15 rounded-3xl p-6 relative space-y-4">
                    <button onClick={() => setModalMode(null)} className="absolute top-5 right-5 text-slate-400"><X className="w-5 h-5" /></button>
                    <h3 className="text-lg font-bold text-white">Issue Graduate Certificate</h3>
                    <div>
                      <label className="block text-slate-400 mb-1 text-[11px]">Select Student</label>
                      <select
                        value={activeItem.studentId}
                        onChange={(e) => setActiveItem({ ...activeItem, studentId: e.target.value })}
                        className="w-full p-2.5 bg-[#091129] border border-white/10 rounded-xl text-white text-xs"
                      >
                        {students.map((s) => (
                          <option key={s.id} value={s.id}>{s.name} ({s.email})</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-slate-400 mb-1 text-[11px]">Select Course</label>
                      <select
                        value={activeItem.courseId}
                        onChange={(e) => setActiveItem({ ...activeItem, courseId: e.target.value })}
                        className="w-full p-2.5 bg-[#091129] border border-white/10 rounded-xl text-white text-xs"
                      >
                        {courses.map((c) => (
                          <option key={c.id} value={c.id}>{c.title}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-slate-400 mb-1 text-[11px]">Honors Grade</label>
                      <input
                        type="text"
                        placeholder="Grade (e.g. Distinction 98%)"
                        value={activeItem.grade}
                        onChange={(e) => setActiveItem({ ...activeItem, grade: e.target.value })}
                        className="w-full p-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-xs"
                      />
                    </div>
                    <button
                      onClick={async () => {
                        await api.admin.issueCertificate(activeItem);
                        showToast('Certificate generated and issued to graduate');
                        setModalMode(null);
                        loadSection('certificates');
                      }}
                      className="w-full py-2.5 bg-[#00D2FF] text-slate-950 font-bold rounded-xl text-xs"
                    >
                      Issue Official Certificate
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ================= 17. NEWSLETTER ================= */}
          {activeSection === 'newsletter' && (
            <div className="space-y-6 max-w-7xl mx-auto">
              <div>
                <h2 className="text-2xl font-bold text-white">Newsletter Subscribers</h2>
                <p className="text-xs text-slate-400">Total active subscribers: {subscribers.length}</p>
              </div>

              <div className="rounded-3xl bg-[#091129] border border-white/10 overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-300">
                    <thead className="bg-white/[0.03] text-slate-400 uppercase tracking-wider border-b border-white/5">
                      <tr>
                        <th className="p-4">Subscriber Email</th>
                        <th className="p-4">Subscribed Date</th>
                        <th className="p-4">Status</th>
                        <th className="p-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {subscribers.map((sub) => (
                        <tr key={sub.id} className="hover:bg-white/[0.02]">
                          <td className="p-4 font-bold text-white">{sub.email}</td>
                          <td className="p-4 text-slate-400 text-[11px]">{sub.subscribed_at || sub.subscribedAt}</td>
                          <td className="p-4">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400">
                              Active
                            </span>
                          </td>
                          <td className="p-4 text-right">
                            <button
                              onClick={async () => {
                                if (confirm(`Remove subscriber ${sub.email}?`)) {
                                  await api.admin.deleteNewsletter(sub.id);
                                  showToast('Subscriber removed');
                                  loadSection('newsletter');
                                }
                              }}
                              className="p-1.5 text-rose-400 hover:bg-rose-500/10 rounded-lg"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
};
