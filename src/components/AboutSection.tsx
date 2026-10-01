import React from 'react';
import { Logo } from './Logo';
import { Target, Cpu, Users2, ShieldAlert, CheckCircle2, Rocket } from 'lucide-react';

export const AboutSection: React.FC = () => {
  const pillars = [
    {
      icon: Cpu,
      title: 'Production Labs over Toy Demos',
      desc: 'No "to-do list" tutorials. You architect distributed backends, microservices, vector search pipelines, and multi-tenant applications from day one.',
    },
    {
      icon: Users2,
      title: 'Direct Veteran Code Teardowns',
      desc: 'Receive rigorous, line-by-line pull request reviews from staff engineers who have scaled systems to millions of concurrent users.',
    },
    {
      icon: Rocket,
      title: 'Verified Career Velocity',
      desc: 'Our career acceleration engine connects alumni with 180+ hiring partners, comprehensive mock technical screens, and portfolio defense prep.',
    },
  ];

  return (
    <section id="about" className="py-24 bg-[#070D22] border-t border-white/5 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Brand Story & Mission (6 cols) */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#00D2FF] tracking-wider uppercase">
              <Target className="w-3.5 h-3.5" />
              <span>THE HKSURYA METHODOLOGY</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
              We Bridge the Gap Between Theory and Production Engineering
            </h2>

            <p className="text-base text-slate-300 leading-relaxed">
              Founded with the conviction that true software mastery comes from real system building,{' '}
              <strong className="text-white font-semibold">HKSURYA Learning</strong> was engineered
              to replace passive video tutorials with active interactive immersion, 3D visualization,
              and industry-verified curriculum.
            </p>

            <p className="text-sm text-slate-400 leading-relaxed">
              Every course module reflects the exact architectural patterns, CI/CD pipelines, and observability
              practices used in modern Silicon Valley and global enterprise engineering squads today.
            </p>

            {/* Methodology comparison table / highlights */}
            <div className="pt-4 space-y-3">
              {[
                'Interactive 3D spatial simulations that clarify complex computer science internals',
                'Zero simulated stubs: Deploy live to Docker, Kubernetes, and Cloud providers',
                'Curriculum updated bi-monthly to match current 2026 industry standards',
                'Lifetime access to our private alumni network and engineering community',
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3 text-sm text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-[#00D2FF] shrink-0 mt-0.5" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Visual Feature Pillars (6 cols) */}
          <div className="lg:col-span-6 space-y-4">
            {pillars.map((pillar, idx) => {
              const IconComp = pillar.icon;
              return (
                <div
                  key={idx}
                  className="p-6 rounded-3xl bg-[#091129] border border-white/10 hover:border-[#00D2FF]/40 transition-all duration-300 shadow-xl group"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-white/[0.04] border border-white/10 group-hover:border-[#00D2FF]/50 flex items-center justify-center text-[#00D2FF] shrink-0 transition-colors">
                      <IconComp className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white group-hover:text-[#00D2FF] transition-colors mb-1.5">
                        {pillar.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                        {pillar.desc}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Accreditation Callout Card */}
            <div className="p-6 rounded-3xl bg-gradient-to-r from-[#0B2564]/50 to-[#0A1636]/50 border border-[#FF7A00]/30 flex items-center justify-between gap-4">
              <div>
                <div className="text-xs font-bold text-[#FF7A00] uppercase tracking-wider">
                  Accredited Program
                </div>
                <div className="text-sm font-bold text-white mt-0.5">
                  Verified Continuing Education Partner
                </div>
              </div>
              <div className="shrink-0">
                <Logo size="sm" variant="mark" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
