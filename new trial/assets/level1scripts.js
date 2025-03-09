// 1. Define all DOM elements
const startButton = document.getElementById("start-btn");
const gameIntro = document.getElementById("game-intro");
const gameArea = document.getElementById("game-area");
const progressBar = document.getElementById("progress-bar");
const progressText = document.getElementById("progress-text");
const targetImage = document.getElementById("target-image");
const choicesContainer = document.getElementById("choices-container");
const distractionsContainer = document.getElementById("distractions-container");

// 2. Game variable
let progress = 0;
const maxProgress = 12;
const correctSymbol = "flag";
const symbols = ["flag", "tree", "rock",  "house"];
const distractions = ["bird"];


startButton.addEventListener("click", startGame);

// 3. Define the start game function
function startGame() {
    gameIntro.style.display = "none";
    gameArea.style.display = "block";
    generateChoices();
    generateDistractions();
}

// 4. Generate primary options and fixed interference images
function generateChoices() {
    //Empty the options container and the interference item container, ensuring that the container is empty each time a new option is generated
    choicesContainer.innerHTML = "";
    distractionsContainer.innerHTML = "";

    let choices = [correctSymbol];
    //Filter out other symbols (exclude correct answers)
    let otherSymbols = symbols.filter(symbol => symbol !== correctSymbol);
    otherSymbols = shuffle(otherSymbols).slice(0, 3);
   
    choices = choices.concat(otherSymbols);
    // Shuffle the choices to make sure the correct answers are randomly placed
    choices = shuffle(choices);
    // Iterate through the array of options, creating picture elements for each option
    choices.forEach(symbol => {
        let img = document.createElement("img");
        img.src = `assets/images/${symbol}.png`;
        img.classList.add("choice-image");
        img.addEventListener("click", () => checkAnswer(symbol));
        choicesContainer.appendChild(img);
    });

    generateFifthDistraction();
}

// 5. Fixed interference pattern bird
function generateFifthDistraction() {
    let img = document.createElement("img");
    img.src = "assets/images/bird.png";
    img.classList.add("distraction-image");
    distractionsContainer.appendChild(img);
}

// 6. Update progress bar
function updateProgress(correct) {
    if (progress >= 12) return;
    progress += correct ? 2 : 1;
    let progressPercent = Math.min((progress / 12) * 100, 100);
    progressBar.style.width = progressPercent + "%";
    progressText.innerText = `Process: ${progress} / 12`;
    if (progress >= 12) setTimeout(() => alert("任务完成！"), 500);
}


function checkAnswer(selectedSymbol) {
    let correct = selectedSymbol === correctSymbol;
    updateProgress(correct);
    generateChoices();
}


function generateDistractions() {
    
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}
