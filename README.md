# QR Code Studio

QR kod yaratish va skanerlash uchun oddiy, mustaqil (backendsiz) veb-ilova.

## Imkoniyatlar

- **Yaratish**: matn/URL, Wi-Fi, vizit karta (vCard), telefon raqami, email uchun QR kod yaratish. O'lcham, rang va xato tuzatish darajasini sozlash mumkin, natijani PNG sifatida yuklab olish mumkin.
- **Skanerlash**: kamera orqali jonli skanerlash yoki rasm faylini yuklab QR kodni o'qish.
- **Tarix**: so'nggi yaratilgan/skaner qilingan kodlar brauzer xotirasida (localStorage) saqlanadi.

## Ishga tushirish

Kamera orqali skanerlash uchun sahifa HTTPS yoki `localhost` orqali ochilishi kerak (`file://` orqali ochilganda brauzer kameraga ruxsat bermaydi). Loyiha papkasida:

```bash
python3 -m http.server 8000
```

so'ng brauzerda `http://localhost:8000` manzilini oching.

## Texnologiyalar

- Vanilla HTML/CSS/JavaScript — build qadam shart emas
- [qrcodejs](https://github.com/davidshimjs/qrcodejs) — QR kod yaratish
- [jsQR](https://github.com/cozmo/jsQR) — QR kod skanerlash/dekodlash
