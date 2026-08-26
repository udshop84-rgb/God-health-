import React, { useState } from 'react';
import { 
  Home, 
  Tv, 
  Plus, 
  BookOpen, 
  Bookmark, 
  User, 
  Video as VideoIcon, 
  X,
  FileSignature,
  Sparkles
} from 'lucide-react';
import { MainViewSection, UserProfile } from '../types';

interface YouTubeBottomNavProps {
  activeSection: MainViewSection;
  onNavigateSection: (section: MainViewSection) => void;
  onOpenUploadVideo: () => void;
  onOpenContactSign: () => void;
  savedTotalCount: number;
  profile: UserProfile;
}

export const YouTubeBottomNav: React.FC<YouTubeBottomNavProps> = ({
  activeSection,
  onNavigateSection,
  onOpenUploadVideo,
  onOpenContactSign,
  savedTotalCount,
  profile,
}) => {
  const [createMenuOpen, setCreateMenuOpen] = useState(false);

  const handleNavClick = (section: MainViewSection) => {
    onNavigateSection(section);
    setCreateMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {/* YouTube-Style Create (+) Action Sheet Modal */}
      {createMenuOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 backdrop-blur-sm animate-in fade-in duration-150">
          <div 
            onClick={() => setCreateMenuOpen(false)} 
            className="absolute inset-0 cursor-pointer"
          />
          <div className="relative w-full max-w-lg bg-neutral-900 border-t border-neutral-800 rounded-t-3xl p-6 shadow-2xl z-10 animate-in slide-in-from-bottom duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <Sparkles className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-display font-bold text-white">
                  Create &amp; Contribute to Health
                </h3>
              </div>
              <button
                onClick={() => setCreateMenuOpen(false)}
                className="p-1.5 text-neutral-400 hover:text-white rounded-full bg-neutral-800 hover:bg-neutral-700 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 gap-2.5 pt-4">
              {/* Option 1: Upload Video */}
              <button
                id="yt-create-upload-video-btn"
                onClick={() => {
                  setCreateMenuOpen(false);
                  onOpenUploadVideo();
                }}
                className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-neutral-950/80 hover:bg-teal-950/40 border border-neutral-800 hover:border-teal-700/50 transition-all text-left group cursor-pointer"
              >
                <div className="w-10 h-10 rounded-xl bg-teal-500/15 text-teal-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <VideoIcon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white group-hover:text-teal-300">
                    Upload Video Masterclass
                  </h4>
                  <p className="text-[11px] text-neutral-400">
                    Share clinical exercise biomechanics &amp; wellness streams
                  </p>
                </div>
              </button>

              {/* Option 2: Contact Sign */}
              <button
                id="yt-create-contact-sign-btn"
                onClick={() => {
                  setCreateMenuOpen(false);
                  onOpenContactSign();
                }}
                className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-neutral-950/80 hover:bg-indigo-950/40 border border-neutral-800 hover:border-indigo-700/50 transition-all text-left group cursor-pointer"
              >
                <div className="w-10 h-10 rounded-xl bg-indigo-500/15 text-indigo-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <FileSignature className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white group-hover:text-indigo-300">
                    Contact Sign &amp; Medical Desk
                  </h4>
                  <p className="text-[11px] text-neutral-400">
                    Sign a clinical query, inquiry, or partnership pitch
                  </p>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* YouTube-Style Fixed Bottom Bar */}
      <nav
        id="youtube-bottom-nav"
        className="fixed bottom-0 left-0 right-0 z-40 bg-neutral-950/95 backdrop-blur-xl border-t border-neutral-800/80 shadow-2xl py-1.5 px-2 sm:px-4"
        aria-label="YouTube-Style Navigation"
      >
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          
          {/* 1. Home Section */}
          <button
            id="yt-bottom-tab-home"
            onClick={() => handleNavClick('home')}
            className={`flex-1 flex flex-col items-center justify-center py-1 rounded-xl transition-all cursor-pointer ${
              activeSection === 'home'
                ? 'text-emerald-400 font-bold scale-105'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <div className="relative">
              <Home className={`w-5 h-5 ${activeSection === 'home' ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
              {activeSection === 'home' && (
                <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-emerald-400" />
              )}
            </div>
            <span className="text-[10px] mt-1 tracking-tight">Home</span>
          </button>

          {/* 2. Video Display Section */}
          <button
            id="yt-bottom-tab-video"
            onClick={() => handleNavClick('video')}
            className={`flex-1 flex flex-col items-center justify-center py-1 rounded-xl transition-all cursor-pointer ${
              activeSection === 'video'
                ? 'text-teal-400 font-bold scale-105'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <div className="relative">
              <Tv className={`w-5 h-5 ${activeSection === 'video' ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
              {activeSection === 'video' && (
                <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-teal-400" />
              )}
            </div>
            <span className="text-[10px] mt-1 tracking-tight">Videos</span>
          </button>

          {/* 3. YouTube Center Create / Upload (+) Button */}
          <div className="flex-none px-1">
            <button
              id="yt-bottom-center-plus-btn"
              onClick={() => setCreateMenuOpen(true)}
              className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-gradient-to-tr from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 text-neutral-950 flex items-center justify-center shadow-lg shadow-emerald-500/25 transition-transform hover:scale-110 active:scale-95 cursor-pointer"
              title="Create Post or Upload Video"
              aria-label="Create Post or Upload Video"
            >
              <Plus className="w-6 h-6 stroke-[2.5]" />
            </button>
          </div>

          {/* 4. Blog Display Section */}
          <button
            id="yt-bottom-tab-blog"
            onClick={() => handleNavClick('blog')}
            className={`flex-1 flex flex-col items-center justify-center py-1 rounded-xl transition-all cursor-pointer ${
              activeSection === 'blog'
                ? 'text-emerald-400 font-bold scale-105'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <div className="relative">
              <BookOpen className={`w-5 h-5 ${activeSection === 'blog' ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
              {activeSection === 'blog' && (
                <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-emerald-400" />
              )}
            </div>
            <span className="text-[10px] mt-1 tracking-tight">Articles</span>
          </button>

          {/* 5. Favorite Section */}
          <button
            id="yt-bottom-tab-favorites"
            onClick={() => handleNavClick('favorites')}
            className={`flex-1 flex flex-col items-center justify-center py-1 rounded-xl transition-all cursor-pointer ${
              activeSection === 'favorites'
                ? 'text-emerald-400 font-bold scale-105'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <div className="relative">
              <Bookmark className={`w-5 h-5 ${activeSection === 'favorites' ? 'fill-emerald-400 stroke-[2.5]' : 'stroke-[1.8]'}`} />
              {savedTotalCount > 0 && (
                <span className="absolute -top-1 -right-2 min-w-[15px] h-[15px] px-1 rounded-full bg-emerald-500 text-neutral-950 text-[9px] font-bold flex items-center justify-center font-mono">
                  {savedTotalCount}
                </span>
              )}
              {activeSection === 'favorites' && (
                <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-emerald-400" />
              )}
            </div>
            <span className="text-[10px] mt-1 tracking-tight">Favorites</span>
          </button>

          {/* 6. Profile Section ("You" / Profile) */}
          <button
            id="yt-bottom-tab-profile"
            onClick={() => handleNavClick('profile')}
            className={`flex-1 flex flex-col items-center justify-center py-1 rounded-xl transition-all cursor-pointer ${
              activeSection === 'profile'
                ? 'text-emerald-400 font-bold scale-105'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <div className="relative">
              <img
                src={profile.avatar}
                alt={profile.name}
                className={`w-5 h-5 rounded-full object-cover border ${
                  activeSection === 'profile'
                    ? 'border-emerald-400 ring-2 ring-emerald-500/30'
                    : 'border-neutral-700'
                }`}
                referrerPolicy="no-referrer"
              />
              {activeSection === 'profile' && (
                <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-emerald-400" />
              )}
            </div>
            <span className="text-[10px] mt-1 tracking-tight">You</span>
          </button>
        </div>
      </nav>
    </>
  );
};
