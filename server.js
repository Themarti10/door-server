// server.js
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();
const port = process.env.PORT || 3000;

// Раздача статических файлов (index.html)
app.use(express.static(path.join(__dirname)));

// Пример маршрута
app.get("/api", (req, res) => {
    res.send("Server is running!");
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
