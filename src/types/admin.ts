export type JobType = 'Full-Time' | 'Part-Time' | 'Remote' | 'Contract' | 'Internship';

export type ApplicantStage = 'applied' | 'screening' | 'interview' | 'accepted' | 'rejected';

export interface StatCardItem {
  id: string;
  title: string;
  value: string;
  change?: string;
  iconName: string;
  bgGradient: string;
  pillColor: string;
}

export interface ActivityItem {
  id: string;
  title: string;
  time: string;
  type: 'application' | 'interview' | 'system' | 'message';
}

export interface JobItem {
  id: string;
  title: string;
  company: string;
  companyLogoColor: string;
  companyLogoLetter: string;
  salary: string;
  type: JobType;
  location: string;
  tags: string[];
  applicantsCount: number;
  status: 'active' | 'closed' | 'draft';
  description: string;
  requirements: string[];
  postedDate: string;
}

export interface CompanyItem {
  id: string;
  name: string;
  logoColor: string;
  logoLetter: string;
  vacancies: number;
  location: string;
  industry: string;
}

export interface ApplicantItem {
  id: string;
  name: string;
  avatar: string;
  email: string;
  phone: string;
  appliedJobId: string;
  appliedJobTitle: string;
  stage: ApplicantStage;
  matchScore: number;
  rating: number;
  appliedDate: string;
  experience: string;
  skills: string[];
  notes?: string;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: string;
  isMe: boolean;
  avatar?: string;
}

export interface MessageThread {
  id: string;
  contactName: string;
  contactRole: string;
  avatar: string;
  lastMessage: string;
  time: string;
  unreadCount: number;
  isOnline: boolean;
  messages: ChatMessage[];
}

export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  content: string;
  category: 'Update' | 'Event' | 'Hiring' | 'System' | 'Engineering';
  author: string;
  authorRole: string;
  authorAvatar: string;
  date: string;
  views: number;
  likes: number;
  tags: string[];
  priority: 'normal' | 'urgent' | 'featured';
}

export interface SystemUser {
  id: string;
  email: string;
  displayName: string;
  role: 'admin' | 'customer';
  status: 'active' | 'suspended';
  lastActive: string;
  avatar?: string;
}
