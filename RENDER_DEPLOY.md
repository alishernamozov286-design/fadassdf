# 🚀 Render.com Deploy Qo'llanmasi

## Bitta Service da Backend + Frontend

### 1. Render.com ga kiring
- https://render.com ga o'ting
- GitHub akkauntingiz bilan login qiling

### 2. New Web Service yarating
- Dashboard → "New" → "Web Service"
- GitHub repository ni tanlang: `fadassdf`

### 3. Sozlamalarni kiriting

#### Basic Settings:
- **Name:** `ai-translator` (yoki istalgan nom)
- **Region:** `Frankfurt (EU Central)` yoki yaqin region
- **Branch:** `main`
- **Root Directory:** (bo'sh qoldiring)
- **Runtime:** `Node`

#### Build & Deploy:
- **Build Command:**
```bash
npm run build
```

- **Start Command:**
```bash
npm start
```

#### Advanced Settings:
- **Auto-Deploy:** `Yes` (har safar push qilganingizda avtomatik deploy)

### 4. Environment Variables qo'shing

"Environment" bo'limida quyidagilarni qo'shing:

```
GROQ_API_KEY=your_actual_groq_api_key_here
PORT=3000
NODE_ENV=production
```

**Muhim:** `GROQ_API_KEY` ni o'zingizning haqiqiy kalitingiz bilan almashtiring!

Groq API kalitini olish: https://console.groq.com/keys

### 5. Deploy qiling

- "Create Web Service" tugmasini bosing
- Deploy jarayoni 5-10 daqiqa davom etadi
- Deploy tugagach, sizga URL beriladi: `https://ai-translator-xxxx.onrender.com`

### 6. Tekshiring

Deploy tugagach:
- Berilgan URL ni oching
- Tarjima funksiyasini sinab ko'ring
- Agar xatolik bo'lsa, "Logs" bo'limini tekshiring

## 🔧 Muammolarni Hal Qilish

### Build xatoligi
Agar build muvaffaqiyatsiz bo'lsa:
1. Logs ni tekshiring
2. `package.json` fayllarini tekshiring
3. Node.js versiyasini tekshiring (18+ kerak)

### API ishlamayapti
1. Environment Variables to'g'ri kiritilganligini tekshiring
2. `GROQ_API_KEY` to'g'riligini tekshiring
3. Logs da xatoliklarni qidiring

### Frontend yuklanmayapti
1. Build muvaffaqiyatli bo'lganligini tekshiring
2. `frontend/dist` papkasi yaratilganligini tekshiring
3. Backend static files ni to'g'ri serve qilayotganligini tekshiring

## 📊 Free Plan Cheklovlari

Render.com Free Plan:
- ✅ 750 soat/oy (yetarli)
- ✅ Avtomatik SSL sertifikat
- ⚠️ 15 daqiqa faoliyatsizlikdan keyin uyqu rejimiga o'tadi
- ⚠️ Birinchi so'rovda 30-60 soniya kutish

## 🔄 Yangilanishlar

Kodda o'zgarish qilganingizda:

```bash
git add .
git commit -m "Update message"
git push origin main
```

Render avtomatik ravishda yangi versiyani deploy qiladi.

## 🌐 Custom Domain

Agar o'z domeningiz bo'lsa:
1. Render Dashboard → Settings → Custom Domain
2. Domeningizni qo'shing
3. DNS sozlamalarini yangilang

## 💡 Maslahatlar

1. **Environment Variables** ni doim to'g'ri kiriting
2. **Logs** ni muntazam tekshiring
3. **Auto-Deploy** ni yoqib qo'ying
4. **Health Check** endpoint ishlatiladi: `/health`
5. Free plan uchun **Persistent Disk** kerak emas

## 📞 Yordam

Muammo bo'lsa:
- Render Docs: https://render.com/docs
- Render Community: https://community.render.com
- GitHub Issues: Repository da issue oching
