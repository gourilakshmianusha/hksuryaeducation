import React from 'react';
import { Hero3DCanvas } from './canvas/Hero3DCanvas';
import { Logo } from './Logo';
import { ArrowRight, Sparkles, BookOpen, Compass, ShieldCheck, Award } from 'lucide-react';

interface HeroSectionProps {
  onExploreCourses: () => void;
  onGetStarted: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onExploreCourses,
  onGetStarted,
}) => {
  return (
    <section
      id="home"
      className="relative min-h-[92vh] lg:min-h-screen flex items-center pt-24 pb-12 overflow-hidden bg-[#050A1A]"
    >
      {/* Dynamic Ambient Background Glows */}
      <div className="absolute top-1/4 -left-48 w-96 h-96 bg-[#0066FF]/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-0 w-[480px] h-[480px] bg-[#FF7A00]/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-[#00D2FF]/15 rounded-full blur-[120px] pointer-events-none" />

      {/* Grid Pattern Underlay */}
      <div
        className="absolute inset-0 opacity-[0.035] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(#00D2FF 1px, transparent 1px), linear-gradient(90deg, #00D2FF 1px, transparent 1px)`,
          backgroundSize: '48px 48px',
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-4 items-center min-h-[70vh]">
          {/* LEFT COLUMN: HERO HEADLINE & CALL TO ACTIONS (5-6 cols) */}
          <div className="lg:col-span-6 flex flex-col justify-center text-left pt-6 lg:pt-0">
            {/* Brand Logo in Hero */}
            <div className="mb-5 inline-flex items-center">
              <div className="p-2.5 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-md shadow-inner">
                <Logo size="md" variant="dark" showTagline={false} />
              </div>
            </div>

            {/* Quiet Kick-off Indicator (Editorial text, anti-slop) */}
            <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-[#00D2FF] mb-3">
              <span className="w-2 h-2 rounded-full bg-[#00D2FF] animate-pulse" />
              <span>ACCREDITED NEXT-GEN EDTECH PLATFORM</span>
              <span className="text-slate-500">·</span>
              <span className="text-[#FF7A00]">FALL 2026 COHORT OPEN</span>
            </div>

            {/* Primary Headline: "Learn Today. Build Tomorrow." */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.1] mb-5">
              Learn Today.{' '}
              <span className="bg-gradient-to-r from-[#00D2FF] via-[#0099FF] to-[#FF7A00] bg-clip-text text-transparent">
                Build Tomorrow.
              </span>
            </h1>

            {/* Sub-headline: "Build practical skills, gain industry knowledge, and grow your career with HKSURYA Learning." */}
            <p className="text-lg sm:text-xl text-slate-300 font-normal leading-relaxed max-w-xl mb-8">
              Build practical skills, gain industry knowledge, and grow your career with{' '}
              <strong className="text-white font-semibold">HKSURYA Learning</strong>.
              Experience interactive 3D curriculum, production-grade labs, and mentorship from veteran tech leaders.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-4 mb-10">
              <button
                onClick={onExploreCourses}
                className="px-7 py-3.5 rounded-xl font-bold text-base text-slate-900 bg-gradient-to-r from-[#00D2FF] via-[#38BDF8] to-[#00F0FF] hover:brightness-110 shadow-lg shadow-cyan-500/25 transition-all duration-200 cursor-pointer flex items-center gap-2"
              >
                <BookOpen className="w-5 h-5 text-slate-900" />
                <span>Explore Courses</span>
              </button>

              <button
                onClick={onGetStarted}
                className="px-7 py-3.5 rounded-xl font-bold text-base text-white bg-gradient-to-r from-[#FF7A00] to-[#E65100] hover:brightness-110 shadow-lg shadow-orange-500/25 transition-all duration-200 cursor-pointer flex items-center gap-2"
              >
                <span>Get Started</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>

            {/* Quantitative Proof / Metric Row (Clean unboxed text) */}
            <div className="pt-6 border-t border-white/10 grid grid-cols-3 gap-4 max-w-lg">
              <div>
                <div className="text-2xl lg:text-3xl font-black text-white tabular-nums">50K+</div>
                <div className="text-xs text-slate-400 font-medium mt-0.5">Global Alumni</div>
              </div>
              <div>
                <div className="text-2xl lg:text-3xl font-black text-[#00D2FF] tabular-nums">94.8%</div>
                <div className="text-xs text-slate-400 font-medium mt-0.5">Placement Rate</div>
              </div>
              <div>
                <div className="text-2xl lg:text-3xl font-black text-[#FF7A00] tabular-nums">4.95/5</div>
                <div className="text-xs text-slate-400 font-medium mt-0.5">Student Rating</div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: REAL INTERACTIVE 3D HERO ARENA (6-7 cols) */}
          <div className="lg:col-span-6 relative h-[450px] sm:h-[520px] lg:h-[620px] w-full flex items-center justify-center">
            {/* 3D Scene Viewport Canvas */}
            <div className="w-full h-full relative rounded-3xl overflow-hidden border border-white/10 bg-[#060D22]/60 backdrop-blur-sm shadow-2xl">
              <Hero3DCanvas />

              {/* Floating Spatial HUD Indicators */}
              <div className="absolute top-4 right-4 pointer-events-none hidden sm:flex items-center gap-2 bg-[#050A1A]/70 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 text-xs text-slate-300">
                <span className="w-2 h-2 rounded-full bg-[#00D2FF] animate-pulse" />
                <span>Interactive 3D Arena · Drag to Rotate</span>
              </div>

              {/* Bottom Feature Badges Over 3D */}
              <div className="absolute bottom-4 left-4 right-4 pointer-events-none flex flex-wrap items-center justify-between gap-2 px-3 py-2 rounded-2xl bg-[#050A1A]/80 backdrop-blur-md border border-white/10 text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-[#FF7A00]" />
                  <span>Real 3D Interactive Lab</span>
                </div>
                <div className="flex items-center gap-2 text-slate-400">
                  <ShieldCheck className="w-4 h-4 text-[#00D2FF]" />
                  <span>Industry-Verified Syllabi</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
