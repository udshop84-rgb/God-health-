export type BlogCategory = 
  | 'all'
  | 'longevity'
  | 'nutrition'
  | 'mental-health'
  | 'fitness'
  | 'sleep-science'
  | 'preventive-care'
  | 'holistic-wellness';

export type MainViewSection = 'home' | 'blog' | 'video' | 'favorites' | 'profile';

export type TargetAudience = 'General Public' | 'Patient Guide' | 'Clinical Overview';

export interface MedicalReviewer {
  id: string;
  name: string;
  credentials: string;
  affiliation?: string;
  avatar: string;
  verified: boolean;
  reviewDate?: string;
}

export interface ScientificReference {
  title: string;
  journal: string;
  year: string;
  link?: string;
  doi?: string;
}

export interface BlogAuthor {
  id: string;
  name: string;
  role: string;
  credentials?: string;
  avatar: string;
  bio?: string;
  handle?: string;
}

export interface BlogComment {
  id: string;
  authorName: string;
  authorAvatar?: string;
  createdAt: string;
  content: string;
  likes: number;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  imageAltText?: string;
  imageCaption?: string;
  imageSourceUrl?: string;
  category: BlogCategory;
  categoryLabel: string;
  tags: string[];
  targetAudience?: TargetAudience;
  author: BlogAuthor;
  medicallyReviewedBy?: MedicalReviewer;
  publishedAt: string;
  readTimeMinutes: number;
  featured?: boolean;
  trending?: boolean;
  status: 'published' | 'draft';
  clapsCount: number;
  viewsCount: number;
  comments: BlogComment[];
  bookmarksCount?: number;
  keyTakeaways?: string[];
  scientificReferences?: ScientificReference[];
  disclaimer?: string;
  isUserUploaded?: boolean;
  updatedAt?: string;
}

export interface NewPostDraft {
  title: string;
  slug?: string;
  excerpt: string;
  content: string;
  category: BlogCategory;
  categoryLabel: string;
  tags: string[];
  targetAudience?: TargetAudience;
  coverImage: string;
  imageAltText?: string;
  imageCaption?: string;
  imageSourceUrl?: string;
  authorName: string;
  authorRole: string;
  authorCredentials?: string;
  authorAvatar: string;
  reviewedByName?: string;
  reviewedByCredentials?: string;
  reviewedByAffiliation?: string;
  reviewedByAvatar?: string;
  reviewedByVerified?: boolean;
  status: 'published' | 'draft';
  keyTakeaways?: string[];
  scientificReferences?: ScientificReference[];
  disclaimer?: string;
}

export interface VideoChapter {
  time: string;
  seconds: number;
  title: string;
}

export interface HealthVideo {
  id: string;
  title: string;
  slug: string;
  description: string;
  videoUrl: string;
  thumbnailUrl: string;
  category: BlogCategory;
  categoryLabel: string;
  durationMinutes: number;
  durationFormatted: string;
  instructor: {
    name: string;
    role: string;
    avatar: string;
    credentials?: string;
  };
  publishedAt: string;
  viewsCount: number;
  likesCount: number;
  tags: string[];
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'All Levels';
  featured?: boolean;
  trending?: boolean;
  qualityBadge?: '4K Ultra HD' | '1080p Full HD';
  chapters?: VideoChapter[];
  keyTakeaways?: string[];
  comments: BlogComment[];
  isUserUploaded?: boolean;
  status: 'published' | 'draft';
}

export interface NewVideoDraft {
  title: string;
  description: string;
  videoUrl: string;
  thumbnailUrl: string;
  category: BlogCategory;
  categoryLabel: string;
  durationMinutes: number;
  instructorName: string;
  instructorRole: string;
  instructorAvatar: string;
  tags: string[];
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'All Levels';
  keyTakeaways?: string[];
  status: 'published' | 'draft';
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar: string;
  bio: string;
  joinedDate: string;
  healthGoals: string[];
  dailyWaterTargetLiters: number;
  currentWaterLiters: number;
  sleepTargetHours: number;
  currentSleepHours: number;
  weeklyZone2Minutes: number;
  currentZone2Minutes: number;
  streakDays: number;
}

export interface DailyHealthMetric {
  id: string;
  title: string;
  value: string;
  unit: string;
  status: 'optimal' | 'moderate' | 'action-needed';
  recommendation: string;
  icon: string;
}

export interface NewsletterSubscriber {
  email: string;
  topics: BlogCategory[];
  joinedDate: string;
}

export interface HealthFaqItem {
  question: string;
  answer: string;
  category: 'Nutrition & Diet' | 'Longevity Science' | 'Sleep & Recovery' | 'Mental Well-being' | 'Editorial & Ethics';
}
