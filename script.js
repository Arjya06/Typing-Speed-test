const sentences = [
    "The quick brown fox jumps over the lazy dog.",
    "Typing fast is a useful skill to develop.",
    "Practice makes perfect, keep going!",
    "JavaScript is fun and powerful.",
    "Keep your fingers on the home row position."
];

let currentSentence = "";
let startTime, timerInterval;
let typedCharacters = 0;
let correctCharacters = 0;
let isRunning = false;

// Get high score from local storage
let bestWPM = localStorage.getItem("bestWPM") || 0;
document.getElementById("best-wpm").innerText = bestWPM;

function startTest() {
    document.getElementById("input").value = "";
    document.getElementById("input").disabled = false;
    document.getElementById("input").focus();

    isRunning = true; // Test is running

    // Pick a random sentence
    currentSentence = sentences[Math.floor(Math.random() * sentences.length)];
    document.getElementById("text").innerText = currentSentence;

    // Reset stats
    typedCharacters = 0;
    correctCharacters = 0;
    document.getElementById("timer").innerText = "0";
    document.getElementById("wpm").innerText = "0";
    document.getElementById("accuracy").innerText = "100";
    document.getElementById("progress-bar").style.width = "0%";

    // Start timer
    startTime = new Date().getTime();
    clearInterval(timerInterval);
    timerInterval = setInterval(updateStats, 1000);
}

function stopTest() {
    if (!isRunning) return; // Do nothing if test is not running

    clearInterval(timerInterval); // Stop the timer
    document.getElementById("input").disabled = true; // Disable input field
    isRunning = false; // Set test status to stopped
}

function updateStats() {
    if (!isRunning) return; // Stop updating if test is stopped

    let elapsedTime = (new Date().getTime() - startTime) / 1000; // in seconds
    document.getElementById("timer").innerText = elapsedTime.toFixed(0);

    let wordsTyped = typedCharacters / 5;
    let wpm = (wordsTyped / (elapsedTime / 60)).toFixed(2);
    document.getElementById("wpm").innerText = wpm;

    let accuracy = (correctCharacters / typedCharacters) * 100;
    document.getElementById("accuracy").innerText = accuracy ? accuracy.toFixed(2) : "100";

    // Update high score if WPM is higher
    if (wpm > bestWPM) {
        bestWPM = wpm;
        localStorage.setItem("bestWPM", bestWPM);
        document.getElementById("best-wpm").innerText = bestWPM;
    }
}

document.getElementById("input").addEventListener("input", function () {
    if (!isRunning) return; // Stop input if test is not running

    let typedText = this.value;
    typedCharacters = typedText.length;

    correctCharacters = 0;
    let highlightedText = "";
    
    for (let i = 0; i < typedText.length; i++) {
        if (typedText[i] === currentSentence[i]) {
            correctCharacters++;
            highlightedText += `<span class="correct">${currentSentence[i]}</span>`;
        } else {
            highlightedText += `<span class="incorrect">${currentSentence[i]}</span>`;
        }
    }

    highlightedText += currentSentence.slice(typedText.length);
    document.getElementById("text").innerHTML = highlightedText;

    updateStats();

    // Update progress bar
    let progress = (typedCharacters / currentSentence.length) * 100;
    document.getElementById("progress-bar").style.width = progress + "%";
});
