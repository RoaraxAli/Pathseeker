import React, { useState } from 'react';
import { NavLink, useLocation, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  Search,
  BookOpen,
  MessageSquare,
  PieChart,
  Video,
  Users,
  FileText,
  Settings,
  Bell,
  Menu,
  X,
  LogOut,
  UserCheck,
  ChevronDown,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  Compass,
} from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const { profile, role, logout, switchRole } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const navItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Careers Manager', path: '/admin/jobs', icon: Search },
    { name: 'Success Stories', path: '/admin/applications', icon: BookOpen },
    { name: 'Feedback & Support', path: '/admin/messages', icon: MessageSquare },
    { name: 'Multimedia Content', path: '/admin/news', icon: Video },
    { name: 'User Directory & Roles', path: '/admin/candidates', icon: Users },
    { name: 'Resource Documents', path: '/admin/companies', icon: FileText },
    { name: 'Telemetry & Stats', path: '/admin/statistics', icon: PieChart },
    { name: 'System Settings', path: '/admin/settings', icon: Settings },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const currentNav = navItems.find(
    (item) =>
      location.pathname === item.path ||
      (item.path === '/admin/dashboard' && (location.pathname === '/admin' || location.pathname === '/admin/'))
  );
  const pageTitle = currentNav ? currentNav.name : 'Admin Dashboard';

  return (
    <div className="min-h-screen bg-black text-white flex flex-row font-sans selection:bg-zinc-800 selection:text-white">
      {/* Mobile Backdrop */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/80 z-40 lg:hidden backdrop-blur-sm transition-opacity"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:sticky top-0 left-0 h-screen w-64 bg-zinc-950 border-r border-white/[0.08] text-white z-50 flex flex-col justify-between transition-transform duration-300 ease-in-out shrink-0 overflow-y-auto ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div>
          {/* Top Brand Header */}
          <div className="p-6 flex items-center justify-between border-b border-white/[0.08]">
            <Link to="/admin/dashboard" className="flex items-center gap-3 group">
              <div className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center font-bold text-xs shadow-sm">
                <Compass className="w-4 h-4 text-black" />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-sm font-semibold tracking-tight text-white">
                  PathSeeker
                </span>
                <span className="text-[10px] text-zinc-500 font-mono">Admin Control Suite</span>
              </div>
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-1.5 rounded-lg bg-white/5 text-zinc-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="mt-4 px-3 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                location.pathname === item.path ||
                (item.path === '/admin/dashboard' && (location.pathname === '/admin' || location.pathname === '/admin/'));

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-white text-black shadow-sm font-semibold'
                      : 'text-zinc-400 hover:text-white hover:bg-white/[0.04]'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-black' : 'text-zinc-400'}`} />
                  <span>{item.name}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 text-xs text-zinc-500 border-t border-white/[0.08] space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-mono text-[11px] text-zinc-400">MongoDB Atlas Connected</span>
          </div>
          <div className="pt-1">
            <button
              onClick={() => {
                switchRole('student');
                navigate('/dashboard');
              }}
              className="w-full py-2 px-3 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] text-zinc-300 text-[11px] font-medium transition-all flex items-center justify-center gap-1.5 cursor-pointer border border-white/10"
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Switch to Seeker View</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navigation Bar */}
        <header className="sticky top-0 z-30 bg-zinc-950/90 backdrop-blur-md border-b border-white/[0.08] px-4 sm:px-8 py-3.5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 min-w-0">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl bg-white/5 text-zinc-400 hover:text-white"
            >
              <Menu className="w-4 h-4" />
            </button>

            <h1 className="text-lg sm:text-xl font-semibold tracking-tight text-white truncate">
              {pageTitle}
            </h1>
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            <Link
              to="/dashboard"
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 text-xs font-medium text-zinc-300 hover:text-white transition-all"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>User Portal</span>
            </Link>

            {/* Profile Avatar / Dropdown */}
            <div className="relative">
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-full hover:bg-white/5 transition-all cursor-pointer border border-white/10"
              >
                <div className="w-6 h-6 rounded-full bg-white text-black flex items-center justify-center font-bold text-xs">
                  {profile?.displayName ? profile.displayName[0].toUpperCase() : 'A'}
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-xs font-medium text-white leading-tight">
                    {profile?.displayName || 'Administrator'}
                  </p>
                  <p className="text-[10px] font-mono text-zinc-500 leading-tight">
                    Super Admin
                  </p>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-zinc-500 hidden sm:block" />
              </button>

              {profileDropdownOpen && (
                <div className="absolute right-0 mt-3 w-56 bg-zinc-950 border border-white/10 rounded-2xl shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2 text-left">
                  <div className="px-3 py-2 border-b border-white/[0.08]">
                    <p className="text-xs font-semibold text-white">{profile?.displayName}</p>
                    <p className="text-[10px] text-zinc-500 font-mono truncate">{profile?.email}</p>
                  </div>

                  <div className="py-1 text-xs space-y-0.5">
                    <Link
                      to="/admin/settings"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-zinc-300 hover:bg-white/5 font-medium"
                    >
                      <Settings className="w-3.5 h-3.5 text-zinc-400" />
                      <span>System Settings</span>
                    </Link>

                    <Link
                      to="/dashboard"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-zinc-300 hover:bg-white/5 font-medium"
                    >
                      <ExternalLink className="w-3.5 h-3.5 text-zinc-400" />
                      <span>Seeker Dashboard</span>
                    </Link>
                  </div>

                  <div className="pt-1 border-t border-white/[0.08]">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-red-400 hover:bg-red-950/20 font-medium text-xs cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0 text-left bg-black">{children}</main>
      </div>
    </div>
  );
};
