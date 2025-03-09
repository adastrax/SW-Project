const startButton = document.getElementById("start-btn");
const gameIntro = document.getElementById("game-intro");
const gameArea = document.getElementById("game-area");
const instruction = document.getElementById("instruction");
const gridContainer = document.getElementById("grid-container");
const sequenceContainer = document.getElementById("sequence-container"); // Use to display the correct order
const progressText = document.getElementById("progress-text");

const locations = [
    { name: "Shelter", image: "shelter.png" },
    { name: "Lake", image: "lake.png" },
    { name: "Food Supply", image: "food.png" }
];

let currentRound = 1;
let totalRounds = 3;
let correctSequence = [];  // Correct sequence
let playerSequence = [];   // The order in which players click

startButton.addEventListener("click", startGame);

function startGame() {
    gameIntro.style.display = "none";  // Hide start screen
    gameArea.style.display = "block";  // Show the game interface
    startRound();
}

function startRound() {
    console.log("startRound 函数被调用");
    console.log("currentRound:", currentRound);
    console.log("correctSequence:", correctSequence);

    gridContainer.innerHTML = "";
    sequenceContainer.innerHTML = "";  // Clear sequential display
    playerSequence = [];  // Reset the player's click order

    // Randomly select 3 pictures and fill them into the grid
    let selectedLocations = shuffle([...locations]);
    correctSequence = selectedLocations.map(loc => loc.name);  // Generate correct order

    instruction.innerText = `Click in sequence: ${correctSequence.join(" → ")}`;
    document.getElementById("round-text").innerText = `Current round: ${currentRound} / ${totalRounds}`;
    document.getElementById("progress-text").innerText = `Process: ${currentRound} / ${totalRounds}`;

    // Display the correct order on the page
    correctSequence.forEach(name => {
        let span = document.createElement("span");
        span.innerText = name;
        span.classList.add("sequence-item");
        sequenceContainer.appendChild(span);
    });

    // Create a 4x4 grid
    let gridItems = Array.from({ length: 16 }, (_, index) => {
        let div = document.createElement("div");
        div.classList.add("grid-item");

        // If it's the first three squares, fill the picture
        if (index < 3) {
            let img = document.createElement("img");
            const randomLocation = selectedLocations[index];  // Make sure each location displays a different image
            img.src = `assets/images/${randomLocation.image}`;
            console.log("图片路径:", img.src);
            img.dataset.name = randomLocation.name;
            div.appendChild(img);
        } else {
            // Other cells can be left empty, or placeholders can be used
            div.classList.add("empty");
        }

        div.addEventListener("click", () => handleClick(div));
        return div;
    });

    gridItems = shuffle(gridItems);  // shuffle
    gridItems.forEach(item => gridContainer.appendChild(item));

    console.log("gridContainer 内容:", gridContainer.innerHTML);
}

function handleClick(div) {
    let img = div.querySelector("img");
    if (!img) return;  // If there is no picture, skip it

    let selectedName = img.dataset.name;  //Gets the name of the image that the player clicked on
    let expectedName = correctSequence[playerSequence.length];  

    if (selectedName === expectedName) {
        playerSequence.push(selectedName);  
        div.style.opacity = "0.5";  // Click after the style changes, indicating that it has been selected

        
        updateSequenceDisplay();

        if (playerSequence.length === correctSequence.length) {  // If the player has completed all clicks
            if (currentRound < totalRounds) {  // If it's not the last round
                currentRound++;
                progressText.innerText = `进度: ${currentRound} / ${totalRounds}`;
                setTimeout(startRound, 1000);  
            } else {  
                setTimeout(() => alert("Mission complete！"), 500);
            }
        }
    } else {
        alert("Wrong order, please select again！");  // If the sequence is wrong, give a prompt and start over
        startRound();
    }
}

function updateSequenceDisplay() {
    
    let sequenceItems = sequenceContainer.children;
    for (let i = 0; i < playerSequence.length; i++) {
        sequenceItems[i].style.opacity = "0.5"; 
    }
}

function shuffle(array) {
    console.log("shuffle 函数被调用");
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}