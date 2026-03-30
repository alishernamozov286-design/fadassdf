# Ovoz Funksiyasini Test Qilish

## Tezkor Test (5 daqiqa)

### 1. Kompyuterda Test
```bash
cd frontend
npm run dev
```

1. Brauzerda `http://localhost:5173` oching
2. Matn kiriting va tarjima qiling
3. "Tinglash" tugmasini bosing
4. Ovoz chiqishi kerak

### 2. Telefonda Test (Android)

#### A. Mahalliy Test (USB orqali)
```bash
# Frontend ni build qiling
cd frontend
npm run build

# Preview serverni ishga tushiring
npm run preview -- --host
```

1. Telefonda Chrome oching
2. Kompyuter IP manzilini kiriting: `http://192.168.x.x:4173`
3. Tarjima qiling va ovozni test qiling

#### B. Deploy Qilingan Versiyani Test

1. Netlify ga deploy qiling
2. Telefonda saytni oching
3. "Add to Home Screen" qiling
4. Ilovani oching va test qiling

## Batafsil Test Rejasi

### Test Case 1: Asosiy Funksiya
- [ ] Matn kiritish
- [ ] Tarjima qilish
- [ ] "Tinglash" tugmasini bosish
- [ ] Ovoz chiqishi
- [ ] Ovoz to'g'ri tilida

### Test Case 2: Turli Tillar
- [ ] English → Uzbek
- [ ] Uzbek → Russian
- [ ] Russian → English
- [ ] Spanish → French
- [ ] Chinese → English

### Test Case 3: Ovozni To'xtatish
- [ ] Ovoz boshlanadi
- [ ] "To'xtatish" tugmasini bosish
- [ ] Ovoz to'xtaydi
- [ ] Qayta "Tinglash" bosish
- [ ] Ovoz qayta boshlanadi

### Test Case 4: Xato Holatlari
- [ ] Bo'sh matn bilan "Tinglash"
- [ ] Internet yo'q holda
- [ ] Qo'llab-quvvatlanmaydigan til
- [ ] Juda uzun matn

### Test Case 5: Mobil Maxsus
- [ ] Ekran o'chganda ovoz davom etadi
- [ ] Boshqa ilovaga o'tganda
- [ ] Telefon qo'ng'irog'i kelganda
- [ ] Bluetooth quloqchin bilan

## Kutilgan Natijalar

### ✅ Muvaffaqiyatli
- Ovoz aniq va tushunarli
- To'xtatish tugmasi ishlaydi
- Xato xabarlari to'g'ri
- Barcha tillar ishlaydi

### ❌ Xato
- Ovoz chiqmaydi
- Ovoz kesiladi
- Noto'g'ri til
- Tugmalar ishlamaydi

## Xatolarni Qayd Qilish

Agar xato topsangiz:

1. **Chrome DevTools** ni oching:
   - Telefonda: `chrome://inspect`
   - Kompyuterda: `F12`

2. **Console** ni tekshiring:
   ```
   Speech started
   Using voice: Google US English
   Speech ended
   ```

3. **Xato xabarini** nusxalang

4. **Telefon ma'lumotlari**:
   - Model: _______
   - Android versiya: _______
   - Chrome versiya: _______

## Tezkor Yechimlar

### Ovoz Chiqmayapti
```
1. Telefon ovozini oshiring (Media volume)
2. Chrome cache ni tozalang
3. Sahifani yangilang (F5)
4. Ilovani qayta oching
```

### Ovoz Kesiladi
```
1. Internet aloqasini tekshiring
2. Batareya tejash rejimini o'chiring
3. Chrome background activity ni yoqing
```

### Noto'g'ri Til
```
1. Til paketini yuklab oling
2. Google TTS sozlamalarini tekshiring
3. Boshqa til tanlang
```

## Performance Test

### Tezlik
- Ovoz boshlanish vaqti: < 1 soniya
- Tarjima vaqti: < 3 soniya
- Sahifa yuklash: < 2 soniya

### Resurslar
- RAM: < 100 MB
- CPU: < 30%
- Network: < 1 MB/tarjima

## Avtomatik Test (Ixtiyoriy)

Agar Jest yoki Playwright ishlatayotgan bo'lsangiz:

```javascript
// test/speech.test.js
describe('Speech Functionality', () => {
  test('should speak translated text', async () => {
    const mockSpeak = jest.fn();
    window.speechSynthesis.speak = mockSpeak;
    
    // Click speak button
    await page.click('[title="Tinglash"]');
    
    expect(mockSpeak).toHaveBeenCalled();
  });
});
```

## Yakuniy Tekshirish

Deploy qilishdan oldin:

- [ ] Barcha test case'lar o'tdi
- [ ] Xatolar tuzatildi
- [ ] Performance yaxshi
- [ ] Mobilda ishlaydi
- [ ] Barcha brauzerlar qo'llab-quvvatlaydi

## Foydalanuvchi Feedback

Deploy dan keyin:

1. 10-20 foydalanuvchidan test so'rang
2. Feedback to'plang
3. Muammolarni hal qiling
4. Qayta deploy qiling

---

**Eslatma**: Har bir yangilanishdan keyin bu testlarni o'tkazing!
