import { User, DailyPlan, Task, PlanTemplate } from './types';

// Asoschi (trener) surati — public/trainer.png
export const HERO_IMAGE = "/trainer.png";
export const TRAINER_IMAGE = "/trainer.png";

export const MOCK_TRANSFORMATIONS = [
  {
    id: 1,
    before: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500&h=500&fit=crop",
    after: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=500&h=500&fit=crop",
    caption: "110 kg → 85 kg",
    name: "Azizbek",
  },
  {
    id: 2,
    before: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=500&h=500&fit=crop",
    after: "https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?w=500&h=500&fit=crop",
    caption: "95 kg → 70 kg",
    name: "Malika",
  },
  {
    id: 3,
    before: "https://images.unsplash.com/photo-1518310383802-640c2de311b2?w=500&h=500&fit=crop",
    after: "https://images.unsplash.com/photo-1518644730709-0835105d9daa?w=500&h=500&fit=crop",
    caption: "130 kg → 98 kg",
    name: "Jamshid",
  },
];

const generatePlanDays = (days: number): DailyPlan[] => {
  return Array.from({ length: days }, (_, i) => ({
    day: i + 1,
    isCompleted: i < 5,
    motivationalMessage: "Bugun o'zingizni engishingiz kerak!",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    meals: [
      { 
        id: `m-${i}-1`, title: "Nonushta", description: "Ovsianka suvda, 2 tuxum.", completed: i < 5, type: 'meal', meta: "400 kkal", time: "08:00", status: i < 5 ? 'approved' : 'pending',
        proofImage: i < 5 ? "https://images.unsplash.com/photo-1494390248081-4e521a5940db?w=200" : undefined 
      },
      { id: `m-${i}-2`, title: "Tushlik", description: "Tovuq filesi, grechka.", completed: i < 5, type: 'meal', meta: "600 kkal", time: "13:00", status: 'pending' },
      { id: `m-${i}-3`, title: "Kechki ovqat", description: "Tvorog, olma.", completed: i < 5, type: 'meal', meta: "300 kkal", time: "19:00" },
    ],
    exercises: [
      { 
        id: `e-${i}-1`, title: "Yugurish", description: "30 daqiqa yugurish.", completed: i < 5, type: 'exercise', meta: "30 daqiqa", 
        videoUrl: "https://www.youtube.com/embed/ml6cT4AZdqI" 
      },
    ]
  }));
};

// MOCK TEMPLATES (Shablonlar)
export const MOCK_TEMPLATES: PlanTemplate[] = [
  {
    id: 'tpl-1',
    name: "Vazn yo'qotish (Standard)",
    description: "70kg dan 100kg gacha bo'lganlar uchun 30 kunlik intensiv dastur.",
    days: generatePlanDays(30)
  },
  {
    id: 'tpl-2',
    name: "Mushak yig'ish (Erkaklar)",
    description: "Protein va kuch mashqlariga boy 30 kunlik dastur.",
    days: generatePlanDays(30)
  }
];

export const MOCK_USER: User = {
  id: 'u1',
  name: 'Bekzod Aliyev',
  category: '100-150',
  startDate: '2023-10-01',
  currentDay: 6,
  streak: 5,
  progress: 20,
  plan: JSON.parse(JSON.stringify(MOCK_TEMPLATES[0].days)), // Copying template days
  weight: 105,
  height: 178,
  goalWeight: 85,
  age: 26,
  phone: '+998 90 123 45 67',
  username: 'user',
  password: 'user',
  weightHistory: [
    { date: '01 Okt', weight: 110 },
    { date: '05 Okt', weight: 108.5 },
    { date: '10 Okt', weight: 107 },
    { date: '15 Okt', weight: 106.2 },
    { date: '20 Okt', weight: 105 },
  ],
  messages: [
    { id: '1', text: 'Assalomu alaykum', sender: 'user', time: '10:00' },
  ]
};

export const CONTACT_INFO = {
  instagram: "@farruxradjabov94",
  phone: "+998 91 448 97 97",
  /** Admin Telegram — arizalar shu profilga yuboriladi (t.me/...) */
  telegram: "farruxradjabov94",
};

// MOCK RECIPES
import { Recipe, Exercise, Product, ProgressPhoto } from './types';

