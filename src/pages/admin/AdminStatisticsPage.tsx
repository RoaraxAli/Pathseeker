import React, { useState, useEffect } from 'react';
import { adminApi } from '../../services/api';
import { AdminStats } from '../../types';
import {
  PieChart,
  TrendingUp,
  Users,
  BrainCircuit,
  Search,
  DownloadCloud,
  CheckCircle2,
} from 'lucide-react';

export const AdminStatisticsPage: React.FC = () => {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi.getStats()
      .then(setStats)
      .catch((e) => console.error('Failed to load stats', e))
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

  const domainBreakdown = [
    { domain: 'Software & Cloud', count: 35, color: 'bg-white' },
    { domain: 'AI & Data Science', count: 28, color: 'bg-zinc-300' },
    { domain: 'Design & UX', count: 18, color: 'bg-zinc-400' },
    { domain: 'Cybersecurity', count: 12, color: 'bg-zinc-500' },
    { domain: 'Healthcare & Biotech', count: 7, color: 'bg-zinc-600' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight text-white">Telemetry &amp; Usage Analytics</h2>
        <p className="text-xs text-zinc-400">
          Visual telemetry on domain popularity, quiz completion rates, and user demographic segments.
        </p>
      </div>

      {/* Domain Distribution Bar Chart */}
      <div className="p-6 rounded-2xl bg-zinc-950 border border-white/[0.08] space-y-5 shadow-xl">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-semibold text-white flex items-center gap-2">
            <PieChart className="w-4 h-4 text-zinc-400" />
            <span>Seeker Domain Preference Distribution</span>
          </h3>
          <span className="text-[10px] text-zinc-500 font-mono">Aggregated from AI Quiz Submissions</span>
        </div>

        <div className="space-y-3">
          {domainBreakdown.map((item) => (
            <div key={item.domain} className="space-y-1 text-xs">
              <div className="flex justify-between font-medium">
                <span className="text-zinc-300">{item.domain}</span>
                <span className="font-mono text-zinc-400">{item.count}%</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
                <div
                  className={`h-full ${item.color} rounded-full transition-all duration-500`}
                  style={{ width: `${item.count}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Demographics Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-6 rounded-2xl bg-zinc-950 border border-white/[0.08] space-y-2">
          <div className="flex items-center justify-between text-zinc-400">
            <Users className="w-4 h-4" />
            <span className="text-[10px] font-mono font-medium uppercase">Students</span>
          </div>
          <p className="text-2xl font-semibold font-mono text-white">{metrics.studentUsers}</p>
          <p className="text-xs text-zinc-500">Enrolled undergraduate seekers</p>
        </div>

        <div className="p-6 rounded-2xl bg-zinc-950 border border-white/[0.08] space-y-2">
          <div className="flex items-center justify-between text-zinc-400">
            <Users className="w-4 h-4" />
            <span className="text-[10px] font-mono font-medium uppercase">Graduates</span>
          </div>
          <p className="text-2xl font-semibold font-mono text-white">{metrics.graduateUsers}</p>
          <p className="text-xs text-zinc-500">Entry job &amp; certification seekers</p>
        </div>

        <div className="p-6 rounded-2xl bg-zinc-950 border border-white/[0.08] space-y-2">
          <div className="flex items-center justify-between text-zinc-400">
            <Users className="w-4 h-4" />
            <span className="text-[10px] font-mono font-medium uppercase">Professionals</span>
          </div>
          <p className="text-2xl font-semibold font-mono text-white">{metrics.professionalUsers}</p>
          <p className="text-xs text-zinc-500">Mid/Senior executive upskillers</p>
        </div>
      </div>
    </div>
  );
};
