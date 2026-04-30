import Card from '../ui/Card';
import Badge from '../ui/Badge';
import ProgressRing from '../ui/ProgressRing';

const statusBarColors = {
  'To Do': 'bg-amber-400',
  'In Progress': 'bg-blue-500',
  'Done': 'bg-emerald-500',
};

export default function ProjectDashboardTab({ stats }) {
  if (!stats) return null;

  const completionRate = stats.totalTasks > 0
    ? ((stats.tasksByStatus['Done'] || 0) / stats.totalTasks) * 100
    : 0;

  return (
    <div>
      {/* Top stats */}
      <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-6">
        <Card className="p-3 sm:p-5 border-l-4 border-indigo-500">
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">Total Tasks</p>
          <p className="text-xl sm:text-3xl font-bold text-slate-900 dark:text-white mt-0.5 sm:mt-1">{stats.totalTasks}</p>
        </Card>
        <Card className="p-3 sm:p-5 border-l-4 border-rose-500">
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">Overdue</p>
          <p className="text-xl sm:text-3xl font-bold text-slate-900 dark:text-white mt-0.5 sm:mt-1">{stats.overdueTasks}</p>
        </Card>
        <Card className="p-3 sm:p-5 border-l-4 border-emerald-500">
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">Completed</p>
          <p className="text-xl sm:text-3xl font-bold text-slate-900 dark:text-white mt-0.5 sm:mt-1">{stats.tasksByStatus['Done'] || 0}</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Tasks by Status */}
        <Card className="p-4 sm:p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-base font-semibold text-slate-900 dark:text-white">Tasks by Status</h3>
            <ProgressRing percentage={completionRate} size={56} strokeWidth={5} />
          </div>
          {Object.entries(stats.tasksByStatus).map(([status, count]) => (
            <div key={status} className="flex items-center justify-between py-2">
              <Badge variant="status" value={status} />
              <div className="flex items-center gap-3 flex-1 ml-4">
                <div className="flex-1 bg-slate-100 dark:bg-slate-700 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-500 ${statusBarColors[status]}`}
                    style={{ width: `${stats.totalTasks ? (count / stats.totalTasks) * 100 : 0}%` }}
                  />
                </div>
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 w-6 text-right">{count}</span>
              </div>
            </div>
          ))}
        </Card>

        {/* Tasks per Member */}
        <Card className="p-4 sm:p-6">
          <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-4">Tasks per Member</h3>
          {Object.entries(stats.tasksPerUser).map(([name, count]) => (
            <div key={name} className="flex items-center justify-between py-2">
              <span className="text-sm text-slate-700 dark:text-slate-300 font-medium">{name}</span>
              <div className="flex items-center gap-3 flex-1 ml-4">
                <div className="flex-1 bg-slate-100 dark:bg-slate-700 rounded-full h-2">
                  <div
                    className="bg-indigo-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${stats.totalTasks ? (count / stats.totalTasks) * 100 : 0}%` }}
                  />
                </div>
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 w-6 text-right">{count}</span>
              </div>
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
}
