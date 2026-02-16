# Qayta Tug'ilish — Mobile (React Native + Expo)

**Android** va **iOS** uchun professional ilova. Expo (React Native) asosida.

## Ishga tushirish

```bash
npm install
npm start
```

Keyin:
- **Android:** `a` bosing yoki `npm run android` (emulator/device)
- **iOS:** `i` bosing yoki `npm run ios` (faqat macOS)
- **Expo Go:** Telefonda Expo Go ilovasini oching va QR kodni skanerlang

## Loyiha tuzilishi

- `App.tsx` — Navigation (Login → Home)
- `screens/LoginScreen.tsx` — Kirish (username / parol)
- `screens/HomeScreen.tsx` — Asosiy ekran (keyinroq reja, retseptlar, progress)
- `theme/colors.ts` — Ranglar (web BLUEPRINT ga mos)

## Demo kirish

- **User:** `user` / `user`
- **Admin:** `admin` / `admin`

## Keyingi qadamlar (BLUEPRINT.md bo'yicha)

- Bottom tabs: Reja, Retseptlar, Progress, Mashqlar, Do'kon, Profil
- Kunlik reja va ovqat/mashq ro'yxati
- Progress fotolar (expo-image-picker)
- Telegram video embed (WebView)
- Push bildirishnomalar
- Backend (Firebase/Supabase) ulash

## Build (APK / AAB / IPA)

```bash
npx eas build --platform android
npx eas build --platform ios
```

(EAS uchun `eas.json` sozlash va Expo account kerak.)
