const rounds = [
    { order: ["water", "food", "shelter"], audio: "assets/audio/npc_0.mp3" },
    { order: ["food", "shelter", "water", "campfire"], audio: "assets/audio/npc_1.mp3" },
    { order: ["campfire", "water", "food", "shelter"], audio: "assets/audio/npc_2.mp3" } 
];

let currentRound = 0;
let currentSequence = [];
let playerInput = [];

const npcAudio = document.getElementById("npc-audio");
const playAudioBtn = document.getElementById("play-audio-btn");
const progressBar = document.getElementById("progress-bar");
const gameStatusText = document.getElementById("game-status-text");
const nextRoundBtn = document.getElementById("next-round-btn");

function startGame() {
    currentRound = 0;
    nextRoundBtn.style.display = "none"; 
    startNextRound();
}

// Start the next round
function startNextRound() {
    if (currentRound >= rounds.length) {
        alert("Congratulations on completing all rounds of the challenge!");
        gameStatusText.innerText = "🎉Game complete ！";
        return;
    }

    const roundData = rounds[currentRound]; // Get the data of the current round
    currentSequence = roundData.order; // Set the correct order for the current round
    playerInput = []; // Clear the player input record
    updateProgress();

    gameStatusText.innerText = `Round ${currentRound + 1} ，Please follow the voice instructions and click！`;

    // Audio button Click to play the audio of the round
    playAudioBtn.onclick = () => {
        npcAudio.src = roundData.audio;
        npcAudio.play();
    };
}

// User click processing
function handleChoice(choice) {
    const expectedChoice = currentSequence[playerInput.length];

    if (choice !== expectedChoice) {
        alert("❌Wrong order. Please restart the round！");
        playerInput = [];
        updateProgress();
        return;
    }

    playerInput.push(choice);
    updateProgress();

   // If the player completes the current round
    if (playerInput.length === currentSequence.length) {
        gameStatusText.innerText = `✅ Round ${currentRound + 1} ！Going to the next round...`;
        currentRound++;
        setTimeout(startNextRound, 2000); // Wait 2 seconds to automatically enter the next round
    }
}


function updateProgress() {
    const percent = (playerInput.length / currentSequence.length) * 100;
    progressBar.style.width = percent + "%";
}

window.onload = startGame;
