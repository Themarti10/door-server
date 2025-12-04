const express = require("express");
const path = require("path");

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(__dirname)); // отдаём все файлы из корня

// Массив для хранения событий (локально, пока работает сервер)
let events = [];

// Endpoint для ESP32
app.post("/api", (req, res) => {
  const event = req.body;
  console.log("Получены данные от ESP32:", event);

  // Добавляем новое событие в начало массива
  events.unshift({ ...event, timestamp: new Date().toISOString() });

  res.json({ status: "ok" });
});

// GET для фронтенда: отдаём index.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// GET для списка событий
app.get("/events", (req, res) => {
  res.json(events);
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
