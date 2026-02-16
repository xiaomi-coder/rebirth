# ✅ Keyinroq qilish kerak bo‘lganlar (siz aytganlar bo‘yicha)

**Bajarildi (hozir):** Retsept to‘liq ochish, Progress foto yuklash + saqlash, Admin panelga izoh (foydalanuvchilar va reja biriktirish keyinroq).  
**Hozircha qilinmaydi:** To‘lov (5) — foydalanuvchilar ko‘payganda birga qilamiz.

---

## 1. Backend va deploy
- Backend (Firebase/Supabase) ulash
- Haqiqiy ma’lumotlar bazasi, env o‘zgaruvchilar
- Veb saytni hosting ga chiqarish (Vercel/Netlify va h.k.)
- **Batafsil:** `DEPLOY_VAQTIDA.md` — 1, 6, 7 bo‘limlar

---

## 2. Retsept va progress (foydalanuvchi qulayligi) ✅ bajarildi
- Retseptni ochganda **to‘liq ko‘rinishi** (tarkib, qadamlari, kaloriya) — modal ishlaydi
- Progress fotoni **yuklash** (fayl yoki URL) va timeline da saqlash — ishlaydi

---

## 3. Admin panel — login/parol va qulaylik ✅ tayyor
- **Haqiqiy kirish:** login + parol — backend ulanganda (DEPLOY_VAQTIDA)
- Admin da "Foydalanuvchilar" bo‘limida **izoh** qo‘yildi: keyinroq login/parol va reja biriktirish
- **Batafsil:** `DEPLOY_VAQTIDA.md` — 2, 3 bo‘limlar

---

## 4. Foydalanuvchilar — reja biriktirish ✅ ishlaydi
- **Yangi user:** Admin «Yangi User» → ism, telefon, **30 kunlik shablon tanlash**, login, parol → «Yaratish va Rejani Biriktirish» — reja avtomatik birikadi.
- **Mavjud user:** Jadvalda «Reja biriktirish» tugmasi yoki Monitoring ichida «Reja biriktirish / o'zgartirish» — shablon tanlang, «Biriktirish».
- **Batafsil:** `DEPLOY_VAQTIDA.md` — 3 bo‘lim

---

## 5. To‘lov (Marketplace) — **hozircha qilinmaydi**
- **Foydalanuvchilar ko‘payganda** birga qilamiz.
- Click / Payme, sotuvlar ro‘yxati — keyinroq.
- **Batafsil:** `DEPLOY_VAQTIDA.md` — 4 bo‘lim

---

## 6. Mobil ilova (Expo / React Native) ✅ loyiha yaratildi
- **Loyiha:** `qayta-tugilish-mobile/` — React Native (Expo), Android + iOS.
- Hozir: Login (user/admin), Home, Chiqish. Keyinroq: reja, retseptlar, progress, push, kamera.
- **Ishga tushirish:** `cd qayta-tugilish-mobile && npm start` → Expo Go yoki `npm run android` / `npm run ios`.
- **Batafsil:** `qayta-tugilish-mobile/README.md`, `DEPLOY_VAQTIDA.md` — 5 bo‘lim, `BLUEPRINT.md`

---

## 7. Ixtiyoriy: Ariza avtomatik admin Telegramga
- Yangi anketani **Telegram Bot** orqali admin Telegram’ga avtomatik yuborish (backend + Bot API kerak)
- Hozir: foydalanuvchi “Adminimizga Telegram orqali yuborish” tugmasi orqali o‘zi yuboradi

---

**Qisqacha tartib:**  
Backend + auth → Admin (foydalanuvchilar + reja biriktirish) → To‘lov → Mobil.  
To‘liq qadamlari: **DEPLOY_VAQTIDA.md**.
