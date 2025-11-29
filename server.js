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
  const { door } = req.body;
  const timestamp = new Date().toLocaleString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
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
