import Drawer from '../ui/Drawer';
import Badge from '../ui/Badge';
import Avatar from '../ui/Avatar';
import Button from '../ui/Button';
import { getDueDateInfo, dueDateColors } from '../../utils/dates';
import { Calendar, User, Flag, Clock } from 'lucide-react';
import clsx from 'clsx';

export default function TaskDetailDrawer({ task, open, onClose, isAdmin, onEdit, onDelete, onStatusChange }) {
  if (!task) return null;

  const dateInfo = getDueDateInfo(task.dueDate, task.status);

  return (
    <Drawer open={open} onClose={onClose} title="Task Details">
      <div className="space-y-6">
        <div>
          <h3 className="text-xl font-semibold text-slate-900 dark:text-white">{task.title}</h3>
          {task.description && (
            <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm leading-relaxed">{task.description}</p>
          )}
        </div>

        <div className="flex items-center gap-3">
          <Clock className="w-4 h-4 text-slate-400" />
          <span className="text-sm text-slate-500 dark:text-slate-400">Status</span>
          <select
            value={task.status}
            onChange={(e) => onStatusChange?.(task._id, e.target.value)}
            className="ml-auto text-sm px-3 py-1.5 border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option>To Do</option>
            <option>In Progress</option>
            <option>Done</option>
          </select>
        </div>

        <div className="flex items-center gap-3">
          <Flag className="w-4 h-4 text-slate-400" />
          <span className="text-sm text-slate-500 dark:text-slate-400">Priority</span>
          <Badge variant="priority" value={task.priority} className="ml-auto" />
        </div>

        <div className="flex items-center gap-3">
          <User className="w-4 h-4 text-slate-400" />
          <span className="text-sm text-slate-500 dark:text-slate-400">Assigned to</span>
          {task.assignedTo ? (
            <div className="flex items-center gap-2 ml-auto">
              <Avatar name={task.assignedTo.name} size="sm" />
              <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{task.assignedTo.name}</span>
            </div>
          ) : (
            <span className="text-sm text-slate-400 ml-auto">Unassigned</span>
          )}
        </div>

        {task.dueDate && (
          <div className="flex items-center gap-3">
            <Calendar className="w-4 h-4 text-slate-400" />
            <span className="text-sm text-slate-500 dark:text-slate-400">Due date</span>
            <span className={clsx('text-sm font-medium ml-auto px-2 py-0.5 rounded-full', dateInfo && dueDateColors[dateInfo.color])}>
              {dateInfo?.label || new Date(task.dueDate).toLocaleDateString()}
            </span>
          </div>
        )}

        <div className="pt-4 border-t border-slate-100 dark:border-slate-700">
          <p className="text-xs text-slate-400">
            Created {new Date(task.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
        </div>

        {isAdmin && (
          <div className="flex gap-3 pt-2">
            <Button variant="secondary" className="flex-1" onClick={() => { onClose(); onEdit?.(task); }}>
              Edit Task
            </Button>
            <Button variant="danger" className="flex-1" onClick={() => { onDelete?.(task._id); onClose(); }}>
              Delete
            </Button>
          </div>
        )}
      </div>
    </Drawer>
  );
}
