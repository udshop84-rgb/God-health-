import React, { useState, useMemo } from 'react';
import { 
  Bookmark, 
  BookOpen, 
  Tv, 
  Trash2, 
  Search, 
  ArrowRight, 
  Clock, 
  Sparkles, 
  Heart, 
  Play,
  CheckCircle2,
  FileText,
  Edit3,
  Share2,
  BookmarkCheck
} from 'lucide-react';
import { BlogPost, HealthVideo } from '../types';

interface FavoritesSectionProps {
  posts: BlogPost[];
  videos: HealthVideo[];
  savedPostIds: string[];
  savedVideoIds: string[];
  onToggleSavePost: (id: string) => void;
  onToggleSaveVideo: (id: string) => void;
  onOpenPost: (post: BlogPost) => void;
  onOpenVideo: (video: HealthVideo) => void;
  onEditPost?: (post: BlogPost) => void;
  onDeletePost?: (postId: string) => void;
  onEditVideo?: (video: HealthVideo) => void;
  onDeleteVideo?: (videoId: string) => void;
  onNavigateToSection: (section: 'home' | 'blog' | 'video') => void;
}

export const FavoritesSection: React.FC<FavoritesSectionProps> = ({
  posts,
  videos,
  savedPostIds,
  savedVideoIds,
  onToggleSavePost,
  onToggleSaveVideo,
  onOpenPost,
  onOpenVideo,
  onEditPost,
  onDeletePost,
  onEditVideo,
  onDeleteVideo,
  onNavigateToSection,
}) => {
  const [filterType, setFilterType] = useState<'all' | 'articles' | 'videos'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const savedArticles = useMemo(() => {
    return posts.filter((p) => savedPostIds.includes(p.id));
  }, [posts, savedPostIds]);

  const savedVideoList = useMemo(() => {
    return videos.filter((v) => savedVideoIds.includes(v.id));
  }, [videos, savedVideoIds]);

  const totalSavedCount = savedArticles.length + savedVideoList.length;

  const totalEstimatedReadMinutes = useMemo(() => {
    const articleTime = savedArticles.reduce((acc, curr) => acc + curr.readTimeMinutes, 0);
    const videoTime = savedVideoList.reduce((acc, curr) => acc + curr.durationMinutes, 0);
    return { articleTime, videoTime, totalTime: articleTime + videoTime };
  }, [savedArticles, savedVideoList]);

  // Filtered by search & type
  const filteredArticles = useMemo(() => {
    if (filterType === 'videos') return [];
    if (!searchQuery.trim()) return savedArticles;
    const q = searchQuery.toLowerCase();
    return savedArticles.filter(
      (a) =>
        a.title.toLowerCase().includes(q) ||
        a.excerpt.toLowerCase().includes(q) ||
        a.tags.some((t) => t.toLowerCase().includes(q))
    );
  }, [savedArticles, filterType, searchQuery]);

  const filteredVideos = useMemo(() => {
    if (filterType === 'articles') return [];
    if (!searchQuery.trim()) return savedVideoList;
    const q = searchQuery.toLowerCase();
    return savedVideoList.filter(
      (v) =>
        v.title.toLowerCase().includes(q) ||
        v.description.toLowerCase().includes(q) ||
        v.tags.some((t) => t.toLowerCase().includes(q))
    );
  }, [savedVideoList, filterType, searchQuery]);

  const hasNoSavedItems = totalSavedCount === 0;

  return (
    <section id="favorites-section" className="py-12 sm:py-16 bg-neutral-950 relative min-h-[70vh]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-neutral-800">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-800/50 text-emerald-300 text-xs font-semibold mb-3">
              <Bookmark className="w-3.5 h-3.5 fill-emerald-400 text-emerald-400" />
              <span>Personal Knowledge Vault &amp; Bookmarks</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-white tracking-tight">
              Your Saved <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-teal-400">Favorites</span>
            </h2>
            <p className="text-sm text-neutral-400 mt-2 max-w-2xl">
              Quick access to your curated collection of peer-reviewed longevity articles, nutrition guides, and clinical video masterclasses.
            </p>
          </div>

          {/* Quick Metrics Bar */}
          {!hasNoSavedItems && (
            <div className="flex items-center gap-3 bg-neutral-900/90 border border-neutral-800 p-3 rounded-2xl">
              <div className="px-3 border-r border-neutral-800">
                <span className="text-[10px] text-neutral-400 uppercase font-mono block">Saved Items</span>
                <span className="text-lg font-display font-bold text-emerald-400">{totalSavedCount}</span>
              </div>
              <div className="px-3 border-r border-neutral-800">
                <span className="text-[10px] text-neutral-400 uppercase font-mono block">Articles</span>
                <span className="text-lg font-display font-bold text-white">{savedArticles.length}</span>
              </div>
              <div className="px-3">
                <span className="text-[10px] text-neutral-400 uppercase font-mono block">Videos</span>
                <span className="text-lg font-display font-bold text-teal-400">{savedVideoList.length}</span>
              </div>
            </div>
          )}
        </div>

        {/* Filter Sub-Tabs & Search */}
        {!hasNoSavedItems && (
          <div className="pt-6 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            {/* Filter Tabs */}
            <div className="flex items-center gap-2">
              {[
                { id: 'all', label: `All Favorites (${totalSavedCount})` },
                { id: 'articles', label: `Articles (${savedArticles.length})` },
                { id: 'videos', label: `Videos (${savedVideoList.length})` },
              ].map((tab) => (
                <button
                  key={tab.id}
                  id={`favorites-tab-${tab.id}`}
                  onClick={() => setFilterType(tab.id as any)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    filterType === tab.id
                      ? 'bg-emerald-500 text-neutral-950 font-bold shadow-md shadow-emerald-500/20'
                      : 'bg-neutral-900/80 hover:bg-neutral-800 text-neutral-300 border border-neutral-800'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Search within favorites */}
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                id="favorites-search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search saved content..."
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-neutral-900/90 border border-neutral-800 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>
        )}

        {/* Content Display */}
        {hasNoSavedItems ? (
          /* Empty State when no items are saved */
          <div className="text-center py-20 px-4 bg-neutral-900/30 border border-neutral-800/80 rounded-3xl my-8">
            <div className="w-16 h-16 rounded-2xl bg-emerald-950/60 border border-emerald-800/40 text-emerald-400 flex items-center justify-center mx-auto mb-4">
              <Bookmark className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-display font-bold text-white">No saved favorites yet</h3>
            <p className="text-xs sm:text-sm text-neutral-400 max-w-md mx-auto mt-2 leading-relaxed">
              Bookmark insightful longevity articles and clinical video masterclasses while exploring to build your personal vitality library.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={() => onNavigateToSection('blog')}
                className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold text-xs flex items-center gap-2 transition-all cursor-pointer"
              >
                <BookOpen className="w-4 h-4" />
                <span>Explore Health Articles</span>
              </button>
              <button
                onClick={() => onNavigateToSection('video')}
                className="px-5 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-semibold text-xs flex items-center gap-2 transition-all cursor-pointer"
              >
                <Tv className="w-4 h-4 text-teal-400" />
                <span>Browse Video Masterclasses</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-10">
            {/* Section 1: Saved Articles */}
            {filteredArticles.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  <span>Saved Health Articles ({filteredArticles.length})</span>
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredArticles.map((article) => (
                    <div
                      key={article.id}
                      id={`saved-article-card-${article.id}`}
                      className="bg-neutral-900/90 border border-neutral-800 rounded-2xl overflow-hidden hover:border-emerald-700/60 transition-all flex flex-col group shadow-lg"
                    >
                      <div
                        onClick={() => onOpenPost(article)}
                        className="relative aspect-video w-full bg-neutral-950 overflow-hidden cursor-pointer"
                      >
                        <img
                          src={article.coverImage}
                          alt={article.title}
                          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                          referrerPolicy="no-referrer"
                        />
                        <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full text-[10px] uppercase font-bold tracking-wider bg-black/70 backdrop-blur-md text-emerald-300 border border-emerald-500/30">
                          {article.categoryLabel}
                        </span>
                        <span className="absolute bottom-2.5 right-3 px-2 py-0.5 rounded bg-black/80 text-[11px] font-mono text-neutral-300 flex items-center gap-1">
                          <Clock className="w-3 h-3 text-emerald-400" />
                          {article.readTimeMinutes} min read
                        </span>
                      </div>

                      <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                        <div className="space-y-2">
                          <div className="flex flex-wrap items-center gap-1">
                            {article.tags && article.tags.slice(0, 2).map((tag) => (
                              <span key={tag} className="px-2 py-0.5 rounded text-[10px] bg-neutral-950 border border-neutral-800 text-neutral-300">
                                #{tag}
                              </span>
                            ))}
                          </div>
                          <h4
                            onClick={() => onOpenPost(article)}
                            className="text-base font-display font-bold text-white group-hover:text-emerald-300 transition-colors line-clamp-2 cursor-pointer leading-snug"
                          >
                            {article.title}
                          </h4>
                          <p className="text-xs text-neutral-400 line-clamp-2 leading-relaxed">
                            {article.excerpt}
                          </p>
                        </div>

                        <div className="pt-3 border-t border-neutral-800 flex items-center justify-between">
                          <div className="flex items-center gap-1.5">
                            {onEditPost && (
                              <button
                                onClick={() => onEditPost(article)}
                                className="flex items-center gap-1 text-xs text-neutral-300 hover:text-emerald-400 p-1 cursor-pointer"
                                title="Edit article"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                                <span>Edit</span>
                              </button>
                            )}
                            {onDeletePost && (
                              <button
                                onClick={() => onDeletePost(article.id)}
                                className="flex items-center gap-1 text-xs text-neutral-400 hover:text-rose-400 p-1 cursor-pointer"
                                title="Delete article"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                          <button
                            id={`remove-saved-article-btn-${article.id}`}
                            onClick={() => onToggleSavePost(article.id)}
                            className="flex items-center gap-1 text-xs text-rose-400 hover:text-rose-300 p-1 cursor-pointer font-medium"
                            title="Remove from saved"
                          >
                            <Bookmark className="w-3.5 h-3.5 fill-rose-400" />
                            <span>Unsave</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Section 2: Saved Videos */}
            {filteredVideos.length > 0 && (
              <div className="space-y-4 pt-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-teal-400 flex items-center gap-2">
                  <Tv className="w-4 h-4" />
                  <span>Saved Video Masterclasses ({filteredVideos.length})</span>
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredVideos.map((video) => (
                    <div
                      key={video.id}
                      id={`saved-video-card-${video.id}`}
                      className="bg-neutral-900/90 border border-neutral-800 rounded-2xl overflow-hidden hover:border-teal-700/60 transition-all flex flex-col group shadow-lg"
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
                          <div className="w-11 h-11 rounded-full bg-emerald-500/90 group-hover:bg-emerald-400 text-neutral-950 flex items-center justify-center shadow-lg transition-transform group-hover:scale-110">
                            <Play className="w-5 h-5 fill-current translate-x-0.5" />
                          </div>
                        </div>
                        <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full text-[10px] uppercase font-bold tracking-wider bg-black/70 backdrop-blur-md text-teal-300 border border-teal-500/30">
                          {video.categoryLabel}
                        </span>
                        <span className="absolute bottom-2.5 right-3 px-2 py-0.5 rounded bg-black/80 text-[11px] font-mono text-neutral-300 flex items-center gap-1">
                          <Clock className="w-3 h-3 text-teal-400" />
                          {video.durationFormatted}
                        </span>
                      </div>

                      <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                        <div>
                          <h4
                            onClick={() => onOpenVideo(video)}
                            className="text-base font-display font-bold text-white group-hover:text-teal-300 transition-colors line-clamp-2 cursor-pointer"
                          >
                            {video.title}
                          </h4>
                          <p className="text-xs text-neutral-400 line-clamp-2 mt-2 leading-relaxed">
                            {video.description}
                          </p>
                        </div>

                        <div className="pt-3 border-t border-neutral-800 flex items-center justify-between">
                          <span className="text-xs text-neutral-400 truncate pr-2">{video.instructor.name}</span>
                          
                          <div className="flex items-center gap-1.5 shrink-0">
                            {onEditVideo && (
                              <button
                                onClick={() => onEditVideo(video)}
                                className="p-1.5 text-neutral-400 hover:text-emerald-300 rounded-lg hover:bg-neutral-800 transition-colors cursor-pointer"
                                title="Re-Edit Video"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                            )}

                            <button
                              id={`remove-saved-video-btn-${video.id}`}
                              onClick={() => onToggleSaveVideo(video.id)}
                              className="flex items-center gap-1 text-xs text-rose-400 hover:text-rose-300 p-1.5 rounded-lg hover:bg-rose-950/40 cursor-pointer transition-colors"
                              title="Remove from favorites"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span className="hidden sm:inline">Remove</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* No matches for search inside favorites */}
            {filteredArticles.length === 0 && filteredVideos.length === 0 && searchQuery && (
              <div className="text-center py-12 text-neutral-400">
                <p className="text-sm">No saved items match "{searchQuery}"</p>
                <button
                  onClick={() => setSearchQuery('')}
                  className="mt-2 text-xs text-emerald-400 underline"
                >
                  Clear search
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};
