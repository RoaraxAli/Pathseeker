import axios from 'axios';
import {
  UserProfile,
  UserRole,
  CareerItem,
  MultimediaItem,
  QuizQuestionItem,
  QuizAttemptResult,
  SuccessStoryItem,
  ResourceItem,
  FeedbackItem,
  BookmarkItem,
  NotificationItem,
  AdminStats,
} from '../types';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

export const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to attach JWT token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('techwiz_auth_token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const authApi = {
  login: async (email: string, pass: string): Promise<UserProfile> => {
    const { data } = await api.post('/auth/login', { email, password: pass });
    return data;
  },
  register: async (
    email: string,
    pass: string,
    name: string,
    role?: UserRole,
    educationLevel?: string,
    targetRole?: string
  ): Promise<UserProfile> => {
    const { data } = await api.post('/auth/register', {
      email,
      password: pass,
      displayName: name,
      role: role || 'student',
      educationLevel,
      targetRole,
    });
    return data;
  },
  googleLogin: async (googleData: {
    email: string;
    displayName?: string;
    photoURL?: string;
    googleId?: string;
    role?: UserRole;
  }): Promise<UserProfile> => {
    const { data } = await api.post('/auth/google', googleData);
    return data;
  },
  getMe: async (): Promise<UserProfile> => {
    const { data } = await api.get('/auth/me');
    return data;
  },
  updateProfile: async (profileData: Partial<UserProfile>): Promise<UserProfile> => {
    const { data } = await api.put('/auth/profile', profileData);
    return data;
  },
  updateRole: async (role: UserRole): Promise<UserProfile> => {
    const { data } = await api.put('/auth/role', { role });
    return data;
  },
  forgotPassword: async (email: string): Promise<{ message: string; otpDemo?: string }> => {
    const { data } = await api.post('/auth/forgot-password', { email });
    return data;
  },
  resetPassword: async (email: string, otp: string, newPassword: string): Promise<{ message: string }> => {
    const { data } = await api.post('/auth/reset-password', { email, otp, newPassword });
    return data;
  },
  getAllUsers: async (): Promise<UserProfile[]> => {
    const { data } = await api.get('/auth/users');
    return data;
  },
  adminUpdateUser: async (id: string, userData: Partial<UserProfile>): Promise<UserProfile> => {
    const { data } = await api.put(`/auth/users/${id}`, userData);
    return data;
  },
  deleteUser: async (id: string): Promise<{ message: string }> => {
    const { data } = await api.delete(`/auth/users/${id}`);
    return data;
  },
};

// Careers API
export const careerApi = {
  getCareers: async (params?: {
    search?: string;
    domain?: string;
    demand?: string;
    targetAudience?: string;
    sort?: string;
  }): Promise<CareerItem[]> => {
    const { data } = await api.get('/careers', { params });
    return data;
  },
  getCareerById: async (idOrSlug: string): Promise<CareerItem> => {
    const { data } = await api.get(`/careers/${idOrSlug}`);
    return data;
  },
  createCareer: async (careerData: Partial<CareerItem>): Promise<CareerItem> => {
    const { data } = await api.post('/careers', careerData);
    return data;
  },
  updateCareer: async (id: string, careerData: Partial<CareerItem>): Promise<CareerItem> => {
    const { data } = await api.put(`/careers/${id}`, careerData);
    return data;
  },
  deleteCareer: async (id: string): Promise<{ message: string }> => {
    const { data } = await api.delete(`/careers/${id}`);
    return data;
  },
};

// Multimedia API
export const multimediaApi = {
  getAll: async (params?: { type?: string; domain?: string; search?: string; featured?: boolean }): Promise<MultimediaItem[]> => {
    const { data } = await api.get('/multimedia', { params });
    return data;
  },
  getById: async (id: string): Promise<MultimediaItem> => {
    const { data } = await api.get(`/multimedia/${id}`);
    return data;
  },
  rate: async (id: string, rating: number): Promise<{ ratingAvg: number; ratingCount: number; message: string }> => {
    const { data } = await api.post(`/multimedia/${id}/rate`, { rating });
    return data;
  },
  create: async (mediaData: Partial<MultimediaItem>): Promise<MultimediaItem> => {
    const { data } = await api.post('/multimedia', mediaData);
    return data;
  },
  update: async (id: string, mediaData: Partial<MultimediaItem>): Promise<MultimediaItem> => {
    const { data } = await api.put(`/multimedia/${id}`, mediaData);
    return data;
  },
  delete: async (id: string): Promise<{ message: string }> => {
    const { data } = await api.delete(`/multimedia/${id}`);
    return data;
  },
};

// Quiz API
export const quizApi = {
  getQuestions: async (): Promise<QuizQuestionItem[]> => {
    const { data } = await api.get('/quiz/questions');
    return data;
  },
  submit: async (answers: any[]): Promise<QuizAttemptResult> => {
    const { data } = await api.post('/quiz/submit', { answers });
    return data;
  },
  getHistory: async (): Promise<any[]> => {
    const { data } = await api.get('/quiz/history');
    return data;
  },
  createQuestion: async (qData: Partial<QuizQuestionItem>): Promise<QuizQuestionItem> => {
    const { data } = await api.post('/quiz/questions', qData);
    return data;
  },
  updateQuestion: async (id: string, qData: Partial<QuizQuestionItem>): Promise<QuizQuestionItem> => {
    const { data } = await api.put(`/quiz/questions/${id}`, qData);
    return data;
  },
  deleteQuestion: async (id: string): Promise<{ message: string }> => {
    const { data } = await api.delete(`/quiz/questions/${id}`);
    return data;
  },
};

