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
  progress: number; // 0-100
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

// Yangi Shablon turi
export interface PlanTemplate {
  id: string;
  name: string; // Masalan: "Vazn yo'qotish (70-100kg)"
  description: string;
  days: DailyPlan[]; // 30 kunlik tayyor reja
}

export interface DailyPlan {
  day: number;
  meals: Task[];
  exercises: Task[];
  videoUrl?: string; // Telegram Post Link (e.g. https://t.me/channel/123)
  isCompleted: boolean;
  motivationalMessage?: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  type: 'meal' | 'exercise';
  meta?: string; // Kkal yoki vaqt
  time?: string;
  videoUrl?: string; // Telegram Post Link (e.g. https://t.me/channel/123)
  imageUrl?: string; // Retsept rasmi (Admin yuklaydi)
  proofImage?: string; // User yuklagan isbot rasmi
  proofTimestamp?: string;
  status?: 'pending' | 'approved' | 'rejected';
  instructions?: string[];
}

export interface StatData {
  name: string;
  value: number;
}

// Recipe Types
export interface Recipe {
  id: string;
  name: string;
  description: string;
  category: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  prepTime: number; // minutes
  cookTime: number;
  servings: number;
  difficulty: 'easy' | 'medium' | 'hard';
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  imageUrl?: string;
  videoUrl?: string;
  ingredients: Ingredient[];
  instructions: string[];
  tags: string[];
  createdBy: string; // admin id
  createdAt: string;
  isFavorite?: boolean;
}

export interface Ingredient {
  id: string;
  name: string;
  amount: number;
  unit: string;
  category?: 'protein' | 'carbs' | 'vegetables' | 'dairy' | 'spices' | 'other';
}

// Progress Photos
export interface ProgressPhoto {
  id: string;
  userId: string;
  date: string;
  imageUrl: string;
  weight: number;
  notes?: string;
  measurements?: BodyMeasurement;
}

export interface BodyMeasurement {
  chest?: number;
  waist?: number;
  hips?: number;
  arms?: number;
  thighs?: number;
}

// Workout Library
export interface Exercise {
  id: string;
  name: string;
  description: string;
  muscleGroup: 'chest' | 'back' | 'legs' | 'shoulders' | 'arms' | 'core' | 'cardio' | 'full-body';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  equipment: string[];
  videoUrl?: string;
  imageUrl?: string;
  instructions: string[];
  sets?: number;
  reps?: string;
  duration?: number; // seconds for cardio
  calories?: number;
  createdBy: string;
  tags: string[];
}

export interface WorkoutPlan {
  id: string;
  name: string;
  description: string;
  exercises: {
    exerciseId: string;
    sets: number;
    reps: string;
    restTime: number;
    notes?: string;
  }[];
  totalDuration: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  createdBy: string;
}

// Marketplace
export interface Product {
  id: string;
  name: string;
  description: string;
  type: 'ebook' | 'video-course' | 'meal-plan' | 'workout-plan' | 'supplement';
  price: number;
  currency: 'UZS' | 'USD';
  imageUrl: string;
  previewImages?: string[];
  features: string[];
  downloadUrl?: string; // for digital products
  videoPreviewUrl?: string;
  rating?: number;
  reviews?: number;
  isPurchased?: boolean;
  createdAt: string;
}

export interface Purchase {
  id: string;
  userId: string;
  productId: string;
  amount: number;
  currency: string;
  paymentMethod: 'click' | 'payme' | 'payze' | 'cash';
  status: 'pending' | 'completed' | 'failed';
  purchasedAt: string;
}