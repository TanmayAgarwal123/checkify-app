import Navbar from '@/components/Navbar';
import TaskList from '@/components/TaskList';
import AddTaskForm from '@/components/AddTaskForm';
import DailyChecklist from '@/components/DailyChecklist';
import { SignedIn, SignedOut, SignInButton, SignUpButton } from '@clerk/clerk-react';
import { LogIn, UserPlus, CheckCircle, ListTodo, CalendarRange, Star, Sparkles } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { useState, useEffect } from 'react';
import { useTaskStore } from '@/lib/store';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { useIsMobile } from '@/hooks/use-mobile';

const Index = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const { tasks } = useTaskStore();
  const isMobile = useIsMobile();
  
  const tasksForSelectedDate = date 
    ? tasks.filter(task => 
        task.dueDate && 
        format(new Date(task.dueDate), 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
      )
    : [];
  
  return (
    <div className="min-h-screen bg-background text-foreground pb-16">
      <Navbar />
      
      <main className="container max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        <SignedIn>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 space-y-8">
              <div id="add-task-section" className="scroll-mt-20 animate-slide-down" style={{animationDelay: '0.1s'}}>
                <AddTaskForm />
              </div>
              
              <div id="tasks-section" className="scroll-mt-20 animate-slide-up" style={{animationDelay: '0.2s'}}>
                <TaskList />
              </div>
              
              <div id="calendar-section" className="scroll-mt-20 space-y-4 animate-slide-up" style={{animationDelay: '0.3s'}}>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <h2 className="text-xl font-semibold tracking-tight flex items-center">
                    <CalendarRange className="mr-2 h-5 w-5 text-primary animate-bounce-slow" />
                    Calendar
                  </h2>
                </div>
                
                <div className="bg-card border border-border rounded-xl p-4 shadow-subtle hover-lift glass-card">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className={isMobile ? "flex justify-center" : ""}>
                      <Calendar 
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        className={`rounded-md border ${isMobile ? "w-full" : "w-full"} hover-scale`}
                      />
                    </div>
                    
                    <div className="space-y-4">
                      <h3 className="font-medium flex items-center">
                        <Star className="mr-2 h-4 w-4 fill-amber-500 text-amber-500" />
                        Tasks for {date ? format(date, 'MMMM d, yyyy') : 'Selected Date'}
                      </h3>
                      
                      {tasksForSelectedDate.length > 0 ? (
                        <div className="space-y-2 max-h-[300px] overflow-y-auto">
                          {tasksForSelectedDate.map((task, index) => (
                            <div 
                              key={task.id}
                              className={`p-3 rounded-md border ${
                                task.completed 
                                  ? 'bg-secondary/30 border-secondary line-through text-muted-foreground' 
                                  : 'bg-background border-border'
                              } hover-lift animate-fade-in`}
                              style={{animationDelay: `${index * 0.1}s`}}
                            >
                              <div className="flex items-center gap-2">
                                <div className={`w-2 h-2 rounded-full ${
                                  task.priority === 'high' 
                                    ? 'bg-red-500' 
                                    : task.priority === 'medium' 
                                      ? 'bg-amber-500' 
                                      : 'bg-green-500'
                                }`} />
                                <span>{task.title}</span>
                                {task.dueTime && (
                                  <span className="text-xs text-muted-foreground ml-2">
                                    at {task.dueTime}
                                  </span>
                                )}
                                {task.priority === 'high' && (
                                  <Badge variant="destructive" className="ml-auto text-[10px] py-0">High Priority</Badge>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="py-8 text-center text-muted-foreground">
                          No tasks scheduled for this date
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="lg:col-span-4 space-y-8">
              <div id="daily-section" className="scroll-mt-20 animate-slide-down" style={{animationDelay: '0.4s'}}>
                <DailyChecklist />
              </div>
            </div>
          </div>
        </SignedIn>
        
        <SignedOut>
          <div className="max-w-3xl mx-auto text-center">
            <div className="space-y-6 py-12 animate-fade-in">
              <div className="flex justify-center mb-4">
                <Sparkles className="h-14 w-14 text-primary animate-float" />
              </div>
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-pink-500">
                Organize your tasks with T-List
              </h1>
              <p className="text-lg text-muted-foreground">
                The simple, powerful way to manage your tasks and daily routines.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
                <SignUpButton mode="modal">
                  <button className="inline-flex items-center justify-center rounded-lg px-5 py-3 font-medium bg-primary text-primary-foreground hover:bg-primary/90 shadow-md transition-colors duration-200 hover-lift">
                    <UserPlus className="mr-2 h-5 w-5" />
                    Create an account
                  </button>
                </SignUpButton>
                
                <SignInButton mode="modal">
                  <button className="inline-flex items-center justify-center rounded-lg px-5 py-3 font-medium border border-input bg-background hover:bg-secondary/50 transition-colors duration-200 hover-lift">
                    <LogIn className="mr-2 h-5 w-5" />
                    Sign in
                  </button>
                </SignInButton>
              </div>
              
              <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="p-6 rounded-xl border border-border bg-card shadow-sm hover-lift animate-slide-up glass-card" style={{animationDelay: '0.2s'}}>
                  <div className="flex justify-center mb-4">
                    <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
                      <ListTodo className="h-6 w-6" />
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Personal Tasks</h3>
                  <p className="text-muted-foreground">Keep track of all your personal tasks and organize them by priority.</p>
                </div>
                
                <div className="p-6 rounded-xl border border-border bg-card shadow-sm hover-lift animate-slide-up glass-card" style={{animationDelay: '0.3s'}}>
                  <div className="flex justify-center mb-4">
                    <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                      <CheckCircle className="h-6 w-6" />
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Daily Checklists</h3>
                  <p className="text-muted-foreground">Create daily routines and habits with reusable checklists.</p>
                </div>
                
                <div className="p-6 rounded-xl border border-border bg-card shadow-sm hover-lift animate-slide-up glass-card" style={{animationDelay: '0.4s'}}>
                  <div className="flex justify-center mb-4">
                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                      <CalendarRange className="h-6 w-6" />
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Calendar View</h3>
                  <p className="text-muted-foreground">Visualize your tasks on a calendar to plan your schedule effectively.</p>
                </div>
              </div>
            </div>
          </div>
        </SignedOut>
      </main>
    </div>
  );
};

export default Index;
