import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiFetch } from '../api/client';

function QuestionStep({ question, value, onChange }) {
  if (question.type === 'rating') {
    const scale = [];
    for (let i = question.scaleMin; i <= question.scaleMax; i++) scale.push(i);
    return (
      <div className="row" style={{ justifyContent: 'center', gap: 10 }}>
        {scale.map((n) => {
          const selected = value === n;
          return (
            <button
              key={n}
              type="button"
              className={`quiz-scale-btn${selected ? ' is-selected' : ''}`}
              onClick={() => onChange(n)}
            >
              {n}
            </button>
          );
        })}
      </div>
    );
  }

  if (question.type === 'slider') {
    return (
      <div>
        <input
          type="range"
          min={question.scaleMin}
          max={question.scaleMax}
          value={value ?? Math.round((question.scaleMin + question.scaleMax) / 2)}
          onChange={(e) => onChange(Number(e.target.value))}
          style={{ width: '100%' }}
        />
        <p style={{ textAlign: 'center', fontWeight: 700, fontSize: '1.25rem', color: 'var(--accent)' }}>
          {value ?? Math.round((question.scaleMin + question.scaleMax) / 2)}
        </p>
      </div>
    );
  }

  // multiple-choice
  return (
    <div className="stack">
      {question.options.map((opt) => {
        const selected = value === opt.value;
        return (
          <label
            key={opt.value}
            className={`card quiz-option${selected ? ' is-selected' : ''}`}
          >
            <input
              type="radio"
              name={question._id}
              checked={selected}
              onChange={() => onChange(opt.value)}
            />
            {opt.label}
          </label>
        );
      })}
    </div>
  );
}

function ResultsView({ result }) {
  const sortedScores = Object.entries(result.scores).sort((a, b) => b[1] - a[1]);

  return (
    <div>
      <div className="page-header">
        <h1>Your results</h1>
        <p>Here's how your answers broke down by category.</p>
      </div>

      <div className="card" style={{ marginBottom: 'var(--space-6)' }}>
        {sortedScores.map(([category, score]) => (
          <div key={category} style={{ marginBottom: 'var(--space-3)' }}>
            <div className="row-between" style={{ marginBottom: 4 }}>
              <span style={{ fontWeight: 600 }}>{category}</span>
              <span className="text-sm muted">{score}%</span>
            </div>
            <div className="progress-track">
              <div
                className="progress-fill"
                style={{
                  width: `${score}%`,
                  background: result.topCategories.includes(category)
                    ? undefined
                    : 'rgba(255,255,255,0.22)',
                  boxShadow: result.topCategories.includes(category) ? undefined : 'none',
                }}
              />
            </div>
          </div>
        ))}
      </div>

      <h3>
        Top matches:{' '}
        {result.topCategories.length ? (
          result.topCategories.map((c) => (
            <span key={c} className="badge badge-accent" style={{ marginRight: 4 }}>
              {c}
            </span>
          ))
        ) : (
          <span className="muted">None strongly</span>
        )}
      </h3>

      <h3 style={{ marginTop: 'var(--space-5)' }}>Suggested careers</h3>
      {result.suggestedCareers.length === 0 ? (
        <p className="muted">No matching careers found yet.</p>
      ) : (
        <ul className="card-list">
          {result.suggestedCareers.map((c) => (
            <li key={c._id} className="card">
              <strong>{c.title}</strong>
              <div className="row" style={{ marginTop: 4, gap: 6 }}>
                <span className="badge">{c.domain}</span>
                <span className="badge badge-success">{c.jobDemand} demand</span>
              </div>
            </li>
          ))}
        </ul>
      )}

      <p style={{ marginTop: 'var(--space-5)' }}>
        <Link to="/careers">Browse the full Career Bank</Link> ·{' '}
        <Link to="/quiz/history">View quiz history</Link>
      </p>
    </div>
  );
}

export default function Quiz() {
  const [questions, setQuestions] = useState(null);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({}); // questionId -> value
  const [timeLeft, setTimeLeft] = useState(0);
  const [result, setResult] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const timerRef = useRef(null);

  useEffect(() => {
    apiFetch('/quiz/questions')
      .then((data) => setQuestions(data.questions))
      .catch((err) => setError(err.message));
  }, []);

  const current = questions?.[step];

  // Per-question countdown. Reaching zero auto-advances (an unanswered
  // question just contributes nothing to scoring).
  useEffect(() => {
    if (!current) return;
    setTimeLeft(current.timeLimitSeconds);
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current);
          goNext();
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, questions]);

  function goNext() {
    setStep((s) => {
      const next = s + 1;
      if (questions && next >= questions.length) {
        submitQuiz();
      }
      return next;
    });
  }

  async function submitQuiz() {
    setSubmitting(true);
    setError('');
    clearInterval(timerRef.current);
    try {
      const payload = {
        answers: Object.entries(answers).map(([question, value]) => ({ question, value })),
      };
      const data = await apiFetch('/quiz/submit', { method: 'POST', body: payload });
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  if (error) return <p className="container container-narrow field-error">{error}</p>;
  if (!questions) return <p className="container muted">Loading quiz...</p>;

  if (result) {
    return (
      <section className="container container-narrow">
        <ResultsView result={result} />
      </section>
    );
  }

  if (submitting || step >= questions.length) {
    return (
      <p className="container container-narrow muted">
        <span className="spinner" style={{ marginRight: 8 }} />
        Scoring your answers...
      </p>
    );
  }

  return (
    <section className="container container-narrow">
      <div className="row-between" style={{ marginBottom: 'var(--space-2)' }}>
        <h1 style={{ margin: 0 }}>Interest Quiz</h1>
        <span className={`badge${timeLeft <= 5 ? ' badge-danger' : ''}`}>{timeLeft}s</span>
      </div>
      <p className="muted text-sm">
        Question {step + 1} of {questions.length}
      </p>
      <div className="progress-track" style={{ marginBottom: 'var(--space-8)', height: 6 }}>
        <div
          className="progress-fill"
          style={{ width: `${((step + 1) / questions.length) * 100}%` }}
        />
      </div>

      <h2 style={{ textAlign: 'center' }}>{current.text}</h2>
      <div style={{ margin: 'var(--space-8) 0' }}>
        <QuestionStep
          question={current}
          value={answers[current._id]}
          onChange={(value) => setAnswers((a) => ({ ...a, [current._id]: value }))}
        />
      </div>

      <div className="row" style={{ justifyContent: 'center' }}>
        <button type="submit" onClick={goNext}>
          {step + 1 === questions.length ? 'Finish' : 'Next'}
        </button>
      </div>
    </section>
  );
}
