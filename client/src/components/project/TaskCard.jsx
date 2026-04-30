import Badge from '../ui/Badge';
import Avatar from '../ui/Avatar';
import { getDueDateInfo, dueDateColors } from '../../utils/dates';
import { Calendar, GripVertical } from 'lucide-react';
import clsx from 'clsx';

export default function TaskCard({
  task,
  compact = false,
  isAdmin = false,
  onStatusChange,
  onEdit,
  onDelete,
  onClick,
  dragHandleProps,
}) {
  const dateInfo = getDueDateInfo(task.dueDate, task.status);

  return (
    <div
      onClick={onClick}
      className={clsx(
        'bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 transition-all cursor-pointer hover:shadow-card-hover hover:border-slate-300 dark:hover:border-slate-600',
        compact ? 'p-3' : 'p-3 sm:p-4',
        dateInfo?.urgent && task.status !== 'Done' && 'border-l-4 border-l-rose-400'
      )}
    >
      <div className="flex items-start gap-2 sm:gap-3">
        {dragHandleProps && (
          <div {...dragHandleProps} className="mt-0.5 text-slate-300 dark:text-slate-600 hover:text-slate-500 dark:hover:text-slate-400 cursor-grab">
            <GripVertical className="w-4 h-4" />
          </div>
        )}

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h4 className={clsx('font-medium text-slate-900 dark:text-white', compact ? 'text-sm' : 'text-sm sm:text-base')}>
              {task.title}
            </h4>
            {task.assignedTo && (
              <Avatar name={task.assignedTo.name} size="sm" className="shrink-0" />
            )}
          </div>

          {!compact && task.description && (
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">{task.description}</p>
          )}

          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mt-2">
            {!compact && <Badge variant="status" value={task.status} />}
            <Badge variant="priority" value={task.priority} />
            {dateInfo && (
              <span className={clsx('text-xs px-2 py-0.5 rounded-full font-medium inline-flex items-center gap-1', dueDateColors[dateInfo.color])}>
                <Calendar className="w-3 h-3" />
                <span className="hidden xs:inline">{dateInfo.label}</span>
                <span className="xs:hidden">{dateInfo.label.replace('Overdue by ', '-').replace('Due in ', '').replace('Due today', 'Today')}</span>
              </span>
            )}
          </div>

          {/* Mobile-friendly status + actions row */}
          {!compact && (
            <div className="flex items-center gap-2 mt-2.5 pt-2.5 border-t border-slate-100 dark:border-slate-700">
              <select
                value={task.status}
                onChange={(e) => { e.stopPropagation(); onStatusChange?.(task._id, e.target.value); }}
                onClick={(e) => e.stopPropagation()}
                className="text-xs px-2 py-1.5 border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option>To Do</option>
                <option>In Progress</option>
                <option>Done</option>
              </select>
              <div className="flex-1" />
              {isAdmin && (
                <>
                  <button
                    onClick={(e) => { e.stopPropagation(); onEdit?.(task); }}
                    className="text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-medium px-2 py-1"
                  >
                    Edit
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); onDelete?.(task._id); }}
                    className="text-xs text-rose-500 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300 font-medium px-2 py-1"
                  >
                    Delete
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
