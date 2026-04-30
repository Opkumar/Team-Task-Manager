import clsx from 'clsx';

export default function Input({
  label,
  error,
  textarea = false,
  className,
  ...props
}) {
  const Component = textarea ? 'textarea' : 'input';

  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">{label}</label>
      )}
      <Component
        className={clsx(
          'w-full px-3.5 py-2.5 bg-white dark:bg-slate-700 border rounded-lg text-sm transition-colors',
          'text-slate-900 dark:text-slate-100',
          'placeholder:text-slate-400 dark:placeholder:text-slate-500',
          'focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent',
          error ? 'border-rose-300' : 'border-slate-300 dark:border-slate-600',
          textarea && 'resize-none'
        )}
        {...props}
      />
      {error && <p className="mt-1 text-sm text-rose-600">{error}</p>}
    </div>
  );
}
