let timer;
let timeLeft = (parseInt(localStorage.getItem("focusTime")) || 25) * 60;
let isRunning = false;

const timerDisplay = document.getElementById("timer");
const startBtn = document.getElementById("start");
const pauseBtn = document.getElementById("pause");
const resetBtn = document.getElementById("reset");
const sessionCountDisplay = document.getElementById("sessionCount");

const tick = new Audio("sounds/tick.mp3");
tick.volume = 0.35;

function playTick() {
  tick.currentTime = 0;
  tick.play().catch(() => {});
}

function updateDisplay() {
  const m = Math.floor(timeLeft / 60).toString().padStart(2, "0");
  const s = (timeLeft % 60).toString().padStart(2, "0");
  timerDisplay.textContent = `${m}:${s}`;
}

function updateSessionCount() {
  const count = parseInt(localStorage.getItem("sessionCount")) || 0;
  sessionCountDisplay.textContent = count;
}

function incrementSessionCount() {
  let count = parseInt(localStorage.getItem("sessionCount")) || 0;
  count++;
  localStorage.setItem("sessionCount", count);
  updateSessionCount();
}

function showNotification() {
  if (chrome && chrome.notifications) {
    chrome.notifications.create({
      type: "basic",
      iconUrl: "icons/icon.png",
      title: "Focus Timer",
      message: "⏰ Time's up!",
      priority: 2
    });
  }
}

function startTimer() {
  if (!isRunning) {
    playTick();
    isRunning = true;
    timer = setInterval(() => {
      if (timeLeft > 0) {
        timeLeft--;
        updateDisplay();
      } else {
        clearInterval(timer);
        isRunning = false;
        incrementSessionCount();
        showNotification();
      }
    }, 1000);
  }
}

function pauseTimer() {
  playTick();
  clearInterval(timer);
  isRunning = false;
}

function resetTimer() {
  playTick();
  clearInterval(timer);
  timeLeft = (parseInt(localStorage.getItem("focusTime")) || 25) * 60;
  updateDisplay();
  isRunning = false;
}

startBtn.addEventListener("click", startTimer);
pauseBtn.addEventListener("click", pauseTimer);
resetBtn.addEventListener("click", resetTimer);

updateDisplay();
updateSessionCount();

// ✅ DOM references
const timerPage = document.getElementById("timer-page");
const settingsPage = document.getElementById("settings-page");
const historyPage = document.getElementById("history-page");
const menuPage = document.getElementById("menu-page");
const blockedpage = document.getElementById("Blocked Site-page");
const blocksitesLink = document.getElementById("Block sites-link");

const menuIcon = document.getElementById("menu-icon");
const backIcon = document.getElementById("back-icon");

const historyLink = document.getElementById("history-link");
const settingsLink = document.getElementById("settings-link");

const focusInput = document.getElementById("focusInput");

// ✅ Navigation function with menu-icon toggle
function showPage(pageId) {
  timerPage.classList.add("hidden");
  settingsPage.classList.add("hidden");
  historyPage.classList.add("hidden");
  menuPage.classList.add("hidden");
  document.getElementById("Blocked Site-page").classList.add("hidden");

  document.getElementById(pageId).classList.remove("hidden");

  const isTimer = pageId === "timer-page";

  // Toggle icons
  backIcon.classList.toggle("hidden", isTimer);
  menuIcon.classList.toggle("hidden", !isTimer);
}

// 3-dot Menu click → open menu page
menuIcon.addEventListener("click", () => {
  showPage("menu-page");
});

// History row click → show history page
historyLink.addEventListener("click", () => {
  showPage("history-page");
});

// Settings row click → show settings page
settingsLink.addEventListener("click", () => {
  focusInput.value = localStorage.getItem("focusTime") || 25;
  showPage("settings-page");
});

//Block sites row click → show blocked sites page
blocksitesLink.addEventListener("click", () => {
  showPage("Blocked Site-page");
});

// Back button → go to menu page
backIcon.addEventListener("click", () => {
  showPage("menu-page");
});

// Theme toggle
const toggleThemeBtn = document.getElementById("toggle-theme");
toggleThemeBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  const theme = document.body.classList.contains("dark") ? "dark" : "light";
  localStorage.setItem("theme", theme);
});

// Apply saved theme
if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark");
}

// Save focus time
const saveBtn = document.getElementById("saveSettings");
saveBtn.addEventListener("click", () => {
  const value = parseInt(focusInput.value);
  if (value >= 1 && value <= 90) {
    localStorage.setItem("focusTime", value);
    alert("Saved!");
    timeLeft = value * 60;
    updateDisplay();
  } else {
    alert("Enter a value between 1 and 90");
  }
});

// Close icon
const closeIcon = document.getElementById("close-icon");
closeIcon.addEventListener("click", () => {
  window.close();
});
