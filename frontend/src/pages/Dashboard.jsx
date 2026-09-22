import { useEffect, useState } from 'react';
import { api } from '../api/client';
import AssignmentItem from '../components/AssignmentItem';
import ProgressBar from '../components/ProgressBar';

export default function Dashboard() {
  const [assignments, setAssignments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.get('/assignments'), api.get('/courses')])
      .then(([a, c]) => {
        setAssignments(a.assignments);
        setCourses(c.courses);
      })
      .finally(() => setLoading(false));
  }, []);

  async function toggle(assignment) {
    const updated = await api.patch(`/assignments/${assignment._id}`, { done: !assignment.done });
    setAssignments((prev) => prev.map((a) => (a._id === assignment._id ? updated.assignment : a)));
  }

  async function remove(assignment) {
    await api.del(`/assignments/${assignment._id}`);
    setAssignments((prev) => prev.filter((a) => a._id !== assignment._id));
  }

  if (loading) return <main className="content"><p className="empty">Loading…</p></main>;

  const upcoming = [...assignments].filter((a) => !a.done).slice(0, 5);
  const done = assignments.filter((a) => a.done).length;
  const pct = assignments.length ? Math.round((done / assignments.length) * 100) : 0;

  return (
    <main className="content">
      <div className="card">
        <h2>Overview</h2>
        <div className="row" style={{ justifyContent: 'space-between' }}>
          <div><div className="meta">Courses</div><div style={{ fontSize: '1.3rem', fontWeight: 700 }}>{courses.length}</div></div>
          <div><div className="meta">Assignments</div><div style={{ fontSize: '1.3rem', fontWeight: 700 }}>{assignments.length}</div></div>
          <div><div className="meta">Completed</div><div style={{ fontSize: '1.3rem', fontWeight: 700 }}>{pct}%</div></div>
        </div>
        <ProgressBar pct={pct} />
      </div>
      <div className="card">
        <h2>Upcoming deadlines</h2>
        {upcoming.length
          ? upcoming.map((a) => <AssignmentItem key={a._id} assignment={a} onToggle={toggle} onDelete={remove} />)
          : <p className="empty">Nothing due — add an assignment.</p>}
      </div>
    </main>
  );
}
