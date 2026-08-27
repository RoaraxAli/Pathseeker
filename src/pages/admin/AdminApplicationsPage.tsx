import React, { useState, useEffect } from 'react';
import { storyApi } from '../../services/api';
import { SuccessStoryItem } from '../../types';
import {
  BookOpen,
  CheckCircle2,
  Trash2,
  Star,
  Clock,
  Shield,
  Search,
  Filter,
} from 'lucide-react';

export const AdminApplicationsPage: React.FC = () => {
  const [stories, setStories] = useState<SuccessStoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterDomain, setFilterDomain] = useState('all');

  const defaultStories: SuccessStoryItem[] = [
    {
      _id: 'story-fallback-1',
      name: 'Sarah Lin',
      domain: 'Software & Cloud',
      currentRole: 'Senior Cloud Solutions Architect',
      company: 'Datadog & AWS Alumni',
      challenges: 'Overcame non-traditional background by mastering Terraform and Distributed Systems.',
      advice: 'Build live multi-region infrastructure projects instead of only reading documentation.',
      avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=200&auto=format&fit=crop',
      status: 'featured',
      likesCount: 142,
    },
    {
      _id: 'story-fallback-2',
      name: 'Tariq Mansoor',
      domain: 'AI & Data Science',
      currentRole: 'Principal Machine Learning Engineer',
      company: 'Cohere AI',
      challenges: 'Navigated transition from academic mathematics to industrial LLM fine-tuning.',
      advice: 'Focus on tensor parallelism and low-latency inference bottlenecks.',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop',
      status: 'approved',
      likesCount: 98,
    },
    {
      _id: 'story-fallback-3',
      name: 'Chloe Dubois',
      domain: 'Product & Design',
      currentRole: 'Lead Product Designer',
      company: 'Stripe Ecosystem',
      challenges: 'Bridged interaction design with complex fintech compliance workflows.',
      advice: 'Design with edge cases and high-density financial data in mind from day one.',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
      status: 'featured',
      likesCount: 89,
    },
    {
      _id: 'story-fallback-4',
      name: 'Vikram Malhotra',
      domain: 'Cybersecurity & Defense',
      currentRole: 'Senior Threat Hunter & SecOps Lead',
      company: 'Mandiant (Google Cloud)',
      challenges: 'Started as IT helpdesk and self-taught reverse engineering and malware analysis.',
      advice: 'Participate in live Blue Team CTFs and master SIEM log correlation.',
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop',
      status: 'approved',
      likesCount: 76,
    },
  ];

  useEffect(() => {
    loadStories();
  }, []);

  const loadStories = async () => {
    setLoading(true);
    try {
      let data = await storyApi.getAdminAll();
      if (Array.isArray(data) && data.length > 0) {
        setStories(data);
      } else {
        const publicStories = await storyApi.getAll({});
        if (Array.isArray(publicStories) && publicStories.length > 0) {
          setStories(publicStories);
        } else {
          setStories(defaultStories);
        }
      }
    } catch (e) {
      try {
        const publicStories = await storyApi.getAll({});
        if (Array.isArray(publicStories) && publicStories.length > 0) {
          setStories(publicStories);
        } else {
          setStories(defaultStories);
        }
      } catch (err) {
        console.error('Fallback stories loaded', err);
        setStories(defaultStories);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id: string, status: 'approved' | 'featured' | 'pending') => {
    try {
      const updated = await storyApi.updateStatus(id, status);
      setStories(stories.map((s) => (s._id === id ? updated : s)));
    } catch (e) {
      console.error('Failed to update status', e);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this story?')) return;
    try {
      await storyApi.delete(id);
      setStories(stories.filter((s) => s._id !== id));
    } catch (e) {
      console.error('Failed to delete story', e);
    }
  };

  const filtered = stories.filter(
    (s) => filterDomain === 'all' || s.domain === filterDomain
  );

  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-white">Success Stories Moderation</h2>
          <p className="text-xs text-zinc-400">
            Review, feature, or manage community career journey submissions.
          </p>
        </div>
      </div>

      {/* Stories Table */}
      <div className="bg-zinc-950 border border-white/[0.08] rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-white/[0.02] text-zinc-400 border-b border-white/[0.08] text-[10px] uppercase font-mono font-medium">
              <tr>
                <th className="p-4">Seeker / Author</th>
                <th className="p-4">Current Role &amp; Company</th>
                <th className="p-4">Domain</th>
                <th className="p-4">Advice Excerpt</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-zinc-500">
                    <span className="inline-block w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin mb-2" />
                    <p>Loading community stories...</p>
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-zinc-500">
                    No success stories found.
                  </td>
                </tr>
              ) : (
                filtered.map((story) => (
                  <tr key={story._id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="p-4 font-medium text-white">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={story.avatarUrl}
                        alt="Avatar"
                        className="w-7 h-7 rounded-full object-cover border border-white/10"
                      />
                      <span>{story.name}</span>
                    </div>
                  </td>
                  <td className="p-4 text-zinc-300">
                    <span className="font-medium text-white">{story.currentRole}</span>
                    <p className="text-[10px] text-zinc-500">{story.company}</p>
                  </td>
                  <td className="p-4 text-zinc-400">{story.domain}</td>
                  <td className="p-4 text-zinc-400 max-w-xs truncate italic">
                    &quot;{story.advice}&quot;
                  </td>
                  <td className="p-4">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-mono uppercase ${
                        story.status === 'featured'
                          ? 'bg-white text-black font-semibold'
                          : story.status === 'approved'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : 'bg-zinc-800 text-zinc-400'
                      }`}
                    >
                      {story.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() =>
                          handleUpdateStatus(story._id, story.status === 'featured' ? 'approved' : 'featured')
                        }
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-medium cursor-pointer transition-all ${
                          story.status === 'featured'
                            ? 'bg-white/10 text-white'
                            : 'bg-white/[0.04] text-zinc-300 hover:text-white border border-white/10'
                        }`}
                      >
                        {story.status === 'featured' ? 'Unfeature' : 'Feature'}
                      </button>

                      <button
                        onClick={() => handleDelete(story._id)}
                        className="p-1.5 rounded-lg bg-white/[0.04] hover:bg-red-950/40 text-red-400 cursor-pointer"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              )))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
