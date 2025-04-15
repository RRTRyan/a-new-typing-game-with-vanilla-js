/**
 * Point culture (en Français car je suis un peu obligé): 
 * Dans ce genre de jeu, un mot equivaut a 5 caractères, y compris les espaces. 
 * La precision, c'est le pourcentage de caractères tapées correctement sur toutes les caractères tapées.
 * 
 * Sur ce... Amusez-vous bien ! 
 */
let startTime = null, previousEndTime = null;
let currentWordIndex = 0;
let pressCount = 0
const wordsToType = [];

const modeSelect = document.getElementById("mode");
const timerSelect = document.getElementById("timer");
const wordDisplay = document.getElementById("word-display");
const inputField = document.getElementById("input-field");
const results = document.getElementById("results");

const words = {
    easy: ["apple", "banana", "grape", "orange", "cherry"],
    medium: ["keyboard", "monitor", "printer", "charger", "battery"],
    hard: ["synchronize", "complicated", "development", "extravagant", "misconception"]
};

// Generate a random word from the selected mode
const getRandomWord = (mode) => {
    const wordList = words[mode];
    return wordList[Math.floor(Math.random() * wordList.length)];
};

// Initialize the typing test
const startTest = (wordCount = timerSelect.value.match(/\d+/)) => {
    wordsToType.length = 0; // Clear previous words
    wordDisplay.innerHTML = ""; // Clear display
    currentWordIndex = 0;
    startTime = null;
    previousEndTime = null;
    pressCount = 0;

    for (let i = 0; i < wordCount; i++) {
        wordsToType.push(getRandomWord(modeSelect.value));
    }

    wordsToType.forEach((word, index) => {
        const span = document.createElement("span");
        span.textContent = word + " ";
        if (index === 0) span.style.color = "red"; // Highlight first word
        wordDisplay.appendChild(span);
    });

    inputField.value = "";
    results.textContent = "";
};

// Start the timer when user begins typing
const startTimer = () => {
    if (!startTime) startTime = Date.now();
};

// Calculate and return WPM & accuracy
const getCurrentStats = () => {
    const elapsedTime = (Date.now() - previousEndTime) / 1000; // Seconds
    const wpm = (wordsToType[currentWordIndex].length / 5) / (elapsedTime / 60); // 5 chars = 1 word
    const accuracy = (wordsToType.slice(0, currentWordIndex + 1).join("").length / pressCount) * 100;

    return { wpm: wpm.toFixed(2), accuracy: accuracy.toFixed(2) };
};

// Count user key presses
const getPressCount = (event) => {
    if (String(event.key).match(/^\S$/)) { pressCount++ }
}

// Move to the next word and update stats only on spacebar press
const updateWord = (event) => {
    if (event.key === " ") { // Check if spacebar is pressed
        if (inputField.value.trim() === wordsToType[currentWordIndex]) {
            if (!previousEndTime) previousEndTime = startTime;

            const { wpm, accuracy } = getCurrentStats();
            statsEvolution(wpm, accuracy)

            currentWordIndex++;
            previousEndTime = Date.now();
            highlightNextWord();

            inputField.value = ""; // Clear input field after space
            event.preventDefault(); // Prevent adding extra spaces
        }
    }
};

// Display results with color when changing
const statsEvolution = (wpm, accuracy) => {
    if (!results.textContent) {
        results.textContent = `WPM: ${wpm}, Accuracy: ${accuracy}%`;
    } else {
        let resultsCopy = results.textContent

        const wpmPattern = (Number(resultsCopy.match(/[0-9]*\.?[0-9]*(?=,)/))) // Regexp for finding WPM old value
        if (wpmPattern > wpm) {
            results.innerHTML = `WPM: <span style='color: red'>${wpm}</span>`
        } else {
            results.innerHTML = `WPM: <span style='color: green'>${wpm}</span>`
        }

        const accuracyPattern = (Number(resultsCopy.match(/[0-9]*\.?[0-9]*(?=%)/)))
        if (accuracyPattern > accuracy) {
            results.innerHTML += `, Accuracy: <span style='color: red'>${accuracy}%</span>`
        } else {
            results.innerHTML += `, Accuracy: <span style='color: green'>${accuracy}%</span>`
        }
    }
}

// Highlight the current word in red
const highlightNextWord = () => {
    const wordElements = wordDisplay.children;
    alert(wordDisplay.innerHTML)
    if (currentWordIndex < wordElements.length) {
        if (currentWordIndex > 0) {
            wordElements[currentWordIndex - 1].style.color = "black";
        }
        wordElements[currentWordIndex].style.color = "red";
    }
};

// Event listeners
// Attach `updateWord` to `keydown` instead of `input`
inputField.addEventListener("keydown", (event) => {
    startTimer();
    getPressCount(event)
    updateWord(event);
});
modeSelect.addEventListener("change", () => startTest());
timerSelect.addEventListener("change", () => startTest());

// Start the test
startTest();