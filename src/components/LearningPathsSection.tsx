import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Compass, ArrowRight, DollarSign, Clock, CheckCircle2, ChevronRight, RefreshCw } from 'lucide-react';

interface LearningPathsSectionProps {
  onSelectPath: (path: any) => void;
}

export const LearningPathsSection: React.FC<LearningPathsSectionProps> = ({ onSelectPath }) => {
  const [paths, setPaths] = useState<any[]>([]);
  const [selectedPathId, setSelectedPathId] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPaths() {
      try {
        const data = await api.public.getLearningPaths();
        setPaths(data);
        if (data.length > 0) {
          setSelectedPathId(data[0].id);
        }
      } catch (err) {
        console.error('Failed to load learning paths:', err);
      } finally {
        setLoading(false);
      }
    }
    loadPaths();
  }, []);

  const activePath = paths.find((p) => p.id === selectedPathId) || paths[0];

  if (loading) {
    return (
      <div className="py-20 text-center text-slate-400 flex items-center justify-center gap-2">
        <RefreshCw className="w-5 h-5 animate-spin text-[#00D2FF]" />
        <span>Loading learning paths from database...</span>
      </div>
    );
  }

  if (paths.length === 0) return null;

  return (
    <section id="learning-paths" className="py-20 bg-[#070D22] border-t border-white/5 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#00D2FF] tracking-wider uppercase mb-2">
            <Compass className="w-3.5 h-3.5" />
            <span>DATABASE ACCREDITED ROADMAPS</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            End-to-End Learning Paths
          </h2>
          <p className="text-slate-400 text-sm sm:text-base mt-2">
            Eliminate tutorial hell. Follow structured progression matrices curated for mid-to-senior tech roles.
          </p>
        </div>

        {/* Path Selector Tabs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          {paths.map((path) => {
            const isSelected = path.id === selectedPathId;
            return (
              <button
                key={path.id}
                onClick={() => setSelectedPathId(path.id)}
                className={`p-6 rounded-2xl text-left transition-all duration-300 border cursor-pointer ${
                  isSelected
                    ? 'bg-gradient-to-br from-[#0C1E4E] to-[#0A1636] border-[#00D2FF]/60 shadow-xl shadow-[#00D2FF]/10'
                    : 'bg-white/[0.02] border-white/10 hover:border-white/20 hover:bg-white/[0.04]'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span
                    className="text-xs font-bold uppercase tracking-wider"
                    style={{ color: path.color || '#00D2FF' }}
                  >
                    {path.duration}
                  </span>
                  <ChevronRight
                    className={`w-4 h-4 transition-transform ${
                      isSelected ? 'text-[#00D2FF] translate-x-1' : 'text-slate-500'
                    }`}
                  />
                </div>
                <h3 className="text-lg font-bold text-white mb-1.5">{path.title}</h3>
                <p className="text-xs text-slate-400 line-clamp-2">{path.description}</p>
              </button>
            );
          })}
        </div>

        {/* Active Path Deep Dive Showcase */}
        {activePath && (
          <div className="rounded-3xl bg-[#091129] border border-white/15 p-6 sm:p-10 shadow-2xl">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-8 border-b border-white/10">
              <div>
                <div className="flex items-center gap-2 text-xs font-semibold text-[#00D2FF] uppercase tracking-wider mb-2">
                  <span>GOAL OUTCOME</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
                  {activePath.targetRole}
                </h3>
                <p className="text-sm text-slate-300 mt-1 max-w-xl">
                  {activePath.description}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-6">
                <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10">
                  <div className="text-xs text-slate-400">Target Industry Salary</div>
                  <div className="text-xl font-black text-[#FF7A00] tabular-nums mt-0.5">
                    {activePath.avgSalary}
                  </div>
                </div>

                <button
                  onClick={() => onSelectPath(activePath)}
                  className="px-6 py-3.5 rounded-xl font-bold text-sm text-slate-950 bg-gradient-to-r from-[#00D2FF] to-[#38BDF8] hover:brightness-110 shadow-lg shadow-cyan-500/25 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <span>Enroll in Path</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Stepped Timeline */}
            <div className="pt-8">
              <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-6">
                Sequential Milestone Matrix
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {activePath.steps?.map((st: any) => (
                  <div
                    key={st.step}
                    className="relative p-5 rounded-2xl bg-white/[0.02] border border-white/8 hover:border-[#00D2FF]/40 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-xl bg-[#00D2FF]/10 text-[#00D2FF] font-bold text-xs flex items-center justify-center border border-[#00D2FF]/30 mb-4">
                      Phase {st.step}
                    </div>
                    <h5 className="text-sm font-bold text-white mb-2">{st.title}</h5>
                    <p className="text-xs text-slate-300 leading-relaxed mb-4">{st.desc}</p>
                    <div className="text-[11px] font-semibold text-slate-400 flex items-center gap-1.5 pt-3 border-t border-white/5">
                      <Clock className="w-3 h-3 text-[#FF7A00]" />
                      <span>{st.duration}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
