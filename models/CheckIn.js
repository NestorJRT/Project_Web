const mongoose = require("mongoose");

const checkInSchema = new mongoose.Schema({
  date: { type: String, required: true, unique: true },
  sleepHours: { type: Number, default: null, min: 0, max: 24 },
  waterGlasses: { type: Number, default: null, min: 0, max: 100, validate: { validator: (value) => value === null || Number.isInteger(value), message: "Water must be a whole number" } },
  movementMinutes: { type: Number, default: null, min: 0, max: 1440, validate: { validator: (value) => value === null || Number.isInteger(value), message: "Movement must be a whole number" } },
  mood: { type: String, enum: [null, "Low", "Okay", "Good", "Great"], default: null },
  mission: { type: String, enum: [null, "sleep", "water", "movement"], default: null },
  missionCompleted: { type: Boolean, default: false }
});

module.exports = mongoose.model("CheckIn", checkInSchema);
