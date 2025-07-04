let timer;
let timeLeft = 25 * 60;
let isRunning = false;

const timerDisplay = document.getElementById("timer");
const startBtn = document.getElementById("start");
const pauseBtn = document.getElementById("pause");
const resetBtn = document.getElementById("reset");

/* ▶▶  NEW: preload tick sound  ◀◀ */
const tick = new Audio("sounds/tick.mp3");
tick.volume = 0.35;                 // keep it subtle

function playTick() {
  tick.currentTime = 0;             // rewind so rapid clicks always play
  tick.play().catch(() => {});      // ignore autoplay errors
}

function updateDisplay() {
  const m = Math.floor(timeLeft / 60).toString().padStart(2, "0");
  const s = (timeLeft % 60).toString().padStart(2, "0");
  timerDisplay.textContent = `${m}:${s}`;
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
        alert("Time's up!");
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
  timeLeft = 25 * 60;
  updateDisplay();
  isRunning = false;
}

/* wire up events */
startBtn.addEventListener("click", startTimer);
pauseBtn.addEventListener("click", pauseTimer);
resetBtn.addEventListener("click", resetTimer);

updateDisplay();
