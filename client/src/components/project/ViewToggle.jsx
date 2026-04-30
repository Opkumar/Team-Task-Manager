import { List, LayoutGrid } from 'lucide-react';
import clsx from 'clsx';

export default function ViewToggle({ view, onViewChange }) {
  return (
    <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
      <button
        onClick={() => onViewChange('list')}
        className={clsx(
          'flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors',
          view === 'list' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
        )}
      >
        <List className="w-3.5 h-3.5" />
        List
      </button>
      <button
        onClick={() => onViewChange('board')}
        className={clsx(
          'flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors',
          view === 'board' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
        )}
      >
        <LayoutGrid className="w-3.5 h-3.5" />
        Board
      </button>
    </div>
  );
}
