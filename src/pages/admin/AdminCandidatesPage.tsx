import React, { useState, useEffect } from 'react';
import { authApi } from '../../services/api';
import { UserProfile, UserRole } from '../../types';
import {
  Users,
  Shield,
  Trash2,
  Search,
  Loader2,
  RefreshCw,
  AlertCircle,
} from 'lucide-react';

export const AdminCandidatesPage: React.FC = () => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const defaultUsers: UserProfile[] = [
    {
      uid: 'user-admin-1',
      _id: 'user-admin-1',
      displayName: 'System Administrator',
      email: 'admin@pathseeker.com',
      role: 'admin',
      educationLevel: 'Postgraduate / Staff',
      targetRole: 'Platform Orchestrator',
      isOnboarded: true,
    },
    {
      uid: 'user-demo-2',
      _id: 'user-demo-2',
      displayName: 'Elena Rostova',
      email: 'elena.rostova@example.com',
      role: 'graduate',
      educationLevel: 'Bachelor Degree Graduate',
      targetRole: 'Full-Stack Cloud Architect',
      isOnboarded: true,
    },
    {
      uid: 'user-demo-3',
      _id: 'user-demo-3',
      displayName: 'Marcus Chen',
      email: 'marcus.chen@example.com',
      role: 'professional',
      educationLevel: 'Experienced Working Professional',
      targetRole: 'Cybersecurity Threat Hunter',
      isOnboarded: true,
    },
    {
      uid: 'user-demo-4',
      _id: 'user-demo-4',
      displayName: 'Amina Al-Mansoor',
      email: 'amina.mansoor@example.com',
      role: 'student',
      educationLevel: 'Undergraduate Student',
      targetRole: 'AI & Generative LLM Engineer',
      isOnboarded: true,
    },
  ];

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await authApi.getAllUsers();
      if (Array.isArray(data) && data.length > 0) {
        setUsers(data);
      } else {
        setUsers(defaultUsers);
      }
    } catch (e: any) {
      console.error('Failed to load users, using fallback', e);
      setUsers(defaultUsers);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId: string, newRole: UserRole) => {
    try {
      const updated = await authApi.adminUpdateUser(userId, { role: newRole });
      setUsers((prev) =>
        prev.map((u) => (u._id === userId || u.uid === userId || u.id === userId ? { ...u, ...updated, role: newRole } : u))
      );
    } catch (e) {
      console.error('Failed to change role', e);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!window.confirm('Are you sure you want to delete this user account?')) return;
    try {
      await authApi.deleteUser(userId);
      setUsers((prev) => prev.filter((u) => u._id !== userId && u.uid !== userId && u.id !== userId));
    } catch (e) {
      console.error('Failed to delete user', e);
    }
  };

  const filtered = users.filter((u) => {
    if (!u) return false;
    const name = (u.displayName || '').toLowerCase();
    const mail = (u.email || '').toLowerCase();
    const r = (u.role || '').toLowerCase();
    const query = searchTerm.toLowerCase();
    return name.includes(query) || mail.includes(query) || r.includes(query);
  });

  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-white flex items-center gap-2.5">
            <Users className="w-6 h-6 text-white" />
            <span>User Directory &amp; Role Access</span>
          </h2>
          <p className="text-xs text-zinc-400">
            View all registered platform members and change role tiers (Student, Graduate, Professional, Admin).
          </p>
        </div>

        <button
          onClick={loadUsers}
          className="px-3.5 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-zinc-300 hover:text-white border border-white/10 text-xs font-medium flex items-center gap-2 cursor-pointer self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Directory</span>
        </button>
      </div>

      <div className="relative max-w-md">
        <input
          type="text"
          placeholder="Filter by name, email or role..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-zinc-950 border border-white/10 rounded-xl pl-3 pr-8 py-2.5 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-white"
        />
        <Search className="w-3.5 h-3.5 text-zinc-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-950/30 border border-red-800/40 text-red-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="bg-zinc-950 border border-white/[0.08] rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-white/[0.02] text-zinc-400 border-b border-white/[0.08] text-[10px] uppercase font-mono font-medium">
              <tr>
                <th className="p-4">Seeker Identity</th>
                <th className="p-4">Education Level</th>
                <th className="p-4">Target Role</th>
                <th className="p-4">Assigned Role</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr>
                  <td colSpan={5} className="p-12 text-center text-zinc-500">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-white/50" />
                    <span>Loading platform user records...</span>
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-12 text-center text-zinc-500">
                    No matching users found in directory.
                  </td>
                </tr>
              ) : (
                filtered.map((user) => {
                  const uid = user._id || user.uid || user.id || '';
                  const initial = user.displayName ? user.displayName[0].toUpperCase() : (user.email ? user.email[0].toUpperCase() : 'U');
                  return (
                    <tr key={uid || user.email} className="hover:bg-white/[0.02] transition-colors">
                      <td className="p-4 font-medium text-white">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-full bg-white text-black flex items-center justify-center font-bold text-[11px] shrink-0">
                            {initial}
                          </div>
                          <div>
                            <div className="font-semibold text-white">{user.displayName || 'Unnamed User'}</div>
                            <span className="text-[10px] text-zinc-500 font-mono font-normal">{user.email}</span>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-zinc-400">{user.educationLevel || 'Undergraduate'}</td>
                      <td className="p-4 text-zinc-300">{user.targetRole || 'Software Engineer'}</td>
                      <td className="p-4">
                        <select
                          value={user.role || 'student'}
                          onChange={(e) => handleRoleChange(uid, e.target.value as UserRole)}
                          className="bg-zinc-900 border border-white/10 rounded-lg px-2.5 py-1 text-xs text-white focus:outline-none focus:ring-1 focus:ring-white capitalize cursor-pointer font-medium"
                        >
                          <option value="student">Student</option>
                          <option value="graduate">Graduate</option>
                          <option value="professional">Professional</option>
                          <option value="admin">Admin</option>
                        </select>
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => handleDeleteUser(uid)}
                          className="p-1.5 rounded-lg bg-white/[0.04] hover:bg-red-950/40 text-red-400 cursor-pointer transition-colors"
                          title="Delete User"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
