import { UserProfile } from '../types';

export const INITIAL_USER_PROFILE: UserProfile = {
  id: 'user-default-1',
  name: 'Alex Rivera',
  email: 'alex.rivera@healthisvital.org',
  role: 'Longevity Enthusiast & Health Practitioner',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
  bio: 'Passionate about epigenetic biological clocks, circadian rhythm optimization, Zone 2 endurance, and whole-food microbiome nutrition. Tracking daily protocols for maximum vitality.',
  joinedDate: 'Joined March 2026',
  healthGoals: [
    'Cellular Longevity & Autophagy',
    '150 Min Zone 2 Weekly',
    '8 Hours Deep Sleep',
    'Microbiome Diversity (30+ Plants/Wk)',
    'Stress Biomarker Regulation',
  ],
  dailyWaterTargetLiters: 2.8,
  currentWaterLiters: 2.1,
  sleepTargetHours: 8.0,
  currentSleepHours: 7.6,
  weeklyZone2Minutes: 180,
  currentZone2Minutes: 135,
  streakDays: 14,
};
