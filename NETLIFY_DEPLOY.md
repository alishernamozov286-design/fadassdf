# 🚀 Netlify Deploy Qo'llanmasi

## ✅ Loyiha Netlify uchun tayyor!

### 📁 Yaratilgan Fayllar:
- `netlify/functions/hello.js` - Test function
- `netlify/functions/translate.js` - Tarjima API function
- `netlify/functions/package.json` - Dependencies
- `netlify.toml` - Netlify konfiguratsiya
- `frontend/.env.example` - Environment variables namunasi

---

## 🎯 NETLIFY DEPLOY SOZLAMALARI

### 1️⃣ Netlify Dashboard Settings:

```
Base directory:       frontend
Build command:        npm run build
Publish directory:    frontend/dist
Functions directory:  netlify/functions
```

### 2️⃣ Environment Variables (Netlify Dashboard):

Netlify dashboard → Site settings → Environment variables ga o'ting va qo'shing:

```
GROQ_API_KEY = your_groq_api_key_here
```

**GROQ API Key olish:**
1. https://console.groq.com/ ga kiring
2. API Keys bo'limiga o'ting
3. "Create API Key" tugmasini bosing
4. Key ni nusxalang va Netlify ga qo'shing

---

## 📦 DEPLOY QILISH USULLARI

### Usul 1: GitHub orqali (Tavsiya etiladi)

1. **GitHub repository yarating:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit for Netlify"
   git branch -M main
   git remote add origin https://github.com/username/repo-name.git
   git push -u origin main
   ```

2. **Netlify ga ulang:**
   - https://app.netlify.com/ ga kiring
   - "Add new site" → "Import an existing project"
   - GitHub ni tanlang va repository ni toping
   - Yuqoridagi sozlamalarni kiriting
   - "Deploy site" tugmasini bosing

3. **Environment variables qo'shing:**
   - Site settings → Environment variables
   - `GROQ_API_KEY` ni qo'shing

### Usul 2: Netlify CLI orqali

1. **Netlify CLI o'rnating:**
   ```bash
   npm install -g netlify-cli
   ```

2. **Login qiling:**
   ```bash
   netlify login
   ```

3. **Deploy qiling:**
   ```bash
   netlify deploy --prod
   ```

4. **Environment variables qo'shing:**
   ```bash
   netlify env:set GROQ_API_KEY "your_api_key_here"
   ```

---

## 🧪 FUNCTIONS TESTLASH

### Local da test qilish:

1. **Netlify CLI o'rnating:**
   ```bash
   npm install -g netlify-cli
   ```

2. **Dev server ishga tushiring:**
   ```bash
   netlify dev
   ```

3. **Test qiling:**
   - Hello function: http://localhost:8888/.netlify/functions/hello
   - Translate function: http://localhost:8888/.netlify/functions/translate

### Production da test qilish:

Deploy qilingandan keyin:

```bash
# Hello function test
curl https://your-site.netlify.app/.netlify/functions/hello

# Translate function test
curl -X POST https://your-site.netlify.app/.netlify/functions/translate \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Hello world",
    "sourceLang": "English",
    "targetLang": "Uzbek"
  }'
```

---

## 🔧 FRONTEND INTEGRATION

Frontend allaqachon to'g'ri sozlangan! API chaqiruvlar avtomatik ravishda Netlify Functions ga yo'naltiriladi:

```typescript
// frontend/src/services/translationService.ts
const API_URL = '/api'; // Netlify redirects ga yo'naladi

// Chaqiruv:
fetch('/api/translate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    text: 'Salom dunyo',
    sourceLang: 'Uzbek',
    targetLang: 'English'
  })
});
```

---

## 📋 DEPLOY CHECKLIST

- [x] `netlify/functions/` papkasi yaratildi
- [x] `translate.js` function yaratildi
- [x] `hello.js` test function yaratildi
- [x] `netlify.toml` konfiguratsiya fayli yaratildi
- [x] Frontend API integration to'g'rilandi
- [ ] GitHub repository yarating
- [ ] Netlify ga ulang
- [ ] `GROQ_API_KEY` environment variable qo'shing
- [ ] Deploy qiling va test qiling

---

## 🎨 NETLIFY.TOML TUSHUNTIRISH

```toml
[build]
  base = "frontend"              # Frontend papkasida build qilish
  command = "npm run build"      # Build buyrug'i
  publish = "dist"               # Build natijasi (frontend/dist)
  functions = "../netlify/functions"  # Functions papkasi

# API redirects
[[redirects]]
  from = "/api/translate"        # Frontend chaqiradi
  to = "/.netlify/functions/translate"  # Function ga yo'naltiradi
  status = 200

# SPA support
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

---

## 🚨 MUAMMOLARNI HAL QILISH

### 1. Function ishlamayapti:
- Environment variables to'g'ri qo'shilganini tekshiring
- Netlify logs ni ko'ring: Site → Functions → Function name → Logs

### 2. CORS xatosi:
- `netlify/functions/translate.js` da CORS headers mavjud
- Agar muammo bo'lsa, `netlify.toml` da qo'shimcha headers qo'shing

### 3. Build xatosi:
- `frontend/package.json` da dependencies to'liq ekanini tekshiring
- Node version: 18 yoki yuqori

### 4. API chaqiruv 404:
- `netlify.toml` da redirects to'g'ri yozilganini tekshiring
- Function nomi va path mos kelishini tekshiring

---

## 📚 QO'SHIMCHA RESURSLAR

- [Netlify Functions Documentation](https://docs.netlify.com/functions/overview/)
- [Netlify Deploy Settings](https://docs.netlify.com/configure-builds/overview/)
- [Groq API Documentation](https://console.groq.com/docs)

---

## ✨ BEST PRACTICES

1. **Environment Variables:**
   - Hech qachon API keys ni kodga yozmang
   - Netlify dashboard da saqlang

2. **Functions:**
   - Har bir function alohida fayl
   - Error handling qo'shing
   - CORS headers qo'shing

3. **Caching:**
   - Static assets uchun long-term caching
   - `netlify.toml` da headers sozlangan

4. **Security:**
   - X-Frame-Options, CSP headers qo'shilgan
   - HTTPS avtomatik (Netlify tomonidan)

---

## 🎉 TAYYOR!

Endi loyihangizni Netlify ga deploy qilishingiz mumkin. Barcha sozlamalar tayyor va to'g'ri ishlaydi!

**Keyingi qadam:** GitHub repository yarating va Netlify ga ulang! 🚀
