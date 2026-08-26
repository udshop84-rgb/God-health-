import React from 'react';
import { 
  ArrowRight, 
  Sparkles, 
  Search, 
  HeartPulse, 
  Activity, 
  Dna, 
  Salad, 
  Moon, 
  ShieldCheck, 
  PenSquare, 
  Calculator 
} from 'lucide-react';
import { BlogCategory } from '../types';

interface HeroProps {
  onNavigateToSection: (id: string) => void;
  onOpenCreatePost: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onSelectCategory: (cat: BlogCategory) => void;
}

export const Hero: React.FC<HeroProps> = ({
  onNavigateToSection,
  onOpenCreatePost,
  searchQuery,
  onSearchChange,
  onSelectCategory,
}) => {
  const trendingTags = [
    { label: 'Autophagy Fasting', category: 'longevity' as BlogCategory },
    { label: 'Gut Microbiome', category: 'nutrition' as BlogCategory },
    { label: 'Deep Sleep Glymphatic', category: 'sleep-science' as BlogCategory },
    { label: 'Dopamine Reset', category: 'mental-health' as BlogCategory },
    { label: 'ApoB Biomarkers', category: 'preventive-care' as BlogCategory },
    { label: 'Sarcopenia & Muscle', category: 'fitness' as BlogCategory },
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNavigateToSection('blog-section');
  };

  const handleTagClick = (category: BlogCategory, tagLabel: string) => {
    onSelectCategory(category);
    onSearchChange(tagLabel);
    onNavigateToSection('blog-section');
  };

  return (
    <section id="hero" className="relative pt-28 pb-16 lg:pt-36 lg:pb-24 overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] sm:w-[900px] h-[400px] bg-gradient-to-tr from-emerald-500/10 via-teal-500/10 to-transparent blur-3xl rounded-full pointer-events-none -z-10" />
      <div className="absolute top-1/3 -right-24 w-80 h-80 bg-teal-500/5 blur-3xl rounded-full pointer-events-none -z-10" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Editorial Eyebrow Badge */}
        <div className="flex items-center gap-2 mb-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-950/60 border border-emerald-800/60 text-emerald-300 text-xs font-semibold backdrop-blur-md shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Health is everything • Evidence-Based Wellness Journal</span>
          </div>
          <div className="hidden sm:flex items-center gap-1 text-[11px] text-neutral-400 font-mono">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Peer-Reviewed Science</span>
          </div>
        </div>

        {/* Main Headline */}
        <div className="max-w-4xl">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-extrabold text-white tracking-tight leading-[1.12]">
            Evidence-based science for a{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-teal-200 to-emerald-400">
              longer, healthier, vibrant life.
            </span>
          </h1>

          <p className="mt-5 text-base sm:text-lg lg:text-xl text-neutral-300 font-normal leading-relaxed max-w-3xl">
            Welcome to <strong className="text-white font-semibold">Health is everything</strong>—your premier publication for rigorous deep-dives into human longevity, gut microbiome biology, circadian sleep architecture, metabolic resilience, and mindful living.
          </p>
        </div>

        {/* Interactive Search & Filter Bar */}
        <div className="mt-8 max-w-2xl">
          <form onSubmit={handleSearchSubmit} className="relative flex items-center">
            <div className="absolute left-4 text-emerald-400">
              <Search className="w-5 h-5" />
            </div>
            <input
              id="hero-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search longevity protocols, gut health, sleep biomarkers..."
              className="w-full pl-12 pr-28 py-3.5 rounded-2xl bg-neutral-900/90 border border-neutral-700/80 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30 text-white placeholder-neutral-400 text-sm shadow-xl transition-all"
            />
            <button
              type="submit"
              className="absolute right-2 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 text-neutral-950 font-bold text-xs shadow-md transition-all hover:scale-[1.02] cursor-pointer"
            >
              Explore
            </button>
          </form>

          {/* Quick Trending Health Tags */}
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span className="text-[11px] text-neutral-400 font-mono">Trending:</span>
            {trendingTags.map((t) => (
              <button
                key={t.label}
                onClick={() => handleTagClick(t.category, t.label)}
                className="px-2.5 py-1 text-[11px] font-medium rounded-lg bg-neutral-900 hover:bg-emerald-950/60 border border-neutral-800 hover:border-emerald-600/50 text-neutral-300 hover:text-emerald-300 transition-colors cursor-pointer"
              >
                #{t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Action CTAs */}
        <div className="mt-8 flex flex-wrap items-center gap-3.5">
          <button
            id="hero-read-articles-cta"
            onClick={() => onNavigateToSection('blog-section')}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-neutral-950 font-bold text-sm shadow-lg shadow-emerald-500/20 transition-all hover:scale-[1.02] cursor-pointer"
          >
            <span>Read Health Articles</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            id="hero-write-post-cta"
            onClick={onOpenCreatePost}
            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 hover:border-emerald-700/50 text-neutral-200 hover:text-white font-semibold text-sm transition-all cursor-pointer"
          >
            <PenSquare className="w-4 h-4 text-emerald-400" />
            <span>Write Story</span>
          </button>

          <button
            id="hero-health-tools-cta"
            onClick={() => onNavigateToSection('health-tools')}
            className="flex items-center gap-2 px-4 py-3 rounded-xl text-neutral-400 hover:text-emerald-300 hover:bg-neutral-900/60 text-xs font-medium transition-all cursor-pointer"
          >
            <Calculator className="w-4 h-4 text-emerald-400" />
            <span>Hydration &amp; Sleep Calculator</span>
            <span className="text-emerald-400">→</span>
          </button>
        </div>

        {/* 4 Pillars of Health Infographic Cards */}
        <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-3.5">
          
          <div 
            onClick={() => {
              onSelectCategory('longevity');
              onNavigateToSection('blog-section');
            }}
            className="p-4 rounded-2xl bg-neutral-900/60 hover:bg-neutral-900 border border-neutral-800/80 hover:border-emerald-600/40 transition-all cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-lg bg-teal-950 border border-teal-800/50 flex items-center justify-center text-teal-400 mb-2.5 group-hover:scale-105 transition-transform">
              <Dna className="w-4 h-4" />
            </div>
            <span className="text-[11px] font-mono text-emerald-400 uppercase">Pillar 01</span>
            <h3 className="text-sm font-semibold text-white group-hover:text-emerald-300 transition-colors">
              Cellular Longevity
            </h3>
            <p className="text-xs text-neutral-400 mt-1 line-clamp-2">
              Autophagy activation, mitochondrial renewal, and biological age reversal.
            </p>
          </div>

          <div 
            onClick={() => {
              onSelectCategory('nutrition');
              onNavigateToSection('blog-section');
            }}
            className="p-4 rounded-2xl bg-neutral-900/60 hover:bg-neutral-900 border border-neutral-800/80 hover:border-emerald-600/40 transition-all cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-lg bg-emerald-950 border border-emerald-800/50 flex items-center justify-center text-emerald-400 mb-2.5 group-hover:scale-105 transition-transform">
              <Salad className="w-4 h-4" />
            </div>
            <span className="text-[11px] font-mono text-emerald-400 uppercase">Pillar 02</span>
            <h3 className="text-sm font-semibold text-white group-hover:text-emerald-300 transition-colors">
              Gut &amp; Nutrition
            </h3>
            <p className="text-xs text-neutral-400 mt-1 line-clamp-2">
              Microbial biodiversity, enteric neurotransmitters, and metabolic health.
            </p>
          </div>

          <div 
            onClick={() => {
              onSelectCategory('sleep-science');
              onNavigateToSection('blog-section');
            }}
            className="p-4 rounded-2xl bg-neutral-900/60 hover:bg-neutral-900 border border-neutral-800/80 hover:border-emerald-600/40 transition-all cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-lg bg-indigo-950 border border-indigo-800/50 flex items-center justify-center text-indigo-400 mb-2.5 group-hover:scale-105 transition-transform">
              <Moon className="w-4 h-4" />
            </div>
            <span className="text-[11px] font-mono text-emerald-400 uppercase">Pillar 03</span>
            <h3 className="text-sm font-semibold text-white group-hover:text-emerald-300 transition-colors">
              Deep Sleep Wash
            </h3>
            <p className="text-xs text-neutral-400 mt-1 line-clamp-2">
              Glymphatic neuro-cleansing, Delta stages, and circadian photon entrainment.
            </p>
          </div>

          <div 
            onClick={() => {
              onSelectCategory('fitness');
              onNavigateToSection('blog-section');
            }}
            className="p-4 rounded-2xl bg-neutral-900/60 hover:bg-neutral-900 border border-neutral-800/80 hover:border-emerald-600/40 transition-all cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-lg bg-amber-950 border border-amber-800/50 flex items-center justify-center text-amber-400 mb-2.5 group-hover:scale-105 transition-transform">
              <Activity className="w-4 h-4" />
            </div>
            <span className="text-[11px] font-mono text-emerald-400 uppercase">Pillar 04</span>
            <h3 className="text-sm font-semibold text-white group-hover:text-emerald-300 transition-colors">
              Muscle &amp; Metabolism
            </h3>
            <p className="text-xs text-neutral-400 mt-1 line-clamp-2">
              Resistance training as endocrine armor, Zone 2 aerobic base, and sarcopenia prevention.
            </p>
          </div>

        </div>

      </div>
    </section>
  );
};
