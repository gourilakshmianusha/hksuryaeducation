import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Logo } from '../Logo';
import {
  BookOpen,
  CheckCircle,
  Clock,
  Award,
  FileText,
  HelpCircle,
  User,
  LogOut,
  Play,
  ArrowRight,
  ExternalLink,
  ChevronRight,
  RefreshCw,
  Send,
  X,
  Shield,
  Layers,
  Sparkles,
} from 'lucide-react';

interface StudentDashboardProps {
  user: any;
  onLogout: () => void;
  onBrowseCourses: () => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  user,
  onLogout,
  onBrowseCourses,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'courses' | 'assignments' | 'quizzes' | 'certificates' | 'profile'>('overview');
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [learningCourseId, setLearningCourseId] = useState<string | null>(null);
  const [learnData, setLearnData] = useState<any>(null);
  const [activeLesson, setActiveLesson] = useState<any>(null);
  const [submittingAssignment, setSubmittingAssignment] = useState<any>(null);
  const [submissionText, setSubmissionText] = useState('');
  const [activeQuiz, setActiveQuiz] = useState<any>(null);
  const [quizAnswers, setQuizAnswers] = useState<number[]>([]);
  const [quizResult, setQuizResult] = useState<any>(null);
  const [viewingCertificate, setViewingCertificate] = useState<any>(null);
  const [profileForm, setProfileForm] = useState({
    name: user.name || '',
    bio: user.bio || '',
    currentPassword: '',
    newPassword: '',
  });
  const [feedbackMsg, setFeedbackMsg] = useState('');

