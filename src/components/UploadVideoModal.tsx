import React, { useState, useRef, useEffect } from 'react';
import { 
  ArrowLeft,
  Upload, 
  Link as LinkIcon, 
  Tag as TagIcon, 
  Hash, 
  X, 
  Globe, 
  Lock, 
  AlertCircle, 
  Video as VideoIcon, 
  FileVideo,
  Send,
  Sparkles,
  Image as ImageIcon,
  FileImage,
  Check,
  RotateCcw,
  Layers,
  Eye
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { HealthVideo, BlogCategory } from '../types';
import { parseVideoSource, registerVideoBlob, FALLBACK_HEALTH_VIDEOS } from '../utils/videoPlayerHelper';

interface UploadVideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUploadVideo: (newVideo: HealthVideo) => void;
  onUpdateVideo?: (updatedVideo: HealthVideo) => void;
  initialVideo?: HealthVideo | null;
}

const CATEGORY_OPTIONS: { id: BlogCategory; label: string }[] = [
  { id: 'longevity', label: 'Longevity & Cellular Health' },
  { id: 'nutrition', label: 'Nutrition & Metabolic Health' },
  { id: 'sleep-science', label: 'Sleep Science & Circadian Biology' },
  { id: 'mental-health', label: 'Mental Health & Neuroscience' },
  { id: 'fitness', label: 'Fitness & Physical Performance' },
  { id: 'preventive-care', label: 'Preventive Medicine & Diagnostics' },
  { id: 'holistic-wellness', label: 'Holistic & Environmental Health' },
];

export const HEALTH_VIDEO_PRESET_THUMBNAILS = [
  {
    title: 'Zone 2 & Mitochondria',
    url: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=1200&q=80',
  },
  {
    title: 'Circadian Biology & Sleep',
    url: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&w=1200&q=80',
  },
  {
    title: 'Nutrition & Autophagy',
    url: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=1200&q=80',
  },
  {
    title: 'Neuroplasticity & Brain',
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=1200&q=80',
  },
  {
    title: 'Holistic Longevity Lab',
    url: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1200&q=80',
  },
  {
    title: 'Diagnostic Biomarkers',
    url: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=1200&q=80',
  },
];

