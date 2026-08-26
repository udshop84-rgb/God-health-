import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ShieldCheck, BookOpen, HeartPulse } from 'lucide-react';
import { HEALTH_FAQ_DATA } from '../data/blogData';

interface FaqSectionProps {
  onOpenCreatePost: () => void;
}

export const FaqSection: React.FC<FaqSectionProps> = ({
  onOpenCreatePost,
}) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="health-faq" className="py-16 sm:py-20 bg-neutral-950 border-t border-neutral-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-800/60 text-emerald-300 text-xs font-semibold mb-3">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Health &amp; Editorial Standards</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-white tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-sm sm:text-base text-neutral-400 mt-2">
            Transparency on our clinical citations, peer-review process, and healthspan philosophy.
          </p>
        </div>

        {/* Accordion FAQ Items */}
        <div className="space-y-3">
          {HEALTH_FAQ_DATA.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className="rounded-2xl bg-neutral-900/60 border border-neutral-800/80 overflow-hidden transition-all"
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full px-6 py-4.5 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-neutral-900 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-800/50 hidden sm:inline-block">
                      {faq.category}
                    </span>
                    <span className="text-sm sm:text-base font-bold text-white">
                      {faq.question}
                    </span>
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 text-emerald-400 shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-6 pb-5 pt-1 text-xs sm:text-sm text-neutral-300 leading-relaxed border-t border-neutral-800/60 bg-neutral-950/40 animate-in fade-in duration-200">
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Author Callout */}
        <div className="mt-10 p-5 rounded-2xl bg-gradient-to-r from-emerald-950/30 to-teal-950/30 border border-emerald-800/40 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div>
            <h4 className="text-sm font-bold text-white">Are you a clinician, researcher, or health practitioner?</h4>
            <p className="text-xs text-neutral-400 mt-0.5">Share your peer-reviewed findings with our global readership.</p>
          </div>
          <button
            onClick={onOpenCreatePost}
            className="px-4 py-2 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-neutral-950 font-bold text-xs whitespace-nowrap transition-all hover:scale-105 cursor-pointer"
          >
            Submit an Article
          </button>
        </div>

      </div>
    </section>
  );
};
