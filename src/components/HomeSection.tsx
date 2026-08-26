import React, { useState, useMemo } from 'react';
import { 
  Search, 
  BookOpen, 
  Tv, 
  X, 
  Play, 
  Clock, 
  Heart, 
  Bookmark, 
  ArrowRight, 
  Sparkles,
  Eye
} from 'lucide-react';
import { BlogPost, HealthVideo, BlogCategory, MainViewSection } from '../types';

interface HomeSectionProps {
  posts: BlogPost[];
  videos: HealthVideo[];
  savedPostIds: string[];
  savedVideoIds: string[];
  onToggleSavePost: (id: string) => void;
  onToggleSaveVideo: (id: string) => void;
  onOpenPost: (post: BlogPost) => void;
  onOpenVideo: (video: HealthVideo) => void;
  onNavigateToSection: (section: MainViewSection) => void;
  onSelectCategory: (cat: BlogCategory) => void;
  onOpenCreatePost: () => void;
  onOpenUploadVideo: () => void;
  onOpenContactSign?: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

export const HomeSection: React.FC<HomeSectionProps> = ({
  posts,
  videos,
  savedPostIds,
  savedVideoIds,
  onToggleSavePost,
  onToggleSaveVideo,
  onOpenPost,
  onOpenVideo,
  onNavigateToSection,
  searchQuery,
  onSearchChange,
}) => {
  const [filterType, setFilterType] = useState<'all' | 'articles' | 'videos'>('all');

  // Filter published posts
  const publishedPosts = useMemo(() => {
    return posts.filter((p) => p.status === 'published');
  }, [posts]);

  // Filtered posts based on search query
  const filteredPosts = useMemo(() => {
    if (!searchQuery.trim()) return publishedPosts;
    const q = searchQuery.toLowerCase().trim();
    return publishedPosts.filter((post) => {
      const matchTitle = post.title.toLowerCase().includes(q);
      const matchExcerpt = post.excerpt.toLowerCase().includes(q);
      const matchCategory = post.categoryLabel.toLowerCase().includes(q);
      const matchTags = post.tags.some((t) => t.toLowerCase().includes(q));
      const matchAuthor = post.author.name.toLowerCase().includes(q);
      return matchTitle || matchExcerpt || matchCategory || matchTags || matchAuthor;
    });
  }, [publishedPosts, searchQuery]);

  // Filtered videos based on search query
  const filteredVideos = useMemo(() => {
    if (!searchQuery.trim()) return videos;
    const q = searchQuery.toLowerCase().trim();
    return videos.filter((video) => {
      const matchTitle = video.title.toLowerCase().includes(q);
      const matchDesc = video.description.toLowerCase().includes(q);
      const matchCategory = video.categoryLabel.toLowerCase().includes(q);
      const matchTags = video.tags.some((t) => t.toLowerCase().includes(q));
      const matchInstructor = video.instructor.name.toLowerCase().includes(q);
      return matchTitle || matchDesc || matchCategory || matchTags || matchInstructor;
    });
  }, [videos, searchQuery]);

  const hasAnyContent = publishedPosts.length > 0 || videos.length > 0;
  const isSearching = searchQuery.trim().length > 0;

  return (
    <div id="home-section" className="min-h-[80vh] flex flex-col items-center justify-start relative overflow-hidden px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
      {/* Background ambient lighting effects */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] sm:w-[850px] h-[450px] bg-gradient-to-tr from-emerald-500/10 via-teal-500/5 to-indigo-500/5 blur-[140px] rounded-full pointer-events-none -z-10" />

      {/* Main Container */}
      <div className="w-full max-w-5xl mx-auto space-y-10">
        
        {/* Brand Headline & Intro */}
        <div className="text-center space-y-3 pt-6 sm:pt-10">
          <h1 className="text-4xl sm:text-6xl font-display font-extrabold text-white tracking-tight leading-tight">
            Health is{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-teal-200 to-emerald-400">
              everything
            </span>
          </h1>
          <p className="text-sm sm:text-base text-neutral-400 max-w-md mx-auto leading-relaxed">
            Search for topics, articles, and video masterclasses.
          </p>
        </div>

        {/* Dedicated Search Bar */}
        <div className="max-w-2xl mx-auto space-y-4">
          <div className="relative flex items-center shadow-2xl rounded-2xl sm:rounded-3xl bg-neutral-900/90 border border-neutral-700/80 hover:border-emerald-500/60 focus-within:border-emerald-400 focus-within:ring-4 focus-within:ring-emerald-500/20 transition-all backdrop-blur-xl">
            <div className="pl-4 sm:pl-5 text-emerald-400 flex items-center pointer-events-none">
              <Search className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>

            <input
              id="home-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search your favorite topics, articles, videos..."
              autoFocus
              className="w-full pl-3 sm:pl-4 pr-12 py-4 sm:py-5 bg-transparent text-white placeholder-neutral-500 text-sm sm:text-base focus:outline-none"
            />

            {/* Clear Button */}
            {searchQuery && (
              <button
                type="button"
                id="clear-search-btn"
                onClick={() => onSearchChange('')}
                className="mr-3 p-1.5 text-neutral-400 hover:text-white rounded-full hover:bg-neutral-800 transition-colors cursor-pointer"
                title="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Quick Filter Buttons if content or searching */}
          {(hasAnyContent || isSearching) && (
            <div className="flex items-center justify-center gap-2 pt-2">
              <button
                type="button"
                id="filter-all-btn"
                onClick={() => setFilterType('all')}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                  filterType === 'all'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : 'bg-neutral-900/60 text-neutral-400 border border-neutral-800 hover:text-white'
                }`}
              >
                All Content ({filteredPosts.length + filteredVideos.length})
              </button>
              <button
                type="button"
                id="filter-articles-btn"
                onClick={() => setFilterType('articles')}
                className={`inline-flex items-center gap-1 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                  filterType === 'articles'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : 'bg-neutral-900/60 text-neutral-400 border border-neutral-800 hover:text-white'
                }`}
              >
                <BookOpen className="w-3 h-3" />
                <span>Articles ({filteredPosts.length})</span>
              </button>
              <button
                type="button"
                id="filter-videos-btn"
                onClick={() => setFilterType('videos')}
                className={`inline-flex items-center gap-1 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                  filterType === 'videos'
                    ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40'
                    : 'bg-neutral-900/60 text-neutral-400 border border-neutral-800 hover:text-white'
                }`}
              >
                <Tv className="w-3 h-3" />
                <span>Videos ({filteredVideos.length})</span>
              </button>
            </div>
          )}
        </div>

        {/* Dynamic Search Results & Content Feeds */}
        {isSearching && (filteredPosts.length === 0 && filteredVideos.length === 0) && (
          <div className="py-12 text-center rounded-2xl bg-neutral-900/40 border border-neutral-800 p-6 max-w-md mx-auto">
            <Search className="w-8 h-8 text-neutral-600 mx-auto mb-2" />
            <p className="text-sm font-semibold text-white">No results found</p>
            <p className="text-xs text-neutral-400 mt-1">
              No articles or videos matched "{searchQuery}".
            </p>
          </div>
        )}

        {/* 1. Posted Articles Feed (Shown when posts exist) */}
        {(filterType === 'all' || filterType === 'articles') && filteredPosts.length > 0 && (
          <div className="space-y-4 pt-4">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-emerald-400" />
                <h2 className="text-lg font-bold text-white">Articles</h2>
                <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800/60">
                  {filteredPosts.length}
                </span>
              </div>
              <button
                onClick={() => onNavigateToSection('blog')}
                className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 cursor-pointer"
              >
                <span>View all articles</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredPosts.map((post) => (
                <div
                  key={post.id}
                  id={`home-post-card-${post.id}`}
                  className="bg-neutral-900/80 border border-neutral-800 rounded-2xl overflow-hidden hover:border-emerald-700/60 transition-all flex flex-col group"
                >
                  <div
                    onClick={() => onOpenPost(post)}
                    className="relative aspect-video w-full bg-neutral-950 overflow-hidden cursor-pointer"
                  >
                    <img
                      src={post.coverImage}
                      alt={post.title}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                      referrerPolicy="no-referrer"
                    />
                    <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-md text-[10px] uppercase font-bold bg-black/80 text-emerald-300 border border-emerald-500/30 backdrop-blur-sm">
                      {post.categoryLabel}
                    </span>
                    <span className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded bg-black/80 text-[10px] font-mono text-neutral-300">
                      {post.readTimeMinutes} min read
                    </span>
                  </div>

                  <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                    <div>
                      <h3
                        onClick={() => onOpenPost(post)}
                        className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors line-clamp-2 cursor-pointer"
                      >
                        {post.title}
                      </h3>
                      <p className="text-xs text-neutral-400 mt-1 line-clamp-2">
                        {post.excerpt}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-neutral-800/80 flex items-center justify-between text-xs text-neutral-400">
                      <div className="flex items-center gap-2">
                        <img
                          src={post.author.avatar}
                          alt={post.author.name}
                          className="w-6 h-6 rounded-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                        <span className="text-[11px] truncate max-w-[100px]">{post.author.name}</span>
                      </div>

                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => onToggleSavePost(post.id)}
                          className="text-neutral-400 hover:text-emerald-400 transition-colors cursor-pointer"
                          title="Bookmark article"
                        >
                          <Bookmark
                            className={`w-3.5 h-3.5 ${
                              savedPostIds.includes(post.id) ? 'fill-emerald-400 text-emerald-400' : ''
                            }`}
                          />
                        </button>
                        <span className="flex items-center gap-1 text-[11px] text-rose-400">
                          <Heart className="w-3 h-3 fill-rose-400" />
                          {post.clapsCount}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 2. Uploaded Videos Feed (Shown when videos exist) */}
        {(filterType === 'all' || filterType === 'videos') && filteredVideos.length > 0 && (
          <div className="space-y-4 pt-4">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <div className="flex items-center gap-2">
                <Tv className="w-4 h-4 text-teal-400" />
                <h2 className="text-lg font-bold text-white">Video Masterclasses</h2>
                <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-teal-950 text-teal-400 border border-teal-800/60">
                  {filteredVideos.length}
                </span>
              </div>
              <button
                onClick={() => onNavigateToSection('video')}
                className="text-xs font-semibold text-teal-400 hover:text-teal-300 flex items-center gap-1 cursor-pointer"
              >
                <span>View all videos</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredVideos.map((video) => (
                <div
                  key={video.id}
                  id={`home-video-card-${video.id}`}
                  className="bg-neutral-900/80 border border-neutral-800 rounded-2xl overflow-hidden hover:border-teal-700/60 transition-all flex flex-col group"
                >
                  <div
                    onClick={() => onOpenVideo(video)}
                    className="relative aspect-video bg-neutral-950 overflow-hidden cursor-pointer"
                  >
                    <img
                      src={video.thumbnailUrl}
                      alt={video.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-10 h-10 rounded-full bg-teal-500/90 group-hover:bg-teal-400 text-neutral-950 flex items-center justify-center shadow-lg transition-transform group-hover:scale-110">
                        <Play className="w-5 h-5 fill-current translate-x-0.5" />
                      </div>
                    </div>
                    <span className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded bg-black/80 text-[10px] font-mono text-teal-300">
                      {video.durationFormatted}
                    </span>
                    <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-md text-[10px] uppercase font-bold bg-black/80 text-teal-300 border border-teal-500/30 backdrop-blur-sm">
                      {video.categoryLabel}
                    </span>
                  </div>

                  <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                    <div>
                      <h3
                        onClick={() => onOpenVideo(video)}
                        className="text-sm font-bold text-white group-hover:text-teal-300 transition-colors line-clamp-2 cursor-pointer"
                      >
                        {video.title}
                      </h3>
                      <p className="text-xs text-neutral-400 mt-1 line-clamp-2">
                        {video.description}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-neutral-800/80 flex items-center justify-between text-xs text-neutral-400">
                      <div className="flex items-center gap-2">
                        <img
                          src={video.instructor.avatar}
                          alt={video.instructor.name}
                          className="w-6 h-6 rounded-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                        <span className="text-[11px] truncate max-w-[100px]">{video.instructor.name}</span>
                      </div>

                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => onToggleSaveVideo(video.id)}
                          className="text-neutral-400 hover:text-teal-400 transition-colors cursor-pointer"
                          title="Bookmark video"
                        >
                          <Bookmark
                            className={`w-3.5 h-3.5 ${
                              savedVideoIds.includes(video.id) ? 'fill-teal-400 text-teal-400' : ''
                            }`}
                          />
                        </button>
                        <span className="flex items-center gap-1 text-[11px] text-teal-400 font-mono">
                          <Eye className="w-3 h-3" />
                          {video.viewsCount}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
