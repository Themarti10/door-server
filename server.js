const express = require("express");
const path = require("path");

let db = null;
let firebaseEnabled = false;

// Попытка подключения к Firebase
try {
  const admin = require("firebase-admin");
  const serviceAccount = require("./firebase-key.json");

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });

  db = admin.firestore();
  firebaseEnabled = true;
  console.log("Firebase подключен");
} catch (err) {
  console.warn("Firebase не подключен. Работаем в локальном режиме.", err.message);
}

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname)));

// Тестовый endpoint для ESP32 (работает всегда)
app.post("/test", (req, res) => {
  console.log("Получены данные от ESP32:", req.body);

  // Если Firebase подключен — сохраняем туда
  if (firebaseEnabled && db) {
    const { door } = req.body;
    const timestamp = new Date().toISOString();
    const event = { door: door ? "Открыта" : "Закрыта", timestamp };

    db.collection("door_events").add(event)
      .then(() => console.log("Событие добавлено в Firestore:", event))
      .catch(err => console.error("Ошибка записи в Firestore:", err));
  }

  res.json({ status: "ok" });
});

// GET endpoint для фронтенда (если есть Firebase)
app.get("/events", async (req, res) => {
  if (!firebaseEnabled || !db) {
    return res.json([]);
  }

  try {
    const snapshot = await db.collection("door_events")
                             .orderBy("timestamp", "desc")
                             .get();
    const events = snapshot.docs.map(doc => doc.data());
    res.json(events);
  } catch (err) {
    console.error("Ошибка чтения из Firestore:", err);
    res.status(500).json([]);
  }
});

// Простейший GET для проверки сервера
app.get("/", (req, res) => {
  res.send("Server is running!");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
