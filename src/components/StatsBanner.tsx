import React from 'react';
import { Award, Briefcase, Users, Star, CheckCircle } from 'lucide-react';

export const StatsBanner: React.FC = () => {
  const hiringPartners = [
    { name: 'Google', domain: 'Cloud & AI' },
    { name: 'Microsoft', domain: 'Enterprise Engineering' },
    { name: 'Amazon Web Services', domain: 'Cloud Architecture' },
    { name: 'NVIDIA', domain: 'AI Acceleration' },
    { name: 'Meta', domain: 'Full Stack Systems' },
    { name: 'Stripe', domain: 'Financial Infrastructure' },
  ];

  return (
    <section className="py-12 border-y border-white/10 bg-[#070D22]/60 backdrop-blur-md relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-white/10">
          <div>
            <div className="text-xs font-semibold text-[#00D2FF] tracking-wider uppercase mb-1">
              PROVEN CAREER ACCELERATION
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-white">
              Where HKSURYA Learning Alumni Build
            </h3>
          </div>
          <p className="text-sm text-slate-400 max-w-md">
            Our graduates lead engineering squads, architect mission-critical systems, and scale modern software across global technology leaders.
          </p>
        </div>

        {/* Brand Logos / Partner Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 pt-8">
          {hiringPartners.map((partner, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-white/[0.03] border border-white/8 hover:border-[#00D2FF]/40 transition-colors flex flex-col items-center justify-center text-center group"
            >
              <span className="text-lg font-bold text-slate-200 group-hover:text-white transition-colors">
                {partner.name}
              </span>
              <span className="text-[11px] text-slate-400 mt-0.5">
                {partner.domain}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
