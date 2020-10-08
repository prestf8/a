// import updateTime from "./updateTime.js";
import randomParagraph from "./randomParagraph.js";
const displayText = document.querySelector(".main__text");
const input = document.querySelector(".main__input");
const restart = document.querySelector(".main__input-restart");
const positionTab = document.querySelector(".main__current-position");
const accDisplay = document.querySelector(".main__acc");
const charCount = document.querySelector(".main__char-count");
const progress = document.querySelector(".main__progress");
let currentText;
let inGame = false;
let currentPosition = 0;
let characters;
let charactersHTML;
let words;
let updateT;
let stats = {
    wrong: 0,
    correct: 0,
    total: 0,
    char: 0,
    currentPosition: 0,
    wordPosition: 0,
};
let positions = [];
function createPosition(span) {
    let coords = span.getBoundingClientRect();
    let x = coords.left;
    let y = coords.top;
    let object = { x, y };
    positions.push(object);
}
let createText = () => {
    currentText = randomParagraph();
    characters = currentText.split("");
    charactersHTML = characters.map(c => `<p>${c}</p>`);
    displayText.innerHTML = charactersHTML.join("");
    displayText.querySelectorAll("p").forEach((span) => createPosition(span));
    words = currentText.split(" ");
};
function updatePositionTab() {
    positionTab.style.top = `${positions[stats.currentPosition].y}px`;
    positionTab.style.left = `${positions[stats.currentPosition].x}px`;
    // positionTab.style.display="none";
}
function restartGame(e) {
    positions = [];
    createText();
    input.style.visibility = "visible";
    input.value = "";
    input.focus();
    stats.currentPosition = 0;
    stats.wrong = 0;
    stats.correct = 0;
    charCount.textContent = "Char Count: 0";
    progress.value = 0;
    accDisplay.textContent = "Acc: 100%";
    updatePositionTab();
    stats.wordPosition = 0;
    inGame = false;
    // clearTimeout(updateT);
}
let checkKey = (e) => {
    if (e.key == "Backspace") {
        e.preventDefault();
    }
    if (e.key == " ") {
        if (input.value == words[stats.wordPosition]) {
            stats.wordPosition++;
            input.value = "";
            input.blur();
            input.focus();
            progress.value = (stats.wordPosition / words.length) * 100;
        }
        console.log(stats.wordPosition);
        e.preventDefault();
    }
    if (e.key === characters[stats.currentPosition]) {
        if (displayText.querySelectorAll("p")[currentPosition]) {
            if (displayText.querySelectorAll("p")[stats.currentPosition].classList.contains("key-wrong")) {
                displayText.querySelectorAll("p")[stats.currentPosition].classList.remove("key-wrong");
            }
            stats.correct++;
            stats.currentPosition++;
            if (stats.currentPosition == characters.length) {
                console.log("END");
                inGame = false;
                input.style.visibility = "hidden";
                e.preventDefault();
                progress.value = 100;
            }
        }
        else {
            input.value = "";
        }
    }
    else {
        console.log(e.key);
        if (e.key != "Shift" && e.key != "Alt") {
            if (!displayText.querySelectorAll("p")[stats.currentPosition].classList.contains("key-wrong")) {
                stats.wrong++;
            }
            e.preventDefault();
            displayText.querySelectorAll("p")[stats.currentPosition].classList.add("key-wrong");
        }
    }
    // Math.round(1.005 * 1000)/1000
    stats.total = stats.correct + stats.wrong;
    if (stats.total != 0) {
        accDisplay.textContent = `Acc: ${Math.round((stats.correct / stats.total + Number.EPSILON) * 100)}%`;
    }
    else {
        accDisplay.textContent = `Acc: 100%`;
    }
    // Current Position
    charCount.textContent = `Char Count: ${stats.currentPosition.toString()}`;
};
function startGame(e) {
    if (!inGame) {
        // updateT = setInterval(function() {
        //     updateTime(stats.seconds, stats.minutes);
        // }, 1000);
        input.style.visibility = "visible";
        positionTab.style.display = "block";
        inGame = true;
    }
    checkKey(e);
    if (inGame) {
        updatePositionTab();
    }
    else {
        positionTab.style.display = "none";
    }
}
input.addEventListener("keydown", startGame);
restart.addEventListener("click", restartGame);
document.addEventListener("DOMContentLoaded", function (e) {
    createText();
    updatePositionTab();
    input.focus();
    console.log(positions);
});
