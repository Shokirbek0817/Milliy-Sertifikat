require("dotenv").config();

const path = require("path");
const express = require("express");
const cookieParser = require("cookie-parser");
const rateLimit = require("express-rate-limit");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Database = require("better-sqlite3");

const app = express();
const rootDir = path.join(__dirname, "..");
const loyihaDir = path.join(rootDir, "Loyiha");
const dbPath = path.join(__dirname, "database.sqlite");
const PORT = Number(process.env.PORT || 3000);
const JWT_SECRET = process.env.JWT_SECRET || "milliy-sertifikat-dev-secret";

const db = new Database(dbPath);

db.prepare(
  `
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    phone TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  )
`,
).run();

function normalizePhone(rawPhone) {
  const digits = String(rawPhone || "").replace(/\D/g, "");

  if (!digits) {
    return null;
  }

  let normalized = digits;

  if (normalized.startsWith("998")) {
    if (normalized.length !== 12) {
      return null;
    }
  } else if (normalized.length === 9) {
    normalized = `998${normalized}`;
  } else {
    return null;
  }

  return `+${normalized}`;
}

function signToken(user) {
  return jwt.sign(
    {
      id: user.id,
      phone: user.phone,
    },
    JWT_SECRET,
    { expiresIn: "7d" },
  );
}

function requireAuth(req, res, next) {
  const token = req.cookies?.auth_token;

  if (!token) {
    return res.redirect("/Shaxsiy/Ro%27yxatdan%20o%27tish/Kirish%20qism.html");
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    return next();
  } catch (error) {
    return res.redirect("/Shaxsiy/Ro%27yxatdan%20o%27tish/Kirish%20qism.html");
  }
}

const registerLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Juda ko'p urinish. Birozdan keyin urinib ko'ring.",
  },
});

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Juda ko'p urinish. Birozdan keyin urinib ko'ring.",
  },
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.post("/api/register", registerLimiter, (req, res) => {
  const phone = normalizePhone(req.body.phone || req.body.number);
  const password = String(req.body.password || req.body.parol || "");
  const confirmPassword = String(
    req.body.confirmPassword || req.body.parol2 || "",
  );

  if (!phone) {
    return res
      .status(400)
      .json({ success: false, message: "Telefon raqam noto'g'ri formatda." });
  }

  if (password.length < 8) {
    return res.status(400).json({
      success: false,
      message: "Parol kamida 8 ta belgidan iborat bo'lishi kerak.",
    });
  }

  if (password !== confirmPassword) {
    return res
      .status(400)
      .json({ success: false, message: "Parollar mos kelmadi." });
  }

  const existingUser = db
    .prepare("SELECT id FROM users WHERE phone = ?")
    .get(phone);
  if (existingUser) {
    return res.status(409).json({
      success: false,
      message: "Bu telefon raqami allaqachon ro'yxatdan o'tgan.",
    });
  }

  const passwordHash = bcrypt.hashSync(password, 10);
  const result = db
    .prepare("INSERT INTO users (phone, password_hash) VALUES (?, ?)")
    .run(phone, passwordHash);

  return res.status(201).json({
    success: true,
    message: "Ro'yxatdan o'tish muvaffaqiyatli bajarildi.",
    user: { id: result.lastInsertRowid, phone },
  });
});

app.post("/api/login", loginLimiter, (req, res) => {
  const phone = normalizePhone(req.body.phone || req.body.number);
  const password = String(req.body.password || req.body.parol || "");

  if (!phone) {
    return res
      .status(401)
      .json({ success: false, message: "Telefon raqam yoki parol noto'g'ri" });
  }

  const user = db.prepare("SELECT * FROM users WHERE phone = ?").get(phone);

  if (!user || !bcrypt.compareSync(password, user.password_hash)) {
    return res
      .status(401)
      .json({ success: false, message: "Telefon raqam yoki parol noto'g'ri" });
  }

  const token = signToken(user);
  res.cookie("auth_token", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  return res.json({
    success: true,
    message: "Kirish muvaffaqiyatli bajarildi.",
    user: { id: user.id, phone: user.phone },
  });
});

app.get("/api/me", (req, res) => {
  const token = req.cookies?.auth_token;

  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "Autentifikatsiya qilinmagan." });
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    return res.json({
      success: true,
      user: { id: payload.id, phone: payload.phone },
    });
  } catch (error) {
    return res
      .status(401)
      .json({ success: false, message: "Autentifikatsiya qilinmagan." });
  }
});

app.post("/api/logout", (req, res) => {
  res.clearCookie("auth_token");
  return res.json({ success: true, message: "Tizimdan chiqildi." });
});

const protectedRoutes = [
  ["/Shaxsiy/Kirish", path.join(loyihaDir, "Shaxsiy", "Kirish")],
  ["/Shaxsiy/Matematika", path.join(loyihaDir, "Shaxsiy", "Matematika")],
  ["/Shaxsiy/Fizika", path.join(loyihaDir, "Shaxsiy", "Fizika")],
  ["/Kalkulator", path.join(rootDir, "Kalkulator")],
];

protectedRoutes.forEach(([route, directory]) => {
  app.use(route, requireAuth, express.static(directory));
});

app.get("/", (req, res) => {
  const welcomePath =
    "/Shaxsiy/Ro%27yxatdan%20o%27tish/Ro%27yxatdan%20o%27tish%20oynasi.html";

  if (req.cookies?.auth_token) {
    return res.redirect("/Shaxsiy/Kirish/Kirish%20qismi.html");
  }

  return res.redirect(welcomePath);
});

app.use(express.static(loyihaDir));

app.use((req, res) => {
  res.status(404).send("Sahifa topilmadi.");
});

app.listen(PORT, () => {
  console.log(`Server ishlayapti: http://localhost:${PORT}`);
});
