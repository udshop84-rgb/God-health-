import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowLeft,
  Upload, 
  Link as LinkIcon, 
  Tag as TagIcon, 
  Hash, 
  X, 
  Check, 
  AlertCircle, 
  Image as ImageIcon,
  Send,
  FileText
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { BlogPost, BlogCategory } from '../types';
import { HEALTH_CATEGORIES_METADATA } from '../data/blogData';

interface CreateBlogPostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreatePost: (post: BlogPost) => void;
  onUpdatePost?: (post: BlogPost) => void;
  initialPost?: BlogPost | null;
}

const AVAILABLE_CATEGORIES = HEALTH_CATEGORIES_METADATA.filter((c) => c.id !== 'all');

const DEFAULT_PRESET_THUMBNAILS = [
  {
    url: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1200&q=85',
    label: 'Cellular & Fasting'
  },
  {
    url: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1200&q=85',
    label: 'Longevity Nutrition'
  },
  {
    url: 'https://images.unsplash.com/photo-1511295742362-92c96b124e52?auto=format&fit=crop&w=1200&q=85',
    label: 'Deep Sleep & Recovery'
  },
  {
    url: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=1200&q=85',
    label: 'Zone 2 & Biomarkers'
  },
  {
    url: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=1200&q=85',
    label: 'Mindfulness & Vagus'
  },
  {
    url: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=1200&q=85',
    label: 'Clinical Science'
  }
];

