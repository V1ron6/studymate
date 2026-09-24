import { useEffect, useState } from 'react';
import { LayoutDashboard, BookOpen, ClipboardList, CheckCircle2 } from 'lucide-react';
import { api } from '../api/client';
import AssignmentItem from '../components/AssignmentItem';
import ProgressBar from '../components/ProgressBar';
import PageHead from '../components/PageHead';

export default function Dashboard() {
  const [assignments, setAssignments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.get('/assignments'), api.get('/courses')])
      .then(([a, c]) => { setAssignments(a.assignments); setCourses(c.courses); })
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
      <PageHead icon={LayoutDashboard} title="Dashboard" subtitle="Your week at a glance" />
      <div className="card">
        <div className="stat-grid">
          <div className="stat">
            <BookOpen className="stat-icon" size={18} />
            <div className="stat-value">{courses.length}</div>
            <div className="stat-label">Courses</div>
          </div>
          <div className="stat">
            <ClipboardList className="stat-icon" size={18} />
            <div className="stat-value">{assignments.length}</div>
            <div className="stat-label">Assignments</div>
          </div>
          <div className="stat">
            <CheckCircle2 className="stat-icon" size={18} />
            <div className="stat-value">{pct}%</div>
            <div className="stat-label">Completed</div>
          </div>
        </div>
        <ProgressBar pct={pct} />
      </div>
      <div className="card">
        <h2><ClipboardList size={16} /> Upcoming deadlines</h2>
        {upcoming.length
          ? upcoming.map((a) => <AssignmentItem key={a._id} assignment={a} onToggle={toggle} onDelete={remove} />)
          : <p className="empty">Nothing due — add an assignment to get started.</p>}
      </div>
    </main>
  );
}
