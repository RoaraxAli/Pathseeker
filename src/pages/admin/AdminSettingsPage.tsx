import React, { useState } from 'react';
import { adminApi } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import {
  Settings,
  Database,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Shield,
  Loader2,
} from 'lucide-react';

export const AdminSettingsPage: React.FC = () => {
  const { profile } = useAuth();
  const [seeding, setSeeding] = useState(false);
  const [seedMsg, setSeedMsg] = useState('');
  const [seedErr, setSeedErr] = useState('');

  const handleTriggerSeed = async () => {
    setSeeding(true);
    setSeedMsg('');
    setSeedErr('');
    try {
      const res = await adminApi.triggerSeed();
      setSeedMsg(res.message);
    } catch (e: any) {
      setSeedErr(e.response?.data?.message || e.message || 'Failed to trigger database re-seed');
    } finally {
      setSeeding(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in max-w-3xl">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight text-white">System Settings &amp; Infrastructure</h2>
        <p className="text-xs text-zinc-400">
          MongoDB Atlas connectivity, session configurations, and dataset initialization controls.
        </p>
      </div>

      {/* Database Status Card */}
      <div className="p-6 rounded-2xl bg-zinc-950 border border-white/[0.08] space-y-4 shadow-xl text-left">
        <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-center text-zinc-200">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">MongoDB Atlas Production Cluster</h3>
              <p className="text-[11px] text-zinc-500 font-mono">Dynamic Document Store &amp; Serverless Connection</p>
            </div>
          </div>
          <span className="px-3 py-1 rounded-full text-[10px] font-mono font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Active &bull; Cluster0
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.04] space-y-1">
            <span className="text-zinc-500 font-mono text-[11px]">Database Name</span>
            <p className="font-mono text-white">techwiz</p>
          </div>
          <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.04] space-y-1">
            <span className="text-zinc-500 font-mono text-[11px]">API Routing Engine</span>
            <p className="font-mono text-white">Express.js &bull; Serverless</p>
          </div>
        </div>

        {seedMsg && (
          <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-800/60 text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{seedMsg}</span>
          </div>
        )}

        {seedErr && (
          <div className="p-3 rounded-xl bg-red-950/40 border border-red-800/60 text-red-300 text-xs">
            {seedErr}
          </div>
        )}

        <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="text-xs text-zinc-400">
            Re-verify and populate initial sample dataset (Careers, Multimedia, Quizzes, Stories):
          </div>
          <button
            onClick={handleTriggerSeed}
            disabled={seeding}
            className="px-4 py-2 rounded-full bg-white text-black hover:bg-zinc-200 font-semibold text-xs flex items-center gap-1.5 cursor-pointer shadow-sm disabled:opacity-50 self-start sm:self-auto shrink-0"
          >
            {seeding ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5" />}
            <span>{seeding ? 'Seeding...' : 'Re-Seed Initial Data'}</span>
          </button>
        </div>
      </div>

      {/* Admin Session Security */}
      <div className="p-6 rounded-2xl bg-zinc-950 border border-white/[0.08] space-y-3 shadow-xl text-left">
        <div className="flex items-center gap-2.5">
          <Shield className="w-4 h-4 text-zinc-300" />
          <h3 className="text-sm font-semibold text-white">Administrator Security Profile</h3>
        </div>
        <p className="text-xs text-zinc-400 leading-relaxed">
          Signed in as <strong className="text-white">{profile?.displayName}</strong> ({profile?.email}). JWT session tokens are refreshed dynamically and role middleware checks protect all administrative API routes.
        </p>
      </div>
    </div>
  );
};
