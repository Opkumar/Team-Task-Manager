import clsx from 'clsx';

export default function Card({ children, hover = false, className, ...props }) {
  return (
    <div
      className={clsx(
        'bg-white rounded-xl shadow-card dark:bg-slate-800 dark:shadow-none dark:border dark:border-slate-700',
        hover && 'hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-200 dark:hover:border-slate-600',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
