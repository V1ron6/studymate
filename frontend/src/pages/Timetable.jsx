import { useEffect, useState } from 'react';
import { api } from '../api/client';
import { DAYS } from '../data/navConfig';

export default function Timetable() {
  const [slots, setSlots] = useState([]);
  const [courses, setCourses] = useState([]);
  const [day, setDay] = useState('Mon');
  const [time, setTime] = useState('');
  const [label, setLabel] = useState('');
  const [course, setCourse] = useState('');

  useEffect(() => {
    api.get('/timetable').then((d) => setSlots(d.slots));
    api.get('/courses').then((d) => setCourses(d.courses));
  }, []);

  async function addSlot(e) {
    e.preventDefault();
    if (!time.trim()) return;
    const data = await api.post('/timetable', { day, time, label: label || 'Study', course: course || null });
    setSlots((prev) => [...prev, data.slot]);
    setTime('');
    setLabel('');
  }

  async function remove(id) {
    await api.del(`/timetable/${id}`);
    setSlots((prev) => prev.filter((s) => s._id !== id));
  }

  return (
    <main className="content">
      <form className="card" onSubmit={addSlot}>
        <h2>Add study/class slot</h2>
        <div className="row">
          <select value={day} onChange={(e) => setDay(e.target.value)}>
            {DAYS.map((d) => <option key={d}>{d}</option>)}
          </select>
          <input placeholder="e.g. 9:00–10:30" value={time} onChange={(e) => setTime(e.target.value)} />
        </div>
        <div className="row">
          <select value={course} onChange={(e) => setCourse(e.target.value)}>
            <option value="">No course</option>
            {courses.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
          </select>
          <input placeholder="Label (e.g. Lecture / Study)" value={label} onChange={(e) => setLabel(e.target.value)} />
        </div>
        <button className="btn" type="submit">Add slot</button>
      </form>
      <div className="card">
        <h2>Weekly timetable</h2>
        <div className="row" style={{ overflowX: 'auto', flexWrap: 'nowrap' }}>
          {DAYS.map((d) => (
            <div key={d} style={{ minWidth: 120 }}>
              <div className="meta" style={{ fontWeight: 700, marginBottom: 4 }}>{d}</div>
              {slots.filter((s) => s.day === d).map((s) => (
                <div key={s._id} style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 8, padding: '6px 8px', marginBottom: 6, fontSize: '0.75rem' }}>
                  <b>{s.time}</b><br />{s.label}<br />
                  <span className="meta">{s.course ? s.course.name : ''}</span>
                  <div style={{ textAlign: 'right' }}>
                    <button className="btn danger" onClick={() => remove(s._id)}>✕</button>
                  </div>
                </div>
              ))}
              {!slots.filter((s) => s.day === d).length && <div className="meta">—</div>}
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
