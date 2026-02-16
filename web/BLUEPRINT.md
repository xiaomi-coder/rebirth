# 🚀 QAYTA TUG'ILISH - MOBILE APP BLUEPRINT

**Version:** 2.0 - Complete Feature Set  
**Target:** React Native (iOS + Android)  
**Current Stack:** React + TypeScript + Vite (Web)  
**Migration to:** React Native + Expo + TypeScript

---

## 📋 PROJECT OVERVIEW

**Qayta Tug'ilish** - bu professional fitness va weight loss ilovasi bo'lib, quyidagi asosiy funksiyalarga ega:

### **Core Features:**
1. ✅ **Daily Meal & Workout Planning** - Kundalik ovqat va mashq rejasi
2. ✅ **Progress Tracking** - Vazn, foto va body measurements
3. ✅ **Recipe Library** - 100+ retseptlar kutubxonasi + Shopping List
4. ✅ **Workout Library** - Mashqlar kutubxonasi (video instruction)
5. ✅ **Marketplace** - Digital mahsulotlar sotish (e-books, courses, plans)
6. ✅ **Admin Panel** - Trainer uchun full control panel
7. ✅ **Real-time Chat** - User <-> Trainer chat
8. ✅ **Telegram Integration** - Video posts embedding

---

## 🎯 MIGRATION STRATEGY

### **Phase 1: Setup & Foundation (Week 1)**
```bash
# 1. Initialize Expo Project
npx create-expo-app@latest qayta-tugil

ish --template expo-template-blank-typescript

# 2. Install Core Dependencies
npm install @react-navigation/native @react-navigation/stack
npm install react-native-screens react-native-safe-area-context
npm install react-native-gesture-handler react-native-reanimated
npm install @react-native-async-storage/async-storage
npm install axios react-query
npm install zustand # State management
npm install react-native-svg # Icons
npm install expo-image-picker expo-camera
npm install expo-notifications
npm install @shopify/flash-list # Optimized lists
```

### **Phase 2: Backend Integration (Week 2)**
Sizga **3 ta variant**:

#### **Option A: Firebase (Tavsiya)**
```bash
npm install firebase @react-native-firebase/app @react-native-firebase/firestore
npm install @react-native-firebase/auth @react-native-firebase/storage
```

**Firebase Structure:**
```
/users/{userId}
  - name, phone, category, startDate, currentDay, streak, progress
  - weight, height, goalWeight, age
  - plan[] (30 kunlik reja)
  - weightHistory[]
  - messages[]
  - progressPhotos[]

/recipes/{recipeId}
  - name, description, category, prepTime, cookTime, servings
  - calories, protein, carbs, fats
  - ingredients[], instructions[], tags[]
  - imageUrl, videoUrl, createdBy

/exercises/{exerciseId}
  - name, description, muscleGroup, difficulty
  - videoUrl, imageUrl, instructions[]
  - sets, reps, duration, calories

/products/{productId}
  - name, description, type, price, currency
  - imageUrl, features[], downloadUrl

/purchases/{purchaseId}
  - userId, productId, amount, status, purchasedAt

/chats/{chatId}/messages/{messageId}
  - text, sender, timestamp, isRead
```

#### **Option B: Supabase**
```bash
npm install @supabase/supabase-js
```

#### **Option C: Custom Backend (Node.js + PostgreSQL)**
```bash
# Express + Prisma + PostgreSQL
npm install express prisma @prisma/client
npm install jsonwebtoken bcrypt
```

### **Phase 3: UI Components (Week 2-3)**

**Component Hierarchy:**
```
App.tsx
├── Navigation/
│   ├── AuthNavigator.tsx
│   ├── MainNavigator.tsx (BottomTabs)
│   └── AdminNavigator.tsx
├── Screens/
│   ├── Auth/
│   │   ├── LoginScreen.tsx
│   │   └── RegisterScreen.tsx
│   ├── User/
│   │   ├── HomeScreen.tsx (Daily Plan)
│   │   ├── RecipesScreen.tsx
│   │   ├── ProgressScreen.tsx
│   │   ├── WorkoutScreen.tsx
│   │   ├── MarketplaceScreen.tsx
│   │   ├── ProfileScreen.tsx
│   │   └── ChatScreen.tsx
│   └── Admin/
│       ├── AdminDashboard.tsx
│       ├── UsersManagement.tsx
│       ├── ContentEditor.tsx
│       ├── TemplateEditor.tsx
│       └── AnalyticsScreen.tsx
├── Components/
│   ├── Shared/
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Input.tsx
│   │   └── Modal.tsx
│   ├── Recipe/
│   │   ├── RecipeCard.tsx
│   │   ├── RecipeDetail.tsx
│   │   └── ShoppingList.tsx
│   ├── Workout/
│   │   ├── ExerciseCard.tsx
│   │   ├── ExerciseDetail.tsx
│   │   └── WorkoutPlayer.tsx
│   └── Progress/
│       ├── PhotoTimeline.tsx
│       ├── WeightChart.tsx
│       └── MeasurementTracker.tsx
└── Services/
    ├── api/
    │   ├── auth.ts
    │   ├── users.ts
    │   ├── recipes.ts
    │   ├── workouts.ts
    │   └── products.ts
    ├── storage/
    │   ├── imageUpload.ts
    │   └── asyncStorage.ts
    └── notifications/
        └── pushNotifications.ts
```

