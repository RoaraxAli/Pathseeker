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

  useEffect(() => {
    loadStories();
  }, []);

  const loadStories = async () => {
    setLoading(true);
    try {
      const data = await storyApi.getAdminAll();
      setStories(data);
    } catch (e) {
      console.error('Failed to load admin stories', e);
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
              {filtered.map((story) => (
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
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
