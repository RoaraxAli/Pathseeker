import { useEffect, useRef, useState } from 'react'
import { Routes, Route, Link, NavLink, Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import { apiFetch } from './api/client'
import ProtectedRoute from './components/ProtectedRoute'
import AdminRoute from './components/AdminRoute'
import Login from './pages/Login'
import Register from './pages/Register'
import ForgotPassword from './pages/ForgotPassword'
import Profile from './pages/Profile'
import CareerBank from './pages/CareerBank'
import Quiz from './pages/Quiz'
import QuizHistory from './pages/QuizHistory'
import MediaCenter from './pages/MediaCenter'
import MediaDetail from './pages/MediaDetail'
import ResourceLibrary from './pages/ResourceLibrary'
import SuccessStories from './pages/SuccessStories'
import Bookmarks from './pages/Bookmarks'
import BookmarkShareView from './pages/BookmarkShareView'
import Feedback from './pages/Feedback'
import Notifications from './pages/Notifications'
import AdminPanel from './pages/AdminPanel'
import AdminCareers from './pages/admin/AdminCareers'
import AdminMedia from './pages/admin/AdminMedia'
import AdminQuizQuestions from './pages/admin/AdminQuizQuestions'
import AdminStories from './pages/admin/AdminStories'
import AdminFeedback from './pages/admin/AdminFeedback'
import AdminUsageStats from './pages/admin/AdminUsageStats'
import Dashboard from './pages/Dashboard'
import './App.css'

function useUnreadCount() {
  const [count, setCount] = useState(0)
  useEffect(() => {
    let cancelled = false
    function poll() {
      apiFetch('/notifications/unread-count')
        .then((data) => !cancelled && setCount(data.count))
        .catch(() => {})
    }
    poll()
    const interval = setInterval(poll, 30000)
    return () => {
      cancelled = true
      clearInterval(interval)
    }
  }, [])
  return count
}

// Secondary account links (Bookmarks, Notifications, Profile, Admin, Log
// out) live behind one avatar trigger instead of five flat nav links —
// otherwise a logged-in admin's nav has too many items to fit one row.
function UserMenu({ user, logout }) {
  const [open, setOpen] = useState(false)
  const boxRef = useRef(null)
  const navigate = useNavigate()
  const unreadCount = useUnreadCount()

  useEffect(() => {
    function handleClick(e) {
      if (boxRef.current && !boxRef.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  function go(path) {
    setOpen(false)
    navigate(path)
  }

  return (
    <div ref={boxRef} style={{ position: 'relative' }}>
      <button type="button" className="user-menu-trigger" onClick={() => setOpen((o) => !o)}>
        <span className="avatar-dot">{user.name.charAt(0).toUpperCase()}</span>
        {unreadCount > 0 && <span className="nav-bell-count">{unreadCount > 9 ? '9+' : unreadCount}</span>}
      </button>
      {open && (
        <div className="user-menu card">
          <p className="text-sm" style={{ margin: '0 0 var(--space-2)', fontWeight: 600 }}>
            {user.name}
          </p>
          <button type="button" className="user-menu-item" onClick={() => go('/dashboard')}>
            Dashboard
          </button>
          <button type="button" className="user-menu-item" onClick={() => go('/bookmarks')}>
            Bookmarks
          </button>
          <button type="button" className="user-menu-item" onClick={() => go('/notifications')}>
            Notifications{unreadCount > 0 ? ` (${unreadCount})` : ''}
          </button>
          <button type="button" className="user-menu-item" onClick={() => go('/profile')}>
            Profile
          </button>
          {user.role === 'admin' && (
            <button type="button" className="user-menu-item" onClick={() => go('/admin')}>
              Admin Panel
            </button>
          )}
          <hr style={{ margin: 'var(--space-2) 0' }} />
          <button type="button" className="user-menu-item" onClick={logout}>
            Log out
          </button>
        </div>
      )}
    </div>
  )
}

function navLinkClass({ isActive }) {
  return `nav-link${isActive ? ' active' : ''}`
}

function NavBar() {
  const { user, logout } = useAuth()
  return (
    <header className="site-header">
      <nav className="site-nav">
        <Link to="/" className="brand">
          PathSeeker
        </Link>
        <div className="nav-links">
          <NavLink to="/careers" className={navLinkClass}>
            Career Bank
          </NavLink>
          <NavLink to="/media" className={navLinkClass}>
            Multimedia
          </NavLink>
          <NavLink to="/resources" className={navLinkClass}>
            Resources
          </NavLink>
          <NavLink to="/success-stories" className={navLinkClass}>
            Success Stories
          </NavLink>
          {user && (
            <NavLink to="/quiz" className={navLinkClass}>
              Interest Quiz
            </NavLink>
          )}
        </div>

        <div className="nav-spacer">
          {user ? (
            <UserMenu user={user} logout={logout} />
          ) : (
            <>
              <NavLink to="/feedback" className={navLinkClass}>
                Feedback
              </NavLink>
              <NavLink to="/login" className={navLinkClass}>
                Log in
              </NavLink>
              <Link to="/register">
                <button type="submit" className="btn-sm">
                  Sign up
                </button>
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  )
}

function Home() {
  const { user, loading } = useAuth()

  if (loading) return <p className="container">Loading...</p>
  if (user) return <Navigate to="/dashboard" replace />

  return (
    <section className="hero-section">
      <div className="hero-glass">
        <h1>Find your path, with confidence</h1>
        <p>
          Explore careers, take the interest quiz, and get personalized recommendations — all in one place.
        </p>
        <div className="row hero-actions">
          <Link to="/register">
            <button type="submit">Create a free account</button>
          </Link>
          <Link to="/careers">
            <button type="button">Browse the Career Bank</button>
          </Link>
        </div>
        <p className="text-sm muted" style={{ marginTop: 'var(--space-4)' }}>
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </div>
    </section>
  )
}

function App() {
  return (
    <>
      <div className="bg-orbs" aria-hidden="true">
        <span className="orb orb-1" />
        <span className="orb orb-2" />
        <span className="orb orb-3" />
      </div>
      <NavBar />
      <main className="app-main">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/careers" element={<CareerBank />} />
        <Route path="/media" element={<MediaCenter />} />
        <Route path="/media/:id" element={<MediaDetail />} />
        <Route path="/resources" element={<ResourceLibrary />} />
        <Route path="/success-stories" element={<SuccessStories />} />
        <Route path="/feedback" element={<Feedback />} />
        <Route path="/share/bookmarks/:token" element={<BookmarkShareView />} />
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminPanel />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/careers"
          element={
            <AdminRoute>
              <AdminCareers />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/media"
          element={
            <AdminRoute>
              <AdminMedia />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/quiz-questions"
          element={
            <AdminRoute>
              <AdminQuizQuestions />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/stories"
          element={
            <AdminRoute>
              <AdminStories />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/feedback"
          element={
            <AdminRoute>
              <AdminFeedback />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/usage-stats"
          element={
            <AdminRoute>
              <AdminUsageStats />
            </AdminRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/quiz"
          element={
            <ProtectedRoute>
              <Quiz />
            </ProtectedRoute>
          }
        />
        <Route
          path="/quiz/history"
          element={
            <ProtectedRoute>
              <QuizHistory />
            </ProtectedRoute>
          }
        />
        <Route
          path="/bookmarks"
          element={
            <ProtectedRoute>
              <Bookmarks />
            </ProtectedRoute>
          }
        />
        <Route
          path="/notifications"
          element={
            <ProtectedRoute>
              <Notifications />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      </main>
    </>
  )
}

export default App
