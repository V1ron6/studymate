import { CheckCircle2, Circle, Trash2 } from 'lucide-react';
import { dueBadge } from '../data/assignmentModel';

export default function AssignmentItem({ assignment, onToggle, onDelete }) {
  const badge = dueBadge(assignment.due);
  return (
    <div className="item">
      <div className="row" style={{ margin: 0, gap: 10 }}>
        <button
          className={`btn icon-toggle${assignment.done ? ' checked' : ''}`}
          onClick={() => onToggle(assignment)}
          aria-label={assignment.done ? 'Mark as not done' : 'Mark as done'}
          type="button"
        >
          {assignment.done ? <CheckCircle2 size={20} /> : <Circle size={20} />}
        </button>
        <div>
          <div style={assignment.done ? { textDecoration: 'line-through', opacity: 0.6 } : undefined}>
            {assignment.title}
          </div>
          <div className="meta">{assignment.course ? assignment.course.name : 'No course'}</div>
        </div>
      </div>
      <div className="row" style={{ margin: 0, alignItems: 'center' }}>
        {badge && <span className={`badge ${badge.className}`}>{badge.text}</span>}
        <button className="btn danger" onClick={() => onDelete(assignment)} aria-label="Delete assignment">
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
}
