# Yangilangan Ilovani Joylashtirish (Deploy)

## O'zgarishlar

Android telefonda ovoz ishlashi uchun quyidagi o'zgarishlar qilindi:

1. ✅ Speech API Android uchun optimizatsiya qilindi
2. ✅ Sinxron ovoz chaqiruvi qo'shildi
3. ✅ Mahalliy ovozlarni afzal ko'rish
4. ✅ Avtomatik resume funksiyasi
5. ✅ Batafsil xato xabarlari
6. ✅ Manifest.json yangilandi

## Joylashtirish Qadamlari

### 1. Frontend ni Build Qilish

```bash
cd frontend
npm run build
```

### 2. Netlify ga Deploy Qilish

#### A. Netlify CLI orqali (Tezkor)

```bash
# Agar Netlify CLI o'rnatilmagan bo'lsa
npm install -g netlify-cli

# Login qiling
netlify login

# Deploy qiling
netlify deploy --prod
```

#### B. Git orqali (Avtomatik)

```bash
# O'zgarishlarni commit qiling
git add .
git commit -m "Android ovoz muammosi hal qilindi"
git push origin main
```

Netlify avtomatik ravishda yangi versiyani deploy qiladi.

#### C. Netlify Dashboard orqali (Qo'lda)

1. https://app.netlify.com ga kiring
2. Loyihangizni tanlang
3. "Deploys" > "Trigger deploy" > "Deploy site"

### 3. Yangilanishni Tekshirish

Deploy tugagandan keyin:

1. **Brauzerda Test**:
   - Saytingizni oching
   - Hard refresh qiling: `Ctrl + Shift + R` (Windows) yoki `Cmd + Shift + R` (Mac)
   - Tarjima qiling va ovoz tugmasini bosing

2. **Telefonda Test**:
   - PWA ilovani oching
   - Agar eski versiya ko'rinsa, ilovani o'chiring va qayta oching
   - Yoki ilovani o'chirib, qayta o'rnating

### 4. PWA Cache ni Yangilash

Agar foydalanuvchilar eski versiyani ko'rishsa, cache muammosi bo'lishi mumkin.

#### Service Worker ni Yangilash

`frontend/vite.config.ts` faylida PWA versiyasini oshiring:

```typescript
VitePWA({
  registerType: 'autoUpdate',
  workbox: {
    // Cache versiyasini oshiring
    cleanupOutdatedCaches: true,
    skipWaiting: true,
    clientsClaim: true
  }
})
```

Keyin qayta build va deploy qiling.

### 5. Foydalanuvchilarga Xabar

Foydalanuvchilarga yangilanish haqida xabar bering:

```
📢 Yangilanish!

Android telefonda ovoz muammosi hal qilindi! 

Yangilanishni olish uchun:
1. Ilovani to'liq yoping
2. Qayta oching
3. Agar kerak bo'lsa, ilovani o'chirib qayta o'rnating

Endi barcha Android qurilmalarda ovoz ishlaydi! 🎉
```

## Muammolarni Bartaraf Etish

### Build Xatolari

Agar build paytida xato chiqsa:

```bash
# node_modules ni tozalang
rm -rf node_modules package-lock.json
npm install

# Cache ni tozalang
npm run build -- --force
```

### Deploy Xatolari

Agar deploy muvaffaqiyatsiz bo'lsa:

```bash
# Netlify loglarini ko'ring
netlify logs

# Yoki Netlify dashboard da "Deploy log" ni tekshiring
```

### Cache Muammolari

Agar yangilanish ko'rinmasa:

1. **Brauzer cache**:
   - `Ctrl + Shift + Delete` (Windows)
   - "Cached images and files" ni tanlang
   - "Clear data" bosing

2. **PWA cache**:
   - Chrome DevTools > Application > Storage
   - "Clear site data" bosing

3. **Service Worker**:
   - Chrome DevTools > Application > Service Workers
   - "Unregister" bosing
   - Sahifani yangilang

## Versiya Raqamini Yangilash

`frontend/package.json` da versiyani oshiring:

```json
{
  "name": "ai-translator",
  "version": "1.1.0",  // 1.0.0 dan 1.1.0 ga
  ...
}
```

## Tekshirish Ro'yxati

Deploy qilishdan oldin:

- [ ] Frontend build muvaffaqiyatli
- [ ] Mahalliy serverda test qilindi
- [ ] Git ga commit qilindi
- [ ] Netlify ga deploy qilindi
- [ ] Brauzerda test qilindi
- [ ] Telefonda test qilindi
- [ ] Ovoz ishlayapti
- [ ] Barcha funksiyalar ishlayapti

## Qo'shimcha Maslahatlar

1. **Staging Environment**: Avval test muhitda sinab ko'ring
2. **Backup**: Deploy qilishdan oldin hozirgi versiyani saqlang
3. **Monitoring**: Deploy dan keyin loglarni kuzatib boring
4. **User Feedback**: Foydalanuvchilardan fikr so'rang

## Yordam

Agar muammo bo'lsa:
- Netlify loglarini tekshiring
- Browser console ni tekshiring
- `ANDROID_OVOZ_YECHIMI.md` faylini o'qing
