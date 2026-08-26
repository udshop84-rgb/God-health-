import React, { useState } from 'react';
import { 
  User, 
  Settings, 
  Flame, 
  Droplet, 
  Moon, 
  Activity, 
  PenSquare, 
  Video as VideoIcon, 
  ShieldCheck, 
  Plus, 
  Check, 
  Edit3, 
  Sparkles, 
  BookOpen, 
  Tv, 
  Bookmark, 
  Calendar,
  Award,
  ChevronRight,
  Trash2,
  Camera,
  Upload,
  RotateCcw,
  CheckCircle2,
  X,
  Heart
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { UserProfile, BlogPost, HealthVideo } from '../types';
import { ProfilePhotoModal } from './ProfilePhotoModal';

interface ProfileSectionProps {
  profile: UserProfile;
  onUpdateProfile: (updated: UserProfile) => void;
  posts: BlogPost[];
  videos: HealthVideo[];
  savedArticlesCount: number;
  savedVideosCount: number;
  onOpenCreatePost: () => void;
  onOpenUploadVideo: () => void;
  onOpenPost: (post: BlogPost) => void;
  onOpenVideo: (video: HealthVideo) => void;
  onDeletePost?: (id: string) => void;
  onDeleteVideo?: (id: string) => void;
}

export const ProfileSection: React.FC<ProfileSectionProps> = ({
  profile,
  onUpdateProfile,
  posts,
  videos,
  savedArticlesCount,
  savedVideosCount,
  onOpenCreatePost,
  onOpenUploadVideo,
  onOpenPost,
  onOpenVideo,
  onDeletePost,
  onDeleteVideo,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const [editName, setEditName] = useState(profile.name);
  const [editEmail, setEditEmail] = useState(profile.email);
  const [editRole, setEditRole] = useState(profile.role);
  const [editBio, setEditBio] = useState(profile.bio);
  const [editWaterTarget, setEditWaterTarget] = useState(profile.dailyWaterTargetLiters);
  const [editSleepTarget, setEditSleepTarget] = useState(profile.sleepTargetHours);
  const [editZone2Target, setEditZone2Target] = useState(profile.weeklyZone2Minutes);
  
  // Custom Goals Editor
  const [newGoalInput, setNewGoalInput] = useState('');
  const [showGoalInput, setShowGoalInput] = useState(false);

  // Content Tab: All | Articles | Videos
  const [contentTab, setContentTab] = useState<'all' | 'posts' | 'videos'>('all');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const myAuthoredPosts = posts.filter((p) => p.isUserUploaded || p.author.name.includes(profile.name.split(' ')[0]));
  const myUploadedVideos = videos.filter((v) => v.isUserUploaded);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile({
      ...profile,
      name: editName.trim() || profile.name,
      email: editEmail.trim() || profile.email,
      role: editRole.trim() || profile.role,
      bio: editBio.trim() || profile.bio,
      dailyWaterTargetLiters: Number(editWaterTarget) || 2.5,
      sleepTargetHours: Number(editSleepTarget) || 8.0,
      weeklyZone2Minutes: Number(editZone2Target) || 150,
    });
    setIsEditing(false);
    showToast('Health Profile changes saved');
  };

  const handleSaveAvatar = (newAvatarUrl: string) => {
    onUpdateProfile({
      ...profile,
      avatar: newAvatarUrl,
    });
    showToast('Profile photo updated successfully!');
  };

  // Quick Tracker Controls
  const handleAddWater = (amount: number = 0.25) => {
    const updated = Math.max(0, Math.min(profile.dailyWaterTargetLiters + 2.0, +(profile.currentWaterLiters + amount).toFixed(2)));
    onUpdateProfile({ ...profile, currentWaterLiters: updated });
    showToast(`Hydration logged: ${updated}L`);
  };

  const handleAddSleep = (hours: number = 0.5) => {
    const updated = Math.max(0, Math.min(14, +(profile.currentSleepHours + hours).toFixed(1)));
    onUpdateProfile({ ...profile, currentSleepHours: updated });
    showToast(`Sleep logged: ${updated}h`);
  };

  const handleAddZone2 = (mins: number = 15) => {
    const updated = Math.max(0, profile.currentZone2Minutes + mins);
    onUpdateProfile({ ...profile, currentZone2Minutes: updated });
    showToast(`Zone 2 Cardio: ${updated} mins`);
  };

  // Health Goals manipulation
  const handleAddGoal = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanGoal = newGoalInput.trim();
    if (cleanGoal && !profile.healthGoals.includes(cleanGoal)) {
      onUpdateProfile({
        ...profile,
        healthGoals: [...profile.healthGoals, cleanGoal],
      });
      setNewGoalInput('');
      setShowGoalInput(false);
      showToast('New health goal added!');
    }
  };

  const handleRemoveGoal = (goalToRemove: string) => {
    onUpdateProfile({
      ...profile,
      healthGoals: profile.healthGoals.filter((g) => g !== goalToRemove),
    });
    showToast('Goal removed');
  };

  const waterPercent = Math.min(100, Math.round((profile.currentWaterLiters / profile.dailyWaterTargetLiters) * 100));
  const zone2Percent = Math.min(100, Math.round((profile.currentZone2Minutes / profile.weeklyZone2Minutes) * 100));
  const sleepPercent = Math.min(100, Math.round((profile.currentSleepHours / profile.sleepTargetHours) * 100));

  const weekDays = [
    { day: 'Mon', active: true },
    { day: 'Tue', active: true },
    { day: 'Wed', active: true },
    { day: 'Thu', active: true },
    { day: 'Fri', active: true },
    { day: 'Sat', active: true },
    { day: 'Sun', active: true },
  ];

  return (
    <section id="profile-section" className="py-12 sm:py-16 bg-neutral-950 relative min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* ========================================================================= */}
        {/* 1. PRIMARY HEALTH PROFILE CARD & PHOTO STUDIO TRIGGER */}
        {/* ========================================================================= */}
        <div className="bg-neutral-900/90 border border-neutral-800 rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-2xl">
          {/* Subtle Ambient Glow */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/5 blur-3xl rounded-full pointer-events-none -z-10" />

          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
            
            {/* User Identity Info with Clickable Avatar Photo */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
              
              {/* Profile Avatar with Photo Edit Camera Badge */}
              <div className="relative group/avatar cursor-pointer" onClick={() => setIsPhotoModalOpen(true)}>
                <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden border-2 border-emerald-500/50 group-hover/avatar:border-emerald-400 shadow-xl shadow-emerald-950/50 transition-all duration-300">
                  <img
                    src={profile.avatar}
                    alt={profile.name}
                    className="w-full h-full object-cover group-hover/avatar:scale-105 transition-transform duration-300"
                    referrerPolicy="no-referrer"
                  />

                  {/* Dark hover overlay with camera icon */}
                  <div className="absolute inset-0 bg-neutral-950/60 opacity-0 group-hover/avatar:opacity-100 flex flex-col items-center justify-center gap-1 transition-opacity duration-200 backdrop-blur-[2px]">
                    <Camera className="w-6 h-6 text-emerald-400" />
                    <span className="text-[10px] font-bold text-white tracking-wide">Change Photo</span>
                  </div>
                </div>

                {/* Pro Verification Badge */}
                <div className="absolute -bottom-2 -right-2 px-2 py-0.5 rounded-full bg-emerald-500 text-neutral-950 font-bold text-[10px] flex items-center gap-1 shadow-md border-2 border-neutral-900">
                  <ShieldCheck className="w-3 h-3" />
                  <span>PRO</span>
                </div>

                {/* Quick Change Photo Button for Mobile / Touch Accessibility */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsPhotoModalOpen(true);
                  }}
                  className="mt-2.5 flex items-center justify-center gap-1 px-2.5 py-1 rounded-xl bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 text-neutral-300 hover:text-emerald-300 text-[11px] font-medium transition-colors cursor-pointer w-full"
                  title="Upload or change profile picture"
                >
                  <Camera className="w-3 h-3 text-emerald-400" />
                  <span>Change Photo</span>
                </button>
              </div>

              {/* Identity Details & Bio */}
              <div className="space-y-2 max-w-xl">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-white">
                    {profile.name}
                  </h1>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-700/50 text-emerald-300 text-xs font-mono">
                    {profile.role}
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-neutral-800 text-neutral-400 text-[10px] font-mono">
                    {profile.joinedDate}
                  </span>
                </div>

                <p className="text-xs text-neutral-400 font-mono">{profile.email}</p>
                
                <p className="text-xs sm:text-sm text-neutral-300 pt-0.5 leading-relaxed">
                  {profile.bio}
                </p>

                {/* Health Goals Pills with Add / Delete capability */}
                <div className="pt-2">
                  <div className="flex items-center justify-center sm:justify-start gap-2 mb-1.5">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">
                      Active Health Protocols:
                    </span>
                    {!showGoalInput && (
                      <button
                        type="button"
                        onClick={() => setShowGoalInput(true)}
                        className="text-[11px] text-neutral-400 hover:text-emerald-300 flex items-center gap-0.5 font-medium cursor-pointer transition-colors"
                      >
                        <Plus className="w-3 h-3" />
                        <span>Add Goal</span>
                      </button>
                    )}
                  </div>

                  {/* Add Goal Inline Form */}
                  {showGoalInput && (
                    <form onSubmit={handleAddGoal} className="flex items-center gap-2 mb-2 max-w-sm">
                      <input
                        type="text"
                        value={newGoalInput}
                        onChange={(e) => setNewGoalInput(e.target.value)}
                        placeholder="e.g. 20 Min Sauna 3x/Week"
                        className="flex-1 px-3 py-1.5 rounded-xl bg-neutral-950 border border-neutral-700 text-xs text-white focus:outline-none focus:border-emerald-500"
                        autoFocus
                      />
                      <button
                        type="submit"
                        className="px-3 py-1.5 rounded-xl bg-emerald-500 text-neutral-950 font-bold text-xs hover:bg-emerald-400 transition-colors cursor-pointer"
                      >
                        Add
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowGoalInput(false)}
                        className="p-1.5 text-neutral-400 hover:text-white rounded-lg"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </form>
                  )}

                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-1.5">
                    {profile.healthGoals.map((goal, idx) => (
                      <span
                        key={idx}
                        className="group flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-mono bg-neutral-950 border border-neutral-800 text-emerald-400 hover:border-emerald-700/60 transition-colors"
                      >
                        <span>✓ {goal}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveGoal(goal)}
                          className="text-neutral-500 hover:text-rose-400 opacity-60 group-hover:opacity-100 transition-opacity cursor-pointer"
                          title="Remove goal"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Profile Action Buttons */}
            <div className="flex flex-col sm:flex-row md:flex-col items-center sm:items-end justify-center gap-2.5">
              <button
                id="edit-profile-toggle-btn"
                onClick={() => setIsEditing(!isEditing)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-semibold border border-neutral-700 transition-colors cursor-pointer w-full sm:w-auto"
              >
                <Edit3 className="w-4 h-4 text-emerald-400" />
                <span>{isEditing ? 'Close Settings' : 'Edit Health Profile'}</span>
              </button>

              <button
                id="open-photo-studio-btn"
                onClick={() => setIsPhotoModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-950/80 hover:bg-emerald-900/90 text-emerald-300 text-xs font-semibold border border-emerald-800/60 transition-colors cursor-pointer w-full sm:w-auto"
              >
                <Camera className="w-4 h-4 text-emerald-400" />
                <span>Profile Photo Studio</span>
              </button>
            </div>
          </div>

          {/* Edit Profile Inline Drawer */}
          {isEditing && (
            <form onSubmit={handleSaveProfile} className="mt-8 pt-6 border-t border-neutral-800 space-y-4 animate-in fade-in duration-200">
              
              {/* Photo Shortcut in edit form */}
              <div className="p-4 rounded-2xl bg-neutral-950/60 border border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <img
                    src={profile.avatar}
                    alt={profile.name}
                    className="w-12 h-12 rounded-xl object-cover border border-emerald-500/40"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <h4 className="text-xs font-bold text-white">Current Profile Photo</h4>
                    <p className="text-[11px] text-neutral-400">Click below to upload a high-res photo or select from clinical presets.</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsPhotoModalOpen(true)}
                  className="px-3.5 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Camera className="w-3.5 h-3.5" />
                  <span>Update Photo</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-neutral-300">Display Name</label>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-700 text-white text-xs focus:border-emerald-500 outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-neutral-300">Email Address</label>
                  <input
                    type="email"
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-700 text-white text-xs focus:border-emerald-500 outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-neutral-300">Role / Medical Title</label>
                  <input
                    type="text"
                    value={editRole}
                    onChange={(e) => setEditRole(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-700 text-white text-xs focus:border-emerald-500 outline-none"
                  />
                </div>

                <div className="sm:col-span-2 md:col-span-3 space-y-1">
                  <label className="text-xs font-semibold text-neutral-300">Personal Health Bio</label>
                  <textarea
                    rows={2}
                    value={editBio}
                    onChange={(e) => setEditBio(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-700 text-white text-xs focus:border-emerald-500 outline-none resize-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-neutral-300">Daily Water Goal (Liters)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={editWaterTarget}
                    onChange={(e) => setEditWaterTarget(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-700 text-white text-xs focus:border-emerald-500 outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-neutral-300">Nightly Sleep Goal (Hours)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={editSleepTarget}
                    onChange={(e) => setEditSleepTarget(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-700 text-white text-xs focus:border-emerald-500 outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-neutral-300">Weekly Zone 2 Target (Mins)</label>
                  <input
                    type="number"
                    step="10"
                    value={editZone2Target}
                    onChange={(e) => setEditZone2Target(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-700 text-white text-xs focus:border-emerald-500 outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 text-xs text-neutral-400 hover:text-white rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold text-xs shadow-md transition-colors cursor-pointer"
                >
                  Save Profile Changes
                </button>
              </div>
            </form>
          )}
        </div>

        {/* ========================================================================= */}
        {/* 2. DAILY VITALITY PROTOCOL TRACKERS & QUICK LOGGERS */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
          
          {/* Card 1: Consistency Streak */}
          <div className="bg-neutral-900/80 border border-neutral-800 rounded-2xl p-5 flex flex-col justify-between space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-neutral-400">Consistency Streak</span>
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/20">
                <Flame className="w-4 h-4" />
              </div>
            </div>
            <div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-3xl font-display font-extrabold text-white">{profile.streakDays}</span>
                <span className="text-xs text-amber-400 font-bold">Days Active</span>
              </div>
              <p className="text-[11px] text-neutral-400 mt-1">
                Top 5% of health protocol practitioners
              </p>
            </div>
            {/* Week Dots */}
            <div className="flex items-center justify-between pt-2 border-t border-neutral-800/80 text-[10px] font-mono text-neutral-400">
              {weekDays.map((d, i) => (
                <div key={i} className="flex flex-col items-center gap-1">
                  <span>{d.day}</span>
                  <div className="w-2 h-2 rounded-full bg-emerald-400 ring-2 ring-emerald-500/30" />
                </div>
              ))}
            </div>
          </div>

          {/* Card 2: Hydration Target with Quick Add/Sub */}
          <div className="bg-neutral-900/80 border border-neutral-800 rounded-2xl p-5 flex flex-col justify-between space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-neutral-400">Daily Hydration</span>
              <div className="w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center border border-cyan-500/20">
                <Droplet className="w-4 h-4" />
              </div>
            </div>
            <div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-3xl font-display font-extrabold text-white">{profile.currentWaterLiters}</span>
                <span className="text-xs text-neutral-400">/ {profile.dailyWaterTargetLiters} L</span>
              </div>
              {/* Progress bar */}
              <div className="w-full h-2 rounded-full bg-neutral-800 mt-2 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-cyan-400 to-teal-400 transition-all duration-300"
                  style={{ width: `${waterPercent}%` }}
                />
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => handleAddWater(0.25)}
                className="flex-1 py-1.5 rounded-lg bg-neutral-800 hover:bg-cyan-950/60 hover:text-cyan-300 text-neutral-300 text-xs font-semibold border border-neutral-700 transition-colors flex items-center justify-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+250ml Water</span>
              </button>
              <button
                onClick={() => handleAddWater(-0.25)}
                className="px-2 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-400 text-xs border border-neutral-800"
                title="Undo 250ml"
              >
                -250
              </button>
            </div>
          </div>

          {/* Card 3: Deep Sleep Tracker with Quick Log */}
          <div className="bg-neutral-900/80 border border-neutral-800 rounded-2xl p-5 flex flex-col justify-between space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-neutral-400">Nightly Recovery</span>
              <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center border border-indigo-500/20">
                <Moon className="w-4 h-4" />
              </div>
            </div>
            <div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-3xl font-display font-extrabold text-white">{profile.currentSleepHours}</span>
                <span className="text-xs text-neutral-400">/ {profile.sleepTargetHours} Hours</span>
              </div>
              <div className="w-full h-2 rounded-full bg-neutral-800 mt-2 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-indigo-400 to-purple-400 transition-all duration-300"
                  style={{ width: `${sleepPercent}%` }}
                />
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => handleAddSleep(0.5)}
                className="flex-1 py-1.5 rounded-lg bg-neutral-800 hover:bg-indigo-950/60 hover:text-indigo-300 text-neutral-300 text-xs font-semibold border border-neutral-700 transition-colors flex items-center justify-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+0.5h Sleep</span>
              </button>
              <span className="text-emerald-400 font-mono text-[10px] font-semibold">
                92% Optimal
              </span>
            </div>
          </div>

          {/* Card 4: Zone 2 Weekly Threshold */}
          <div className="bg-neutral-900/80 border border-neutral-800 rounded-2xl p-5 flex flex-col justify-between space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-neutral-400">Weekly Zone 2</span>
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
                <Activity className="w-4 h-4" />
              </div>
            </div>
            <div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-3xl font-display font-extrabold text-white">{profile.currentZone2Minutes}</span>
                <span className="text-xs text-neutral-400">/ {profile.weeklyZone2Minutes} Min</span>
              </div>
              <div className="w-full h-2 rounded-full bg-neutral-800 mt-2 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-400 to-teal-400 transition-all duration-300"
                  style={{ width: `${zone2Percent}%` }}
                />
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => handleAddZone2(15)}
                className="flex-1 py-1.5 rounded-lg bg-neutral-800 hover:bg-emerald-950/60 hover:text-emerald-300 text-neutral-300 text-xs font-semibold border border-neutral-700 transition-colors flex items-center justify-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+15m Cardio</span>
              </button>
              <span className="text-emerald-400 font-mono text-[10px] font-semibold">
                {zone2Percent}%
              </span>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 3. MY AUTHORED CONTENT & VAULT */}
        {/* ========================================================================= */}
        <div className="mt-12 bg-neutral-900/60 border border-neutral-800 rounded-3xl p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-800">
            <div>
              <h2 className="text-xl sm:text-2xl font-display font-bold text-white">
                My Health Contributions &amp; Vault
              </h2>
              <p className="text-xs text-neutral-400 mt-1">
                Articles you have authored and clinical video masterclasses you have uploaded.
              </p>
            </div>

            {/* Quick Action Triggers */}
            <div className="flex items-center gap-2.5">
              <button
                id="profile-write-story-btn"
                onClick={onOpenCreatePost}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/40 text-emerald-300 text-xs font-semibold transition-colors cursor-pointer"
              >
                <PenSquare className="w-3.5 h-3.5" />
                <span>Write Story</span>
              </button>
              <button
                id="profile-upload-video-btn"
                onClick={onOpenUploadVideo}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-teal-500/15 hover:bg-teal-500/25 border border-teal-500/40 text-teal-300 text-xs font-semibold transition-colors cursor-pointer"
              >
                <VideoIcon className="w-3.5 h-3.5" />
                <span>Upload Video</span>
              </button>
            </div>
          </div>

          {/* Sub-Tabs */}
          <div className="flex items-center gap-2 pt-6 pb-4">
            {[
              { id: 'all', label: `All Content (${myAuthoredPosts.length + myUploadedVideos.length})` },
              { id: 'posts', label: `My Articles (${myAuthoredPosts.length})` },
              { id: 'videos', label: `My Videos (${myUploadedVideos.length})` },
            ].map((tab) => (
              <button
                key={tab.id}
                id={`profile-content-tab-${tab.id}`}
                onClick={() => setContentTab(tab.id as any)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  contentTab === tab.id
                    ? 'bg-neutral-800 text-emerald-300 border border-emerald-500/30'
                    : 'text-neutral-400 hover:text-neutral-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Content Lists */}
          <div className="space-y-4 pt-2">
            {/* Show Posts */}
            {(contentTab === 'all' || contentTab === 'posts') && myAuthoredPosts.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                  Published &amp; Draft Articles
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {myAuthoredPosts.map((p) => (
                    <div
                      key={p.id}
                      className="p-4 rounded-xl bg-neutral-950/80 border border-neutral-800 hover:border-emerald-700/50 transition-all flex items-center justify-between gap-3"
                    >
                      <div
                        onClick={() => onOpenPost(p)}
                        className="flex items-center gap-3 cursor-pointer min-w-0"
                      >
                        <img
                          src={p.coverImage}
                          alt={p.title}
                          className="w-16 h-12 sm:w-20 sm:h-14 rounded-xl object-cover object-center shrink-0 border border-neutral-800/80 bg-neutral-900"
                          referrerPolicy="no-referrer"
                        />
                        <div className="min-w-0">
                          <h4 className="text-xs font-bold text-neutral-200 truncate">
                            {p.title}
                          </h4>
                          <p className="text-[10px] text-neutral-400">
                            {p.categoryLabel} • {p.readTimeMinutes}m read • {p.clapsCount} claps
                          </p>
                        </div>
                      </div>

                      {onDeletePost && p.isUserUploaded && (
                        <button
                          onClick={() => onDeletePost(p.id)}
                          className="p-1.5 text-neutral-500 hover:text-rose-400 rounded-lg hover:bg-neutral-900 transition-colors cursor-pointer"
                          title="Delete post"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Show Videos */}
            {(contentTab === 'all' || contentTab === 'videos') && myUploadedVideos.length > 0 && (
              <div className="space-y-2 pt-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-teal-400">
                  Uploaded Video Masterclasses
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {myUploadedVideos.map((v) => (
                    <div
                      key={v.id}
                      className="p-4 rounded-xl bg-neutral-950/80 border border-neutral-800 hover:border-teal-700/50 transition-all flex items-center justify-between gap-3"
                    >
                      <div
                        onClick={() => onOpenVideo(v)}
                        className="flex items-center gap-3 cursor-pointer min-w-0"
                      >
                        <img
                          src={v.thumbnailUrl}
                          alt={v.title}
                          className="w-12 h-12 rounded-lg object-cover"
                          referrerPolicy="no-referrer"
                        />
                        <div className="min-w-0">
                          <h4 className="text-xs font-bold text-neutral-200 truncate">
                            {v.title}
                          </h4>
                          <p className="text-[10px] text-neutral-400">
                            {v.categoryLabel} • {v.durationFormatted} • {v.likesCount} likes
                          </p>
                        </div>
                      </div>

                      {onDeleteVideo && (
                        <button
                          onClick={() => onDeleteVideo(v.id)}
                          className="p-1.5 text-neutral-500 hover:text-rose-400 rounded-lg hover:bg-neutral-900 transition-colors cursor-pointer"
                          title="Delete video"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Empty state for my uploads */}
            {myAuthoredPosts.length === 0 && myUploadedVideos.length === 0 && (
              <div className="text-center py-10 text-neutral-400 text-xs">
                <p>You haven't published articles or uploaded videos yet.</p>
                <div className="mt-3 flex justify-center gap-3">
                  <button
                    onClick={onOpenCreatePost}
                    className="px-3.5 py-1.5 rounded-lg bg-emerald-500 text-neutral-950 font-bold cursor-pointer"
                  >
                    Write First Article
                  </button>
                  <button
                    onClick={onOpenUploadVideo}
                    className="px-3.5 py-1.5 rounded-lg bg-teal-500 text-neutral-950 font-bold cursor-pointer"
                  >
                    Upload First Video
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* ========================================================================= */}
      {/* 4. PROFILE PHOTO STUDIO MODAL */}
      {/* ========================================================================= */}
      <ProfilePhotoModal
        isOpen={isPhotoModalOpen}
        onClose={() => setIsPhotoModalOpen(false)}
        currentAvatar={profile.avatar}
        onSaveAvatar={handleSaveAvatar}
        userName={profile.name}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-2xl bg-emerald-500 text-neutral-950 text-xs font-bold shadow-2xl flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2 duration-150">
          <CheckCircle2 className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

    </section>
  );
};
