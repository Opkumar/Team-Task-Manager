import clsx from 'clsx';

export default function Skeleton({ variant = 'text', className }) {
  const base = 'animate-pulse bg-slate-200 dark:bg-slate-700 rounded';

  const variants = {
    text: 'h-4 w-full rounded',
    circle: 'w-10 h-10 rounded-full',
    card: 'h-32 w-full rounded-xl',
    'stat-card': 'h-24 w-full rounded-xl',
  };

  return <div className={clsx(base, variants[variant], className)} />;
}
