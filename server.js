// POST endpoint для ESP32
app.post("/test", (req, res) => {
  console.log("Получены данные от ESP32:", req.body);

  if (firebaseEnabled && db) {
    const { door, temperature } = req.body;
    const timestamp = new Date().toISOString();
    const event = { timestamp };

    if (door !== undefined) event.door = door ? "Открыта" : "Закрыта";
    if (temperature !== undefined) event.temperature = temperature;

    db.collection("door_events").add(event)
      .then(() => console.log("Событие добавлено в Firestore:", event))
      .catch(err => console.error("Ошибка записи в Firestore:", err));
  }

  res.json({ status: "ok" });
});

// GET endpoint для фронтенда
app.get("/events", async (req, res) => {
  if (!firebaseEnabled || !db) return res.json([]);

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
