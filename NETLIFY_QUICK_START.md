# ⚡ Netlify - Tezkor Boshlash

## 🎯 3 Daqiqada Deploy Qilish

### 1. GitHub ga yuklash
```bash
git init
git add .
git commit -m "Ready for Netlify"
git branch -M main
git remote add origin https://github.com/USERNAME/REPO.git
git push -u origin main
```

### 2. Netlify sozlamalari

**Site settings:**
```
Base directory:       frontend
Build command:        npm run build  
Publish directory:    frontend/dist
Functions directory:  netlify/functions
```

**Environment variables:**
```
GROQ_API_KEY = your_groq_api_key
```

### 3. Deploy!

GitHub ulangandan keyin avtomatik deploy bo'ladi! 🎉

---

## 🧪 Local Test

```bash
npm install -g netlify-cli
netlify dev
```

Keyin: http://localhost:8888

---

## 📡 API Endpoints

- Test: `/.netlify/functions/hello`
- Translate: `/.netlify/functions/translate`

Frontend avtomatik `/api/translate` dan `/.netlify/functions/translate` ga redirect qiladi.

---

## ✅ Tayyor!

Batafsil ma'lumot: `NETLIFY_DEPLOY.md` faylini o'qing.
