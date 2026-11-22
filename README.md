# Milliy Sertifikat

Bu loyiha oddiy HTML/CSS/JS sayt bo'lib, login va ro'yxatdan o'tish uchun Express + SQLite + JWT autentifikatsiyasi qo'shilgan.

## O'rnatish

> Windows va better-sqlite3 bilan ishlash uchun Node.js 20 LTS ishlatilishi tavsiya etiladi. Node 24 da build muammolari bo'lishi mumkin.

1. Loyihani papkaga kiring.
2. Terminalda quyidagi buyruqni bajaring:

```bash
npm install
```

Agar sizda Node 20 o'rnatilmagan bo'lsa:

```bash
npx -y -p node@20 npm install
```

3. `.env.example` fayldan nusxa olib `.env` yarating va kerakli qiymatlarni sozlang:

```bash
copy .env.example .env
```

Agar Linux/macOS bo'lsa:

```bash
cp .env.example .env
```

## Ishga tushirish

```bash
npm start
```

Yoki agar Node 20 maxsus runtime orqali ishlatsangiz:

```bash
npx -y -p node@20 npm start
```

Keyin brauzerda quyidagi manzilni oching:

```text
http://localhost:3000/Shaxsiy/Ro'yxatdan%20o'tish/Ro'yxatdan%20o'tish%20oynasi.html
```

## Asosiy xususiyatlar

- Telefon + parol orqali ro'yxatdan o'tish va kirish
- JWT cookie bilan sessiya
- SQLite ma'lumotlar bazasi
- Avtorizatsiya qilingan foydalanuvchilar uchun himoyalangan sahifalar
- Harakatlarni cheklovchi rate limiting

## Kataloglar

- `Loyiha/` — frontend sahifalar
- `server/` — Express server va SQLite logikasi

## Foydalanish

- Kirish sahifasi: `Loyiha/Shaxsiy/Ro'yxatdan o'tish/Kirish qism.html`
- Ro'yxatdan o'tish sahifasi: `Loyiha/Shaxsiy/Ro'yxatdan o'tish/Royxat.html`
- Tanlov sahifasi: `Loyiha/Shaxsiy/Kirish/Kirish qismi.html`

> Sahifalar nomlarida bo'shliq va apostrof bo'lgani uchun URL-larni to'g'ri kodlash kerak bo'ladi.
