
import { useMemo, useState } from 'react';
import { useTaskStore } from '@/lib/store';
import TaskItem from './TaskItem';
import { Plus, Filter, X, Tag } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useUser } from '@clerk/clerk-react';
import { Button } from './ui/button';
import { toast } from 'sonner';
import { Badge } from './ui/badge';

const TaskList = () => {
  const { tasks, activeView, activeCategory, setActiveView, setActiveCategory, categories } = useTaskStore();
  const { user } = useUser();
  const [showFilters, setShowFilters] = useState(false);
  
  const filteredTasks = useMemo(() => {
    let filtered = [...tasks];
    
    // Filter by user
    if (user) {
      // Show only personal tasks
      filtered = filtered.filter(task => !task.groupId);
    }
    
    // Filter by view
    if (activeView === 'active') {
      filtered = filtered.filter(task => !task.completed);
    } else if (activeView === 'completed') {
      filtered = filtered.filter(task => task.completed);
    }
    
    // Filter by category
    if (activeCategory) {
      filtered = filtered.filter(task => task.category === activeCategory);
    }
    
    // Sort by creation date (newest first)
    return filtered.sort((a, b) => {
      // First by completion
      if (a.completed !== b.completed) {
        return a.completed ? 1 : -1;
      }
      
      // Then by priority
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      if (a.priority !== b.priority) {
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      }
      
      // Then by due date (if exists)
      if (a.dueDate && b.dueDate) {
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      }
      
      // Finally by creation date
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [tasks, activeView, activeCategory, user]);
  
  const completedCount = useMemo(() => {
    return tasks.filter(task => task.completed).length;
  }, [tasks]);
  
  const completionPercentage = useMemo(() => {
    if (tasks.length === 0) return 0;
    return Math.round((completedCount / tasks.length) * 100);
  }, [tasks.length, completedCount]);

  const handleAddTask = () => {
    // Scroll to add task section
    const element = document.getElementById('add-task-section');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleClearCategory = () => {
    setActiveCategory(null);
    toast('Category filter removed');
  };
  
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold tracking-tight">Tasks</h2>
          <p className="text-sm text-muted-foreground mt-1">
            {completedCount} of {tasks.length} tasks completed ({completionPercentage}%)
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center"
          >
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
          
          <Button onClick={handleAddTask} size="sm">
            <Plus className="mr-2 h-4 w-4" />
            New Task
          </Button>
        </div>
      </div>
      
      {activeCategory && (
        <div className="flex items-center gap-2 animate-fade-in">
          <span className="text-sm text-muted-foreground">Filtered by:</span>
          <Badge 
            variant="secondary"
            className="flex items-center gap-2 px-2 py-1 hover:bg-secondary/80 cursor-pointer"
            onClick={handleClearCategory}
          >
            <Tag className="h-3 w-3" />
            <span>
              {categories.find(c => c.id === activeCategory)?.name || 'Category'}
            </span>
            <X className="h-3 w-3 ml-1" />
          </Badge>
        </div>
      )}
      
      {showFilters && (
        <div className="space-y-4 animate-fade-in">
          <div className="flex flex-wrap gap-2">
            <button 
              onClick={() => setActiveView('all')}
              className={cn(
                "inline-flex items-center justify-center rounded-md px-3 py-1.5 text-sm font-medium transition-colors duration-200 focus-ring",
                activeView === 'all' 
                  ? "bg-primary text-primary-foreground" 
                  : "bg-white shadow-subtle border border-input hover:bg-secondary/50"
              )}
            >
              All
            </button>
            <button 
              onClick={() => setActiveView('active')}
              className={cn(
                "inline-flex items-center justify-center rounded-md px-3 py-1.5 text-sm font-medium transition-colors duration-200 focus-ring",
                activeView === 'active' 
                  ? "bg-primary text-primary-foreground" 
                  : "bg-white shadow-subtle border border-input hover:bg-secondary/50"
              )}
            >
              Active
            </button>
            <button 
              onClick={() => setActiveView('completed')}
              className={cn(
                "inline-flex items-center justify-center rounded-md px-3 py-1.5 text-sm font-medium transition-colors duration-200 focus-ring",
                activeView === 'completed' 
                  ? "bg-primary text-primary-foreground" 
                  : "bg-white shadow-subtle border border-input hover:bg-secondary/50"
              )}
            >
              Completed
            </button>
          </div>
          
          {categories.length > 0 && (
            <div>
              <h3 className="text-sm font-medium mb-2">Categories</h3>
              <div className="flex flex-wrap gap-2">
                {categories.map(category => (
                  <button
                    key={category.id}
                    onClick={() => setActiveCategory(category.id)}
                    className={cn(
                      "inline-flex items-center justify-center rounded-md px-3 py-1.5 text-sm font-medium transition-colors duration-200 focus-ring",
                      activeCategory === category.id
                        ? "bg-primary text-primary-foreground"
                        : "bg-white shadow-subtle border border-input hover:bg-secondary/50"
                    )}
                  >
                    <div 
                      className="w-2 h-2 rounded-full mr-2" 
                      style={{ backgroundColor: category.color }}
                    />
                    {category.name}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
      
      <div className="relative overflow-hidden rounded-xl border border-border bg-card shadow-subtle">
        <div className="absolute top-0 left-0 h-1 bg-primary" style={{ width: `${completionPercentage}%` }} />
        
        <div className="divide-y divide-border">
          {filteredTasks.length > 0 ? (
            filteredTasks.map(task => (
              <TaskItem key={task.id} task={task} />
            ))
          ) : (
            <div className="p-8 text-center">
              <p className="text-muted-foreground">No tasks found</p>
              <Button 
                onClick={handleAddTask}
                className="mt-4"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add new task
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskList;
