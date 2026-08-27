import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import {
  careerApi,
  multimediaApi,
  quizApi,
  storyApi,
  resourceApi,
  feedbackApi,
  bookmarkApi,
  notificationApi,
} from '../services/api';
import {
  CareerItem,
  MultimediaItem,
  QuizQuestionItem,
  QuizAttemptResult,
  SuccessStoryItem,
  ResourceItem,
  FeedbackItem,
  BookmarkItem,
  NotificationItem,
} from '../types';
import {
  Compass,
  LayoutDashboard,
  BrainCircuit,
  Search,
  Video,
  FileText,
  Bookmark,
  MessageSquare,
  User,
  LogOut,
  Bell,
  Sparkles,
  TrendingUp,
  Star,
  Download,
  Share2,
  CheckCircle2,
  AlertCircle,
  Clock,
  ChevronRight,
  Filter,
  Plus,
  Edit3,
  Trash2,
  X,
  Play,
  Volume2,
  SlidersHorizontal,
  GraduationCap,
  Briefcase,
  UserCheck,
  Shield,
  ArrowRight,
  Loader2,
  ExternalLink,
  BookOpen,
  Award,
  Zap,
  Activity,
  Layers,
  CircleDot,
  ArrowUpRight,
} from 'lucide-react';

type TabType =
  | 'overview'
  | 'careers'
  | 'quiz'
  | 'multimedia'
  | 'stories'
  | 'resources'
  | 'bookmarks'
  | 'feedback';

