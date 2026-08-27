import React, { useState, useEffect } from 'react';
import { multimediaApi } from '../../services/api';
import { MultimediaItem } from '../../types';
import {
  Video,
  Plus,
  Edit3,
  Trash2,
  X,
  Play,
  Star,
  Loader2,
  FileText,
} from 'lucide-react';

export const AdminNewsPage: React.FC = () => {
  const [mediaList, setMediaList] = useState<MultimediaItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    type: 'video' as 'video' | 'podcast' | 'explainer',
    url: '',
    thumbnailUrl: '',
    domain: 'Software & Cloud',
    duration: '15:00',
    speakerName: 'Industry Mentor',
    speakerRole: 'Principal Architect',
    speakerCompany: 'Global Tech',
    tags: 'Cloud, Career, AI',
    transcript: '',
    isFeatured: false,
  });

  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    loadMedia();
  }, []);

  const loadMedia = async () => {
    setLoading(true);
    try {
      const data = await multimediaApi.getAll({});
      setMediaList(data);
    } catch (e) {
      console.error('Failed to load multimedia', e);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreate = () => {
    setModalMode('create');
    setSelectedId(null);
    setFormData({
      title: '',
      type: 'video',
      url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      thumbnailUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=600&auto=format&fit=crop',
      domain: 'Software & Cloud',
      duration: '18:30',
      speakerName: 'Dr. Aris Thorne',
      speakerRole: 'Principal Cloud Strategist',
      speakerCompany: 'PathSeeker Masterclasses',
      tags: 'Architecture, Cloud, Distributed Systems',
      transcript: 'Full interactive transcript content for this multimedia session...',
      isFeatured: false,
    });
    setMsg('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: MultimediaItem) => {
    setModalMode('edit');
    setSelectedId(item._id);
    setFormData({
      title: item.title,
      type: item.type,
      url: item.url,
      thumbnailUrl: item.thumbnailUrl,
      domain: item.domain,
      duration: item.duration,
      speakerName: item.speaker?.name || '',
      speakerRole: item.speaker?.role || '',
      speakerCompany: item.speaker?.company || '',
      tags: item.tags.join(', '),
      transcript: item.transcript || '',
      isFeatured: item.isFeatured,
    });
    setMsg('');
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMsg('');
    try {
      const payload = {
        title: formData.title,
        type: formData.type,
        url: formData.url,
        thumbnailUrl: formData.thumbnailUrl,
        domain: formData.domain,
        duration: formData.duration,
        speaker: {
          name: formData.speakerName,
          role: formData.speakerRole,
          company: formData.speakerCompany,
        },
        tags: formData.tags.split(',').map((t) => t.trim()).filter(Boolean),
        transcript: formData.transcript,
        isFeatured: formData.isFeatured,
      };

      if (modalMode === 'create') {
        const created = await multimediaApi.create(payload);
        setMediaList([created, ...mediaList]);
        setMsg('Multimedia session published.');
      } else if (selectedId) {
        const updated = await multimediaApi.update(selectedId, payload);
        setMediaList(mediaList.map((m) => (m._id === selectedId ? updated : m)));
        setMsg('Multimedia session updated.');
      }

      setTimeout(() => {
        setIsModalOpen(false);
        setMsg('');
      }, 1000);
    } catch (err: any) {
      setMsg(err.response?.data?.message || err.message || 'Failed to save multimedia');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this multimedia session?')) return;
    try {
      await multimediaApi.delete(id);
      setMediaList(mediaList.filter((m) => m._id !== id));
    } catch (e) {
      console.error('Failed to delete media', e);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-white">Multimedia Center Manager</h2>
          <p className="text-xs text-zinc-400">
            Publish and manage masterclass videos, podcasts, and lecture transcripts.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="px-4 py-2 rounded-full bg-white text-black hover:bg-zinc-200 font-semibold text-xs shadow-sm flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Multimedia Session</span>
        </button>
      </div>

      {/* Media Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {mediaList.map((item) => (
          <div
            key={item._id}
            className="p-5 rounded-2xl bg-zinc-950 border border-white/[0.08] hover:border-white/20 transition-all flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="aspect-video w-full rounded-xl overflow-hidden bg-black relative">
                <img src={item.thumbnailUrl} alt="Thumb" className="w-full h-full object-cover opacity-80" />
                <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-black/80 text-[10px] font-mono uppercase text-zinc-300">
                  {item.type}
                </div>
                <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/80 text-[10px] font-mono text-zinc-400">
                  {item.duration}
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between text-[10px]">
                  <span className="text-zinc-400 font-mono">{item.domain}</span>
                  <span className="text-zinc-300 font-mono flex items-center gap-1">
                    <Star className="w-3 h-3 fill-zinc-300 text-zinc-300" /> {item.ratingAvg} ({item.ratingCount})
                  </span>
                </div>
                <h3 className="text-sm font-semibold text-white line-clamp-1">{item.title}</h3>
                <p className="text-xs text-zinc-500">Speaker: {item.speaker?.name}</p>
              </div>
            </div>

            <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs">
              <span className="text-[10px] text-zinc-500 font-mono">{item.viewsCount} views</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleOpenEdit(item)}
                  className="p-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-zinc-400 hover:text-white cursor-pointer"
                  title="Edit"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(item._id)}
                  className="p-1.5 rounded-lg bg-white/[0.04] hover:bg-red-950/40 text-red-400 cursor-pointer"
                  title="Delete"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* CREATE / EDIT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-zinc-950 border border-white/10 rounded-2xl p-6 sm:p-8 max-w-xl w-full max-h-[85vh] overflow-y-auto shadow-2xl space-y-5 text-white text-left animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
              <div>
                <h3 className="text-base font-semibold">
                  {modalMode === 'create' ? 'Add Multimedia Session' : 'Edit Multimedia Session'}
                </h3>
                <p className="text-xs text-zinc-400">Saves directly to MongoDB database</p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-7 h-7 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-zinc-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {msg && (
              <div className="p-3 rounded-xl bg-zinc-900 border border-white/10 text-zinc-300 text-xs">
                {msg}
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-3.5 text-xs">
              <div className="space-y-1">
                <label className="font-medium text-zinc-300">Session Title</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Navigating Distributed Systems"
                  className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-medium text-zinc-300">Media Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                    className="w-full bg-zinc-900 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-white cursor-pointer"
                  >
                    <option value="video">Masterclass Video</option>
                    <option value="podcast">Audio Podcast</option>
                    <option value="explainer">Animated Explainer</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-medium text-zinc-300">Domain Category</label>
                  <select
                    value={formData.domain}
                    onChange={(e) => setFormData({ ...formData, domain: e.target.value })}
                    className="w-full bg-zinc-900 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-white cursor-pointer"
                  >
                    <option value="Software & Cloud">Software &amp; Cloud</option>
                    <option value="AI & Data Science">AI &amp; Data Science</option>
                    <option value="Cybersecurity">Cybersecurity</option>
                    <option value="Design & UX">Design &amp; UX</option>
                    <option value="Healthcare & Biotech">Healthcare &amp; Biotech</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-medium text-zinc-300">Embed Video / Audio URL</label>
                  <input
                    type="url"
                    required
                    value={formData.url}
                    onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                    placeholder="https://www.youtube.com/embed/..."
                    className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-medium text-zinc-300">Thumbnail Image URL</label>
                  <input
                    type="url"
                    required
                    value={formData.thumbnailUrl}
                    onChange={(e) => setFormData({ ...formData, thumbnailUrl: e.target.value })}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-medium text-zinc-300">Speaker Name</label>
                  <input
                    type="text"
                    required
                    value={formData.speakerName}
                    onChange={(e) => setFormData({ ...formData, speakerName: e.target.value })}
                    className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-medium text-zinc-300">Duration (e.g. 18:45)</label>
                  <input
                    type="text"
                    required
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-white"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-medium text-zinc-300">Full Interactive Transcript</label>
                <textarea
                  rows={4}
                  required
                  value={formData.transcript}
                  onChange={(e) => setFormData({ ...formData, transcript: e.target.value })}
                  placeholder="Paste full transcript..."
                  className="w-full bg-white/[0.03] border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:ring-1 focus:ring-white"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-white/[0.08]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 rounded-xl bg-white text-black hover:bg-zinc-200 font-semibold flex items-center gap-2 cursor-pointer shadow-sm disabled:opacity-50"
                >
                  {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>{modalMode === 'create' ? 'Publish Session' : 'Save Changes'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
