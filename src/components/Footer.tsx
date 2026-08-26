import React from 'react';
import { HeartPulse, ShieldCheck, ArrowUpRight, Sparkles, Dna, Salad, Moon, Brain, Activity, BookOpen, Tv, Bookmark, User } from 'lucide-react';
import { BlogCategory, MainViewSection } from '../types';

interface FooterProps {
  onNavigateSection: (section: MainViewSection) => void;
  onSelectCategory: (category: BlogCategory) => void;
  onOpenCreatePost: () => void;
  onOpenUploadVideo: () => void;
  onOpenContactSign: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onNavigateSection,
  onSelectCategory,
  onOpenCreatePost,
  onOpenUploadVideo,
  onOpenContactSign,
}) => {
  const currentYear = new Date().getFullYear();

  const handleCategoryClick = (cat: BlogCategory) => {
    onSelectCategory(cat);
    onNavigateSection('blog');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-neutral-950 border-t border-neutral-900 text-neutral-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 mb-12">
          
          {/* Col 1: Brand & Mission */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-400 via-teal-500 to-emerald-600 flex items-center justify-center text-neutral-950 shadow-md shadow-emerald-500/20">
                <HeartPulse className="w-5 h-5 text-neutral-950" />
              </div>
              <span className="font-display text-lg font-bold text-white tracking-tight">
                Health is everything
              </span>
            </div>

            <p className="text-neutral-300 leading-relaxed max-w-sm text-xs sm:text-sm">
              An evidence-based publication and video masterclass platform dedicated to decoding human biology, longevity pathways, microbiome diversity, sleep architecture, and sustainable physical vitality.
            </p>

            <div className="flex items-center gap-2 text-[11px] text-emerald-400 font-mono">
              <ShieldCheck className="w-4 h-4" />
              <span>Independent • Peer-Reviewed • No Sponsored Health Fads</span>
            </div>
          </div>

          {/* Col 2: Health Topics */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs uppercase font-bold text-white tracking-wider font-mono">
              Health Pillars
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => handleCategoryClick('longevity')}
                  className="hover:text-emerald-300 transition-colors cursor-pointer text-left"
                >
                  Cellular Longevity &amp; Autophagy
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleCategoryClick('nutrition')}
                  className="hover:text-emerald-300 transition-colors cursor-pointer text-left"
                >
                  Gut Microbiome &amp; Whole Nutrition
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleCategoryClick('sleep-science')}
                  className="hover:text-emerald-300 transition-colors cursor-pointer text-left"
                >
                  Sleep Architecture &amp; Recovery
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleCategoryClick('mental-health')}
                  className="hover:text-emerald-300 transition-colors cursor-pointer text-left"
                >
                  Neuroplasticity &amp; Focus
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleCategoryClick('fitness')}
                  className="hover:text-emerald-300 transition-colors cursor-pointer text-left"
                >
                  Sarcopenia &amp; Resistance Training
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleCategoryClick('preventive-care')}
                  className="hover:text-emerald-300 transition-colors cursor-pointer text-left"
                >
                  Biomarkers &amp; Diagnostic Prevention
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Sections & Hubs (Strictly ordered: Home, Video, Blog, Favorites, Profile) */}
          <div className="md:col-span-2 space-y-3">
            <h4 className="text-xs uppercase font-bold text-white tracking-wider font-mono">
              Platform
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => {
                    onNavigateSection('home');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-emerald-300 transition-colors cursor-pointer text-left"
                >
                  1. Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    onNavigateSection('video');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-emerald-300 transition-colors cursor-pointer text-left"
                >
                  2. Video Masterclasses
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    onNavigateSection('blog');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-emerald-300 transition-colors cursor-pointer text-left"
                >
                  3. Health Articles
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    onNavigateSection('favorites');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-emerald-300 transition-colors cursor-pointer text-left"
                >
                  4. Saved Favorites
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    onNavigateSection('profile');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-emerald-300 transition-colors cursor-pointer text-left"
                >
                  5. My Health Profile
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Authoring & Contact Sign */}
          <div className="md:col-span-2 space-y-3">
            <h4 className="text-xs uppercase font-bold text-white tracking-wider font-mono">
              Contribute &amp; Desk
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={onOpenCreatePost}
                  className="hover:text-emerald-300 transition-colors cursor-pointer text-left flex items-center gap-1"
                >
                  <span>Write Health Story</span>
                  <ArrowUpRight className="w-3 h-3 text-emerald-400" />
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenUploadVideo}
                  className="hover:text-teal-300 transition-colors cursor-pointer text-left flex items-center gap-1"
                >
                  <span>Upload Video</span>
                  <ArrowUpRight className="w-3 h-3 text-teal-400" />
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenContactSign}
                  className="hover:text-emerald-300 text-emerald-400 transition-colors cursor-pointer text-left flex items-center gap-1 font-semibold"
                >
                  <span>Contact Sign Desk</span>
                  <ArrowUpRight className="w-3 h-3 text-emerald-400" />
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright line */}
        <div className="pt-8 border-t border-neutral-900/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-neutral-400">
          <p>© {currentYear} Health is everything. Built for evidence-based wellness.</p>
          <p className="text-neutral-400">
            Medical Disclaimer: Content is for educational purposes and should not replace personalized medical advice.
          </p>
        </div>
      </div>
    </footer>
  );
};
