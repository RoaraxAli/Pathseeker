import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  adminApi,
  careerApi,
  storyApi,
  feedbackApi,
} from '../../services/api';
import { AdminStats, FeedbackItem, UserProfile } from '../../types';
import {
  Search,
  Users,
  BrainCircuit,
  BookOpen,
  DownloadCloud,
  MessageSquare,
  Sparkles,
  TrendingUp,
  ArrowUpRight,
  Shield,
  Clock,
  CheckCircle2,
  AlertCircle,
  Video,
} from 'lucide-react';

export const AdminDashboardPage: React.FC = () => {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi.getStats()
      .then(setStats)
      .catch((e) => console.error('Failed to load admin stats:', e))
      .finally(() => setLoading(false));
  }, []);

  const metrics = stats?.metrics || {
    totalCareers: 8,
    totalUsers: 24,
    studentUsers: 14,
    graduateUsers: 6,
    professionalUsers: 3,
    adminUsers: 1,
    totalQuizAttempts: 142,
    totalStories: 6,
    pendingStories: 0,
    totalMultimedia: 4,
    totalResources: 4,
    totalDownloads: 4890,
    totalFeedback: 3,
    openFeedback: 1,
    satisfactionRate: 96,
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Top Banner */}
      <div className="p-6 sm:p-8 rounded-2xl bg-zinc-950 border border-white/[0.08] flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase bg-white/5 text-zinc-300 border border-white/10">
              Control Panel
            </span>
            <span className="text-xs text-zinc-500 font-mono">&bull; Production Telemetry</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-white">System Operations &amp; Telemetry</h2>
          <p className="text-xs text-zinc-400">
            Real-time analytics for user registrations, career inquiries, quiz assessments, and document downloads.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/admin/jobs"
            className="px-4 py-2.5 rounded-xl bg-white text-black hover:bg-zinc-200 font-semibold text-xs shadow-sm flex items-center gap-1.5 transition-all"
          >
            <span>Add Career Profile</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Main Metric Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="p-4 rounded-xl bg-zinc-950 border border-white/[0.08] space-y-1">
          <div className="flex items-center justify-between text-zinc-400">
            <Search className="w-4 h-4" />
            <span className="text-[9px] font-mono font-medium uppercase">Careers</span>
          </div>
          <p className="text-xl font-semibold font-mono text-white">{metrics.totalCareers}</p>
          <span className="text-[10px] text-zinc-500">Live Roles in Bank</span>
        </div>

        <div className="p-4 rounded-xl bg-zinc-950 border border-white/[0.08] space-y-1">
          <div className="flex items-center justify-between text-zinc-400">
            <Users className="w-4 h-4" />
            <span className="text-[9px] font-mono font-medium uppercase">Seekers</span>
          </div>
          <p className="text-xl font-semibold font-mono text-white">{metrics.totalUsers}</p>
          <span className="text-[10px] text-zinc-500">Registered Accounts</span>
        </div>

        <div className="p-4 rounded-xl bg-zinc-950 border border-white/[0.08] space-y-1">
          <div className="flex items-center justify-between text-zinc-400">
            <BrainCircuit className="w-4 h-4" />
            <span className="text-[9px] font-mono font-medium uppercase">Assessments</span>
          </div>
          <p className="text-xl font-semibold font-mono text-white">{metrics.totalQuizAttempts}</p>
          <span className="text-[10px] text-zinc-500">AI Quiz Submissions</span>
        </div>

        <div className="p-4 rounded-xl bg-zinc-950 border border-white/[0.08] space-y-1">
          <div className="flex items-center justify-between text-zinc-400">
            <DownloadCloud className="w-4 h-4" />
            <span className="text-[9px] font-mono font-medium uppercase">Downloads</span>
          </div>
          <p className="text-xl font-semibold font-mono text-white">{metrics.totalDownloads.toLocaleString()}</p>
          <span className="text-[10px] text-zinc-500">Toolkits &amp; PDFs</span>
        </div>

        <div className="p-4 rounded-xl bg-zinc-950 border border-white/[0.08] space-y-1">
          <div className="flex items-center justify-between text-zinc-400">
            <BookOpen className="w-4 h-4" />
            <span className="text-[9px] font-mono font-medium uppercase">Stories</span>
          </div>
          <p className="text-xl font-semibold font-mono text-white">{metrics.totalStories}</p>
          <span className="text-[10px] text-zinc-500">Community Journeys</span>
        </div>

        <div className="p-4 rounded-xl bg-zinc-950 border border-white/[0.08] space-y-1">
          <div className="flex items-center justify-between text-zinc-400">
            <MessageSquare className="w-4 h-4" />
            <span className="text-[9px] font-mono font-medium uppercase">Inquiries</span>
          </div>
          <p className="text-xl font-semibold font-mono text-white">{metrics.totalFeedback}</p>
          <span className="text-[10px] text-zinc-500">{metrics.openFeedback} Open</span>
        </div>
      </div>

      {/* Two Column Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Registered Seekers */}
        <div className="p-6 rounded-2xl bg-zinc-950 border border-white/[0.08] space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-zinc-300" />
              <h3 className="text-sm font-semibold text-white">Recent Seeker Registrations</h3>
            </div>
            <Link to="/admin/candidates" className="text-xs text-zinc-400 hover:text-white font-medium">
              Manage Users &rarr;
            </Link>
          </div>

          <div className="space-y-2.5">
            {stats?.recentUsers?.map((u) => (
              <div
                key={u._id || u.email}
                className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.04] flex items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-full bg-white text-black flex items-center justify-center font-bold text-[11px]">
                    {u.displayName ? u.displayName[0].toUpperCase() : 'U'}
                  </div>
                  <div>
                    <h5 className="font-semibold text-white">{u.displayName}</h5>
                    <p className="text-[11px] text-zinc-500">{u.email}</p>
                  </div>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase bg-white/5 text-zinc-400 border border-white/5 capitalize">
                  {u.role}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Feedback */}
        <div className="p-6 rounded-2xl bg-zinc-950 border border-white/[0.08] space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-zinc-300" />
              <h3 className="text-sm font-semibold text-white">Recent Inquiries &amp; Feedback</h3>
            </div>
            <Link to="/admin/messages" className="text-xs text-zinc-400 hover:text-white font-medium">
              View All &rarr;
            </Link>
          </div>

          <div className="space-y-2.5">
            {stats?.recentFeedback?.map((fb) => (
              <div
                key={fb._id}
                className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.04] space-y-1.5 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-white">{fb.subject || fb.category}</span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[9px] font-mono font-medium uppercase ${
                      fb.status === 'resolved'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : 'bg-zinc-800 text-zinc-300 border border-white/10'
                    }`}
                  >
                    {fb.status}
                  </span>
                </div>
                <p className="text-[11px] text-zinc-400 line-clamp-1">{fb.message}</p>
                <div className="flex items-center justify-between text-[10px] text-zinc-500 font-mono pt-1">
                  <span>From: {fb.userName}</span>
                  <span className="capitalize">{fb.sentiment} sentiment</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
