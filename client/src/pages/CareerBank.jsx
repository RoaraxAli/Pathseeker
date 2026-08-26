import { useCallback, useEffect, useRef, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { apiFetch } from '../api/client';
import BookmarkButton from '../components/BookmarkButton';

function useDebouncedValue(value, delayMs) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(t);
  }, [value, delayMs]);
  return debounced;
}

function SearchBar({ query, setQuery, onPick }) {
  const debouncedQuery = useDebouncedValue(query, 250);
  const [suggestions, setSuggestions] = useState([]);
  const [open, setOpen] = useState(false);
  const boxRef = useRef(null);

  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setSuggestions([]);
      return;
    }
    let cancelled = false;
    apiFetch(`/careers/suggest?q=${encodeURIComponent(debouncedQuery)}`)
      .then((data) => {
        if (!cancelled) setSuggestions(data.suggestions);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [debouncedQuery]);

  // Close the dropdown on outside click.
  useEffect(() => {
    function handleClick(e) {
      if (boxRef.current && !boxRef.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <div ref={boxRef} style={{ position: 'relative', maxWidth: 420 }}>
      <input
        type="search"
        placeholder="Search careers (typos okay — try 'enginer')"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
      />
      {open && suggestions.length > 0 && (
        <ul
          className="card"
          style={{
            position: 'absolute',
            top: 'calc(100% + 4px)',
            left: 0,
            right: 0,
            listStyle: 'none',
            margin: 0,
            padding: 6,
            zIndex: 10,
          }}
        >
          {suggestions.map((s) => (
            <li key={s.id}>
              <button
                type="button"
                className="btn-ghost"
                style={{ width: '100%', textAlign: 'left', display: 'block' }}
                onClick={() => {
                  setQuery(s.title);
                  setOpen(false);
                  onPick(s.title);
                }}
              >
                {s.title}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function demandBadgeClass(demand) {
  if (demand === 'high') return 'badge badge-success';
  if (demand === 'low') return 'badge';
  return 'badge badge-accent';
}

function CareerCard({ career }) {
  return (
    <li className="card">
      <div className="row-between" style={{ alignItems: 'flex-start' }}>
        <div>
          <h3 style={{ margin: 0 }}>{career.title}</h3>
          <div className="row" style={{ marginTop: 6, gap: 6 }}>
            <span className="badge">{career.domain}</span>
            <span className={demandBadgeClass(career.jobDemand)}>{career.jobDemand} demand</span>
          </div>
        </div>
        <strong className="text-sm" style={{ whiteSpace: 'nowrap' }}>
          ${career.salaryRange.min.toLocaleString()}–${career.salaryRange.max.toLocaleString()}
        </strong>
      </div>
      <p style={{ marginTop: 'var(--space-3)' }}>{career.description}</p>
      {career.requiredSkills.length > 0 && (
        <p className="text-sm muted">
          <strong style={{ color: 'var(--text)' }}>Skills:</strong> {career.requiredSkills.join(', ')}
        </p>
      )}
      <BookmarkButton itemType="career" itemId={career._id} />
    </li>
  );
}

const EMPTY_FILTERS = { domain: '', skills: '', salaryMin: '', salaryMax: '', demand: '' };

export default function CareerBank() {
  const { user } = useAuth();
  const [meta, setMeta] = useState({ domains: [], skills: [], demandLevels: [] });
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [careers, setCareers] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [savedSearches, setSavedSearches] = useState([]);
  const [saveName, setSaveName] = useState('');
  const [saveMessage, setSaveMessage] = useState('');

  useEffect(() => {
    apiFetch('/careers/meta').then(setMeta).catch(() => {});
  }, []);

  useEffect(() => {
    if (user) {
      apiFetch('/saved-searches')
        .then((data) => setSavedSearches(data.savedSearches))
        .catch(() => {});
    } else {
      setSavedSearches([]);
    }
  }, [user]);

  const fetchResults = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      if (query.trim()) {
        const data = await apiFetch(`/careers/search?q=${encodeURIComponent(query)}`);
        setCareers(data.careers);
        setTotal(data.careers.length);
      } else {
        const params = new URLSearchParams();
        if (filters.domain) params.set('domain', filters.domain);
        if (filters.skills) params.set('skills', filters.skills);
        if (filters.salaryMin) params.set('salaryMin', filters.salaryMin);
        if (filters.salaryMax) params.set('salaryMax', filters.salaryMax);
        if (filters.demand) params.set('demand', filters.demand);
        const data = await apiFetch(`/careers?${params.toString()}`);
        setCareers(data.careers);
        setTotal(data.total);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [query, filters]);

  useEffect(() => {
    fetchResults();
  }, [fetchResults]);

  function updateFilter(field) {
    return (e) => setFilters((f) => ({ ...f, [field]: e.target.value }));
  }

  function applySavedSearch(search) {
    setQuery(search.filters.q || '');
    setFilters({
      domain: search.filters.domain || '',
      skills: (search.filters.skills || []).join(','),
      salaryMin: search.filters.salaryMin || '',
      salaryMax: search.filters.salaryMax || '',
      demand: search.filters.demand || '',
    });
  }

  async function handleSaveSearch(e) {
    e.preventDefault();
    setSaveMessage('');
    try {
      const data = await apiFetch('/saved-searches', {
        method: 'POST',
        body: {
          name: saveName,
          filters: {
            q: query,
            domain: filters.domain,
            skills: filters.skills ? filters.skills.split(',').map((s) => s.trim()) : [],
            salaryMin: filters.salaryMin ? Number(filters.salaryMin) : undefined,
            salaryMax: filters.salaryMax ? Number(filters.salaryMax) : undefined,
            demand: filters.demand,
          },
        },
      });
      setSavedSearches((prev) => [data.savedSearch, ...prev]);
      setSaveName('');
      setSaveMessage('Saved!');
    } catch (err) {
      setSaveMessage(err.message);
    }
  }

  async function handleDeleteSavedSearch(id) {
    await apiFetch(`/saved-searches/${id}`, { method: 'DELETE' });
    setSavedSearches((prev) => prev.filter((s) => s._id !== id));
  }

  return (
    <section className="container container-wide">
      <div className="page-header">
        <h1>Career Bank</h1>
        <p>Search and filter careers across every domain.</p>
      </div>

      <SearchBar query={query} setQuery={setQuery} onPick={() => {}} />

      <div className="toolbar" style={{ marginTop: 'var(--space-4)' }}>
        <select value={filters.domain} onChange={updateFilter('domain')} style={{ width: 'auto' }}>
          <option value="">All domains</option>
          {meta.domains.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
        <select value={filters.demand} onChange={updateFilter('demand')} style={{ width: 'auto' }}>
          <option value="">Any demand</option>
          {meta.demandLevels.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
        <input
          placeholder="Skill (e.g. Python)"
          value={filters.skills}
          onChange={updateFilter('skills')}
          style={{ width: 160 }}
        />
        <input
          type="number"
          placeholder="Min salary"
          value={filters.salaryMin}
          onChange={updateFilter('salaryMin')}
          style={{ width: 130 }}
        />
        <input
          type="number"
          placeholder="Max salary"
          value={filters.salaryMax}
          onChange={updateFilter('salaryMax')}
          style={{ width: 130 }}
        />
        <button
          type="button"
          className="btn-ghost btn-sm"
          onClick={() => {
            setQuery('');
            setFilters(EMPTY_FILTERS);
          }}
        >
          Clear filters
        </button>
      </div>

      {user && (
        <form onSubmit={handleSaveSearch} className="row" style={{ marginBottom: 'var(--space-4)' }}>
          <input
            placeholder="Name this search to save it"
            value={saveName}
            onChange={(e) => setSaveName(e.target.value)}
            required
            style={{ width: 220 }}
          />
          <button type="submit" className="btn-sm">
            Save search
          </button>
          {saveMessage && <span className="text-sm muted">{saveMessage}</span>}
        </form>
      )}

      {savedSearches.length > 0 && (
        <div style={{ marginBottom: 'var(--space-5)' }}>
          <h4 className="muted" style={{ fontWeight: 600, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Saved searches
          </h4>
          <div className="row" style={{ gap: 6 }}>
            {savedSearches.map((s) => (
              <span key={s._id} className="badge" style={{ padding: 0, overflow: 'hidden' }}>
                <button
                  type="button"
                  className="btn-ghost btn-sm"
                  style={{ borderRadius: 0, padding: '3px 8px' }}
                  onClick={() => applySavedSearch(s)}
                >
                  {s.name}
                </button>
                <button
                  type="button"
                  className="btn-ghost btn-sm"
                  style={{ borderRadius: 0, padding: '3px 8px', borderLeft: '1px solid var(--border)' }}
                  onClick={() => handleDeleteSavedSearch(s._id)}
                  aria-label={`Delete ${s.name}`}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>
      )}

      {loading && (
        <p className="muted">
          <span className="spinner" style={{ marginRight: 8 }} />
          Loading...
        </p>
      )}
      {error && <p className="field-error">{error}</p>}
      {!loading && !error && (
        <p className="text-sm muted" style={{ marginBottom: 'var(--space-3)' }}>
          {total} career{total === 1 ? '' : 's'} found
        </p>
      )}

      {!loading && careers.length === 0 && !error && (
        <div className="empty-state">No careers match your filters. Try broadening your search.</div>
      )}

      <ul className="card-list">
        {careers.map((c) => (
          <CareerCard key={c._id} career={c} />
        ))}
      </ul>
    </section>
  );
}
