import React, { useState, useRef } from 'react';
import { 
  X, 
  Camera, 
  Upload, 
  Link as LinkIcon, 
  Sparkles, 
  Check, 
  RotateCcw, 
  Sliders, 
  ShieldCheck, 
  Image as ImageIcon,
  CheckCircle2,
  Trash2
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface ProfilePhotoModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentAvatar: string;
  onSaveAvatar: (newAvatarUrl: string) => void;
  userName: string;
}

export const PRESET_AVATARS = [
  {
    id: 'avatar-marcus',
    label: 'Epigenetics Researcher',
    role: 'Clinical Scientist',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=350&q=80',
    color: 'emerald'
  },
  {
    id: 'avatar-elena',
    label: 'Longevity Physician',
    role: 'MD, Gerontologist',
    url: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=350&q=80',
    color: 'teal'
  },
  {
    id: 'avatar-david',
    label: 'Cellular Biologist',
    role: 'PhD, Bioenergetics',
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=350&q=80',
    color: 'cyan'
  },
  {
    id: 'avatar-sarah',
    label: 'Holistic Neurologist',
    role: 'Mindfulness & Sleep MD',
    url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=350&q=80',
    color: 'indigo'
  },
  {
    id: 'avatar-michael',
    label: 'Cardiopulmonary Specialist',
    role: 'Exercise Physiologist',
    url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=350&q=80',
    color: 'amber'
  },
  {
    id: 'avatar-amara',
    label: 'Metabolic Dietitian',
    role: 'RD, Microbiome Focus',
    url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=350&q=80',
    color: 'emerald'
  },
  {
    id: 'avatar-kenji',
    label: 'Circadian Biologist',
    role: 'Chronobiology Lead',
    url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=350&q=80',
    color: 'purple'
  },
  {
    id: 'avatar-sophia',
    label: 'Preventive Medicine Lead',
    role: 'Preventive Wellness Fellow',
    url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=350&q=80',
    color: 'rose'
  }
];

export const PHOTO_FILTERS = [
  { id: 'none', label: 'Natural Clean', style: '' },
  { id: 'emerald', label: 'Emerald Glow', style: 'contrast-105 saturate-110 hue-rotate-15' },
  { id: 'vibrant', label: 'Vibrant Vitality', style: 'saturate-125 contrast-110 brightness-105' },
  { id: 'clinical', label: 'Clinical Clarity', style: 'contrast-115 brightness-102' },
  { id: 'warm', label: 'Warm Amber', style: 'sepia-25 brightness-105 saturate-110' },
  { id: 'monochrome', label: 'Monochrome High-Key', style: 'grayscale contrast-120' },
];

export const BORDER_RINGS = [
  { id: 'emerald', label: 'Emerald Pro', ringClass: 'ring-4 ring-emerald-500 shadow-emerald-500/30' },
  { id: 'cyan', label: 'Nordic Cyan', ringClass: 'ring-4 ring-cyan-400 shadow-cyan-400/30' },
  { id: 'indigo', label: 'Deep Indigo', ringClass: 'ring-4 ring-indigo-500 shadow-indigo-500/30' },
  { id: 'amber', label: 'Vital Amber', ringClass: 'ring-4 ring-amber-400 shadow-amber-400/30' },
  { id: 'rose', label: 'Rose Vitality', ringClass: 'ring-4 ring-rose-500 shadow-rose-500/30' },
  { id: 'silver', label: 'Clinical Silver', ringClass: 'ring-4 ring-neutral-300 shadow-white/20' },
];

