import { useEffect, useState } from 'react';
import { BookOpen, Plus, Trash2, User } from 'lucide-react';
import { api } from '../api/client';
import PageHead from '../components/PageHead';

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [name, setName] = useState('');
  const [instructor, setInstructor] = useState('');

  useEffect(() => { api.get('/courses').then((d) => setCourses(d.courses)); }, []);

  async function addCourse(e) {
    e.preventDefault();
    if (!name.trim()) return;
    const data = await api.post('/courses', { name, instructor });
    setCourses((prev) => [...prev, data.course]);
    setName('');
    setInstructor('');
  }

  async function remove(id) {
    await api.del(`/courses/${id}`);
    setCourses((prev) => prev.filter((c) => c._id !== id));
  }

  return (
    <main className="content">
      <PageHead icon={BookOpen} title="Courses" subtitle="Everything you're enrolled in" />
      <form className="card" onSubmit={addCourse}>
        <h2><Plus size={16} /> Add a course</h2>
        <div className="row">
          <input placeholder="Course name (e.g. HIST 212)" value={name} onChange={(e) => setName(e.target.value)} />
          <div className="field-icon">
            <User size={14} />
            <input placeholder="Instructor (optional)" value={instructor} onChange={(e) => setInstructor(e.target.value)} />
          </div>
        </div>
        <button className="btn" type="submit"><Plus size={16} /> Add course</button>
      </form>
      <div className="card">
        <h2><BookOpen size={16} /> Your courses</h2>
        {courses.length ? courses.map((c) => (
          <div className="item" key={c._id}>
            <div><div>{c.name}</div><div className="meta">{c.instructor || 'No instructor set'}</div></div>
            <button className="btn danger" onClick={() => remove(c._id)} aria-label="Delete course"><Trash2 size={16} /></button>
          </div>
        )) : <p className="empty">No courses yet — add your first one above.</p>}
      </div>
    </main>
  );
}
