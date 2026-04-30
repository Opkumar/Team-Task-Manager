import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from "../utils/api";
import toast from 'react-hot-toast';
import { Plus, ArrowLeft } from 'lucide-react';
import clsx from 'clsx';
import Button from '../components/ui/Button';
import Avatar from '../components/ui/Avatar';
import Skeleton from '../components/ui/Skeleton';
import EmptyState from '../components/ui/EmptyState';
import SearchInput from '../components/ui/SearchInput';
import TaskCard from '../components/project/TaskCard';
import TaskFormModal from '../components/project/TaskFormModal';
import TaskDetailDrawer from '../components/project/TaskDetailDrawer';
import MemberList from '../components/project/MemberList';
import ProjectDashboardTab from '../components/project/ProjectDashboardTab';
import KanbanBoard from '../components/project/KanbanBoard';
import ViewToggle from '../components/project/ViewToggle';
import { ClipboardList } from 'lucide-react';

const EMPTY_FORM = { title: '', description: '', priority: 'Medium', dueDate: '', assignedTo: '' };

const adminTabs = [
  { id: 'tasks', label: 'Tasks' },
  { id: 'members', label: 'Members' },
  { id: 'dashboard', label: 'Dashboard' },
];

const memberTabs = [
  { id: 'tasks', label: 'My Tasks' },
];

