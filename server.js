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

  // Время сразу в нужном формате (Казахстан, русский язык)
  const time = new Date().toLocaleString("ru-RU", {
    timeZone: "Asia/Almaty",
    hour12: false
  });

  const event = { 
    door,
    time 
  };

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
