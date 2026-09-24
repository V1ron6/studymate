import { useEffect, useState } from 'react';
import { TrendingUp, NotebookPen, Trash2, Plus } from 'lucide-react';
import { api } from '../api/client';
import { courseProgress } from '../data/assignmentModel';
import ProgressBar from '../components/ProgressBar';
import PageHead from '../components/PageHead';

export default function Progress() {
  const [courses, setCourses] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [notes, setNotes] = useState([]);
  const [text, setText] = useState('');

  useEffect(() => {
    api.get('/courses').then((d) => setCourses(d.courses));
    api.get('/assignments').then((d) => setAssignments(d.assignments));
    api.get('/notes').then((d) => setNotes(d.notes));
  }, []);

  async function addNote(e) {
    e.preventDefault();
    if (!text.trim()) return;
    const data = await api.post('/notes', { text });
    setNotes((prev) => [data.note, ...prev]);
    setText('');
  }

  async function remove(id) {
    await api.del(`/notes/${id}`);
    setNotes((prev) => prev.filter((n) => n._id !== id));
  }

  return (
    <main className="content">
      <PageHead icon={TrendingUp} title="Progress" subtitle="How each course is going" />
      <div className="card">
        <h2><TrendingUp size={16} /> Progress by course</h2>
        {courses.length ? courses.map((c) => {
          const { total, done, pct } = courseProgress(assignments, c._id);
          return (
            <div key={c._id} style={{ marginBottom: 10 }}>
              <div className="row" style={{ justifyContent: 'space-between', margin: 0 }}>
                <span>{c.name}</span><span className="meta">{done}/{total}</span>
              </div>
              <ProgressBar pct={pct} />
            </div>
          );
        }) : <p className="empty">Add courses & assignments to see progress here.</p>}
      </div>
      <form className="card" onSubmit={addNote}>
        <h2><NotebookPen size={16} /> Study log</h2>
        <div className="row">
          <input placeholder="What did you study today?" value={text} onChange={(e) => setText(e.target.value)} />
          <button className="btn" type="submit"><Plus size={16} /> Log</button>
        </div>
        {notes.length ? notes.map((n) => (
          <div className="item" key={n._id}>
            <div><div>{n.text}</div><div className="meta">{new Date(n.createdAt).toLocaleDateString()}</div></div>
            <button className="btn danger" onClick={() => remove(n._id)} aria-label="Delete entry"><Trash2 size={16} /></button>
          </div>
        )) : <p className="empty">No entries yet — log your first study session.</p>}
      </form>
    </main>
  );
}
