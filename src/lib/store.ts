
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Task, DailyTask, TaskListView, Priority, Category } from './types';
import { v4 as uuidv4 } from 'uuid';

interface TaskState {
  tasks: Task[];
  dailyTasks: DailyTask[];
  categories: Category[];
  activeView: TaskListView;
  activeCategory: string | null;
  
  // Task actions
  addTask: (title: string, priority?: Priority, dueDate?: Date, dueTime?: string, description?: string, category?: string) => void;
  updateTask: (id: string, updates: Partial<Omit<Task, 'id' | 'createdAt'>>) => void;
  removeTask: (id: string) => void;
  toggleTaskCompletion: (id: string) => void;
  
  // Daily task actions
  addDailyTask: (title: string) => void;
  removeDailyTask: (id: string) => void;
  toggleDailyTaskCompletion: (id: string) => void;
  resetDailyTasks: () => void;
  
  // Category actions
  addCategory: (name: string, color?: string) => string; // Return ID of created category
  removeCategory: (id: string) => void;
  
  // View actions
  setActiveView: (view: TaskListView) => void;
  setActiveCategory: (categoryId: string | null) => void;
}

export const useTaskStore = create<TaskState>()(
  persist(
    (set) => ({
      tasks: [],
      dailyTasks: [],
      categories: [],
      activeView: 'all',
      activeCategory: null,
      
      // Task actions
      addTask: (title, priority = 'medium', dueDate, dueTime, description, category) => set((state) => ({
        tasks: [
          ...state.tasks,
          {
            id: uuidv4(),
            title,
            completed: false,
            createdAt: new Date(),
            dueDate,
            dueTime,
            priority,
            description,
            category,
          },
        ],
      })),
      
      updateTask: (id, updates) => set((state) => ({
        tasks: state.tasks.map((task) =>
          task.id === id ? { ...task, ...updates } : task
        ),
      })),
      
      removeTask: (id) => set((state) => ({
        tasks: state.tasks.filter((task) => task.id !== id),
      })),
      
      toggleTaskCompletion: (id) => set((state) => ({
        tasks: state.tasks.map((task) =>
          task.id === id ? { ...task, completed: !task.completed } : task
        ),
      })),
      
      // Daily task actions
      addDailyTask: (title) => set((state) => ({
        dailyTasks: [
          ...state.dailyTasks,
          {
            id: uuidv4(),
            title,
            completed: false,
          },
        ],
      })),
      
      removeDailyTask: (id) => set((state) => ({
        dailyTasks: state.dailyTasks.filter((task) => task.id !== id),
      })),
      
      toggleDailyTaskCompletion: (id) => set((state) => ({
        dailyTasks: state.dailyTasks.map((task) =>
          task.id === id ? { ...task, completed: !task.completed } : task
        ),
      })),
      
      resetDailyTasks: () => set((state) => ({
        dailyTasks: state.dailyTasks.map((task) => ({ ...task, completed: false })),
      })),
      
      // Category actions
      addCategory: (name, color) => {
        const id = uuidv4();
        set((state) => ({
          categories: [
            ...state.categories,
            {
              id,
              name,
              color: color || `#${Math.floor(Math.random()*16777215).toString(16)}`,
            },
          ],
        }));
        return id; // Return the newly created category ID
      },
      
      removeCategory: (id) => set((state) => ({
        categories: state.categories.filter((category) => category.id !== id),
        // Clear category from tasks that used this category
        tasks: state.tasks.map(task => 
          task.category === id ? { ...task, category: undefined } : task
        ),
        // Reset activeCategory if it was the deleted one
        activeCategory: state.activeCategory === id ? null : state.activeCategory,
      })),
      
      // View actions
      setActiveView: (view) => set(() => ({ activeView: view })),
      setActiveCategory: (categoryId) => set(() => ({ activeCategory: categoryId })),
    }),
    {
      name: 'tlist-storage',
    }
  )
);
