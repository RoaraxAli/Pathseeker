import React, { useState, useEffect } from 'react';
import { authApi } from '../../services/api';
import { UserProfile, UserRole } from '../../types';
import {
  Users,
  Shield,
  Trash2,
  Edit3,
  CheckCircle2,
  Search,
  UserCheck,
  GraduationCap,
  Briefcase,
} from 'lucide-react';

export const AdminCandidatesPage: React.FC = () => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const data = await authApi.getAllUsers();
      setUsers(data);
    } catch (e) {
      console.error('Failed to load users', e);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId: string, newRole: UserRole) => {
    try {
      const updated = await authApi.adminUpdateUser(userId, { role: newRole });
      setUsers(users.map((u) => (u._id === userId || u.uid === userId ? updated : u)));
    } catch (e) {
      console.error('Failed to change role', e);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!window.confirm('Delete this user account?')) return;
    try {
      await authApi.deleteUser(userId);
      setUsers(users.filter((u) => u._id !== userId && u.uid !== userId));
    } catch (e) {
      console.error('Failed to delete user', e);
    }
  };

  const filtered = users.filter(
    (u) =>
      u.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-white">User Directory &amp; Role Access</h2>
          <p className="text-xs text-zinc-400">
            View all registered platform members and change role tiers (Student, Graduate, Professional, Admin).
          </p>
        </div>
      </div>

      <div className="relative max-w-md">
        <input
          type="text"
          placeholder="Filter by name, email or role..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-zinc-950 border border-white/10 rounded-xl pl-3 pr-8 py-2 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-white"
        />
        <Search className="w-3.5 h-3.5 text-zinc-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
      </div>

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
              {filtered.map((user) => {
                const uid = user._id || user.uid || user.id || '';
                return (
                  <tr key={uid} className="hover:bg-white/[0.02] transition-colors">
                    <td className="p-4 font-medium text-white">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-white text-black flex items-center justify-center font-bold text-[11px]">
                          {user.displayName ? user.displayName[0].toUpperCase() : 'U'}
                        </div>
                        <div>
                          <div>{user.displayName}</div>
                          <span className="text-[10px] text-zinc-500 font-mono font-normal">{user.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-zinc-400">{user.educationLevel || 'Undergraduate'}</td>
                    <td className="p-4 text-zinc-300">{user.targetRole || 'Software Engineer'}</td>
                    <td className="p-4">
                      <select
                        value={user.role}
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
                        className="p-1.5 rounded-lg bg-white/[0.04] hover:bg-red-950/40 text-red-400 cursor-pointer"
                        title="Delete User"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
