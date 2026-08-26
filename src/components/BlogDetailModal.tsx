import React, { useState, useEffect } from 'react';
import { 
  X, 
  Heart, 
  Bookmark, 
  Share2, 
  Clock, 
  Calendar, 
  Tag, 
  MessageSquare, 
  Send, 
  Check, 
  Copy, 
  ArrowLeft, 
  BookOpen, 
  Type, 
  Printer, 
  Edit3, 
  Trash2, 
  ExternalLink, 
  AlertTriangle 
} from 'lucide-react';
import Markdown from 'react-markdown';
import confetti from 'canvas-confetti';
import { BlogPost, BlogComment } from '../types';

interface BlogDetailModalProps {
  post: BlogPost | null;
  isOpen: boolean;
  onClose: () => void;
  isSaved: boolean;
  onToggleSave: (postId: string) => void;
  onClap: (postId: string) => void;
  onAddComment: (postId: string, comment: Omit<BlogComment, 'id' | 'createdAt' | 'likes'>) => void;
  onOpenOtherPost: (post: BlogPost) => void;
  onEditPost?: (post: BlogPost) => void;
  onDeletePost?: (postId: string) => void;
  allPosts: BlogPost[];
}

export const BlogDetailModal: React.FC<BlogDetailModalProps> = ({
  post,
  isOpen,
  onClose,
  isSaved,
  onToggleSave,
  onClap,
  onAddComment,
  onOpenOtherPost,
  onEditPost,
  onDeletePost,
  allPosts,
}) => {
  const [fontSize, setFontSize] = useState<'sm' | 'base' | 'lg'>('base');
  const [copiedLink, setCopiedLink] = useState(false);
  const [isShareMenuOpen, setIsShareMenuOpen] = useState(false);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  const [commentName, setCommentName] = useState('');
  const [commentText, setCommentText] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [commentSuccess, setCommentSuccess] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    setCommentName('');
    setCommentText('');
    setCommentSuccess(false);
    setScrollProgress(0);
    setIsShareMenuOpen(false);
    setIsConfirmDeleteOpen(false);
  }, [post?.id]);

  if (!isOpen || !post) return null;

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    const totalHeight = target.scrollHeight - target.clientHeight;
    if (totalHeight > 0) {
      const progress = (target.scrollTop / totalHeight) * 100;
      setScrollProgress(progress);
    }
  };

  const handleClapClick = () => {
    onClap(post.id);
    confetti({
      particleCount: 30,
      spread: 60,
      origin: { y: 0.8 },
      colors: ['#34d399', '#10b981', '#f43f5e', '#fbbf24']
    });
  };

  const handleCopyLink = () => {
    const url = `${window.location.origin}/journal/${post.slug || post.id}`;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleShareTwitter = () => {
    const text = encodeURIComponent(`"${post.title}" via Health & Longevity`);
    const url = encodeURIComponent(`${window.location.origin}/journal/${post.slug || post.id}`);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank');
  };

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(`Read this article: "${post.title}" ${window.location.origin}/journal/${post.slug || post.id}`);
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  const handleShareLinkedIn = () => {
    const url = encodeURIComponent(`${window.location.origin}/journal/${post.slug || post.id}`);
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, '_blank');
  };

  const handlePrintPDF = () => {
    window.print();
  };

  const handleDelete = () => {
    if (onDeletePost) {
      onDeletePost(post.id);
      onClose();
    }
  };

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentName.trim() || !commentText.trim()) return;

    setIsSubmittingComment(true);
    setTimeout(() => {
      onAddComment(post.id, {
        authorName: commentName.trim(),
        content: commentText.trim(),
      });
      setIsSubmittingComment(false);
      setCommentSuccess(true);
      setCommentText('');
    }, 400);
  };

  const getFontSizeClass = () => {
    switch (fontSize) {
      case 'sm':
        return 'text-sm leading-relaxed';
      case 'lg':
        return 'text-lg leading-relaxed';
      default:
        return 'text-base leading-relaxed';
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-neutral-950/90 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 lg:p-6 animate-in fade-in duration-200 print:p-0 print:bg-white print:text-black">
      
      {/* Top Reading Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-neutral-900 z-50 print:hidden">
        <div
          className="h-full bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-500 transition-all duration-150"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Main Modal Window */}
      <div
        id="blog-detail-modal-card"
        onScroll={handleScroll}
        className="relative w-full max-w-4xl max-h-[94vh] overflow-y-auto bg-neutral-950 border border-neutral-800 rounded-3xl shadow-2xl flex flex-col my-auto print:max-h-none print:border-none print:shadow-none print:bg-white print:rounded-none"
      >
        
        {/* Sticky Action Toolbar */}
        <div className="sticky top-0 z-30 bg-neutral-950/95 backdrop-blur-md px-6 py-4 border-b border-neutral-800 flex items-center justify-between print:hidden">
          
          <button
            id="modal-back-btn"
            onClick={onClose}
            className="flex items-center gap-2 text-xs font-semibold text-neutral-300 hover:text-emerald-400 transition-colors cursor-pointer group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="hidden sm:inline">Back</span>
          </button>

          {/* Action Suite: Edit, Delete, Bookmark, Favorite, Share, Print, Close */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            
            {/* Font Size Adjuster */}
            <div className="hidden sm:flex items-center gap-1 bg-neutral-900 p-1 rounded-xl border border-neutral-800 text-xs">
              <Type className="w-3.5 h-3.5 text-neutral-400 ml-1.5 mr-0.5" />
              <button
                onClick={() => setFontSize('sm')}
                className={`px-2 py-0.5 rounded-lg font-mono text-[11px] cursor-pointer ${fontSize === 'sm' ? 'bg-emerald-950 text-emerald-300 font-bold border border-emerald-500/40' : 'text-neutral-400 hover:text-white'}`}
                title="Smaller text"
              >
                A-
              </button>
              <button
                onClick={() => setFontSize('base')}
                className={`px-2 py-0.5 rounded-lg font-mono text-[11px] cursor-pointer ${fontSize === 'base' ? 'bg-emerald-950 text-emerald-300 font-bold border border-emerald-500/40' : 'text-neutral-400 hover:text-white'}`}
                title="Standard text"
              >
                A
              </button>
              <button
                onClick={() => setFontSize('lg')}
                className={`px-2 py-0.5 rounded-lg font-mono text-[11px] cursor-pointer ${fontSize === 'lg' ? 'bg-emerald-950 text-emerald-300 font-bold border border-emerald-500/40' : 'text-neutral-400 hover:text-white'}`}
                title="Larger text"
              >
                A+
              </button>
            </div>

            {/* Re-Edit Button */}
            {onEditPost && (
              <button
                id="modal-btn-edit-article"
                onClick={() => {
                  onClose();
                  onEditPost(post);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition-colors cursor-pointer"
                title="Re-edit this article"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Edit</span>
              </button>
            )}

            {/* Delete Button */}
            {onDeletePost && (
              <button
                id="modal-btn-delete-article"
                onClick={() => setIsConfirmDeleteOpen(true)}
                className="p-2 rounded-xl bg-neutral-900 hover:bg-rose-950/50 border border-neutral-800 hover:border-rose-800/60 text-neutral-400 hover:text-rose-400 transition-colors cursor-pointer"
                title="Delete this article"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}

            {/* Favorite / Claps */}
            <button
              onClick={handleClapClick}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-xs text-neutral-300 hover:text-rose-400 transition-colors cursor-pointer"
              title="Favorite article"
            >
              <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400/20" />
              <span className="font-mono text-xs">{post.clapsCount || 0}</span>
            </button>

            {/* Bookmark / Saved */}
            <button
              onClick={() => onToggleSave(post.id)}
              className={`p-2 rounded-xl border transition-all cursor-pointer ${
                isSaved
                  ? 'bg-emerald-950/80 border-emerald-500/50 text-emerald-400'
                  : 'bg-neutral-900 border-neutral-800 text-neutral-300 hover:text-white'
              }`}
              title={isSaved ? 'Remove from saved' : 'Save article'}
            >
              <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-emerald-400' : ''}`} />
            </button>

            {/* Share Menu */}
            <div className="relative">
              <button
                onClick={() => setIsShareMenuOpen(!isShareMenuOpen)}
                className="p-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-300 hover:text-white transition-colors cursor-pointer"
                title="Share article"
              >
                <Share2 className="w-3.5 h-3.5" />
              </button>

              {isShareMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-2xl bg-neutral-900 border border-neutral-800 shadow-2xl p-2 z-40 space-y-1 animate-in fade-in zoom-in-95 duration-150">
                  <button
                    onClick={handleCopyLink}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-neutral-200 hover:bg-neutral-800 text-left cursor-pointer"
                  >
                    {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-neutral-400" />}
                    <span>{copiedLink ? 'Link Copied!' : 'Copy Link'}</span>
                  </button>

                  <button
                    onClick={handleShareTwitter}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-neutral-200 hover:bg-neutral-800 text-left cursor-pointer"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-sky-400" />
                    <span>Share on X / Twitter</span>
                  </button>

                  <button
                    onClick={handleShareWhatsApp}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-neutral-200 hover:bg-neutral-800 text-left cursor-pointer"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Share on WhatsApp</span>
                  </button>

                  <button
                    onClick={handleShareLinkedIn}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-neutral-200 hover:bg-neutral-800 text-left cursor-pointer"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-blue-400" />
                    <span>Share on LinkedIn</span>
                  </button>
                </div>
              )}
            </div>

            {/* Print */}
            <button
              onClick={handlePrintPDF}
              className="p-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-300 hover:text-white transition-colors cursor-pointer"
              title="Print Article"
            >
              <Printer className="w-3.5 h-3.5" />
            </button>

            {/* Close */}
            <button
              id="modal-close-x-btn"
              onClick={onClose}
              className="p-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-400 hover:text-white transition-colors cursor-pointer"
              aria-label="Close article"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Article Content (Focused strictly on Thumbnail, Tags, Title, Description/Content) */}
        <div className="px-6 sm:px-10 lg:px-12 py-8 print:p-0 space-y-8">
          
          {/* 1. TAGS */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-950 text-emerald-300 border border-emerald-500/40 uppercase">
              {post.categoryLabel || 'Health'}
            </span>
            {post.tags && post.tags.map((t) => (
              <span key={t} className="px-2.5 py-1 rounded-lg text-xs bg-neutral-900 border border-neutral-800 text-neutral-300 font-medium">
                #{t}
              </span>
            ))}
          </div>

          {/* 2. ARTICLE TITLE */}
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-display font-black text-white tracking-tight leading-tight print:text-black">
            {post.title}
          </h1>

          {/* 3. THUMBNAIL (COVER IMAGE - UNIFORM 16:9 SAME-TO-SAME RATIO) */}
          <div className="space-y-2">
            <div className="relative aspect-[16/9] w-full max-h-[480px] rounded-2xl sm:rounded-3xl overflow-hidden bg-neutral-950 border border-neutral-800 shadow-2xl">
              <img
                src={post.coverImage}
                alt={post.imageAltText || post.title}
                className="w-full h-full object-cover object-center"
                referrerPolicy="no-referrer"
              />
            </div>
            {post.imageCaption && (
              <p className="text-xs text-neutral-500 italic text-center">
                {post.imageCaption}
              </p>
            )}
          </div>

          {/* 4. DESCRIPTION / EXCERPT */}
          {post.excerpt && (
            <div className="p-5 rounded-2xl bg-neutral-900/60 border border-neutral-800/80 text-sm sm:text-base text-neutral-300 font-light leading-relaxed">
              <strong className="text-white font-semibold block mb-1">Executive Summary:</strong>
              {post.excerpt}
            </div>
          )}

          {/* 5. FULL ARTICLE CONTENT (Markdown Rendered) */}
          <div className={`prose prose-invert max-w-none ${getFontSizeClass()} text-neutral-200 space-y-4 print:text-black`}>
            <Markdown>{post.content}</Markdown>
          </div>

          {/* Key Takeaways if available */}
          {post.keyTakeaways && post.keyTakeaways.length > 0 && (
            <div className="p-6 rounded-3xl bg-neutral-900/90 border border-emerald-900/40 space-y-3">
              <div className="flex items-center gap-2 font-bold text-sm text-emerald-400 uppercase tracking-wider">
                <Check className="w-4 h-4 text-emerald-400" />
                <span>Key Health Takeaways</span>
              </div>
              <ul className="space-y-2 text-xs sm:text-sm text-neutral-300">
                {post.keyTakeaways.map((takeaway, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-2 shrink-0" />
                    <span>{takeaway}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Medical Disclaimer */}
          {post.disclaimer && (
            <div className="p-4 rounded-2xl bg-neutral-950 border border-amber-900/40 text-xs text-amber-200/90 flex items-start gap-3">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <p className="leading-relaxed text-neutral-400">{post.disclaimer}</p>
            </div>
          )}

          {/* Scientific Citations if available */}
          {post.scientificReferences && post.scientificReferences.length > 0 && (
            <div className="p-5 rounded-2xl bg-neutral-950 border border-neutral-800 text-xs space-y-3">
              <div className="flex items-center gap-2 font-bold text-neutral-300">
                <BookOpen className="w-4 h-4 text-emerald-400" />
                <span>Scientific Citations &amp; DOIs</span>
              </div>
              <ul className="space-y-2 text-neutral-400 text-[11px]">
                {post.scientificReferences.map((ref, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="font-mono text-emerald-400">[{idx + 1}]</span>
                    <span>
                      <strong className="text-neutral-200">{ref.title}</strong> — <em>{ref.journal}</em> ({ref.year}) {ref.doi && `(DOI: ${ref.doi})`}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Discussion & Comments */}
          <div className="pt-8 border-t border-neutral-800 space-y-6 print:hidden">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-emerald-400" />
                <h3 className="text-base font-bold text-white">Reader Discussion</h3>
              </div>
              <span className="text-xs text-neutral-500 font-mono">
                {post.comments ? post.comments.length : 0} perspectives
              </span>
            </div>

            {/* Comment Form */}
            <form onSubmit={handleSubmitComment} className="p-4 rounded-2xl bg-neutral-900/60 border border-neutral-800 space-y-3">
              <input
                type="text"
                placeholder="Your Name (e.g., Jane D. or Dr. Alex)"
                value={commentName}
                onChange={(e) => setCommentName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500"
                required
              />
              <textarea
                rows={2}
                placeholder="Share your perspective or query..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500 resize-none"
                required
              />
              <div className="flex items-center justify-between pt-1">
                {commentSuccess ? (
                  <span className="text-xs text-emerald-400 flex items-center gap-1 font-semibold">
                    <Check className="w-3.5 h-3.5" />
                    Perspective posted!
                  </span>
                ) : <div />}
                <button
                  type="submit"
                  disabled={isSubmittingComment}
                  className="px-4 py-2 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-neutral-950 font-bold text-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50 transition-colors"
                >
                  <Send className="w-3 h-3" />
                  <span>{isSubmittingComment ? 'Posting...' : 'Post Comment'}</span>
                </button>
              </div>
            </form>

            {/* Existing Comments */}
            {post.comments && post.comments.length > 0 && (
              <div className="space-y-3">
                {post.comments.map((comment) => (
                  <div key={comment.id} className="p-4 rounded-2xl bg-neutral-900/40 border border-neutral-800/80 space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-white">{comment.authorName}</span>
                      <span className="text-[10px] text-neutral-500 font-mono">{comment.createdAt}</span>
                    </div>
                    <p className="text-xs text-neutral-300 leading-relaxed">{comment.content}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>

      {/* DELETE CONFIRMATION DIALOG IN MODAL */}
      {isConfirmDeleteOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-rose-400">
              <div className="p-2.5 rounded-2xl bg-rose-950/60 border border-rose-800/40">
                <Trash2 className="w-5 h-5 text-rose-400" />
              </div>
              <h3 className="text-base font-bold text-white">Delete Article?</h3>
            </div>

            <p className="text-xs text-neutral-300 leading-relaxed">
              Are you sure you want to permanently delete <strong className="text-white">"{post.title}"</strong>?
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsConfirmDeleteOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-neutral-400 hover:text-white bg-neutral-800/60 hover:bg-neutral-800 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
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
