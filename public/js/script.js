const form = document.querySelector("#check-in-form");
const dateInput = document.querySelector("#check-in-date");
const saveButton = document.querySelector("#save-check-in");
const alertBox = document.querySelector("#form-alert");
const historyList = document.querySelector("#check-in-history");
const stickyScore = document.querySelector("#sticky-score");
const mainScore = document.querySelector("#main-score");
const navbar = document.querySelector(".navbar");
const menu = document.querySelector("#menu");
let checkIns = [];

function getToday() {
  const today = new Date();
  return dateString(today);
}

function showMessage(message, type) {
  alertBox.textContent = message;
  alertBox.className = "alert alert-" + type;
}

async function requestJson(url, options) {
  const response = await fetch(url, options);
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || "The request could not be completed");
  return data;
}

// cargar los registros del api y hacer refresh

async function loadCheckIns() {
  try {
    checkIns = await requestJson("/api/check-ins");
    renderHistory();
    updateDashboard();
    updateWeeklyInsights();
    loadFormForDate();
  } catch (error) {
    showMessage("Could not load shared records: " + error.message, "warning");
  }
}

function selectedCheckIn() {
  return checkIns.find(function (checkIn) {
    return checkIn.date === dateInput.value;
  });
}

function loadFormForDate() {
  const checkIn = selectedCheckIn();
  document.querySelector("#sleep").value = "";
  document.querySelector("#water").value = "";
  document.querySelector("#movement").value = "";
  document.querySelector("#mood").value = "";

  if (checkIn) {
    document.querySelector("#sleep").value = checkIn.sleepHours ?? "";
    document.querySelector("#water").value = checkIn.waterGlasses ?? "";
    document.querySelector("#movement").value = checkIn.movementMinutes ?? "";
    document.querySelector("#mood").value = checkIn.mood ?? "";
  }
  updateMissionStatus();
}

function numberOrNull(value) {
  return value === "" ? null : Number(value);
}

// mandar una nueva entrada

