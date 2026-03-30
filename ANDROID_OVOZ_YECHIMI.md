# Android Telefonda Ovoz Muammosini Hal Qilish

## Muammo
Android telefonda PWA ilovasini yuklab olgandan keyin ovoz (Text-to-Speech) ishlamaydi.

## Yechimlar

### 1. Kod Darajasida Qilingan O'zgarishlar ✅

Quyidagi o'zgarishlar amalga oshirildi:

- **Sinxron Speech API chaqiruvi**: Android Chrome foydalanuvchi harakati ichida darhol `speak()` chaqirilishini talab qiladi
- **Mahalliy ovozlarni afzal ko'rish**: Android qurilmalarda mahalliy ovozlar birinchi o'rinda
- **Avtomatik resume**: Pauzaga tushgan ovozni avtomatik davom ettirish
- **Batafsil xato xabarlari**: Foydalanuvchiga aniq xato sabablari
- **Volume maksimal**: Android uchun ovoz balandligi 100%
- **Cleanup**: Komponent o'chirilganda ovozni to'xtatish

### 2. Android Telefon Sozlamalari

#### A. Chrome Sozlamalari
1. **Chrome Settings** > **Site Settings** > **Sound**
   - "Sites can play sound" yoqilgan bo'lishi kerak

2. **Chrome Settings** > **Accessibility**
   - "Text-to-speech output" yoqilgan bo'lishi kerak

#### B. Android Tizim Sozlamalari
1. **Settings** > **Accessibility** > **Text-to-speech output**
   - Preferred engine: "Google Text-to-speech Engine" tanlang
   - Speech rate va pitch sozlang
   - "Listen to an example" tugmasini bosib test qiling

2. **Settings** > **Apps** > **Chrome** > **Permissions**
   - Microphone ruxsati berilgan bo'lishi kerak (ba'zi qurilmalarda)

3. **Google Text-to-Speech yangilash**
   - Play Store > "Google Text-to-speech Engine"
   - Eng yangi versiyaga yangilang

#### C. Til Paketlarini Yuklab Olish
1. **Settings** > **Accessibility** > **Text-to-speech**
2. **Google Text-to-speech Engine** > **Settings** > **Install voice data**
3. Kerakli tillarni yuklab oling:
   - English (US)
   - Russian
   - Turkish (O'zbek tili uchun yaqin)

### 3. Foydalanish Bo'yicha Maslahatlar

#### Birinchi Marta Ishlatish
1. Ilovani ochganingizda, birinchi ovoz tugmasini bosishda:
   - Brauzer ruxsat so'rashi mumkin - "Allow" bosing
   - Agar ovoz chiqmasa, sahifani yangilang (refresh)

2. Agar ovoz hali ham chiqmasa:
   - Ilovani yoping va qayta oching
   - Telefon ovozini oshiring
   - "Do Not Disturb" rejimini o'chiring

#### Eng Yaxshi Natija Uchun
- **Internet aloqasi**: Ba'zi ovozlar internet talab qiladi
- **Batareya tejash rejimi**: O'chirib qo'ying
- **Ovoz balandligi**: Media ovozini oshiring (rington emas!)
- **Bluetooth**: Agar Bluetooth quloqchin ulangan bo'lsa, ovoz u yerdan chiqadi

### 4. Muammolarni Bartaraf Etish

#### Ovoz Umuman Chiqmayapti
```
1. Telefon ovozini tekshiring (Media volume)
2. Chrome cache ni tozalang
3. Telefonni qayta ishga tushiring
4. Ilovani qayta o'rnating
```

#### Ovoz Kesiladi yoki To'xtaydi
```
1. Internet aloqasini tekshiring
2. Batareya tejash rejimini o'chiring
3. Chrome Background activity ruxsatini yoqing
```

#### Faqat Ba'zi Tillar Ishlamayapti
```
1. O'sha til uchun ovoz paketini yuklab oling
2. Google TTS sozlamalarida tilni test qiling
3. Boshqa til tanlang va qayta urinib ko'ring
```

### 5. Test Qilish

Quyidagi qadamlar bilan test qiling:

1. **Tizim TTS Test**:
   - Settings > Accessibility > Text-to-speech
   - "Listen to an example" bosing
   - Agar bu ishlamasa, muammo telefonning o'zida

2. **Chrome TTS Test**:
   - Chrome da `chrome://settings/content/sound` oching
   - Sozlamalarni tekshiring

3. **Ilova Test**:
   - Oddiy matn tarjima qiling
   - "Tinglash" tugmasini bosing
   - Console loglarni tekshiring (Chrome DevTools)

### 6. Texnik Ma'lumotlar

#### Qo'llab-quvvatlanadigan Brauzerlar
- ✅ Chrome 90+
- ✅ Edge 90+
- ✅ Samsung Internet 14+
- ⚠️ Firefox (cheklangan qo'llab-quvvatlash)
- ❌ Opera Mini (qo'llab-quvvatlanmaydi)

#### Qo'llab-quvvatlanadigan Android Versiyalar
- ✅ Android 10+ (to'liq qo'llab-quvvatlash)
- ⚠️ Android 8-9 (cheklangan)
- ❌ Android 7 va undan past (ishlamasligi mumkin)

### 7. Kod Namunasi (Dasturchilar Uchun)

Agar o'zingiz kod yozayotgan bo'lsangiz:

```javascript
// Android uchun to'g'ri usul
button.addEventListener('click', () => {
  // MUHIM: setTimeout ishlatmang!
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'en-US';
  utterance.volume = 1.0;
  
  // Darhol speak() chaqiring
  speechSynthesis.speak(utterance);
  
  // Kichik kechikishdan keyin resume
  setTimeout(() => {
    if (speechSynthesis.paused) {
      speechSynthesis.resume();
    }
  }, 50);
});
```

## Xulosa

Yuqoridagi o'zgarishlar bilan Android telefonda ovoz ishlashi kerak. Agar muammo davom etsa:

1. Telefon modelini va Android versiyasini tekshiring
2. Chrome versiyasini yangilang
3. Google TTS Engine ni qayta o'rnating
4. Telefonni factory reset qiling (oxirgi chora)

## Qo'shimcha Yordam

Agar muammo hal bo'lmasa, quyidagi ma'lumotlarni yuboring:
- Telefon modeli
- Android versiyasi
- Chrome versiyasi
- Xato xabari (agar bo'lsa)
- Console loglar (Chrome DevTools)
