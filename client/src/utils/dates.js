export function getDueDateInfo(dueDate, status) {
  if (!dueDate) return null;

  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const due = new Date(dueDate);
  due.setHours(0, 0, 0, 0);
  const diffDays = Math.ceil((due - now) / (1000 * 60 * 60 * 24));

  if (status === 'Done') {
    return { label: `Due ${due.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`, color: 'slate', urgent: false };
  }

  if (diffDays < 0) {
    return { label: `Overdue by ${Math.abs(diffDays)}d`, color: 'rose', urgent: true };
  }
  if (diffDays === 0) {
    return { label: 'Due today', color: 'amber', urgent: true };
  }
  if (diffDays <= 3) {
    return { label: `Due in ${diffDays}d`, color: 'amber', urgent: false };
  }
  return {
    label: `Due ${due.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`,
    color: 'slate',
    urgent: false,
  };
}

export const dueDateColors = {
  rose: 'text-rose-600 bg-rose-50',
  amber: 'text-amber-600 bg-amber-50',
  slate: 'text-slate-500 bg-slate-50',
};