export const MOCK_RECIPES: Recipe[] = [
  {
    id: 'r1',
    name: 'Protein Pancake',
    description: 'Yuqori oqsilli, past kaloriyali nonushta',
    category: 'breakfast',
    prepTime: 5,
    cookTime: 10,
    servings: 2,
    difficulty: 'easy',
    calories: 320,
    protein: 25,
    carbs: 35,
    fats: 8,
    imageUrl: 'https://images.unsplash.com/photo-1528207776546-365bb710ee93?w=800',
    ingredients: [
      { id: 'i1', name: 'Tuxum', amount: 2, unit: 'dona' },
      { id: 'i2', name: 'Ovsyanka', amount: 50, unit: 'g', category: 'carbs' },
      { id: 'i3', name: 'Protein kukuni', amount: 30, unit: 'g', category: 'protein' },
      { id: 'i4', name: 'Banan', amount: 1, unit: 'dona', category: 'carbs' },
    ],
    instructions: [
      'Barcha ingredientlarni blenderda aralashtiring',
      'Tovaga ozgina yog\' qo\'shing va qizdiring',
      'Aralashmadan kichik pancakelar quyib pishiring',
      'Har tomonini 2-3 daqiqa qovuring',
      'Meva va asal bilan xizmat qiling'
    ],
    tags: ['protein', 'breakfast', 'healthy'],
    createdBy: 'admin',
    createdAt: '2024-01-15',
    isFavorite: false
  },
  {
    id: 'r2',
    name: 'Tovuq Griliga',
    description: 'Classic protein manba',
    category: 'lunch',
    prepTime: 10,
    cookTime: 20,
    servings: 1,
    difficulty: 'easy',
    calories: 450,
    protein: 45,
    carbs: 30,
    fats: 12,
    imageUrl: 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=800',
    ingredients: [
      { id: 'i5', name: 'Tovuq ko\'kragi', amount: 200, unit: 'g', category: 'protein' },
      { id: 'i6', name: 'Guruch', amount: 100, unit: 'g', category: 'carbs' },
      { id: 'i7', name: 'Brokoli', amount: 150, unit: 'g', category: 'vegetables' },
      { id: 'i8', name: 'Zaytun moyi', amount: 1, unit: 'osh qoshiq', category: 'other' },
    ],
    instructions: [
      'Tovuq go\'shtini tuz va ziravor bilan marinatlang',
      'Grilda yoki tovada har tomonini 8-10 daqiqa pishiring',
      'Guruchni qaynatib tayyorlang',
      'Brokolini bug\'da 5 daqiqa pishiring',
      'Barcha ingredientlarni likopchalarga solib xizmat qiling'
    ],
    tags: ['protein', 'lunch', 'muscle-building'],
    createdBy: 'admin',
    createdAt: '2024-01-16'
  }
];

// MOCK EXERCISES
export const MOCK_EXERCISES: Exercise[] = [
  {
    id: 'ex1',
    name: 'Push-up (Zamindan ko\'tarilish)',
    description: 'Ko\'krak va qo\'l mushaklarini mustahkamlash',
    muscleGroup: 'chest',
    difficulty: 'beginner',
    equipment: [],
    instructions: [
      'Qo\'llaringizni yelka kengligida joylashtiring',
      'Tanangizni to\'g\'ri chiziqda tuting',
      'Ko\'kragingizni zaminga yaqinlashtiring',
      'Dastlabki holatga qaytib keling'
    ],
    sets: 3,
    reps: '10-15',
    calories: 50,
    videoUrl: 'https://t.me/gym_channel/101',
    imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800',
    createdBy: 'admin',
    tags: ['chest', 'arms', 'bodyweight']
  },
  {
    id: 'ex2',
    name: 'Squat (Cho\'kib-turish)',
    description: 'Oyoq mushaklarini kuchaytirish',
    muscleGroup: 'legs',
    difficulty: 'beginner',
    equipment: [],
    instructions: [
      'Oyoqlaringizni yelka kengligida oching',
      'Qo\'llaringizni oldingizda yoki ortingizda tuting',
      'Tizzalaringizni bukib cho\'king (90 daraja)',
      'Poshnalaringizni bosib turishga qayting'
    ],
    sets: 4,
    reps: '12-20',
    calories: 80,
    videoUrl: 'https://t.me/gym_channel/102',
    imageUrl: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=800',
    createdBy: 'admin',
    tags: ['legs', 'glutes', 'bodyweight']
  }
];

// MOCK PRODUCTS
export const MOCK_PRODUCTS: Product[] = [
  {
    id: 'p1',
    name: '30 Kunlik Intensiv Dastur',
    description: 'To\'liq reja: ovqatlanish + mashqlar + motivatsiya',
    type: 'meal-plan',
    price: 299000,
    currency: 'UZS',
    imageUrl: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800',
    features: [
      '30 kunlik ovqatlanish rejasi',
      '90+ retsept',
      'Shopping list',
      'Video mashqlar',
      'WhatsApp guruh'
    ],
    rating: 4.9,
    reviews: 124,
    createdAt: '2024-01-01',
    isPurchased: false
  },
  {
    id: 'p2',
    name: 'Uy Sharoitida Mashqlar',
    description: 'Zal uskunasiz 100+ mashq video kursi',
    type: 'video-course',
    price: 199000,
    currency: 'UZS',
    imageUrl: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800',
    features: [
      '100+ video dars',
      'Har xil darajalar',
      'Progressni kuzatish',
      'Umrbod kirish',
      'Sertifikat'
    ],
    rating: 4.8,
    reviews: 89,
    createdAt: '2024-01-05'
  }
];

// MOCK PROGRESS PHOTOS
export const MOCK_PROGRESS_PHOTOS: ProgressPhoto[] = [
  {
    id: 'ph1',
    userId: 'u1',
    date: '2024-01-01',
    imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400',
    weight: 110,
    notes: 'Boshlanish',
    measurements: {
      chest: 110,
      waist: 105,
      hips: 108
    }
  },
  {
    id: 'ph2',
    userId: 'u1',
    date: '2024-02-01',
    imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=400',
    weight: 105,
    notes: '1 oy natijasi - 5kg yo\'qotildi!',
    measurements: {
      chest: 108,
      waist: 100,
      hips: 105
    }
  }
];