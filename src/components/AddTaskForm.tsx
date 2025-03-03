
import { useState } from 'react';
import { useTaskStore } from '@/lib/store';
import { Priority } from '@/lib/types';
import { Calendar, Clock, CheckCircle, ChevronDown, Plus, Tag } from 'lucide-react';
import { cn } from '@/lib/utils';
import { DatePicker } from './DatePicker';
import { useAuth } from '@clerk/clerk-react';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Button } from './ui/button';
import { toast } from 'sonner';

const AddTaskForm = () => {
  const { addTask, categories, addCategory } = useTaskStore();
  const { isSignedIn } = useAuth();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [dueDate, setDueDate] = useState<Date | undefined>(undefined);
  const [dueTime, setDueTime] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [showOptions, setShowOptions] = useState(false);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) return;
    
    addTask(title, priority, dueDate, dueTime || undefined, description || undefined, selectedCategory);
    toast('Task added successfully!');
    
    // Reset form
    setTitle('');
    setDescription('');
    setPriority('medium');
    setDueDate(undefined);
    setDueTime('');
    setSelectedCategory(undefined);
    setShowOptions(false);
  };
  
  const handleAddCategory = () => {
    if (!newCategoryName.trim()) return;
    
    const newCategory = addCategory(newCategoryName);
    setNewCategoryName('');
    setSelectedCategory(newCategory);
    toast(`Category "${newCategoryName}" created`);
  };
  
  if (!isSignedIn) {
    return (
      <div className="rounded-xl border border-border bg-card p-6 shadow-subtle animate-slide-up text-center">
        <h3 className="text-lg font-medium mb-2">Sign in to start creating tasks</h3>
        <p className="text-muted-foreground mb-4">Create your personalized to-do lists and track your progress</p>
      </div>
    );
  }
  
  return (
    <div className="rounded-xl border border-border bg-card p-4 shadow-subtle animate-slide-up">
      <form onSubmit={handleSubmit}>
        <div className="space-y-3">
          <div>
            <input
              type="text"
              placeholder="What needs to be done?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border-none bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none text-sm"
            />
          </div>
          
          {showOptions && (
            <div className="space-y-3 animate-scale-in">
              <div>
                <textarea
                  placeholder="Add description..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring text-sm resize-none"
                />
              </div>
              
              <div className="flex flex-wrap gap-3">
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-muted-foreground">Priority:</span>
                  <div className="flex rounded-md overflow-hidden border border-input">
                    <button
                      type="button"
                      onClick={() => setPriority('low')}
                      className={cn(
                        "px-2 py-1 text-xs font-medium transition-colors duration-200",
                        priority === 'low' 
                          ? "bg-green-500 text-white" 
                          : "bg-background text-muted-foreground hover:bg-secondary"
                      )}
                    >
                      Low
                    </button>
                    <button
                      type="button"
                      onClick={() => setPriority('medium')}
                      className={cn(
                        "px-2 py-1 text-xs font-medium transition-colors duration-200",
                        priority === 'medium' 
                          ? "bg-amber-500 text-white" 
                          : "bg-background text-muted-foreground hover:bg-secondary"
                      )}
                    >
                      Medium
                    </button>
                    <button
                      type="button"
                      onClick={() => setPriority('high')}
                      className={cn(
                        "px-2 py-1 text-xs font-medium transition-colors duration-200",
                        priority === 'high' 
                          ? "bg-red-500 text-white" 
                          : "bg-background text-muted-foreground hover:bg-secondary"
                      )}
                    >
                      High
                    </button>
                  </div>
                </div>
                
                <div className="w-full mt-2">
                  <DatePicker date={dueDate} onDateChange={setDueDate} />
                </div>
                
                {/* Time input */}
                <div className="w-full flex items-center space-x-2">
                  <span className="text-sm text-muted-foreground">Time:</span>
                  <div className="flex items-center border border-input rounded-md px-3 py-1 bg-background">
                    <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                    <input
                      type="time"
                      value={dueTime}
                      onChange={(e) => setDueTime(e.target.value)}
                      className="w-full bg-transparent focus:outline-none text-sm"
                    />
                  </div>
                </div>
                
                {/* Category selection */}
                <div className="w-full flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Category:</span>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex items-center justify-between w-48"
                      >
                        <div className="flex items-center gap-2">
                          <Tag className="h-3.5 w-3.5" />
                          <span className="truncate">
                            {selectedCategory 
                              ? categories.find(c => c.id === selectedCategory)?.name || 'Select category' 
                              : 'Select category'}
                          </span>
                        </div>
                        <ChevronDown className="h-3.5 w-3.5 ml-2" />
                      </Button>
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
                            <Plus className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                        
                        <div className="max-h-36 overflow-y-auto space-y-1 py-1">
                          <button
                            type="button"
                            onClick={() => setSelectedCategory(undefined)}
                            className={cn(
                              "w-full px-2 py-1 text-xs text-left rounded hover:bg-secondary transition-colors duration-200",
                              selectedCategory === undefined && "bg-secondary"
                            )}
                          >
                            None
                          </button>
                          
                          {categories.map(category => (
                            <button
                              key={category.id}
                              type="button"
                              onClick={() => setSelectedCategory(category.id)}
                              className={cn(
                                "w-full px-2 py-1 text-xs text-left rounded flex items-center gap-2 hover:bg-secondary transition-colors duration-200",
                                selectedCategory === category.id && "bg-secondary"
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
                </div>
              </div>
            </div>
          )}
          
          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={() => setShowOptions(!showOptions)}
              className="inline-flex items-center text-xs text-muted-foreground hover:text-foreground transition-colors duration-200"
            >
              {showOptions ? 'Hide options' : 'Show options'}
              <ChevronDown className={cn("ml-1 h-3 w-3 transition-transform duration-200", showOptions && "rotate-180")} />
            </button>
            
            <button
              type="submit"
              disabled={!title.trim()}
              className={cn(
                "inline-flex items-center justify-center rounded-md px-3 py-1.5 text-sm font-medium shadow-sm transition-colors duration-200 focus-ring",
                title.trim() 
                  ? "bg-primary text-primary-foreground hover:bg-primary/90" 
                  : "bg-muted text-muted-foreground cursor-not-allowed"
              )}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Task
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddTaskForm;
