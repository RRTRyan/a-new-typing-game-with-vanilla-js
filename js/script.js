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
let isOngoing = false

let pressCount = 0
let totalChar = 0
let correctInput = 0
let invalidInput = 0
const wpmHistory = []

const wordsToType = [];

const easyDifficulty = document.getElementById('mode--input-easy');
const mediumDifficulty = document.getElementById('mode--input-medium');
const hardDifficulty = document.getElementById('mode--input-hard');
let difficultySelect = easyDifficulty.value
easyDifficulty.addEventListener('change', () => {
    difficultySelect = easyDifficulty.value
    startTest()
})
mediumDifficulty.addEventListener('change', () => {
    difficultySelect = mediumDifficulty.value
    startTest()
})
hardDifficulty.addEventListener('change', () => {
    difficultySelect = hardDifficulty.value
    startTest()
})

const timerMode = document.getElementById('mode--input-time');
const wordMode = document.getElementById('mode--input-word');
let challengeSelect = wordMode.value
timerMode.addEventListener('change', () => {
    challengeSelect = timerMode.value
    startTest()
})
wordMode.addEventListener('change', () => {
    challengeSelect = wordMode.value
    startTest()
})

const shortLength = document.getElementById('mode--input-short');
const mediumLength = document.getElementById('mode--input-normal');
const longLength = document.getElementById('mode--input-long');
const longerLength = document.getElementById('mode--input-longer');
let lengthSelect = mediumLength.value
shortLength.addEventListener('change', () => {
    lengthSelect = shortLength.value
    startTest()
})
mediumLength.addEventListener('change', () => {
    lengthSelect = mediumLength.value
    startTest()
})
longLength.addEventListener('change', () => {
    lengthSelect = longLength.value
    startTest()
})
longerLength.addEventListener('change', () => {
    lengthSelect = longerLength.value
    startTest()
})

const flexibleStyle = document.getElementById('mode--input-flexible');
const strictStyle = document.getElementById('mode--input-strict');
let styleSelect = flexibleStyle.value
flexibleStyle.addEventListener('change', () => {
    styleSelect = flexibleStyle.value
    startTest()
})
strictStyle.addEventListener('change', () => {
    styleSelect = strictStyle.value
    startTest()
})


const wordDisplay = document.getElementById("word-display");
const inputField = document.getElementById("input-field");
const results = document.getElementById("results");
const remaining = document.getElementById("remaining-words");
const restartButton = document.querySelector('.choco--restart')

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

const wordGeneration = (wordCount, style = styleSelect) => {
    for (let i = 0; i < wordCount; i++) {
        wordsToType.push(getRandomWord(difficultySelect));
    }

    wordsToType.forEach((word, wordIndex) => {
        const fullWord = document.createElement('div');
        fullWord.classList.add('word')
        word.split('').forEach((letter, letterIndex) => {
            const letterSpan = document.createElement('span')
            letterSpan.textContent = letter
            if (letterIndex === 0 && wordIndex === 0 && style == 'mt') {
                letterSpan.style.color = 'orange'
            }
            fullWord.appendChild(letterSpan);
        })
        if (wordIndex != wordsToType.length - 1) { fullWord.innerHTML += '' }
        fullWord.style.color = '#9B867A'
        if (wordIndex === 0 && style != 'mt') fullWord.style.color = "orange"; // Highlight first word
        wordDisplay.appendChild(fullWord);
    });
}

