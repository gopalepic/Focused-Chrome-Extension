// Timer variables
let timer;
let timeLeft = (parseInt(localStorage.getItem("focusTime")) || 25) * 60;
let isRunning = false;

// DOM elements
const timerDisplay = document.getElementById("timer");
const startBtn = document.getElementById("start");
const pauseBtn = document.getElementById("pause");
const resetBtn = document.getElementById("reset");
const sessionCountDisplay = document.getElementById("sessionCount");

// Tick Sound
const tick = new Audio("sounds/tick.mp3");
tick.volume = 0.35;
function playTick() {
  tick.currentTime = 0;
  tick.play().catch(() => {});
}

// Display update
function updateDisplay() {
  const m = Math.floor(timeLeft / 60)
    .toString()
    .padStart(2, "0");
  const s = (timeLeft % 60).toString().padStart(2, "0");
  timerDisplay.textContent = `${m}:${s}`;
}

// Session counter
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

// Show desktop notification
function showNotification() {
  if (chrome && chrome.notifications) {
    chrome.notifications.create({
      type: "basic",
      iconUrl: "icons/icon.png",
      title: "Focus Timer",
      message: "⏰ Time's up!",
      priority: 2,
    });
  }
}

// Timer controls
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

// Event bindings
startBtn.addEventListener("click", startTimer);
pauseBtn.addEventListener("click", pauseTimer);
resetBtn.addEventListener("click", resetTimer);

// Initial display
updateDisplay();
updateSessionCount();


// --- NAVIGATION LOGIC STARTS HERE ---

// DOM references
const menuIcon = document.getElementById("menu-icon");
const menuPage = document.getElementById("menu-page");
const timerPage = document.getElementById("timer-page");
const settingsPage = document.getElementById("settings-page");
const historyPage = document.getElementById("history-page");
const blockedPage = document.getElementById("blocked-sites-page");
const settingsLink = document.getElementById("settings-link");
const historyLink = document.getElementById("history-link");
const blocksitesLink = document.getElementById("blocked-sites-link");
const backIcon = document.getElementById("back-icon");
const focusInput = document.getElementById("focusInput");
const saveBtn = document.getElementById("saveBtn");
const setDurationLink = document.getElementById("Set-duration-link");
const durationInputRow = document.getElementById("duration-input-row");
const arrow = setDurationLink.querySelector(".arrow");

// Navigation stack
let navigationStack = ['timer-page'];

// Page show logic
function showPage(pageId) {
  timerPage.classList.add("hidden");
  settingsPage.classList.add("hidden");
  historyPage.classList.add("hidden");
  menuPage.classList.add("hidden");
  blockedPage.classList.add("hidden");

  document.getElementById(pageId).classList.remove("hidden");

  const isTimer = pageId === "timer-page";
  backIcon.classList.toggle("hidden", isTimer);
  menuIcon.classList.toggle("hidden", !isTimer);
}

// Stack push on nav
function navigateTo(pageId) {
  navigationStack.push(pageId);
  showPage(pageId);
}

// Menu icon → menu page
menuIcon.addEventListener("click", () => {
  navigateTo("menu-page");
});

// Menu rows
historyLink.addEventListener("click", () => {
  navigateTo("history-page");
});

settingsLink.addEventListener("click", () => {
  navigateTo("settings-page");
});

blocksitesLink.addEventListener("click", () => {
  navigateTo("blocked-sites-page");
});

// Set Duration toggle
let isOpen = false;
document.getElementById("saveBtn").addEventListener("click", function (){
  const focusTime = parseInt(focusInput.value);
  if (focusTime >= 1 && focusTime <= 90) {
    localStorage.setItem("focusTime", focusTime);
    timeLeft = focusTime * 60; // Update timer with new duration
    updateDisplay();
    durationInputRow.classList.remove("open");
    arrow.innerHTML = "&#709;"; // Up arrow
    isOpen = false;
  } else {
    alert("Please enter a valid duration between 1 and 90 minutes.");
  }
});
setDurationLink.addEventListener("click", function () {
  if (isOpen) {
    durationInputRow.classList.remove("open");
    arrow.innerHTML = "˄"; // Up arrow
  } else {
    durationInputRow.classList.add("open");
    arrow.innerHTML = "˅"; // Down arrow
  }

  isOpen = !isOpen;
});

// Back button
backIcon.addEventListener("click", () => {
  if (navigationStack.length > 1) {
    navigationStack.pop();
  }
  const previousPageId = navigationStack[navigationStack.length - 1];
  showPage(previousPageId);
});


// --- OTHER FUNCTIONALITY ---

// Dark mode toggle
document.getElementById('darkModeBtn').addEventListener('change', function () {
  if (this.checked) {
    document.body.classList.add('dark');
    localStorage.setItem("theme", "dark");
  } else {
    document.body.classList.remove('dark');
    localStorage.setItem("theme", "light");
  }
});

// Apply saved theme
if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark");
  document.getElementById("darkModeBtn").checked = true;
}


// --- Close Icon (Fix for Chrome Extension) ---

const closeIcon = document.getElementById("close-icon");
closeIcon.addEventListener("click", () => {
  if (typeof window.close === "function") {
    window.close();
  } else {
    console.log("Window cannot be closed from script in this context.");
  }
});
