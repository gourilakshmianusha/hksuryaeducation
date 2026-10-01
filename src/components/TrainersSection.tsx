import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Award, Users, Star, BookOpen, ExternalLink, X, CheckCircle, Calendar, RefreshCw } from 'lucide-react';

export const TrainersSection: React.FC = () => {
  const [trainers, setTrainers] = useState<any[]>([]);
  const [activeTrainerModal, setActiveTrainerModal] = useState<any | null>(null);
  const [sessionBooked, setSessionBooked] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTrainers() {
      try {
        const data = await api.public.getTrainers();
        setTrainers(data);
      } catch (err) {
        console.error('Failed to load trainers:', err);
      } finally {
        setLoading(false);
      }
    }
    loadTrainers();
  }, []);

  return (
    <section id="trainers" className="py-20 bg-[#050A1A] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-[#FF7A00] tracking-wider uppercase mb-2">
              <Award className="w-3.5 h-3.5" />
              <span>PRACTITIONERS & ARCHITECTS</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Mentorship from Industry Leaders
            </h2>
            <p className="text-slate-400 text-sm sm:text-base mt-2 max-w-xl">
              Learn directly from engineers who have built large-scale production platforms at Google, DeepMind, AWS, and world-class startups.
            </p>
          </div>

          <div className="text-xs text-slate-400">
            <span className="font-bold text-white tabular-nums">100%</span> Active Engineering Leadership
          </div>
        </div>

        {/* Trainers Grid */}
        {loading ? (
          <div className="py-12 text-center text-slate-400 flex items-center justify-center gap-2">
            <RefreshCw className="w-5 h-5 animate-spin text-[#00D2FF]" />
            <span>Loading faculty mentors from database...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {trainers.map((trainer) => (
              <div
                key={trainer.id}
                className="rounded-3xl bg-[#091129] border border-white/10 p-6 flex flex-col justify-between hover:border-[#FF7A00]/50 transition-all duration-300 shadow-xl group hover:-translate-y-1"
              >
                <div>
                  <div className="relative mb-5 flex items-center justify-between">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#0B2564] to-[#0A1636] border border-[#00D2FF]/40 flex items-center justify-center text-2xl font-black text-[#00D2FF] shadow-lg group-hover:scale-105 transition-transform">
                      {trainer.name.charAt(0)}
                    </div>
                    <div className="flex items-center gap-1 text-xs font-bold text-[#FF7A00]">
                      <Star className="w-3.5 h-3.5 fill-current" />
                      <span>{trainer.rating || 5.0}</span>
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-white group-hover:text-[#00D2FF] transition-colors">
                    {trainer.name}
                  </h3>
                  <div className="text-xs font-semibold text-[#00D2FF] mt-0.5">{trainer.role}</div>
                  <div className="text-xs text-slate-400 mt-0.5">{trainer.company}</div>

                  <p className="text-xs text-slate-300 mt-4 line-clamp-3 leading-relaxed">
                    {trainer.bio}
                  </p>

                  <div className="flex flex-wrap gap-1.5 mt-5">
                    {Array.isArray(trainer.specialties) &&
                      trainer.specialties.slice(0, 3).map((spec: string, i: number) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded-md bg-white/[0.03] border border-white/5 text-[11px] text-slate-300"
                        >
                          {spec}
                        </span>
                      ))}
                  </div>
                </div>

                <div className="pt-6 mt-6 border-t border-white/5">
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-4">
                    <span className="tabular-nums font-semibold text-white">
                      {(trainer.studentsTaught || 0).toLocaleString()}+ students
                    </span>
                    <span>{trainer.experience}</span>
                  </div>

                  <button
                    onClick={() => {
                      setActiveTrainerModal(trainer);
                      setSessionBooked(false);
                    }}
                    className="w-full py-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-[#00D2FF]/40 text-xs font-semibold text-slate-200 hover:text-white transition-all cursor-pointer text-center"
                  >
                    View Profile & Schedule
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Trainer Bio Modal */}
      {activeTrainerModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative w-full max-w-lg bg-[#091129] border border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl">
            <button
              onClick={() => setActiveTrainerModal(null)}
              className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-slate-300"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-2xl bg-blue-900/60 border border-[#00D2FF]/40 flex items-center justify-center text-2xl font-bold text-[#00D2FF]">
                {activeTrainerModal.name.charAt(0)}
              </div>
              <div>
                <h4 className="text-xl font-bold text-white">{activeTrainerModal.name}</h4>
                <div className="text-xs text-[#00D2FF] font-semibold">{activeTrainerModal.role}</div>
                <div className="text-xs text-slate-400">{activeTrainerModal.company}</div>
              </div>
            </div>

            <p className="text-sm text-slate-300 leading-relaxed mb-6">
              {activeTrainerModal.bio}
            </p>

            <div className="space-y-3 mb-6">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Core Engineering Competencies
              </div>
              <div className="flex flex-wrap gap-2">
                {Array.isArray(activeTrainerModal.specialties) &&
                  activeTrainerModal.specialties.map((s: string, i: number) => (
                    <span
                      key={i}
                      className="px-3 py-1 rounded-lg bg-blue-500/10 border border-blue-500/20 text-xs text-[#00D2FF] font-semibold"
                    >
                      {s}
                    </span>
                  ))}
              </div>
            </div>

            {sessionBooked ? (
              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center">
                <CheckCircle className="w-6 h-6 text-emerald-400 mx-auto mb-1.5" />
                <p className="text-sm font-bold text-white">Mentorship slot reserved!</p>
                <p className="text-xs text-slate-400 mt-1">Calendar invitation sent to your email.</p>
              </div>
            ) : (
              <button
                onClick={() => setSessionBooked(true)}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-[#00D2FF] to-[#38BDF8] text-slate-950 font-bold text-sm shadow-lg shadow-cyan-500/25 hover:brightness-110 transition-all flex items-center justify-center gap-2"
              >
                <Calendar className="w-4 h-4" />
                <span>Book 1-on-1 Office Hours</span>
              </button>
            )}
          </div>
        </div>
      )}
    </section>
  );
};