export const ProfilePhotoModal: React.FC<ProfilePhotoModalProps> = ({
  isOpen,
  onClose,
  currentAvatar,
  onSaveAvatar,
  userName,
}) => {
  const [activeTab, setActiveTab] = useState<'upload' | 'preset' | 'url'>('upload');
  const [selectedPhoto, setSelectedPhoto] = useState<string>(currentAvatar);
  const [customUrlInput, setCustomUrlInput] = useState<string>('');
  const [activeFilter, setActiveFilter] = useState<string>('none');
  const [activeBorderRing, setActiveBorderRing] = useState<string>('emerald');
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [isDragging, setIsDragging] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const processFile = (file: File) => {
    setErrorMessage(null);
    if (!file.type.startsWith('image/')) {
      setErrorMessage('Please select a valid image file (PNG, JPG, WebP, GIF, or SVG).');
      return;
    }

    if (file.size > 12 * 1024 * 1024) {
      setErrorMessage('Image size exceeds 12MB. Please select a smaller photo.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        setSelectedPhoto(e.target.result as string);
        setErrorMessage(null);
        showToast('Photo uploaded successfully! Adjust framing or save.');
      }
    };
    reader.onerror = () => {
      setErrorMessage('Failed to read image file.');
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleUrlApply = () => {
    const trimmed = customUrlInput.trim();
    if (!trimmed) {
      setErrorMessage('Please enter an image URL.');
      return;
    }

    // Quick sanity check for valid URL
    try {
      new URL(trimmed);
    } catch {
      setErrorMessage('Please enter a valid HTTP or HTTPS image URL.');
      return;
    }

    setSelectedPhoto(trimmed);
    setErrorMessage(null);
    showToast('Image URL loaded!');
  };

  const showToast = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(null), 2500);
  };

  const handleSave = (e: React.MouseEvent) => {
    onSaveAvatar(selectedPhoto);

    // Fire celebratory confetti
    const rect = e.currentTarget.getBoundingClientRect();
    confetti({
      particleCount: 35,
      spread: 60,
      origin: {
        x: (rect.left + rect.width / 2) / window.innerWidth,
        y: (rect.top + rect.height / 2) / window.innerHeight,
      },
      colors: ['#10b981', '#14b8a6', '#3b82f6', '#f59e0b'],
    });

    onClose();
  };

  const handleResetDefault = () => {
    setSelectedPhoto(PRESET_AVATARS[0].url);
    setActiveFilter('none');
    setZoomLevel(1);
    setActiveBorderRing('emerald');
    setErrorMessage(null);
    showToast('Reset to default medical avatar');
  };

  const currentFilterObj = PHOTO_FILTERS.find((f) => f.id === activeFilter) || PHOTO_FILTERS[0];
  const currentRingObj = BORDER_RINGS.find((r) => r.id === activeBorderRing) || BORDER_RINGS[0];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-neutral-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      
      {/* Modal Container */}
      <div 
        id="profile-photo-modal-container"
        className="bg-neutral-900 border border-neutral-800 rounded-3xl w-full max-w-2xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden relative"
      >
        {/* Top Header */}
        <div className="flex items-center justify-between px-5 sm:px-7 py-4 bg-neutral-950/90 border-b border-neutral-800 sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-emerald-950/80 border border-emerald-800/40 text-emerald-400">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-display font-bold text-white flex items-center gap-2">
                <span>Profile Photo Studio</span>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  HD
                </span>
              </h3>
              <p className="text-xs text-neutral-400">
                Upload your picture, choose a clinical preset, or paste a custom URL
              </p>
            </div>
          </div>

          <button
            id="close-profile-photo-modal-btn"
            onClick={onClose}
            className="p-2 text-neutral-400 hover:text-white rounded-xl hover:bg-neutral-800 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="overflow-y-auto flex-1 p-5 sm:p-7 space-y-6">
          
          {/* Live Avatar Preview Hero */}
          <div className="p-6 rounded-3xl bg-neutral-950/90 border border-neutral-800/90 flex flex-col sm:flex-row items-center justify-center gap-6 text-center sm:text-left relative overflow-hidden">
            {/* Ambient Back Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-emerald-500/10 blur-3xl rounded-full pointer-events-none" />

            {/* Avatar Circle with Ring & Filter */}
            <div className="relative group">
              <div 
                className={`w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden shadow-2xl bg-neutral-900 transition-all duration-300 ${currentRingObj.ringClass}`}
              >
                <img
                  src={selectedPhoto}
                  alt={userName}
                  className={`w-full h-full object-cover transition-all duration-200 ${currentFilterObj.style}`}
                  style={{ transform: `scale(${zoomLevel})` }}
                  referrerPolicy="no-referrer"
                  onError={() => {
                    setErrorMessage('Failed to load image. Reverting to preset photo.');
                    setSelectedPhoto(PRESET_AVATARS[0].url);
                  }}
                />
              </div>

              <div className="absolute -bottom-1 -right-1 p-2 rounded-full bg-emerald-500 text-neutral-950 font-bold shadow-lg border-2 border-neutral-900 flex items-center justify-center">
                <ShieldCheck className="w-4 h-4" />
              </div>
            </div>

            {/* Live Name & Badge details */}
            <div className="space-y-1.5 z-10">
              <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400 bg-emerald-950/80 border border-emerald-800/50 px-2.5 py-0.5 rounded-full">
                Active Live Preview
              </span>
              <h4 className="text-lg font-bold text-white">{userName}</h4>
              <p className="text-xs text-neutral-400 font-mono">
                Filter: <span className="text-emerald-300 font-semibold">{currentFilterObj.label}</span>
              </p>
              <div className="flex items-center justify-center sm:justify-start gap-2 pt-1">
                <button
                  type="button"
                  onClick={handleResetDefault}
                  className="flex items-center gap-1 text-[11px] text-neutral-400 hover:text-neutral-200 transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3 text-neutral-500" />
                  <span>Reset to Default</span>
                </button>
              </div>
            </div>
          </div>

          {/* Tab Selector: Upload Device File | Medical Presets | Direct URL */}
          <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-neutral-950 border border-neutral-800">
            <button
              id="tab-photo-upload"
              type="button"
              onClick={() => { setActiveTab('upload'); setErrorMessage(null); }}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                activeTab === 'upload'
                  ? 'bg-neutral-800 text-white shadow-sm border border-neutral-700/60'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              <Upload className="w-3.5 h-3.5 text-emerald-400" />
              <span>Upload Photo</span>
            </button>

            <button
              id="tab-photo-preset"
              type="button"
              onClick={() => { setActiveTab('preset'); setErrorMessage(null); }}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                activeTab === 'preset'
                  ? 'bg-neutral-800 text-white shadow-sm border border-neutral-700/60'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-teal-400" />
              <span>Avatar Presets</span>
            </button>

            <button
              id="tab-photo-url"
              type="button"
              onClick={() => { setActiveTab('url'); setErrorMessage(null); }}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                activeTab === 'url'
                  ? 'bg-neutral-800 text-white shadow-sm border border-neutral-700/60'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              <LinkIcon className="w-3.5 h-3.5 text-cyan-400" />
              <span>Image URL</span>
            </button>
          </div>

          {/* TAB 1: DEVICE UPLOAD */}
          {activeTab === 'upload' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                id="profile-photo-file-input"
              />

              <div
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleFileDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-3xl p-8 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-3 ${
                  isDragging
                    ? 'border-emerald-400 bg-emerald-950/30 shadow-lg'
                    : 'border-neutral-700/80 bg-neutral-950/50 hover:bg-neutral-950 hover:border-emerald-500/50'
                }`}
              >
                <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
                  <Upload className="w-6 h-6" />
                </div>

                <div className="space-y-1">
                  <p className="text-sm font-bold text-white">
                    Click to browse or drag &amp; drop your photo
                  </p>
                  <p className="text-xs text-neutral-400">
                    Supports high-resolution PNG, JPG, WebP, GIF, or SVG (up to 12MB)
                  </p>
                </div>

                <button
                  type="button"
                  className="px-4 py-2 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs font-semibold hover:bg-emerald-500/25 transition-colors mt-2"
                >
                  Select File from Device
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: CURATED AVATAR PRESETS */}
          {activeTab === 'preset' && (
            <div className="space-y-3 animate-in fade-in duration-150">
              <p className="text-xs text-neutral-400 font-medium">
                Choose a peer-reviewed practitioner or wellness avatar:
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {PRESET_AVATARS.map((item) => {
                  const isSelected = selectedPhoto === item.url;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        setSelectedPhoto(item.url);
                        setErrorMessage(null);
                      }}
                      className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col items-center text-center gap-2 group ${
                        isSelected
                          ? 'bg-emerald-950/70 border-emerald-500 ring-2 ring-emerald-500/30'
                          : 'bg-neutral-950/60 border-neutral-800 hover:border-neutral-700 hover:bg-neutral-950'
                      }`}
                    >
                      <div className="relative">
                        <img
                          src={item.url}
                          alt={item.label}
                          className="w-14 h-14 rounded-full object-cover border border-neutral-700 group-hover:scale-105 transition-transform"
                          referrerPolicy="no-referrer"
                        />
                        {isSelected && (
                          <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 text-neutral-950 flex items-center justify-center shadow-md">
                            <Check className="w-3 h-3 stroke-[3]" />
                          </div>
                        )}
                      </div>

                      <div>
                        <p className="text-xs font-bold text-neutral-200 line-clamp-1">
                          {item.label}
                        </p>
                        <p className="text-[10px] text-neutral-400 line-clamp-1 font-mono">
                          {item.role}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: DIRECT IMAGE URL */}
          {activeTab === 'url' && (
            <div className="space-y-3 animate-in fade-in duration-150">
              <label className="text-xs font-semibold text-neutral-300">
                Paste Direct Web Image Address:
              </label>

              <div className="flex gap-2">
                <div className="relative flex-1">
                  <input
                    type="url"
                    value={customUrlInput}
                    onChange={(e) => setCustomUrlInput(e.target.value)}
                    placeholder="https://images.unsplash.com/photo-..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-700 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500 font-mono"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleUrlApply}
                  className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 text-xs font-bold transition-colors cursor-pointer shrink-0"
                >
                  Apply URL
                </button>
              </div>

              <p className="text-[11px] text-neutral-500">
                Tip: Paste any hosted image from Unsplash, Gravatar, or your medical institute profile.
              </p>
            </div>
          )}

          {/* Photo Adjustment Controls: Zoom & Filters */}
          <div className="p-4 rounded-2xl bg-neutral-950/80 border border-neutral-800/80 space-y-4">
            
            {/* Zoom Slider */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs text-neutral-300">
                <span className="font-semibold flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Framing Scale &amp; Zoom</span>
                </span>
                <span className="font-mono text-neutral-400 text-[11px]">
                  {Math.round(zoomLevel * 100)}%
                </span>
              </div>
              <input
                type="range"
                min="0.8"
                max="2.0"
                step="0.05"
                value={zoomLevel}
                onChange={(e) => setZoomLevel(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-emerald-400"
              />
            </div>

            {/* Filter Presets */}
            <div className="space-y-2 pt-2 border-t border-neutral-800/60">
              <span className="text-xs font-semibold text-neutral-300 block">
                Visual Filter Preset:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {PHOTO_FILTERS.map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setActiveFilter(f.id)}
                    className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                      activeFilter === f.id
                        ? 'bg-emerald-500 text-neutral-950 font-bold'
                        : 'bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Profile Ring Style */}
            <div className="space-y-2 pt-2 border-t border-neutral-800/60">
              <span className="text-xs font-semibold text-neutral-300 block">
                Profile Badge Ring Accent:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {BORDER_RINGS.map((ring) => (
                  <button
                    key={ring.id}
                    type="button"
                    onClick={() => setActiveBorderRing(ring.id)}
                    className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                      activeBorderRing === ring.id
                        ? 'bg-neutral-800 text-white border border-emerald-500 shadow-sm'
                        : 'bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800'
                    }`}
                  >
                    {ring.label}
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Validation / Error Message */}
          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-950/80 border border-rose-800/50 text-rose-300 text-xs flex items-center gap-2">
              <span>⚠️ {errorMessage}</span>
            </div>
          )}

        </div>

        {/* Bottom Actions Bar */}
        <div className="flex items-center justify-between px-5 sm:px-7 py-4 bg-neutral-950/95 border-t border-neutral-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-neutral-400 hover:text-white rounded-xl hover:bg-neutral-900 transition-colors cursor-pointer"
          >
            Cancel
          </button>

          <div className="flex items-center gap-3">
            <button
              id="save-profile-photo-btn"
              type="button"
              onClick={handleSave}
              className="px-6 py-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold text-xs shadow-lg shadow-emerald-500/20 flex items-center gap-2 transition-all cursor-pointer hover:scale-102"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Save Profile Photo</span>
            </button>
          </div>
        </div>

        {/* Success Toast */}
        {successToast && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-2xl bg-emerald-500 text-neutral-950 text-xs font-bold shadow-2xl flex items-center gap-2 animate-in fade-in duration-150">
            <span>{successToast}</span>
          </div>
        )}

      </div>
    </div>
  );
};
