export enum UserRole {
  GUEST = 'guest',
  USER = 'user',
  ADMIN = 'admin',
  CREATOR = 'creator',
}

export interface User {
  id: string;
  name: string;
  category: string;
  startDate: string;
  currentDay: number;
  streak: number;
  progress: number;
  plan: DailyPlan[];
  weight: number;
  height: number;
  goalWeight: number;
  age: number;
  phone: string;
  weightHistory: { date: string; weight: number }[];
  messages: { id: string; text: string; sender: 'user' | 'admin'; time: string }[];
  username?: string;
  password?: string;
  role?: UserRole;
  isBlocked?: boolean;
}

export interface DailyPlan {
  day: number;
  meals: Task[];
  exercises: Task[];
  videoUrl?: string;
  isCompleted: boolean;
  motivationalMessage?: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  type: 'meal' | 'exercise';
  meta?: string;
  time?: string;
  videoUrl?: string;
  imageUrl?: string;
  proofImage?: string;
  proofTimestamp?: string;
  status?: 'pending' | 'approved' | 'rejected';
}

export interface Recipe {
  id: string;
  name: string;
  description: string;
  category: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  prepTime: number;
  cookTime: number;
  servings: number;
  difficulty: 'easy' | 'medium' | 'hard';
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  imageUrl?: string;
  ingredients: { id: string; name: string; amount: number; unit: string }[];
  instructions: string[];
  tags: string[];
  createdBy: string;
  createdAt: string;
  isFavorite?: boolean;
}

export interface Exercise {
  id: string;
  name: string;
  description: string;
  muscleGroup: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  equipment: string[];
  instructions: string[];
  sets?: number;
  reps?: string;
  calories?: number;
  videoUrl?: string;
  imageUrl?: string;
  createdBy: string;
  tags: string[];
}

export interface ProgressPhoto {
  id: string;
  userId: string;
  date: string;
  imageUrl: string;
  weight: number;
  notes?: string;
}
