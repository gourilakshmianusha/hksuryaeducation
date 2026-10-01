import React from 'react';
import { Logo } from './Logo';
import { ArrowUp, Github, Linkedin, Twitter, Youtube, ShieldCheck } from 'lucide-react';

interface FooterProps {
  onOpenAuth: (mode: 'login' | 'register') => void;
  onNavigate: (sectionId: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenAuth, onNavigate }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#040816] border-t border-white/10 pt-16 pb-12 relative overflow-hidden text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-white/10">
          {/* Col 1 & 2: Brand Lockup & Mission */}
          <div className="lg:col-span-2 space-y-4">
            <div className="inline-block">
              <Logo size="md" variant="dark" />
            </div>

            <p className="text-sm text-slate-300 max-w-sm leading-relaxed">
              Empowering engineers, leaders, and modern creators through interactive 3D computing education, deep architectural teardowns, and verified cohort mentorship.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-300 hover:text-white transition-colors"
                aria-label="GitHub"
              >
                <Github className="w-4 h-4" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-300 hover:text-white transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-300 hover:text-white transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-300 hover:text-white transition-colors"
                aria-label="YouTube"
              >
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Col 3: Programs & Bootcamps */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              Programs & Curricula
            </h4>
            <ul className="space-y-2.5">
              <li>
                <button
                  onClick={() => onNavigate('courses')}
                  className="hover:text-white transition-colors text-left"
                >
                  Enterprise Full Stack
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('courses')}
                  className="hover:text-white transition-colors text-left"
                >
                  Generative AI & LLMs
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('courses')}
                  className="hover:text-white transition-colors text-left"
                >
                  Cloud Architecture & Kubernetes
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('courses')}
                  className="hover:text-white transition-colors text-left"
                >
                  Offensive Security & Red Team
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('courses')}
                  className="hover:text-white transition-colors text-left"
                >
                  Petabyte Data Engineering
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Paths & Resources */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              Learning Resources
            </h4>
            <ul className="space-y-2.5">
              <li>
                <button
                  onClick={() => onNavigate('learning-paths')}
                  className="hover:text-white transition-colors text-left"
                >
                  Career Roadmaps
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('trainers')}
                  className="hover:text-white transition-colors text-left"
                >
                  Lead Faculty & Mentors
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('blog')}
                  className="hover:text-white transition-colors text-left"
                >
                  Engineering Research Blog
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenAuth('login')}
                  className="hover:text-white transition-colors text-left"
                >
                  Student Portal Login
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenAuth('register')}
                  className="text-[#FF7A00] font-semibold hover:underline text-left"
                >
                  Fall 2026 Admissions
                </button>
              </li>
            </ul>
          </div>

          {/* Col 5: Company & Accreditation */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              Organization
            </h4>
            <ul className="space-y-2.5">
              <li>
                <button
                  onClick={() => onNavigate('about')}
                  className="hover:text-white transition-colors text-left"
                >
                  The HKSURYA Method
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('contact')}
                  className="hover:text-white transition-colors text-left"
                >
                  Corporate Upskilling
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('contact')}
                  className="hover:text-white transition-colors text-left"
                >
                  Campus Locations
                </button>
              </li>
              <li>
                <span className="flex items-center gap-1.5 text-slate-300">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#00D2FF]" />
                  <span>ISO 29993 Certified</span>
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Scroll to Top */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-500">
            <span>© 2026 HKSURYA LEARNING. All rights reserved.</span>
            <span>·</span>
            <a href="#about" className="hover:text-slate-400">Privacy Policy</a>
            <span>·</span>
            <a href="#about" className="hover:text-slate-400">Academic Integrity</a>
            <span>·</span>
            <a href="#about" className="hover:text-slate-400">Terms of Service</a>
          </div>

          <button
            onClick={scrollToTop}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors text-xs font-medium cursor-pointer"
          >
            <span>Back to Top</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
};
