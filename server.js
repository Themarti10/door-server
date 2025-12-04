const express = require("express");
const path = require("path");

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(__dirname)); // отдаём файлы из корня


// Endpoint для ESP32
app.post("/api", (req, res) => {
  const event = req.body;
  console.log("Получены данные от ESP32:", event);

  // Сохраняем данные временно в массив (чтобы фронтенд мог их читать)
  events.unshift({ ...event, timestamp: new Date().toISOString() });

  res.json({ status: "ok" });
});

// Массив для хранения событий (локально, пока работает сервер)
let events = [];

// GET для фронтенда
app.get("/events", (req, res) => {
  res.json(events);
});

// Простейший GET для проверки сервера
app.get("/", (req, res) => {
  res.send("Server is running!");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