export default function ProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const {  user } = useAuth();

  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('tasks');

  // Task form
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [taskForm, setTaskForm] = useState(EMPTY_FORM);
  const [editingTask, setEditingTask] = useState(null);

  // Task detail drawer
  const [selectedTask, setSelectedTask] = useState(null);

  // View and filters
  const [view, setView] = useState(() => localStorage.getItem('taskView') || 'list');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState([]);
  const [priorityFilter, setPriorityFilter] = useState([]);

  const isAdmin = project?.members.find(
    (m) => (m.user._id || m.user) === (user.id || user._id)
  )?.role === 'Admin';

  const fetchAll = async () => {
    try {
      const [projRes, tasksRes] = await Promise.all([
        API.get(`/projects/${id}`),
        API.get(`/tasks/project/${id}`),
      ]);
      setProject(projRes.data);
      setTasks(tasksRes.data);

      // Only fetch dashboard stats if user is Admin in this project
      const currentUser = projRes.data.members.find(
        (m) => (m.user._id || m.user) === (user.id || user._id)
      );
      if (currentUser?.role === 'Admin') {
        const statsRes = await API.get(`/dashboard/project/${id}`);
        setStats(statsRes.data);
      }
    } catch {
      toast.error('Failed to load project');
      navigate('/projects');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAll(); }, [id]);

  useEffect(() => {
    localStorage.setItem('taskView', view);
  }, [view]);

  // Filtered tasks
  const filteredTasks = useMemo(() => {
    return tasks.filter((t) => {
      if (search && !t.title.toLowerCase().includes(search.toLowerCase())) return false;
      if (statusFilter.length > 0 && !statusFilter.includes(t.status)) return false;
      if (priorityFilter.length > 0 && !priorityFilter.includes(t.priority)) return false;
      return true;
    });
  }, [tasks, search, statusFilter, priorityFilter]);

  const toggleFilter = (arr, setArr, val) => {
    setArr(arr.includes(val) ? arr.filter((v) => v !== val) : [...arr, val]);
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...taskForm, project: id };
      if (!payload.assignedTo) delete payload.assignedTo;
      if (!payload.dueDate) delete payload.dueDate;

      if (editingTask) {
        await API.put(`/tasks/${editingTask._id}`, payload);
        toast.success('Task updated');
      } else {
        await API.post('/tasks', payload);
        toast.success('Task created');
      }
      setTaskForm(EMPTY_FORM);
      setShowTaskForm(false);
      setEditingTask(null);
      fetchAll();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save task');
    }
  };

  const handleStatusChange = async (taskId, status) => {
    // Optimistic update
    setTasks((prev) => prev.map((t) => (t._id === taskId ? { ...t, status } : t)));
    try {
      await API.put(`/tasks/${taskId}`, { status });
      fetchAll();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update status');
      fetchAll();
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!confirm('Delete this task?')) return;
    try {
      await API.delete(`/tasks/${taskId}`);
      toast.success('Task deleted');
      fetchAll();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete task');
    }
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setTaskForm({
      title: task.title,
      description: task.description || '',
      priority: task.priority,
      dueDate: task.dueDate ? task.dueDate.split('T')[0] : '',
      assignedTo: task.assignedTo?._id || '',
    });
    setShowTaskForm(true);
  };

  const handleAddMember = async (email) => {
    try {
      await API.post(`/projects/${id}/members`, { email });
      toast.success('Member added');
      fetchAll();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add member');
    }
  };

  const handleRemoveMember = async (userId) => {
    if (!confirm('Remove this member?')) return;
    try {
      await API.delete(`/projects/${id}/members/${userId}`);
      toast.success('Member removed');
      fetchAll();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to remove member');
    }
  };

  if (loading) {
    return (
      <div className="animate-fade-in space-y-4">
        <Skeleton variant="text" className="w-48 h-8" />
        <Skeleton variant="text" className="w-72 h-4" />
        <Skeleton variant="card" className="h-12" />
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => <Skeleton key={i} variant="card" className="h-20" />)}
        </div>
      </div>
    );
  }

  if (!project) return null;

  return (
    <div className="animate-slide-up">
      {/* Header */}
      <div className="mb-6">
        <button onClick={() => navigate('/projects')} className="flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 mb-3">
          <ArrowLeft className="w-4 h-4" /> Back to Projects
        </button>
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white truncate">{project.name}</h1>
              <span className={clsx(
                'text-xs px-2 py-0.5 rounded-full font-medium border shrink-0',
                isAdmin
                  ? 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-400 dark:border-purple-800'
                  : 'bg-slate-50 text-slate-600 border-slate-200 dark:bg-slate-700 dark:text-slate-400 dark:border-slate-600'
              )}>
                {isAdmin ? 'Admin' : 'Member'}
              </span>
            </div>
            {project.description && <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">{project.description}</p>}
          </div>
          <div className="flex -space-x-2 shrink-0">
            {project.members.slice(0, 4).map((m) => (
              <Avatar key={m.user._id} name={m.user.name} size="sm" className="ring-2 ring-white dark:ring-slate-900" />
            ))}
            {project.members.length > 4 && (
              <div className="w-7 h-7 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-xs font-medium text-slate-600 dark:text-slate-400 ring-2 ring-white dark:ring-slate-900">
                +{project.members.length - 4}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 mb-6 border-b border-slate-200 dark:border-slate-700 overflow-x-auto">
        {(isAdmin ? adminTabs : memberTabs).map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={clsx(
              'px-3 sm:px-4 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px whitespace-nowrap',
              tab === t.id
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Tasks Tab */}
      {tab === 'tasks' && (
        <div>
          {/* Member notice */}
          {!isAdmin && (
            <div className="mb-4 px-4 py-3 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800 rounded-lg">
              <p className="text-sm text-indigo-700 dark:text-indigo-300">
                You're viewing tasks assigned to you. Only admins can create, edit, or delete tasks.
              </p>
            </div>
          )}

          {/* Toolbar */}
          <div className="space-y-3 mb-4">
            {/* Row 1: Search + View Toggle + New Task */}
            <div className="flex items-center gap-2">
              <SearchInput
                value={search}
                onChange={setSearch}
                placeholder="Search tasks..."
                className="flex-1 min-w-0"
              />
              {isAdmin && <ViewToggle view={view} onViewChange={setView} />}
              {isAdmin && (
                <Button
                  size="sm"
                  onClick={() => {
                    setEditingTask(null);
                    setTaskForm(EMPTY_FORM);
                    setShowTaskForm(true);
                  }}
                  className="shrink-0"
                >
                  <Plus className="w-4 h-4" />
                  <span className="hidden sm:inline">New Task</span>
                </Button>
              )}
            </div>

            {/* Row 2: Filters (Admin only - Members have few tasks) */}
            {isAdmin && (
              <div className="flex items-center gap-2 overflow-x-auto pb-1 -mb-1">
                <span className="text-xs text-slate-400 dark:text-slate-500 shrink-0">Filter:</span>
                {['To Do', 'In Progress', 'Done'].map((s) => (
                  <button
                    key={s}
                    onClick={() => toggleFilter(statusFilter, setStatusFilter, s)}
                    className={clsx(
                      'px-2.5 py-1 rounded-full text-xs font-medium border transition-colors whitespace-nowrap shrink-0',
                      statusFilter.includes(s)
                        ? 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-400 dark:border-indigo-800'
                        : 'bg-white dark:bg-slate-800 text-slate-500 border-slate-200 dark:border-slate-600 hover:border-slate-300'
                    )}
                  >
                    {s}
                  </button>
                ))}
                <div className="w-px h-4 bg-slate-200 dark:bg-slate-600 shrink-0" />
                {['Low', 'Medium', 'High'].map((p) => (
                  <button
                    key={p}
                    onClick={() => toggleFilter(priorityFilter, setPriorityFilter, p)}
                    className={clsx(
                      'px-2.5 py-1 rounded-full text-xs font-medium border transition-colors whitespace-nowrap shrink-0',
                      priorityFilter.includes(p)
                        ? 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-400 dark:border-indigo-800'
                        : 'bg-white dark:bg-slate-800 text-slate-500 border-slate-200 dark:border-slate-600 hover:border-slate-300'
                    )}
                  >
                    {p}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Task Form Modal */}
          <TaskFormModal
            open={showTaskForm}
            onClose={() => { setShowTaskForm(false); setEditingTask(null); }}
            taskForm={taskForm}
            setTaskForm={setTaskForm}
            onSubmit={handleCreateTask}
            editing={!!editingTask}
            members={project.members}
          />

          {/* Task Detail Drawer */}
          <TaskDetailDrawer
            task={selectedTask}
            open={!!selectedTask}
            onClose={() => setSelectedTask(null)}
            isAdmin={isAdmin}
            onEdit={handleEditTask}
            onDelete={handleDeleteTask}
            onStatusChange={handleStatusChange}
          />

          {/* Task views */}
          {filteredTasks.length === 0 ? (
            <EmptyState
              icon={ClipboardList}
              title={
                tasks.length === 0
                  ? isAdmin ? 'No tasks yet' : 'No tasks assigned to you'
                  : 'No tasks match your filters'
              }
              description={
                tasks.length === 0
                  ? isAdmin ? 'Create your first task to get started.' : 'Ask your project admin to assign tasks to you.'
                  : 'Try adjusting your search or filter criteria.'
              }
              actionLabel={tasks.length === 0 && isAdmin ? 'Create Task' : undefined}
              onAction={tasks.length === 0 && isAdmin ? () => setShowTaskForm(true) : undefined}
            />
          ) : view === 'board' && isAdmin ? (
            <KanbanBoard
              tasks={filteredTasks}
              isAdmin={isAdmin}
              onStatusChange={handleStatusChange}
              onEdit={handleEditTask}
              onDelete={handleDeleteTask}
              onTaskClick={setSelectedTask}
            />
          ) : (
            <div className="space-y-2">
              {filteredTasks.map((task) => (
                <TaskCard
                  key={task._id}
                  task={task}
                  isAdmin={isAdmin}
                  onStatusChange={handleStatusChange}
                  onEdit={handleEditTask}
                  onDelete={handleDeleteTask}
                  onClick={() => setSelectedTask(task)}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Members Tab */}
      {tab === 'members' && (
        <MemberList
          members={project.members}
          isAdmin={isAdmin}
          onAddMember={handleAddMember}
          onRemoveMember={handleRemoveMember}
        />
      )}

      {/* Dashboard Tab */}
      {tab === 'dashboard' && <ProjectDashboardTab stats={stats} />}
    </div>
  );
}
