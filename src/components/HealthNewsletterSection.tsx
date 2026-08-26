import React, { useState } from 'react';
import { Mail, Check, Sparkles, ShieldCheck, HeartPulse } from 'lucide-react';
import confetti from 'canvas-confetti';
import { BlogCategory } from '../types';

export const HealthNewsletterSection: React.FC = () => {
  const [email, setEmail] = useState('');
  const [selectedTopics, setSelectedTopics] = useState<string[]>([
    'longevity',
    'nutrition',
    'sleep-science'
  ]);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);

  const topicsList = [
    { id: 'longevity', label: '🧬 Longevity & Autophagy' },
    { id: 'nutrition', label: '🥗 Microbiome & Nutrition' },
    { id: 'sleep-science', label: '🌙 Sleep Architecture' },
    { id: 'mental-health', label: '🧠 Neuroscience & Mood' },
    { id: 'fitness', label: '🏃 Sarcopenia & Fitness' },
    { id: 'preventive-care', label: '🩺 Biomarkers & Labs' },
  ];

  const toggleTopic = (id: string) => {
    setSelectedTopics((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) return;

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setIsSubscribed(true);
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#10B981', '#14B8A6', '#34D399']
      });
    }, 500);
  };

  return (
    <section id="health-newsletter" className="py-16 sm:py-20 bg-neutral-950 border-t border-neutral-900 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-emerald-500/5 blur-3xl rounded-full pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-b from-neutral-900/90 via-neutral-900/60 to-neutral-950 border border-emerald-950/80 shadow-2xl text-center">
          
          <div className="w-12 h-12 rounded-2xl bg-emerald-950/80 border border-emerald-700/60 flex items-center justify-center text-emerald-400 mx-auto mb-4 shadow-lg shadow-emerald-500/20">
            <Mail className="w-6 h-6" />
          </div>

          <span className="text-xs font-mono text-emerald-400 uppercase tracking-widest block mb-2">
            Weekly Longevity &amp; Vitality Digest
          </span>

          <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-white tracking-tight">
            The Evidence-Based Sunday Briefing
          </h2>

          <p className="text-sm text-neutral-300 max-w-xl mx-auto mt-2 leading-relaxed">
            Join 48,000+ physicians, researchers, and health enthusiasts. Every Sunday, we distill the week’s top clinical trials into 3 actionable longevity protocols.
          </p>

          {!isSubscribed ? (
            <form onSubmit={handleSubmit} className="mt-8 space-y-5 max-w-lg mx-auto">
              
              {/* Topic Selectors */}
              <div className="flex flex-wrap justify-center gap-2">
                {topicsList.map((t) => {
                  const isChecked = selectedTopics.includes(t.id);
                  return (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => toggleTopic(t.id)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
                        isChecked
                          ? 'bg-emerald-950 border border-emerald-500/50 text-emerald-300 font-semibold'
                          : 'bg-neutral-950 border border-neutral-800 text-neutral-400 hover:text-neutral-200'
                      }`}
                    >
                      {t.label}
                    </button>
                  );
                })}
              </div>

              {/* Email Input & Submit */}
              <div className="flex flex-col sm:flex-row items-center gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your primary email address..."
                  className="w-full px-4 py-3 rounded-xl bg-neutral-950 border border-neutral-700 text-sm text-white placeholder-neutral-400 focus:outline-none focus:border-emerald-500 shadow-inner"
                  required
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 text-neutral-950 font-bold text-xs shadow-md shadow-emerald-500/20 whitespace-nowrap transition-all hover:scale-[1.02] cursor-pointer disabled:opacity-50"
                >
                  {loading ? 'Subscribing...' : 'Get Digest'}
                </button>
              </div>

              <div className="flex items-center justify-center gap-4 text-[11px] text-neutral-400">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>No marketing spam</span>
                </span>
                <span>•</span>
                <span>Unsubscribe anytime</span>
                <span>•</span>
                <span>100% Free</span>
              </div>
            </form>
          ) : (
            <div className="mt-8 p-6 rounded-2xl bg-emerald-950/50 border border-emerald-500/40 text-center space-y-2 animate-in zoom-in-95 duration-200">
              <div className="w-10 h-10 rounded-full bg-emerald-400 text-neutral-950 flex items-center justify-center mx-auto mb-2 font-bold">
                <Check className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white">You're on the priority list!</h3>
              <p className="text-xs text-emerald-300 max-w-sm mx-auto">
                Check your inbox for a confirmation and our complimentary <strong>"2026 Biomarker Longevity Reference Guide"</strong>.
              </p>
            </div>
          )}

        </div>
      </div>
    </section>
  );
};
