import React, { useState, useEffect } from 'react';
import { careerApi } from '../../services/api';
import { CareerItem } from '../../types';
import {
  Search,
  Plus,
  Edit3,
  Trash2,
  X,
  CheckCircle2,
  AlertCircle,
  Briefcase,
  Loader2,
  DollarSign,
  TrendingUp,
} from 'lucide-react';

export const AdminJobsPage: React.FC = () => {
  const [careers, setCareers] = useState<CareerItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    domain: 'Software & Cloud',
    summary: '',
    description: '',
    requiredSkills: '',
    educationPath: '',
    salaryEntry: 70000,
    salaryMid: 120000,
    salarySenior: 180000,
    jobDemand: 'High' as 'Explosive' | 'High' | 'Moderate',
    growthRate: '+22% (2024-2030)',
    isTrending: false,
  });

  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    loadCareers();
  }, []);

  const loadCareers = async () => {
    setLoading(true);
    try {
      const data = await careerApi.getCareers({});
      setCareers(data);
    } catch (e) {
      console.error('Failed to load careers', e);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreate = () => {
    setModalMode('create');
    setSelectedId(null);
    setFormData({
      title: '',
      domain: 'Software & Cloud',
      summary: '',
      description: '',
      requiredSkills: 'React, Node.js, TypeScript, Cloud Architecture',
      educationPath: 'B.S. in Computer Science or industry certifications',
      salaryEntry: 75000,
      salaryMid: 125000,
      salarySenior: 185000,
      jobDemand: 'High',
      growthRate: '+24% (2024-2030)',
      isTrending: false,
    });
    setMsg('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (career: CareerItem) => {
    setModalMode('edit');
    setSelectedId(career._id);
    setFormData({
      title: career.title,
      domain: career.domain,
      summary: career.summary,
      description: career.description,
      requiredSkills: career.requiredSkills.join(', '),
      educationPath: career.educationPath,
      salaryEntry: career.salaryRange?.entry || 70000,
      salaryMid: career.salaryRange?.mid || 120000,
      salarySenior: career.salaryRange?.senior || 180000,
      jobDemand: career.jobDemand,
      growthRate: career.growthRate || '+20% (2024-2030)',
      isTrending: career.isTrending,
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
        domain: formData.domain,
        summary: formData.summary || formData.description.slice(0, 140) + '...',
        description: formData.description,
        requiredSkills: formData.requiredSkills.split(',').map((s) => s.trim()).filter(Boolean),
        educationPath: formData.educationPath,
        salaryRange: {
          entry: Number(formData.salaryEntry),
          mid: Number(formData.salaryMid),
          senior: Number(formData.salarySenior),
          currency: 'USD ($)',
        },
        jobDemand: formData.jobDemand,
        growthRate: formData.growthRate,
        isTrending: formData.isTrending,
      };

      if (modalMode === 'create') {
        const created = await careerApi.createCareer(payload);
        setCareers([created, ...careers]);
        setMsg('Career profile created successfully.');
      } else if (selectedId) {
        const updated = await careerApi.updateCareer(selectedId, payload);
        setCareers(careers.map((c) => (c._id === selectedId ? updated : c)));
        setMsg('Career profile updated successfully.');
      }

      setTimeout(() => {
        setIsModalOpen(false);
        setMsg('');
      }, 1000);
    } catch (err: any) {
      setMsg(err.response?.data?.message || err.message || 'Failed to save career');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this career profile?')) return;
    try {
      await careerApi.deleteCareer(id);
      setCareers(careers.filter((c) => c._id !== id));
    } catch (e) {
      console.error('Failed to delete career', e);
    }
  };

  const filtered = careers.filter(
    (c) =>
      c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.domain.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-white">Career Bank Management</h2>
          <p className="text-xs text-zinc-400">
            Add, update, or remove career profiles, required skills, salary tiers, and demand telemetry.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="px-4 py-2 rounded-full bg-white text-black hover:bg-zinc-200 font-semibold text-xs shadow-sm flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Career Profile</span>
        </button>
      </div>

      {/* Search Filter */}
      <div className="relative max-w-md">
        <input
          type="text"
          placeholder="Filter careers by title or domain..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-zinc-950 border border-white/10 rounded-xl pl-3 pr-8 py-2 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-white"
        />
        <Search className="w-3.5 h-3.5 text-zinc-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
      </div>

      {/* Careers Table */}
      <div className="bg-zinc-950 border border-white/[0.08] rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-white/[0.02] text-zinc-400 border-b border-white/[0.08] text-[10px] uppercase font-mono font-medium">
              <tr>
                <th className="p-4">Career Title</th>
                <th className="p-4">Domain</th>
                <th className="p-4">Salary Range</th>
                <th className="p-4">Demand</th>
                <th className="p-4">Trending</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered.map((career) => (
                <tr key={career._id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="p-4 font-medium text-white">
                    <div>{career.title}</div>
                    <span className="text-[10px] text-zinc-500 font-mono">
                      {career.requiredSkills?.slice(0, 3).join(', ')}
                    </span>
                  </td>
                  <td className="p-4 text-zinc-400">{career.domain}</td>
                  <td className="p-4 font-mono text-zinc-200">
                    ${career.salaryRange?.entry?.toLocaleString()} - ${career.salaryRange?.senior?.toLocaleString()}
                  </td>
                  <td className="p-4">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-mono uppercase ${
                        career.jobDemand === 'Explosive'
                          ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                          : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      }`}
                    >
                      {career.jobDemand}
                    </span>
                  </td>
                  <td className="p-4">
                    {career.isTrending ? (
                      <span className="text-white font-mono text-[10px] font-medium">Trending</span>
                    ) : (
                      <span className="text-zinc-600 font-mono text-[10px]">Standard</span>
                    )}
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleOpenEdit(career)}
                        className="p-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-zinc-400 hover:text-white cursor-pointer"
                        title="Edit"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(career._id)}
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
                  {modalMode === 'create' ? 'Create New Career Profile' : 'Edit Career Profile'}
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
                <label className="font-medium text-zinc-300">Career Title</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Distributed Cloud Architect"
                  className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
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
                    <option value="Fintech & Business">Fintech &amp; Business</option>
                    <option value="Product & Strategy">Product &amp; Strategy</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-medium text-zinc-300">Job Demand Level</label>
                  <select
                    value={formData.jobDemand}
                    onChange={(e) => setFormData({ ...formData, jobDemand: e.target.value as any })}
                    className="w-full bg-zinc-900 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-white cursor-pointer"
                  >
                    <option value="Explosive">Explosive Demand</option>
                    <option value="High">High Demand</option>
                    <option value="Moderate">Moderate Demand</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="font-medium text-zinc-300">Entry Salary ($)</label>
                  <input
                    type="number"
                    required
                    value={formData.salaryEntry}
                    onChange={(e) => setFormData({ ...formData, salaryEntry: Number(e.target.value) })}
                    className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-white font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-medium text-zinc-300">Mid Salary ($)</label>
                  <input
                    type="number"
                    required
                    value={formData.salaryMid}
                    onChange={(e) => setFormData({ ...formData, salaryMid: Number(e.target.value) })}
                    className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-white font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-medium text-zinc-300">Senior Salary ($)</label>
                  <input
                    type="number"
                    required
                    value={formData.salarySenior}
                    onChange={(e) => setFormData({ ...formData, salarySenior: Number(e.target.value) })}
                    className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-white font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-medium text-zinc-300">Required Skills (Comma-separated)</label>
                <input
                  type="text"
                  required
                  value={formData.requiredSkills}
                  onChange={(e) => setFormData({ ...formData, requiredSkills: e.target.value })}
                  placeholder="React, TypeScript, Kubernetes, MongoDB"
                  className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-white"
                />
              </div>

              <div className="space-y-1">
                <label className="font-medium text-zinc-300">Full Description</label>
                <textarea
                  rows={3}
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Comprehensive description of responsibilities..."
                  className="w-full bg-white/[0.03] border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:ring-1 focus:ring-white"
                />
              </div>

              <div className="space-y-1">
                <label className="font-medium text-zinc-300">Educational Progression Pathway</label>
                <input
                  type="text"
                  required
                  value={formData.educationPath}
                  onChange={(e) => setFormData({ ...formData, educationPath: e.target.value })}
                  placeholder="B.S. in CS or industry bootcamps & certs"
                  className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-white"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="trending"
                  checked={formData.isTrending}
                  onChange={(e) => setFormData({ ...formData, isTrending: e.target.checked })}
                  className="accent-white w-4 h-4 cursor-pointer"
                />
                <label htmlFor="trending" className="text-xs text-zinc-300 font-medium cursor-pointer">
                  Feature as Trending Career on Landing Page &amp; Dashboard
                </label>
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
                  <span>{modalMode === 'create' ? 'Save Profile' : 'Update Profile'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
