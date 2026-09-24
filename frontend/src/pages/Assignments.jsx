import { useEffect, useState } from 'react';
import { ClipboardList, Plus } from 'lucide-react';
import { api } from '../api/client';
import AssignmentItem from '../components/AssignmentItem';
import PageHead from '../components/PageHead';

export default function Assignments() {
  const [assignments, setAssignments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [title, setTitle] = useState('');
  const [course, setCourse] = useState('');
  const [due, setDue] = useState('');

  useEffect(() => {
    api.get('/assignments').then((d) => setAssignments(d.assignments));
    api.get('/courses').then((d) => setCourses(d.courses));
  }, []);

  async function addAssignment(e) {
    e.preventDefault();
    if (!title.trim()) return;
    const data = await api.post('/assignments', { title, course: course || null, due: due || null });
    setAssignments((prev) => [...prev, data.assignment].sort((a, b) => (a.due || '9999').localeCompare(b.due || '9999')));
    setTitle('');
    setDue('');
  }

  async function toggle(a) {
    const updated = await api.patch(`/assignments/${a._id}`, { done: !a.done });
    setAssignments((prev) => prev.map((x) => (x._id === a._id ? updated.assignment : x)));
  }

  async function remove(a) {
    await api.del(`/assignments/${a._id}`);
    setAssignments((prev) => prev.filter((x) => x._id !== a._id));
  }

  return (
    <main className="content">
      <PageHead icon={ClipboardList} title="Assignments" subtitle="Track what's due and when" />
      <form className="card" onSubmit={addAssignment}>
        <h2><Plus size={16} /> Add assignment</h2>
        <div className="row">
          <input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
          <select value={course} onChange={(e) => setCourse(e.target.value)}>
            <option value="">No course</option>
            {courses.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
          </select>
        </div>
        <div className="row">
          <input type="date" value={due} onChange={(e) => setDue(e.target.value)} />
          <button className="btn" type="submit"><Plus size={16} /> Add</button>
        </div>
      </form>
      <div className="card">
        <h2><ClipboardList size={16} /> All assignments</h2>
        {assignments.length
          ? assignments.map((a) => <AssignmentItem key={a._id} assignment={a} onToggle={toggle} onDelete={remove} />)
          : <p className="empty">No assignments yet — add one above.</p>}
      </div>
    </main>
  );
}
