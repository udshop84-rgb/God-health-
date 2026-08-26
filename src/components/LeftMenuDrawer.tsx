import React from 'react';
import {
  X,
  BookOpen,
  Sparkles,
  Flame,
  Bookmark,
  FileEdit,
  PenSquare,
  Activity,
  HeartPulse,
  Dna,
  Salad,
  Moon,
  Brain,
  Stethoscope,
  Leaf,
  ChevronRight,
  ShieldCheck,
  Mail,
  HelpCircle,
  Calculator,
  Home,
  Tv,
  User,
  Plus,
  Video as VideoIcon
} from 'lucide-react';
import { BlogCategory, BlogPost, MainViewSection, UserProfile } from '../types';
import { HEALTH_CATEGORIES_METADATA } from '../data/blogData';

interface LeftMenuDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activeSection: MainViewSection;
  onNavigateSection: (section: MainViewSection) => void;
  onOpenCreatePost: () => void;
  onOpenUploadVideo: () => void;
  onOpenContactSign: () => void;
  onSelectCategory: (cat: BlogCategory) => void;
  activeCategory: BlogCategory;
  savedTotalCount: number;
  recentPosts: BlogPost[];
  onOpenPost: (post: BlogPost) => void;
  profile?: UserProfile;
}

export const LeftMenuDrawer: React.FC<LeftMenuDrawerProps> = ({
  isOpen,
  onClose,
  activeSection,
  onNavigateSection,
  onOpenCreatePost,
  onOpenUploadVideo,
  onOpenContactSign,
  onSelectCategory,
  activeCategory,
  savedTotalCount,
  recentPosts,
  onOpenPost,
  profile,
}) => {
  if (!isOpen) return null;

  const categoryIcons: Record<string, React.ReactNode> = {
    all: <Sparkles className="w-4 h-4 text-emerald-400" />,
    longevity: <Dna className="w-4 h-4 text-teal-400" />,
    nutrition: <Salad className="w-4 h-4 text-emerald-400" />,
    'sleep-science': <Moon className="w-4 h-4 text-indigo-400" />,
    'mental-health': <Brain className="w-4 h-4 text-purple-400" />,
    fitness: <Activity className="w-4 h-4 text-amber-400" />,
    'preventive-care': <Stethoscope className="w-4 h-4 text-cyan-400" />,
    'holistic-wellness': <Leaf className="w-4 h-4 text-emerald-400" />,
  };

  // Strictly ordered as: 1. Home, 2. Video, 3. Blog, 4. Favorites, 5. Profile
  const navSections: { id: MainViewSection; label: string; icon: any; badge?: number }[] = [
    { id: 'home', label: 'Home Overview', icon: Home },
    { id: 'video', label: 'Video Masterclasses', icon: Tv },
    { id: 'blog', label: 'Health Articles & Blog', icon: BookOpen },
    { id: 'favorites', label: 'Saved Favorites', icon: Bookmark, badge: savedTotalCount },
    { id: 'profile', label: 'My Health Profile', icon: User },
  ];

  const handleSelectSection = (section: MainViewSection) => {
    onNavigateSection(section);
    onClose();
  };

  const handleCategoryClick = (cat: BlogCategory) => {
    onSelectCategory(cat);
    onNavigateSection('blog');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-in fade-in duration-200">
      {/* Backdrop */}
      <div
        id="left-menu-backdrop"
        onClick={onClose}
        className="absolute inset-0 bg-neutral-950/80 backdrop-blur-sm transition-opacity cursor-pointer"
      />

      {/* Drawer Container */}
      <div
        id="left-menu-sidebar"
        className="absolute inset-y-0 left-0 max-w-full flex pr-10"
      >
        <div className="w-screen max-w-md bg-neutral-950 border-r border-emerald-950/60 shadow-2xl flex flex-col justify-between overflow-y-auto">
          
          {/* Header */}
          <div className="p-6 border-b border-neutral-900 sticky top-0 bg-neutral-950/95 backdrop-blur-md z-10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 via-teal-500 to-emerald-600 flex items-center justify-center text-neutral-950 font-bold shadow-md shadow-emerald-500/20">
                  <HeartPulse className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="font-display font-bold text-lg text-white">
                    Health is everything
                  </h2>
                  <p className="text-xs text-neutral-400">
                    Menu &amp; Medical Topic Hub
                  </p>
                </div>
              </div>

              <button
                id="close-left-menu-btn"
                onClick={onClose}
                className="p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-neutral-900 transition-colors cursor-pointer"
                aria-label="Close Health Menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Action Buttons: Write & Upload */}
            <div className="grid grid-cols-2 gap-2 mt-5">
              <button
                id="drawer-write-story-btn"
                onClick={() => {
                  onClose();
                  onOpenCreatePost();
                }}
                className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold text-xs shadow-md transition-all cursor-pointer"
              >
                <PenSquare className="w-4 h-4" />
                <span>Write Story</span>
              </button>
              <button
                id="drawer-upload-video-btn"
                onClick={() => {
                  onClose();
                  onOpenUploadVideo();
                }}
                className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-neutral-950 font-bold text-xs shadow-md transition-all cursor-pointer"
              >
                <VideoIcon className="w-4 h-4" />
                <span>Upload Video</span>
              </button>
            </div>
          </div>

          {/* Body Sections */}
          <div className="p-6 space-y-8 flex-1">
            
            {/* Primary Navigation Sections */}
            <div>
              <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-3 px-1">
                Main Navigation
              </h3>
              <div className="space-y-1">
                {navSections.map((sec) => {
                  const Icon = sec.icon;
                  const isActive = activeSection === sec.id;

                  return (
                    <button
                      key={sec.id}
                      id={`drawer-nav-${sec.id}`}
                      onClick={() => handleSelectSection(sec.id)}
                      className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                        isActive
                          ? 'bg-emerald-500 text-neutral-950 font-bold shadow-md shadow-emerald-500/20'
                          : 'text-neutral-300 hover:text-white hover:bg-neutral-900'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className={`w-4 h-4 ${isActive ? 'text-neutral-950' : 'text-emerald-400'}`} />
                        <span>{sec.label}</span>
                      </div>
                      {sec.badge !== undefined && sec.badge > 0 && (
                        <span className={`px-2 py-0.5 rounded-full text-[10px] ${
                          isActive ? 'bg-neutral-950 text-emerald-300 font-mono' : 'bg-emerald-950 border border-emerald-700/50 text-emerald-300'
                        }`}>
                          {sec.badge}
                        </span>
                      )}
                    </button>
                  );
                })}

                {/* Contact Sign item */}
                <button
                  id="drawer-contact-sign-btn"
                  onClick={() => {
                    onOpenContactSign();
                    onClose();
                  }}
                  className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer bg-neutral-900/60 hover:bg-neutral-850 text-emerald-300 border border-neutral-800/80 hover:border-emerald-700/60"
                >
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-emerald-400" />
                    <span>Contact Sign &amp; Medical Desk</span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-400 border border-emerald-800/50">
                    SIGN
                  </span>
                </button>
              </div>
            </div>

            {/* Health Topic Directory */}
            <div>
              <div className="flex items-center justify-between mb-3 px-1">
                <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
                  Health Categories
                </h3>
                <span className="text-[10px] font-mono text-emerald-400">PEER-REVIEWED</span>
              </div>

              <div className="space-y-1">
                {HEALTH_CATEGORIES_METADATA.map((cat) => {
                  const isSelected = activeCategory === cat.id && activeSection === 'blog';
                  return (
                    <button
                      key={cat.id}
                      id={`drawer-category-${cat.id}`}
                      onClick={() => handleCategoryClick(cat.id as BlogCategory)}
                      className={`w-full flex items-center justify-between p-2.5 rounded-xl transition-all cursor-pointer text-left ${
                        isSelected
                          ? 'bg-neutral-800/90 text-emerald-300 border border-emerald-600/50'
                          : 'hover:bg-neutral-900 text-neutral-300'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="p-1.5 rounded-lg bg-neutral-900 border border-neutral-800">
                          {categoryIcons[cat.id] || <Sparkles className="w-4 h-4 text-emerald-400" />}
                        </div>
                        <div className="truncate">
                          <p className="text-xs font-semibold truncate">{cat.label}</p>
                          <p className="text-[10px] text-neutral-500 truncate">{cat.description}</p>
                        </div>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-neutral-600 shrink-0" />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Top Recent Reading Picks */}
            <div>
              <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-3 px-1">
                Latest Reading Picks
              </h3>
              <div className="space-y-2.5">
                {recentPosts.slice(0, 2).map((post) => (
                  <div
                    key={post.id}
                    onClick={() => {
                      onOpenPost(post);
                      onClose();
                    }}
                    className="p-3 rounded-xl bg-neutral-900/60 border border-neutral-800/80 hover:border-emerald-700/60 transition-all cursor-pointer group"
                  >
                    <span className="text-[10px] font-mono text-emerald-400 uppercase">
                      {post.categoryLabel}
                    </span>
                    <h4 className="text-xs font-semibold text-neutral-200 group-hover:text-emerald-300 transition-colors line-clamp-2 mt-1">
                      {post.title}
                    </h4>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Footer of Drawer */}
          <div className="p-5 border-t border-neutral-900 bg-neutral-950 text-xs text-neutral-400 space-y-3">
            {profile && (
              <div 
                onClick={() => {
                  onNavigateSection('profile');
                  onClose();
                }}
                className="flex items-center gap-3 p-2.5 rounded-2xl bg-neutral-900/90 border border-neutral-800 hover:border-emerald-500/50 transition-all cursor-pointer group"
              >
                <img
                  src={profile.avatar}
                  alt={profile.name}
                  className="w-10 h-10 rounded-xl object-cover border border-emerald-500/40 group-hover:scale-105 transition-transform"
                  referrerPolicy="no-referrer"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-white group-hover:text-emerald-300 transition-colors truncate">
                      {profile.name}
                    </h4>
                    <span className="text-[9px] font-mono uppercase bg-emerald-500/20 text-emerald-300 px-1.5 py-0.2 rounded">
                      PRO
                    </span>
                  </div>
                  <p className="text-[10px] text-neutral-400 truncate">{profile.role}</p>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between text-[11px] font-mono pt-1">
              <span className="flex items-center gap-1 text-emerald-400">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>100% Evidence-Based</span>
              </span>
              <span>v2.4.0</span>
            </div>
            <p className="text-[10px] text-neutral-500">
              © 2026 Health is everything. Medical &amp; Vitality Research Platform.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
