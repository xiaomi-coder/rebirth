import { User, DailyPlan, Recipe, Exercise, ProgressPhoto, UserRole } from './types';

const generatePlanDays = (days: number): DailyPlan[] => {
  return Array.from({ length: days }, (_, i) => ({
    day: i + 1,
    isCompleted: i < 5,
    motivationalMessage: "Bugun o'zingizni engishingiz kerak!",
    meals: [
      { id: `m-${i}-1`, title: "Nonushta", description: "Ovsianka suvda, 2 tuxum.", completed: i < 5, type: 'meal' as const, meta: "400 kkal", time: "08:00" },
      { id: `m-${i}-2`, title: "Tushlik", description: "Tovuq filesi, grechka.", completed: i < 5, type: 'meal' as const, meta: "600 kkal", time: "13:00" },
      { id: `m-${i}-3`, title: "Kechki ovqat", description: "Tvorog, olma.", completed: i < 5, type: 'meal' as const, meta: "300 kkal", time: "19:00" },
    ],
    exercises: [
      { id: `e-${i}-1`, title: "Yugurish", description: "30 daqiqa yugurish.", completed: i < 5, type: 'exercise' as const, meta: "30 daqiqa" },
    ]
  }));
};

export const MOCK_USER: User = {
  id: 'u1',
  name: 'Bekzod Aliyev',
  category: 'Vazn yo\'qotish (Standard)',
  startDate: '2023-10-01',
  currentDay: 6,
  streak: 5,
  progress: 20,
  plan: generatePlanDays(30),
  weight: 105,
  height: 178,
  goalWeight: 85,
  age: 26,
  phone: '+998 90 123 45 67',
  username: 'user',
  password: 'user',
  role: UserRole.USER,
  isBlocked: false,
  weightHistory: [
    { date: '01 Okt', weight: 110 },
    { date: '05 Okt', weight: 108.5 },
    { date: '10 Okt', weight: 107 },
    { date: '15 Okt', weight: 106.2 },
    { date: '20 Okt', weight: 105 },
  ],
  messages: [],
};

export const MOCK_RECIPES: Recipe[] = [
  {
    id: 'r1', name: 'Protein Pancake', description: 'Yuqori oqsilli nonushta', category: 'breakfast',
    prepTime: 5, cookTime: 10, servings: 2, difficulty: 'easy', calories: 320, protein: 25, carbs: 35, fats: 8,
    imageUrl: 'https://images.unsplash.com/photo-1528207776546-365bb710ee93?w=800',
    ingredients: [
      { id: 'i1', name: 'Tuxum', amount: 2, unit: 'dona' },
      { id: 'i2', name: 'Ovsyanka', amount: 50, unit: 'g' },
      { id: 'i3', name: 'Protein kukuni', amount: 30, unit: 'g' },
      { id: 'i4', name: 'Banan', amount: 1, unit: 'dona' },
    ],
    instructions: ['Blenderda aralashtiring', 'Tovada pishiring', 'Har tomonini 2-3 daq qovuring', 'Meva bilan xizmat qiling'],
    tags: ['protein', 'breakfast'], createdBy: 'admin', createdAt: '2024-01-15', isFavorite: false,
  },
  {
    id: 'r2', name: 'Tovuq Griliga', description: 'Classic protein manba', category: 'lunch',
    prepTime: 10, cookTime: 20, servings: 1, difficulty: 'easy', calories: 450, protein: 45, carbs: 30, fats: 12,
    imageUrl: 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=800',
    ingredients: [
      { id: 'i5', name: 'Tovuq ko\'kragi', amount: 200, unit: 'g' },
      { id: 'i6', name: 'Guruch', amount: 100, unit: 'g' },
      { id: 'i7', name: 'Brokoli', amount: 150, unit: 'g' },
    ],
    instructions: ['Marinatlang', 'Grilda pishiring', 'Guruchni qaynatib tayyorlang', 'Barcha ingredientlarni likopchalarga soling'],
    tags: ['protein', 'lunch'], createdBy: 'admin', createdAt: '2024-01-16',
  },
];

export const MOCK_EXERCISES: Exercise[] = [
  {
    id: 'ex1', name: 'Push-up', description: 'Ko\'krak va qo\'l mushaklarini mustahkamlash',
    muscleGroup: 'chest', difficulty: 'beginner', equipment: [],
    instructions: ['Qo\'llarni yelka kengligida joylashtiring', 'Tanani to\'g\'ri tuting', 'Ko\'krakni zaminga yaqinlashtiring', 'Qaytib keling'],
    sets: 3, reps: '10-15', calories: 50,
    imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800',
    createdBy: 'admin', tags: ['chest', 'bodyweight'],
  },
  {
    id: 'ex2', name: 'Squat', description: 'Oyoq mushaklarini kuchaytirish',
    muscleGroup: 'legs', difficulty: 'beginner', equipment: [],
    instructions: ['Oyoqlarni yelka kengligida oching', 'Tizzalarni bukib cho\'king', 'Poshnalarni bosib turing'],
    sets: 4, reps: '12-20', calories: 80,
    imageUrl: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=800',
    createdBy: 'admin', tags: ['legs', 'bodyweight'],
  },
];

export const MOCK_PROGRESS_PHOTOS: ProgressPhoto[] = [
  { id: 'ph1', userId: 'u1', date: '2024-01-01', imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400', weight: 110, notes: 'Boshlanish' },
  { id: 'ph2', userId: 'u1', date: '2024-02-01', imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=400', weight: 105, notes: '1 oy natijasi - 5kg yo\'qotildi!' },
];

export const USERS_DB: User[] = [MOCK_USER];
