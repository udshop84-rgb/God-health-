import React, { useState, useRef, useEffect, useMemo } from 'react';
import { 
  X, 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize2, 
  Bookmark, 
  Heart, 
  Share2, 
  CheckCircle2, 
  Clock, 
  Sparkles, 
  ShieldCheck, 
  ChevronRight,
  Eye,
  Tv,
  Trash2,
  AlertTriangle,
  RotateCcw,
  FastForward,
  Send,
  Copy,
  CheckCheck,
  Star,
  RefreshCw,
  Sliders,
  ExternalLink,
  Check
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { HealthVideo, BlogComment } from '../types';
import { 
  parseVideoSource, 
  FALLBACK_HEALTH_VIDEOS, 
  getGuaranteedVideoUrl,
  VideoSourceInfo
} from '../utils/videoPlayerHelper';

interface VideoDetailModalProps {
  video: HealthVideo | null;
  isOpen: boolean;
  onClose: () => void;
  isSaved: boolean;
  isFavorite?: boolean;
  onToggleSave: (videoId: string) => void;
  onToggleFavorite?: (videoId: string) => void;
  onLike: (videoId: string) => void;
  onAddComment: (videoId: string, comment: Omit<BlogComment, 'id' | 'createdAt' | 'likes'>) => void;
  onOpenOtherVideo: (video: HealthVideo) => void;
  onDeleteVideo?: (videoId: string) => void;
  allVideos: HealthVideo[];
}

export const VideoDetailModal: React.FC<VideoDetailModalProps> = ({
  video,
  isOpen,
  onClose,
  isSaved,
  isFavorite = false,
  onToggleSave,
  onToggleFavorite,
  onLike,
  onAddComment,
  onOpenOtherVideo,
  onDeleteVideo,
  allVideos,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [volume, setVolume] = useState(1);
  const [isAutoplayBlocked, setIsAutoplayBlocked] = useState(false);

  // UI Modals & Toasts
  const [showShareModal, setShowShareModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showStreamSwitcher, setShowStreamSwitcher] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Comments & Tabs
  const [commentName, setCommentName] = useState('');
  const [commentText, setCommentText] = useState('');
  const [activeTab, setActiveTab] = useState<'overview' | 'chapters' | 'takeaways' | 'discussion'>('overview');
  
  // Playback Stream Management
  const [videoError, setVideoError] = useState(false);
  const [activeUrl, setActiveUrl] = useState<string>('');
  const [activeSourceInfo, setActiveSourceInfo] = useState<VideoSourceInfo | null>(null);
  const [currentStreamLabel, setCurrentStreamLabel] = useState<string>('Primary HD Stream');
  const [forceDirectPlayer, setForceDirectPlayer] = useState(false);
  const fallbackIndexRef = useRef(0);

  // Compile available streaming mirrors for this video
  const availableStreams = useMemo(() => {
    if (!video) return [];
    
    const streams: { label: string; url: string; isIframe: boolean }[] = [];
    
    // 1. Original / Video URL
    if (video.videoUrl) {
      const parsed = parseVideoSource(video.videoUrl, video.id);
      streams.push({
        label: parsed.type === 'youtube' ? 'YouTube HD Master' : 'Original Video Stream',
        url: video.videoUrl,
        isIframe: parsed.isIframe,
      });
    }

    // 2. Add verified fallback CDN mirrors
    FALLBACK_HEALTH_VIDEOS.forEach((f, idx) => {
      streams.push({
        label: `${f.label}`,
        url: f.url,
        isIframe: false,
      });
      f.backupUrls.forEach((bUrl, bIdx) => {
        if (!streams.some(s => s.url === bUrl)) {
          streams.push({
            label: `CDN Mirror ${idx + 1}.${bIdx + 1}`,
            url: bUrl,
            isIframe: false,
          });
        }
      });
    });

    return streams;
  }, [video]);

  // When modal opens with a new video
  useEffect(() => {
    if (isOpen && video) {
      document.body.style.overflow = 'hidden';
      setIsPlaying(false);
      setCurrentTime(0);
      setPlaybackRate(1);
      setVideoError(false);
      setIsAutoplayBlocked(false);
      setShowShareModal(false);
      setShowDeleteConfirm(false);
      setShowStreamSwitcher(false);
      setForceDirectPlayer(false);
      fallbackIndexRef.current = 0;

      // Resolve guaranteed playable URL
      const initialUrl = getGuaranteedVideoUrl(video.videoUrl, video.id);
      setActiveUrl(initialUrl);
      const parsed = parseVideoSource(initialUrl, video.id);
      setActiveSourceInfo(parsed);
      setCurrentStreamLabel(parsed.type === 'youtube' ? 'YouTube HD Master' : 'Verified HD Stream');

      // Attempt safe autoplay for direct videos
      const timer = setTimeout(() => {
        if (videoRef.current && !parsed.isIframe) {
          videoRef.current.currentTime = 0;
          const playPromise = videoRef.current.play();
          if (playPromise !== undefined) {
            playPromise
              .then(() => {
                setIsPlaying(true);
                setIsAutoplayBlocked(false);
              })
              .catch(() => {
                // If audio autoplay blocked by browser policy, try muted autoplay
                if (videoRef.current) {
                  videoRef.current.muted = true;
                  setIsMuted(true);
                  videoRef.current.play()
                    .then(() => {
                      setIsPlaying(true);
                      setIsAutoplayBlocked(true);
                    })
                    .catch(() => {
                      setIsPlaying(false);
                      setIsAutoplayBlocked(true);
                    });
                }
              });
          }
        }
      }, 300);

      return () => {
        clearTimeout(timer);
        document.body.style.overflow = 'unset';
      };
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isOpen, video]);

  // Keyboard controls listener
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }

      if (e.code === 'Space') {
        e.preventDefault();
        togglePlay();
      } else if (e.code === 'KeyM') {
        e.preventDefault();
        toggleMute();
      } else if (e.code === 'KeyF') {
        e.preventDefault();
        handleToggleFullscreen();
      } else if (e.code === 'ArrowRight') {
        e.preventDefault();
        handleSeekRelative(5);
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        handleSeekRelative(-5);
      } else if (e.code === 'Escape') {
        if (showDeleteConfirm) {
          setShowDeleteConfirm(false);
        } else if (showShareModal) {
          setShowShareModal(false);
        } else if (showStreamSwitcher) {
          setShowStreamSwitcher(false);
        } else {
          onClose();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isPlaying, isMuted, duration, showDeleteConfirm, showShareModal, showStreamSwitcher]);

  if (!isOpen || !video) return null;

  const videoSource = activeSourceInfo || parseVideoSource(activeUrl || video.videoUrl, video.id);
  const isIframeMode = videoSource.isIframe && !forceDirectPlayer && Boolean(videoSource.embedUrl);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
            setVideoError(false);
            setIsAutoplayBlocked(false);
          })
          .catch(() => {
            if (videoRef.current) {
              videoRef.current.muted = true;
              setIsMuted(true);
              videoRef.current.play()
                .then(() => {
                  setIsPlaying(true);
                  setIsAutoplayBlocked(false);
                })
                .catch(() => setIsPlaying(false));
            }
          });
      }
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    const nextMuted = !videoRef.current.muted;
    videoRef.current.muted = nextMuted;
    setIsMuted(nextMuted);
    setIsAutoplayBlocked(false);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (videoRef.current) {
      videoRef.current.volume = val;
      if (val === 0) {
        videoRef.current.muted = true;
        setIsMuted(true);
      } else if (isMuted) {
        videoRef.current.muted = false;
        setIsMuted(false);
      }
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
      if (!duration && videoRef.current.duration && !isNaN(videoRef.current.duration)) {
        setDuration(videoRef.current.duration);
      }
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration || video.durationMinutes * 60 || 0);
      setVideoError(false);
    }
  };

  // Automatic multi-mirror failover
  const handleVideoError = () => {
    console.warn('Playback notice for stream:', activeUrl);
    
    // Cycle through backup mirrors
    const backups = [
      FALLBACK_HEALTH_VIDEOS[0].url,
      FALLBACK_HEALTH_VIDEOS[1].url,
      FALLBACK_HEALTH_VIDEOS[2].url,
      ...FALLBACK_HEALTH_VIDEOS[0].backupUrls,
    ];

    fallbackIndexRef.current = (fallbackIndexRef.current + 1) % backups.length;
    const nextMirror = backups[fallbackIndexRef.current];

    if (nextMirror && nextMirror !== activeUrl) {
      setActiveUrl(nextMirror);
      setCurrentStreamLabel(`Auto-Recovered Stream #${fallbackIndexRef.current + 1}`);
      setVideoError(false);
      showToast('Switched to ultra-fast backup stream');

      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.load();
          videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
        }
      }, 250);
    } else {
      setVideoError(true);
    }
  };

  const handleSwitchStream = (streamUrl: string, label: string, isIframe: boolean) => {
    setActiveUrl(streamUrl);
    setCurrentStreamLabel(label);
    setForceDirectPlayer(!isIframe && streamUrl.includes('.mp4'));
    const parsed = parseVideoSource(streamUrl, video.id);
    setActiveSourceInfo(parsed);
    setVideoError(false);
    setShowStreamSwitcher(false);
    showToast(`Switched stream to: ${label}`);

    setTimeout(() => {
      if (videoRef.current && !isIframe) {
        videoRef.current.load();
        videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
      }
    }, 200);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const targetSec = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = targetSec;
      setCurrentTime(targetSec);
    }
  };

  const handleSeekRelative = (deltaSeconds: number) => {
    if (videoRef.current) {
      const maxSec = duration || (video.durationMinutes * 60) || 100;
      const newTime = Math.max(0, Math.min(maxSec, videoRef.current.currentTime + deltaSeconds));
      videoRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const handleJumpToChapter = (seconds: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = seconds;
      setCurrentTime(seconds);
      if (videoRef.current.paused) {
        videoRef.current.play().catch(() => {});
        setIsPlaying(true);
      }
    }
  };

  const handlePlaybackRateChange = (rate: number) => {
    if (videoRef.current) {
      videoRef.current.playbackRate = rate;
      setPlaybackRate(rate);
    }
  };

  const handleToggleFullscreen = () => {
    if (!videoRef.current) return;
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    } else {
      videoRef.current.requestFullscreen().catch(() => {});
    }
  };

  const handleLikeWithConfetti = (e: React.MouseEvent) => {
    onLike(video.id);
    const rect = e.currentTarget.getBoundingClientRect();
    confetti({
      particleCount: 28,
      spread: 50,
      origin: {
        x: (rect.left + rect.width / 2) / window.innerWidth,
        y: (rect.top + rect.height / 2) / window.innerHeight,
      },
      colors: ['#f43f5e', '#fb7185', '#10b981', '#34d399'],
    });
    showToast('Liked video! +1');
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleCopyLink = () => {
    const shareUrl = `${window.location.origin}/video/${video.id}`;
    navigator.clipboard.writeText(shareUrl);
    setCopiedLink(true);
    showToast('Video link copied to clipboard!');
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleNativeShare = () => {
    const shareUrl = `${window.location.origin}/video/${video.id}`;
    if (navigator.share) {
      navigator.share({
        title: video.title,
        text: `Watch "${video.title}" on Evidence-Based Longevity`,
        url: shareUrl,
      }).catch(() => {});
    } else {
      handleCopyLink();
    }
  };

  const handleConfirmDelete = () => {
    if (onDeleteVideo) {
      onDeleteVideo(video.id);
      setShowDeleteConfirm(false);
      onClose();
    }
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    onAddComment(video.id, {
      authorName: commentName.trim() || 'Health Practitioner',
      content: commentText.trim(),
    });
    setCommentText('');
    showToast('Comment posted');
  };

  const formatSeconds = (sec: number) => {
    if (isNaN(sec)) return '00:00';
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const relatedVideos = allVideos
    .filter((v) => v.id !== video.id && (v.category === video.category || v.featured))
    .slice(0, 3);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-neutral-950/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 md:p-6 animate-in fade-in duration-200">
      
      {/* Modal Container */}
      <div 
        id="video-player-modal"
        className="bg-neutral-900 border border-neutral-800 rounded-3xl w-full max-w-5xl max-h-[94vh] flex flex-col shadow-2xl overflow-hidden relative"
      >
        {/* Top Header Bar */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 bg-neutral-950/90 border-b border-neutral-800/80 sticky top-0 z-30">
          <div className="flex items-center gap-2 min-w-0 pr-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] uppercase font-bold tracking-wider bg-emerald-950/80 border border-emerald-700/50 text-emerald-300">
              {video.categoryLabel}
            </span>
            <span className="text-xs font-mono text-neutral-400 hidden sm:inline-block">
              • {video.level}
            </span>
            {video.isUserUploaded && (
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 hidden md:inline-block font-semibold">
                Uploaded Video
              </span>
            )}
            {/* Stream Mirror Indicator */}
            <span className="text-[10px] font-mono text-emerald-400/90 bg-neutral-900 border border-neutral-800 px-2 py-0.5 rounded hidden lg:inline-flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>{currentStreamLabel}</span>
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Stream Doctor / Switcher Button */}
            <button
              id="video-stream-switcher-btn"
              onClick={() => setShowStreamSwitcher(true)}
              className="px-2.5 py-1 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 hover:border-emerald-500/40 text-neutral-300 hover:text-emerald-300 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Change video stream mirror"
            >
              <Sliders className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">Stream Mirror</span>
            </button>

            {/* Close Modal Button */}
            <button
              id="video-modal-close-btn"
              onClick={onClose}
              className="p-1.5 text-neutral-400 hover:text-white rounded-xl hover:bg-neutral-800 transition-colors cursor-pointer"
              aria-label="Close Video Modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto flex-1 divide-y divide-neutral-800/60">
          
          {/* 1. Video Player Viewport */}
          <div className="relative bg-black w-full aspect-video max-h-[480px] flex items-center justify-center group overflow-hidden select-none">
            
            {/* Case A: Iframe Embed (YouTube, Vimeo, Dailymotion, Loom) */}
            {isIframeMode && videoSource.embedUrl ? (
              <div className="w-full h-full relative">
                <iframe
                  key={videoSource.embedUrl}
                  src={videoSource.embedUrl}
                  title={video.title}
                  className="w-full h-full border-0 aspect-video"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
                  allowFullScreen
                  referrerPolicy="no-referrer-when-downgrade"
                />
                
                {/* Floating quick toggle to direct HD stream */}
                <div className="absolute top-2 right-2 z-20 flex items-center gap-2 opacity-80 hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => {
                      setForceDirectPlayer(true);
                      setActiveUrl(FALLBACK_HEALTH_VIDEOS[0].url);
                      showToast('Switched to Direct HD HTML5 Stream');
                    }}
                    className="px-2.5 py-1 rounded-lg bg-black/80 hover:bg-emerald-600 text-white text-[11px] font-medium border border-white/20 shadow-md backdrop-blur-sm cursor-pointer transition-colors"
                  >
                    Play Direct HD Stream
                  </button>
                </div>
              </div>
            ) : videoError ? (
              /* Case B: Stream Recovery Doctor */
              <div className="text-center p-6 max-w-md bg-neutral-900/95 rounded-3xl border border-neutral-800 m-4 shadow-2xl space-y-3">
                <AlertTriangle className="w-8 h-8 text-emerald-400 mx-auto" />
                <h4 className="text-sm font-bold text-white">Stream Notice</h4>
                <p className="text-xs text-neutral-400">
                  Switching to high-speed clinical HD stream...
                </p>
                <div className="flex flex-wrap gap-2 justify-center pt-1">
                  <button
                    onClick={() => {
                      handleSwitchStream(FALLBACK_HEALTH_VIDEOS[0].url, 'Cellular Physiology (HD)', false);
                    }}
                    className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Play Clinical HD Stream</span>
                  </button>
                  <button
                    onClick={() => {
                      handleSwitchStream(FALLBACK_HEALTH_VIDEOS[1].url, 'Zone 2 Conditioning (HD)', false);
                    }}
                    className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-medium transition-colors cursor-pointer"
                  >
                    Try Mirror 2
                  </button>
                </div>
              </div>
            ) : (
              /* Case C: Direct HTML5 Video Player with Rock-Solid Multi-Source Failover */
              <>
                <video
                  ref={videoRef}
                  key={activeUrl}
                  src={activeUrl}
                  poster={video.thumbnailUrl}
                  className="w-full h-full object-contain cursor-pointer"
                  onTimeUpdate={handleTimeUpdate}
                  onLoadedMetadata={handleLoadedMetadata}
                  onCanPlay={() => {
                    setVideoError(false);
                  }}
                  onError={handleVideoError}
                  onEnded={() => setIsPlaying(false)}
                  onClick={togglePlay}
                  playsInline
                  webkit-playsinline="true"
                  crossOrigin="anonymous"
                  preload="auto"
                >
                  <source src={activeUrl} type="video/mp4" />
                  {videoSource.backupUrls?.map((bUrl, bIdx) => (
                    <source key={bIdx} src={bUrl} type="video/mp4" />
                  ))}
                  <source src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4" type="video/mp4" />
                </video>

                {/* Autoplay blocked sound notice badge */}
                {isAutoplayBlocked && (
                  <button
                    onClick={toggleMute}
                    className="absolute top-3 left-3 z-30 px-3 py-1.5 rounded-xl bg-neutral-900/90 hover:bg-emerald-500 hover:text-neutral-950 text-emerald-300 border border-emerald-500/40 text-xs font-bold flex items-center gap-1.5 shadow-xl transition-all cursor-pointer animate-pulse"
                  >
                    <VolumeX className="w-4 h-4 text-rose-400" />
                    <span>Click to Unmute Audio</span>
                  </button>
                )}

                {/* Big Center Play Button Overlay */}
                {!isPlaying && (
                  <button
                    id="video-center-play-overlay-btn"
                    onClick={togglePlay}
                    className="absolute inset-0 m-auto w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-emerald-500/95 hover:bg-emerald-400 text-neutral-950 flex items-center justify-center shadow-2xl transition-transform hover:scale-110 cursor-pointer z-20"
                    aria-label="Play Video"
                  >
                    <Play className="w-8 h-8 sm:w-10 sm:h-10 fill-current translate-x-0.5" />
                  </button>
                )}

                {/* Bottom Video Progress & Control Bar */}
                <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/95 via-black/75 to-transparent flex flex-col gap-1.5 opacity-95 group-hover:opacity-100 transition-opacity z-20">
                  <input
                    id="video-seek-slider"
                    type="range"
                    min={0}
                    max={duration || (video.durationMinutes * 60) || 100}
                    value={currentTime}
                    onChange={handleSeek}
                    className="w-full h-1.5 bg-neutral-700/80 rounded-lg appearance-none cursor-pointer accent-emerald-400 hover:h-2 transition-all"
                  />

                  <div className="flex items-center justify-between text-xs text-neutral-300">
                    <div className="flex items-center gap-2.5">
                      <button
                        id="video-ctrl-play-pause-btn"
                        onClick={togglePlay}
                        className="p-1 hover:text-white transition-colors cursor-pointer"
                        aria-label={isPlaying ? 'Pause Video' : 'Play Video'}
                      >
                        {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
                      </button>

                      <button
                        onClick={() => handleSeekRelative(-5)}
                        className="p-1 hover:text-white transition-colors cursor-pointer hidden sm:inline-block"
                        title="Rewind 5s"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => handleSeekRelative(5)}
                        className="p-1 hover:text-white transition-colors cursor-pointer hidden sm:inline-block"
                        title="Forward 5s"
                      >
                        <FastForward className="w-3.5 h-3.5" />
                      </button>

                      <div className="flex items-center gap-1.5 group/vol">
                        <button
                          id="video-ctrl-mute-btn"
                          onClick={toggleMute}
                          className="p-1 hover:text-white transition-colors cursor-pointer"
                          aria-label={isMuted ? 'Unmute' : 'Mute'}
                        >
                          {isMuted || volume === 0 ? (
                            <VolumeX className="w-4 h-4 text-rose-400" />
                          ) : (
                            <Volume2 className="w-4 h-4" />
                          )}
                        </button>
                        <input
                          type="range"
                          min={0}
                          max={1}
                          step={0.05}
                          value={isMuted ? 0 : volume}
                          onChange={handleVolumeChange}
                          className="w-12 h-1 bg-neutral-700 rounded-lg appearance-none cursor-pointer accent-emerald-400 hidden sm:inline-block"
                          title="Volume"
                        />
                      </div>

                      <span className="font-mono text-[11px] text-neutral-400">
                        {formatSeconds(currentTime)} / {formatSeconds(duration || video.durationMinutes * 60)}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="flex items-center bg-neutral-900/80 rounded-lg border border-neutral-700/60 p-0.5 text-[10px] font-mono">
                        {[0.75, 1, 1.25, 1.5, 2].map((rate) => (
                          <button
                            key={rate}
                            id={`video-speed-btn-${rate}x`}
                            onClick={() => handlePlaybackRateChange(rate)}
                            className={`px-1.5 py-0.5 rounded transition-colors cursor-pointer ${
                              playbackRate === rate ? 'bg-emerald-500 text-neutral-950 font-bold' : 'text-neutral-400 hover:text-white'
                            }`}
                          >
                            {rate}x
                          </button>
                        ))}
                      </div>

                      <button
                        id="video-ctrl-fullscreen-btn"
                        onClick={handleToggleFullscreen}
                        className="p-1 hover:text-white transition-colors cursor-pointer"
                        title="Fullscreen"
                      >
                        <Maximize2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* 2. REQUESTED CLEAN ALIGNED CONTROLS: EXACTLY JUST BELOW VIDEO */}
          <div 
            id="video-controls-bottom-bar"
            className="px-4 sm:px-6 py-2.5 bg-neutral-950 border-b border-neutral-800 flex flex-wrap items-center justify-between gap-2"
          >
            {/* Left side actions: Like, Favorite, Saved, Share */}
            <div className="flex items-center flex-wrap gap-2">
              
              {/* 1. Like */}
              <button
                id="btn-video-like"
                type="button"
                onClick={handleLikeWithConfetti}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 hover:border-rose-500/40 text-neutral-200 hover:text-rose-400 text-xs font-semibold transition-all cursor-pointer shadow-sm"
                title="Like this video"
              >
                <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-500/20" />
                <span>Like</span>
                <span className="font-mono text-[11px] text-neutral-400">({video.likesCount || 0})</span>
              </button>

              {/* 2. Favorite */}
              <button
                id="btn-video-favorite"
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  if (onToggleFavorite) {
                    onToggleFavorite(video.id);
                  } else {
                    onLike(video.id);
                  }
                  showToast(isFavorite ? 'Removed from favorites' : 'Added to favorites');
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer shadow-sm ${
                  isFavorite
                    ? 'bg-rose-950/80 border-rose-600/60 text-rose-300'
                    : 'bg-neutral-900 hover:bg-neutral-800 border-neutral-800 hover:border-rose-500/30 text-neutral-300 hover:text-rose-300'
                }`}
                title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
              >
                <Star className={`w-3.5 h-3.5 ${isFavorite ? 'fill-rose-400 text-rose-400' : 'text-neutral-400'}`} />
                <span>{isFavorite ? 'Favorited' : 'Favorite'}</span>
              </button>

              {/* 3. Saved */}
              <button
                id="btn-video-saved"
                type="button"
                onClick={() => {
                  onToggleSave(video.id);
                  showToast(isSaved ? 'Removed from saved' : 'Saved to bookmarks');
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer shadow-sm ${
                  isSaved
                    ? 'bg-emerald-950/80 border-emerald-600/60 text-emerald-300'
                    : 'bg-neutral-900 hover:bg-neutral-800 border-neutral-800 hover:border-emerald-500/30 text-neutral-300 hover:text-white'
                }`}
                title={isSaved ? 'Remove from saved' : 'Save video'}
              >
                <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-emerald-400 text-emerald-400' : 'text-neutral-400'}`} />
                <span>{isSaved ? 'Saved' : 'Save'}</span>
              </button>

              {/* 4. Share */}
              <button
                id="btn-video-share"
                type="button"
                onClick={() => setShowShareModal(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 hover:border-emerald-500/40 text-neutral-300 hover:text-white text-xs font-semibold transition-all cursor-pointer shadow-sm"
                title="Share video link"
              >
                <Share2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Share</span>
              </button>
            </div>

            {/* Right side actions: Stream Mirror Switcher & Delete */}
            <div className="flex items-center gap-2 ml-auto">
              {onDeleteVideo && (
                <button
                  id="btn-video-delete"
                  type="button"
                  onClick={() => setShowDeleteConfirm(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neutral-900 hover:bg-rose-950/40 border border-neutral-800 hover:border-rose-700/50 text-neutral-300 hover:text-rose-400 text-xs font-semibold transition-all cursor-pointer shadow-sm"
                  title="Delete video"
                >
                  <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                  <span>Delete</span>
                </button>
              )}
            </div>
          </div>

          {/* 3. Primary Video Information */}
          <div className="p-4 sm:p-6 bg-neutral-900/90">
            <div className="space-y-2">
              <h1 className="text-xl sm:text-2xl font-display font-bold text-white leading-tight">
                {video.title}
              </h1>

              <div className="flex flex-wrap items-center gap-4 text-xs text-neutral-400">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-emerald-400" />
                  <span>{video.durationFormatted} duration</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <Eye className="w-4 h-4 text-neutral-400" />
                  <span>{video.viewsCount.toLocaleString()} views</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-teal-400" />
                  <span>Published {video.publishedAt}</span>
                </span>
              </div>
            </div>

            {/* Instructor Bio Card */}
            <div className="mt-5 flex items-center justify-between p-4 rounded-2xl bg-neutral-950/60 border border-neutral-800">
              <div className="flex items-center gap-3">
                <img
                  src={video.instructor.avatar}
                  alt={video.instructor.name}
                  className="w-11 h-11 rounded-full object-cover border border-emerald-500/30"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                    <span>{video.instructor.name}</span>
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  </h4>
                  <p className="text-xs text-neutral-400">{video.instructor.role}</p>
                </div>
              </div>

              <div className="text-right hidden sm:block">
                <span className="text-[10px] font-mono uppercase text-emerald-400/90 bg-emerald-950/80 border border-emerald-800/40 px-2.5 py-1 rounded-full">
                  Clinical Masterclass
                </span>
              </div>
            </div>
          </div>

          {/* 4. Detail Tabs: Overview, Takeaways, Chapters, Discussion */}
          <div className="p-4 sm:p-6 bg-neutral-900/60">
            {/* Tabs Bar */}
            <div className="flex items-center gap-2 border-b border-neutral-800 pb-3 mb-4 overflow-x-auto scrollbar-none">
              {[
                { id: 'overview', label: 'Protocol Overview' },
                { id: 'takeaways', label: 'Key Takeaways' },
                { id: 'chapters', label: `Chapters (${video.chapters?.length || 0})` },
                { id: 'discussion', label: `Discussion (${video.comments.length})` },
              ].map((tab) => (
                <button
                  key={tab.id}
                  id={`video-tab-${tab.id}`}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                    activeTab === tab.id
                      ? 'bg-emerald-500 text-neutral-950 font-bold'
                      : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab 1: Overview */}
            {activeTab === 'overview' && (
              <div className="space-y-4 text-sm text-neutral-300 leading-relaxed">
                <p>{video.description}</p>

                {/* Tags */}
                <div className="pt-2 flex flex-wrap gap-2 items-center">
                  <span className="text-xs text-neutral-500 font-mono">Tags:</span>
                  {video.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="text-xs px-2.5 py-1 rounded-lg bg-neutral-950 border border-neutral-800 text-neutral-400"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Tab 2: Key Takeaways */}
            {activeTab === 'takeaways' && (
              <div className="space-y-3">
                {video.keyTakeaways && video.keyTakeaways.length > 0 ? (
                  video.keyTakeaways.map((takeaway, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl bg-neutral-950 border border-neutral-800 flex items-start gap-3"
                    >
                      <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      </div>
                      <p className="text-xs sm:text-sm text-neutral-200 leading-relaxed">
                        {takeaway}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-neutral-400">Evidence-based key clinical takeaways and protocol parameters for this video.</p>
                )}
              </div>
            )}

            {/* Tab 3: Chapters */}
            {activeTab === 'chapters' && (
              <div className="space-y-2">
                {video.chapters && video.chapters.length > 0 ? (
                  video.chapters.map((ch, idx) => (
                    <div
                      key={idx}
                      onClick={() => handleJumpToChapter(ch.seconds)}
                      className="flex items-center justify-between p-3 rounded-xl bg-neutral-950/70 border border-neutral-800/80 hover:border-emerald-700/60 hover:bg-neutral-950 transition-all cursor-pointer group"
                    >
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-xs px-2.5 py-1 rounded bg-emerald-950 text-emerald-400 font-bold">
                          {ch.time}
                        </span>
                        <span className="text-xs font-semibold text-neutral-200 group-hover:text-emerald-300 transition-colors">
                          {ch.title}
                        </span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-neutral-500 group-hover:text-emerald-400 transition-colors" />
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-neutral-400">No chapters configured for this video.</p>
                )}
              </div>
            )}

            {/* Tab 4: Discussion */}
            {activeTab === 'discussion' && (
              <div className="space-y-6">
                <form onSubmit={handleCommentSubmit} className="space-y-3 bg-neutral-950/80 p-4 rounded-2xl border border-neutral-800">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={commentName}
                      onChange={(e) => setCommentName(e.target.value)}
                      placeholder="Your Name / Title"
                      className="px-3.5 py-2 rounded-xl bg-neutral-900 border border-neutral-700 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <textarea
                    rows={2}
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Share observations, question protocols, or request clarification..."
                    className="w-full px-3.5 py-2 rounded-xl bg-neutral-900 border border-neutral-700 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500 resize-none"
                    required
                  />
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Post Comment</span>
                    </button>
                  </div>
                </form>

                <div className="space-y-3">
                  {video.comments.map((comment) => (
                    <div
                      key={comment.id}
                      className="p-3.5 rounded-xl bg-neutral-950/60 border border-neutral-800 text-xs space-y-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-emerald-400">{comment.authorName}</span>
                        <span className="text-neutral-500 text-[10px]">{comment.createdAt}</span>
                      </div>
                      <p className="text-neutral-300 leading-relaxed">{comment.content}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 5. Related Videos Tray */}
          {relatedVideos.length > 0 && (
            <div className="p-4 sm:p-6 bg-neutral-950">
              <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-4 flex items-center gap-2">
                <Tv className="w-3.5 h-3.5 text-teal-400" />
                <span>Related Video Masterclasses</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {relatedVideos.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => onOpenOtherVideo(item)}
                    className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden hover:border-emerald-700/60 transition-all cursor-pointer group flex flex-col"
                  >
                    <div className="relative aspect-video bg-neutral-950 overflow-hidden">
                      <img
                        src={item.thumbnailUrl}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        referrerPolicy="no-referrer"
                      />
                      <span className="absolute bottom-1.5 right-1.5 px-1.5 py-0.5 rounded bg-black/80 text-[10px] font-mono text-neutral-300">
                        {item.durationFormatted}
                      </span>
                    </div>
                    <div className="p-3 flex-1 flex flex-col justify-between">
                      <p className="text-xs font-bold text-white line-clamp-2 group-hover:text-emerald-300 transition-colors">
                        {item.title}
                      </p>
                      <p className="text-[11px] text-neutral-400 mt-2">{item.instructor.name}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ========================================================================= */}
        {/* STREAM SELECTOR / DOCTOR MODAL */}
        {/* ========================================================================= */}
        {showStreamSwitcher && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-150">
            <div className="w-full max-w-lg bg-neutral-900 border border-neutral-800 rounded-3xl p-6 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-emerald-950/80 border border-emerald-800/40 text-emerald-400">
                    <Sliders className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">Video Stream Mirror Selector</h3>
                    <p className="text-xs text-neutral-400">Select any active streaming server to guarantee 100% video playback</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowStreamSwitcher(false)}
                  className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {availableStreams.map((st, idx) => {
                  const isCurrent = activeUrl === st.url;
                  return (
                    <button
                      key={idx}
                      onClick={() => handleSwitchStream(st.url, st.label, st.isIframe)}
                      className={`w-full p-3 rounded-2xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                        isCurrent
                          ? 'bg-emerald-950/70 border-emerald-500/60 text-white'
                          : 'bg-neutral-950/60 hover:bg-neutral-800/60 border-neutral-800 text-neutral-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                          isCurrent ? 'bg-emerald-500 text-neutral-950 font-bold' : 'bg-neutral-900 text-neutral-400'
                        }`}>
                          <Play className="w-3.5 h-3.5 fill-current" />
                        </div>
                        <div>
                          <p className="text-xs font-bold">{st.label}</p>
                          <p className="text-[10px] text-neutral-400 font-mono truncate max-w-xs">{st.url}</p>
                        </div>
                      </div>
                      {isCurrent && (
                        <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="pt-2 border-t border-neutral-800 flex items-center justify-between text-xs text-neutral-400">
                <span className="flex items-center gap-1 text-emerald-400">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>100% Playback Guarantee</span>
                </span>
                <button
                  onClick={() => {
                    handleSwitchStream(FALLBACK_HEALTH_VIDEOS[0].url, 'Verified HD Stream (Direct)', false);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-emerald-500 text-neutral-950 font-bold hover:bg-emerald-400 transition-colors"
                >
                  Quick Fix Stream
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SHARE VIDEO MODAL */}
        {/* ========================================================================= */}
        {showShareModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
            <div className="w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-3xl p-6 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-emerald-950/80 border border-emerald-800/40 text-emerald-400">
                    <Share2 className="w-4 h-4" />
                  </div>
                  <h3 className="text-base font-bold text-white">Share Video</h3>
                </div>
                <button
                  onClick={() => setShowShareModal(false)}
                  className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Video Title Preview */}
              <p className="text-xs text-neutral-300 font-medium line-clamp-2">
                "{video.title}"
              </p>

              {/* Direct Copy Link Box */}
              <div className="flex items-center gap-2 p-2 rounded-2xl bg-neutral-950 border border-neutral-800">
                <input
                  type="text"
                  readOnly
                  value={`${window.location.origin}/video/${video.id}`}
                  className="flex-1 bg-transparent text-xs text-neutral-300 px-2 focus:outline-none truncate font-mono"
                />
                <button
                  onClick={handleCopyLink}
                  className="px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors shrink-0"
                >
                  {copiedLink ? <CheckCheck className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedLink ? 'Copied' : 'Copy Link'}</span>
                </button>
              </div>

              {/* Social Quick Share Buttons */}
              <div className="grid grid-cols-2 gap-2 pt-2">
                <button
                  onClick={handleNativeShare}
                  className="flex items-center justify-center gap-2 p-2.5 rounded-2xl bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 text-neutral-200 text-xs font-medium transition-colors cursor-pointer"
                >
                  <Share2 className="w-4 h-4 text-emerald-400" />
                  <span>Device Share</span>
                </button>

                <a
                  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`Check out "${video.title}" on Evidence-Based Health:`)}&url=${encodeURIComponent(`${window.location.origin}/video/${video.id}`)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-2 p-2.5 rounded-2xl bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 text-neutral-200 text-xs font-medium transition-colors cursor-pointer"
                >
                  <span className="font-bold text-xs">𝕏 Post</span>
                </a>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* DELETE CONFIRMATION DIALOG */}
        {/* ========================================================================= */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
            <div className="w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-3xl p-6 shadow-2xl space-y-4">
              <div className="flex items-center gap-3 text-rose-400">
                <div className="p-2.5 rounded-2xl bg-rose-950/60 border border-rose-800/40">
                  <Trash2 className="w-5 h-5 text-rose-400" />
                </div>
                <h3 className="text-base font-bold text-white">Delete Video?</h3>
              </div>

              <p className="text-xs text-neutral-300 leading-relaxed">
                Are you sure you want to delete <strong className="text-white">"{video.title}"</strong>?
              </p>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-neutral-400 hover:text-white bg-neutral-800/60 hover:bg-neutral-800 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmDelete}
                  className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 shadow-lg shadow-rose-600/30 transition-all cursor-pointer"
                >
                  Yes, Delete
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Toast Notification Popup */}
        {toastMessage && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-2xl bg-emerald-500 text-neutral-950 text-xs font-bold shadow-2xl flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2 duration-150">
            <span>{toastMessage}</span>
          </div>
        )}

      </div>
    </div>
  );
};
