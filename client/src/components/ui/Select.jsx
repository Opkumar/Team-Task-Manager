import clsx from 'clsx';

export default function Select({ label, error, children, className, ...props }) {
  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">{label}</label>
      )}
      <select
        className={clsx(
          'w-full px-3.5 py-2.5 bg-white dark:bg-slate-700 border rounded-lg text-sm transition-colors appearance-none',
          'text-slate-900 dark:text-slate-100',
          'focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent',
          error ? 'border-rose-300' : 'border-slate-300 dark:border-slate-600'
        )}
        {...props}
      >
        {children}
      </select>
      {error && <p className="mt-1 text-sm text-rose-600">{error}</p>}
    </div>
  );
}