export const UploadVideoModal: React.FC<UploadVideoModalProps> = ({
  isOpen,
  onClose,
  onUploadVideo,
  onUpdateVideo,
  initialVideo,
}) => {
  const isEditing = Boolean(initialVideo);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const thumbnailFileInputRef = useRef<HTMLInputElement | null>(null);

  // 1. Video Source: Choose File vs URL
  const [sourceMode, setSourceMode] = useState<'upload' | 'url'>('upload');
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState('');
  const [durationMinutes, setDurationMinutes] = useState<number>(15);
  const [isDragging, setIsDragging] = useState(false);

  // 2. Video Thumbnail Feature: Choose File vs Image URL
  const [thumbnailMode, setThumbnailMode] = useState<'upload' | 'url'>('upload');
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailUrl, setThumbnailUrl] = useState<string>(FALLBACK_HEALTH_VIDEOS[0].thumbnail);
  const [thumbnailSourceLabel, setThumbnailSourceLabel] = useState<string>('Default Cover');
  const [isThumbnailDragging, setIsThumbnailDragging] = useState(false);

  // 3. Video Title
  const [title, setTitle] = useState('');

  // 4. Tags & Hashtags
  const [tags, setTags] = useState<string[]>(['Health', 'Longevity']);
  const [tagInput, setTagInput] = useState('');

  // 5. Category
  const [category, setCategory] = useState<BlogCategory>('longevity');

  // 6. Description
  const [description, setDescription] = useState('');

  // 7. Visibility: 'public' | 'draft'
  const [visibility, setVisibility] = useState<'public' | 'draft'>('public');

  // Status & Validation
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset or load initial data
  useEffect(() => {
    if (isOpen) {
      if (initialVideo) {
        setTitle(initialVideo.title || '');
        setDescription(initialVideo.description || '');
        setCategory(initialVideo.category || 'longevity');
        setTags(initialVideo.tags || ['Health', 'Wellness']);
        setVideoUrl(initialVideo.videoUrl || '');
        setThumbnailUrl(initialVideo.thumbnailUrl || FALLBACK_HEALTH_VIDEOS[0].thumbnail);
        setThumbnailSourceLabel('Existing Video Cover');
        setDurationMinutes(initialVideo.durationMinutes || 15);
        setVisibility(initialVideo.status === 'draft' ? 'draft' : 'public');
        setSourceMode(initialVideo.videoUrl?.startsWith('blob:') ? 'upload' : 'url');
        setThumbnailMode(initialVideo.thumbnailUrl?.startsWith('data:') ? 'upload' : 'url');
        setVideoFile(null);
        setThumbnailFile(null);
      } else {
        resetForm();
      }
      setValidationError(null);
    }
  }, [isOpen, initialVideo]);

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setCategory('longevity');
    setTags(['Health', 'Longevity', 'Wellness']);
    setTagInput('');
    setVideoUrl('');
    setThumbnailUrl(FALLBACK_HEALTH_VIDEOS[0].thumbnail);
    setThumbnailSourceLabel('Default Cover');
    setDurationMinutes(15);
    setVisibility('public');
    setSourceMode('upload');
    setThumbnailMode('upload');
    setVideoFile(null);
    setThumbnailFile(null);
    setValidationError(null);
  };

  if (!isOpen) return null;

  // Process uploaded video file
  const processVideoFile = (file: File) => {
    if (!file.type.startsWith('video/') && !file.name.match(/\.(mp4|mov|webm|mkv|ogg)$/i)) {
      setValidationError('Please select a valid video file (.mp4, .webm, .mov, .ogg).');
      return;
    }

    setVideoFile(file);
    const objectUrl = URL.createObjectURL(file);
    setVideoUrl(objectUrl);
    setValidationError(null);

    // Auto title if empty
    if (!title.trim()) {
      const cleanName = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
      setTitle(cleanName.charAt(0).toUpperCase() + cleanName.slice(1));
    }

    // Auto-extract video metadata & generate thumbnail frame
    try {
      const tempVideo = document.createElement('video');
      tempVideo.preload = 'metadata';
      tempVideo.src = objectUrl;
      tempVideo.muted = true;
      tempVideo.playsInline = true;

      tempVideo.onloadedmetadata = () => {
        if (tempVideo.duration && !isNaN(tempVideo.duration)) {
          const mins = Math.max(1, Math.round(tempVideo.duration / 60));
          setDurationMinutes(mins);
        }

        // Seek to 1s to capture thumbnail
        tempVideo.currentTime = Math.min(1, (tempVideo.duration || 2) / 2);
      };

      tempVideo.onseeked = () => {
        try {
          const canvas = document.createElement('canvas');
          canvas.width = tempVideo.videoWidth || 640;
          canvas.height = tempVideo.videoHeight || 360;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(tempVideo, 0, 0, canvas.width, canvas.height);
            const thumbData = canvas.toDataURL('image/jpeg', 0.85);
            // Only update thumbnail if user hasn't explicitly uploaded a custom thumbnail file
            if (!thumbnailFile) {
              setThumbnailUrl(thumbData);
              setThumbnailSourceLabel('Auto-Captured Video Frame');
            }
          }
        } catch (e) {
          console.log('Thumbnail generation fallback:', e);
        }
      };
    } catch (err) {
      console.log('Video metadata load notice:', err);
    }
  };

  // Process uploaded thumbnail image file
  const processThumbnailImageFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setValidationError('Please select a valid image file for the thumbnail (PNG, JPG, WEBP, GIF).');
      return;
    }
    if (file.size > 15 * 1024 * 1024) {
      setValidationError('Thumbnail image size must be under 15MB.');
      return;
    }

    setThumbnailFile(file);
    setValidationError(null);

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setThumbnailUrl(event.target.result as string);
        setThumbnailSourceLabel(`File: ${file.name}`);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleThumbnailFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processThumbnailImageFile(file);
    }
  };

  const handleThumbnailFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsThumbnailDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processThumbnailImageFile(file);
    }
  };

  const handleThumbnailUrlChange = (newUrl: string) => {
    setThumbnailUrl(newUrl);
    setThumbnailFile(null);
    setThumbnailSourceLabel('Custom Image URL');
    setValidationError(null);
  };

  const handleSelectPresetThumbnail = (preset: { title: string; url: string }) => {
    setThumbnailUrl(preset.url);
    setThumbnailFile(null);
    setThumbnailSourceLabel(`Preset: ${preset.title}`);
    setValidationError(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processVideoFile(file);
    }
  };

  const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processVideoFile(file);
    }
  };

  const handleUrlChange = (newUrl: string) => {
    setVideoUrl(newUrl);
    setValidationError(null);

    // Auto-detect YouTube or Vimeo thumbnail
    const parsed = parseVideoSource(newUrl);
    if (parsed.thumbnailUrl && !thumbnailFile) {
      setThumbnailUrl(parsed.thumbnailUrl);
      setThumbnailSourceLabel(parsed.type === 'youtube' ? 'YouTube HD Cover' : `${parsed.type} Preview`);
    }
  };

  // Tags & Hashtags handling
  const handleAddTag = (newTag: string) => {
    const cleanTag = newTag.replace(/^[#\s]+|[#\s]+$/g, '').trim();
    if (cleanTag && !tags.some((t) => t.toLowerCase() === cleanTag.toLowerCase())) {
      setTags((prev) => [...prev, cleanTag]);
    }
    setTagInput('');
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags((prev) => prev.filter((t) => t !== tagToRemove));
  };

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      handleAddTag(tagInput);
    }
  };

  // Submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let finalVideoUrl = videoUrl.trim();

    if (!finalVideoUrl && !videoFile) {
      setValidationError('Please upload a video file or enter a valid video URL.');
      return;
    }

    if (!title.trim()) {
      setValidationError('Please enter a video title.');
      return;
    }

    if (!description.trim()) {
      setValidationError('Please enter a video description.');
      return;
    }

    const finalThumbnailUrl = thumbnailUrl.trim() || FALLBACK_HEALTH_VIDEOS[0].thumbnail;

    setValidationError(null);
    setIsSubmitting(true);

    const videoId = initialVideo?.id || `video-${Date.now()}`;
    const selectedCatObj = CATEGORY_OPTIONS.find((c) => c.id === category) || CATEGORY_OPTIONS[0];
    const mins = Math.max(1, Number(durationMinutes) || 15);
    const durationFormatted = `${mins}:00`;

    // Ensure we register the objectUrl in our global video blob registry for reliable playback
    if (finalVideoUrl.startsWith('blob:')) {
      registerVideoBlob(videoId, finalVideoUrl);
    } else if (!finalVideoUrl) {
      finalVideoUrl = FALLBACK_HEALTH_VIDEOS[0].url;
    }

    const videoData: HealthVideo = {
      id: videoId,
      title: title.trim(),
      slug: title.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      description: description.trim(),
      videoUrl: finalVideoUrl,
      thumbnailUrl: finalThumbnailUrl,
      category: category,
      categoryLabel: selectedCatObj.label,
      durationMinutes: mins,
      durationFormatted: durationFormatted,
      instructor: initialVideo?.instructor || {
        name: 'Community Contributor',
        role: 'Health Researcher & Wellness Practitioner',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
        credentials: 'Evidence-Based Longevity Contributor',
      },
      publishedAt: initialVideo?.publishedAt || 'Just now',
      viewsCount: initialVideo?.viewsCount || 1,
      likesCount: initialVideo?.likesCount || 0,
      tags: tags.length > 0 ? tags : ['Health', 'Masterclass', 'Wellness'],
      level: initialVideo?.level || 'All Levels',
      status: visibility === 'public' ? 'published' : 'draft',
      isUserUploaded: true,
      comments: initialVideo?.comments || [],
    };

    setTimeout(() => {
      if (isEditing && onUpdateVideo) {
        onUpdateVideo(videoData);
      } else {
        onUploadVideo(videoData);
      }

      setIsSubmitting(false);

      if (visibility === 'public') {
        confetti({
          particleCount: 50,
          spread: 70,
          origin: { y: 0.7 },
          colors: ['#34d399', '#10b981', '#059669', '#38bdf8'],
        });
      }

      onClose();
    }, 250);
  };

  const parsedSource = parseVideoSource(videoUrl);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      
      <div 
        id="upload-video-card"
        className="relative w-full max-w-3xl max-h-[92vh] overflow-y-auto bg-neutral-950 border border-neutral-800 rounded-3xl shadow-2xl flex flex-col my-auto"
      >
        {/* TOP HEADER: ONLY BACK BUTTON & TITLE */}
        <div className="sticky top-0 z-30 bg-neutral-950/95 backdrop-blur-md px-6 py-4 border-b border-neutral-800 flex items-center justify-between">
          <button
            id="btn-back-upload-video"
            type="button"
            onClick={onClose}
            className="flex items-center gap-2 text-xs font-semibold text-neutral-300 hover:text-emerald-400 transition-colors cursor-pointer group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Back</span>
          </button>

          <h2 className="text-sm sm:text-base font-bold text-white font-display">
            {initialVideo ? 'Edit Video' : 'Upload Video'}
          </h2>

          <div className="w-12" /> {/* Spacer */}
        </div>

        {/* FORM CONTENT */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">

          {/* Validation Alert */}
          {validationError && (
            <div className="p-3.5 rounded-2xl bg-rose-950/70 border border-rose-800/50 text-rose-300 text-xs flex items-center gap-2.5 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{validationError}</span>
            </div>
          )}

          {/* 1. CHOOSE FILE TO UPLOAD VIDEOS & URL TO UPLOAD VIDEOS */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-neutral-300 flex items-center gap-1.5">
                <VideoIcon className="w-3.5 h-3.5 text-emerald-400" />
                <span>1. Video Source *</span>
              </label>

              {/* Source Mode Switcher */}
              <div className="flex items-center bg-neutral-900 p-1 rounded-xl border border-neutral-800 text-xs">
                <button
                  type="button"
                  id="btn-tab-upload-file"
                  onClick={() => setSourceMode('upload')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
                    sourceMode === 'upload'
                      ? 'bg-emerald-950 text-emerald-300 font-bold border border-emerald-500/40'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  <Upload className="w-3 h-3" />
                  <span>Choose File</span>
                </button>

                <button
                  type="button"
                  id="btn-tab-upload-url"
                  onClick={() => setSourceMode('url')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
                    sourceMode === 'url'
                      ? 'bg-emerald-950 text-emerald-300 font-bold border border-emerald-500/40'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  <LinkIcon className="w-3 h-3" />
                  <span>Video URL</span>
                </button>
              </div>
            </div>

            {/* Mode A: Choose File */}
            {sourceMode === 'upload' ? (
              <div
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleFileDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2 ${
                  isDragging
                    ? 'border-emerald-400 bg-emerald-950/20'
                    : 'border-neutral-800 hover:border-emerald-500/50 bg-neutral-900/40 hover:bg-neutral-900/80'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="video/mp4,video/webm,video/quicktime,video/mkv,video/ogg"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <div className="w-10 h-10 rounded-2xl bg-neutral-900 border border-neutral-800 flex items-center justify-center text-emerald-400">
                  <FileVideo className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <p className="text-xs sm:text-sm font-semibold text-white">
                    {videoFile ? videoFile.name : 'Click to choose video file or drag & drop'}
                  </p>
                  <p className="text-[11px] text-neutral-500">
                    Supports MP4, WebM, MOV, OGG (Full HD Playback)
                  </p>
                </div>
              </div>
            ) : (
              /* Mode B: Video URL */
              <div className="space-y-2">
                <div className="relative">
                  <LinkIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                  <input
                    id="input-video-source-url"
                    type="url"
                    value={videoUrl}
                    onChange={(e) => handleUrlChange(e.target.value)}
                    placeholder="Paste YouTube, Vimeo, Loom, or direct MP4 link (e.g. https://www.youtube.com/watch?v=...)"
                    className="w-full pl-10 pr-4 py-3 rounded-2xl bg-neutral-900 border border-neutral-800 text-xs sm:text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>
              </div>
            )}

            {/* Live Video Preview Box */}
            {videoUrl && (
              <div className="relative aspect-video rounded-2xl overflow-hidden bg-neutral-900 border border-neutral-800 shadow-md">
                {parsedSource.isIframe && parsedSource.embedUrl ? (
                  <iframe
                    src={parsedSource.embedUrl}
                    title="Video preview"
                    className="w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <video
                    src={videoUrl}
                    controls
                    className="w-full h-full object-contain bg-black"
                  />
                )}
              </div>
            )}
          </div>

          {/* 2. NEW FEATURE: VIDEO THUMBNAIL (CHOOSE FILE & URL) */}
          <div className="space-y-3.5 p-4 sm:p-5 rounded-2xl bg-neutral-900/40 border border-neutral-800/80">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-neutral-200 flex items-center gap-1.5">
                  <ImageIcon className="w-3.5 h-3.5 text-emerald-400" />
                  <span>2. Video Thumbnail *</span>
                  <span className="text-[10px] lowercase font-normal px-2 py-0.5 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-800/40">
                    File &amp; URL supported
                  </span>
                </label>
                <p className="text-[11px] text-neutral-400 mt-0.5">
                  Add a custom 16:9 thumbnail for your video card and player cover.
                </p>
              </div>

              {/* Thumbnail Mode Switcher: Choose File vs URL */}
              <div className="flex items-center bg-neutral-900 p-1 rounded-xl border border-neutral-800 text-xs self-start sm:self-auto">
                <button
                  type="button"
                  id="btn-tab-thumbnail-file"
                  onClick={() => setThumbnailMode('upload')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
                    thumbnailMode === 'upload'
                      ? 'bg-emerald-950 text-emerald-300 font-bold border border-emerald-500/40 shadow-sm'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  <Upload className="w-3 h-3" />
                  <span>Choose File</span>
                </button>

                <button
                  type="button"
                  id="btn-tab-thumbnail-url"
                  onClick={() => setThumbnailMode('url')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
                    thumbnailMode === 'url'
                      ? 'bg-emerald-950 text-emerald-300 font-bold border border-emerald-500/40 shadow-sm'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  <LinkIcon className="w-3 h-3" />
                  <span>Image URL</span>
                </button>
              </div>
            </div>

            {/* Thumbnail Input Controls */}
            {thumbnailMode === 'upload' ? (
              /* Option A: Choose File / Drag & Drop Image */
              <div
                id="thumbnail-dropzone"
                onDragOver={(e) => { e.preventDefault(); setIsThumbnailDragging(true); }}
                onDragLeave={() => setIsThumbnailDragging(false)}
                onDrop={handleThumbnailFileDrop}
                onClick={() => thumbnailFileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-5 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2 ${
                  isThumbnailDragging
                    ? 'border-emerald-400 bg-emerald-950/30'
                    : 'border-neutral-800 hover:border-emerald-500/50 bg-neutral-900/60 hover:bg-neutral-900/90'
                }`}
              >
                <input
                  ref={thumbnailFileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/jpg,image/webp,image/gif"
                  onChange={handleThumbnailFileChange}
                  className="hidden"
                />
                <div className="w-10 h-10 rounded-2xl bg-neutral-900 border border-neutral-800 flex items-center justify-center text-emerald-400">
                  <FileImage className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <p className="text-xs sm:text-sm font-semibold text-white">
                    {thumbnailFile ? thumbnailFile.name : 'Click to choose image file or drag & drop'}
                  </p>
                  <p className="text-[11px] text-neutral-500">
                    Supports PNG, JPG, WEBP, GIF (Recommended ratio 16:9, max 15MB)
                  </p>
                </div>
              </div>
            ) : (
              /* Option B: Image URL Input */
              <div className="space-y-2">
                <div className="relative">
                  <LinkIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                  <input
                    id="input-video-thumbnail-url"
                    type="url"
                    value={thumbnailUrl}
                    onChange={(e) => handleThumbnailUrlChange(e.target.value)}
                    placeholder="Paste direct image URL (e.g. https://images.unsplash.com/...)"
                    className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-neutral-900 border border-neutral-800 text-xs sm:text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>
              </div>
            )}

            {/* Aesthetic Preset Thumbnails Gallery */}
            <div className="space-y-1.5 pt-1">
              <div className="flex items-center justify-between text-[11px] text-neutral-400">
                <span className="flex items-center gap-1">
                  <Layers className="w-3 h-3 text-emerald-400" />
                  <span>Or pick from Clinical &amp; Science Presets:</span>
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
                {HEALTH_VIDEO_PRESET_THUMBNAILS.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectPresetThumbnail(preset)}
                    className={`relative rounded-xl overflow-hidden aspect-video border group transition-all cursor-pointer ${
                      thumbnailUrl === preset.url
                        ? 'border-emerald-400 ring-2 ring-emerald-500/30 scale-[1.02]'
                        : 'border-neutral-800 hover:border-neutral-600 opacity-70 hover:opacity-100'
                    }`}
                    title={preset.title}
                  >
                    <img
                      src={preset.url}
                      alt={preset.title}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-1">
                      <span className="text-[9px] font-medium text-white truncate w-full leading-tight">
                        {preset.title.split('&')[0]}
                      </span>
                    </div>
                    {thumbnailUrl === preset.url && (
                      <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-emerald-500 text-neutral-950 flex items-center justify-center shadow-md">
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Thumbnail Live Preview Card */}
            {thumbnailUrl && (
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 p-3 rounded-2xl bg-neutral-950/80 border border-neutral-800">
                <div className="relative aspect-video w-full sm:w-36 rounded-xl overflow-hidden bg-neutral-900 border border-neutral-800 shrink-0">
                  <img
                    src={thumbnailUrl}
                    alt="Video thumbnail preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      // Fallback if URL is invalid or broken
                      (e.target as HTMLImageElement).src = FALLBACK_HEALTH_VIDEOS[0].thumbnail;
                    }}
                    referrerPolicy="no-referrer"
                  />
                  <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-black/80 text-[9px] font-mono text-emerald-300">
                    16:9 HD
                  </span>
                </div>
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white">Active Thumbnail Preview</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-neutral-900 border border-neutral-800 text-emerald-400 font-mono truncate max-w-[180px]">
                      {thumbnailSourceLabel}
                    </span>
                  </div>
                  <p className="text-[11px] text-neutral-400 truncate">
                    This artwork will represent your masterclass in all video grids, cards, and player headers.
                  </p>
                </div>
                <div className="flex items-center gap-2 self-end sm:self-center">
                  <button
                    type="button"
                    onClick={() => {
                      if (thumbnailMode === 'upload') {
                        thumbnailFileInputRef.current?.click();
                      } else {
                        const input = document.getElementById('input-video-thumbnail-url');
                        input?.focus();
                      }
                    }}
                    className="px-3 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 hover:text-white text-xs font-medium transition-colors cursor-pointer"
                  >
                    Change
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setThumbnailUrl(FALLBACK_HEALTH_VIDEOS[0].thumbnail);
                      setThumbnailFile(null);
                      setThumbnailSourceLabel('Default Cover');
                    }}
                    className="p-1.5 rounded-xl text-neutral-500 hover:text-rose-400 hover:bg-neutral-800 transition-colors cursor-pointer"
                    title="Reset to default cover"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* 3. VIDEO TITLE */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-neutral-300 flex items-center justify-between">
              <span>3. Title *</span>
              <span className="text-[11px] font-mono text-neutral-500">{title.length}/140</span>
            </label>
            <input
              id="input-video-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Mitochondrial Health and Cellular Autophagy Masterclass"
              maxLength={140}
              className="w-full px-4 py-3 rounded-2xl bg-neutral-900 border border-neutral-800 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500 transition-colors"
            />
          </div>

          {/* 4. TAGS & HASHTAGS */}
          <div className="space-y-2.5">
            <label className="text-xs font-bold uppercase tracking-wider text-neutral-300 flex items-center gap-1.5">
              <Hash className="w-3.5 h-3.5 text-emerald-400" />
              <span>4. Tag &amp; Hashtag</span>
            </label>

            {/* Display active tags */}
            <div className="flex flex-wrap items-center gap-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-medium bg-neutral-900 border border-neutral-800 text-emerald-300"
                >
                  <span>#{tag}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="text-neutral-500 hover:text-rose-400 cursor-pointer"
                    title={`Remove #${tag}`}
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>

            {/* Input tag */}
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <TagIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                <input
                  id="input-video-tags"
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleTagKeyDown}
                  placeholder="Type tag/hashtag and press Enter (e.g. Zone2, Longevity, Nutrition)"
                  className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-neutral-900 border border-neutral-800 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>
              <button
                type="button"
                onClick={() => handleAddTag(tagInput)}
                className="px-4 py-2.5 rounded-2xl bg-neutral-800 hover:bg-neutral-700 text-white font-semibold text-xs transition-colors cursor-pointer"
              >
                Add Tag
              </button>
            </div>

            {/* Quick suggested hashtags */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px] text-neutral-400 scrollbar-none">
              <span className="shrink-0 text-neutral-500">Suggestions:</span>
              {['Longevity', 'Biohacking', 'Zone2Cardio', 'Nutrition', 'Neuroscience', 'Physiology'].map((sug) => (
                <button
                  key={sug}
                  type="button"
                  onClick={() => handleAddTag(sug)}
                  className="px-2 py-0.5 rounded-md bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-emerald-300 hover:border-emerald-500/30 transition-colors cursor-pointer whitespace-nowrap"
                >
                  +{sug}
                </button>
              ))}
            </div>
          </div>

          {/* 5. CATEGORY */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-neutral-300">
              5. Category *
            </label>
            <select
              id="select-video-category"
              value={category}
              onChange={(e) => setCategory(e.target.value as BlogCategory)}
              className="w-full px-4 py-3 rounded-2xl bg-neutral-900 border border-neutral-800 text-xs sm:text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors cursor-pointer"
            >
              {CATEGORY_OPTIONS.map((cat) => (
                <option key={cat.id} value={cat.id} className="bg-neutral-900 text-white">
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          {/* 6. DESCRIPTION */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-neutral-300 flex items-center justify-between">
              <span>6. Description *</span>
              <span className="text-[11px] font-mono text-neutral-500">
                {description.trim().split(/\s+/).filter(Boolean).length} words
              </span>
            </label>
            <textarea
              id="textarea-video-description"
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the clinical findings, key protocol guidelines, and takeaways..."
              className="w-full px-4 py-3 rounded-2xl bg-neutral-900 border border-neutral-800 text-xs sm:text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500 transition-colors resize-y leading-relaxed"
            />
          </div>

          {/* 7. VISIBILITY */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-neutral-300">
              7. Visibility *
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Public Option */}
              <button
                type="button"
                id="visibility-option-public"
                onClick={() => setVisibility('public')}
                className={`p-4 rounded-2xl border flex items-center gap-3 transition-all cursor-pointer text-left ${
                  visibility === 'public'
                    ? 'bg-emerald-950/60 border-emerald-500/60 text-emerald-300 shadow-md'
                    : 'bg-neutral-900/60 border-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-900'
                }`}
              >
                <div className={`p-2.5 rounded-xl ${visibility === 'public' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-neutral-800 text-neutral-400'}`}>
                  <Globe className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Public</h4>
                  <p className="text-[11px] text-neutral-400">Available to all users across the platform</p>
                </div>
              </button>

              {/* Private / Draft Option */}
              <button
                type="button"
                id="visibility-option-draft"
                onClick={() => setVisibility('draft')}
                className={`p-4 rounded-2xl border flex items-center gap-3 transition-all cursor-pointer text-left ${
                  visibility === 'draft'
                    ? 'bg-amber-950/60 border-amber-500/60 text-amber-300 shadow-md'
                    : 'bg-neutral-900/60 border-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-900'
                }`}
              >
                <div className={`p-2.5 rounded-xl ${visibility === 'draft' ? 'bg-amber-500/20 text-amber-400' : 'bg-neutral-800 text-neutral-400'}`}>
                  <Lock className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Draft / Private</h4>
                  <p className="text-[11px] text-neutral-400">Only visible to you until published</p>
                </div>
              </button>
            </div>
          </div>

          {/* BOTTOM ACTION BUTTONS */}
          <div className="pt-4 border-t border-neutral-800 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-300 hover:text-white text-xs font-semibold transition-colors cursor-pointer"
            >
              Cancel
            </button>

            <button
              id="btn-upload-video-submit"
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 text-neutral-950 font-bold text-xs shadow-lg shadow-emerald-500/20 transition-all hover:scale-[1.02] cursor-pointer disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5 text-neutral-950" />
              <span>{isEditing ? 'Update Video' : 'Upload Video'}</span>
            </button>
          </div>

        </form>

      </div>

    </div>
  );
};
