require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const CheckIn = require("./models/CheckIn");

const app = express();
const moodOptions = ["Low", "Okay", "Good", "Great"];
const missionOptions = ["sleep", "water", "movement"];

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Reuse the same connection promise when several API requests arrive together.
let databaseConnection;

function connectDatabase() {
  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI is required");
  }
  if (!databaseConnection) {
    databaseConnection = mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 10000
    }).then(function () {
      return CheckIn.init();
    }).catch(function (error) {
      databaseConnection = null; // Allow the next request to try again.
      throw error;
    });
  }
  return databaseConnection;
}

// API requests wait for MongoDB; the static page can load independently.
app.use("/api", async function (req, res, next) {
  try {
    await connectDatabase();
    next();
  } catch (error) {
    res.status(503).json({ error: "Database unavailable. Please try again shortly." });
  }
});

// Check that the date has the YYYY-MM-DD shape and is a real calendar day.
function isValidDate(date) {
  if (typeof date !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(date)) return false;
  const [year, month, day] = date.split("-").map(Number);
  if (month < 1 || month > 12) return false;
  const leapYear = year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
  const daysInMonth = [31, leapYear ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  return day >= 1 && day <= daysInMonth[month - 1];
}

// Empty optional fields become null. Only these fields can be saved.
function readCheckIn(body) {
  return {
    sleepHours: body.sleepHours ?? null,
    waterGlasses: body.waterGlasses ?? null,
    movementMinutes: body.movementMinutes ?? null,
    mood: body.mood === "" ? null : body.mood ?? null,
    mission: body.mission === "" ? null : body.mission ?? null,
    missionCompleted: body.missionCompleted === undefined ? false : body.missionCompleted
  };
}

// Return an error message, or an empty string when the habits are valid.
function validateCheckIn(data) {
  if (data.sleepHours !== null) {
    if (typeof data.sleepHours !== "number" || !Number.isFinite(data.sleepHours) || data.sleepHours < 0 || data.sleepHours > 24) {
      return "Sleep must be a number between 0 and 24";
    }
  }

  if (data.waterGlasses !== null) {
    if (!Number.isInteger(data.waterGlasses) || data.waterGlasses < 0 || data.waterGlasses > 100) {
      return "Water must be a whole number between 0 and 100";
    }
  }

  if (data.movementMinutes !== null) {
    if (!Number.isInteger(data.movementMinutes) || data.movementMinutes < 0 || data.movementMinutes > 1440) {
      return "Movement must be a whole number between 0 and 1440";
    }
  }

  if (data.mood !== null && !moodOptions.includes(data.mood)) {
    return "Mood is not valid";
  }
  if (data.mission !== null && !missionOptions.includes(data.mission)) {
    return "Mission is not valid";
  }
  if (data.sleepHours === null && data.waterGlasses === null && data.movementMinutes === null && data.mood === null) {
    return "Record at least one habit";
  }
  if (typeof data.missionCompleted !== "boolean") {
    return "missionCompleted must be true or false";
  }
  if (data.missionCompleted && data.mission === null) {
    return "Choose a mission before completing it";
  }
  return "";
}

// Reject JSON arrays and empty bodies before reading their fields.
app.use("/api/check-ins", function (req, res, next) {
  if (req.method === "POST" || req.method === "PUT") {
    if (!req.body || typeof req.body !== "object" || Array.isArray(req.body)) {
      return res.status(400).json({ error: "Body must be a JSON object" });
    }
  }
  next();
});

// List all shared demo records, with the newest date first.
app.get("/api/check-ins", async function (req, res, next) {
  try {
    const checkIns = await CheckIn.find().sort({ date: -1 });
    res.json(checkIns);
  } catch (error) {
    next(error);
  }
});

// Find one record by its calendar date.
app.get("/api/check-ins/:date", async function (req, res, next) {
  if (!isValidDate(req.params.date)) return res.status(400).json({ error: "Date must be a real date in YYYY-MM-DD format" });
  try {
    const checkIn = await CheckIn.findOne({ date: req.params.date });
    if (!checkIn) return res.status(404).json({ error: "Check-in not found" });
    res.json(checkIn);
  } catch (error) {
    next(error);
  }
});

// Create a shared record after validating its date and habit fields.
app.post("/api/check-ins", async function (req, res, next) {
  if (!isValidDate(req.body.date)) {
    return res.status(400).json({ error: "Date must be a real date in YYYY-MM-DD format" });
  }
  const data = readCheckIn(req.body);
  const errorMessage = validateCheckIn(data);
  if (errorMessage) {
    return res.status(400).json({ error: errorMessage });
  }
  data.date = req.body.date;
  try {
    const checkIn = await CheckIn.create(data);
    res.status(201).json(checkIn);
  } catch (error) {
    if (error.code === 11000) return res.status(409).json({ error: "A check-in already exists for this date" });
    next(error);
  }
});

// Replace all editable values for an existing date; a changed mission resets completion.
app.put("/api/check-ins/:date", async function (req, res, next) {
  if (!isValidDate(req.params.date)) return res.status(400).json({ error: "Date must be a real date in YYYY-MM-DD format" });
  const data = readCheckIn(req.body);
  const errorMessage = validateCheckIn(data);
  if (errorMessage) {
    return res.status(400).json({ error: errorMessage });
  }
  try {
    const checkIn = await CheckIn.findOne({ date: req.params.date });
    if (!checkIn) return res.status(404).json({ error: "Check-in not found" });
    if (checkIn.mission !== data.mission) data.missionCompleted = false;
    checkIn.sleepHours = data.sleepHours;
    checkIn.waterGlasses = data.waterGlasses;
    checkIn.movementMinutes = data.movementMinutes;
    checkIn.mood = data.mood;
    checkIn.mission = data.mission;
    checkIn.missionCompleted = data.missionCompleted;
    await checkIn.save();
    res.json(checkIn);
  } catch (error) {
    next(error);
  }
});

// Delete one existing shared record.
app.delete("/api/check-ins/:date", async function (req, res, next) {
  if (!isValidDate(req.params.date)) return res.status(400).json({ error: "Date must be a real date in YYYY-MM-DD format" });
  try {
    const checkIn = await CheckIn.findOneAndDelete({ date: req.params.date });
    if (!checkIn) return res.status(404).json({ error: "Check-in not found" });
    res.json({ message: "Check-in deleted" });
  } catch (error) {
    next(error);
  }
});

// Return a JSON 404 for unknown API paths and normal static-site paths.
app.use(function (req, res) {
  res.status(404).json({ error: "Route not found" });
});

// Handle malformed JSON and unexpected server errors without exposing details.
app.use(function (error, req, res, next) {
  if (error instanceof SyntaxError && error.status === 400 && "body" in error) {
    return res.status(400).json({ error: "Request body contains invalid JSON" });
  }
  console.error("Request failed:", error.message);
  res.status(500).json({ error: "Something went wrong. Please try again." });
});

// Vercel uses this exported app. npm start still starts a local server.
module.exports = app;

if (require.main === module) {
  const port = process.env.PORT || 3000;
  app.listen(port, function () {
    console.log("Nappy is running on port " + port);
  });
}
