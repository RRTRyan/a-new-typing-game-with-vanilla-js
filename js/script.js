/**
 * Point culture (en Français car je suis un peu obligé): 
 * Dans ce genre de jeu, un mot equivaut a 5 caractères, y compris les espaces. 
 * La precision, c'est le pourcentage de caractères tapées correctement sur toutes les caractères tapées.
 * 
 * Sur ce... Amusez-vous bien ! 
 */
let startTime = null, previousEndTime = null;
let currentWordIndex = 0;
let currentLetterIndex = 0;
let isOngoing = true

let pressCount = 0
let totalChar = 0
let correctInput = 0
let invalidInput = 0
const wpmHistory = []

const wordsToType = [];

const modeSelect = document.getElementById("mode");
const timerSelect = document.getElementById("timer");
const challengeSelect = document.getElementById("challenge");
const styleSelect = document.getElementById("style");
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

const wordGeneration = (wordCount, style = styleSelect.value) => {
    for (let i = 0; i < wordCount; i++) {
        wordsToType.push(getRandomWord(modeSelect.value));
    }

    wordsToType.forEach((word, wordIndex) => {
        const fullWord = document.createElement('span');
        word.split('').forEach((letter, letterIndex) => {
            const letterSpan = document.createElement('span')
            letterSpan.textContent = letter
            if (letterIndex === 0 && wordIndex === 0 && style == 'mt') {
                letterSpan.style.color = 'orange'
            }
            fullWord.appendChild(letterSpan);
        })
        if (wordIndex != wordsToType.length - 1) { fullWord.innerHTML += ' ' }
        if (wordIndex === 0 && style != 'mt') fullWord.style.color = "orange"; // Highlight first word
        wordDisplay.appendChild(fullWord);
    });
}

// Initialize the typing test
const startTest = (wordCount, challenge = challengeSelect.value) => {
    wordsToType.length = 0; // Clear previous words
    wordDisplay.innerHTML = ""; // Clear display

    currentWordIndex = 0;
    currentLetterIndex = 0;
    startTime = null;
    previousEndTime = null;
    isOngoing = true;

    pressCount = 0;
    totalChar = 0;
    correctInput = 0;
    invalidInput = 0;
    wpmHistory.length = 0

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
        results.innerHTML += `<button style="display: block" id="restart-button"><p>Restart ?</p></button>`
        if (wpmHistory != []) results.innerHTML += `<p>${(wpmHistory.reduce((a, b) => a + b) / wpmHistory.length).toFixed(2)}</p>`
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
    wpmHistory.push(wpm)
    totalChar += wordsToType[currentWordIndex].length
    const accuracy = (correctInput / (pressCount + invalidInput)) * 100

    return { wpm: wpm.toFixed(2), accuracy: accuracy.toFixed(2) };
};

// Count user key presses
const getPressCount = (event) => {
    if (String(event.key).match(/^\S$/)) { pressCount++ }
}

const isLetterCorrect = (event, style = styleSelect.value) => {
    const wordLetters = wordDisplay.children;
    if (currentLetterIndex < wordsToType[currentWordIndex].length) {
        if ((event.key.match(/^\S$/) == wordsToType[currentWordIndex][currentLetterIndex])) {
            correctInput++
            currentLetterIndex++
            if (style == 'mt') {
                wordLetters[currentWordIndex].children[currentLetterIndex - 1].style.color = 'green'
                if (currentLetterIndex != wordsToType[currentWordIndex].length) wordLetters[currentWordIndex].children[currentLetterIndex].style.color = 'orange'
            }
        } else if (event.key.match(/^\S$/)) {
            currentLetterIndex++
            if (style == 'mt') {
                wordLetters[currentWordIndex].children[currentLetterIndex - 1].style.color = 'red'
                if (currentLetterIndex != wordsToType[currentWordIndex].length) wordLetters[currentWordIndex].children[currentLetterIndex].style.color = 'orange'
            }
        }
    } else {
        if (event.key.match(/^\S$/)) { currentLetterIndex++ }
    }
    inputBackspace(event, style)

}

const inputBackspace = (event, style) => {
    const wordLetters = wordDisplay.children;
    if (event.key === 'Backspace' && currentLetterIndex >= 0 && currentLetterIndex < wordsToType[currentWordIndex].length) {
        if (style == 'mt') wordLetters[currentWordIndex].children[currentLetterIndex].style.color = 'gray'
        if (currentLetterIndex == 0 && currentWordIndex > 0) {
            currentWordIndex--
            currentLetterIndex = wordsToType[currentWordIndex].length - 1
            if (style == 'mt') { wordLetters[currentWordIndex].children[currentLetterIndex].style.color = 'orange' }
        } else if (currentLetterIndex > 0 && currentWordIndex >= 0) {
            currentLetterIndex--
            if (style == 'mt') { wordLetters[currentWordIndex].children[currentLetterIndex].style.color = 'orange' }
        }
    } else if (event.key === 'Backspace') {
        currentLetterIndex--
        if (style == 'mt' && currentLetterIndex + 1 == wordsToType[currentWordIndex].length) { wordLetters[currentWordIndex].children[currentLetterIndex].style.color = 'orange' }
    }
}

// Move to the next word and update stats only on spacebar press
const updateWord = (event, style = styleSelect.value) => {
    if (event.key === " ") { // Check if spacebar is pressed
        if (inputField.value.trim() === wordsToType[currentWordIndex] || style == 'mt') {
            if (!previousEndTime) previousEndTime = startTime;

            if (style = 'mt') {
                invalidInput += wordsToType[currentWordIndex].length - currentLetterIndex
            }

            const { wpm, accuracy } = getCurrentStats();
            statsEvolution(wpm, accuracy)

            currentWordIndex++;
            currentLetterIndex = 0;
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
            if (challengeSelect.value == 'timer') {
                wordDisplay.innerHTML = ''
                currentWordIndex = 0;
                wordsToType.length = 0;
                wordGeneration(10);
            }
        } else if (currentWordIndex > 0) {
            wordElements[currentWordIndex - 1].style.color = "black";
            wordElements[currentWordIndex].style.color = "orange";
        }
    }
};

// Event listeners
// Attach `updateWord` to `keydown` instead of `input`
inputField.addEventListener("keydown", (event) => {
    if (isOngoing) {
        startTimer(event);
        isLetterCorrect(event);
        updateWord(event);
        showRemaining(event);
        getPressCount(event);
    }
});

modeSelect.addEventListener("change", () => startTest());
timerSelect.addEventListener("change", () => startTest());
challengeSelect.addEventListener("change", () => startTest());
styleSelect.addEventListener("change", () => startTest());

// Start the test
startTest();