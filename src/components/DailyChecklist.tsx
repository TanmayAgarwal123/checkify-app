
import { useState } from 'react';
import { useTaskStore } from '@/lib/store';
import { cn } from '@/lib/utils';
import { Check, Plus, RefreshCcw, X } from 'lucide-react';
import { toast } from 'sonner';

const DailyChecklist = () => {
  const { dailyTasks, addDailyTask, removeDailyTask, toggleDailyTaskCompletion, resetDailyTasks } = useTaskStore();
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [showInput, setShowInput] = useState(false);
  
  const completedCount = dailyTasks.filter(task => task.completed).length;
  const totalCount = dailyTasks.length;
  const completionPercentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
  
  const handleAddTask = () => {
    if (newTaskTitle.trim()) {
      addDailyTask(newTaskTitle);
      setNewTaskTitle('');
      setShowInput(false);
      toast('Daily task added!');
    }
  };
  
  const handleResetTasks = () => {
    resetDailyTasks();
    toast('Daily tasks reset for tomorrow');
  };
  
  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold tracking-tight">Daily Checklist</h2>
        <div className="flex space-x-2">
          <button 
            onClick={() => setShowInput(!showInput)}
            className="inline-flex items-center justify-center h-8 w-8 rounded-md hover:bg-secondary transition-colors duration-200"
          >
            <Plus className="h-4 w-4" />
          </button>
          <button 
            onClick={handleResetTasks}
            className="inline-flex items-center justify-center h-8 w-8 rounded-md hover:bg-secondary transition-colors duration-200"
            title="Reset all tasks for tomorrow"
          >
            <RefreshCcw className="h-4 w-4" />
          </button>
        </div>
      </div>
      
      {showInput && (
        <div className="p-3 rounded-lg border border-border bg-card animate-scale-in">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="New daily task..."
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddTask()}
              className="flex-1 px-3 py-2 text-sm border border-input rounded-md bg-background focus:outline-none focus:ring-1 focus:ring-ring"
              autoFocus
            />
            <button
              onClick={() => setShowInput(false)}
              className="p-2 text-muted-foreground hover:text-foreground rounded-md hover:bg-secondary transition-colors duration-200"
            >
              <X className="h-4 w-4" />
            </button>
            <button
              onClick={handleAddTask}
              disabled={!newTaskTitle.trim()}
              className={cn(
                "px-3 py-1 rounded-md transition-colors duration-200",
                newTaskTitle.trim()
                  ? "bg-primary text-primary-foreground hover:bg-primary/90"
                  : "bg-muted text-muted-foreground cursor-not-allowed"
              )}
            >
              Add
            </button>
          </div>
        </div>
      )}
      
      <div className="relative pt-1 mb-4">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs text-muted-foreground">{completedCount}/{totalCount} completed</span>
          <span className="text-xs font-medium text-primary">{completionPercentage}%</span>
        </div>
        <div className="overflow-hidden h-2 text-xs flex rounded bg-secondary/50">
          <div 
            style={{ width: `${completionPercentage}%` }} 
            className="rounded shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-primary transition-all duration-500 ease-in-out" 
          />
        </div>
      </div>
      
      <div className="space-y-1 max-h-[400px] overflow-y-auto scrollbar-thin pr-1">
        {dailyTasks.length > 0 ? (
          dailyTasks.map((task) => (
            <div 
              key={task.id}
              className={cn(
                "group flex items-center justify-between p-3 rounded-lg hover:bg-secondary/50 transition-all duration-200",
                task.completed && "bg-secondary/30"
              )}
            >
              <div className="flex items-center gap-3">
                <label className="task-check cursor-pointer flex h-5 w-5 items-center justify-center rounded-full border-2 border-muted-foreground bg-transparent transition-colors">
                  <input 
                    type="checkbox" 
                    checked={task.completed} 
                    onChange={() => {
                      toggleDailyTaskCompletion(task.id);
                      if (!task.completed) {
                        toast('Daily task completed!');
                      }
                    }} 
                    className="sr-only" 
                  />
                  <div className="h-5 w-5 rounded-full flex items-center justify-center">
                    <Check className="h-3 w-3" />
                  </div>
                </label>
                <span className={cn("text-sm", task.completed && "line-through text-muted-foreground")}>
                  {task.title}
                </span>
              </div>
              
              <button
                onClick={() => {
                  removeDailyTask(task.id);
                  toast('Daily task removed');
                }}
                className="opacity-0 group-hover:opacity-100 p-1 rounded-full text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all duration-200"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))
        ) : (
          <div className="text-center py-6 text-muted-foreground">
            <p>No daily tasks yet</p>
            <button 
              onClick={() => setShowInput(true)}
              className="mt-2 inline-flex items-center justify-center rounded-md px-3 py-1.5 text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm transition-colors duration-200"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add a daily task
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DailyChecklist;
