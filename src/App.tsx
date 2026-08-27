import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Pages
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { DashboardPage } from './pages/DashboardPage';
import { NotFoundPage } from './pages/NotFoundPage';

// Admin Suite Components & Pages
import { AdminRoute } from './components/admin/AdminRoute';
import { AdminLayout } from './components/admin/AdminLayout';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { AdminJobsPage } from './pages/admin/AdminJobsPage';
import { AdminApplicationsPage } from './pages/admin/AdminApplicationsPage';
import { AdminMessagesPage } from './pages/admin/AdminMessagesPage';
import { AdminStatisticsPage } from './pages/admin/AdminStatisticsPage';
import { AdminNewsPage } from './pages/admin/AdminNewsPage';
import { AdminCandidatesPage } from './pages/admin/AdminCandidatesPage';
import { AdminCompaniesPage } from './pages/admin/AdminCompaniesPage';
import { AdminSettingsPage } from './pages/admin/AdminSettingsPage';

// Public-Only Route: Redirects logged-in users to /dashboard or /admin
const PublicOnlyRoute: React.FC<{ element: React.ReactElement }> = ({ element }) => {
  const { profile, role, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white/50 text-xs font-mono">
        Connecting to session...
      </div>
    );
  }

  if (profile) {
    return <Navigate to={role === 'admin' ? '/admin/dashboard' : '/dashboard'} replace />;
  }

  return element;
};

// Protected Dashboard Wrapper: Redirects unauthenticated users to /login
const ProtectedRoute: React.FC<{ element: React.ReactElement }> = ({ element }) => {
  const { profile, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white/50 text-xs font-mono">
        Connecting to session...
      </div>
    );
  }

  if (profile) {
    return element;
  }

  return <Navigate to="/login" replace />;
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-black text-white flex flex-col font-body">
        <Routes>
          {/* Pre-login Landing Page (only accessible when not logged in) */}
          <Route path="/" element={<PublicOnlyRoute element={<LandingPage />} />} />

          {/* Auth Pages (only accessible when not logged in) */}
          <Route path="/login" element={<PublicOnlyRoute element={<LoginPage />} />} />
          <Route path="/register" element={<PublicOnlyRoute element={<RegisterPage />} />} />

          {/* User / Customer Dashboard (accessible when logged in) */}
          <Route path="/dashboard" element={<ProtectedRoute element={<DashboardPage />} />} />

          {/* Admin Portal Suite (accessible when role === 'admin') */}
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminLayout>
                  <AdminDashboardPage />
                </AdminLayout>
              </AdminRoute>
            }
          />
          <Route
            path="/admin/dashboard"
            element={
              <AdminRoute>
                <AdminLayout>
                  <AdminDashboardPage />
                </AdminLayout>
              </AdminRoute>
            }
          />
          <Route
            path="/admin/jobs"
            element={
              <AdminRoute>
                <AdminLayout>
                  <AdminJobsPage />
                </AdminLayout>
              </AdminRoute>
            }
          />
          <Route
            path="/admin/applications"
            element={
              <AdminRoute>
                <AdminLayout>
                  <AdminApplicationsPage />
                </AdminLayout>
              </AdminRoute>
            }
          />
          <Route
            path="/admin/messages"
            element={
              <AdminRoute>
                <AdminLayout>
                  <AdminMessagesPage />
                </AdminLayout>
              </AdminRoute>
            }
          />
          <Route
            path="/admin/statistics"
            element={
              <AdminRoute>
                <AdminLayout>
                  <AdminStatisticsPage />
                </AdminLayout>
              </AdminRoute>
            }
          />
          <Route
            path="/admin/news"
            element={
              <AdminRoute>
                <AdminLayout>
                  <AdminNewsPage />
                </AdminLayout>
              </AdminRoute>
            }
          />
          <Route
            path="/admin/candidates"
            element={
              <AdminRoute>
                <AdminLayout>
                  <AdminCandidatesPage />
                </AdminLayout>
              </AdminRoute>
            }
          />
          <Route
            path="/admin/companies"
            element={
              <AdminRoute>
                <AdminLayout>
                  <AdminCompaniesPage />
                </AdminLayout>
              </AdminRoute>
            }
          />
          <Route
            path="/admin/settings"
            element={
              <AdminRoute>
                <AdminLayout>
                  <AdminSettingsPage />
                </AdminLayout>
              </AdminRoute>
            }
          />

          {/* 404 Error Screen */}
          <Route path="/404" element={<NotFoundPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </div>
    </AuthProvider>
  );
};
