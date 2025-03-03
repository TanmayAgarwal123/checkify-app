
import { useState } from 'react';
import { Task, Priority } from '@/lib/types';
import { useTaskStore } from '@/lib/store';
import { cn } from '@/lib/utils';
import { Check, Clock, Trash, Edit, Calendar, ChevronRight, AlertCircle, Tag } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Button } from './ui/button';

interface TaskItemProps {
  task: Task;
}

const TaskItem = ({ task }: TaskItemProps) => {
  const { toggleTaskCompletion, removeTask, updateTask, categories, addCategory } = useTaskStore();
  const [isHovered, setIsHovered] = useState(false);
  const [showActions, setShowActions] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editTime, setEditTime] = useState(task.dueTime || '');
  const [newCategoryName, setNewCategoryName] = useState('');
  
  const getPriorityClass = (priority: Priority) => {
    switch (priority) {
      case 'high':
        return 'priority-high';
      case 'medium':
        return 'priority-medium';
      case 'low':
        return 'priority-low';
      default:
        return 'priority-medium';
    }
  };

  const handleToggleComplete = () => {
    toggleTaskCompletion(task.id);
    toast(task.completed ? 'Task marked as active' : 'Task completed! 🎉');
  };
  
  const handleDelete = () => {
    removeTask(task.id);
    toast('Task deleted');
  };

  const handleUpdateTask = () => {
    if (editTitle.trim()) {
      updateTask(task.id, { 
        title: editTitle,
        dueTime: editTime || undefined
      });
      setIsEditing(false);
      toast('Task updated');
    }
  };

  const handlePriorityChange = (priority: Priority) => {
    updateTask(task.id, { priority });
    toast(`Priority set to ${priority}`);
  };

  const handleCategoryChange = (categoryId: string | undefined) => {
    updateTask(task.id, { category: categoryId });
    toast('Category updated');
  };

  const handleAddCategory = () => {
    if (!newCategoryName.trim()) return;
    
    // Fix: Store category ID from addCategory return value
    const categoryId = addCategory(newCategoryName);
    setNewCategoryName('');
    // Use returned category ID
    handleCategoryChange(categoryId);
  };

  const taskCategory = task.category ? categories.find(c => c.id === task.category) : null;
  
  return (
    <div 
      className={cn(
        "group flex items-start gap-3 p-3 rounded-lg transition-all duration-300",
        "hover:bg-secondary/50",
        isHovered && "bg-secondary/50",
        task.priority === 'high' && !task.completed && "border-l-4 border-l-red-500",
        "animate-scale-in"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="pt-0.5">
        <label className="task-check cursor-pointer flex h-5 w-5 items-center justify-center rounded-full border-2 border-muted-foreground bg-transparent transition-colors">
          <input 
            type="checkbox" 
            checked={task.completed} 
            onChange={handleToggleComplete} 
            className="sr-only" 
          />
          <div className="h-5 w-5 rounded-full flex items-center justify-center">
            <Check className="h-3 w-3" />
          </div>
        </label>
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          {isEditing ? (
            <div className="w-full space-y-2">
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                autoFocus
                className="w-full px-2 py-1 text-sm border border-input rounded-md bg-background focus:outline-none focus:ring-1 focus:ring-ring"
              />
              {task.dueDate && (
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-muted-foreground">Time:</span>
                  <input
                    type="time"
                    value={editTime}
                    onChange={(e) => setEditTime(e.target.value)}
                    className="px-2 py-1 text-xs border border-input rounded-md bg-background focus:outline-none"
                  />
                </div>
              )}
              <div className="flex justify-end">
                <Button 
                  size="sm" 
                  variant="ghost" 
                  onClick={() => setIsEditing(false)} 
                  className="text-xs mr-2"
                >
                  Cancel
                </Button>
                <Button 
                  size="sm" 
                  onClick={handleUpdateTask}
                  className="text-xs"
                >
                  Save
                </Button>
              </div>
            </div>
          ) : (
            <div 
              className={cn("flex items-center space-x-2", task.completed && "task-completed")}
              onDoubleClick={() => setIsEditing(true)}
            >
              <span className={`priority-dot ${getPriorityClass(task.priority)}`}></span>
              <p className="text-sm font-medium leading-none">{task.title}</p>
              
              {taskCategory && (
                <span 
                  className="px-2 py-0.5 rounded-full text-xs bg-secondary flex items-center gap-1"
                  style={{ backgroundColor: `${taskCategory.color}20` }}
                >
                  <div 
                    className="w-2 h-2 rounded-full" 
                    style={{ backgroundColor: taskCategory.color }}
                  />
                  <span>{taskCategory.name}</span>
                </span>
              )}
            </div>
          )}
          
          <div className="flex gap-1">
            {task.dueDate && new Date(task.dueDate) < new Date() && !task.completed && (
              <div className="text-red-500 flex items-center" title="Overdue">
                <AlertCircle className="h-4 w-4" />
              </div>
            )}
            <button 
              onClick={() => setShowActions(!showActions)}
              className="group-hover:opacity-100 transition-opacity duration-200 text-muted-foreground hover:text-foreground p-1 rounded-full bg-secondary/50 opacity-70"
              aria-label="Show task actions"
            >
              <ChevronRight className={cn("h-4 w-4 transition-transform", showActions && "rotate-90")} />
            </button>
          </div>
        </div>
        
        {task.description && (
          <p className={cn(
            "mt-1 text-xs text-muted-foreground line-clamp-2", 
            task.completed && "task-completed"
          )}>
            {task.description}
          </p>
        )}
        
        {task.dueDate && (
          <div className={cn(
            "mt-2 flex items-center text-xs",
            new Date(task.dueDate) < new Date() && !task.completed 
              ? "text-red-500" 
              : "text-muted-foreground"
          )}>
            <Clock className="mr-1 h-3 w-3" />
            <span>
              Due {format(new Date(task.dueDate), 'MMM d, yyyy')}
              {task.dueTime && ` at ${task.dueTime}`}
            </span>
          </div>
        )}

        {showActions && (
          <div className="mt-3 flex flex-wrap gap-2 animate-fade-in">
            <button 
              onClick={() => setIsEditing(true)}
              className="inline-flex items-center rounded-md border border-input bg-background px-2 py-1 text-xs text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors duration-200"
            >
              <Edit className="mr-1 h-3 w-3" />
              Edit
            </button>
            
            <div className="inline-flex items-center rounded-md border border-input bg-background px-2 py-1 text-xs text-muted-foreground">
              <span className="mr-1">Priority:</span>
              <div className="flex space-x-1">
                <button 
                  onClick={() => handlePriorityChange('low')}
                  className={cn(
                    "h-3 w-3 rounded-full", 
                    task.priority === 'low' ? "bg-green-500 ring-1 ring-offset-1 ring-green-500" : "bg-green-200 hover:bg-green-500"
                  )}
                  title="Low priority"
                />
                <button 
                  onClick={() => handlePriorityChange('medium')}
                  className={cn(
                    "h-3 w-3 rounded-full", 
                    task.priority === 'medium' ? "bg-amber-500 ring-1 ring-offset-1 ring-amber-500" : "bg-amber-200 hover:bg-amber-500"
                  )}
                  title="Medium priority"
                />
                <button 
                  onClick={() => handlePriorityChange('high')}
                  className={cn(
                    "h-3 w-3 rounded-full", 
                    task.priority === 'high' ? "bg-red-500 ring-1 ring-offset-1 ring-red-500" : "bg-red-200 hover:bg-red-500"
                  )}
                  title="High priority"
                />
              </div>
            </div>
            
            <Popover>
              <PopoverTrigger asChild>
                <button 
                  className="inline-flex items-center rounded-md border border-input bg-background px-2 py-1 text-xs text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors duration-200"
                >
                  <Tag className="mr-1 h-3 w-3" />
                  Category
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-48 p-2">
                <div className="space-y-2">
                  <div className="flex items-center gap-1">
                    <input
                      type="text"
                      placeholder="New category..."
                      value={newCategoryName}
                      onChange={(e) => setNewCategoryName(e.target.value)}
                      className="w-full px-2 py-1 text-xs border border-input rounded-md bg-background focus:outline-none"
                    />
                    <Button 
                      size="sm"
                      variant="ghost"
                      className="px-2 h-7" 
                      onClick={handleAddCategory}
                      disabled={!newCategoryName.trim()}
                    >
                      <ChevronRight className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                  
                  <div className="max-h-36 overflow-y-auto space-y-1 py-1">
                    <button
                      type="button"
                      onClick={() => handleCategoryChange(undefined)}
                      className={cn(
                        "w-full px-2 py-1 text-xs text-left rounded hover:bg-secondary transition-colors duration-200",
                        !task.category && "bg-secondary"
                      )}
                    >
                      None
                    </button>
                    
                    {categories.map(category => (
                      <button
                        key={category.id}
                        type="button"
                        onClick={() => handleCategoryChange(category.id)}
                        className={cn(
                          "w-full px-2 py-1 text-xs text-left rounded flex items-center gap-2 hover:bg-secondary transition-colors duration-200",
                          task.category === category.id && "bg-secondary"
                        )}
                      >
                        <div 
                          className="w-2 h-2 rounded-full" 
                          style={{ backgroundColor: category.color }}
                        />
                        <span className="truncate">{category.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </PopoverContent>
            </Popover>
            
            <button 
              onClick={handleDelete}
              className="inline-flex items-center rounded-md border border-input bg-background px-2 py-1 text-xs text-destructive hover:bg-destructive/10 transition-colors duration-200"
            >
              <Trash className="mr-1 h-3 w-3" />
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskItem;
