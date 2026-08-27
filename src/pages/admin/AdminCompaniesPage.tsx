import React, { useState, useEffect } from 'react';
import { resourceApi } from '../../services/api';
import { ResourceItem } from '../../types';
import {
  FileText,
  Plus,
  Edit3,
  Trash2,
  X,
  DownloadCloud,
  Loader2,
} from 'lucide-react';

export const AdminCompaniesPage: React.FC = () => {
  const [resources, setResources] = useState<ResourceItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    category: 'Resume Template' as any,
    description: '',
    fileUrl: '',
    previewSnippet: '',
    fileType: 'PDF Document',
    fileSize: '2.4 MB',
    tags: 'Resume, ATS, Career',
    isPopular: false,
  });

  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    loadResources();
  }, []);

  const loadResources = async () => {
    setLoading(true);
    try {
      const data = await resourceApi.getAll({});
      setResources(data);
    } catch (e) {
      console.error('Failed to load resources', e);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreate = () => {
    setModalMode('create');
    setSelectedId(null);
    setFormData({
      title: '',
      category: 'Resume Template',
      description: '',
      fileUrl: 'https://example.com/pathseeker-toolkit.pdf',
      previewSnippet: 'Includes executive summary formulas and achievement action verbs.',
      fileType: 'PDF Document',
      fileSize: '2.1 MB',
      tags: 'Resume, ATS, Career Starter',
      isPopular: false,
    });
    setMsg('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (resItem: ResourceItem) => {
    setModalMode('edit');
    setSelectedId(resItem._id);
    setFormData({
      title: resItem.title,
      category: resItem.category,
      description: resItem.description,
      fileUrl: resItem.fileUrl,
      previewSnippet: resItem.previewSnippet,
      fileType: resItem.fileType,
      fileSize: resItem.fileSize,
      tags: resItem.tags.join(', '),
      isPopular: resItem.isPopular,
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
        category: formData.category,
        description: formData.description,
        fileUrl: formData.fileUrl,
        previewSnippet: formData.previewSnippet,
        fileType: formData.fileType,
        fileSize: formData.fileSize,
        tags: formData.tags.split(',').map((t) => t.trim()).filter(Boolean),
        isPopular: formData.isPopular,
      };

      if (modalMode === 'create') {
        const created = await resourceApi.create(payload);
        setResources([created, ...resources]);
        setMsg('Resource published to library.');
      } else if (selectedId) {
        const updated = await resourceApi.update(selectedId, payload);
        setResources(resources.map((r) => (r._id === selectedId ? updated : r)));
        setMsg('Resource updated successfully.');
      }

      setTimeout(() => {
        setIsModalOpen(false);
        setMsg('');
      }, 1000);
    } catch (err: any) {
      setMsg(err.response?.data?.message || err.message || 'Failed to save resource');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this resource document?')) return;
    try {
      await resourceApi.delete(id);
      setResources(resources.filter((r) => r._id !== id));
    } catch (e) {
      console.error('Failed to delete resource', e);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-white">Document Resource Library Manager</h2>
          <p className="text-xs text-zinc-400">
            Publish downloadable ATS templates, roadmaps, interview checklists &amp; scholarship guides.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="px-4 py-2 rounded-full bg-white text-black hover:bg-zinc-200 font-semibold text-xs shadow-sm flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Document Resource</span>
        </button>
      </div>

      {/* Resources Table */}
      <div className="bg-zinc-950 border border-white/[0.08] rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-white/[0.02] text-zinc-400 border-b border-white/[0.08] text-[10px] uppercase font-mono font-medium">
              <tr>
                <th className="p-4">Document Title</th>
                <th className="p-4">Category</th>
                <th className="p-4">Format &amp; Size</th>
                <th className="p-4">Total Downloads</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {resources.map((resItem) => (
                <tr key={resItem._id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="p-4 font-medium text-white">
                    <div>{resItem.title}</div>
                    <span className="text-[10px] text-zinc-500 line-clamp-1 font-normal">
                      {resItem.description}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase bg-white/5 text-zinc-400">
                      {resItem.category}
                    </span>
                  </td>
                  <td className="p-4 text-zinc-400 font-mono text-[11px]">
                    {resItem.fileType} ({resItem.fileSize})
                  </td>
                  <td className="p-4 text-zinc-200 font-mono">
                    {resItem.downloadsCount.toLocaleString()} downloads
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleOpenEdit(resItem)}
                        className="p-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-zinc-400 hover:text-white cursor-pointer"
                        title="Edit"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(resItem._id)}
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

      {/* CREATE / EDIT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-zinc-950 border border-white/10 rounded-2xl p-6 sm:p-8 max-w-xl w-full max-h-[85vh] overflow-y-auto shadow-2xl space-y-5 text-white text-left animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
              <div>
                <h3 className="text-base font-semibold">
                  {modalMode === 'create' ? 'Add Resource Document' : 'Edit Resource Document'}
                </h3>
                <p className="text-xs text-zinc-400">Uploads to Document Resource Library</p>
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
                <label className="font-medium text-zinc-300">Document Title</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. 2026 Tech Resume Master Toolkit"
                  className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-medium text-zinc-300">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                    className="w-full bg-zinc-900 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-white cursor-pointer"
                  >
                    <option value="Resume Template">Resume Template</option>
                    <option value="Career Roadmap">Career Roadmap</option>
                    <option value="Interview Checklist">Interview Checklist</option>
                    <option value="Scholarship Guide">Scholarship Guide</option>
                    <option value="Skill Cheat Sheet">Skill Cheat Sheet</option>
                    <option value="Infographic">Infographic</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-medium text-zinc-300">File Type &amp; Size</label>
                  <input
                    type="text"
                    required
                    value={formData.fileSize}
                    onChange={(e) => setFormData({ ...formData, fileSize: e.target.value })}
                    placeholder="e.g. 2.4 MB PDF"
                    className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-white"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-medium text-zinc-300">Download File URL</label>
                <input
                  type="url"
                  required
                  value={formData.fileUrl}
                  onChange={(e) => setFormData({ ...formData, fileUrl: e.target.value })}
                  placeholder="https://example.com/file.pdf"
                  className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-white"
                />
              </div>

              <div className="space-y-1">
                <label className="font-medium text-zinc-300">Description</label>
                <textarea
                  rows={2}
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Brief description..."
                  className="w-full bg-white/[0.03] border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:ring-1 focus:ring-white"
                />
              </div>

              <div className="space-y-1">
                <label className="font-medium text-zinc-300">Preview Snippet Modal Content</label>
                <textarea
                  rows={3}
                  required
                  value={formData.previewSnippet}
                  onChange={(e) => setFormData({ ...formData, previewSnippet: e.target.value })}
                  placeholder="Key summary or outline..."
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
                  <span>{modalMode === 'create' ? 'Save Document' : 'Update Document'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
