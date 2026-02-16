// ===============================
// 🎨 UI.JS - CONTROLE DA INTERFACE
// ===============================

import { startGame, playRound } from "./game.js";

let p1Img, p2Img, p1Label, p2Label;
let player1Select;
let startBtn, rollP1Btn;
let roundTitle, blockInfo;
let dice1El, dice2El;
let p1Name, p2Name;
let p1Result, p2Result;
let scoreboard, logBox;
let winnerText;
let raceArea, finishArea, trackArea;
let racer1, racer2;

// 🎵 Áudio
let audioStart, audioDice, audioWin, audioLose, audioPlayAgain, audioTheme;

// ===============================
// 🚀 INICIALIZAÇÃO DA UI
// ===============================
export function initUI() {
    p1Img = document.getElementById("p1Img");
    p2Img = document.getElementById("p2Img");
    p1Label = document.getElementById("p1Label");
    p2Label = document.getElementById("p2Label");

    player1Select = document.getElementById("player1");

    startBtn = document.getElementById("startButton");
    rollP1Btn = document.getElementById("rollP1");

    roundTitle = document.getElementById("roundTitle");
    blockInfo = document.getElementById("blockInfo");

    dice1El = document.getElementById("dice1");
    dice2El = document.getElementById("dice2");

    p1Name = document.getElementById("p1Name");
    p2Name = document.getElementById("p2Name");

    p1Result = document.getElementById("p1Result");
    p2Result = document.getElementById("p2Result");

    scoreboard = document.getElementById("score");
    logBox = document.getElementById("log");

    winnerText = document.getElementById("winnerText");

    raceArea = document.getElementById("raceArea");
    finishArea = document.getElementById("finishArea");
    trackArea = document.getElementById("trackArea");

    racer1 = document.getElementById("racer1");
    racer2 = document.getElementById("racer2");

    // 🎵 carrega sons
    audioStart = new Audio("sounds/start.mp3");
    audioDice  = new Audio("sounds/dice.mp3");
    audioWin   = new Audio("sounds/win.mp3");
    audioLose  = new Audio("sounds/lose.mp3");
    audioPlayAgain = new Audio("sounds/again.mp3");

    // 🎵 Música de fundo do menu
    audioTheme = new Audio("sounds/onetheme.mp3");
    audioTheme.loop = true; // toca em loop
    audioTheme.volume = 0.4; // 20% do volume máximo, baixinho
    let themeStarted = false;
    function startThemeOnInteraction() {
        if (!themeStarted) {
            audioTheme.play();
            themeStarted = true;
            window.removeEventListener("click", startThemeOnInteraction);
        }
    }
    window.addEventListener("click", startThemeOnInteraction);

    // ===============================
    // 🎮 EVENTOS
    // ===============================
    startBtn.addEventListener("click", () => {
        if (!player1Select.value) {
            alert("Escolha um personagem para começar!");
            return;
        }

        audioStart.play();

        document.querySelector(".character-select").classList.add("hidden");
        document.querySelector(".header p").classList.add("hidden");

        trackArea.classList.remove("hidden");
        raceArea.classList.remove("hidden");

        finishArea.classList.add("hidden");
        startBtn.style.display = "none";

        startGame(player1Select.value);
    });

    rollP1Btn.addEventListener("click", () => {
        audioDice.currentTime = 0;
        audioDice.play();

        playRound();
    });
}

// ===============================
// 🎨 FUNÇÕES DE RENDER
// ===============================
export function uiSetPlayers(name1, name2) {
    p1Name.innerText = name1;
    p2Name.innerText = `${name2} (Computador)`;
}

export function uiSetRound(round) {
    roundTitle.innerText = `Rodada ${round}`;
}

export function uiSetBlock(block) {
    blockInfo.innerText = `Bloco: ${block}`;
}

export function uiShowDice(d1, d2) {
    dice1El.innerText = d1;
    dice2El.innerText = d2;
}

export function uiShowTotals(t1, t2) {
    p1Result.innerText = t1;
    p2Result.innerText = t2;
}

export function uiAddLog(message) {
    logBox.innerHTML += `<div>> ${message}</div>`;
    logBox.scrollTop = logBox.scrollHeight;
}

export function uiUpdateScore(player1, player2) {
    scoreboard.innerText =
        `${player1.nome}: ${player1.PONTOS} 🏁 | ${player2.nome}: ${player2.PONTOS} 🏁`;
}

// Mostra vencedor e toca som de vitória/derrota
export function uiShowWinner(text, player1Won) {
    winnerText.innerText = text;
    finishArea.classList.remove("hidden");

    // desabilita o botão do dado para impedir mais cliques
    rollP1Btn.disabled = true;

    // toca som de vitória ou derrota
    if (player1Won) {
        audioWin.currentTime = 0;
        audioWin.play();
    } else {
        audioLose.currentTime = 0;
        audioLose.play();
    }

    // inicializa o botão jogar novamente
    const playAgainBtn = finishArea.querySelector("button");
    if (playAgainBtn) {
        playAgainBtn.onclick = () => {
            // interrompe qualquer som de vitória/derrota
            audioWin.pause();
            audioWin.currentTime = 0;
            audioLose.pause();
            audioLose.currentTime = 0;

            // toca som do botão
            audioPlayAgain.currentTime = 0;
            audioPlayAgain.play();

            // quando o som do botão terminar, recarrega a página
            audioPlayAgain.onended = () => location.reload();
        };
    }
}


export function uiCelebrateWinner(winnerName) {
    const winnerRacer = winnerName.includes("1") ? racer1 : racer2;
    winnerRacer.classList.add("winner");
}

// ===============================
// 🏁 MOVIMENTO DOS CORREDORES
// ===============================
export function uiMoveRacers(p1Distance, p2Distance) {
    const trackWidth = trackArea.offsetWidth - 100;
    const maxDistance = 30;

    const p1Move = (p1Distance / maxDistance) * trackWidth;
    const p2Move = (p2Distance / maxDistance) * trackWidth;

    racer1.style.transform = `translateX(${p1Move}px)`;
    racer2.style.transform = `translateX(${p2Move}px)`;
}

// ===============================
// 🔄 RESET
// ===============================
export function uiResetBoard() {
    logBox.innerHTML = "";
    p1Result.innerText = "-";
    p2Result.innerText = "-";
    dice1El.innerText = "🎲";
    dice2El.innerText = "🎲";
    winnerText.innerText = "";
    racer1.style.transform = `translateX(0)`;
    racer2.style.transform = `translateX(0)`;
    racer1.classList.remove("winner");
    racer2.classList.remove("winner");
}

// ===============================
// 🖼️ PERSONAGENS
// ===============================
export function uiSetCharacterVisuals(player1, player2) {
    const basePath = "./docs/";
    const characterImages = {
        "Mario": "mario.gif",
        "Luigi": "luigi.gif",
        "Peach": "peach.gif",
        "Yoshi": "yoshi.gif",
        "Bowser": "bowser.gif",
        "Toad": "toad.gif",
        "Donkey Kong": "donkeykong.gif"
    };

    p1Img.src = basePath + characterImages[player1];
    p2Img.src = basePath + characterImages[player2];

    p1Label.innerText = player1;
    p2Label.innerText = player2;
}