  const loadDashboard = async () => {
    try {
      setLoading(true);
      const data = await api.student.getDashboard();
      setDashboardData(data);
    } catch (err: any) {
      console.error('Failed to load dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const openCoursePlayer = async (courseId: string) => {
    try {
      setLoading(true);
      const data = await api.student.getCourseLearn(courseId);
      setLearnData(data);
      setLearningCourseId(courseId);
      if (data.lessons && data.lessons.length > 0) {
        // default to first incomplete lesson or first lesson
        const firstIncomplete = data.lessons.find((l: any) => !l.isCompleted) || data.lessons[0];
        setActiveLesson(firstIncomplete);
      }
    } catch (err: any) {
      alert(err.message || 'Could not load course lessons');
    } finally {
      setLoading(false);
    }
  };

  const toggleLesson = async (lessonId: string) => {
    try {
      const res = await api.student.toggleLesson(lessonId);
      if (learnData) {
        setLearnData({
          ...learnData,
          lessons: learnData.lessons.map((l: any) =>
            l.id === lessonId ? { ...l, isCompleted: res.completed } : l
          ),
          progressPercentage: res.progressPercentage,
        });
      }
      loadDashboard();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleAssignmentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!submittingAssignment || !submissionText) return;
    try {
      await api.student.submitAssignment(submittingAssignment.id, submissionText);
      setFeedbackMsg('Assignment submitted successfully!');
      setSubmittingAssignment(null);
      setSubmissionText('');
      loadDashboard();
      setTimeout(() => setFeedbackMsg(''), 4000);
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleStartQuiz = (quiz: any) => {
    setActiveQuiz(quiz);
    setQuizAnswers(new Array(quiz.questions.length).fill(-1));
    setQuizResult(null);
  };

  const handleQuizSubmit = async () => {
    if (!activeQuiz) return;
    if (quizAnswers.some((a) => a === -1)) {
      alert('Please answer all questions before submitting.');
      return;
    }
    try {
      const result = await api.student.submitQuiz(activeQuiz.id, quizAnswers);
      setQuizResult(result);
      loadDashboard();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.auth.updateProfile(profileForm);
      setFeedbackMsg('Profile updated successfully!');
      setTimeout(() => setFeedbackMsg(''), 4000);
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#050A1A] text-slate-100 flex flex-col pt-20">
      {/* Top Banner / Student Navigation Header */}
      <div className="bg-[#070D22] border-b border-white/10 px-4 sm:px-8 py-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#0B2564] to-[#00D2FF]/30 border border-[#00D2FF]/40 flex items-center justify-center text-xl font-bold text-[#00D2FF]">
              {user.name?.charAt(0) || 'S'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-white">{user.name}</h1>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-blue-500/10 text-[#00D2FF] border border-[#00D2FF]/30">
                  Student Portal
                </span>
              </div>
              <p className="text-xs text-slate-400">{user.email}</p>
            </div>
          </div>

          {/* Quick tab controls */}
          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: 'overview', label: 'Overview', icon: Layers },
              { id: 'courses', label: 'My Courses', icon: BookOpen },
              { id: 'assignments', label: 'Assignments', icon: FileText },
              { id: 'quizzes', label: 'Quizzes', icon: HelpCircle },
              { id: 'certificates', label: 'Certificates', icon: Award },
              { id: 'profile', label: 'Profile', icon: User },
            ].map((tab) => {
              const IconComp = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id as any);
                    setLearningCourseId(null);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                    activeTab === tab.id && !learningCourseId
                      ? 'bg-[#00D2FF] text-slate-950 font-bold shadow'
                      : 'bg-white/[0.03] text-slate-300 hover:text-white hover:bg-white/[0.08]'
                  }`}
                >
                  <IconComp className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}

            <button
              onClick={onLogout}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 flex items-center gap-1.5 transition-colors cursor-pointer ml-2"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </div>

      {/* Global Feedback Banner */}
      {feedbackMsg && (
        <div className="max-w-7xl mx-auto px-4 mt-4 w-full">
          <div className="p-3 bg-emerald-500/15 border border-emerald-500/30 rounded-xl text-xs text-emerald-300 flex items-center gap-2">
            <CheckCircle className="w-4 h-4 shrink-0" />
            <span>{feedbackMsg}</span>
          </div>
        </div>
      )}

      {/* MAIN PORTAL BODY */}
      <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* ================= 1. INTERACTIVE COURSE PLAYER VIEW ================= */}
        {learningCourseId && learnData ? (
          <div className="space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div>
                <button
                  onClick={() => setLearningCourseId(null)}
                  className="text-xs text-[#00D2FF] hover:underline flex items-center gap-1 mb-1"
                >
                  ← Back to Dashboard
                </button>
                <h2 className="text-2xl font-bold text-white">{learnData.course.title}</h2>
                <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                  <span>Instructor: {learnData.course.trainerName}</span>
                  <span>·</span>
                  <span>
                    {learnData.completedLessons} of {learnData.totalLessons} Lessons Completed
                  </span>
                  <span>·</span>
                  <span className="text-[#00D2FF] font-bold">
                    {learnData.progressPercentage}% Complete
                  </span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-48 hidden md:block">
                <div className="h-2.5 w-full bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#00D2FF] to-[#FF7A00] transition-all duration-300"
                    style={{ width: `${learnData.progressPercentage}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Lesson Video & Content Stream (8 cols) */}
              <div className="lg:col-span-8 space-y-6">
                {activeLesson ? (
                  <div className="rounded-3xl bg-[#091129] border border-white/10 overflow-hidden shadow-2xl p-6 sm:p-8">
                    {/* Video Player Box */}
                    <div className="relative aspect-video rounded-2xl overflow-hidden bg-black/60 border border-white/10 mb-6 flex items-center justify-center">
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10" />
                      <div className="text-center z-20 p-6">
                        <div className="w-16 h-16 rounded-full bg-[#00D2FF]/20 border border-[#00D2FF]/60 flex items-center justify-center mx-auto mb-3 shadow-lg glow-cyan">
                          <Play className="w-6 h-6 text-[#00D2FF] ml-1" />
                        </div>
                        <h4 className="text-lg font-bold text-white mb-1">{activeLesson.title}</h4>
                        <p className="text-xs text-slate-300">
                          Interactive Masterclass Stream · {activeLesson.duration}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
                      <div>
                        <div className="text-xs font-semibold text-[#00D2FF] mb-1">
                          {activeLesson.moduleTitle}
                        </div>
                        <h3 className="text-xl font-bold text-white">{activeLesson.title}</h3>
                      </div>

                      <button
                        onClick={() => toggleLesson(activeLesson.id)}
                        className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                          activeLesson.isCompleted
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                            : 'bg-gradient-to-r from-[#00D2FF] to-[#38BDF8] text-slate-950 font-bold hover:brightness-110 shadow-md shadow-cyan-500/20'
                        }`}
                      >
                        <CheckCircle className="w-4 h-4" />
                        <span>{activeLesson.isCompleted ? 'Completed ✓' : 'Mark as Completed'}</span>
                      </button>
                    </div>

                    {/* Lesson Text Guide */}
                    <div className="pt-6 space-y-4">
                      <h4 className="text-sm font-bold text-white uppercase tracking-wider">
                        Architectural Concept & Lab Notes
                      </h4>
                      <p className="text-sm text-slate-300 leading-relaxed">
                        {activeLesson.content}
                      </p>

                      {activeLesson.resources && activeLesson.resources.length > 0 && (
                        <div className="pt-4">
                          <div className="text-xs font-bold text-slate-400 mb-2">Lesson Artifacts & Resources:</div>
                          <div className="flex flex-wrap gap-2">
                            {activeLesson.resources.map((res: any, idx: number) => (
                              <a
                                key={idx}
                                href={res.url}
                                onClick={(e) => {
                                  e.preventDefault();
                                  alert(`Downloading resource: ${res.name}`);
                                }}
                                className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-[#00D2FF] flex items-center gap-1.5"
                              >
                                <ExternalLink className="w-3.5 h-3.5" />
                                <span>{res.name}</span>
                              </a>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="p-12 text-center text-slate-400">Select a lesson from the curriculum</div>
                )}
              </div>

              {/* Lesson Playlist Drawer (4 cols) */}
              <div className="lg:col-span-4 space-y-4">
                <div className="rounded-3xl bg-[#091129] border border-white/10 p-5 shadow-xl">
                  <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center justify-between">
                    <span>Curriculum Syllabus</span>
                    <span className="text-xs text-slate-400 font-mono">
                      {learnData.lessons.length} Lessons
                    </span>
                  </h4>

                  <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
                    {learnData.lessons.map((lesson: any, index: number) => {
                      const isCurrent = activeLesson?.id === lesson.id;
                      return (
                        <div
                          key={lesson.id}
                          onClick={() => setActiveLesson(lesson)}
                          className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                            isCurrent
                              ? 'bg-blue-900/40 border-[#00D2FF]/60 shadow'
                              : 'bg-white/[0.02] border-white/5 hover:bg-white/[0.04]'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <span
                              className={`w-6 h-6 rounded-lg text-xs font-bold flex items-center justify-center ${
                                lesson.isCompleted
                                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                  : 'bg-white/5 text-slate-400'
                              }`}
                            >
                              {lesson.isCompleted ? '✓' : index + 1}
                            </span>
                            <div>
                              <div
                                className={`text-xs font-bold line-clamp-1 ${
                                  isCurrent ? 'text-[#00D2FF]' : 'text-slate-200'
                                }`}
                              >
                                {lesson.title}
                              </div>
                              <div className="text-[11px] text-slate-400">{lesson.duration}</div>
                            </div>
                          </div>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleLesson(lesson.id);
                            }}
                            className={`p-1 rounded-md text-xs ${
                              lesson.isCompleted ? 'text-emerald-400' : 'text-slate-500 hover:text-white'
                            }`}
                            title={lesson.isCompleted ? 'Completed' : 'Mark complete'}
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : null}

        {/* ================= 2. DASHBOARD OVERVIEW ================= */}
        {!learningCourseId && activeTab === 'overview' && (
          <div className="space-y-8">
            {/* KPI Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-6 rounded-3xl bg-[#091129] border border-white/10 shadow-xl">
                <div className="flex items-center justify-between text-slate-400 mb-2">
                  <span className="text-xs font-semibold">Active Enrollments</span>
                  <BookOpen className="w-4 h-4 text-[#00D2FF]" />
                </div>
                <div className="text-3xl font-black text-white tabular-nums">
                  {dashboardData?.stats?.enrolledCourses || 0}
                </div>
                <div className="text-xs text-slate-400 mt-1">Bootcamps in progress</div>
              </div>

              <div className="p-6 rounded-3xl bg-[#091129] border border-white/10 shadow-xl">
                <div className="flex items-center justify-between text-slate-400 mb-2">
                  <span className="text-xs font-semibold">Completed Units</span>
                  <CheckCircle className="w-4 h-4 text-[#FF7A00]" />
                </div>
                <div className="text-3xl font-black text-white tabular-nums">
                  {dashboardData?.stats?.completedLessons || 0}
                </div>
                <div className="text-xs text-slate-400 mt-1">Verified lab hours</div>
              </div>

              <div className="p-6 rounded-3xl bg-[#091129] border border-white/10 shadow-xl">
                <div className="flex items-center justify-between text-slate-400 mb-2">
                  <span className="text-xs font-semibold">Earned Certificates</span>
                  <Award className="w-4 h-4 text-[#FBBF24]" />
                </div>
                <div className="text-3xl font-black text-white tabular-nums">
                  {dashboardData?.stats?.certificatesEarned || 0}
                </div>
                <div className="text-xs text-slate-400 mt-1">Industry accredited</div>
              </div>

              <div className="p-6 rounded-3xl bg-[#091129] border border-white/10 shadow-xl">
                <div className="flex items-center justify-between text-slate-400 mb-2">
                  <span className="text-xs font-semibold">Assignments Turned In</span>
                  <FileText className="w-4 h-4 text-[#00D2FF]" />
                </div>
                <div className="text-3xl font-black text-white tabular-nums">
                  {dashboardData?.stats?.assignmentsCompleted || 0}
                </div>
                <div className="text-xs text-slate-400 mt-1">Peer & faculty graded</div>
              </div>
            </div>

            {/* Active Enrolled Courses */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-white">My Active Courses</h3>
                <button
                  onClick={() => setActiveTab('courses')}
                  className="text-xs text-[#00D2FF] hover:underline"
                >
                  View All ({dashboardData?.courses?.length || 0})
                </button>
              </div>

              {dashboardData?.courses && dashboardData.courses.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {dashboardData.courses.map((course: any) => (
                    <div
                      key={course.enrollmentId}
                      className="p-6 rounded-3xl bg-[#091129] border border-white/10 hover:border-[#00D2FF]/40 transition-all shadow-xl flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                          <span className="text-[#00D2FF] font-semibold">{course.category}</span>
                          <span>{course.duration}</span>
                        </div>
                        <h4 className="text-base font-bold text-white mb-2">{course.title}</h4>
                        <div className="text-xs text-slate-400 mb-4">
                          Instructor: {course.trainerName}
                        </div>

                        {/* Progress Bar */}
                        <div className="space-y-1.5 mb-6">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-slate-400">Course Progress</span>
                            <span className="text-[#00D2FF] font-bold">
                              {course.progressPercentage}%
                            </span>
                          </div>
                          <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-[#00D2FF] to-[#FF7A00]"
                              style={{ width: `${course.progressPercentage}%` }}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-white/5">
                        <span className="text-xs text-slate-400">
                          {course.completedLessons} of {course.totalLessons} units complete
                        </span>
                        <button
                          onClick={() => openCoursePlayer(course.courseId)}
                          className="px-4 py-2 rounded-xl text-xs font-bold text-slate-950 bg-gradient-to-r from-[#00D2FF] to-[#38BDF8] hover:brightness-110 flex items-center gap-1.5 shadow"
                        >
                          <span>Continue Lab</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-12 text-center rounded-3xl bg-[#091129] border border-white/10">
                  <BookOpen className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                  <h4 className="text-base font-bold text-white mb-1">No Active Courses Yet</h4>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto mb-4">
                    Explore our Silicon Valley engineering curricula and enroll in your first live cohort.
                  </p>
                  <button
                    onClick={onBrowseCourses}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#00D2FF] to-[#FF7A00] text-white text-xs font-bold shadow-lg"
                  >
                    Browse Available Courses
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ================= 3. MY COURSES TAB ================= */}
        {!learningCourseId && activeTab === 'courses' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold text-white">Enrolled Programs</h3>
                <p className="text-xs text-slate-400">
                  Interactive workspaces, video archives, and code repositories
                </p>
              </div>
              <button
                onClick={onBrowseCourses}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-[#00D2FF]/10 text-[#00D2FF] border border-[#00D2FF]/30 hover:bg-[#00D2FF]/20"
              >
                + Add Another Course
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {dashboardData?.courses?.map((course: any) => (
                <div
                  key={course.enrollmentId}
                  className="p-6 rounded-3xl bg-[#091129] border border-white/10 hover:border-[#00D2FF]/40 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                      <span className="text-[#00D2FF] font-semibold">{course.category}</span>
                      <span>{course.level}</span>
                    </div>
                    <h4 className="text-base font-bold text-white mb-2 leading-snug">
                      {course.title}
                    </h4>
                    <p className="text-xs text-slate-300 line-clamp-2 mb-4">{course.overview}</p>

                    <div className="space-y-1.5 mb-6">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-400">Completion</span>
                        <span className="text-[#00D2FF] font-bold">
                          {course.progressPercentage}%
                        </span>
                      </div>
                      <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-[#00D2FF] to-[#FF7A00]"
                          style={{ width: `${course.progressPercentage}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => openCoursePlayer(course.courseId)}
                    className="w-full py-2.5 rounded-xl text-xs font-bold text-slate-950 bg-gradient-to-r from-[#00D2FF] to-[#38BDF8] hover:brightness-110 flex items-center justify-center gap-1.5 shadow"
                  >
                    <span>Launch Learning Studio</span>
                    <Play className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= 4. ASSIGNMENTS TAB ================= */}
        {!learningCourseId && activeTab === 'assignments' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-2xl font-bold text-white">Course Capstones & Assignments</h3>
              <p className="text-xs text-slate-400">
                Submit pull requests and repository URLs for line-by-line staff review
              </p>
            </div>

            <div className="space-y-4">
              {dashboardData?.recentAssignments?.map((assign: any) => (
                <div
                  key={assign.id}
                  className="p-6 rounded-3xl bg-[#091129] border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-6"
                >
                  <div className="space-y-2 max-w-xl">
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <span className="text-[#00D2FF] font-semibold">{assign.courseTitle}</span>
                      <span>·</span>
                      <span>Due: {assign.dueDate}</span>
                    </div>
                    <h4 className="text-base font-bold text-white">{assign.title}</h4>
                    <p className="text-xs text-slate-300 leading-relaxed">{assign.description}</p>

                    {assign.submission && (
                      <div className="p-3 bg-white/[0.03] rounded-xl border border-white/5 text-xs text-slate-300 mt-2">
                        <div className="flex items-center gap-2 text-emerald-400 font-semibold mb-1">
                          <CheckCircle className="w-3.5 h-3.5" />
                          <span>Submitted · Grade: {assign.submission.grade || 'Pending Review'}/100</span>
                        </div>
                        <p className="text-[11px] text-slate-400">Feedback: {assign.submission.feedback}</p>
                      </div>
                    )}
                  </div>

                  <div className="shrink-0">
                    <button
                      onClick={() => setSubmittingAssignment(assign)}
                      className="px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#0099FF] to-[#00D2FF] hover:brightness-110 shadow"
                    >
                      {assign.submission ? 'Resubmit Solution' : 'Submit Assignment'}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Assignment Submission Modal */}
            {submittingAssignment && (
              <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
                <div className="w-full max-w-lg bg-[#091129] border border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl relative">
                  <button
                    onClick={() => setSubmittingAssignment(null)}
                    className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-slate-300"
                  >
                    <X className="w-5 h-5" />
                  </button>
                  <h4 className="text-xl font-bold text-white mb-2">
                    Submit: {submittingAssignment.title}
                  </h4>
                  <p className="text-xs text-slate-400 mb-4">{submittingAssignment.description}</p>

                  <form onSubmit={handleAssignmentSubmit} className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        GitHub Repository URL / Implementation Notes
                      </label>
                      <textarea
                        required
                        rows={4}
                        placeholder="https://github.com/your-username/repo-name - Notes on design patterns and architecture..."
                        value={submissionText}
                        onChange={(e) => setSubmissionText(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#00D2FF]"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3 rounded-xl font-bold text-sm text-slate-950 bg-gradient-to-r from-[#00D2FF] to-[#38BDF8] hover:brightness-110 shadow"
                    >
                      Deliver Pull Request for Review
                    </button>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ================= 5. QUIZZES TAB ================= */}
        {!learningCourseId && activeTab === 'quizzes' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-2xl font-bold text-white">Technical Quizzes & Assessments</h3>
              <p className="text-xs text-slate-400">
                Test your conceptual understanding and earn verification scores
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {dashboardData?.recentQuizzes?.map((quiz: any) => (
                <div
                  key={quiz.id}
                  className="p-6 rounded-3xl bg-[#091129] border border-white/10 flex flex-col justify-between shadow-xl"
                >
                  <div>
                    <div className="text-xs font-semibold text-[#00D2FF] mb-1">{quiz.courseTitle}</div>
                    <h4 className="text-base font-bold text-white mb-2">{quiz.title}</h4>
                    <p className="text-xs text-slate-400 mb-4">Passing Score: {quiz.passingScore}%</p>

                    {quiz.attempt && (
                      <div className="p-3 bg-white/[0.03] rounded-xl border border-white/5 text-xs text-slate-300 mb-4">
                        <div className="flex items-center justify-between">
                          <span>Latest Score: {quiz.attempt.score}%</span>
                          <span
                            className={`font-bold ${
                              quiz.attempt.passed ? 'text-emerald-400' : 'text-rose-400'
                            }`}
                          >
                            {quiz.attempt.passed ? 'PASSED ✓' : 'NEEDS RETAKE'}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => handleStartQuiz(quiz)}
                    className="w-full py-2.5 rounded-xl text-xs font-bold text-slate-950 bg-gradient-to-r from-[#00D2FF] to-[#38BDF8] hover:brightness-110 flex items-center justify-center gap-1.5"
                  >
                    <span>{quiz.attempt ? 'Retake Quiz' : 'Start Assessment'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            {/* Quiz Interactive Taking Modal */}
            {activeQuiz && (
              <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
                <div className="w-full max-w-2xl bg-[#091129] border border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl max-h-[85vh] overflow-y-auto relative">
                  <button
                    onClick={() => setActiveQuiz(null)}
                    className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-slate-300"
                  >
                    <X className="w-5 h-5" />
                  </button>

                  <div className="text-xs text-[#00D2FF] font-semibold mb-1">{activeQuiz.courseTitle}</div>
                  <h3 className="text-xl font-bold text-white mb-6">{activeQuiz.title}</h3>

                  {quizResult ? (
                    <div className="text-center py-6 space-y-4">
                      <div className="w-16 h-16 rounded-full mx-auto flex items-center justify-center bg-[#00D2FF]/10 border border-[#00D2FF]/40 text-2xl font-black text-[#00D2FF]">
                        {quizResult.attempt.score}%
                      </div>
                      <h4 className="text-lg font-bold text-white">{quizResult.message}</h4>
                      <button
                        onClick={() => setActiveQuiz(null)}
                        className="px-6 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-white"
                      >
                        Done
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {activeQuiz.questions?.map((q: any, qIdx: number) => (
                        <div key={q.id} className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-3">
                          <div className="text-sm font-semibold text-white">
                            {qIdx + 1}. {q.question}
                          </div>
                          <div className="space-y-2">
                            {q.options?.map((opt: string, optIdx: number) => (
                              <label
                                key={optIdx}
                                className={`flex items-center gap-3 p-3 rounded-xl border text-xs cursor-pointer transition-colors ${
                                  quizAnswers[qIdx] === optIdx
                                    ? 'bg-[#00D2FF]/10 border-[#00D2FF] text-white'
                                    : 'bg-white/[0.02] border-white/5 text-slate-300 hover:bg-white/[0.04]'
                                }`}
                              >
                                <input
                                  type="radio"
                                  name={`question-${q.id}`}
                                  checked={quizAnswers[qIdx] === optIdx}
                                  onChange={() => {
                                    const updated = [...quizAnswers];
                                    updated[qIdx] = optIdx;
                                    setQuizAnswers(updated);
                                  }}
                                  className="text-[#00D2FF] focus:ring-0"
                                />
                                <span>{opt}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                      ))}

                      <button
                        onClick={handleQuizSubmit}
                        className="w-full py-3 rounded-xl font-bold text-sm text-slate-950 bg-gradient-to-r from-[#00D2FF] to-[#38BDF8] hover:brightness-110 shadow"
                      >
                        Submit Answers for Grading
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ================= 6. CERTIFICATES TAB ================= */}
        {!learningCourseId && activeTab === 'certificates' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-2xl font-bold text-white">Issued Certificates & Diplomas</h3>
              <p className="text-xs text-slate-400">
                Cryptographically verifiable proof of graduation and peer defenses
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {dashboardData?.certificates?.map((cert: any) => (
                <div
                  key={cert.id}
                  className="p-6 rounded-3xl bg-gradient-to-br from-[#0B1E48] to-[#070E24] border border-[#00D2FF]/30 shadow-2xl relative overflow-hidden flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <Logo size="sm" variant="mark" />
                      <span className="text-[11px] font-mono text-[#00D2FF] bg-[#00D2FF]/10 px-2 py-0.5 rounded-full border border-[#00D2FF]/30">
                        {cert.certificateCode}
                      </span>
                    </div>

                    <div className="text-xs text-slate-400 uppercase tracking-wider mb-1">
                      Certificate of Mastery
                    </div>
                    <h4 className="text-lg font-bold text-white mb-2">{cert.courseTitle}</h4>
                    <p className="text-xs text-slate-300">Awarded to: {cert.studentName}</p>
                    <p className="text-xs text-slate-400 mt-1">Issue Date: {cert.issueDate}</p>
                  </div>

                  <div className="pt-6 mt-6 border-t border-white/10 flex items-center justify-between">
                    <span className="text-xs font-bold text-[#FF7A00]">{cert.grade}</span>
                    <button
                      onClick={() => setViewingCertificate(cert)}
                      className="px-4 py-2 rounded-xl text-xs font-bold text-slate-950 bg-gradient-to-r from-[#00D2FF] to-[#38BDF8] hover:brightness-110 shadow"
                    >
                      View & Print Official Diploma
                    </button>
                  </div>
                </div>
              ))}

              {(!dashboardData?.certificates || dashboardData.certificates.length === 0) && (
                <div className="col-span-2 p-12 text-center rounded-3xl bg-[#091129] border border-white/10">
                  <Award className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                  <h4 className="text-base font-bold text-white mb-1">No Certificates Issued Yet</h4>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto">
                    Complete all modules and assignments in an enrolled course to receive your verified digital certificate.
                  </p>
                </div>
              )}
            </div>

            {/* Official Diploma Modal */}
            {viewingCertificate && (
              <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
                <div className="w-full max-w-2xl bg-[#070D22] border-4 border-[#00D2FF]/40 rounded-3xl p-8 shadow-2xl relative text-center space-y-6">
                  <button
                    onClick={() => setViewingCertificate(null)}
                    className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-slate-300"
                  >
                    <X className="w-5 h-5" />
                  </button>

                  <div className="flex justify-center mb-2">
                    <Logo size="md" variant="dark" />
                  </div>

                  <div className="text-xs tracking-widest text-[#00D2FF] font-bold uppercase">
                    Official Certificate of Professional Competency
                  </div>

                  <div className="py-2">
                    <div className="text-xs text-slate-400">This is to certify that</div>
                    <div className="text-3xl font-extrabold text-white my-1">
                      {viewingCertificate.studentName}
                    </div>
                    <div className="text-xs text-slate-400">
                      has successfully defended all capstone requirements and completed
                    </div>
                    <div className="text-xl font-bold text-[#FF7A00] mt-2">
                      {viewingCertificate.courseTitle}
                    </div>
                  </div>

                  <div className="flex items-center justify-around text-xs text-slate-400 pt-6 border-t border-white/10">
                    <div>
                      <div className="text-white font-bold">{viewingCertificate.issueDate}</div>
                      <div>Date of Conferral</div>
                    </div>
                    <div>
                      <div className="text-[#00D2FF] font-mono font-bold">
                        {viewingCertificate.certificateCode}
                      </div>
                      <div>Verification ID</div>
                    </div>
                    <div>
                      <div className="text-[#FBBF24] font-bold">{viewingCertificate.grade}</div>
                      <div>Academic Standing</div>
                    </div>
                  </div>

                  <div className="pt-4 flex justify-center gap-3">
                    <button
                      onClick={() => window.print()}
                      className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#00D2FF] to-[#38BDF8] text-slate-950 font-bold text-xs"
                    >
                      Print Official Certificate
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ================= 7. PROFILE TAB ================= */}
        {!learningCourseId && activeTab === 'profile' && (
          <div className="max-w-xl mx-auto space-y-6">
            <div>
              <h3 className="text-2xl font-bold text-white">Student Profile Settings</h3>
              <p className="text-xs text-slate-400">Manage your name, bio, and portal credentials</p>
            </div>

            <form onSubmit={handleUpdateProfile} className="p-6 rounded-3xl bg-[#091129] border border-white/10 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Full Name</label>
                <input
                  type="text"
                  value={profileForm.name}
                  onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-sm text-white focus:outline-none focus:border-[#00D2FF]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Registered Email</label>
                <input
                  type="email"
                  disabled
                  value={user.email}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/[0.02] border border-white/5 text-sm text-slate-400 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Short Bio</label>
                <textarea
                  rows={3}
                  value={profileForm.bio}
                  onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                  placeholder="Share your background, GitHub links, and career goals..."
                  className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-sm text-white focus:outline-none focus:border-[#00D2FF]"
                />
              </div>

              <div className="pt-4 border-t border-white/10 space-y-4">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">Change Password</h4>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Current Password</label>
                  <input
                    type="password"
                    placeholder="••••••••••••"
                    value={profileForm.currentPassword}
                    onChange={(e) => setProfileForm({ ...profileForm, currentPassword: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-sm text-white focus:outline-none focus:border-[#00D2FF]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">New Password</label>
                  <input
                    type="password"
                    placeholder="••••••••••••"
                    value={profileForm.newPassword}
                    onChange={(e) => setProfileForm({ ...profileForm, newPassword: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-sm text-white focus:outline-none focus:border-[#00D2FF]"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl font-bold text-sm text-slate-950 bg-gradient-to-r from-[#00D2FF] to-[#38BDF8] hover:brightness-110 shadow mt-4"
              >
                Save Profile Changes
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
