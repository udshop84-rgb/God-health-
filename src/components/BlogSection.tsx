import React, { useState, useMemo, useEffect } from 'react';
import { 
  Search, 
  PenSquare, 
  Bookmark, 
  Heart, 
  Share2, 
  Edit3, 
  Trash2, 
  Check, 
  Globe, 
  FileText, 
  BookOpen, 
  X,
  Sparkles
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { BlogPost } from '../types';

interface BlogSectionProps {
  posts: BlogPost[];
  onOpenPost: (post: BlogPost) => void;
  onOpenCreateModal: () => void;
  onEditPost: (post: BlogPost) => void;
  onDeletePost?: (postId: string) => void;
  savedPostIds: string[];
  onToggleSave: (postId: string) => void;
  onClap: (postId: string) => void;
}

type BlogTab = 'posted' | 'public' | 'draft' | 'saved' | 'favorite';

const LOCAL_STORAGE_FAVORITE_POSTS_KEY = 'health_app_favorite_post_ids_v1';

export const BlogSection: React.FC<BlogSectionProps> = ({
  posts,
  onOpenPost,
  onOpenCreateModal,
  onEditPost,
  onDeletePost,
  savedPostIds,
  onToggleSave,
  onClap,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<BlogTab>('posted');
  const [postToDelete, setPostToDelete] = useState<BlogPost | null>(null);
  const [copiedPostId, setCopiedPostId] = useState<string | null>(null);

  // Favorite posts tracking
  const [favoritePostIds, setFavoritePostIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_FAVORITE_POSTS_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_FAVORITE_POSTS_KEY, JSON.stringify(favoritePostIds));
    } catch (e) {
      console.error(e);
    }
  }, [favoritePostIds]);

  // Tab counts
  const postedCount = posts.filter((p) => p.status !== 'draft').length;
  const publicCount = posts.filter((p) => p.status === 'published' || !p.status).length;
  const draftCount = posts.filter((p) => p.status === 'draft').length;
  const savedCount = posts.filter((p) => savedPostIds.includes(p.id)).length;
  const favoriteCount = posts.filter(
    (p) => favoritePostIds.includes(p.id) || (p.clapsCount && p.clapsCount > 0)
  ).length;

  // Filter posts based on activeTab and searchQuery
  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      // 1. Tab Filter
      if (activeTab === 'draft') {
        if (post.status !== 'draft') return false;
      } else if (activeTab === 'public') {
        if (post.status === 'draft') return false;
      } else if (activeTab === 'saved') {
        if (!savedPostIds.includes(post.id)) return false;
      } else if (activeTab === 'favorite') {
        const isFav = favoritePostIds.includes(post.id) || (post.clapsCount && post.clapsCount > 0);
        if (!isFav) return false;
      } else if (activeTab === 'posted') {
        // All posted/published blogs
        if (post.status === 'draft') return false;
      }

      // 2. Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = post.title.toLowerCase().includes(q);
        const matchExcerpt = post.excerpt?.toLowerCase().includes(q);
        const matchContent = post.content?.toLowerCase().includes(q);
        const matchTags = post.tags && post.tags.some((t) => t.toLowerCase().includes(q));
        const matchCategory = post.categoryLabel?.toLowerCase().includes(q);
        return matchTitle || matchExcerpt || matchContent || matchTags || matchCategory;
      }

      return true;
    });
  }, [posts, activeTab, searchQuery, savedPostIds, favoritePostIds]);

  const handleToggleFavorite = (postId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const isCurrentlyFav = favoritePostIds.includes(postId);
    
    if (isCurrentlyFav) {
      setFavoritePostIds((prev) => prev.filter((id) => id !== postId));
    } else {
      setFavoritePostIds((prev) => [...prev, postId]);
      onClap(postId);
      confetti({
        particleCount: 30,
        spread: 55,
        origin: { y: 0.8 },
        colors: ['#f43f5e', '#fb7185', '#34d399', '#fbbf24']
      });
    }
  };

  const handleCopyLink = (post: BlogPost, e: React.MouseEvent) => {
    e.stopPropagation();
    const url = `${window.location.origin}/journal/${post.slug || post.id}`;
    navigator.clipboard.writeText(url);
    setCopiedPostId(post.id);
    setTimeout(() => setCopiedPostId(null), 2000);
  };

  const confirmDelete = () => {
    if (postToDelete && onDeletePost) {
      onDeletePost(postToDelete.id);
      setPostToDelete(null);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 animate-in fade-in duration-300">
      
      {/* 1. SEARCH BAR & CREATE BUTTON */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Article Search Bar */}
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <input
            id="input-article-search"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search article title, tag, or content..."
            className="w-full pl-11 pr-10 py-3 rounded-2xl bg-neutral-900 border border-neutral-800 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500 transition-colors shadow-inner"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-white p-1 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Publish / Create Post Button */}
        <button
          id="btn-create-new-blog"
          onClick={onOpenCreateModal}
          className="flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-emerald-400 hover:bg-emerald-300 text-neutral-950 font-bold text-xs sm:text-sm shadow-lg shadow-emerald-500/20 transition-all hover:scale-[1.02] cursor-pointer shrink-0"
        >
          <PenSquare className="w-4 h-4 text-neutral-950" />
          <span>Write Blog</span>
        </button>
      </div>

      {/* 2. REQUESTED TABS: Posted Blog, Public Blog, Draft Blog, Saved, Favorite */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none border-b border-neutral-800/80 pt-1">
        {/* 1. Posted Blog */}
        <button
          id="tab-posted-blog"
          onClick={() => setActiveTab('posted')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
            activeTab === 'posted'
              ? 'bg-emerald-400 text-neutral-950 shadow-md font-bold'
              : 'bg-neutral-900 text-neutral-400 hover:text-white hover:bg-neutral-800 border border-neutral-800'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Posted Blog ({postedCount})</span>
        </button>

        {/* 2. Public Blog */}
        <button
          id="tab-public-blog"
          onClick={() => setActiveTab('public')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
            activeTab === 'public'
              ? 'bg-emerald-400 text-neutral-950 shadow-md font-bold'
              : 'bg-neutral-900 text-neutral-400 hover:text-white hover:bg-neutral-800 border border-neutral-800'
          }`}
        >
          <Globe className="w-3.5 h-3.5" />
          <span>Public Blog ({publicCount})</span>
        </button>

        {/* 3. Draft Blog */}
        <button
          id="tab-draft-blog"
          onClick={() => setActiveTab('draft')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
            activeTab === 'draft'
              ? 'bg-emerald-400 text-neutral-950 shadow-md font-bold'
              : 'bg-neutral-900 text-neutral-400 hover:text-white hover:bg-neutral-800 border border-neutral-800'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Draft Blog ({draftCount})</span>
        </button>

        {/* 4. Saved */}
        <button
          id="tab-saved-blog"
          onClick={() => setActiveTab('saved')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
            activeTab === 'saved'
              ? 'bg-emerald-400 text-neutral-950 shadow-md font-bold'
              : 'bg-neutral-900 text-neutral-400 hover:text-white hover:bg-neutral-800 border border-neutral-800'
          }`}
        >
          <Bookmark className="w-3.5 h-3.5" />
          <span>Saved ({savedCount})</span>
        </button>

        {/* 5. Favorite */}
        <button
          id="tab-favorite-blog"
          onClick={() => setActiveTab('favorite')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
            activeTab === 'favorite'
              ? 'bg-rose-500 text-white shadow-md font-bold'
              : 'bg-neutral-900 text-neutral-400 hover:text-white hover:bg-neutral-800 border border-neutral-800'
          }`}
        >
          <Heart className="w-3.5 h-3.5" />
          <span>Favorite ({favoriteCount})</span>
        </button>
      </div>

      {/* 3. BLOG POSTS GRID */}
      {/* Shows strictly: Article Title, Tag, Thumbnail, Description or Content + Re-edit, Delete, Saved, Favorite, Share */}
      {filteredPosts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
          {filteredPosts.map((post) => {
            const isSaved = savedPostIds.includes(post.id);
            const isFavorite = favoritePostIds.includes(post.id) || (post.clapsCount && post.clapsCount > 0);

            return (
              <div
                key={post.id}
                id={`article-card-${post.id}`}
                onClick={() => onOpenPost(post)}
                className="flex flex-col justify-between rounded-3xl overflow-hidden bg-neutral-900/80 hover:bg-neutral-900 border border-neutral-800 hover:border-emerald-500/40 transition-all duration-200 cursor-pointer group shadow-xl"
              >
                
                {/* THUMBNAIL - UNIFORM 16:9 SAME-TO-SAME SIZE */}
                <div className="relative aspect-[16/9] w-full overflow-hidden bg-neutral-950">
                  <img
                    src={post.coverImage}
                    alt={post.imageAltText || post.title}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                    referrerPolicy="no-referrer"
                  />
                  
                  {/* Status Indicator if Draft */}
                  {post.status === 'draft' && (
                    <div className="absolute top-3 left-3">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-950/90 text-amber-300 border border-amber-500/40 backdrop-blur-md">
                        DRAFT
                      </span>
                    </div>
                  )}
                </div>

                {/* CONTENT AREA: TAGS, TITLE, DESCRIPTION/CONTENT */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2.5">
                    
                    {/* TAGS */}
                    <div className="flex flex-wrap items-center gap-1.5">
                      {post.tags && post.tags.slice(0, 3).map((tag) => (
                        <span 
                          key={tag} 
                          className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-neutral-950 border border-neutral-800 text-emerald-300"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>

                    {/* ARTICLE TITLE */}
                    <h3 className="text-base sm:text-lg font-display font-bold text-white group-hover:text-emerald-300 transition-colors line-clamp-2 leading-snug">
                      {post.title}
                    </h3>

                    {/* DESCRIPTION OR CONTENT */}
                    <p className="text-xs sm:text-sm text-neutral-400 line-clamp-3 leading-relaxed">
                      {post.excerpt || post.content.replace(/[#*`_\[\]]/g, '').slice(0, 160)}
                    </p>
                  </div>

                  {/* BOTTOM ACTIONS: RE-EDIT, DELETE, FAVORITE, SAVED, SHARE */}
                  <div className="pt-3.5 border-t border-neutral-800/80 flex items-center justify-between gap-2">
                    
                    {/* Left: Re-Edit & Delete */}
                    <div className="flex items-center gap-1.5">
                      <button
                        id={`btn-edit-article-${post.id}`}
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onEditPost(post);
                        }}
                        className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 text-neutral-300 hover:text-emerald-300 text-xs transition-colors cursor-pointer"
                        title="Re-edit article"
                      >
                        <Edit3 className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="font-semibold">Edit</span>
                      </button>

                      {onDeletePost && (
                        <button
                          id={`btn-delete-article-${post.id}`}
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setPostToDelete(post);
                          }}
                          className="p-1.5 rounded-xl bg-neutral-950 hover:bg-rose-950/40 border border-neutral-800 hover:border-rose-800/50 text-neutral-400 hover:text-rose-400 text-xs transition-colors cursor-pointer"
                          title="Delete article"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    {/* Right: Favorite, Saved, Share */}
                    <div className="flex items-center gap-1.5">
                      {/* Favorite Button */}
                      <button
                        id={`btn-favorite-article-${post.id}`}
                        type="button"
                        onClick={(e) => handleToggleFavorite(post.id, e)}
                        className={`flex items-center gap-1 px-2 py-1.5 rounded-xl border text-xs transition-colors cursor-pointer ${
                          isFavorite
                            ? 'bg-rose-950/80 border-rose-500/50 text-rose-300'
                            : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-rose-400'
                        }`}
                        title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                      >
                        <Heart className={`w-3.5 h-3.5 ${isFavorite ? 'fill-rose-400 text-rose-400' : ''}`} />
                        <span className="font-mono text-[11px]">{post.clapsCount || 0}</span>
                      </button>

                      {/* Saved / Bookmark Button */}
                      <button
                        id={`btn-save-article-${post.id}`}
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleSave(post.id);
                        }}
                        className={`p-1.5 rounded-xl border transition-colors cursor-pointer ${
                          isSaved
                            ? 'bg-emerald-950 border-emerald-500/50 text-emerald-400'
                            : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-white'
                        }`}
                        title={isSaved ? 'Remove from saved' : 'Save article'}
                      >
                        <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-emerald-400' : ''}`} />
                      </button>

                      {/* Share / Copy Link Button */}
                      <button
                        id={`btn-share-article-${post.id}`}
                        type="button"
                        onClick={(e) => handleCopyLink(post, e)}
                        className="p-1.5 rounded-xl bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 text-neutral-400 hover:text-white text-xs transition-colors cursor-pointer"
                        title="Copy article link"
                      >
                        {copiedPostId === post.id ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Share2 className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>

                  </div>

                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Empty State */
        <div className="p-12 text-center rounded-3xl bg-neutral-900/40 border border-neutral-800 space-y-4">
          <BookOpen className="w-10 h-10 text-neutral-500 mx-auto" />
          <h3 className="text-base font-bold text-white">No articles found</h3>
          <p className="text-xs text-neutral-400 max-w-md mx-auto leading-relaxed">
            {searchQuery
              ? `No articles match "${searchQuery}".`
              : activeTab === 'draft'
              ? 'You have no draft articles.'
              : activeTab === 'saved'
              ? 'You have no saved articles.'
              : activeTab === 'favorite'
              ? 'You have no favorite articles yet.'
              : 'There are currently no articles in this section.'}
          </p>
          <button
            onClick={onOpenCreateModal}
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-emerald-400 text-neutral-950 font-bold text-xs cursor-pointer shadow-md hover:bg-emerald-300 transition-all"
          >
            <PenSquare className="w-4 h-4" />
            <span>Write New Article</span>
          </button>
        </div>
      )}

      {/* DELETE CONFIRMATION DIALOG */}
      {postToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-rose-400">
              <div className="p-2.5 rounded-2xl bg-rose-950/60 border border-rose-800/40">
                <Trash2 className="w-5 h-5 text-rose-400" />
              </div>
              <h3 className="text-base font-bold text-white">Delete Article?</h3>
            </div>

            <p className="text-xs text-neutral-300 leading-relaxed">
              Are you sure you want to delete <strong className="text-white">"{postToDelete.title}"</strong>?
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setPostToDelete(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-neutral-400 hover:text-white bg-neutral-800/60 hover:bg-neutral-800 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 shadow-lg shadow-rose-600/30 transition-all cursor-pointer"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
