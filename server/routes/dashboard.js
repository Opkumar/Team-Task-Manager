import { Router } from 'express';
import Task from '../models/Task.js';
import Project from '../models/Project.js';
import auth from '../middleware/auth.js';

const router = Router();

// Get dashboard stats for a project
router.get('/project/:projectId', auth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId).populate('members.user', 'name email');
    if (!project) return res.status(404).json({ message: 'Project not found' });

    const member = project.members.find(m => m.user._id.toString() === req.userId);
    if (!member) return res.status(403).json({ message: 'Access denied' });

    // Admin sees all tasks, Member sees only their assigned tasks
    let query = { project: req.params.projectId };
    if (member.role === 'Member') {
      query.assignedTo = req.userId;
    }

    const tasks = await Task.find(query).populate('assignedTo', 'name email');

    const totalTasks = tasks.length;
    const tasksByStatus = {
      'To Do': tasks.filter(t => t.status === 'To Do').length,
      'In Progress': tasks.filter(t => t.status === 'In Progress').length,
      'Done': tasks.filter(t => t.status === 'Done').length,
    };

    const now = new Date();
    const overdueTasks = tasks.filter(t => t.dueDate && new Date(t.dueDate) < now && t.status !== 'Done').length;

    // Tasks per user - only for Admin
    const tasksPerUser = {};
    if (member.role === 'Admin') {
      for (const m of project.members) {
        const userName = m.user.name;
        const userId = m.user._id.toString();
        tasksPerUser[userName] = tasks.filter(t => t.assignedTo?._id.toString() === userId).length;
      }
    }

    res.json({ totalTasks, tasksByStatus, overdueTasks, tasksPerUser });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get overall dashboard (all user's projects)
router.get('/', auth, async (req, res) => {
  try {
    const projects = await Project.find({ 'members.user': req.userId });
    const projectIds = projects.map(p => p._id);

    // Find projects where user is Admin vs Member
    const adminProjectIds = [];
    const memberProjectIds = [];
    for (const project of projects) {
      const member = project.members.find(m => m.user.toString() === req.userId);
      if (member?.role === 'Admin') {
        adminProjectIds.push(project._id);
      } else {
        memberProjectIds.push(project._id);
      }
    }

    // Admin projects: all tasks; Member projects: only assigned tasks
    const [adminTasks, memberTasks] = await Promise.all([
      Task.find({ project: { $in: adminProjectIds } }).populate('assignedTo', 'name email'),
      Task.find({ project: { $in: memberProjectIds }, assignedTo: req.userId }).populate('assignedTo', 'name email'),
    ]);

    const tasks = [...adminTasks, ...memberTasks];

    const totalTasks = tasks.length;
    const tasksByStatus = {
      'To Do': tasks.filter(t => t.status === 'To Do').length,
      'In Progress': tasks.filter(t => t.status === 'In Progress').length,
      'Done': tasks.filter(t => t.status === 'Done').length,
    };

    const now = new Date();
    const overdueTasks = tasks.filter(t => t.dueDate && new Date(t.dueDate) < now && t.status !== 'Done').length;
    const myTasks = tasks.filter(t => t.assignedTo?._id.toString() === req.userId).length;

    res.json({ totalTasks, tasksByStatus, overdueTasks, myTasks, totalProjects: projects.length });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
