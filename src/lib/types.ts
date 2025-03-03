
export type Priority = 'low' | 'medium' | 'high';

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  createdAt: Date;
  dueDate?: Date;
  dueTime?: string; // New field for the time
  priority: Priority;
  description?: string;
  category?: string;
  userId?: string; // Owner of the task
  groupId?: string; // Keep for backward compatibility
}

export interface DailyTask {
  id: string;
  title: string;
  completed: boolean;
  userId?: string;
}

export interface Category {
  id: string;
  name: string;
  color?: string;
  userId?: string;
}

export type TaskListView = 'all' | 'active' | 'completed';
