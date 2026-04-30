import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FolderOpen, CheckCircle2, User, AlertTriangle, ArrowRight, ClipboardList, Shield } from 'lucide-react';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import ProgressRing from '../components/ui/ProgressRing';
import Skeleton from '../components/ui/Skeleton';

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

const statusBarColors = {
  'To Do': 'bg-amber-400',
  'In Progress': 'bg-blue-500',
  'Done': 'bg-emerald-500',
};

export default function Dashboard() {
  const { API, user } = useAuth();
  const [stats, setStats] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const isGlobalAdmin = user?.role === 'Admin';

  useEffect(() => {
    Promise.all([
      API.get('/dashboard'),
      API.get('/projects'),
    ])
      .then(([statsRes, projRes]) => {
        setStats(statsRes.data);
        setProjects(projRes.data.slice(0, 4));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="animate-fade-in">
        <Skeleton variant="text" className="w-64 h-8 mb-2" />
        <Skeleton variant="text" className="w-96 h-4 mb-8" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[...Array(4)].map((_, i) => <Skeleton key={i} variant="stat-card" />)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Skeleton variant="card" className="lg:col-span-2 h-48" />
          <Skeleton variant="card" className="h-48" />
        </div>
      </div>
    );
  }

  if (!stats) return <div className="text-center mt-10 text-slate-500">Failed to load dashboard</div>;

  const completionRate = stats.totalTasks > 0
    ? ((stats.tasksByStatus['Done'] || 0) / stats.totalTasks) * 100
    : 0;

  // Admin stat cards
  const adminStatConfig = [
    { key: 'totalProjects', label: 'Projects', icon: FolderOpen, accent: 'border-indigo-500', iconColor: 'text-indigo-500 bg-indigo-50 dark:bg-indigo-900/30' },
    { key: 'totalTasks', label: 'Total Tasks', icon: CheckCircle2, accent: 'border-emerald-500', iconColor: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-900/30' },
    { key: 'myTasks', label: 'My Tasks', icon: User, accent: 'border-amber-500', iconColor: 'text-amber-500 bg-amber-50 dark:bg-amber-900/30' },
    { key: 'overdueTasks', label: 'Overdue', icon: AlertTriangle, accent: 'border-rose-500', iconColor: 'text-rose-500 bg-rose-50 dark:bg-rose-900/30' },
  ];

  // Member stat cards (focused on their own tasks)
  const memberStatConfig = [
    { key: 'totalProjects', label: 'My Projects', icon: FolderOpen, accent: 'border-indigo-500', iconColor: 'text-indigo-500 bg-indigo-50 dark:bg-indigo-900/30' },
    { key: 'myTasks', label: 'My Tasks', icon: ClipboardList, accent: 'border-emerald-500', iconColor: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-900/30' },
    { key: 'overdueTasks', label: 'Overdue', icon: AlertTriangle, accent: 'border-rose-500', iconColor: 'text-rose-500 bg-rose-50 dark:bg-rose-900/30' },
  ];

  const statConfig = isGlobalAdmin ? adminStatConfig : memberStatConfig;

  return (
    <div className="animate-slide-up">
      {/* Welcome */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-1">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            {getGreeting()}, {user?.name?.split(' ')[0]}
          </h1>
          <Badge variant="role" value={user?.role || 'Member'} />
        </div>
        <p className="text-slate-500 dark:text-slate-400">
          {isGlobalAdmin
            ? "Here's what's happening across your projects."
            : "Here's an overview of your assigned tasks."
          }
        </p>
      </div>

      {/* Stat Cards */}
      <div className={`grid gap-3 sm:gap-4 mb-8 ${isGlobalAdmin ? 'grid-cols-2 lg:grid-cols-4' : 'grid-cols-3'}`}>
        {statConfig.map(({ key, label, icon: Icon, accent, iconColor }) => (
          <Card key={key} className={`p-3 sm:p-5 border-l-4 ${accent}`}>
            <div className="flex items-center justify-between gap-2">
              <div className="min-w-0">
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium truncate">{label}</p>
                <p className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mt-0.5 sm:mt-1">{stats[key]}</p>
              </div>
              <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl flex items-center justify-center shrink-0 ${iconColor}`}>
                <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Main content row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Tasks by Status */}
        <Card className="lg:col-span-2 p-4 sm:p-6">
          <h2 className="text-base font-semibold text-slate-900 dark:text-white mb-4">
            {isGlobalAdmin ? 'Tasks by Status' : 'My Tasks by Status'}
          </h2>

          {/* Stacked bar */}
          {stats.totalTasks > 0 && (
            <div className="flex rounded-full h-3 overflow-hidden mb-6">
              {Object.entries(stats.tasksByStatus).map(([status, count]) => (
                count > 0 && (
                  <div
                    key={status}
                    className={`${statusBarColors[status]} transition-all duration-500`}
                    style={{ width: `${(count / stats.totalTasks) * 100}%` }}
                    title={`${status}: ${count}`}
                  />
                )
              ))}
            </div>
          )}

          {/* Legend */}
          <div className="space-y-3">
            {Object.entries(stats.tasksByStatus).map(([status, count]) => (
              <div key={status} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${statusBarColors[status]}`} />
                  <span className="text-sm text-slate-600 dark:text-slate-400">{status}</span>
                </div>
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="w-20 sm:w-32 bg-slate-100 dark:bg-slate-700 rounded-full h-1.5">
                    <div
                      className={`h-1.5 rounded-full ${statusBarColors[status]}`}
                      style={{ width: `${stats.totalTasks ? (count / stats.totalTasks) * 100 : 0}%` }}
                    />
                  </div>
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 w-6 text-right">{count}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Completion ring */}
        <Card className="p-4 sm:p-6 flex flex-col items-center justify-center">
          <h2 className="text-base font-semibold text-slate-900 dark:text-white mb-4">Completion Rate</h2>
          <ProgressRing percentage={completionRate} size={120} strokeWidth={8} />
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-4">
            {stats.tasksByStatus['Done'] || 0} of {stats.totalTasks} tasks done
          </p>
        </Card>
      </div>

      {/* Member info banner */}
      {!isGlobalAdmin && (
        <Card className="p-4 sm:p-5 mb-8 border-l-4 border-indigo-500">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-900/40 flex items-center justify-center shrink-0">
              <Shield className="w-4 h-4 text-indigo-500 dark:text-indigo-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-900 dark:text-white">Member Access</p>
              <p className="text-sm text-slate-500 dark:text-slate-300 mt-0.5">
                You can view and update status of tasks assigned to you. Contact an admin to create projects or manage team members.
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Recent Projects */}
      {projects.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-slate-900 dark:text-white">
              {isGlobalAdmin ? 'Recent Projects' : 'My Projects'}
            </h2>
            <Link to="/projects" className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium flex items-center gap-1">
              View all <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {projects.map((project) => (
              <Link key={project._id} to={`/projects/${project._id}`}>
                <Card hover className="p-4 sm:p-5">
                  <h3 className="font-semibold text-slate-900 dark:text-white truncate">{project.name}</h3>
                  {project.description && (
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">{project.description}</p>
                  )}
                  <div className="flex items-center gap-3 mt-3 text-xs text-slate-400 dark:text-slate-500">
                    <span>{project.members.length} member{project.members.length !== 1 ? 's' : ''}</span>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