// Initialize the typing test
const startTest = (wordCount, challenge = challengeSelect) => {
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
    wordDisplay.scrollTop = 0

    switch (challenge) {
        case 'word':
            remaining.innerText = Number(lengthSelect.match(/\d+/));
            wordCount = Number(lengthSelect.match(/\d+/));
            break;

        case 'timer':
            remaining.innerText = Math.round((lengthSelect.match(/\d+/)));
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
    // if (!isOngoing) {
    //     if (wpmHistory.length != 0) results.innerHTML += `<p>${(wpmHistory.reduce((a, b) => a + b) / wpmHistory.length).toFixed(2)}</p>`
    // }
}

// Start the timer when user begins typing
const startTimer = (event) => {
    if (!startTime && (String(event.key).match(/^\S$/))) startTime = Date.now();
};

const showRemaining = (event, challenge = challengeSelect) => {
    switch (challenge) {
        case 'word':
            if (event.key == ' ') {
                remaining.innerText = wordDisplay.innerHTML.split("word").length - currentWordIndex - 1
            }
            if (remaining.innerText == 0) endTest()
            break;

        case 'timer':
            if (pressCount == 0 && String(event.key).match(/^\S$/)) {
                const remainingTime = setInterval(() => {
                    remaining.innerText = Math.round((startTime + lengthSelect.match(/\d+/) * 1000 - Date.now()) / 1000)
                    if (remaining.innerText == 0) {
                        if (remaining.innerText == 0) remaining.innerText = 0
                        clearInterval(remainingTime)
                        endTest()
                    } else if (remaining.innerText < 0) {
                        clearInterval(remainingTime)
                        remaining.innerText = lengthSelect.match(/\d+/)
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

const isLetterCorrect = (event, style = styleSelect) => {
    const wordLetters = wordDisplay.children;
    if (currentLetterIndex < wordsToType[currentWordIndex].length) {
        if ((event.key.match(/^\S$/) == wordsToType[currentWordIndex][currentLetterIndex])) {
            correctInput++
            currentLetterIndex++
            if (style == 'mt') {
                wordLetters[currentWordIndex].children[currentLetterIndex - 1].style.color = '#ffffff'
                wordLetters[currentWordIndex].children[currentLetterIndex - 1].classList.add('typed-letter')
                if (currentLetterIndex - 1 != wordsToType[currentWordIndex].length - 1) wordLetters[currentWordIndex].children[currentLetterIndex].style.color = 'orange'
            }
        } else if (event.key.match(/^\S$/)) {
            currentLetterIndex++
            if (style == 'mt') {
                wordLetters[currentWordIndex].children[currentLetterIndex - 1].style.color = 'red'
                wordLetters[currentWordIndex].children[currentLetterIndex - 1].classList.add('typed-letter')
                if (currentLetterIndex != wordsToType[currentWordIndex].length) wordLetters[currentWordIndex].children[currentLetterIndex].style.color = 'orange'
            }
        }
    } else inputOverflow(event, style)
    inputBackspace(event, style)

}

const inputBackspace = (event, style) => {
    const wordLetters = wordDisplay.children;
    if (event.key === 'Backspace' && currentLetterIndex >= 0 && currentLetterIndex < wordsToType[currentWordIndex].length) {
        if (style == 'mt') wordLetters[currentWordIndex].children[currentLetterIndex].style.color = ''
        if (currentLetterIndex == 0 && currentWordIndex > 0) {
            currentWordIndex--
            currentLetterIndex = (wordLetters[currentWordIndex].innerHTML.split(/typed-letter/).length + wordLetters[currentWordIndex].innerHTML.split(/overflowLetter/).length - 3)
            if (style == 'mt' && currentLetterIndex < wordsToType[currentWordIndex].length) {
                wordLetters[currentWordIndex].children[currentLetterIndex].style.color = 'orange'
                wordLetters[currentWordIndex + 1].children[0].classList.remove('typed-letter')
            }
        } else if (currentLetterIndex > 0 && currentWordIndex >= 0) {
            currentLetterIndex--
            if (style == 'mt') {
                wordLetters[currentWordIndex].children[currentLetterIndex].style.color = 'orange'
                wordLetters[currentWordIndex].children[currentLetterIndex].classList.remove('typed-letter')
            }
        } else if (currentLetterIndex == 0 && currentWordIndex == 0) {
            if (style == 'mt') {
                wordLetters[currentWordIndex].children[currentLetterIndex].style.color = 'orange'
                wordLetters[currentWordIndex].children[currentLetterIndex].classList.remove('typed-letter')
            }
        }
    } else if (event.key === 'Backspace') {
        currentLetterIndex--
        if (currentLetterIndex + 1 > wordsToType[currentWordIndex].length) wordLetters[currentWordIndex].lastChild.remove('span')
        if (style == 'mt' && currentLetterIndex + 1 == wordsToType[currentWordIndex].length) { wordLetters[currentWordIndex].children[currentLetterIndex].style.color = 'orange' }
    }
    console.log(currentLetterIndex)
    console.log(wordLetters[currentWordIndex].innerHTML.split(/typed-letter/).length + wordLetters[currentWordIndex].innerHTML.split(/overflowLetter/).length - 3)
    // console.log(wordLetters[currentWordIndex].children[currentLetterIndex - 1].outerHTML)
}

const inputOverflow = (event, style) => {
    const wordLetters = wordDisplay.children;
    if (event.key.match(/^\S$/) && currentLetterIndex >= wordsToType[currentWordIndex].length && style == 'mt') {
        const overflowLetter = document.createElement('span');
        overflowLetter.textContent = event.key
        overflowLetter.classList.add('overflowLetter')
        overflowLetter.style.color = 'red'
        wordLetters[currentWordIndex].appendChild(overflowLetter)
        currentLetterIndex++
    }
}

// Move to the next word and update stats only on spacebar press
const updateWord = (event, style = styleSelect) => {
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
        results.innerHTML = `<div class="stats--wmp"><span class="stats--header">WPM:</span> <span class="stats--number">${wpm}</span></div>`
        results.innerHTML += `<div class="stats--accuracy"><span class="stats--header">Accuracy:</span> <span class="stats--number">${accuracy}%</span></div>`
    } else {
        let resultsCopy = results.textContent
        const wpmPattern = (Number(resultsCopy.match(/[0-9]*\.?[0-9]*(?=A)/))) // Regexp for finding WPM old value
        if (wpmPattern > wpm) {
            results.innerHTML = `<div class="stats--wmp"><span class="stats--header">WPM:</span> <span class="stats--number" style='color: red'>${wpm}</span></div>`
        } else {
            results.innerHTML = `<div class="stats--wmp"><span class="stats--header">WPM:</span> <span class="stats--number" style='color: green'>${wpm}</span></div>`
        }

        const accuracyPattern = (Number(resultsCopy.match(/[0-9]*\.?[0-9]*(?=%)/)))
        if (accuracyPattern > accuracy) {
            results.innerHTML += `<div class="stats--accuracy"><span class="stats--header">Accuracy:</span> <span class="stats--number" style='color: red'>${accuracy}%</span></div>`
        } else {
            results.innerHTML += `<div class="stats--accuracy"><span class="stats--header">Accuracy:</span> <span class="stats--number" style='color: green'>${accuracy}%</span></div>`
        }
    }
}

// Highlight the current word in red
const highlightNextWord = (style = styleSelect) => {
    const wordElements = wordDisplay.children;
    if (currentWordIndex <= wordElements.length) {
        if (currentWordIndex == wordElements.length) {
            wordElements[currentWordIndex - 1].style.color = "#ffffff";
            if (challengeSelect == 'timer') {
                wordDisplay.innerHTML = ''
                currentWordIndex = 0;
                wordsToType.length = 0;
                wordGeneration(10);
            }
        } else if (currentWordIndex > 0) {
            if (style != 'mt') wordElements[currentWordIndex - 1].style.color = "#ffffff";
            (style != 'mt') ? wordElements[currentWordIndex].style.color = "orange" : wordElements[currentWordIndex].children[0].style.color = "orange";
        }
    }
};

const displayScroll = () => {
    const wordElements = wordDisplay.children
    console.log(Math.floor(wordElements[currentWordIndex].getBoundingClientRect().top - remaining.getBoundingClientRect().top))
    console.log(wordDisplay.scrollTop)
    if (Math.floor(wordElements[currentWordIndex].getBoundingClientRect().top) - remaining.getBoundingClientRect().top > 85) {
        wordDisplay.style.scrollBehavior = 'smooth'
        wordDisplay.scrollTop = wordElements[currentWordIndex].getBoundingClientRect().top
    }
}

// Event listeners
// Attach `updateWord` to `keydown` instead of `input`
inputField.addEventListener("keydown", (event) => {
    if (isOngoing) {
        // displayScroll();
        startTimer(event);
        isLetterCorrect(event);
        updateWord(event);
        showRemaining(event);
        getPressCount(event);
    }
});

restartButton.addEventListener('click', () => startTest());

// Start the test
startTest();




const toggleBtn = document.getElementById('options-toggle');
const overlay = document.getElementById('overlay-menu');
const closeBtn = document.getElementById('close-overlay');

toggleBtn.addEventListener('click', () => {
    overlay.classList.remove('hidden');
});

closeBtn.addEventListener('click', () => {
    overlay.classList.add('hidden');
});

overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
        overlay.classList.add('hidden');
    }
});


