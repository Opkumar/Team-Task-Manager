import Modal from '../ui/Modal';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Button from '../ui/Button';

export default function TaskFormModal({
  open,
  onClose,
  taskForm,
  setTaskForm,
  onSubmit,
  editing,
  members = [],
}) {
  return (
    <Modal open={open} onClose={onClose} title={editing ? 'Edit Task' : 'New Task'}>
      <form onSubmit={onSubmit} className="space-y-4">
        <Input
          label="Title"
          required
          value={taskForm.title}
          onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
          placeholder="Task title"
        />
        <Input
          label="Description"
          textarea
          rows={3}
          value={taskForm.description}
          onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })}
          placeholder="Add a description..."
        />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Select
            label="Priority"
            value={taskForm.priority}
            onChange={(e) => setTaskForm({ ...taskForm, priority: e.target.value })}
          >
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
          </Select>
          <Input
            label="Due Date"
            type="date"
            value={taskForm.dueDate}
            onChange={(e) => setTaskForm({ ...taskForm, dueDate: e.target.value })}
          />
          <Select
            label="Assign To"
            value={taskForm.assignedTo}
            onChange={(e) => setTaskForm({ ...taskForm, assignedTo: e.target.value })}
          >
            <option value="">Unassigned</option>
            {members.map((m) => (
              <option key={m.user._id} value={m.user._id}>
                {m.user.name}
              </option>
            ))}
          </Select>
        </div>
        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">{editing ? 'Update Task' : 'Create Task'}</Button>
        </div>
      </form>
    </Modal>
  );
}
