import { dueBadge } from '../data/assignmentModel';

export default function AssignmentItem({ assignment, onToggle, onDelete }) {
  const badge = dueBadge(assignment.due);
  return (
    <div className="item">
      <div>
        <div style={assignment.done ? { textDecoration: 'line-through', opacity: 0.6 } : undefined}>
          {assignment.title}
        </div>
        <div className="meta">{assignment.course ? assignment.course.name : '—'}</div>
      </div>
      <div className="row" style={{ margin: 0, alignItems: 'center' }}>
        {badge && <span className={`badge ${badge.className}`}>{badge.text}</span>}
        <input type="checkbox" checked={assignment.done} onChange={() => onToggle(assignment)} />
        <button className="btn danger" onClick={() => onDelete(assignment)}>✕</button>
      </div>
    </div>
  );
}
