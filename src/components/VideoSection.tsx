import React, { useState, useMemo, useEffect } from 'react';
import { 
  Search, 
  Play, 
  Bookmark, 
  Heart, 
  Share2, 
  Edit3, 
  Trash2, 
  Check, 
  Video as VideoIcon, 
  Clock, 
  Plus, 
  X,
  Tv,
  Star
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { HealthVideo, BlogCategory } from '../types';

interface VideoSectionProps {
  videos: HealthVideo[];
  activeCategory?: BlogCategory;
  onSelectCategory?: (cat: BlogCategory) => void;
  savedVideoIds: string[];
  onToggleSaveVideo: (id: string) => void;
  onOpenVideo: (video: HealthVideo) => void;
  onOpenUploadModal: () => void;
  onEditVideo?: (video: HealthVideo) => void;
  onDeleteVideo?: (videoId: string) => void;
  searchQuery?: string;
  onSearchChange?: (q: string) => void;
}

type VideoTab = 'uploaded' | 'saved' | 'favorite';

const LOCAL_STORAGE_FAVORITE_VIDEOS_KEY = 'health_app_favorite_video_ids_v1';

export const VideoSection: React.FC<VideoSectionProps> = ({
  videos,
  savedVideoIds,
  onToggleSaveVideo,
  onOpenVideo,
  onOpenUploadModal,
  onEditVideo,
  onDeleteVideo,
  searchQuery: externalSearchQuery,
  onSearchChange: externalOnSearchChange,
}) => {
  const [internalSearchQuery, setInternalSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<VideoTab>('uploaded');
  const [videoToDelete, setVideoToDelete] = useState<HealthVideo | null>(null);
  const [copiedVideoId, setCopiedVideoId] = useState<string | null>(null);

  const searchQuery = externalSearchQuery !== undefined ? externalSearchQuery : internalSearchQuery;
  const setSearchQuery = (q: string) => {
    setInternalSearchQuery(q);
    if (externalOnSearchChange) {
      externalOnSearchChange(q);
    }
  };

  // Favorite videos tracking
  const [favoriteVideoIds, setFavoriteVideoIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_FAVORITE_VIDEOS_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_FAVORITE_VIDEOS_KEY, JSON.stringify(favoriteVideoIds));
    } catch (e) {
      console.error(e);
    }
  }, [favoriteVideoIds]);

  // Tab counts
  const uploadedCount = videos.length;
  const savedCount = videos.filter((v) => savedVideoIds.includes(v.id)).length;
  const favoriteCount = videos.filter(
    (v) => favoriteVideoIds.includes(v.id) || (v.likesCount && v.likesCount > 0)
  ).length;

  // Filtered videos based on activeTab and searchQuery
  const filteredVideos = useMemo(() => {
    return videos.filter((video) => {
      // 1. Tab Filter
      if (activeTab === 'saved') {
        if (!savedVideoIds.includes(video.id)) return false;
      } else if (activeTab === 'favorite') {
        const isFav = favoriteVideoIds.includes(video.id) || (video.likesCount && video.likesCount > 0);
        if (!isFav) return false;
      }

      // 2. Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = video.title.toLowerCase().includes(q);
        const matchDesc = video.description.toLowerCase().includes(q);
        const matchInstructor = video.instructor?.name?.toLowerCase().includes(q);
        const matchCategory = video.categoryLabel?.toLowerCase().includes(q);
        const matchTags = video.tags && video.tags.some((t) => t.toLowerCase().includes(q));
        return matchTitle || matchDesc || matchInstructor || matchCategory || matchTags;
      }

      return true;
    });
  }, [videos, activeTab, searchQuery, savedVideoIds, favoriteVideoIds]);

  const handleToggleFavorite = (videoId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const isCurrentlyFav = favoriteVideoIds.includes(videoId);
    
    if (isCurrentlyFav) {
      setFavoriteVideoIds((prev) => prev.filter((id) => id !== videoId));
    } else {
      setFavoriteVideoIds((prev) => [...prev, videoId]);
      confetti({
        particleCount: 30,
        spread: 55,
        origin: { y: 0.8 },
        colors: ['#f43f5e', '#fb7185', '#34d399', '#38bdf8']
      });
    }
  };

  const handleCopyLink = (video: HealthVideo, e: React.MouseEvent) => {
    e.stopPropagation();
    const url = `${window.location.origin}/video/${video.id}`;
    navigator.clipboard.writeText(url);
    setCopiedVideoId(video.id);
    setTimeout(() => setCopiedVideoId(null), 2000);
  };

  const confirmDelete = () => {
    if (videoToDelete && onDeleteVideo) {
      onDeleteVideo(videoToDelete.id);
      setVideoToDelete(null);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 animate-in fade-in duration-300">
      
      {/* 1. SEARCH BAR & UPLOAD BUTTON */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Video Search Bar */}
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <input
            id="input-video-search"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search video title, topic, or instructor..."
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

        {/* Upload Video Button */}
        <button
          id="btn-upload-new-video"
          onClick={onOpenUploadModal}
          className="flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-emerald-400 hover:bg-emerald-300 text-neutral-950 font-bold text-xs sm:text-sm shadow-lg shadow-emerald-500/20 transition-all hover:scale-[1.02] cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4 text-neutral-950" />
          <span>Upload Video</span>
        </button>
      </div>

      {/* 2. REQUESTED TABS: Uploaded Videos, Saved, Favorite */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none border-b border-neutral-800/80 pt-1">
        {/* 1. Uploaded Videos */}
        <button
          id="tab-uploaded-videos"
          onClick={() => setActiveTab('uploaded')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
            activeTab === 'uploaded'
              ? 'bg-emerald-400 text-neutral-950 shadow-md font-bold'
              : 'bg-neutral-900 text-neutral-400 hover:text-white hover:bg-neutral-800 border border-neutral-800'
          }`}
        >
          <VideoIcon className="w-3.5 h-3.5" />
          <span>Uploaded Videos ({uploadedCount})</span>
        </button>

        {/* 2. Saved */}
        <button
          id="tab-saved-videos"
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

        {/* 3. Favorite */}
        <button
          id="tab-favorite-videos"
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

      {/* 3. VIDEO CARDS GRID */}
      {filteredVideos.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
          {filteredVideos.map((video) => {
            const isSaved = savedVideoIds.includes(video.id);
            const isFavorite = favoriteVideoIds.includes(video.id) || (video.likesCount && video.likesCount > 0);

            return (
              <div
                key={video.id}
                id={`video-card-${video.id}`}
                onClick={() => onOpenVideo(video)}
                className="flex flex-col justify-between rounded-3xl overflow-hidden bg-neutral-900/80 hover:bg-neutral-900 border border-neutral-800 hover:border-emerald-500/40 transition-all duration-200 cursor-pointer group shadow-xl"
              >
                
                {/* THUMBNAIL WITH PLAY ICON & DURATION */}
                <div className="relative aspect-video overflow-hidden bg-neutral-950">
                  <img
                    src={video.thumbnailUrl}
                    alt={video.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    referrerPolicy="no-referrer"
                  />
                  
                  {/* Play Button Overlay */}
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-emerald-400/90 text-neutral-950 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      <Play className="w-5 h-5 fill-neutral-950 translate-x-0.5" />
                    </div>
                  </div>

                  {/* Duration Badge */}
                  {video.durationFormatted && (
                    <div className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded-lg bg-black/80 backdrop-blur-md text-[11px] font-mono font-medium text-white flex items-center gap-1 border border-white/10">
                      <Clock className="w-3 h-3 text-emerald-400" />
                      <span>{video.durationFormatted}</span>
                    </div>
                  )}

                  {/* Category Pill */}
                  {video.categoryLabel && (
                    <div className="absolute top-2.5 left-2.5">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] uppercase font-bold bg-neutral-950/80 backdrop-blur-md text-emerald-300 border border-emerald-500/30">
                        {video.categoryLabel}
                      </span>
                    </div>
                  )}
                </div>

                {/* CONTENT AREA: TITLE, DESCRIPTION */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    
                    {/* VIDEO TITLE */}
                    <h3 className="text-base sm:text-lg font-display font-bold text-white group-hover:text-emerald-300 transition-colors line-clamp-2 leading-snug">
                      {video.title}
                    </h3>

                    {/* DESCRIPTION */}
                    <p className="text-xs sm:text-sm text-neutral-400 line-clamp-3 leading-relaxed">
                      {video.description}
                    </p>
                  </div>

                  {/* BOTTOM ACTIONS: DELETE, FAVORITE, SAVED, LIKE, SHARE */}
                  <div className="pt-3.5 border-t border-neutral-800/80 flex items-center justify-between gap-1.5">
                    
                    {/* Left: Like, Favorite, Saved */}
                    <div className="flex items-center gap-1.5">
                      {/* Like Button */}
                      <button
                        id={`btn-like-video-${video.id}`}
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleFavorite(video.id, e);
                        }}
                        className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl border text-xs font-semibold transition-colors cursor-pointer ${
                          isFavorite
                            ? 'bg-rose-950/80 border-rose-500/50 text-rose-300'
                            : 'bg-neutral-950 border-neutral-800 text-neutral-300 hover:text-rose-400'
                        }`}
                        title="Like video"
                      >
                        <Heart className={`w-3.5 h-3.5 ${isFavorite ? 'fill-rose-400 text-rose-400' : 'text-rose-400'}`} />
                        <span className="font-mono text-[11px]">{video.likesCount || 0}</span>
                      </button>

                      {/* Favorite Button */}
                      <button
                        id={`btn-favorite-video-${video.id}`}
                        type="button"
                        onClick={(e) => handleToggleFavorite(video.id, e)}
                        className={`p-1.5 rounded-xl border text-xs transition-colors cursor-pointer ${
                          isFavorite
                            ? 'bg-rose-950/80 border-rose-500/50 text-rose-300'
                            : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-rose-400'
                        }`}
                        title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                      >
                        <Star className={`w-3.5 h-3.5 ${isFavorite ? 'fill-rose-400 text-rose-400' : ''}`} />
                      </button>

                      {/* Saved / Bookmark Button */}
                      <button
                        id={`btn-save-video-${video.id}`}
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleSaveVideo(video.id);
                        }}
                        className={`p-1.5 rounded-xl border transition-colors cursor-pointer ${
                          isSaved
                            ? 'bg-emerald-950 border-emerald-500/50 text-emerald-400'
                            : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-white'
                        }`}
                        title={isSaved ? 'Remove from saved' : 'Save video'}
                      >
                        <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-emerald-400' : ''}`} />
                      </button>
                    </div>

                    {/* Right: Share & Delete */}
                    <div className="flex items-center gap-1.5">
                      {/* Share / Copy Link Button */}
                      <button
                        id={`btn-share-video-${video.id}`}
                        type="button"
                        onClick={(e) => handleCopyLink(video, e)}
                        className="p-1.5 rounded-xl bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 text-neutral-400 hover:text-white text-xs transition-colors cursor-pointer"
                        title="Share video"
                      >
                        {copiedVideoId === video.id ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Share2 className="w-3.5 h-3.5" />
                        )}
                      </button>

                      {/* Delete Button */}
                      {onDeleteVideo && (
                        <button
                          id={`btn-delete-video-${video.id}`}
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setVideoToDelete(video);
                          }}
                          className="p-1.5 rounded-xl bg-neutral-950 hover:bg-rose-950/40 border border-neutral-800 hover:border-rose-800/50 text-neutral-400 hover:text-rose-400 text-xs transition-colors cursor-pointer"
                          title="Delete video"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
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
          <Tv className="w-10 h-10 text-neutral-500 mx-auto" />
          <h3 className="text-base font-bold text-white">No videos found</h3>
          <p className="text-xs text-neutral-400 max-w-md mx-auto leading-relaxed">
            {searchQuery
              ? `No videos match "${searchQuery}".`
              : activeTab === 'saved'
              ? 'You have no saved videos.'
              : activeTab === 'favorite'
              ? 'You have no favorite videos yet.'
              : 'There are currently no videos uploaded.'}
          </p>
          <button
            onClick={onOpenUploadModal}
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-emerald-400 text-neutral-950 font-bold text-xs cursor-pointer shadow-md hover:bg-emerald-300 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Upload New Video</span>
          </button>
        </div>
      )}

      {/* DELETE CONFIRMATION DIALOG */}
      {videoToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-rose-400">
              <div className="p-2.5 rounded-2xl bg-rose-950/60 border border-rose-800/40">
                <Trash2 className="w-5 h-5 text-rose-400" />
              </div>
              <h3 className="text-base font-bold text-white">Delete Video?</h3>
            </div>

            <p className="text-xs text-neutral-300 leading-relaxed">
              Are you sure you want to delete <strong className="text-white">"{videoToDelete.title}"</strong>?
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setVideoToDelete(null)}
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
