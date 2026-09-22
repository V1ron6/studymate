import { useState } from 'react';
import { api } from '../api/client';

const MODES = [
  { id: 'ai', label: 'Ask AI' },
  { id: 'wiki', label: 'Wiki' },
  { id: 'web', label: 'Web' },
  { id: 'dict', label: 'Dictionary' },
];

export default function Research() {
  const [mode, setMode] = useState('ai');
  return (
    <main className="content">
      <div className="card">
        <div className="row">
          {MODES.map((m) => (
            <button
              key={m.id}
              className={mode === m.id ? 'btn' : 'btn ghost'}
              onClick={() => setMode(m.id)}
              type="button"
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>
      {mode === 'ai' && <AskAI />}
      {mode === 'wiki' && <WikiSearch />}
      {mode === 'web' && <WebSearch />}
      {mode === 'dict' && <Dictionary />}
    </main>
  );
}

function AskAI() {
  const [history, setHistory] = useState([]);
  const [q, setQ] = useState('');
  const [loading, setLoading] = useState(false);

  async function ask(e) {
    e.preventDefault();
    if (!q.trim()) return;
    const question = q;
    setHistory((h) => [...h, { role: 'user', text: question }]);
    setQ('');
    setLoading(true);
    try {
      const data = await api.post('/ai/explain', { question });
      setHistory((h) => [...h, { role: 'ai', text: data.answer }]);
    } catch (err) {
      setHistory((h) => [...h, { role: 'ai', text: err.message }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="card">
      <h2>Ask AI to explain a topic</h2>
      {history.map((m, i) => <div key={i} className={`chat-msg ${m.role}`}>{m.text}</div>)}
      {loading && <p className="meta">Thinking…</p>}
      <form className="row" onSubmit={ask} style={{ marginTop: 8 }}>
        <input placeholder="e.g. Explain photosynthesis simply" value={q} onChange={(e) => setQ(e.target.value)} />
        <button className="btn" type="submit">Ask</button>
      </form>
    </div>
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
      <h2>Wikipedia search</h2>
      <form className="row" onSubmit={search}>
        <input placeholder="Search a topic" value={q} onChange={(e) => setQ(e.target.value)} />
        <button className="btn" type="submit">Search</button>
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
      <h2>Quick web search</h2>
      <form className="row" onSubmit={search}>
        <input placeholder="Search anything" value={q} onChange={(e) => setQ(e.target.value)} />
        <button className="btn" type="submit">Search</button>
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
      <h2>Dictionary</h2>
      <form className="row" onSubmit={lookup}>
        <input placeholder="Enter a word" value={word} onChange={(e) => setWord(e.target.value)} />
        <button className="btn" type="submit">Define</button>
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