export const DashboardPage: React.FC = () => {
  const { profile, role, logout, switchRole, updateProfile } = useAuth();
  const navigate = useNavigate();

  // Active Navigation Tab
  const [activeTab, setActiveTab] = useState<TabType>('overview');

  // Notifications state
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadNotifCount, setUnreadNotifCount] = useState(0);
  const [isNotifDropdownOpen, setIsNotifDropdownOpen] = useState(false);

  // Global Data States
  const [careers, setCareers] = useState<CareerItem[]>([]);
  const [multimedia, setMultimedia] = useState<MultimediaItem[]>([]);
  const [stories, setStories] = useState<SuccessStoryItem[]>([]);
  const [resources, setResources] = useState<ResourceItem[]>([]);
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>([]);
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestionItem[]>([]);
  const [quizHistory, setQuizHistory] = useState<any[]>([]);
  const [dataLoading, setDataLoading] = useState(true);

  // --- CAREER BANK STATE ---
  const [careerSearch, setCareerSearch] = useState('');
  const [selectedDomain, setSelectedDomain] = useState('All Domains');
  const [selectedDemand, setSelectedDemand] = useState('all');
  const [selectedSalaryMax, setSelectedSalaryMax] = useState(350000);
  const [selectedCareerDetail, setSelectedCareerDetail] = useState<CareerItem | null>(null);

  // --- QUIZ STATE ---
  const [quizStep, setQuizStep] = useState(0); // 0 = Intro, 1..N = questions, N+1 = results
  const [quizAnswers, setQuizAnswers] = useState<any[]>([]);
  const [quizResult, setQuizResult] = useState<QuizAttemptResult | null>(null);
  const [quizSubmitting, setQuizSubmitting] = useState(false);

  // --- MULTIMEDIA PLAYER STATE ---
  const [activeMedia, setActiveMedia] = useState<MultimediaItem | null>(null);
  const [showTranscript, setShowTranscript] = useState(false);
  const [userRatingVal, setUserRatingVal] = useState(5);
  const [ratingSubmitted, setRatingSubmitted] = useState(false);

  // --- SUCCESS STORIES STATE ---
  const [storyDomainFilter, setStoryDomainFilter] = useState('All Domains');
  const [isStoryModalOpen, setIsStoryModalOpen] = useState(false);
  const [newStory, setNewStory] = useState({
    domain: 'Software & Cloud',
    currentRole: '',
    company: '',
    educationPath: '',
    challenges: '',
    outcome: '',
    advice: '',
  });
  const [storySubmitting, setStorySubmitting] = useState(false);
  const [storySuccessMsg, setStorySuccessMsg] = useState('');

  // --- RESOURCE LIBRARY STATE ---
  const [resourceCategoryFilter, setResourceCategoryFilter] = useState('All Categories');
  const [selectedResourcePreview, setSelectedResourcePreview] = useState<ResourceItem | null>(null);
  const [downloadSuccessMsg, setDownloadSuccessMsg] = useState('');

  // --- STICKY NOTES & BOOKMARKS STATE ---
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [editingNoteText, setEditingNoteText] = useState('');
  const [exportCopied, setExportCopied] = useState(false);

  // --- FEEDBACK STATE ---
  const [feedbackCategory, setFeedbackCategory] = useState<'bug' | 'suggestion' | 'query' | 'appreciation'>('suggestion');
  const [feedbackSubject, setFeedbackSubject] = useState('');
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [feedbackLoading, setFeedbackLoading] = useState(false);
  const [feedbackSuccessMsg, setFeedbackSuccessMsg] = useState('');

  // --- PROFILE EDIT MODAL STATE ---
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [editName, setEditName] = useState(profile?.displayName || '');
  const [editPhone, setEditPhone] = useState(profile?.phoneNumber || '');
  const [editEducation, setEditEducation] = useState(profile?.educationLevel || 'Undergraduate');
  const [editTargetRole, setEditTargetRole] = useState(profile?.targetRole || 'Software Engineer');
  const [editSkills, setEditSkills] = useState(profile?.skills?.join(', ') || 'React, TypeScript, Cloud');
  const [editInterests, setEditInterests] = useState(profile?.interests?.join(', ') || 'AI, Web Development');
  const [editExperience, setEditExperience] = useState(profile?.workExperience || '');
  const [editResumeUrl, setEditResumeUrl] = useState(profile?.resumeUrl || '');
  const [editBio, setEditBio] = useState(profile?.bio || '');
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileSaveSuccess, setProfileSaveSuccess] = useState(false);

  // Load all dynamic data on mount
  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    setDataLoading(true);
    try {
      const [careersRes, mediaRes, storiesRes, resourcesRes, bookmarksRes, quizQRes, quizHistRes, notifsRes] =
        await Promise.allSettled([
          careerApi.getCareers({}),
          multimediaApi.getAll({}),
          storyApi.getAll({}),
          resourceApi.getAll({}),
          bookmarkApi.getAll(),
          quizApi.getQuestions(),
          quizApi.getHistory(),
          notificationApi.getAll(),
        ]);

      if (careersRes.status === 'fulfilled') setCareers(careersRes.value);
      if (mediaRes.status === 'fulfilled') {
        setMultimedia(mediaRes.value);
        if (mediaRes.value.length > 0 && !activeMedia) {
          setActiveMedia(mediaRes.value[0]);
        }
      }
      if (storiesRes.status === 'fulfilled') setStories(storiesRes.value);
      if (resourcesRes.status === 'fulfilled') setResources(resourcesRes.value);
      if (bookmarksRes.status === 'fulfilled') setBookmarks(bookmarksRes.value);
      if (quizQRes.status === 'fulfilled') setQuizQuestions(quizQRes.value);
      if (quizHistRes.status === 'fulfilled') setQuizHistory(quizHistRes.value);
      if (notifsRes.status === 'fulfilled') {
        setNotifications(notifsRes.value.notifications);
        setUnreadNotifCount(notifsRes.value.unreadCount);
      }
    } catch (e) {
      console.error('Error loading dashboard data:', e);
    } finally {
      setDataLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Toggle Bookmark helper
  const handleToggleBookmark = async (item: {
    type: 'career' | 'multimedia' | 'resource';
    id: string;
    title: string;
    subtitle?: string;
  }) => {
    try {
      const res = await bookmarkApi.toggle({
        itemType: item.type,
        itemId: item.id,
        title: item.title,
        subtitle: item.subtitle,
      });

      if (res.bookmarked && res.bookmark) {
        setBookmarks((prev) => [res.bookmark!, ...prev]);
      } else {
        setBookmarks((prev) => prev.filter((b) => !(b.itemType === item.type && b.itemId === item.id)));
      }
    } catch (e) {
      console.error('Failed to toggle bookmark', e);
    }
  };

  const isItemBookmarked = (type: string, id: string) => {
    return bookmarks.some((b) => b.itemType === type && b.itemId === id);
  };

  // Profile Save
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileSaving(true);
    setProfileSaveSuccess(false);
    try {
      await updateProfile({
        displayName: editName.trim(),
        phoneNumber: editPhone.trim(),
        educationLevel: editEducation,
        targetRole: editTargetRole,
        skills: editSkills.split(',').map((s) => s.trim()).filter(Boolean),
        interests: editInterests.split(',').map((i) => i.trim()).filter(Boolean),
        workExperience: editExperience.trim(),
        resumeUrl: editResumeUrl.trim(),
        bio: editBio.trim(),
      });
      setProfileSaveSuccess(true);
      setTimeout(() => {
        setIsProfileModalOpen(false);
        setProfileSaveSuccess(false);
      }, 1000);
    } catch (e) {
      console.error('Failed to update profile', e);
    } finally {
      setProfileSaving(false);
    }
  };

  // Quiz submission
  const handleAnswerQuizOption = (option: any) => {
    const nextAnswers = [...quizAnswers, option];
    setQuizAnswers(nextAnswers);

    if (quizStep < quizQuestions.length) {
      setQuizStep(quizStep + 1);
    } else {
      handleCompleteQuiz(nextAnswers);
    }
  };

  const handleCompleteQuiz = async (answers: any[]) => {
    setQuizSubmitting(true);
    try {
      const result = await quizApi.submit(answers);
      setQuizResult(result);
      setQuizStep(quizQuestions.length + 1);
      quizApi.getHistory().then(setQuizHistory).catch(() => {});
    } catch (e) {
      console.error('Failed to submit quiz', e);
    } finally {
      setQuizSubmitting(false);
    }
  };

  const handleResetQuiz = () => {
    setQuizStep(0);
    setQuizAnswers([]);
    setQuizResult(null);
  };

  // Rate multimedia
  const handleRateMedia = async (rating: number) => {
    if (!activeMedia) return;
    try {
      const res = await multimediaApi.rate(activeMedia._id, rating);
      setActiveMedia({ ...activeMedia, ratingAvg: res.ratingAvg, ratingCount: res.ratingCount });
      setUserRatingVal(rating);
      setRatingSubmitted(true);
      setTimeout(() => setRatingSubmitted(false), 2000);
    } catch (e) {
      console.error('Failed to rate multimedia', e);
    }
  };

  // Submit Success Story
  const handleSubmitStory = async (e: React.FormEvent) => {
    e.preventDefault();
    setStorySubmitting(true);
    setStorySuccessMsg('');
    try {
      const res = await storyApi.submit({
        name: profile?.displayName || 'Community Seeker',
        domain: newStory.domain,
        currentRole: newStory.currentRole,
        company: newStory.company,
        educationPath: newStory.educationPath,
        challenges: newStory.challenges,
        outcome: newStory.outcome,
        advice: newStory.advice,
        milestones: [
          { year: 'Phase 1', title: 'Starting Out', description: newStory.challenges },
          { year: 'Phase 2', title: 'Key Milestone', description: newStory.outcome },
        ],
      });
      setStories([res, ...stories]);
      setStorySuccessMsg('Your career journey has been published to the community.');
      setTimeout(() => {
        setIsStoryModalOpen(false);
        setStorySuccessMsg('');
        setNewStory({
          domain: 'Software & Cloud',
          currentRole: '',
          company: '',
          educationPath: '',
          challenges: '',
          outcome: '',
          advice: '',
        });
      }, 1500);
    } catch (e) {
      console.error('Failed to submit story', e);
    } finally {
      setStorySubmitting(false);
    }
  };

  // Download Resource
  const handleDownloadResource = async (resItem: ResourceItem) => {
    try {
      await resourceApi.download(resItem._id);
      setDownloadSuccessMsg(`Download initiated: ${resItem.title}`);
      setTimeout(() => setDownloadSuccessMsg(''), 3000);
    } catch (e) {
      console.error('Failed to record download', e);
    }
  };

  // Sticky Note update
  const handleSaveStickyNote = async (bookmarkId: string) => {
    try {
      const updated = await bookmarkApi.updateNotes(bookmarkId, editingNoteText);
      setBookmarks((prev) => prev.map((b) => (b._id === bookmarkId ? updated : b)));
      setEditingNoteId(null);
    } catch (e) {
      console.error('Failed to update note', e);
    }
  };

  // Submit Feedback
  const handleSubmitFeedback = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackMessage.trim()) return;
    setFeedbackLoading(true);
    setFeedbackSuccessMsg('');
    try {
      await feedbackApi.submit({
        userName: profile?.displayName || 'Seeker',
        userEmail: profile?.email || 'user@example.com',
        category: feedbackCategory,
        subject: feedbackSubject || `${feedbackCategory.toUpperCase()} Submission`,
        message: feedbackMessage,
      });
      setFeedbackSuccessMsg('Feedback submitted successfully.');
      setFeedbackSubject('');
      setFeedbackMessage('');
    } catch (e) {
      console.error('Failed to submit feedback', e);
    } finally {
      setFeedbackLoading(false);
    }
  };

  // Export Bookmarks as Summary Text
  const handleExportPassportSummary = () => {
    const summaryText = `PATHSEEKER CAREER PASSPORT SUMMARY
=========================================
Seeker: ${profile?.displayName} (${profile?.email})
Assigned Role: ${role.toUpperCase()}
Career Readiness Score: ${profile?.readinessScore || 78}%
Target Role: ${profile?.targetRole || 'Software Engineer'}

SAVED BOOKMARKS & NOTES (${bookmarks.length})
${bookmarks
  .map(
    (b, idx) =>
      `${idx + 1}. [${b.itemType.toUpperCase()}] ${b.title}\n   Metadata: ${b.subtitle || 'N/A'}\n   Personal Note: ${b.notes || 'None'}`
  )
  .join('\n\n')}

Generated: ${new Date().toLocaleString()} via PathSeeker (Aptech TechWiz 6)`;

    navigator.clipboard.writeText(summaryText);
    setExportCopied(true);
    setTimeout(() => setExportCopied(false), 2500);
  };

  const getGreeting = () => {
    const name = profile?.displayName?.split(' ')[0] || 'Seeker';
    if (role === 'student') return `Welcome back, ${name}. Ready to explore foundational paths?`;
    if (role === 'graduate') return `Hello ${name}. Let's prepare your applications & certifications.`;
    if (role === 'professional') return `Good day, ${name}. Ready to accelerate leadership and career shifts?`;
    return `Welcome to your Career Passport, ${name}.`;
  };

  const filteredCareers = careers.filter((c) => {
    const matchSearch =
      !careerSearch ||
      c.title.toLowerCase().includes(careerSearch.toLowerCase()) ||
      c.requiredSkills.some((s) => s.toLowerCase().includes(careerSearch.toLowerCase()));

    const matchDomain = selectedDomain === 'All Domains' || c.domain === selectedDomain;
    const matchDemand = selectedDemand === 'all' || c.jobDemand === selectedDemand;
    const matchSalary = (c.salaryRange?.senior || 100000) <= selectedSalaryMax;

    return matchSearch && matchDomain && matchDemand && matchSalary;
  });

  return (
    <div className="min-h-screen bg-black text-white flex flex-col font-sans selection:bg-zinc-800 selection:text-white">
      {/* 1. TOP HEADER & TELEMETRY BAR */}
      <header className="sticky top-0 z-40 bg-zinc-950/90 backdrop-blur-xl border-b border-white/[0.08] px-4 sm:px-8 py-3 flex items-center justify-between gap-4">
        {/* Left: Brand & Home Link */}
        <div className="flex items-center gap-4">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center font-bold text-xs shadow-sm">
              <Compass className="w-4 h-4 text-black" />
            </div>
            <div className="hidden sm:flex flex-col text-left">
              <span className="font-semibold text-xs tracking-tight text-white leading-none">
                PathSeeker
              </span>
              <span className="text-[10px] text-zinc-500 font-mono mt-0.5">Career Passport Portal</span>
            </div>
          </Link>
        </div>

        {/* Center: Navigation Tabs */}
        <nav className="hidden xl:flex items-center gap-1 bg-white/[0.03] border border-white/10 rounded-full px-2 py-1">
          {[
            { id: 'overview', label: 'Passport', icon: LayoutDashboard },
            { id: 'careers', label: 'Career Bank', icon: Search },
            { id: 'quiz', label: 'AI Assessment', icon: BrainCircuit },
            { id: 'multimedia', label: 'Multimedia', icon: Video },
            { id: 'stories', label: 'Stories', icon: BookOpen },
            { id: 'resources', label: 'Resources', icon: FileText },
            { id: 'bookmarks', label: 'Sticky Notes', icon: Bookmark },
            { id: 'feedback', label: 'Feedback', icon: MessageSquare },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
                  isActive
                    ? 'bg-white text-black shadow-sm font-semibold'
                    : 'text-zinc-400 hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right: Notifications & User Profile Card */}
        <div className="flex items-center gap-3">
          {/* Notification Bell */}
          <div className="relative">
            <button
              onClick={() => setIsNotifDropdownOpen(!isNotifDropdownOpen)}
              className="p-2 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] text-zinc-400 hover:text-white border border-white/10 transition-all cursor-pointer relative"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadNotifCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-white text-black text-[9px] font-bold flex items-center justify-center">
                  {unreadNotifCount}
                </span>
              )}
            </button>

            {/* Notification Dropdown */}
            {isNotifDropdownOpen && (
              <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-zinc-950 border border-white/10 rounded-2xl shadow-2xl p-4 z-50 animate-in fade-in slide-in-from-top-2 text-left">
                <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
                  <span className="font-semibold text-xs text-white flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-zinc-300" />
                    In-App Notification Center
                  </span>
                  <button
                    onClick={() => {
                      notificationApi.markAllRead().then(() => setUnreadNotifCount(0));
                    }}
                    className="text-[10px] text-zinc-400 hover:text-white underline font-medium cursor-pointer"
                  >
                    Mark all read
                  </button>
                </div>

                <div className="py-2 divide-y divide-white/5 max-h-64 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <p className="text-xs text-zinc-500 py-4 text-center">No notifications yet</p>
                  ) : (
                    notifications.map((notif) => (
                      <div key={notif._id} className="py-2.5 space-y-1">
                        <div className="flex items-center justify-between text-xs font-medium text-white">
                          <span>{notif.title}</span>
                          <span className="text-[9px] text-zinc-500 font-mono">
                            {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <p className="text-[11px] text-zinc-400">{notif.message}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Profile Pill */}
          <div className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full bg-white/[0.03] border border-white/10">
            <div className="w-6 h-6 rounded-full bg-white text-black flex items-center justify-center font-bold text-[11px]">
              {(profile?.displayName || 'U')[0].toUpperCase()}
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-xs font-medium text-white leading-tight truncate max-w-[120px]">
                {profile?.displayName}
              </p>
              <p className="text-[10px] text-zinc-500 font-mono uppercase leading-none mt-0.5">
                {role}
              </p>
            </div>
          </div>

          {/* Sign Out Button */}
          <button
            onClick={handleLogout}
            className="p-2 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] text-zinc-400 hover:text-white border border-white/10 transition-all cursor-pointer"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Mobile Tab Selector */}
      <div className="xl:hidden flex items-center gap-2 overflow-x-auto p-3 bg-zinc-950 border-b border-white/[0.08] scrollbar-none">
        {[
          { id: 'overview', label: 'Passport', icon: LayoutDashboard },
          { id: 'careers', label: 'Career Bank', icon: Search },
          { id: 'quiz', label: 'AI Quiz', icon: BrainCircuit },
          { id: 'multimedia', label: 'Multimedia', icon: Video },
          { id: 'stories', label: 'Stories', icon: BookOpen },
          { id: 'resources', label: 'Resources', icon: FileText },
          { id: 'bookmarks', label: 'Sticky Notes', icon: Bookmark },
          { id: 'feedback', label: 'Feedback', icon: MessageSquare },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabType)}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap cursor-pointer ${
                isActive ? 'bg-white text-black font-semibold' : 'bg-white/[0.03] text-zinc-400 border border-white/5'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* 2. MAIN DASHBOARD CONTENT AREA */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-8 text-left">
        {/* TAB 1: CAREER PASSPORT OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-6 animate-in fade-in">
            {/* Top Greeting Banner */}
            <div className="p-6 sm:p-8 rounded-2xl bg-zinc-950 border border-white/[0.08] shadow-xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-2 z-10">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase bg-white/5 text-zinc-300 border border-white/10">
                    Stage: {role}
                  </span>
                  <span className="text-xs text-zinc-400 font-medium">&bull; Target: {profile?.targetRole || 'Full-Stack Developer'}</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-white">{getGreeting()}</h1>
                <p className="text-xs sm:text-sm text-zinc-400 max-w-xl leading-relaxed">
                  Your Career Passport tracks your industry readiness, verified quiz traits, bookmarked roles, and curated multimedia lectures.
                </p>
              </div>

              {/* Readiness Score */}
              <div className="z-10 flex items-center gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/[0.08] shrink-0">
                <div className="w-12 h-12 rounded-xl bg-white text-black flex flex-col items-center justify-center text-center">
                  <span className="text-base font-bold text-black leading-none">
                    {profile?.readinessScore || 78}%
                  </span>
                  <span className="text-[8px] uppercase tracking-wider font-mono font-bold mt-0.5">Score</span>
                </div>
                <div className="space-y-1 text-xs">
                  <p className="font-semibold text-white">Career Readiness</p>
                  <p className="text-[11px] text-zinc-500">Based on skills &amp; assessment</p>
                  <button
                    onClick={() => setIsProfileModalOpen(true)}
                    className="text-[11px] text-zinc-300 hover:text-white font-medium underline cursor-pointer"
                  >
                    Edit Profile Details &rarr;
                  </button>
                </div>
              </div>
            </div>

            {/* Role Gateway Banner */}
            {role === 'admin' ? (
              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2.5">
                  <Shield className="w-4 h-4 text-zinc-300 shrink-0" />
                  <div>
                    <span className="font-semibold text-white">Administrator Privileges Active</span>
                    <p className="text-[11px] text-zinc-400">Full control over database records, stories moderation &amp; usage statistics.</p>
                  </div>
                </div>
                <Link
                  to="/admin/dashboard"
                  className="px-4 py-2 rounded-xl bg-white text-black font-semibold text-xs hover:bg-zinc-200 transition-all flex items-center gap-1.5 shrink-0"
                >
                  <span>Enter Admin Control Suite</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.08] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2">
                  <CircleDot className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                  <span className="text-zinc-300">
                    Current Persona: <strong className="capitalize text-white">{role}</strong>. Evaluate another career stage?
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => switchRole(role === 'student' ? 'graduate' : role === 'graduate' ? 'professional' : 'student')}
                    className="px-3 py-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-zinc-300 border border-white/10 font-medium cursor-pointer text-xs"
                  >
                    Cycle Role ({role === 'student' ? 'Graduate' : role === 'graduate' ? 'Professional' : 'Student'})
                  </button>
                  <button
                    onClick={() => switchRole('admin')}
                    className="px-3 py-1.5 rounded-lg bg-white text-black hover:bg-zinc-200 font-semibold cursor-pointer text-xs"
                  >
                    Switch to Admin
                  </button>
                </div>
              </div>
            )}

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 rounded-2xl bg-zinc-950 border border-white/[0.08] space-y-1">
                <div className="flex items-center justify-between text-zinc-400">
                  <Search className="w-4 h-4" />
                  <span className="text-[9px] font-mono font-medium uppercase">Database</span>
                </div>
                <div className="text-2xl font-semibold text-white font-mono">{careers.length}</div>
                <p className="text-[11px] text-zinc-500">Global Career Profiles</p>
              </div>

              <div className="p-5 rounded-2xl bg-zinc-950 border border-white/[0.08] space-y-1">
                <div className="flex items-center justify-between text-zinc-400">
                  <BrainCircuit className="w-4 h-4" />
                  <span className="text-[9px] font-mono font-medium uppercase">Assessment</span>
                </div>
                <div className="text-2xl font-semibold text-white font-mono">
                  {quizHistory.length > 0 ? `${quizHistory.length} Done` : 'Ready'}
                </div>
                <p className="text-[11px] text-zinc-500">AI Quiz Progress</p>
              </div>

              <div className="p-5 rounded-2xl bg-zinc-950 border border-white/[0.08] space-y-1">
                <div className="flex items-center justify-between text-zinc-400">
                  <Bookmark className="w-4 h-4" />
                  <span className="text-[9px] font-mono font-medium uppercase">Passport</span>
                </div>
                <div className="text-2xl font-semibold text-white font-mono">{bookmarks.length}</div>
                <p className="text-[11px] text-zinc-500">Saved Sticky Bookmarks</p>
              </div>

              <div className="p-5 rounded-2xl bg-zinc-950 border border-white/[0.08] space-y-1">
                <div className="flex items-center justify-between text-zinc-400">
                  <Download className="w-4 h-4" />
                  <span className="text-[9px] font-mono font-medium uppercase">Toolkits</span>
                </div>
                <div className="text-2xl font-semibold text-white font-mono">{resources.length}</div>
                <p className="text-[11px] text-zinc-500">Downloadable Resources</p>
              </div>
            </div>

            {/* Dynamic Widgets */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Top Picks */}
              <div className="p-6 rounded-2xl bg-zinc-950 border border-white/[0.08] space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-zinc-300" />
                    <h3 className="text-sm font-semibold text-white">Top Picks For Your Profile</h3>
                  </div>
                  <button
                    onClick={() => setActiveTab('careers')}
                    className="text-xs text-zinc-400 hover:text-white font-medium"
                  >
                    View all &rarr;
                  </button>
                </div>

                <div className="space-y-2.5">
                  {careers.slice(0, 3).map((career) => (
                    <div
                      key={career._id}
                      className="p-3.5 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/[0.06] flex items-center justify-between gap-3 transition-all cursor-pointer"
                      onClick={() => {
                        setSelectedCareerDetail(career);
                        setActiveTab('careers');
                      }}
                    >
                      <div>
                        <span className="text-[9px] font-mono font-medium uppercase px-2 py-0.5 rounded bg-white/5 text-zinc-400">
                          {career.domain}
                        </span>
                        <h4 className="text-xs font-semibold text-white mt-1">{career.title}</h4>
                        <p className="text-[11px] text-zinc-400 font-mono mt-0.5">
                          Up to ${career.salaryRange?.senior?.toLocaleString()} / yr
                        </p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-zinc-500" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Featured Session */}
              <div className="p-6 rounded-2xl bg-zinc-950 border border-white/[0.08] space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Video className="w-4 h-4 text-zinc-300" />
                    <h3 className="text-sm font-semibold text-white">Featured Multimedia Session</h3>
                  </div>
                  <button
                    onClick={() => setActiveTab('multimedia')}
                    className="text-xs text-zinc-400 hover:text-white font-medium"
                  >
                    Explore all &rarr;
                  </button>
                </div>

                {multimedia.length > 0 && (
                  <div
                    className="rounded-xl bg-white/[0.02] border border-white/[0.06] overflow-hidden hover:border-white/20 transition-all cursor-pointer"
                    onClick={() => {
                      setActiveMedia(multimedia[0]);
                      setActiveTab('multimedia');
                    }}
                  >
                    <div className="aspect-video relative bg-zinc-900">
                      <img
                        src={multimedia[0].thumbnailUrl}
                        alt="Thumbnail"
                        className="w-full h-full object-cover opacity-80"
                      />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <div className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center shadow-lg">
                          <Play className="w-4 h-4 fill-black ml-0.5" />
                        </div>
                      </div>
                    </div>
                    <div className="p-4 space-y-1">
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="text-zinc-400 font-mono uppercase">{multimedia[0].domain}</span>
                        <span className="text-zinc-300 font-mono flex items-center gap-1">
                          <Star className="w-3 h-3 fill-zinc-300 text-zinc-300" /> {multimedia[0].ratingAvg}
                        </span>
                      </div>
                      <h4 className="text-xs font-semibold text-white line-clamp-1">{multimedia[0].title}</h4>
                      <p className="text-[11px] text-zinc-500">Speaker: {multimedia[0].speaker?.name}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: CAREER BANK */}
        {activeTab === 'careers' && (
          <div className="space-y-6 animate-in fade-in">
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-2xl font-semibold tracking-tight text-white">Dynamic Career Bank</h2>
                  <p className="text-xs text-zinc-400">
                    Filter by domain, required skills, senior expected compensation, and demand metrics.
                  </p>
                </div>
                <div className="text-xs font-mono text-zinc-400">
                  Showing {filteredCareers.length} of {careers.length} careers
                </div>
              </div>

              {/* Filter Bar */}
              <div className="p-4 rounded-2xl bg-zinc-950 border border-white/[0.08] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search roles or skills..."
                    value={careerSearch}
                    onChange={(e) => setCareerSearch(e.target.value)}
                    className="w-full bg-white/[0.03] border border-white/10 rounded-xl pl-3 pr-8 py-2 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-white"
                  />
                  <Search className="w-3.5 h-3.5 text-zinc-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>

                <div>
                  <select
                    value={selectedDomain}
                    onChange={(e) => setSelectedDomain(e.target.value)}
                    className="w-full bg-zinc-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-white cursor-pointer"
                  >
                    <option value="All Domains">All Domains</option>
                    <option value="Software & Cloud">Software &amp; Cloud</option>
                    <option value="AI & Data Science">AI &amp; Data Science</option>
                    <option value="Cybersecurity">Cybersecurity</option>
                    <option value="Design & UX">Design &amp; UX</option>
                    <option value="Healthcare & Biotech">Healthcare &amp; Biotech</option>
                    <option value="Fintech & Business">Fintech &amp; Business</option>
                    <option value="Product & Strategy">Product &amp; Strategy</option>
                  </select>
                </div>

                <div>
                  <select
                    value={selectedDemand}
                    onChange={(e) => setSelectedDemand(e.target.value)}
                    className="w-full bg-zinc-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-white cursor-pointer"
                  >
                    <option value="all">All Demand Levels</option>
                    <option value="Explosive">Explosive Demand</option>
                    <option value="High">High Demand</option>
                    <option value="Moderate">Moderate Demand</option>
                  </select>
                </div>

                <div className="flex flex-col justify-center space-y-1">
                  <div className="flex justify-between text-[11px] text-zinc-400">
                    <span>Max Salary:</span>
                    <span className="font-mono font-medium text-white">${selectedSalaryMax.toLocaleString()}</span>
                  </div>
                  <input
                    type="range"
                    min={60000}
                    max={350000}
                    step={10000}
                    value={selectedSalaryMax}
                    onChange={(e) => setSelectedSalaryMax(Number(e.target.value))}
                    className="w-full accent-white cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* Careers Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredCareers.map((career) => {
                const bookmarked = isItemBookmarked('career', career._id);
                return (
                  <div
                    key={career._id}
                    className="p-5 rounded-2xl bg-zinc-950 border border-white/[0.08] hover:border-white/20 transition-all flex flex-col justify-between space-y-4"
                  >
                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono uppercase px-2.5 py-0.5 rounded-full bg-white/5 text-zinc-300 border border-white/10">
                          {career.domain}
                        </span>
                        <button
                          onClick={() =>
                            handleToggleBookmark({
                              type: 'career',
                              id: career._id,
                              title: career.title,
                              subtitle: `${career.domain} &bull; $${career.salaryRange?.senior?.toLocaleString()}`,
                            })
                          }
                          className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                            bookmarked
                              ? 'bg-white text-black border-white'
                              : 'bg-white/[0.02] text-zinc-500 border-white/5 hover:text-white'
                          }`}
                          title={bookmarked ? 'Remove Bookmark' : 'Bookmark Career'}
                        >
                          <Bookmark className={`w-3.5 h-3.5 ${bookmarked ? 'fill-black' : ''}`} />
                        </button>
                      </div>

                      <h3 className="text-sm font-semibold text-white">{career.title}</h3>
                      <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                        {career.summary || career.description}
                      </p>
                    </div>

                    <div className="space-y-3 pt-3 border-t border-white/5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-zinc-500">Salary:</span>
                        <span className="font-mono text-zinc-200">
                          ${career.salaryRange?.entry?.toLocaleString()} - ${career.salaryRange?.senior?.toLocaleString()}
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-1">
                        {career.requiredSkills?.slice(0, 3).map((skill) => (
                          <span key={skill} className="px-2 py-0.5 text-[10px] rounded bg-white/[0.04] text-zinc-400 border border-white/[0.04]">
                            {skill}
                          </span>
                        ))}
                      </div>

                      <button
                        onClick={() => setSelectedCareerDetail(career)}
                        className="w-full py-2 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 text-zinc-200 text-xs font-medium flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                      >
                        <span>View Blueprint</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* CAREER DETAILS MODAL */}
        {selectedCareerDetail && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <div className="bg-zinc-950 border border-white/10 rounded-2xl p-6 sm:p-8 max-w-2xl w-full max-h-[85vh] overflow-y-auto shadow-2xl space-y-6 text-white text-left animate-in zoom-in-95">
              <div className="flex items-start justify-between border-b border-white/[0.08] pb-4">
                <div>
                  <span className="text-[10px] font-mono uppercase px-2.5 py-0.5 rounded-full bg-white/5 text-zinc-300 border border-white/10">
                    {selectedCareerDetail.domain}
                  </span>
                  <h2 className="text-xl font-semibold mt-2">{selectedCareerDetail.title}</h2>
                  <p className="text-xs text-zinc-400 mt-0.5">Growth Outlook: {selectedCareerDetail.growthRate}</p>
                </div>
                <button
                  onClick={() => setSelectedCareerDetail(null)}
                  className="w-7 h-7 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-zinc-400 hover:text-white cursor-pointer shrink-0"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Salary Breakdown */}
              <div className="grid grid-cols-3 gap-3 p-4 rounded-xl bg-white/[0.02] border border-white/[0.08] text-center font-mono">
                <div>
                  <p className="text-[10px] text-zinc-500 uppercase font-sans">Entry Level</p>
                  <p className="text-xs font-semibold text-white mt-0.5">
                    ${selectedCareerDetail.salaryRange?.entry?.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-zinc-500 uppercase font-sans">Mid Career</p>
                  <p className="text-xs font-semibold text-zinc-300 mt-0.5">
                    ${selectedCareerDetail.salaryRange?.mid?.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-zinc-500 uppercase font-sans">Senior / Lead</p>
                  <p className="text-xs font-semibold text-white mt-0.5">
                    ${selectedCareerDetail.salaryRange?.senior?.toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="space-y-1.5 text-xs text-zinc-300 leading-relaxed">
                <h4 className="font-semibold text-white">Role Overview:</h4>
                <p>{selectedCareerDetail.description}</p>
              </div>

              <div className="space-y-2 text-xs">
                <h4 className="font-semibold text-white">Required Skills Blueprint:</h4>
                <div className="flex flex-wrap gap-1.5">
                  {selectedCareerDetail.requiredSkills?.map((skill) => (
                    <span key={skill} className="px-2.5 py-1 rounded-lg bg-white/[0.04] text-zinc-300 border border-white/[0.06]">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.08] text-xs space-y-1">
                <h4 className="font-semibold text-white">Educational Progression Pathway:</h4>
                <p className="text-zinc-400">{selectedCareerDetail.educationPath}</p>
              </div>

              {selectedCareerDetail.dailyTasks?.length > 0 && (
                <div className="space-y-2 text-xs">
                  <h4 className="font-semibold text-white">Day-in-the-Life Responsibilities:</h4>
                  <ul className="space-y-1 text-zinc-400 list-disc list-inside">
                    {selectedCareerDetail.dailyTasks.map((task, idx) => (
                      <li key={idx}>{task}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="flex justify-between items-center pt-4 border-t border-white/[0.08]">
                <button
                  onClick={() =>
                    handleToggleBookmark({
                      type: 'career',
                      id: selectedCareerDetail._id,
                      title: selectedCareerDetail.title,
                      subtitle: `${selectedCareerDetail.domain} &bull; $${selectedCareerDetail.salaryRange?.senior?.toLocaleString()}`,
                    })
                  }
                  className="px-4 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-xs font-medium text-zinc-300 flex items-center gap-1.5 cursor-pointer border border-white/10"
                >
                  <Bookmark className="w-3.5 h-3.5" />
                  <span>
                    {isItemBookmarked('career', selectedCareerDetail._id) ? 'Bookmarked' : 'Add to Passport'}
                  </span>
                </button>

                <button
                  onClick={() => setSelectedCareerDetail(null)}
                  className="px-5 py-2 rounded-xl bg-white text-black font-semibold text-xs hover:bg-zinc-200 cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: AI ASSESSMENT */}
        {activeTab === 'quiz' && (
          <div className="space-y-6 animate-in fade-in max-w-3xl mx-auto">
            {quizStep === 0 && (
              <div className="p-8 sm:p-12 rounded-2xl bg-zinc-950 border border-white/[0.08] text-center space-y-6 shadow-xl">
                <div className="w-12 h-12 rounded-2xl bg-white/[0.05] border border-white/10 text-white flex items-center justify-center mx-auto">
                  <BrainCircuit className="w-6 h-6" />
                </div>

                <div className="space-y-2">
                  <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-white">AI Interest &amp; Trajectory Assessment</h2>
                  <p className="text-xs sm:text-sm text-zinc-400 max-w-md mx-auto">
                    Evaluate your technical, analytical, creative, and leadership traits across real-world problem-solving scenarios.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-lg mx-auto text-left text-xs">
                  <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.08]">
                    <span className="font-semibold text-white block">5 Key Steps</span>
                    <span className="text-zinc-500 text-[11px]">Takes approx 3 minutes</span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.08]">
                    <span className="font-semibold text-white block">Scoring Traits</span>
                    <span className="text-zinc-500 text-[11px]">Cloud, AI, Design, Security</span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.08]">
                    <span className="font-semibold text-white block">Role Matching</span>
                    <span className="text-zinc-500 text-[11px]">Calculates % fit to Bank</span>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => {
                      setQuizStep(1);
                      setQuizAnswers([]);
                    }}
                    className="px-6 py-3 rounded-full bg-white text-black hover:bg-zinc-200 font-semibold text-xs shadow-sm transition-all cursor-pointer inline-flex items-center gap-2"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Begin Assessment &rarr;</span>
                  </button>
                </div>
              </div>
            )}

            {quizStep > 0 && quizStep <= quizQuestions.length && (
              <div className="p-6 sm:p-10 rounded-2xl bg-zinc-950 border border-white/[0.08] space-y-6 shadow-xl text-left">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-zinc-400 font-mono font-medium uppercase">
                      Question {quizStep} of {quizQuestions.length}
                    </span>
                    <span className="text-zinc-500">
                      Category: {quizQuestions[quizStep - 1]?.category}
                    </span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
                    <div
                      className="h-full bg-white transition-all duration-300"
                      style={{ width: `${(quizStep / quizQuestions.length) * 100}%` }}
                    />
                  </div>
                </div>

                <h3 className="text-base sm:text-lg font-semibold text-white leading-relaxed">
                  {quizQuestions[quizStep - 1]?.questionText}
                </h3>

                <div className="space-y-2.5">
                  {quizQuestions[quizStep - 1]?.options?.map((opt, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleAnswerQuizOption(opt)}
                      disabled={quizSubmitting}
                      className="w-full p-4 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 hover:border-white/20 text-xs sm:text-sm text-left text-zinc-200 hover:text-white transition-all flex items-center justify-between group cursor-pointer"
                    >
                      <span className="leading-relaxed">{opt.label}</span>
                      <ChevronRight className="w-4 h-4 text-zinc-500 group-hover:text-white transition-all shrink-0 ml-2" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {quizStep > quizQuestions.length && quizResult && (
              <div className="p-6 sm:p-10 rounded-2xl bg-zinc-950 border border-white/[0.08] space-y-6 shadow-xl text-center">
                <div className="space-y-1.5">
                  <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-mono uppercase">
                    Assessment Complete
                  </span>
                  <h2 className="text-2xl font-semibold tracking-tight text-white">Your Primary Career Stream Match</h2>
                  <p className="text-lg font-semibold text-zinc-300">{quizResult.primaryDomain}</p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-left">
                  {Object.entries(quizResult.scores).map(([trait, score]) => (
                    <div key={trait} className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.08] space-y-1">
                      <span className="text-[10px] uppercase font-mono text-zinc-500">{trait} score</span>
                      <p className="text-sm font-semibold font-mono text-white">{score} pts</p>
                    </div>
                  ))}
                </div>

                <div className="space-y-3 text-left">
                  <h4 className="text-xs font-semibold text-white">Top Suggested Career Bank Roles:</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {quizResult.recommendedCareers.map((rec, idx) => (
                      <div
                        key={idx}
                        className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.08] flex items-center justify-between gap-3"
                      >
                        <div>
                          <span className="text-[10px] font-mono text-emerald-400">
                            {rec.matchPercentage}% Fit Match
                          </span>
                          <h5 className="text-xs font-semibold text-white mt-0.5">{rec.title}</h5>
                        </div>
                        <button
                          onClick={() => {
                            setCareerSearch(rec.title);
                            setActiveTab('careers');
                          }}
                          className="px-3 py-1.5 rounded-lg bg-white text-black font-semibold text-xs hover:bg-zinc-200 transition-all cursor-pointer"
                        >
                          View &rarr;
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-2 flex justify-center gap-3">
                  <button
                    onClick={handleResetQuiz}
                    className="px-5 py-2 rounded-full bg-white/[0.05] hover:bg-white/10 text-xs font-medium text-zinc-300 transition-all cursor-pointer"
                  >
                    Retake Assessment
                  </button>
                  <button
                    onClick={() => setActiveTab('careers')}
                    className="px-5 py-2 rounded-full bg-white text-black hover:bg-zinc-200 text-xs font-semibold transition-all cursor-pointer"
                  >
                    Explore Career Bank
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 4: MULTIMEDIA CENTER */}
        {activeTab === 'multimedia' && (
          <div className="space-y-6 animate-in fade-in">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight text-white">Interactive Multimedia Center</h2>
              <p className="text-xs text-zinc-400">
                Stream masterclasses, audio podcasts, and animated career breakdowns with live transcripts.
              </p>
            </div>

            {activeMedia && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-4">
                  <div className="aspect-video w-full rounded-2xl overflow-hidden bg-black border border-white/10 shadow-xl relative">
                    <iframe
                      src={activeMedia.url}
                      title={activeMedia.title}
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>

                  <div className="p-5 rounded-2xl bg-zinc-950 border border-white/[0.08] space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="space-y-1">
                        <span className="text-[10px] font-mono uppercase px-2.5 py-0.5 rounded-full bg-white/5 text-zinc-300 border border-white/10">
                          {activeMedia.domain} &bull; {activeMedia.type}
                        </span>
                        <h3 className="text-base font-semibold text-white">{activeMedia.title}</h3>
                        <p className="text-xs text-zinc-400">Speaker: {activeMedia.speaker?.name} ({activeMedia.speaker?.role})</p>
                      </div>

                      <div className="flex flex-col items-start sm:items-end space-y-1">
                        <span className="text-[10px] text-zinc-500 font-medium">Rate session:</span>
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              onClick={() => handleRateMedia(star)}
                              className="p-0.5 text-zinc-300 hover:text-white transition-colors cursor-pointer"
                            >
                              <Star className={`w-3.5 h-3.5 ${star <= (activeMedia.ratingAvg || 5) ? 'fill-white text-white' : 'text-zinc-700'}`} />
                            </button>
                          ))}
                          <span className="text-xs font-mono text-zinc-300 ml-1">
                            {activeMedia.ratingAvg} ({activeMedia.ratingCount})
                          </span>
                        </div>
                        {ratingSubmitted && (
                          <span className="text-[10px] text-emerald-400">Rating saved</span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-white/5">
                      <button
                        onClick={() => setShowTranscript(!showTranscript)}
                        className="px-3.5 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-xs font-medium text-zinc-300 flex items-center gap-1.5 cursor-pointer border border-white/10"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>{showTranscript ? 'Hide Interactive Transcript' : 'Show Interactive Transcript'}</span>
                      </button>

                      <button
                        onClick={() =>
                          handleToggleBookmark({
                            type: 'multimedia',
                            id: activeMedia._id,
                            title: activeMedia.title,
                            subtitle: `${activeMedia.domain} &bull; ${activeMedia.speaker?.name}`,
                          })
                        }
                        className="px-3.5 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-xs font-medium text-zinc-300 flex items-center gap-1.5 cursor-pointer border border-white/10"
                      >
                        <Bookmark className="w-3.5 h-3.5" />
                        <span>{isItemBookmarked('multimedia', activeMedia._id) ? 'Saved' : 'Bookmark'}</span>
                      </button>
                    </div>

                    {showTranscript && (
                      <div className="p-4 rounded-xl bg-black border border-white/[0.08] text-xs text-zinc-300 leading-relaxed max-h-52 overflow-y-auto animate-in fade-in space-y-2">
                        <div className="font-semibold text-white flex items-center gap-1.5 pb-1 border-b border-white/10">
                          <Volume2 className="w-3.5 h-3.5 text-zinc-400" />
                          <span>Full Interactive Lecture Transcript</span>
                        </div>
                        <p>{activeMedia.transcript}</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="text-xs font-mono font-medium text-zinc-400 uppercase tracking-wider">All Sessions</h4>
                  <div className="space-y-2.5">
                    {multimedia.map((item) => (
                      <div
                        key={item._id}
                        onClick={() => {
                          setActiveMedia(item);
                          setShowTranscript(false);
                        }}
                        className={`p-3 rounded-xl border transition-all flex items-center gap-3 cursor-pointer ${
                          activeMedia?._id === item._id
                            ? 'bg-white/[0.08] border-white/20'
                            : 'bg-zinc-950 border-white/[0.08] hover:border-white/20'
                        }`}
                      >
                        <div className="w-16 h-12 rounded-lg bg-zinc-900 overflow-hidden shrink-0 relative">
                          <img src={item.thumbnailUrl} alt="Thumb" className="w-full h-full object-cover opacity-80" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <span className="text-[9px] font-mono text-zinc-500 uppercase">{item.type}</span>
                          <h5 className="text-xs font-medium text-white truncate">{item.title}</h5>
                          <p className="text-[10px] text-zinc-500 truncate">{item.speaker?.name}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 5: SUCCESS STORIES */}
        {activeTab === 'stories' && (
          <div className="space-y-6 animate-in fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-2xl font-semibold tracking-tight text-white">Success Stories Hub</h2>
                <p className="text-xs text-zinc-400">
                  Real trajectories in timeline format: Education Path \(\rightarrow\) Challenges \(\rightarrow\) Outcome.
                </p>
              </div>

              <button
                onClick={() => setIsStoryModalOpen(true)}
                className="px-4 py-2 rounded-full bg-white text-black hover:bg-zinc-200 font-semibold text-xs shadow-sm flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Share Your Journey</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {stories.map((story) => (
                <div
                  key={story._id}
                  className="p-6 rounded-2xl bg-zinc-950 border border-white/[0.08] hover:border-white/20 transition-all flex flex-col justify-between space-y-4 text-left"
                >
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={story.avatarUrl}
                        alt={story.name}
                        className="w-10 h-10 rounded-full object-cover border border-white/10"
                      />
                      <div>
                        <h4 className="text-xs font-semibold text-white">{story.name}</h4>
                        <p className="text-[11px] text-zinc-400">{story.currentRole}</p>
                        <p className="text-[10px] text-zinc-600">{story.company}</p>
                      </div>
                    </div>

                    <div className="space-y-2 text-xs pt-1">
                      <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.04] space-y-1">
                        <span className="font-semibold text-zinc-300 text-[11px] block">Educational Path:</span>
                        <p className="text-zinc-400 text-[11px]">{story.educationPath}</p>
                      </div>

                      <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.04] space-y-1">
                        <span className="font-semibold text-zinc-300 text-[11px] block">Challenges Overcome:</span>
                        <p className="text-zinc-400 text-[11px]">{story.challenges}</p>
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-white/[0.01] border border-white/[0.04] text-xs italic text-zinc-300">
                      &quot;{story.advice}&quot;
                    </div>
                  </div>

                  <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs">
                    <span className="text-[10px] text-zinc-500 font-mono uppercase">{story.domain}</span>
                    <button
                      onClick={() => storyApi.like(story._id).then((r) => {
                        setStories(stories.map((s) => s._id === story._id ? { ...s, likesCount: r.likesCount } : s));
                      })}
                      className="flex items-center gap-1.5 text-zinc-400 hover:text-white font-medium cursor-pointer"
                    >
                      <Star className="w-3.5 h-3.5 fill-zinc-400 text-zinc-400" />
                      <span>{story.likesCount} Helpful</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SUBMIT STORY MODAL */}
        {isStoryModalOpen && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <div className="bg-zinc-950 border border-white/10 rounded-2xl p-6 sm:p-8 max-w-lg w-full max-h-[85vh] overflow-y-auto shadow-2xl space-y-5 text-white text-left animate-in zoom-in-95">
              <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
                <div>
                  <h3 className="text-base font-semibold">Submit Your Success Story</h3>
                  <p className="text-xs text-zinc-400">Inspire other students and professionals</p>
                </div>
                <button
                  onClick={() => setIsStoryModalOpen(false)}
                  className="w-7 h-7 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-zinc-400 hover:text-white cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {storySuccessMsg && (
                <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-800/60 text-emerald-300 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{storySuccessMsg}</span>
                </div>
              )}

              <form onSubmit={handleSubmitStory} className="space-y-3.5 text-xs">
                <div className="space-y-1">
                  <label className="font-medium text-zinc-300">Career Domain</label>
                  <select
                    value={newStory.domain}
                    onChange={(e) => setNewStory({ ...newStory, domain: e.target.value })}
                    className="w-full bg-zinc-900 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-white cursor-pointer"
                  >
                    <option value="Software & Cloud">Software &amp; Cloud</option>
                    <option value="AI & Data Science">AI &amp; Data Science</option>
                    <option value="Cybersecurity">Cybersecurity</option>
                    <option value="Design & UX">Design &amp; UX</option>
                    <option value="Healthcare & Biotech">Healthcare &amp; Biotech</option>
                    <option value="Fintech & Business">Fintech &amp; Business</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-medium text-zinc-300">Current Role</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Lead Architect"
                      value={newStory.currentRole}
                      onChange={(e) => setNewStory({ ...newStory, currentRole: e.target.value })}
                      className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-white"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-medium text-zinc-300">Company</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Techwiz Labs"
                      value={newStory.company}
                      onChange={(e) => setNewStory({ ...newStory, company: e.target.value })}
                      className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-white"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-medium text-zinc-300">Educational Background</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. B.S. in CS -> Certified Cloud Architect"
                    value={newStory.educationPath}
                    onChange={(e) => setNewStory({ ...newStory, educationPath: e.target.value })}
                    className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-medium text-zinc-300">Challenges Overcome</label>
                  <textarea
                    rows={2}
                    required
                    placeholder="What obstacles did you face when starting out?"
                    value={newStory.challenges}
                    onChange={(e) => setNewStory({ ...newStory, challenges: e.target.value })}
                    className="w-full bg-white/[0.03] border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:ring-1 focus:ring-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-medium text-zinc-300">Key Advice for Peers</label>
                  <textarea
                    rows={2}
                    required
                    placeholder="Your primary tip for students and professionals"
                    value={newStory.advice}
                    onChange={(e) => setNewStory({ ...newStory, advice: e.target.value })}
                    className="w-full bg-white/[0.03] border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:ring-1 focus:ring-white"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-3 border-t border-white/[0.08]">
                  <button
                    type="button"
                    onClick={() => setIsStoryModalOpen(false)}
                    className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 font-medium cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={storySubmitting}
                    className="px-5 py-2 rounded-xl bg-white text-black hover:bg-zinc-200 font-semibold flex items-center gap-2 cursor-pointer shadow-sm disabled:opacity-50"
                  >
                    {storySubmitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                    <span>Publish Story</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* TAB 6: RESOURCE LIBRARY */}
        {activeTab === 'resources' && (
          <div className="space-y-6 animate-in fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-2xl font-semibold tracking-tight text-white">Document Resource Library</h2>
                <p className="text-xs text-zinc-400">
                  ATS resume templates, technical interview checklists, and career roadmaps.
                </p>
              </div>

              {downloadSuccessMsg && (
                <div className="px-4 py-2 rounded-full bg-emerald-950/40 border border-emerald-800/60 text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{downloadSuccessMsg}</span>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {resources.map((resItem) => (
                <div
                  key={resItem._id}
                  className="p-5 rounded-2xl bg-zinc-950 border border-white/[0.08] hover:border-white/20 transition-all flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-2">
                    <span className="text-[10px] font-mono uppercase px-2.5 py-0.5 rounded-full bg-white/5 text-zinc-300 border border-white/10">
                      {resItem.category}
                    </span>
                    <h3 className="text-xs font-semibold text-white">{resItem.title}</h3>
                    <p className="text-xs text-zinc-400 line-clamp-3 leading-relaxed">
                      {resItem.description}
                    </p>
                  </div>

                  <div className="space-y-3 pt-3 border-t border-white/5 text-xs">
                    <div className="flex items-center justify-between text-zinc-500 text-[11px] font-mono">
                      <span>{resItem.fileType} &bull; {resItem.fileSize}</span>
                      <span className="text-zinc-300">{resItem.downloadsCount} downloads</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setSelectedResourcePreview(resItem)}
                        className="flex-1 py-2 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] text-zinc-300 text-xs font-medium flex items-center justify-center gap-1 cursor-pointer border border-white/10"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>Preview</span>
                      </button>

                      <button
                        onClick={() => handleDownloadResource(resItem)}
                        className="flex-1 py-2 rounded-xl bg-white text-black hover:bg-zinc-200 text-xs font-semibold flex items-center justify-center gap-1 cursor-pointer shadow-sm"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Download</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* RESOURCE PREVIEW MODAL */}
        {selectedResourcePreview && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <div className="bg-zinc-950 border border-white/10 rounded-2xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-5 text-white text-left animate-in zoom-in-95">
              <div className="flex items-start justify-between border-b border-white/[0.08] pb-4">
                <div>
                  <span className="text-[10px] font-mono uppercase px-2.5 py-0.5 rounded-full bg-white/5 text-zinc-300 border border-white/10">
                    {selectedResourcePreview.category}
                  </span>
                  <h3 className="text-base font-semibold mt-1">{selectedResourcePreview.title}</h3>
                </div>
                <button
                  onClick={() => setSelectedResourcePreview(null)}
                  className="w-7 h-7 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-zinc-400 hover:text-white cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.08] space-y-2 text-xs leading-relaxed text-zinc-300">
                <span className="font-semibold text-white block">Document Preview Snippet:</span>
                <p>{selectedResourcePreview.previewSnippet || selectedResourcePreview.description}</p>
              </div>

              <div className="flex items-center justify-between pt-2 text-xs">
                <span className="text-zinc-500 font-mono">Format: {selectedResourcePreview.fileType} ({selectedResourcePreview.fileSize})</span>
                <button
                  onClick={() => {
                    handleDownloadResource(selectedResourcePreview);
                    setSelectedResourcePreview(null);
                  }}
                  className="px-5 py-2.5 rounded-xl bg-white text-black hover:bg-zinc-200 font-semibold text-xs flex items-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Document</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 7: STICKY NOTES & BOOKMARKS */}
        {activeTab === 'bookmarks' && (
          <div className="space-y-6 animate-in fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-2xl font-semibold tracking-tight text-white">My Sticky Notes &amp; Bookmarks</h2>
                <p className="text-xs text-zinc-400">
                  Add custom commentary, organize career notes, and export your structured summary.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleExportPassportSummary}
                  className="px-4 py-2 rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-zinc-200 font-medium text-xs flex items-center gap-1.5 cursor-pointer transition-all"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>{exportCopied ? 'Summary Copied to Clipboard!' : 'Export Passport Summary'}</span>
                </button>
              </div>
            </div>

            {bookmarks.length === 0 ? (
              <div className="p-12 rounded-2xl bg-zinc-950 border border-white/[0.08] text-center space-y-3">
                <Bookmark className="w-8 h-8 text-zinc-600 mx-auto" />
                <h3 className="text-sm font-semibold text-white">No saved bookmarks yet</h3>
                <p className="text-xs text-zinc-500 max-w-xs mx-auto">
                  Browse the Career Bank, Multimedia Center, or Resource Library to pin items to your Passport.
                </p>
                <button
                  onClick={() => setActiveTab('careers')}
                  className="px-4 py-2 rounded-full bg-white text-black text-xs font-semibold cursor-pointer"
                >
                  Explore Career Bank
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {bookmarks.map((b) => (
                  <div
                    key={b._id}
                    className="p-5 rounded-2xl bg-zinc-950 border border-white/[0.08] shadow-lg flex flex-col justify-between space-y-4 text-left"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] font-mono uppercase px-2 py-0.5 rounded bg-white/5 text-zinc-400">
                          {b.itemType}
                        </span>
                        <button
                          onClick={() => bookmarkApi.delete(b._id).then(() => setBookmarks(bookmarks.filter((x) => x._id !== b._id)))}
                          className="p-1 text-zinc-600 hover:text-red-400 cursor-pointer"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <h3 className="text-xs font-semibold text-white">{b.title}</h3>
                      {b.subtitle && <p className="text-[11px] text-zinc-500">{b.subtitle}</p>}
                    </div>

                    <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.04] text-xs space-y-2">
                      <div className="flex items-center justify-between text-zinc-400 font-mono text-[10px] uppercase">
                        <span>Personal Sticky Note:</span>
                        {editingNoteId !== b._id && (
                          <button
                            onClick={() => {
                              setEditingNoteId(b._id);
                              setEditingNoteText(b.notes || '');
                            }}
                            className="text-zinc-300 hover:text-white underline cursor-pointer"
                          >
                            Edit
                          </button>
                        )}
                      </div>

                      {editingNoteId === b._id ? (
                        <div className="space-y-2">
                          <textarea
                            rows={3}
                            value={editingNoteText}
                            onChange={(e) => setEditingNoteText(e.target.value)}
                            placeholder="Add your notes, target timelines, or interview prep thoughts..."
                            className="w-full bg-zinc-900 border border-white/20 rounded-xl p-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-white"
                          />
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => setEditingNoteId(null)}
                              className="px-2.5 py-1 rounded-lg bg-white/10 text-[10px] font-medium text-white cursor-pointer"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={() => handleSaveStickyNote(b._id)}
                              className="px-3 py-1 rounded-lg bg-white text-black text-[10px] font-semibold cursor-pointer"
                            >
                              Save Note
                            </button>
                          </div>
                        </div>
                      ) : (
                        <p className="text-zinc-400 text-xs italic leading-relaxed">
                          {b.notes || 'No sticky note attached yet. Click Edit to add notes.'}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 8: FEEDBACK */}
        {activeTab === 'feedback' && (
          <div className="space-y-6 animate-in fade-in max-w-xl mx-auto">
            <div className="text-center space-y-1.5">
              <h2 className="text-2xl font-semibold tracking-tight text-white">Dynamic Feedback &amp; Support</h2>
              <p className="text-xs text-zinc-400">
                Categorized feedback with real-time sentiment analysis and administrative response notifications.
              </p>
            </div>

            {feedbackSuccessMsg && (
              <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-800/60 text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{feedbackSuccessMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmitFeedback} className="p-6 sm:p-8 rounded-2xl bg-zinc-950 border border-white/[0.08] space-y-4 shadow-xl text-left">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-zinc-300 block">Feedback Category</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {(['suggestion', 'bug', 'query', 'appreciation'] as const).map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setFeedbackCategory(cat)}
                      className={`py-2 px-3 rounded-xl text-xs font-medium border transition-all capitalize cursor-pointer ${
                        feedbackCategory === cat
                          ? 'bg-white text-black border-white shadow-sm font-semibold'
                          : 'bg-white/[0.02] text-zinc-400 border-white/[0.08] hover:bg-white/[0.05]'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-zinc-300 block">Subject / Feature Area</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Remote Salary Filtering in Career Bank"
                  value={feedbackSubject}
                  onChange={(e) => setFeedbackSubject(e.target.value)}
                  className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-white"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-zinc-300 block">Detailed Description</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Provide comprehensive details, suggestions, or queries..."
                  value={feedbackMessage}
                  onChange={(e) => setFeedbackMessage(e.target.value)}
                  className="w-full bg-white/[0.03] border border-white/10 rounded-xl p-4 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-white"
                />
              </div>

              <button
                type="submit"
                disabled={feedbackLoading}
                className="w-full py-3 rounded-xl bg-white text-black hover:bg-zinc-200 font-semibold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-sm disabled:opacity-50"
              >
                {feedbackLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>Submit Feedback &rarr;</span>
              </button>
            </form>
          </div>
        )}
      </main>

      {/* PROFILE EDITOR MODAL */}
      {isProfileModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-zinc-950 border border-white/10 rounded-2xl p-6 sm:p-8 max-w-lg w-full max-h-[85vh] overflow-y-auto shadow-2xl space-y-5 text-white text-left animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
              <div>
                <h3 className="text-base font-semibold">Edit Career Passport Profile</h3>
                <p className="text-xs text-zinc-400">Update your verified credentials and skills</p>
              </div>
              <button
                onClick={() => setIsProfileModalOpen(false)}
                className="w-7 h-7 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-zinc-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {profileSaveSuccess && (
              <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-800/60 text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Profile updated &amp; synchronized with database.</span>
              </div>
            )}

            <form onSubmit={handleSaveProfile} className="space-y-3.5 text-xs">
              <div className="space-y-1">
                <label className="font-medium text-zinc-300">Full Display Name</label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-medium text-zinc-300">Phone Number</label>
                  <input
                    type="text"
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    placeholder="+1 555-0199"
                    className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-medium text-zinc-300">Education Level</label>
                  <select
                    value={editEducation}
                    onChange={(e) => setEditEducation(e.target.value)}
                    className="w-full bg-zinc-900 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-white cursor-pointer"
                  >
                    <option value="Undergraduate Student">Undergraduate Student</option>
                    <option value="Bachelor Degree">Bachelor Degree</option>
                    <option value="Master / Graduate">Master / Graduate</option>
                    <option value="Industry Professional">Industry Professional</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-medium text-zinc-300">Target Career Role</label>
                <input
                  type="text"
                  value={editTargetRole}
                  onChange={(e) => setEditTargetRole(e.target.value)}
                  placeholder="e.g. AI & Cloud Engineer"
                  className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-white"
                />
              </div>

              <div className="space-y-1">
                <label className="font-medium text-zinc-300">Skills (Comma-separated)</label>
                <input
                  type="text"
                  value={editSkills}
                  onChange={(e) => setEditSkills(e.target.value)}
                  placeholder="React, Node.js, Python, AWS"
                  className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-white"
                />
              </div>

              <div className="space-y-1">
                <label className="font-medium text-zinc-300">Resume Link / Portfolio URL</label>
                <input
                  type="url"
                  value={editResumeUrl}
                  onChange={(e) => setEditResumeUrl(e.target.value)}
                  placeholder="https://linkedin.com/in/yourname or PDF link"
                  className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-white"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-white/[0.08]">
                <button
                  type="button"
                  onClick={() => setIsProfileModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={profileSaving}
                  className="px-5 py-2 rounded-xl bg-white text-black hover:bg-zinc-200 font-semibold flex items-center gap-2 cursor-pointer shadow-sm disabled:opacity-50"
                >
                  {profileSaving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>Save Passport</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
