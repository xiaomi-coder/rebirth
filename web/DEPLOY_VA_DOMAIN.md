# 🚀 Deploy va Domen ulash — Qayta Tug'ilish (Web)

**Loyiha deploy qilishga tayyor.** Build o‘tdi: `npm run build` → `dist/` papka.

---

## 1. Deploy qayerda qilish mumkin (bepul)

| Xizmat      | Link           | Bepul plan | Domen |
|------------|----------------|------------|--------|
| **Vercel** | vercel.com     | Ha         | Bepul subdomain (*.vercel.app) + o‘zingizning domeningiz |
| **Netlify**| netlify.com    | Ha         | Bepul subdomain (*.netlify.app) + custom domain |
| **GitHub Pages** | pages.github.com | Ha   | *.github.io yoki custom domain |

**Tavsiya:** Vercel yoki Netlify — ulash oson, avtomatik HTTPS, custom domain qo‘shish oddiy.

---

## 2. Vercel orqali deploy (qisqa yo‘l)

### A) GitHub orqali (tavsiya)

1. Loyihani **GitHub** ga yuklang:
   - github.com da yangi repo yarating (masalan `qayta-tugilish`)
   - Loyiha papkasida:
     ```bash
     cd QAYTA_TUGILISH_V2_EXTRACTED
     git init
     git add .
     git commit -m "Initial: Qayta Tug'ilish web"
     git branch -M main
     git remote add origin https://github.com/YOUR_USERNAME/qayta-tugilish.git
     git push -u origin main
     ```
2. **Vercel** ga kiring: vercel.com → Login (GitHub bilan).
3. **Add New Project** → Import `qayta-tugilish` repo.
4. **Root Directory:** `QAYTA_TUGILISH_V2_EXTRACTED` (yoki agar faqat shu papkani repo qilib yuborgan bo‘lsangiz — bo‘sh qoldiring).
5. **Build Command:** `npm run build`  
   **Output Directory:** `dist`  
   **Install Command:** `npm install`
6. **Deploy** bosing. Tugagach sizga `https://qayta-tugilish-xxx.vercel.app` beriladi.

### B) Vercel CLI orqali (GitHub siz)

1. `npm i -g vercel` (yoki `npx vercel`)
2. `cd QAYTA_TUGILISH_V2_EXTRACTED` → `vercel`
3. So‘rovlarga javob bering (login, project name). Keyin `vercel --prod` — production deploy.

---

## 3. Domen ulash (o‘zingizning domeningiz)

### Vercel da

1. Vercel dashboard → loyihangiz → **Settings** → **Domains**.
2. **Add** → domeningizni yozing (masalan `qayta-tugilish.uz` yoki `www.qayta-tugilish.uz`).
3. Domen **registrar** da (qayerda domen sotib olgan bo‘lsangiz):
   - **A record** yoki **CNAME** qo‘shish kerak. Vercel aynan qanday qilishni **Domains** bo‘limida ko‘rsatadi, masalan:
     - `CNAME` → `cname.vercel-dns.com`  
     yoki  
     - `A` → `76.76.21.21`
4. 5–30 daqiqadan keyin domen ulangan bo‘ladi, HTTPS avtomatik yoqiladi.

### Netlify da

1. **Domain settings** → **Add custom domain** → domeni kiriting.
2. Registrar da Netlify ko‘rsatgan **CNAME** yoki **A** yozilasiz.
3. HTTPS avtomatik (Let’s Encrypt).

---

## 4. Build va papka (esda tuting)

- **Build command:** `npm run build`
- **Output (publish) directory:** `dist`
- **Root:** agar repo ildizi `QAYTA_TUGILISH_V2_EXTRACTED` bo‘lsa, root — `.`; agar boshqa papkada bo‘lsa, root ni shu papkaga qo‘ying.

---

## 5. Keyinroq (backend, env)

- Hozir **API yoki backend yo‘q** — faqat frontend deploy qilinadi, hammasi ishlaydi.
- Kelajakda backend (Firebase va h.k.) qo‘shsangiz, **Environment Variables** ga `VITE_*` o‘zgaruvchilarni qo‘shasiz (Vercel/Netlify **Settings → Environment Variables**).

---

**Qisqacha:**  
1) GitHub ga kodni yuboring → 2) Vercel/Netlify da loyihani ulang → 3) Build: `npm run build`, Output: `dist` → 4) Domen bo‘lsa, **Domains** ga qo‘shib, registrar da CNAME/A sozlang. Shundan keyin sayt domeningizda ochiladi.
