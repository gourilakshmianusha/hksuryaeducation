/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { StatsBanner } from './components/StatsBanner';
import { CoursesSection } from './components/CoursesSection';
import { CourseModal } from './components/CourseModal';
import { LearningPathsSection } from './components/LearningPathsSection';
import { TrainersSection } from './components/TrainersSection';
import { AboutSection } from './components/AboutSection';
import { BlogSection } from './components/BlogSection';
import { ContactSection } from './components/ContactSection';
import { AuthModal } from './components/AuthModal';
import { Footer } from './components/Footer';
import { StudentDashboard } from './components/student/StudentDashboard';
import { AdminPanel } from './components/admin/AdminPanel';
import { api } from './services/api';
import { CheckCircle, AlertCircle } from 'lucide-react';

export default function App() {
  const [currentView, setCurrentView] = useState<'public' | 'student' | 'admin'>('public');
  const [activeSection, setActiveSection] = useState('home');
  const [selectedCourse, setSelectedCourse] = useState<any | null>(null);
  const [authModalState, setAuthModalState] = useState<{
    isOpen: boolean;
    mode: 'login' | 'register';
    adminRequested?: boolean;
  }>({
    isOpen: false,
    mode: 'login',
    adminRequested: false,
  });
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<any | null>(null);

  // Check initial URL and load session from localStorage
  useEffect(() => {
    const savedUser = localStorage.getItem('hksurya_user');
    const savedToken = localStorage.getItem('hksurya_token');

    if (savedUser && savedToken) {
      try {
        const parsed = JSON.parse(savedUser);
        setCurrentUser(parsed);
      } catch (e) {
        console.error(e);
      }
    }

    // Check URL route for /admin
    if (window.location.pathname.startsWith('/admin') || window.location.hash === '#admin') {
      setCurrentView('admin');
    }
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  const handleEnrollCourse = async (course: any) => {
    setSelectedCourse(null);
    if (!currentUser) {
      setAuthModalState({ isOpen: true, mode: 'register' });
      showToast(`Please sign in or register to enroll in ${course.title}.`);
      return;
    }

    try {
      await api.student.enroll(course.id, 'Student Portal Instant Enrollment');
      showToast(`Congratulations ${currentUser.name}! You are now enrolled in ${course.title}.`);
      setCurrentView('student');
    } catch (err: any) {
      showToast(err.message || 'Enrollment processed');
      setCurrentView('student');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('hksurya_token');
    localStorage.removeItem('hksurya_user');
    setCurrentUser(null);
    setCurrentView('public');
    showToast('You have signed out successfully.');
  };

  const handleOpenAdmin = () => {
    if (!currentUser || currentUser.role !== 'admin') {
      setAuthModalState({ isOpen: true, mode: 'login', adminRequested: true });
    } else {
      setCurrentView('admin');
    }
  };

  const handleOpenStudent = () => {
    if (!currentUser) {
      setAuthModalState({ isOpen: true, mode: 'login' });
    } else {
      setCurrentView('student');
    }
  };

  // View: ADMIN PANEL
  if (currentView === 'admin') {
    if (!currentUser || currentUser.role !== 'admin') {
      return (
        <div className="min-h-screen bg-[#050A1A] flex items-center justify-center p-4">
          <div className="text-center max-w-md bg-[#091129] border border-white/10 p-8 rounded-3xl shadow-2xl">
            <h2 className="text-xl font-bold text-white mb-2">Admin Authorization Required</h2>
            <p className="text-xs text-slate-400 mb-6">
              You must sign in with an institutional administrative account to access /admin.
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => setCurrentView('public')}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-white/5 text-slate-300"
              >
                Back to Site
              </button>
              <button
                onClick={() => setAuthModalState({ isOpen: true, mode: 'login', adminRequested: true })}
                className="px-5 py-2 rounded-xl text-xs font-bold text-slate-950 bg-[#00D2FF]"
              >
                Sign In as Admin
              </button>
            </div>
          </div>
          <AuthModal
            isOpen={authModalState.isOpen}
            initialMode={authModalState.mode}
            adminRequested={authModalState.adminRequested}
            onClose={() => setAuthModalState({ isOpen: false, mode: 'login' })}
            onSuccess={(user) => {
              setCurrentUser(user);
              if (user.role === 'admin') {
                setCurrentView('admin');
              } else {
                setCurrentView('student');
              }
            }}
          />
        </div>
      );
    }

    return <AdminPanel onExit={() => setCurrentView('public')} />;
  }

  // View: STUDENT DASHBOARD
  if (currentView === 'student' && currentUser) {
    return (
      <div className="min-h-screen bg-[#050A1A]">
        <Navbar
          activeSection={activeSection}
          setActiveSection={setActiveSection}
          currentUser={currentUser}
          currentView={currentView}
          onOpenAuth={(mode, adminRequested) => setAuthModalState({ isOpen: true, mode, adminRequested })}
          onOpenStudentPortal={() => setCurrentView('student')}
          onOpenAdminPortal={handleOpenAdmin}
          onLogout={handleLogout}
        />
        <StudentDashboard
          user={currentUser}
          onLogout={handleLogout}
          onBrowseCourses={() => setCurrentView('public')}
        />
      </div>
    );
  }

  // View: PUBLIC WEBSITE
  return (
    <div className="min-h-screen bg-[#050A1A] text-slate-100 flex flex-col font-sans selection:bg-[#00D2FF]/30 selection:text-white">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 max-w-md bg-[#091536] border border-[#00D2FF]/50 text-white px-4 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-bottom-5 duration-200">
          <CheckCircle className="w-5 h-5 text-[#00D2FF] shrink-0" />
          <span className="text-xs sm:text-sm font-medium leading-snug">{toastMessage}</span>
        </div>
      )}

      {/* Top Navigation */}
      <Navbar
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        currentUser={currentUser}
        currentView={currentView}
        onOpenAuth={(mode, adminRequested) => setAuthModalState({ isOpen: true, mode, adminRequested })}
        onOpenStudentPortal={handleOpenStudent}
        onOpenAdminPortal={handleOpenAdmin}
        onLogout={handleLogout}
      />

      {/* Main Content Area */}
      <main className="flex-grow">
        {/* 1. HERO SECTION WITH 3D INTERACTIVE WEBGL ARENA */}
        <HeroSection
          onExploreCourses={() => {
            const el = document.getElementById('courses');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
          onGetStarted={() => {
            if (currentUser) setCurrentView('student');
            else setAuthModalState({ isOpen: true, mode: 'register' });
          }}
        />

        {/* 2. STATS & HIRING PARTNERS BANNER */}
        <StatsBanner />

        {/* 3. COURSES SECTION (LIVE DB POWERED) */}
        <CoursesSection
          onSelectCourse={(course) => setSelectedCourse(course)}
          onEnrollCourse={handleEnrollCourse}
        />

        {/* 4. LEARNING PATHS ROADMAPS */}
        <LearningPathsSection
          onSelectPath={() => {
            const el = document.getElementById('courses');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
        />

        {/* 5. TRAINERS & FACULTY */}
        <TrainersSection />

        {/* 6. ABOUT THE HKSURYA METHODOLOGY */}
        <AboutSection />

        {/* 7. ENGINEERING BLOG & RESEARCH */}
        <BlogSection />

        {/* 8. ADMISSIONS & CONTACT */}
        <ContactSection />
      </main>

      {/* Footer */}
      <Footer
        onOpenAuth={(mode) => setAuthModalState({ isOpen: true, mode })}
        onNavigate={(sectionId) => {
          setActiveSection(sectionId);
          const el = document.getElementById(sectionId);
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      {/* Course Detail Modal */}
      <CourseModal
        course={selectedCourse}
        onClose={() => setSelectedCourse(null)}
        onEnroll={handleEnrollCourse}
      />

      {/* Auth Modal (Login / Register / Admin Gate) */}
      <AuthModal
        isOpen={authModalState.isOpen}
        initialMode={authModalState.mode}
        adminRequested={authModalState.adminRequested}
        onClose={() => setAuthModalState({ isOpen: false, mode: 'login' })}
        onSuccess={(user) => {
          setCurrentUser(user);
          showToast(`Welcome to HKSURYA Learning, ${user.name}!`);
          if (user.role === 'admin' && authModalState.adminRequested) {
            setCurrentView('admin');
          } else {
            setCurrentView('student');
          }
        }}
      />
    </div>
  );
}
