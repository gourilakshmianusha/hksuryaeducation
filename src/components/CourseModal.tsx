import React, { useState } from 'react';
import { Course } from '../data/coursesData';
import {
  X,
  Clock,
  Award,
  Users,
  Star,
  CheckCircle,
  Calendar,
  Layers,
  ChevronDown,
  ChevronUp,
  Download,
  Shield,
  ArrowRight,
} from 'lucide-react';

interface CourseModalProps {
  course: any | null;
  onClose: () => void;
  onEnroll: (course: any) => void;
}

export const CourseModal: React.FC<CourseModalProps> = ({
  course,
  onClose,
  onEnroll,
}) => {
  const [activeTab, setActiveTab] = useState<'syllabus' | 'overview' | 'instructor' | 'certificate'>('syllabus');
  const [expandedModule, setExpandedModule] = useState<number | null>(0);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  if (!course) return null;

  const handleDownloadSyllabus = () => {
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-[#091129] border border-white/15 rounded-3xl shadow-2xl overflow-hidden my-8">
        {/* Header Banner */}
        <div className="relative p-6 sm:p-8 bg-gradient-to-r from-[#0B1E54] via-[#0D2E68] to-[#0A1636] border-b border-white/10">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Metadata line */}
          <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-[#00D2FF] mb-3">
            <span>{course.category}</span>
            <span className="text-slate-400">·</span>
            <span>{course.level} Level</span>
            <span className="text-slate-400">·</span>
            <span className="flex items-center gap-1 text-[#FF7A00]">
              <Star className="w-3.5 h-3.5 fill-current" />
              <span>{course.rating} ({course.reviewsCount} reviews)</span>
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-3">
            {course.title}
          </h2>

          <p className="text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed mb-6">
            {course.overview}
          </p>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-white/10">
            <div className="flex items-center gap-2.5">
              <Clock className="w-4 h-4 text-[#00D2FF]" />
              <div>
                <div className="text-xs text-slate-400">Duration</div>
                <div className="text-sm font-bold text-white">{course.duration}</div>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <Users className="w-4 h-4 text-[#FF7A00]" />
              <div>
                <div className="text-xs text-slate-400">Learners</div>
                <div className="text-sm font-bold text-white">{course.studentsCount.toLocaleString()}+</div>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <Calendar className="w-4 h-4 text-[#00D2FF]" />
              <div>
                <div className="text-xs text-slate-400">Next Cohort</div>
                <div className="text-sm font-bold text-white">{course.nextCohortDate}</div>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <Award className="w-4 h-4 text-[#FBBF24]" />
              <div>
                <div className="text-xs text-slate-400">Credential</div>
                <div className="text-sm font-bold text-white">Verified Certificate</div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Navigation Tabs (Interactive filter controls) */}
        <div className="flex items-center border-b border-white/10 px-6 sm:px-8 bg-[#070D22] overflow-x-auto">
          {[
            { id: 'syllabus', label: 'Curriculum & Modules' },
            { id: 'overview', label: 'Outcomes & Stack' },
            { id: 'instructor', label: 'Lead Instructor' },
            { id: 'certificate', label: 'Accreditation' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-3.5 px-4 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? 'border-[#00D2FF] text-[#00D2FF] font-bold'
                  : 'border-transparent text-slate-400 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content Body */}
        <div className="p-6 sm:p-8 max-h-[50vh] overflow-y-auto space-y-6">
          {/* TAB 1: CURRICULUM */}
          {activeTab === 'syllabus' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-base font-bold text-white">Course Curriculum Structure</h4>
                  <p className="text-xs text-slate-400">4 comprehensive modules · Live coding labs · Capstone defense</p>
                </div>
                <button
                  onClick={handleDownloadSyllabus}
                  className="px-3.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-semibold text-[#00D2FF] flex items-center gap-1.5 border border-[#00D2FF]/30 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>{downloadSuccess ? 'Downloaded!' : 'Download Syllabus PDF'}</span>
                </button>
              </div>

              <div className="space-y-3">
                {(course.syllabus || []).map((item: any, idx: number) => {
                  const isOpen = expandedModule === idx;
                  return (
                    <div
                      key={idx}
                      className="border border-white/10 rounded-2xl bg-white/[0.02] overflow-hidden"
                    >
                      <button
                        onClick={() => setExpandedModule(isOpen ? null : idx)}
                        className="w-full p-4 flex items-center justify-between text-left hover:bg-white/[0.04] transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <span className="w-7 h-7 rounded-lg bg-[#00D2FF]/10 text-[#00D2FF] font-bold text-xs flex items-center justify-center border border-[#00D2FF]/30">
                            0{idx + 1}
                          </span>
                          <div>
                            <div className="text-sm font-semibold text-white">{item.module}</div>
                            <div className="text-xs text-slate-400">{item.duration} · {item.lessons?.length || 0} Deep-Dive Units</div>
                          </div>
                        </div>
                        {isOpen ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
                      </button>

                      {isOpen && (
                        <div className="px-5 pb-4 pt-1 border-t border-white/5 bg-[#050A1A]/40 space-y-2">
                          {(item.lessons || []).map((lesson: any, lIdx: number) => (
                            <div key={lIdx} className="flex items-center gap-2.5 text-xs text-slate-300">
                              <CheckCircle className="w-3.5 h-3.5 text-[#00D2FF] shrink-0" />
                              <span>{typeof lesson === 'string' ? lesson : lesson?.title || 'Lesson Unit'}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: OUTCOMES & STACK */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-3">Key Highlights</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {(course.highlights || []).map((h: string, i: number) => (
                    <div key={i} className="flex items-start gap-2.5 text-xs text-slate-300 bg-white/[0.02] p-3 rounded-xl border border-white/5">
                      <CheckCircle className="w-4 h-4 text-[#FF7A00] shrink-0 mt-0.5" />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-3">Skills Acquired</h4>
                <div className="flex flex-wrap gap-2 text-xs text-slate-300">
                  {(course.skillsAcquired || []).map((skill: string, i: number) => (
                    <span key={i} className="px-3 py-1 bg-white/5 rounded-lg border border-white/10 font-mono">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-3">Technologies Mastered</h4>
                <div className="flex flex-wrap gap-2">
                  {(course.technologies || []).map((tech: string, i: number) => (
                    <span key={i} className="px-3 py-1 bg-[#00D2FF]/10 text-[#00D2FF] rounded-lg border border-[#00D2FF]/20 text-xs font-semibold">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: INSTRUCTOR */}
          {activeTab === 'instructor' && (
            <div className="flex flex-col sm:flex-row gap-5 items-start bg-white/[0.02] p-5 rounded-2xl border border-white/10">
              <div className="w-16 h-16 rounded-2xl bg-blue-900/40 border border-[#00D2FF]/40 flex items-center justify-center text-xl font-bold text-[#00D2FF] shrink-0">
                {course.trainer.name.charAt(0)}
              </div>
              <div className="space-y-2">
                <div className="text-lg font-bold text-white">{course.trainer.name}</div>
                <div className="text-xs font-semibold text-[#00D2FF]">{course.trainer.role}</div>
                <div className="text-xs text-slate-400">{course.trainer.company}</div>
                <p className="text-xs text-slate-300 leading-relaxed pt-2">
                  Direct live mentoring, code teardowns, and architecture evaluations conducted weekly by this instructor.
                </p>
              </div>
            </div>
          )}

          {/* TAB 4: ACCREDITATION */}
          {activeTab === 'certificate' && (
            <div className="p-6 rounded-2xl bg-gradient-to-br from-[#0B1E48] to-[#050D24] border border-[#00D2FF]/30 text-center space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-[#00D2FF]/10 border border-[#00D2FF]/40 flex items-center justify-center">
                <Award className="w-8 h-8 text-[#FF7A00]" />
              </div>
              <h4 className="text-lg font-bold text-white">HKSURYA Verified Professional Certification</h4>
              <p className="text-xs text-slate-300 max-w-md mx-auto">
                Graduates receive a cryptographically verifiable digital certificate indexed by global employer partners, confirming your capstone defense and lab competencies.
              </p>
              <div className="flex items-center justify-center gap-3 text-xs text-[#00D2FF] font-semibold">
                <Shield className="w-4 h-4" />
                <span>Shareable to LinkedIn, GitHub & Resume Portfolios</span>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer / Enrollment Actions */}
        <div className="p-6 sm:p-8 bg-[#060B1E] border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <div className="text-xs text-slate-400">Total Program Investment</div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-black text-white">${course.price}</span>
              <span className="text-sm text-slate-500 line-through">${course.originalPrice}</span>
              <span className="text-xs font-bold text-[#FF7A00]">45% Off Cohort Special</span>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl border border-white/15 text-sm font-semibold text-slate-300 hover:text-white hover:bg-white/5"
            >
              Back
            </button>
            <button
              onClick={() => {
                onClose();
                onEnroll(course);
              }}
              className="flex-1 sm:flex-none px-6 py-3 rounded-xl text-sm font-bold text-slate-900 bg-gradient-to-r from-[#00D2FF] to-[#00F0FF] hover:brightness-110 shadow-lg shadow-cyan-500/25 transition-all flex items-center justify-center gap-2"
            >
              <span>Enroll Now</span>
              <ArrowRight className="w-4 h-4 text-slate-900" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