async function saveCheckIn(event) {
  event.preventDefault();
  const existing = selectedCheckIn();
  const payload = {
    sleepHours: numberOrNull(document.querySelector("#sleep").value),
    waterGlasses: numberOrNull(document.querySelector("#water").value),
    movementMinutes: numberOrNull(document.querySelector("#movement").value),
    mood: document.querySelector("#mood").value || null,
    mission: existing ? existing.mission : null,
    missionCompleted: existing ? existing.missionCompleted : false
  };
  if (!existing) payload.date = dateInput.value;
  saveButton.disabled = true;
  let url = "/api/check-ins";
  let method = "POST";
  if (existing) {
    url += "/" + dateInput.value;
    method = "PUT";
  }
  try {
    await requestJson(url, {
      method: method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    await loadCheckIns();
    showMessage("Check-in saved.", "success");
  } catch (error) {
    showMessage(error.message, "danger");
  } finally {
    saveButton.disabled = false;
  }
}



// borrar iuna entrada
async function deleteCheckIn(date) {
  try {
    await requestJson("/api/check-ins/" + date, { method: "DELETE" });
    await loadCheckIns();
    showMessage("Check-in deleted.", "success");
  } catch (error) {
    showMessage(error.message, "danger");
  }
}

function renderHistory() {
  historyList.textContent = "";
  if (checkIns.length === 0) {
    historyList.textContent = "No saved days yet.";
    return;
  }

  for (const checkIn of checkIns) {
    const row = document.createElement("div");
    row.className = "list-group-item d-flex flex-wrap gap-2";
    row.dataset.date = checkIn.date;
    row.innerHTML = `
      <span class="me-auto"></span>
      <button type="button" class="btn btn-sm btn-outline-primary" data-action="edit">
        Edit
      </button>
      <button type="button" class="btn btn-sm btn-outline-danger" data-action="delete">
        Delete
      </button>
    `;

    row.querySelector("span").textContent =
      checkIn.date + " · Sleep " + (checkIn.sleepHours ?? "—") +
      " h · Water " + (checkIn.waterGlasses ?? "—") +
      " · Movement " + (checkIn.movementMinutes ?? "—") +
      " min · Mood " + (checkIn.mood || "—");
    historyList.appendChild(row);
  }
}

// Un solo evento para los botones del historial, como en el laboratorio DOM.
historyList.addEventListener("click", function (event) {
  const button = event.target.closest("button");
  if (!button) return;

  const date = button.parentElement.dataset.date;
  if (button.dataset.action === "edit") {
    dateInput.value = date;
    updateSelectedDate();
    form.scrollIntoView({ behavior: "smooth" });
  } else if (button.dataset.action === "delete") {
    deleteCheckIn(date);
  }
});

function countHabits(checkIn) {
  if (!checkIn) return 0;

  let count = 0;
  if (checkIn.sleepHours !== null) count++;
  if (checkIn.waterGlasses !== null) count++;
  if (checkIn.movementMinutes !== null) count++;
  if (checkIn.mood !== null) count++;
  return count;
}

function updateDashboard() {
  const checkIn = selectedCheckIn();
  const habitCount = countHabits(checkIn);
  const progress = habitCount * 25;
  document.querySelector("#main-score-value").textContent = progress + "/100";
  document.querySelector("#main-score-bar").style.width = progress + "%";
  document.querySelector("#main-score-bar").setAttribute("aria-valuenow", progress);
  document.querySelector("#tracking-count").textContent = habitCount + " of 4 habits recorded";
  stickyScore.textContent = "Tracking: " + progress + "/100";
  document.querySelector("#dashboard-sleep").textContent =
      checkIn && checkIn.sleepHours !== null ? checkIn.sleepHours + " h" : "No records";
  document.querySelector("#dashboard-water").textContent =
      checkIn && checkIn.waterGlasses !== null ? checkIn.waterGlasses + " glasses" : "No records";
  document.querySelector("#dashboard-movement").textContent =
      checkIn && checkIn.movementMinutes !== null ? checkIn.movementMinutes + " min" : "No records";
  document.querySelector("#dashboard-mood").textContent =
      checkIn && checkIn.mood ? checkIn.mood : "No records";
  updateMissionStatus();
}

function calendarDate(date) {
  return new Date(date + "T00:00:00");
}

function dateString(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return year + "-" + month + "-" + day;
}

function averageFor(days, field) {
  let total = 0;
  let count = 0;
  for (const day of days) {
    if (day[field] !== null && day[field] !== undefined) {
      total += day[field];
      count++;
    }
  }
  if (count === 0) return "No records";
  return String(Number((total / count).toFixed(1)));
}


// calcular stats de la semana
function updateWeeklyInsights() {
  if (!dateInput.value) return;
  const endDate = calendarDate(dateInput.value);
  const week = [];
  for (let offset = 6; offset >= 0; offset -= 1) {
    const day = new Date(endDate);
    day.setDate(endDate.getDate() - offset);
    const date = dateString(day);
    let record = checkIns.find(function (checkIn) {
      return checkIn.date === date;
    });
    if (!record) {
      record = {
        date: date,
        sleepHours: null,
        waterGlasses: null,
        movementMinutes: null,
        mood: null
      };
    }
    week.push(record);
  }
  let sleepDays = 0;
  let waterDays = 0;
  let moodDays = 0;
  const moodCounts = {};
  for (const day of week) {
    if (day.sleepHours !== null) sleepDays++;
    if (day.waterGlasses !== null) waterDays++;
    if (day.mood) {
      moodDays++;
      if (!moodCounts[day.mood]) moodCounts[day.mood] = 0;
      moodCounts[day.mood]++;
    }
  }

  let maxMood = 0;
  let commonMoods = [];
  for (const mood in moodCounts) {
    if (moodCounts[mood] > maxMood) {
      maxMood = moodCounts[mood];
      commonMoods = [mood];
    } else if (moodCounts[mood] === maxMood) {
      commonMoods.push(mood);
    }
  }
  document.querySelector("#weekly-sleep").textContent =
      "Average: " + averageFor(week, "sleepHours") + (sleepDays ? " hours" : "");
  document.querySelector("#weekly-water").textContent =
      "Average: " + averageFor(week, "waterGlasses") + (waterDays ? " glasses" : "");
  document.querySelector("#weekly-sleep-days").textContent = sleepDays + " of 7 days recorded";
  document.querySelector("#weekly-water-days").textContent = waterDays + " of 7 days recorded";
  document.querySelector("#weekly-mood").textContent =
      "Most common: " + (maxMood === 0 ? "No records" : commonMoods.join(" / "));
  document.querySelector("#weekly-mood-days").textContent = moodDays + " of 7 days recorded";
  const bars = document.querySelector("#week-bars");
  bars.textContent = "";
  week.forEach(function (day) {
    const count = countHabits(day);
    const column = document.createElement("div");
    column.className = "week-bar-column";
    const bar = document.createElement("div");
    bar.className = "week-bar";
    bar.style.height = Math.max(8, count * 25) + "%";
    bar.setAttribute("aria-label", day.date + ": " + count + " habits recorded");
    const label = document.createElement("span");
    label.textContent = day.date.slice(5);
    column.append(bar, label);
    bars.appendChild(column);
  });
}

function updateMissionStatus() {
  const checkIn = selectedCheckIn();
  const completeButton = document.querySelector("#complete-mission");
  completeButton.disabled = !checkIn || !checkIn.mission || checkIn.missionCompleted;
  const status = document.querySelector("#mission-status");
  if (!checkIn) {
    status.textContent = "Save this date's check-in before choosing a mission.";
  } else if (!checkIn.mission) {
    status.textContent = "No mission chosen for " + dateInput.value + ".";
  } else if (checkIn.missionCompleted) {
    status.textContent = "Mission completed: " + checkIn.mission + ".";
  } else {
    status.textContent = "Chosen mission: " + checkIn.mission + ".";
  }
}


// actualizar mision 

async function updateMission(mission, completed) {
  const checkIn = selectedCheckIn();
  if (!checkIn) {
    showMessage("Save this date's check-in before choosing a mission.", "warning");
    return;
  }
  const payload = {
    sleepHours: checkIn.sleepHours,
    waterGlasses: checkIn.waterGlasses,
    movementMinutes: checkIn.movementMinutes,
    mood: checkIn.mood,
    mission: mission,
    missionCompleted: completed
  };
  try {
    await requestJson("/api/check-ins/" + checkIn.date, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    await loadCheckIns();
    showMessage("Mission updated.", "success");
  } catch (error) {
    showMessage(error.message, "danger");
  }
}

// mantener el navbar progrres sync
function updateStickyScore() {
  if (mainScore.getBoundingClientRect().bottom <= navbar.offsetHeight) stickyScore.classList.remove("d-none");
  else stickyScore.classList.add("d-none");
}

form.addEventListener("submit", saveCheckIn);
function updateSelectedDate() {
  loadFormForDate();
  updateDashboard();
  updateWeeklyInsights();
}

dateInput.addEventListener("change", updateSelectedDate);
document.querySelectorAll(".mission-button").forEach(function (button) {
  button.addEventListener("click", function () { updateMission(button.dataset.mission, false); });
});
document.querySelector("#complete-mission").addEventListener("click", function () {
  const checkIn = selectedCheckIn();
  if (checkIn) updateMission(checkIn.mission, true);
});
menu.querySelectorAll(".nav-link").forEach(function (link) {
  link.addEventListener("click", function () {
    if (menu.classList.contains("show")) bootstrap.Collapse.getOrCreateInstance(menu).hide();
  });
});
window.addEventListener("scroll", updateStickyScore);
window.addEventListener("resize", updateStickyScore);
dateInput.value = getToday();
updateStickyScore();
loadCheckIns();
