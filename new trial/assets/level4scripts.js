const startButton = document.getElementById("start-btn");
const gameIntro = document.getElementById("game-intro");
const gameArea = document.getElementById("game-area");
const instruction = document.getElementById("instruction");
const gridContainer = document.getElementById("grid-container");
const sequenceContainer = document.getElementById("sequence-container");
const progressText = document.getElementById("progress-text");
const npcAudio = new Audio();

const roundData = [
    {audio: "npc_1.mp3", sequence: ["water", "food", "shelter"]},
    {audio: "npc_2.mp3", sequence: ["food", "shelter", "water", "campfire"]},
    {audio: "npc_0.mp3", sequence: ["shelter", "food", "water", "campfire"]}
];

let currentRound = 0;
let correctSequence = [];
let playerSequence = [];

startButton.addEventListener("click", startGame);

function startGame() {
    gameIntro.style.display = "none";
    gameArea.style.display = "block";
    currentRound = 0;
    setupRound();
}

function setupRound() {
    playerSequence = [];
    correctSequence = roundData[currentRound].sequence;
    
    document.getElementById("round-text").innerText = `Round: ${currentRound + 1} / ${roundData.length}`;
    instruction.innerText = `Click order: ${correctSequence.join(" → ")}`;
    progressText.innerText = `Progress: ${currentRound + 1} / ${roundData.length}`;

    playLoopingAudio(roundData[currentRound].audio);//Play voice prompt
    createGrid();
    displaySequence();

    // New functionality: Images disappear after a set time
    let displayTime = [10000, 5000, 2000]; //  Each round picture display time: Round 1 10 seconds, round 2 5 seconds, round 3 2 seconds
    gridContainer.style.pointerEvents = 'none'; // disable clicks initially

    setTimeout(() => {
        document.querySelectorAll('.grid-item img').forEach(img => {
            img.style.visibility = 'hidden';
        });
        gridContainer.style.pointerEvents = 'auto'; // enable clicks after images hidden
    }, displayTime[currentRound]);
}



function playLoopingAudio(audioFile) {
    npcAudio.src = `assets/audio/${audioFile}`;
    npcAudio.play();
    npcAudio.onended = () => setTimeout(() => npcAudio.play(), 3000);
}

function createGrid() {
    gridContainer.innerHTML = "";

    const shuffledImages = shuffle([...correctSequence]);
    shuffledImages.forEach(item => {
        const div = document.createElement("div");
        div.classList.add("grid-item");

        const img = document.createElement("img");
        img.src = `assets/images/${item}.png`;
        img.dataset.name = item;

        div.appendChild(img);
        div.onclick = () => handleSelection(img, div);
        gridContainer.appendChild(div);
    });

    while(gridContainer.childElementCount < 16){
        const emptyDiv = document.createElement("div");
        emptyDiv.classList.add("grid-item", "empty");
        gridContainer.appendChild(emptyDiv);
    }

    shuffle([...gridContainer.children]).forEach(item => gridContainer.appendChild(item));
}

function handleSelection(img, div) {
    const selection = img.dataset.name;
    const correctAnswer = correctSequence[playerSequence.length];

    if (selection === correctAnswer) {
        div.style.opacity = 0.5;
        playerSequence.push(selection);
        updateSequenceDisplay();

        if (playerSequence.length === correctSequence.length) {
            npcAudio.pause();
            if (++currentRound < roundData.length) {
                setTimeout(setupRound, 1000);
            } else {
                setTimeout(setupFinalRound, 1000);
            }
        }
    } else {
        alert("Incorrect order, please retry!");
        setupRound();
    }
}

function displaySequence() {
    sequenceContainer.innerHTML = "";
    correctSequence.forEach(item => {
        const span = document.createElement("span");
        span.innerText = item;
        span.classList.add("sequence-item");
        sequenceContainer.appendChild(span);
    });
}

function updateSequenceDisplay() {
    const items = sequenceContainer.children;
    for (let i = 0; i < playerSequence.length; i++) {
        items[i].style.opacity = 0.5;
    }
}

// Final round logic:
function setupFinalRound() {
    gameArea.style.display = "none";
    npcAudio.pause();

    const finalRound = document.createElement("div");
    finalRound.id = "final-round";

    const dragContainer = document.createElement("div");
    dragContainer.id = "drag-container";

    ["food", "shelter", "water", "campfire"].sort(() => Math.random() - 0.5).forEach(item => {
        const div = document.createElement("div");
        div.innerText = item;
        div.draggable = true;
        div.classList.add("sequence-item");
        div.ondragstart = () => (window.dragging = div);
        div.ondragover = e => e.preventDefault();
        div.ondrop = e => {
            e.preventDefault();
            dragContainer.insertBefore(window.dragging, div);
        };
        dragContainer.appendChild(div);
    });

    const submitBtn = document.createElement("button");
    submitBtn.innerText = "Submit Order";
    submitBtn.onclick = () => {
        const userOrder = [...dragContainer.children].map(el => el.innerText);
        downloadUserOrder(userOrder);
        alert("Game completed! Your order is saved.");
    };

    finalRound.appendChild(document.createTextNode("Drag to match the sequence heard in Round 1:"));
    finalRound.appendChild(dragContainer);
    finalRound.appendChild(submitBtn);
    document.body.appendChild(finalRound);
}

function downloadUserOrder(order) {
    const blob = new Blob([order.join("\n")], { type: "text/plain" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "final_order.txt";
    a.click();
}

function shuffle(array) {
    return array.sort(() => Math.random() - 0.5);
}
