import React, { useState, useEffect } from 'react';
import { 
  Menu, 
  X, 
  PenSquare, 
  Bookmark, 
  HeartPulse, 
  Plus, 
  Home, 
  BookOpen, 
  Tv, 
  User, 
  Activity, 
  ArrowUpRight,
  FileSignature
} from 'lucide-react';
import { MainViewSection, BlogCategory } from '../types';

interface NavbarProps {
  activeSection: MainViewSection;
  onNavigateSection: (section: MainViewSection) => void;
  onOpenLeftMenu: () => void;
  onOpenCreatePost: () => void;
  onOpenUploadVideo: () => void;
  onOpenContactSign: () => void;
  savedTotalCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeSection,
  onNavigateSection,
  onOpenLeftMenu,
  onOpenCreatePost,
  onOpenUploadVideo,
  onOpenContactSign,
  savedTotalCount,
}) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Ordered strictly as requested: 1. Home, 2. Videos, 3. Blog, 4. Favorites, 5. Profile
  const navItems = [
    { id: 'home' as MainViewSection, label: 'Home', icon: Home },
    { id: 'video' as MainViewSection, label: 'Videos', icon: Tv },
    { id: 'blog' as MainViewSection, label: 'Articles', icon: BookOpen },
    { id: 'favorites' as MainViewSection, label: 'Favorites', icon: Bookmark, badge: savedTotalCount },
    { id: 'profile' as MainViewSection, label: 'Profile', icon: User },
  ];

  const handleNavClick = (section: MainViewSection) => {
    onNavigateSection(section);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header
      id="main-navbar"
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled
          ? 'bg-neutral-950/95 backdrop-blur-md border-b border-emerald-950/50 py-2.5 shadow-2xl shadow-black/60'
          : 'bg-gradient-to-b from-neutral-950/90 via-neutral-950/60 to-transparent py-3.5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        
        {/* Left Side: Menu Trigger & Brand Logo */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Menu Drawer Button */}
          <button
            id="navbar-left-menu-btn"
            onClick={onOpenLeftMenu}
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-emerald-950/50 hover:bg-emerald-900/60 border border-emerald-800/50 hover:border-emerald-600/70 text-emerald-300 hover:text-emerald-200 transition-all duration-200 shadow-sm cursor-pointer group focus:outline-none focus:ring-2 focus:ring-emerald-400/40"
            aria-label="Open Health Navigation Directory"
            title="Open Directory Menu"
          >
            <Menu className="w-5 h-5 text-emerald-400 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-bold tracking-wider uppercase hidden sm:inline text-emerald-300">
              MENU
            </span>
          </button>

          {/* Brand Logo: Health is everything */}
          <button
            id="brand-logo-btn"
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-2.5 text-left group cursor-pointer focus:outline-none"
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-emerald-400 via-teal-500 to-emerald-600 flex items-center justify-center text-neutral-950 font-bold text-lg sm:text-xl shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
              <HeartPulse className="w-5 h-5 sm:w-6 sm:h-6 text-neutral-950" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-display text-base sm:text-lg lg:text-xl font-bold tracking-tight text-white group-hover:text-emerald-400 transition-colors">
                  Health is everything
                </span>
                <span className="text-[9px] sm:text-[10px] uppercase font-mono tracking-wider px-1.5 py-0.5 rounded bg-emerald-950/80 border border-emerald-700/50 text-emerald-300 hidden md:inline-block">
                  JOURNAL
                </span>
              </div>
              <p className="text-[10px] sm:text-[11px] text-neutral-400 font-sans tracking-wide hidden sm:block">
                Evidence-Based Longevity &amp; Masterclasses
              </p>
            </div>
          </button>
        </div>

        {/* Center Desktop Navigation Tabs */}
        <nav id="desktop-section-nav" className="hidden lg:flex items-center gap-1 bg-neutral-900/90 border border-neutral-800/80 rounded-full px-2.5 py-1 backdrop-blur-md shadow-inner">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;

            return (
              <button
                key={item.id}
                id={`navbar-tab-${item.id}`}
                onClick={() => handleNavClick(item.id)}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-full transition-all cursor-pointer ${
                  isActive
                    ? 'bg-emerald-500 text-neutral-950 shadow-md shadow-emerald-500/25 font-bold'
                    : 'text-neutral-300 hover:text-white hover:bg-neutral-800/80'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-neutral-950' : 'text-emerald-400'}`} />
                <span>{item.label}</span>
                {item.badge !== undefined && item.badge > 0 && (
                  <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                    isActive ? 'bg-neutral-950 text-emerald-300' : 'bg-emerald-500/20 text-emerald-300'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Right Action Controls: Contact Sign + Upload Video + Write Story */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          
          {/* Contact Sign Button */}
          <button
            id="nav-contact-sign-btn"
            onClick={onOpenContactSign}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-neutral-300 hover:text-emerald-300 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 hover:border-emerald-700/60 rounded-xl transition-all cursor-pointer"
            title="Open Contact Sign & Inquiries"
          >
            <FileSignature className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden xl:inline">Contact Sign</span>
          </button>

          {/* Upload Video Trigger */}
          <button
            id="nav-upload-video-trigger-btn"
            onClick={onOpenUploadVideo}
            className="flex items-center gap-1 px-3 py-2 text-xs font-semibold text-teal-300 hover:text-teal-200 bg-teal-950/40 hover:bg-teal-900/50 border border-teal-800/50 hover:border-teal-600/70 rounded-xl transition-all cursor-pointer"
            title="Upload a new health video masterclass"
          >
            <Plus className="w-3.5 h-3.5 text-teal-400" />
            <span className="hidden sm:inline">Upload Video</span>
          </button>

          {/* Write Article Trigger */}
          <button
            id="nav-write-article-trigger-btn"
            onClick={onOpenCreatePost}
            className="flex items-center gap-1.5 px-3.5 sm:px-4 py-2 text-xs font-bold text-neutral-950 bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 rounded-xl shadow-md shadow-emerald-500/20 transition-all hover:scale-[1.02] cursor-pointer"
            title="Write and publish a health story"
          >
            <PenSquare className="w-3.5 h-3.5" />
            <span>Write Story</span>
          </button>

          {/* Mobile Menu Toggle */}
          <button
            id="mobile-nav-toggle-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-neutral-400 hover:text-white rounded-xl bg-neutral-900 border border-neutral-800 lg:hidden cursor-pointer"
            aria-label="Toggle Mobile Navigation"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Activity className="w-5 h-5 text-emerald-400" />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Navigation */}
      {mobileMenuOpen && (
        <div id="mobile-nav-drawer" className="lg:hidden bg-neutral-950/98 border-b border-neutral-800 px-4 pt-3 pb-6 mt-2 backdrop-blur-xl shadow-2xl animate-in fade-in slide-in-from-top-4 duration-200">
          <div className="flex flex-col gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  id={`mobile-nav-tab-${item.id}`}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center justify-between px-4 py-2.5 rounded-xl text-xs font-semibold text-left transition-all ${
                    isActive
                      ? 'bg-emerald-500 text-neutral-950 font-bold'
                      : 'bg-neutral-900 text-neutral-200 hover:bg-neutral-850 hover:text-emerald-300'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-neutral-950' : 'text-emerald-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-950 border border-emerald-700/50 text-emerald-300">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}

            {/* Contact Sign in mobile */}
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenContactSign();
              }}
              className="flex items-center justify-between px-4 py-2.5 rounded-xl text-xs font-semibold text-left bg-neutral-900/80 border border-neutral-800 text-emerald-400 hover:bg-neutral-800 transition-all"
            >
              <div className="flex items-center gap-2.5">
                <FileSignature className="w-4 h-4 text-emerald-400" />
                <span>Contact Sign &amp; Medical Desk</span>
              </div>
              <span className="text-[10px] font-mono text-neutral-400">OPEN</span>
            </button>

            <div className="pt-2 grid grid-cols-2 gap-2 border-t border-neutral-800/80">
              <button
                id="mobile-nav-write-btn"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenCreatePost();
                }}
                className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-500 text-neutral-950 font-bold text-xs"
              >
                <PenSquare className="w-3.5 h-3.5" />
                <span>Write Story</span>
              </button>
              <button
                id="mobile-nav-upload-video-btn"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenUploadVideo();
                }}
                className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-teal-500 text-neutral-950 font-bold text-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Upload Video</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
