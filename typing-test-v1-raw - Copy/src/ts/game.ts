// import updateTime from "./updateTime.js";
import randomParagraph from "./randomParagraph.js";

const displayText = document.querySelector(".main__text") as HTMLParagraphElement;
const input = document.querySelector(".main__input") as HTMLInputElement;
const restart = document.querySelector(".main__input-restart") as HTMLButtonElement;
const positionTab = document.querySelector(".main__current-position") as HTMLSpanElement;
const accDisplay=  document.querySelector(".main__acc") as HTMLParagraphElement;
const charCount = document.querySelector(".main__char-count") as HTMLParagraphElement;
const progress = document.querySelector(".main__progress") as HTMLProgressElement;

let currentText: string;
let inGame: boolean = false;
let currentPosition:number = 0;

let characters: string[];
let charactersHTML:string[];
let words:string[];

let updateT: number | undefined;


interface Stats {
    wrong: number,
    correct: number,
    total: number;
    char: number,
    currentPosition: number,
    wordPosition: number,
    // seconds: number,
    // minutes: number,
}

let stats: Stats = {
    wrong: 0,
    correct: 0,
    total: 0,
    char:0,
    currentPosition: 0,
    wordPosition:0,
    // seconds: 0,
    // minutes: 0,
}

type spanCoordinate = {
    x: number;
    y: number;
}

let positions: spanCoordinate[] = [];

function createPosition(span: HTMLSpanElement) {
    let coords = span.getBoundingClientRect();
    let x = coords.left;
    let y = coords.top;
    let object: spanCoordinate = {x, y};
    positions.push(object);
}

let createText = ():void =>  {
    currentText = randomParagraph();
    characters = currentText.split("");
    charactersHTML = characters.map(c => `<p>${c}</p>`);    
    displayText.innerHTML = charactersHTML.join("");
    displayText.querySelectorAll("p").forEach((span) => createPosition(span));

    words = currentText.split(" ");
}

function updatePositionTab():void {
    positionTab.style.top = `${positions[stats.currentPosition].y}px`;
    positionTab.style.left = `${positions[stats.currentPosition].x}px`;
        // positionTab.style.display="none";
}

function restartGame(e: Event) {
    positions = [];

    createText();
    input.style.visibility="visible";

    input.value = "";
    input.focus();
    stats.currentPosition = 0;
    

    stats.wrong = 0;
    stats.correct = 0;
    charCount.textContent = "Char Count: 0";

    progress.value = 0;

    accDisplay.textContent = "Acc: 100%";

    updatePositionTab();


    stats.wordPosition=0;

    inGame = false;

    // clearTimeout(updateT);

}

let checkKey = (e: KeyboardEvent) => {
    if (e.key == "Backspace") {
        e.preventDefault();
    }

    if (e.key == " ") {
        if (input.value ==  words[stats.wordPosition]) {
            stats.wordPosition++;
            input.value="";
            input.blur();
            input.focus();

            progress.value = (stats.wordPosition / words.length)*100;

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
                input.style.visibility="hidden";
                e.preventDefault();
                progress.value = 100;
            }

        } else {
            input.value="";
        }
    } else {
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
        accDisplay.textContent = `Acc: ${Math.round((stats.correct/stats.total + Number.EPSILON) * 100)}%`;
    } else {
        accDisplay.textContent = `Acc: 100%`;
    }

    // Current Position
    charCount.textContent = `Char Count: ${stats.currentPosition.toString()}`;
}


function startGame(e: KeyboardEvent ) {
    if (!inGame) {
        // updateT = setInterval(function() {
        //     updateTime(stats.seconds, stats.minutes);
        // }, 1000);
        input.style.visibility="visible";
        positionTab.style.display="block";

        inGame = true;
    }

    
    checkKey(e);
    if (inGame) {
        updatePositionTab();
    } else {
        positionTab.style.display="none";
    }
}

input.addEventListener("keydown", startGame);
restart.addEventListener("click", restartGame);


document.addEventListener("DOMContentLoaded", function(e) {
    createText();
    updatePositionTab();
    input.focus();
    console.log(positions)

});
