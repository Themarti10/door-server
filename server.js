const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();
const port = process.env.PORT || 3000;

// чтобы сервер понимал JSON
app.use(bodyParser.json());

// чтобы отдавать index.html и файлы
app.use(express.static(path.join(__dirname)));

let eventLog = []; // сюда будут складываться события

// маршрут для ESP32
app.post("/api", (req, res) => {
  const { door } = req.body;
  const timestamp = new Date().toLocaleString();
  const event = { door, timestamp };
  eventLog.push(event);
  console.log("Received event:", event);
  res.json({ status: "ok" });
});

// маршрут для фронтенда
app.get("/events", (req, res) => {
  res.json(eventLog);
});

app.listen(port, () => {
  console.log("Server is running!");
});
