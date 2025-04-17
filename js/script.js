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
let isOngoing = true
let totalChar = 0
const wordsToType = [];

const modeSelect = document.getElementById("mode");
const timerSelect = document.getElementById("timer");
const challengeSelect = document.getElementById("challenge");
const wordDisplay = document.getElementById("word-display");
const inputField = document.getElementById("input-field");
const results = document.getElementById("results");
const remaining = document.getElementById("remaining-words");

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

const wordGeneration = (wordCount) => {
    for (let i = 0; i < wordCount; i++) {
        wordsToType.push(getRandomWord(modeSelect.value));
    }

    wordsToType.forEach((word, index) => {
        const span = document.createElement("span");
        span.textContent = word + " ";
        if (index === 0) span.style.color = "red"; // Highlight first word
        wordDisplay.appendChild(span);
    });
}

// Initialize the typing test
const startTest = (wordCount, challenge = challengeSelect.value) => {
    wordsToType.length = 0; // Clear previous words
    wordDisplay.innerHTML = ""; // Clear display
    currentWordIndex = 0;
    startTime = null;
    previousEndTime = null;
    pressCount = 0;
    isOngoing = true;
    totalChar = 0;

    switch (challenge) {
        case 'word':
            remaining.innerText = Number(timerSelect.value.match(/\d+/));
            wordCount = Number(timerSelect.value.match(/\d+/));
            break;

        case 'timer':
            remaining.innerText = Math.round((timerSelect.value.match(/\d+/)));
            wordCount = 10
            break;

        default: alert("duh")
            break;
    }

    wordGeneration(wordCount)

    inputField.value = "";
    results.textContent = "";
};

const endTest = () => {
    isOngoing = false;
    if (!isOngoing) {
        results.innerHTML += '<button style="display: block" id="restart-button"><p>Restart ?</p></button>'
        document.getElementById("restart-button").addEventListener('click', () => {
            startTest()
        })
    }
}

// Start the timer when user begins typing
const startTimer = (event) => {
    if (!startTime && (String(event.key).match(/^\S$/))) startTime = Date.now();
};

const showRemaining = (event, challenge = challengeSelect.value) => {
    switch (challenge) {
        case 'word':
            if (event.key == ' ') {
                remaining.innerText = wordDisplay.innerText.split(" ").length - currentWordIndex
            }
            if (remaining.innerText == 0) endTest()
            break;

        case 'timer':
            if (pressCount == 0 && String(event.key).match(/^\S$/)) {
                const remainingTime = setInterval(() => {
                    remaining.innerText = Math.round((startTime + timerSelect.value.match(/\d+/) * 1000 - Date.now()) / 1000)
                    if (remaining.innerText <= 0) {
                        remaining.innerText = timerSelect.value.match(/\d+/)
                        clearInterval(remainingTime)
                        endTest()
                    }
                }, 1000)
            }
            break;

        default: alert("Still working on it")
            break;
    }
}

// Calculate and return WPM & accuracy
const getCurrentStats = () => {
    const elapsedTime = (Date.now() - previousEndTime) / 1000; // Seconds
    const wpm = (wordsToType[currentWordIndex].length / 5) / (elapsedTime / 60); // 5 chars = 1 word
    totalChar += wordsToType[currentWordIndex].length
    const accuracy = (totalChar / pressCount) * 100;

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
    if (currentWordIndex <= wordElements.length) {
        if (currentWordIndex == wordElements.length) {
            wordElements[currentWordIndex - 1].style.color = "black";
            if (challengeSelect.value = 'timer') {
                wordDisplay.innerHTML = ''
                currentWordIndex = 0;
                wordsToType.length = 0;
                wordGeneration(10);
            }
        } else if (currentWordIndex > 0) {
            wordElements[currentWordIndex - 1].style.color = "black";
            wordElements[currentWordIndex].style.color = "red";
        }
    }
};

// Event listeners
// Attach `updateWord` to `keydown` instead of `input`
inputField.addEventListener("keydown", (event) => {
    if (isOngoing) {
        startTimer(event);
        updateWord(event);
        showRemaining(event);
        getPressCount(event);
    }
});

modeSelect.addEventListener("change", () => startTest());
timerSelect.addEventListener("change", () => startTest());
challengeSelect.addEventListener("change", () => startTest());

// Start the test
startTest();0