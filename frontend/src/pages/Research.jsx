import { useState } from 'react';
import { Search, BookOpen, Globe, SpellCheck2 } from 'lucide-react';
import { api } from '../api/client';
import PageHead from '../components/PageHead';

const MODES = [
  { id: 'wiki', label: 'Wiki', icon: BookOpen },
  { id: 'web', label: 'Web', icon: Globe },
  { id: 'dict', label: 'Dictionary', icon: SpellCheck2 },
];

export default function Research() {
  const [mode, setMode] = useState('wiki');
  return (
    <main className="content">
      <PageHead icon={Search} title="Research" subtitle="Search Wikipedia, the web, or a dictionary" />
      <div className="card">
        <div className="mode-tabs">
          {MODES.map((m) => {
            const Icon = m.icon;
            return (
              <button
                key={m.id}
                className={`btn ghost${mode === m.id ? ' active' : ''}`}
                onClick={() => setMode(m.id)}
                type="button"
              >
                <Icon size={15} /> {m.label}
              </button>
            );
          })}
        </div>
      </div>
      {mode === 'wiki' && <WikiSearch />}
      {mode === 'web' && <WebSearch />}
      {mode === 'dict' && <Dictionary />}
    </main>
  );
}

function WikiSearch() {
  const [q, setQ] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function search(e) {
    e.preventDefault();
    if (!q.trim()) return;
    setLoading(true);
    setError('');
    try {
      const data = await api.get(`/wiki/search?q=${encodeURIComponent(q)}`);
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="card">
      <h2><BookOpen size={16} /> Wikipedia search</h2>
      <form className="row" onSubmit={search}>
        <input placeholder="Search a topic" value={q} onChange={(e) => setQ(e.target.value)} />
        <button className="btn" type="submit"><Search size={15} /> Search</button>
      </form>
      {loading && <p className="meta">Searching…</p>}
      {error && <p className="error-text">{error}</p>}
      {result?.top && (
        <div style={{ marginTop: 10 }}>
          <h3 style={{ margin: '0 0 4px' }}>{result.top.title}</h3>
          <p style={{ fontSize: '0.85rem' }}>{result.top.extract}</p>
          {result.top.url && <a className="btn ghost" href={result.top.url} target="_blank" rel="noreferrer">Read full article</a>}
        </div>
      )}
      {result?.results?.length > 0 && (
        <div style={{ marginTop: 12 }}>
          <div className="meta" style={{ marginBottom: 4 }}>Other results</div>
          {result.results.slice(1).map((r) => (
            <div className="item" key={r.title}>
              <div>
                <div>{r.title}</div>
                <div className="meta" dangerouslySetInnerHTML={{ __html: r.snippet }} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function WebSearch() {
  const [q, setQ] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function search(e) {
    e.preventDefault();
    if (!q.trim()) return;
    setLoading(true);
    setError('');
    try {
      const data = await api.get(`/wiki/web?q=${encodeURIComponent(q)}`);
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const hasContent = result && (result.abstract || result.related?.length);

  return (
    <div className="card">
      <h2><Globe size={16} /> Quick web search</h2>
      <form className="row" onSubmit={search}>
        <input placeholder="Search anything" value={q} onChange={(e) => setQ(e.target.value)} />
        <button className="btn" type="submit"><Search size={15} /> Search</button>
      </form>
      {loading && <p className="meta">Searching…</p>}
      {error && <p className="error-text">{error}</p>}
      {result && !hasContent && !loading && <p className="empty">No quick answer found — try a more specific term.</p>}
      {result?.abstract && (
        <div style={{ marginTop: 10 }}>
          {result.heading && <h3 style={{ margin: '0 0 4px' }}>{result.heading}</h3>}
          <p style={{ fontSize: '0.85rem' }}>{result.abstract}</p>
          {result.abstractUrl && (
            <a className="btn ghost" href={result.abstractUrl} target="_blank" rel="noreferrer">
              Source{result.source ? `: ${result.source}` : ''}
            </a>
          )}
        </div>
      )}
      {result?.related?.length > 0 && (
        <div style={{ marginTop: 12 }}>
          <div className="meta" style={{ marginBottom: 4 }}>Related</div>
          {result.related.map((r, i) => (
            <div className="item" key={i}>
              <a href={r.url} target="_blank" rel="noreferrer" style={{ fontSize: '0.85rem' }}>{r.text}</a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Dictionary() {
  const [word, setWord] = useState('');
  const [entry, setEntry] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function lookup(e) {
    e.preventDefault();
    if (!word.trim()) return;
    setLoading(true);
    setError('');
    try {
      const data = await api.get(`/wiki/define?word=${encodeURIComponent(word)}`);
      setEntry(data);
    } catch (err) {
      setError(err.message);
      setEntry(null);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="card">
      <h2><SpellCheck2 size={16} /> Dictionary</h2>
      <form className="row" onSubmit={lookup}>
        <input placeholder="Enter a word" value={word} onChange={(e) => setWord(e.target.value)} />
        <button className="btn" type="submit"><Search size={15} /> Define</button>
      </form>
      {loading && <p className="meta">Looking up…</p>}
      {error && <p className="error-text">{error}</p>}
      {entry && (
        <div style={{ marginTop: 10 }}>
          <h3 style={{ margin: '0 0 2px' }}>{entry.word} <span className="meta">{entry.phonetic}</span></h3>
          {entry.meanings.map((m, i) => (
            <div key={i} style={{ marginBottom: 8 }}>
              <div className="meta" style={{ fontStyle: 'italic' }}>{m.partOfSpeech}</div>
              <ol style={{ margin: '4px 0', paddingLeft: 18, fontSize: '0.85rem' }}>
                {m.definitions.map((d, j) => <li key={j}>{d}</li>)}
              </ol>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
