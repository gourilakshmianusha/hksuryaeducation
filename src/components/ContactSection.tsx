import React, { useState } from 'react';
import { api } from '../services/api';
import { Mail, Phone, MapPin, Send, CheckCircle, MessageSquare, Clock } from 'lucide-react';

export const ContactSection: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    topic: 'Admissions & Enrollment',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) return;

    setIsSubmitting(true);
    try {
      await api.public.submitContact(formData);
      setSubmitted(true);
      setFormData({
        name: '',
        email: '',
        topic: 'Admissions & Enrollment',
        message: '',
      });
      setTimeout(() => setSubmitted(false), 6000);
    } catch (err: any) {
      alert(err.message || 'Error submitting advisory request');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-24 bg-[#070D22] border-t border-white/5 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Column: Contact info & campus details (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#FF7A00] tracking-wider uppercase">
              <MessageSquare className="w-3.5 h-3.5" />
              <span>DIRECT ADMISSIONS ADVISORY</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Connect with Our Engineering Admissions Squad
            </h2>

            <p className="text-sm text-slate-300 leading-relaxed">
              Have questions regarding program prerequisites, tuition sponsorship, or corporate group enrollments? Speak directly with our lead academic advisors.
            </p>

            <div className="space-y-4 pt-4">
              <div className="flex items-start gap-3.5 text-slate-300">
                <div className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-center text-[#00D2FF] shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs text-slate-400">Admissions & Inquiries</div>
                  <div className="text-sm font-semibold text-white">admissions@hksuryalearning.com</div>
                </div>
              </div>

              <div className="flex items-start gap-3.5 text-slate-300">
                <div className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-center text-[#FF7A00] shrink-0">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs text-slate-400">Direct Advising Line</div>
                  <div className="text-sm font-semibold text-white">+1 (800) 457-8792</div>
                </div>
              </div>

              <div className="flex items-start gap-3.5 text-slate-300">
                <div className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-center text-[#00D2FF] shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs text-slate-400">Headquarters & Tech Hub</div>
                  <div className="text-sm font-semibold text-white">500 Howard Street, Suite 400, San Francisco, CA</div>
                </div>
              </div>

              <div className="flex items-start gap-3.5 text-slate-300">
                <div className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-center text-[#38BDF8] shrink-0">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs text-slate-400">Admissions Response Time</div>
                  <div className="text-sm font-semibold text-white">&lt; 4 Hours Guaranteed</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Contact Form (7 cols) */}
          <div className="lg:col-span-7">
            <div className="p-8 sm:p-10 rounded-3xl bg-[#091129] border border-white/10 shadow-2xl relative">
              <h3 className="text-xl font-bold text-white mb-2">Send an Advisory Request</h3>
              <p className="text-xs text-slate-400 mb-6">Fill in your background and our technical counselor will schedule a 20-minute roadmap review.</p>

              {submitted ? (
                <div className="py-12 text-center space-y-3 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-6">
                  <CheckCircle className="w-12 h-12 text-emerald-400 mx-auto" />
                  <h4 className="text-lg font-bold text-white">Advisory Request Received!</h4>
                  <p className="text-xs text-slate-300 max-w-sm mx-auto">
                    An HKSURYA Learning admissions counselor has been assigned to your profile and will email you with syllabus details and interview preparation materials shortly.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        Your Full Name
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Surya Kumar"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#00D2FF] transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        Work or Personal Email
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="surya@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#00D2FF] transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Subject of Inquiry
                    </label>
                    <select
                      value={formData.topic}
                      onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-[#091129] border border-white/10 text-sm text-white focus:outline-none focus:border-[#00D2FF] transition-colors"
                    >
                      <option value="Admissions & Enrollment">Admissions & Cohort Enrollment</option>
                      <option value="Enterprise Team Training">Enterprise & Corporate Team Upskilling</option>
                      <option value="Curriculum & Prerequisites">Curriculum, Hardware & Prerequisites</option>
                      <option value="Scholarships & Tuition Support">Scholarships & Income Share / Installments</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Your Goals or Questions
                    </label>
                    <textarea
                      rows={4}
                      placeholder="Tell us about your current engineering background and career targets..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#00D2FF] transition-colors"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 rounded-xl font-bold text-sm text-slate-900 bg-gradient-to-r from-[#00D2FF] via-[#38BDF8] to-[#00F0FF] hover:brightness-110 shadow-lg shadow-cyan-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    <Send className="w-4 h-4 text-slate-900" />
                    <span>{isSubmitting ? 'Sending Request...' : 'Submit Advisory Request'}</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