### **Phase 4: Native Features (Week 3-4)**

#### **Camera & Image Picker**
```typescript
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';

// Progress Photo Upload
const takePhoto = async () => {
  const result = await ImagePicker.launchCameraAsync({
    quality: 0.8,
    allowsEditing: true,
    aspect: [3, 4]
  });
  
  if (!result.canceled) {
    const uploadUrl = await uploadToStorage(result.assets[0].uri);
    saveProgressPhoto(uploadUrl);
  }
};
```

#### **Push Notifications**
```typescript
import * as Notifications from 'expo-notifications';

// Schedule Daily Reminders
await Notifications.scheduleNotificationAsync({
  content: {
    title: "Nonushta vaqti!",
    body: "Bugungi ovqat rejangizni ko'ring",
    data: { screen: 'Home' }
  },
  trigger: {
    hour: 8,
    minute: 0,
    repeats: true
  }
});
```

#### **Video Player (Telegram Integration)**
```typescript
import { WebView } from 'react-native-webview';

// Telegram Post Embed
<WebView
  source={{ uri: `https://t.me/channel_name/post_id?embed=1` }}
  style={{ height: 400 }}
  allowsInlineMediaPlayback
/>
```

### **Phase 5: Payment Integration (Week 4)**

#### **Uzbekistan Payment Gateways:**
```typescript
// Click.uz Integration
const clickPay = async (amount: number, productId: string) => {
  const response = await fetch('https://my.click.uz/services/pay', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      merchant_id: CLICK_MERCHANT_ID,
      amount: amount,
      order_id: productId,
      return_url: 'qayta://payment/success'
    })
  });
  // Handle response
};

// Payme Integration
const paymePay = async (amount: number, productId: string) => {
  // Similar implementation for Payme
};
```

---

## 🎨 UI/UX DESIGN PRINCIPLES

### **Color Palette:**
```typescript
const colors = {
  // Primary
  primary: '#10B981', // Emerald
  primaryDark: '#059669',
  
  // Secondary
  secondary: '#F59E0B', // Amber
  secondaryDark: '#D97706',
  
  // Accent
  accent: {
    purple: '#8B5CF6',
    pink: '#EC4899',
    red: '#EF4444',
    blue: '#3B82F6'
  },
  
  // Neutral (Dark Mode)
  background: '#000000',
  surface: '#1F1F1F',
  surfaceLight: '#2A2A2A',
  border: '#404040',
  
  // Text
  textPrimary: '#FFFFFF',
  textSecondary: '#A3A3A3',
  textDisabled: '#525252'
};
```

### **Typography:**
```typescript
const typography = {
  // Headings - Use Montserrat or Poppins
  h1: { fontSize: 32, fontWeight: '800', letterSpacing: -0.5 },
  h2: { fontSize: 24, fontWeight: '700' },
  h3: { fontSize: 20, fontWeight: '600' },
  
  // Body - Use Inter or System Font
  body: { fontSize: 16, fontWeight: '400', lineHeight: 24 },
  bodySmall: { fontSize: 14, fontWeight: '400', lineHeight: 20 },
  
  // Special
  button: { fontSize: 16, fontWeight: '600', letterSpacing: 0.5 },
  caption: { fontSize: 12, fontWeight: '500' }
};
```

### **Component Styling:**
```typescript
// Card Component
<View style={{
  backgroundColor: colors.surface,
  borderRadius: 24,
  padding: 16,
  borderWidth: 1,
  borderColor: colors.border,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.3,
  shadowRadius: 8,
  elevation: 5
}}>

// Button Component
<TouchableOpacity style={{
  backgroundColor: colors.primary,
  borderRadius: 16,
  paddingVertical: 16,
  paddingHorizontal: 24,
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  shadowColor: colors.primary,
  shadowOffset: { width: 0, height: 8 },
  shadowOpacity: 0.3,
  shadowRadius: 12,
  elevation: 8
}}>
```

---

## 🔥 PERFORMANCE OPTIMIZATION

### **1. Image Optimization**
```typescript
import { Image } from 'expo-image';

// Use Expo Image instead of React Native Image
<Image
  source={{ uri: imageUrl }}
  contentFit="cover"
  transition={200}
  cachePolicy="memory-disk"
/>
```

### **2. List Optimization**
```typescript
import { FlashList } from '@shopify/flash-list';

// Use FlashList instead of FlatList
<FlashList
  data={recipes}
  estimatedItemSize={200}
  renderItem={({ item }) => <RecipeCard recipe={item} />}
