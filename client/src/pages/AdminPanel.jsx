import { Link } from 'react-router-dom';

const SECTIONS = [
  { to: '/admin/careers', label: 'Careers', desc: 'Add, edit, remove career entries' },
  { to: '/admin/media', label: 'Media', desc: 'Add, edit, remove videos/podcasts/explainers' },
  { to: '/admin/quiz-questions', label: 'Quiz Questions', desc: 'Add, edit, remove interest quiz questions' },
  { to: '/admin/stories', label: 'Success Stories', desc: 'Approve, edit, remove submitted stories' },
  { to: '/admin/feedback', label: 'Feedback', desc: 'View submitted feedback and analytics' },
  { to: '/admin/usage-stats', label: 'Usage Stats', desc: 'Active users, quiz attempts, popular content' },
];

export default function AdminPanel() {
  return (
    <section className="container">
      <div className="page-header">
        <h1>Admin Panel</h1>
        <p>Manage content and review activity across PathSeeker.</p>
      </div>
      <div className="grid">
        {SECTIONS.map((s) => (
          <Link key={s.to} to={s.to} className="card card-link">
            <strong>{s.label}</strong>
            <p className="text-sm muted" style={{ margin: '4px 0 0' }}>
              {s.desc}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}
