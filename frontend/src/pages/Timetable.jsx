import { useEffect, useState } from 'react';
import { CalendarDays, Plus, Trash2 } from 'lucide-react';
import { api } from '../api/client';
import { DAYS } from '../data/navConfig';
import PageHead from '../components/PageHead';

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
      <PageHead icon={CalendarDays} title="Timetable" subtitle="Your weekly classes and study blocks" />
      <form className="card" onSubmit={addSlot}>
        <h2><Plus size={16} /> Add study/class slot</h2>
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
        <button className="btn" type="submit"><Plus size={16} /> Add slot</button>
      </form>
      <div className="card">
        <h2><CalendarDays size={16} /> Weekly timetable</h2>
        <div className="row" style={{ overflowX: 'auto', flexWrap: 'nowrap', alignItems: 'flex-start' }}>
          {DAYS.map((d) => (
            <div key={d} className="day-col">
              <div className="meta" style={{ fontWeight: 700, marginBottom: 4 }}>{d}</div>
              {slots.filter((s) => s.day === d).map((s) => (
                <div key={s._id} className="tt-slot">
                  <b>{s.time}</b><br />{s.label}<br />
                  <span className="meta">{s.course ? s.course.name : ''}</span>
                  <div style={{ textAlign: 'right' }}>
                    <button className="btn danger" onClick={() => remove(s._id)} aria-label="Delete slot"><Trash2 size={14} /></button>
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
