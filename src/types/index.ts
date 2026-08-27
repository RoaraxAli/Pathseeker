export type UserRole = 'student' | 'graduate' | 'professional' | 'admin' | 'customer';

export interface UserProfile {
  uid: string;
  id?: string;
  _id?: string;
  email: string;
  displayName: string;
  photoURL?: string;
  phoneNumber?: string;
  role: UserRole;
  educationLevel?: string;
  skills?: string[];
  interests?: string[];
  workExperience?: string;
  resumeUrl?: string;
  targetRole?: string;
  bio?: string;
  readinessScore?: number;
  createdAt?: string;
  updatedAt?: string;
  token?: string;
}

export interface CareerItem {
  _id: string;
  id?: string;
  title: string;
  slug: string;
  domain: string;
  description: string;
  summary: string;
  requiredSkills: string[];
  educationPath: string;
  salaryRange: {
    entry: number;
    mid: number;
    senior: number;
    currency: string;
  };
  jobDemand: 'Explosive' | 'High' | 'Moderate';
  growthRate: string;
  certifications: string[];
  dailyTasks: string[];
  recommendedCourses: Array<{
    name: string;
    platform: string;
    link: string;
  }>;
  targetAudience: Array<'student' | 'graduate' | 'professional'>;
  isTrending: boolean;
  viewsCount: number;
  bookmarkCount: number;
  iconName?: string;
}

export interface MultimediaItem {
  _id: string;
  title: string;
  type: 'video' | 'podcast' | 'explainer';
  url: string;
  thumbnailUrl: string;
  domain: string;
  duration: string;
  speaker: {
    name: string;
    role: string;
    company: string;
    avatar?: string;
  };
  tags: string[];
  transcript: string;
  ratingAvg: number;
  ratingCount: number;
  viewsCount: number;
  targetAudience: string[];
  isFeatured: boolean;
}

export interface QuizOption {
  label: string;
  traitScores: {
    tech?: number;
    data?: number;
    creative?: number;
    leadership?: number;
    healthcare?: number;
    cybersecurity?: number;
  };
}

export interface QuizQuestionItem {
  _id: string;
  questionText: string;
  category: string;
  type: 'likert' | 'scenario' | 'slider' | 'multiple_choice';
  options: QuizOption[];
  timeLimitSec: number;
  order: number;
}

export interface QuizAttemptResult {
  scores: {
    tech: number;
    data: number;
    creative: number;
    leadership: number;
    healthcare: number;
    cybersecurity: number;
  };
  primaryDomain: string;
  recommendedCareers: Array<{
    title: string;
    domain: string;
    matchPercentage: number;
    slug?: string;
    salary?: number;
    demand?: string;
  }>;
  attemptId?: string;
  message?: string;
}

export interface StoryMilestone {
  year: string;
  title: string;
  description: string;
}

export interface SuccessStoryItem {
  _id: string;
  name: string;
  avatarUrl: string;
  domain: string;
  currentRole: string;
  company: string;
  educationPath: string;
  challenges: string;
  milestones: StoryMilestone[];
  outcome: string;
  advice: string;
  status: 'pending' | 'approved' | 'featured';
  likesCount: number;
  createdAt?: string;
}

export interface ResourceItem {
  _id: string;
  title: string;
  category:
    | 'Resume Template'
    | 'Career Roadmap'
    | 'Interview Checklist'
    | 'Scholarship Guide'
    | 'Skill Cheat Sheet'
    | 'Infographic';
  description: string;
  fileUrl: string;
  previewSnippet: string;
  fileType: string;
  fileSize: string;
  tags: string[];
  targetAudience: string[];
  downloadsCount: number;
  viewsCount: number;
  isPopular: boolean;
}

export interface FeedbackItem {
  _id: string;
  userId?: string;
  userName: string;
  userEmail: string;
  category: 'bug' | 'suggestion' | 'query' | 'appreciation';
  subject: string;
  message: string;
  sentiment: 'positive' | 'neutral' | 'negative' | 'urgent';
  status: 'open' | 'in-progress' | 'resolved';
  adminResponse?: string;
  createdAt: string;
}

export interface BookmarkItem {
  _id: string;
  userId: string;
  itemType: 'career' | 'multimedia' | 'resource';
  itemId: string;
  title: string;
  subtitle?: string;
  notes?: string;
  tags?: string[];
  createdAt?: string;
}

export interface NotificationItem {
  _id: string;
  userId?: string | null;
  title: string;
  message: string;
  type: 'system' | 'announcement' | 'feedback_reply' | 'career_alert' | 'quiz_result';
  link?: string;
  read: boolean;
  createdAt: string;
}

export interface AdminStats {
  metrics: {
    totalCareers: number;
    totalUsers: number;
    studentUsers: number;
    graduateUsers: number;
    professionalUsers: number;
    adminUsers: number;
    totalQuizAttempts: number;
    totalStories: number;
    pendingStories: number;
    totalMultimedia: number;
    totalResources: number;
    totalDownloads: number;
    totalFeedback: number;
    openFeedback: number;
    satisfactionRate: number;
  };
  recentUsers: UserProfile[];
  recentFeedback: FeedbackItem[];
}
