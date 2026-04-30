import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import Task from '../models/Task.js';
import Project from '../models/Project.js';
import auth from '../middleware/auth.js';

const router = Router();

// Helper: check membership and role
const getProjectRole = (project, userId) => {
  const member = project.members.find(m => m.user.toString() === userId);
  return member ? member.role : null;
};

// Get tasks for a project
router.get('/project/:projectId', auth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId);
    if (!project) return res.status(404).json({ message: 'Project not found' });

    const role = getProjectRole(project, req.userId);
    if (!role) return res.status(403).json({ message: 'Access denied' });

    let query = { project: req.params.projectId };
    // Members can only see tasks assigned to them
    if (role === 'Member') {
      query.assignedTo = req.userId;
    }

    const tasks = await Task.find(query)
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email')
      .sort('-createdAt');
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create task (Admin only)
router.post('/', auth, [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('project').notEmpty().withMessage('Project ID is required'),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const project = await Project.findById(req.body.project);
    if (!project) return res.status(404).json({ message: 'Project not found' });

    const role = getProjectRole(project, req.userId);
    if (role !== 'Admin') return res.status(403).json({ message: 'Only admins can create tasks' });

    // Validate assignedTo is a member
    if (req.body.assignedTo) {
      const isMember = project.members.some(m => m.user.toString() === req.body.assignedTo);
      if (!isMember) return res.status(400).json({ message: 'Assigned user is not a project member' });
    }

    const task = await Task.create({
      title: req.body.title,
      description: req.body.description || '',
      status: req.body.status || 'To Do',
      priority: req.body.priority || 'Medium',
      dueDate: req.body.dueDate || null,
      assignedTo: req.body.assignedTo || null,
      project: req.body.project,
      createdBy: req.userId,
    });

    const populated = await task.populate([
      { path: 'assignedTo', select: 'name email' },
      { path: 'createdBy', select: 'name email' },
    ]);
    res.status(201).json(populated);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update task
router.put('/:id', auth, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    const project = await Project.findById(task.project);
    if (!project) return res.status(404).json({ message: 'Project not found' });

    const role = getProjectRole(project, req.userId);
    if (!role) return res.status(403).json({ message: 'Access denied' });

    // Members can only update status of their own tasks
    if (role === 'Member') {
      if (task.assignedTo?.toString() !== req.userId) {
        return res.status(403).json({ message: 'Can only update your own tasks' });
      }
      // Members can only change status
      if (req.body.status) task.status = req.body.status;
    } else {
      // Admin can update everything
      if (req.body.title) task.title = req.body.title;
      if (req.body.description !== undefined) task.description = req.body.description;
      if (req.body.status) task.status = req.body.status;
      if (req.body.priority) task.priority = req.body.priority;
      if (req.body.dueDate !== undefined) task.dueDate = req.body.dueDate;
      if (req.body.assignedTo !== undefined) {
        if (req.body.assignedTo) {
          const isMember = project.members.some(m => m.user.toString() === req.body.assignedTo);
          if (!isMember) return res.status(400).json({ message: 'Assigned user is not a project member' });
        }
        task.assignedTo = req.body.assignedTo || null;
      }
    }

    await task.save();
    const populated = await task.populate([
      { path: 'assignedTo', select: 'name email' },
      { path: 'createdBy', select: 'name email' },
    ]);
    res.json(populated);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete task (Admin only)
router.delete('/:id', auth, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    const project = await Project.findById(task.project);
    if (!project) return res.status(404).json({ message: 'Project not found' });

    const role = getProjectRole(project, req.userId);
    if (role !== 'Admin') return res.status(403).json({ message: 'Only admins can delete tasks' });

    await task.deleteOne();
    res.json({ message: 'Task deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
