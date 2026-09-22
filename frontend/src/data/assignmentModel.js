export function daysUntil(dateStr) {
  if (!dateStr) return null;
  const target = new Date(dateStr);
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  target.setHours(0, 0, 0, 0);
  return Math.round((target - now) / 86400000);
}

export function formatDue(dateStr) {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

export function dueBadge(dateStr) {
  const d = daysUntil(dateStr);
  if (d === null) return null;
  if (d < 0) return { text: 'Overdue', className: 'overdue' };
  if (d === 0) return { text: 'Today', className: 'soon' };
  if (d <= 2) return { text: `${d}d left`, className: 'soon' };
  return { text: formatDue(dateStr), className: '' };
}

export function courseProgress(assignments, courseId) {
  const forCourse = assignments.filter((a) => a.course && a.course._id === courseId);
  const done = forCourse.filter((a) => a.done).length;
  const pct = forCourse.length ? Math.round((done / forCourse.length) * 100) : 0;
  return { total: forCourse.length, done, pct };
}
