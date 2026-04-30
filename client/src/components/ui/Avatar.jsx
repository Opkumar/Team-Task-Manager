import clsx from 'clsx';

const colors = [
  'bg-indigo-500', 'bg-emerald-500', 'bg-amber-500', 'bg-rose-500',
  'bg-cyan-500', 'bg-purple-500', 'bg-pink-500', 'bg-teal-500',
];

function hashName(name) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash);
}

function getInitials(name) {
  return name
    .split(' ')
    .map(w => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

const sizes = {
  sm: 'w-7 h-7 text-xs',
  md: 'w-9 h-9 text-sm',
  lg: 'w-11 h-11 text-base',
};

export default function Avatar({ name = '?', size = 'md', className }) {
  const bg = colors[hashName(name) % colors.length];
  const initials = getInitials(name);

  return (
    <div
      className={clsx(
        'rounded-full flex items-center justify-center text-white font-semibold shrink-0',
        bg,
        sizes[size],
        className
      )}
      title={name}
    >
      {initials}
    </div>
  );
}
