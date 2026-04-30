import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import TaskCard from './TaskCard';

const columns = [
  { id: 'To Do', label: 'To Do', accent: 'border-amber-400', bg: 'bg-amber-50' },
  { id: 'In Progress', label: 'In Progress', accent: 'border-blue-500', bg: 'bg-blue-50' },
  { id: 'Done', label: 'Done', accent: 'border-emerald-500', bg: 'bg-emerald-50' },
];

export default function KanbanBoard({ tasks, isAdmin, onStatusChange, onEdit, onDelete, onTaskClick }) {
  const tasksByStatus = {
    'To Do': tasks.filter(t => t.status === 'To Do'),
    'In Progress': tasks.filter(t => t.status === 'In Progress'),
    'Done': tasks.filter(t => t.status === 'Done'),
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    const { draggableId, destination } = result;
    const newStatus = destination.droppableId;
    onStatusChange?.(draggableId, newStatus);
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="flex md:grid md:grid-cols-3 gap-4 min-h-[400px] overflow-x-auto snap-x snap-mandatory pb-4 md:pb-0 -mx-4 px-4 md:mx-0 md:px-0">
        {columns.map((col) => (
          <div key={col.id} className={`rounded-xl border-t-4 ${col.accent} bg-slate-50/50 dark:bg-slate-800/50 p-3 min-w-[280px] snap-center flex-shrink-0 md:min-w-0 md:flex-shrink`}>
            <div className="flex items-center gap-2 mb-3 px-1">
              <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300">{col.label}</h3>
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${col.bg} dark:bg-slate-700 text-slate-600 dark:text-slate-400`}>
                {tasksByStatus[col.id].length}
              </span>
            </div>

            <Droppable droppableId={col.id}>
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={`space-y-2 min-h-[100px] rounded-lg transition-colors p-1 ${
                    snapshot.isDraggingOver ? 'bg-slate-100 dark:bg-slate-700/50' : ''
                  }`}
                >
                  {tasksByStatus[col.id].map((task, index) => (
                    <Draggable key={task._id} draggableId={task._id} index={index}>
                      {(provided) => (
                        <div ref={provided.innerRef} {...provided.draggableProps}>
                          <TaskCard
                            task={task}
                            compact
                            isAdmin={isAdmin}
                            onEdit={onEdit}
                            onDelete={onDelete}
                            onClick={() => onTaskClick?.(task)}
                            dragHandleProps={provided.dragHandleProps}
                          />
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
        ))}
      </div>
    </DragDropContext>
  );
}