/>
```

### **3. Code Splitting & Lazy Loading**
```typescript
// Lazy load screens
const RecipesScreen = lazy(() => import('./screens/RecipesScreen'));
const WorkoutScreen = lazy(() => import('./screens/WorkoutScreen'));
```

---

## 🚀 DEPLOYMENT

### **iOS Deployment:**
```bash
# 1. Configure app.json
{
  "expo": {
    "name": "Qayta Tug'ilish",
    "slug": "qayta-tugilish",
    "version": "1.0.0",
    "ios": {
      "bundleIdentifier": "uz.qayta.tugilish",
      "supportsTablet": true,
      "infoPlist": {
        "NSCameraUsageDescription": "Progress foto uchun kamera kerak",
        "NSPhotoLibraryUsageDescription": "Foto yuklash uchun ruxsat kerak"
      }
    }
  }
}

# 2. Build
eas build --platform ios

# 3. Submit to App Store
eas submit -p ios
```

### **Android Deployment:**
```bash
# 1. Configure app.json
{
  "android": {
    "package": "uz.qayta.tugilish",
    "versionCode": 1,
    "permissions": [
      "CAMERA",
      "READ_EXTERNAL_STORAGE",
      "WRITE_EXTERNAL_STORAGE",
      "NOTIFICATIONS"
    ]
  }
}

# 2. Build
eas build --platform android

# 3. Submit to Google Play
eas submit -p android
```

---

## 📊 ANALYTICS & MONITORING

```typescript
// Firebase Analytics
import analytics from '@react-native-firebase/analytics';

// Track screens
await analytics().logScreenView({
  screen_name: 'RecipesScreen',
  screen_class: 'RecipesScreen'
});

// Track events
await analytics().logEvent('recipe_viewed', {
  recipe_id: recipeId,
  recipe_name: recipeName
});

// Track purchases
await analytics().logPurchase({
  value: price,
  currency: 'UZS',
  items: [{ item_id: productId }]
});
```

---

## 🔐 SECURITY BEST PRACTICES

1. **Never store API keys in code**
```typescript
import Constants from 'expo-constants';
const API_KEY = Constants.expoConfig?.extra?.apiKey;
```

2. **Secure storage for tokens**
```typescript
import * as SecureStore from 'expo-secure-store';

await SecureStore.setItemAsync('authToken', token);
const token = await SecureStore.getItemAsync('authToken');
```

3. **Input validation**
```typescript
import * as yup from 'yup';

const loginSchema = yup.object({
  email: yup.string().email().required(),
  password: yup.string().min(8).required()
});
```

---

## 📝 TESTING STRATEGY

```bash
# Unit Tests
npm install --save-dev jest @testing-library/react-native

# E2E Tests
npm install --save-dev detox

# Run tests
npm test
detox test --configuration ios.sim.debug
```

---

## 🎓 LEARNING RESOURCES

- React Native Docs: https://reactnative.dev
- Expo Docs: https://docs.expo.dev
- React Navigation: https://reactnavigation.org
- Firebase for React Native: https://rnfirebase.io

---

## 💡 CURSOR AI PROMPTS

Cursorga quyidagi promptlarni bering:

```
1. "Convert this React web component to React Native using best practices"

2. "Implement Firebase authentication with phone number verification for Uzbekistan"

3. "Create an optimized recipe list screen with infinite scroll and search"

4. "Add progress photo timeline with before/after comparison slider"

5. "Implement Click.uz payment gateway integration"

6. "Create workout video player with Telegram embed support"

7. "Add push notifications for daily meal and workout reminders"

8. "Optimize image loading and caching for progress photos"

9. "Create admin dashboard with user management and analytics"

10. "Implement offline-first architecture with local database sync"
```

---

## ✅ FINAL CHECKLIST

- [ ] Firebase/Supabase backend setup
- [ ] Authentication (phone + password)
- [ ] User profile & onboarding
- [ ] Daily meal & workout plan
- [ ] Recipe library with search & filters
- [ ] Shopping list functionality
- [ ] Progress photos timeline
- [ ] Weight & measurements tracking
- [ ] Workout library with videos
- [ ] Marketplace & payments
- [ ] Real-time chat
- [ ] Push notifications
- [ ] Admin panel
- [ ] Template system for trainers
- [ ] Analytics dashboard
- [ ] Offline support
- [ ] Image compression & upload
- [ ] App icon & splash screen
- [ ] App Store / Play Store listing
- [ ] Privacy policy & terms
- [ ] Beta testing (TestFlight / Internal Testing)

---

## 🎉 SUCCESS CRITERIA

**Launch Metrics:**
- App size: < 50MB
- Cold start: < 2s
- Screen transitions: < 300ms
- Image loading: < 500ms
- Crash-free rate: > 99.5%
- User rating: > 4.5 stars

**User Engagement:**
- Daily active users: Track with Firebase Analytics
- Retention (Day 1): > 40%
- Retention (Day 7): > 20%
- Retention (Day 30): > 10%
- Average session length: > 5 minutes
- Purchase conversion: > 5%

---

**Good Luck! 🚀**

Bu blueprint sizga to'liq yo'l-yo'riq beradi. Har bir qadamda Cursor AI dan yordam so'rang va yuqoridagi promptlardan foydalaning.
