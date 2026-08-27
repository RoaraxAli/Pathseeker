import React from 'react';
import { Navigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ShieldAlert, ArrowRight, ShieldCheck } from 'lucide-react';

interface AdminRouteProps {
  children: React.ReactNode;
}

export const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const { profile, role, loading, switchRole } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#1e1346] flex flex-col items-center justify-center text-white/70 font-sans">
        <div className="w-10 h-10 border-4 border-white/20 border-t-purple-400 rounded-full animate-spin mb-4" />
        <span className="text-sm font-medium tracking-wide">Validating Admin Credentials...</span>
      </div>
    );
  }

  if (!profile) {
    return <Navigate to="/login" replace />;
  }

  // If user has 'admin' role or admin email, render the admin dashboard/page
  const isAdmin = role === 'admin' || profile.role === 'admin' || (profile.email && profile.email.toLowerCase().includes('admin'));
  if (isAdmin) {
    return <>{children}</>;
  }

  // If user is a customer, provide an authorization gate with easy 1-click test elevation
  return (
    <div className="min-h-screen bg-[#0d0922] text-white flex flex-col items-center justify-center p-6 font-sans">
      <div className="w-full max-w-md bg-[#191338] border border-purple-500/20 rounded-3xl p-8 shadow-2xl text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center mx-auto text-purple-400">
          <ShieldAlert className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-black tracking-tight text-white">Admin Access Required</h2>
          <p className="text-sm text-purple-200/70">
            You are currently signed in as <span className="font-semibold text-purple-300">"{profile.email}"</span> with role <span className="px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 font-mono text-xs uppercase">{role}</span>.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-purple-950/40 border border-purple-800/40 text-xs text-purple-200/80 text-left space-y-2">
          <p className="font-medium flex items-center gap-1.5 text-purple-300">
            <ShieldCheck className="w-4 h-4 text-purple-400" />
            Testing the Admin Portal:
          </p>
          <p>
            You can elevate your current session to <strong>Administrator</strong> right now to inspect all admin pages.
          </p>
        </div>

        <div className="space-y-3 pt-2">
          <button
            onClick={() => switchRole('admin')}
            className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-sm shadow-lg shadow-purple-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Switch to Admin & Enter Portal</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <Link
            to="/dashboard"
            className="block text-xs font-semibold text-purple-400 hover:text-purple-300 transition-colors"
          >
            &larr; Return to Customer Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
};
