const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname)));

let eventLog = [];

// POST от ESP32
app.post("/api", (req, res) => {
  let { door } = req.body;

  // Преобразуем текст в boolean, если приходит строка
  if (typeof door === "string") {
    door = door.toLowerCase() === "открыта" || door.toLowerCase() === "true";
  }

  const timestamp = new Date().toISOString();
  const event = { door, timestamp };
  eventLog.push(event);
  console.log("Получено событие:", event);
  res.json({ status: "ok" });
});

// GET для фронтенда
app.get("/events", (req, res) => {
  res.json(eventLog);
});

app.listen(port, () => {
  console.log("Server is running!");
});
