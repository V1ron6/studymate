import { useEffect, useState } from 'react';
import { api } from '../api/client';

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
      <form className="card" onSubmit={addCourse}>
        <h2>Add a course</h2>
        <div className="row">
          <input placeholder="Course name (e.g. HIST 212)" value={name} onChange={(e) => setName(e.target.value)} />
          <input placeholder="Instructor (optional)" value={instructor} onChange={(e) => setInstructor(e.target.value)} />
        </div>
        <button className="btn" type="submit">Add course</button>
      </form>
      <div className="card">
        <h2>Your courses</h2>
        {courses.length ? courses.map((c) => (
          <div className="item" key={c._id}>
            <div><div>{c.name}</div><div className="meta">{c.instructor}</div></div>
            <button className="btn danger" onClick={() => remove(c._id)}>✕</button>
          </div>
        )) : <p className="empty">No courses yet.</p>}
      </div>
    </main>
  );
}
