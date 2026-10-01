import React, { useState, useEffect } from 'react';
import { Logo } from './Logo';
import { Menu, X, ArrowUpRight, User, Shield, LogOut, BookOpen, Layers } from 'lucide-react';

interface NavbarProps {
  onOpenAuth: (mode: 'login' | 'register', adminRequested?: boolean) => void;
  activeSection: string;
  setActiveSection: (section: string) => void;
  currentUser: any;
  onOpenStudentPortal: () => void;
  onOpenAdminPortal: () => void;
  onLogout: () => void;
  currentView: 'public' | 'student' | 'admin';
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenAuth,
  activeSection,
  setActiveSection,
  currentUser,
  onOpenStudentPortal,
  onOpenAdminPortal,
  onLogout,
  currentView,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Home', href: '#home', id: 'home' },
    { label: 'Courses', href: '#courses', id: 'courses' },
    { label: 'Learning Paths', href: '#learning-paths', id: 'learning-paths' },
    { label: 'Trainers', href: '#trainers', id: 'trainers' },
    { label: 'About', href: '#about', id: 'about' },
    { label: 'Blog', href: '#blog', id: 'blog' },
    { label: 'Contact', href: '#contact', id: 'contact' },
  ];

  const handleNavClick = (href: string, id: string) => {
    setActiveSection(id);
    setMobileMenuOpen(false);
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#050A1A]/95 backdrop-blur-md border-b border-white/10 py-3 shadow-lg shadow-black/40'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* ZONE 1: BRAND ZONE */}
          <a
            href="#home"
            onClick={(e) => {
              e.preventDefault();
              handleNavClick('#home', 'home');
            }}
            className="flex items-center gap-2 group cursor-pointer"
            aria-label="HKSURYA Learning Home"
          >
            <Logo size="md" variant="dark" />
          </a>

          {/* ZONE 2: 4-6 CLEAN NAV LINKS (Single-line) */}
          <nav className="hidden lg:flex items-center gap-6">
            {navLinks.map((link) => {
              const isActive = activeSection === link.id && currentView === 'public';
              return (
                <a
                  key={link.id}
                  href={link.href}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick(link.href, link.id);
                  }}
                  className={`text-sm font-medium transition-colors relative py-1 whitespace-nowrap ${
                    isActive
                      ? 'text-[#00D2FF] font-semibold'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#00D2FF] to-[#FF7A00] rounded-full" />
                  )}
                </a>
              );
            })}
          </nav>

          {/* ZONE 3: ACTIONS & PORTAL ACCESS */}
          <div className="hidden sm:flex items-center gap-3">
            {currentUser ? (
              <div className="flex items-center gap-2.5">
                {currentUser.role === 'admin' && (
                  <button
                    onClick={onOpenAdminPortal}
                    className="px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#FF7A00] to-[#E65100] hover:brightness-110 flex items-center gap-1.5 shadow-md shadow-orange-500/20"
                  >
                    <Shield className="w-3.5 h-3.5" />
                    <span>Admin Panel</span>
                  </button>
                )}

                <button
                  onClick={onOpenStudentPortal}
                  className="px-3.5 py-2 rounded-xl text-xs font-bold text-slate-950 bg-gradient-to-r from-[#00D2FF] to-[#38BDF8] hover:brightness-110 flex items-center gap-1.5 shadow-md shadow-cyan-500/20"
                >
                  <Layers className="w-3.5 h-3.5 text-slate-950" />
                  <span>Student Portal</span>
                </button>

                <div className="flex items-center gap-2 pl-2 border-l border-white/10 text-xs">
                  <span className="text-slate-300 font-semibold">{currentUser.name}</span>
                  <button
                    onClick={onLogout}
                    className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-rose-300 transition-colors"
                    title="Sign Out"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <button
                  onClick={() => onOpenAuth('login', true)}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-400 hover:text-[#00D2FF] transition-colors"
                >
                  Admin / Staff
                </button>
                <button
                  onClick={() => onOpenAuth('login')}
                  className="px-4 py-2 text-sm font-semibold text-slate-200 hover:text-white transition-colors cursor-pointer whitespace-nowrap"
                >
                  Log In
                </button>
                <button
                  onClick={() => onOpenAuth('register')}
                  className="px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-[#0099FF] via-[#00D2FF] to-[#FF7A00] rounded-xl hover:opacity-95 shadow-md shadow-[#00D2FF]/20 hover:shadow-[#00D2FF]/30 transition-all duration-200 cursor-pointer flex items-center gap-1.5 whitespace-nowrap"
                >
                  <span>Get Started</span>
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* Mobile trigger */}
          <div className="flex items-center gap-2 lg:hidden">
            {currentUser && (
              <button
                onClick={currentUser.role === 'admin' ? onOpenAdminPortal : onOpenStudentPortal}
                className="px-3 py-1 text-xs font-bold bg-[#00D2FF] text-slate-950 rounded-lg"
              >
                Portal
              </button>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-300 hover:text-white rounded-lg border border-white/10"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Sheet */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#070E24] border-b border-white/10 px-6 py-5 shadow-2xl animate-in slide-in-from-top-2 duration-200">
          <div className="flex flex-col gap-3">
            {navLinks.map((link) => (
              <a
                key={link.id}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(link.href, link.id);
                }}
                className="text-base py-2 px-3 text-slate-300 hover:text-white hover:bg-white/5 rounded-lg"
              >
                {link.label}
              </a>
            ))}

            <div className="pt-4 border-t border-white/10 flex flex-col gap-2.5">
              {currentUser ? (
                <>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onOpenStudentPortal();
                    }}
                    className="w-full py-2.5 text-center text-xs font-bold text-slate-950 bg-[#00D2FF] rounded-xl"
                  >
                    Open Student Portal
                  </button>
                  {currentUser.role === 'admin' && (
                    <button
                      onClick={() => {
                        setMobileMenuOpen(false);
                        onOpenAdminPortal();
                      }}
                      className="w-full py-2.5 text-center text-xs font-bold text-white bg-[#FF7A00] rounded-xl"
                    >
                      Open Admin Panel (/admin)
                    </button>
                  )}
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onLogout();
                    }}
                    className="w-full py-2 text-center text-xs font-semibold text-rose-300 border border-rose-500/20 rounded-xl"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onOpenAuth('login');
                    }}
                    className="w-full py-2.5 text-center text-sm font-semibold text-slate-200 border border-white/15 rounded-xl"
                  >
                    Log In
                  </button>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onOpenAuth('register');
                    }}
                    className="w-full py-2.5 text-center text-sm font-bold text-white bg-gradient-to-r from-[#0099FF] to-[#FF7A00] rounded-xl"
                  >
                    Register
                  </button>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onOpenAuth('login', true);
                    }}
                    className="w-full py-2 text-center text-xs font-semibold text-[#00D2FF] hover:underline"
                  >
                    Admin Access Gate (/admin)
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
