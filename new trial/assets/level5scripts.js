let wolf = document.getElementById('wolf');
let gameContainer = document.getElementById('game-container');
let progressBar = document.getElementById('progress-bar');
let timerEl = document.getElementById('timer');


let progress = 0;
let elapsedSeconds = 0;
const gameDuration = 60;
let progressInterval, timerInterval, moveInterval;

function getRandomPosition() {
    let x = Math.random() * (gameContainer.offsetWidth - wolf.offsetWidth);
    let y = Math.random() * (gameContainer.offsetHeight - wolf.offsetHeight);
    return { x, y };
}

function smoothlyMoveWolf() {
    let position = getRandomPosition();
    wolf.style.transition = 'top 0.5s linear, left 0.5s linear';
    wolf.style.left = `${position.x}px`;
    wolf.style.top = `${position.y}px`;
}

function updateProgress(amount) {
    let current = parseFloat(progressBar.style.width) || 0;
    let newProgress = Math.min(Math.max(currentProgress + amount, 0), 100);
    progressBar.style.width = `${newProgress}%`;
    if(newProgress >= 100) endGame(false);
}

function increaseProgress() {
    progress = Math.min(progress + 3, 100);
    progressBar.style.width = `${progress}%`;
    if(progress >= 100) endGame(false);
}

wolf.onclick = () => {
    progress = Math.max(progress - 5, 0);
    progressBar.style.width = `${progress}%`;
    smoothlyMoveWolf();
};

function startTimer(duration) {
    let remaining = duration;
    updateTimerDisplay(remaining);

    timerInterval = setInterval(() => {
        remaining--;
        updateTimerDisplay(remaining);

        // Trigger sound and wolf disappearance at 15 and 40 seconds left
        if (remaining === 45 || remaining === 20) { // Since you're counting down from 60
            triggerWolfDisappearance(5);
        }

        if (remaining <= 0) endGame(true);
    }, 1000);
}


function endGame(success) {
    clearInterval(timerInterval);
    clearInterval(progressInterval);
    wolf.style.display = "none";
    alert(success ? "Congratulations, you win!" : "Game Over!");
}

wolf.onclick = () => {
    progress = Math.max(progress - 5, 0);
    progressBar.style.width = `${progress}%`;
};

function startGame() {
    progress = 0;
    elapsedSeconds = 0;
    progressBar.style.width = '0%';
    wolf.style.display = 'block';
    timerEl.innerText = `Time Left: 1:00`;
    smoothlyMoveWolf();
    setInterval(smoothlyMoveWolf, 500); // smooth transition every 0.5 seconds
    setInterval(increaseProgress, 1000); // progress increases every 1 second
    startTimer(gameDuration); // pass the duration explicitly
}

function updateTimerDisplay(seconds) {
    let minutes = Math.floor(seconds / 60);
    let sec = seconds % 60;
    timerEl.innerText = `Time Left: ${minutes}:${sec < 10 ? '0'+sec : sec}`;
}

function triggerWolfDisappearance(duration) {
    let alertSound = document.getElementById('alert-sound'); // or 'alert-sound' if you added new audio
    alertSound.play();

    wolf.style.display = 'none';

    setTimeout(() => {
        wolf.style.display = 'block';
        smoothlyMoveWolf(); // reposition immediately after reappearing
    }, duration * 1000); // duration is in seconds
}



startGame();
