import { Menu, CheckSquare } from 'lucide-react';

export default function MobileHeader({ onMenuClick }) {
  return (
    <header className="sticky top-0 z-30 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 lg:hidden">
      <div className="flex items-center gap-3 px-4 h-14">
        <button
          onClick={onMenuClick}
          className="p-1.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-indigo-500 rounded-lg flex items-center justify-center">
            <CheckSquare className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-slate-900 dark:text-white">Team Task Manager</span>
        </div>
      </div>
    </header>
  );
}