export const CreateBlogPostModal: React.FC<CreateBlogPostModalProps> = ({
  isOpen,
  onClose,
  onCreatePost,
  onUpdatePost,
  initialPost,
}) => {
  // 1. Article Title
  const [title, setTitle] = useState('');

  // 2. Category
  const [category, setCategory] = useState<BlogCategory>('longevity');

  // 3. Tags / Hashtags
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');

  // 4. Thumbnail (Choose File upload or URL)
  const [thumbnailType, setThumbnailType] = useState<'upload' | 'url'>('upload');
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 5. Description or Content
  const [content, setContent] = useState('');

  // Status & Validation
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Populate initial post when editing
  useEffect(() => {
    if (initialPost) {
      setTitle(initialPost.title || '');
      setCategory(initialPost.category || 'longevity');
      setTags(initialPost.tags || []);
      setThumbnailUrl(initialPost.coverImage || '');
      setThumbnailType(initialPost.coverImage?.startsWith('data:') ? 'upload' : 'url');
      setContent(initialPost.content || initialPost.excerpt || '');
    } else {
      resetForm();
    }
    setValidationError(null);
  }, [initialPost, isOpen]);

  const resetForm = () => {
    setTitle('');
    setCategory('longevity');
    setTags(['Health', 'Wellness', 'Longevity']);
    setTagInput('');
    setThumbnailType('upload');
    setThumbnailUrl(DEFAULT_PRESET_THUMBNAILS[0].url);
    setContent('');
    setValidationError(null);
  };

  if (!isOpen) return null;

  // Handle Tag / Hashtag addition
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

  // Handle File Upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processImageFile(file);
    }
  };

  const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processImageFile(file);
    }
  };

  const processImageFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setValidationError('Please select a valid image file (PNG, JPG, WEBP).');
      return;
    }
    if (file.size > 15 * 1024 * 1024) {
      setValidationError('Image size must be under 15MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setThumbnailUrl(event.target.result as string);
        setValidationError(null);
      }
    };
    reader.readAsDataURL(file);
  };

  // Save / Publish Handler
  const handleSubmit = (status: 'published' | 'draft') => {
    if (!title.trim()) {
      setValidationError('Please enter an article title.');
      return;
    }
    if (!content.trim()) {
      setValidationError('Please write article description or content.');
      return;
    }
    if (!thumbnailUrl.trim()) {
      setValidationError('Please select or upload a thumbnail image.');
      return;
    }

    setValidationError(null);
    setIsSubmitting(true);

    const categoryObj = AVAILABLE_CATEGORIES.find((c) => c.id === category) || AVAILABLE_CATEGORIES[0];
    const cleanExcerpt = content.slice(0, 180).replace(/[#*`]/g, '').trim() + (content.length > 180 ? '...' : '');

    const postPayload: BlogPost = {
      id: initialPost?.id || `user-post-${Date.now()}`,
      title: title.trim(),
      slug: title.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      excerpt: cleanExcerpt,
      content: content.trim(),
      coverImage: thumbnailUrl.trim(),
      category: category,
      categoryLabel: categoryObj?.label || 'Health & Longevity',
      tags: tags.length > 0 ? tags : ['Health', 'Wellness'],
      author: initialPost?.author || {
        id: 'user-author-current',
        name: 'Community Contributor',
        role: 'Health Researcher',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
        handle: '@contributor'
      },
      publishedAt: initialPost?.publishedAt || 'Just now',
      readTimeMinutes: Math.max(1, Math.ceil(content.trim().split(/\s+/).length / 200)),
      status: status,
      clapsCount: initialPost?.clapsCount || 0,
      viewsCount: initialPost?.viewsCount || 1,
      comments: initialPost?.comments || [],
      isUserUploaded: true,
      updatedAt: 'Just now'
    };

    setTimeout(() => {
      if (initialPost && onUpdatePost) {
        onUpdatePost(postPayload);
      } else {
        onCreatePost(postPayload);
      }

      setIsSubmitting(false);

      if (status === 'published') {
        confetti({
          particleCount: 50,
          spread: 70,
          origin: { y: 0.7 },
          colors: ['#34d399', '#10b981', '#059669', '#38bdf8']
        });
      }

      onClose();
    }, 300);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      
      <div 
        id="create-blog-post-card"
        className="relative w-full max-w-3xl max-h-[92vh] overflow-y-auto bg-neutral-950 border border-neutral-800 rounded-3xl shadow-2xl flex flex-col my-auto"
      >
        {/* TOP HEADER: ONLY BACK ICON & TITLE */}
        <div className="sticky top-0 z-30 bg-neutral-950/95 backdrop-blur-md px-6 py-4 border-b border-neutral-800 flex items-center justify-between">
          <button
            id="btn-back-create-post"
            type="button"
            onClick={onClose}
            className="flex items-center gap-2 text-xs font-semibold text-neutral-300 hover:text-emerald-400 transition-colors cursor-pointer group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Back</span>
          </button>

          <h2 className="text-sm sm:text-base font-bold text-white font-display">
            {initialPost ? 'Edit Blog Post' : 'Create Blog Post'}
          </h2>

          <div className="w-12" /> {/* Balancing spacer */}
        </div>

        {/* FORM CONTENT */}
        <div className="p-6 sm:p-8 space-y-6">

          {/* Validation Alert */}
          {validationError && (
            <div className="p-3.5 rounded-2xl bg-rose-950/70 border border-rose-800/50 text-rose-300 text-xs flex items-center gap-2.5 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{validationError}</span>
            </div>
          )}

          {/* 1. ARTICLE TITLE */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-neutral-300 flex items-center justify-between">
              <span>Article Title *</span>
              <span className="text-[11px] font-mono text-neutral-500">{title.length}/140</span>
            </label>
            <input
              id="input-post-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., The Science of Cold Exposure and Mitochondrial Renewal..."
              maxLength={140}
              className="w-full px-4 py-3 rounded-2xl bg-neutral-900 border border-neutral-800 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500 transition-colors"
            />
          </div>

          {/* 2. CATEGORY SELECTION */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-neutral-300">
              Category *
            </label>
            <select
              id="select-post-category"
              value={category}
              onChange={(e) => setCategory(e.target.value as BlogCategory)}
              className="w-full px-4 py-3 rounded-2xl bg-neutral-900 border border-neutral-800 text-xs sm:text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors cursor-pointer"
            >
              {AVAILABLE_CATEGORIES.map((cat) => (
                <option key={cat.id} value={cat.id} className="bg-neutral-900 text-white">
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          {/* 3. TAGS & HASHTAGS */}
          <div className="space-y-2.5">
            <label className="text-xs font-bold uppercase tracking-wider text-neutral-300 flex items-center gap-1.5">
              <Hash className="w-3.5 h-3.5 text-emerald-400" />
              <span>Tags &amp; Hashtags</span>
            </label>

            {/* Tags Display Badges */}
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

            {/* Tag Input */}
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <TagIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                <input
                  id="input-post-tags"
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleTagKeyDown}
                  placeholder="Type tag or hashtag (e.g. Autophagy, Longevity) and press Enter"
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

            {/* Suggested Hashtags */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px] text-neutral-400 scrollbar-none">
              <span className="shrink-0 text-neutral-500">Suggestions:</span>
              {['Longevity', 'Nutrition', 'Autophagy', 'SleepScience', 'Biohacking', 'MentalHealth'].map((sug) => (
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

          {/* 4. THUMBNAIL SELECTION & SAME-TO-SAME SIZE PREVIEW */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-neutral-300 flex items-center gap-1.5">
                  <ImageIcon className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Cover Image / Thumbnail (Standard 16:9 Ratio) *</span>
                </label>
                <p className="text-[11px] text-neutral-500">
                  Article images automatically scale and center to the exact same 16:9 size across all screens.
                </p>
              </div>

              {/* Upload vs URL Tabs */}
              <div className="flex items-center bg-neutral-900 p-1 rounded-xl border border-neutral-800 text-xs self-start sm:self-auto">
                <button
                  type="button"
                  onClick={() => setThumbnailType('upload')}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-medium transition-all cursor-pointer ${
                    thumbnailType === 'upload'
                      ? 'bg-emerald-950 text-emerald-300 font-bold border border-emerald-500/40'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  <Upload className="w-3 h-3" />
                  <span>Upload File</span>
                </button>

                <button
                  type="button"
                  onClick={() => setThumbnailType('url')}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-medium transition-all cursor-pointer ${
                    thumbnailType === 'url'
                      ? 'bg-emerald-950 text-emerald-300 font-bold border border-emerald-500/40'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  <LinkIcon className="w-3 h-3" />
                  <span>Image URL</span>
                </button>
              </div>
            </div>

            {/* Quick 1-Click Curated Presets */}
            <div className="space-y-1.5 bg-neutral-900/40 border border-neutral-800/80 p-3 rounded-2xl">
              <div className="flex items-center justify-between text-[11px] text-neutral-400">
                <span className="font-semibold text-neutral-300">Curated 16:9 Cover Presets:</span>
                <span className="text-[10px] text-neutral-500">Click to apply instantly</span>
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 pt-1">
                {DEFAULT_PRESET_THUMBNAILS.map((preset, idx) => {
                  const isSelected = thumbnailUrl === preset.url;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setThumbnailUrl(preset.url);
                        setValidationError(null);
                      }}
                      className={`relative aspect-[16/9] rounded-xl overflow-hidden border transition-all cursor-pointer group ${
                        isSelected
                          ? 'border-emerald-400 ring-2 ring-emerald-500/30'
                          : 'border-neutral-800 hover:border-neutral-700 opacity-70 hover:opacity-100'
                      }`}
                      title={preset.label}
                    >
                      <img
                        src={preset.url}
                        alt={preset.label}
                        className="w-full h-full object-cover object-center"
                        referrerPolicy="no-referrer"
                      />
                      {isSelected && (
                        <div className="absolute inset-0 bg-emerald-950/60 flex items-center justify-center">
                          <Check className="w-4 h-4 text-emerald-300 stroke-[3]" />
                        </div>
                      )}
                      <span className="absolute bottom-0 inset-x-0 bg-black/80 backdrop-blur-xs text-[9px] text-neutral-200 text-center py-0.5 truncate px-1">
                        {preset.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Mode A: Choose File / Drag & Drop Upload */}
            {thumbnailType === 'upload' ? (
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
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <div className="w-10 h-10 rounded-2xl bg-neutral-900 border border-neutral-800 flex items-center justify-center text-emerald-400">
                  <Upload className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <p className="text-xs sm:text-sm font-semibold text-white">
                    Click to browse or drag &amp; drop an image
                  </p>
                  <p className="text-[11px] text-neutral-500">
                    Auto-fitted to standard 16:9 display size • JPG, PNG, WEBP (Max 15MB)
                  </p>
                </div>
              </div>
            ) : (
              /* Mode B: Direct Image URL */
              <div className="space-y-2">
                <div className="relative">
                  <LinkIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                  <input
                    id="input-thumbnail-url"
                    type="url"
                    value={thumbnailUrl}
                    onChange={(e) => setThumbnailUrl(e.target.value)}
                    placeholder="Paste image URL (e.g., https://images.unsplash.com/...)"
                    className="w-full pl-10 pr-4 py-3 rounded-2xl bg-neutral-900 border border-neutral-800 text-xs sm:text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>
              </div>
            )}

            {/* Thumbnail Live Preview - Strict 16:9 Same-Size Display */}
            {thumbnailUrl && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-neutral-400">
                  <span className="font-semibold text-white flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Exact Published Card Size Preview (16:9)</span>
                  </span>
                  <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800/60">
                    Same-to-Same Sizing Active
                  </span>
                </div>

                <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden bg-neutral-950 border border-neutral-800 shadow-xl group">
                  <img
                    src={thumbnailUrl}
                    alt="Thumbnail Preview"
                    className="w-full h-full object-cover object-center"
                    referrerPolicy="no-referrer"
                    onError={() => setValidationError('Failed to load image. Please check the file or URL.')}
                  />
                  
                  {/* Category Pill Overlay matching published cards */}
                  <div className="absolute top-3 left-3 px-2.5 py-0.5 rounded-md text-[10px] uppercase font-bold tracking-wider bg-black/80 backdrop-blur-md text-emerald-300 border border-emerald-500/40">
                    {category}
                  </div>

                  {/* Read time pill overlay */}
                  <div className="absolute bottom-3 right-3 px-2 py-0.5 rounded bg-black/80 backdrop-blur-md text-[11px] font-mono text-neutral-300">
                    {Math.max(1, Math.ceil((content.trim().split(/\s+/).filter(Boolean).length || 1) / 200))} min read
                  </div>

                  {/* Hover Controls */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        if (thumbnailType === 'upload') {
                          fileInputRef.current?.click();
                        } else {
                          setThumbnailUrl('');
                        }
                      }}
                      className="px-3.5 py-2 rounded-xl bg-neutral-900/95 text-white text-xs font-semibold hover:bg-neutral-800 border border-neutral-700 cursor-pointer shadow-lg"
                    >
                      Replace Image
                    </button>
                    <button
                      type="button"
                      onClick={() => setThumbnailUrl('')}
                      className="p-2 rounded-xl bg-rose-950/90 text-rose-300 text-xs font-semibold hover:bg-rose-900 border border-rose-800/80 cursor-pointer shadow-lg"
                      title="Remove Image"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 5. DESCRIPTION OR CONTENT */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-neutral-300 flex items-center justify-between">
              <span>Description / Content *</span>
              <span className="text-[11px] font-mono text-neutral-500">
                {content.trim().split(/\s+/).filter(Boolean).length} words
              </span>
            </label>
            <textarea
              id="textarea-post-content"
              rows={9}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your article description, key health findings, protocols, or full story content here..."
              className="w-full px-4 py-3 rounded-2xl bg-neutral-900 border border-neutral-800 text-xs sm:text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500 transition-colors resize-y leading-relaxed font-sans"
            />
          </div>

        </div>

        {/* BOTTOM ACTION BUTTONS */}
        <div className="sticky bottom-0 z-30 bg-neutral-950/95 backdrop-blur-md px-6 py-4 border-t border-neutral-800 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => handleSubmit('draft')}
            disabled={isSubmitting}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-300 hover:text-white text-xs font-semibold transition-colors cursor-pointer disabled:opacity-50"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Save Draft</span>
          </button>

          <button
            id="btn-publish-post-submit"
            type="button"
            onClick={() => handleSubmit('published')}
            disabled={isSubmitting}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 text-neutral-950 font-bold text-xs shadow-lg shadow-emerald-500/20 transition-all hover:scale-[1.02] cursor-pointer disabled:opacity-50"
          >
            <Send className="w-3.5 h-3.5 text-neutral-950" />
            <span>{initialPost ? 'Update Article' : 'Publish Article'}</span>
          </button>
        </div>

      </div>

    </div>
  );
};
