# 📋 DEPLOY VAQTIDA QILISHLAR (Keyinroq)

Bu ro'yxatni **ilovani real serverga chiqarishdan oldin** va **foydalanuvchilar ko'payganda** bajarish uchun saqlang.

---

## 1. Backend va ma'lumotlar bazasi

- **Firebase** yoki **Supabase** loyihani yarating.
- **Firestore/DB** jadval yoki collection lar:
  - `users` — name, phone, username, password (hash), category, plan (30 kunlik reja), weightHistory, progressPhotos, messages
  - `recipes`, `exercises`, `products` — admin qo'shadigan kontent
  - `purchases` — sotuvlar (keyinroq to'lov qo'shilganda)
- **Storage** — foydalanuvchi va admin yuklaydigan rasmlar (progress foto, retsept rasmi va h.k.).
- **Environment:** `.env` da `VITE_FIREBASE_*` yoki `VITE_SUPABASE_*` o'zgaruvchilarini qo'ying; **hech qachon** API kalitlarni kod ichiga yozmang.

---

## 2. Login / parol (kirish)

- **Demo** `user/user` va `admin/admin` ni olib tashlang.
- **Haqiqiy auth:** Firebase Auth yoki Supabase Auth ishlatib:
  - Login: **username** (yoki telefon) + **parol**
  - Parolni **hash** qilib saqlang (bcrypt yoki Firebase/Supabase o'zi qiladi).
- Foydalanuvchi **ro'yxatdan o'tadi** → siz bilan bog'lanadi → siz **login + parol** berasiz → **30 kunlik reja** (trenerlik + ovqatlanish) shu user ga **biriktiriladi** (DB da `users/{userId}.plan` yoki shunga o'xshash).

---

## 3. Admin panel — foydalanuvchilar va reja biriktirish

- **Foydalanuvchilar ro'yxati:** Barcha ro'yxatdan o'tganlar (ism, telefon, login, holat).
- **Login/parol berish:** Admin yangi user uchun username va parol yaratadi yoki tahrirlaydi.
- **30 kunlik reja biriktirish:** Admin user ni tanlaydi → "30 kunlik trenerlik" va "30 kunlik ovqatlanish" rejasini tanlaydi (yoki yaratadi) → **Shu user ga biriktirish** (DB da saqlanadi). User kabinetga kirganda o'sha rejani ko'radi.
- Barcha buni **foydalanuvchiga qulay** qilib: aniq tugmalar, filtlar, qidiruv.

---

## 4. To'lov (Marketplace)

- **Click** va/yoki **Payme** integratsiya qiling.
- Mahsulot sotilganda: `purchases` jadvaliga yozuv, user ga "Xarid qilindi" / download link.
- Admin da: sotuvlar ro'yxati, status (pending / completed / failed).

---

## 5. Mobil ilova (React Native / Expo)

- **BLUEPRINT.md** dagi qadamlarni bajarish.
- Push bildirishnomalar (kunlik ovqat/mashq eslatmasi), kamera (progress foto), Telegram video embed.

---

## 6. Deploy (veb sayt)

- **Hosting:** Vercel, Netlify yoki boshqa static/Vite qo'llab-quvvatlovchi.
- **Build:** `npm run build` → `dist` papkani yuklash.
- **Environment:** Production da `.env` o'rniga hosting ning "Environment variables" dan `VITE_*` larni kiriting.
- **Domain:** Kerak bo'lsa custom domain ulash.

---

## 7. Xavfsizlik

- API kalitlar faqat server/env da; brauzerda faqat public (masalan Firebase config) chiqishi mumkin.
- Admin panel faqat **admin** rolidagi user lar uchun ochiq bo'lsin (auth da role tekshiruv).

---

**Qisqacha:** Avval backend + auth + admin (foydalanuvchilar + reja biriktirish), keyin to'lov, keyin mobil. Deploy da env o'zgaruvchilar va xavfsizlikni unutmang.