// Success Stories API
export const storyApi = {
  getAll: async (params?: { domain?: string; search?: string }): Promise<SuccessStoryItem[]> => {
    const { data } = await api.get('/stories', { params });
    return data;
  },
  getAdminAll: async (): Promise<SuccessStoryItem[]> => {
    const { data } = await api.get('/stories/admin/all');
    return data;
  },
  submit: async (storyData: Partial<SuccessStoryItem>): Promise<SuccessStoryItem> => {
    const { data } = await api.post('/stories', storyData);
    return data;
  },
  like: async (id: string): Promise<{ likesCount: number }> => {
    const { data } = await api.post(`/stories/${id}/like`);
    return data;
  },
  updateStatus: async (id: string, status: 'pending' | 'approved' | 'featured'): Promise<SuccessStoryItem> => {
    const { data } = await api.put(`/stories/${id}/status`, { status });
    return data;
  },
  delete: async (id: string): Promise<{ message: string }> => {
    const { data } = await api.delete(`/stories/${id}`);
    return data;
  },
};

// Resources API
export const resourceApi = {
  getAll: async (params?: { category?: string; targetAudience?: string; search?: string }): Promise<ResourceItem[]> => {
    const { data } = await api.get('/resources', { params });
    return data;
  },
  download: async (id: string): Promise<{ downloadsCount: number; fileUrl: string; title: string; message: string }> => {
    const { data } = await api.post(`/resources/${id}/download`);
    return data;
  },
  create: async (resData: Partial<ResourceItem>): Promise<ResourceItem> => {
    const { data } = await api.post('/resources', resData);
    return data;
  },
  update: async (id: string, resData: Partial<ResourceItem>): Promise<ResourceItem> => {
    const { data } = await api.put(`/resources/${id}`, resData);
    return data;
  },
  delete: async (id: string): Promise<{ message: string }> => {
    const { data } = await api.delete(`/resources/${id}`);
    return data;
  },
};

// Feedback API
export const feedbackApi = {
  submit: async (feedbackData: {
    userName: string;
    userEmail: string;
    category: string;
    subject?: string;
    message: string;
    sentiment?: string;
  }): Promise<{ feedback: FeedbackItem; message: string }> => {
    const { data } = await api.post('/feedback', feedbackData);
    return data;
  },
  getAll: async (params?: { category?: string; status?: string; sentiment?: string }): Promise<{ items: FeedbackItem[]; stats: any }> => {
    const { data } = await api.get('/feedback', { params });
    return data;
  },
  respond: async (id: string, updateData: { adminResponse?: string; status?: string }): Promise<FeedbackItem> => {
    const { data } = await api.put(`/feedback/${id}`, updateData);
    return data;
  },
  delete: async (id: string): Promise<{ message: string }> => {
    const { data } = await api.delete(`/feedback/${id}`);
    return data;
  },
};

// Bookmarks & Sticky Notes API
export const bookmarkApi = {
  getAll: async (): Promise<BookmarkItem[]> => {
    const { data } = await api.get('/bookmarks');
    return data;
  },
  toggle: async (bookmarkData: {
    itemType: 'career' | 'multimedia' | 'resource';
    itemId: string;
    title: string;
    subtitle?: string;
    notes?: string;
    tags?: string[];
  }): Promise<{ bookmarked: boolean; bookmark?: BookmarkItem; message: string }> => {
    const { data } = await api.post('/bookmarks', bookmarkData);
    return data;
  },
  updateNotes: async (id: string, notes: string, tags?: string[]): Promise<BookmarkItem> => {
    const { data } = await api.put(`/bookmarks/${id}/notes`, { notes, tags });
    return data;
  },
  delete: async (id: string): Promise<{ message: string }> => {
    const { data } = await api.delete(`/bookmarks/${id}`);
    return data;
  },
};

// Notifications API
export const notificationApi = {
  getAll: async (): Promise<{ notifications: NotificationItem[]; unreadCount: number }> => {
    const { data } = await api.get('/notifications');
    return data;
  },
  markRead: async (id: string): Promise<NotificationItem> => {
    const { data } = await api.put(`/notifications/${id}/read`);
    return data;
  },
  markAllRead: async (): Promise<{ message: string }> => {
    const { data } = await api.put('/notifications/read-all');
    return data;
  },
  broadcast: async (notifData: { title: string; message: string; type?: string; link?: string }): Promise<NotificationItem> => {
    const { data } = await api.post('/notifications/broadcast', notifData);
    return data;
  },
};

// Admin Stats & Controls API
export const adminApi = {
  getStats: async (): Promise<AdminStats> => {
    const { data } = await api.get('/admin/stats');
    return data;
  },
  triggerSeed: async (): Promise<{ message: string }> => {
    const { data } = await api.post('/admin/stats/seed');
    return data;
  },
};
