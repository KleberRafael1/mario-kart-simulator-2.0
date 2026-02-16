// ===============================
// 🎮 GAME.JS - CONTROLADOR DA PARTIDA
// ===============================

import {
    createPlayer,
    createComputerPlayer,
    rollDice,
    getRandomBlock,
    resolveRound,
    getWinner
} from "./engine.js";

import {
    uiSetPlayers,
    uiSetRound,
    uiSetBlock,
    uiShowDice,
    uiShowTotals,
    uiAddLog,
    uiUpdateScore,
    uiShowWinner,
    uiResetBoard,
    uiSetCharacterVisuals,
    uiMoveRacers,
    uiCelebrateWinner
} from "./ui.js";

let player1 = null;
let player2 = null;
let currentRound = 1;
let currentBlock = "";
let gameOver = false;


// 🎵 SONS
let dice, start, lose, win, again, onetheme, twotheme;


// ===== INICIAR JOGO =====
export function startGame(p1Name) {
    player1 = createPlayer(p1Name);
    player2 = createComputerPlayer(p1Name);

    currentRound = 1;
    gameOver = false;

    uiResetBoard();
    uiSetCharacterVisuals(player1.nome, player2.nome);
    uiSetPlayers(player1.nome, player2.nome);
    uiUpdateScore(player1, player2);
    uiAddLog(`🤖 Computador escolheu ${player2.nome}!`);
    uiAddLog("🏁 Corrida iniciando...");

    nextRound();
}

// ===== EXECUTA RODADA =====
export async function playRound() {
    if (gameOver) return; // impede rolar dado depois do fim

    await new Promise(resolve => setTimeout(resolve, 400));

    const dice1 = await rollDice();
    const dice2 = await rollDice();

    uiShowDice(dice1, dice2);

    const result = await resolveRound(player1, player2, currentBlock, dice1, dice2);

    uiShowTotals(result.total1, result.total2);
    uiAddLog(`Jogador 1: ${result.total1}, Computador: ${result.total2}`);
    result.logs.forEach(log => uiAddLog(log));
    uiUpdateScore(player1, player2);

    // ✅ mover corredores na pista
    uiMoveRacers(result.total1, result.total2);

    currentRound++;
    if (currentRound > 5) {
        finishGame();
        return;
    }

    setTimeout(nextRound, 1200);
}

// ===== PRÓXIMA RODADA =====
async function nextRound() {
    currentBlock = await getRandomBlock();
    uiSetRound(currentRound);
    uiSetBlock(currentBlock);
    uiAddLog(`----------------------------`);
    uiAddLog(`🏁 Rodada ${currentRound}`);
}

// ===== FINALIZA JOGO =====
function finishGame() {
    gameOver = true;
    uiAddLog("----------------------------");
    uiAddLog("🏁 FIM DA CORRIDA!");

    const winner = getWinner(player1, player2);

    if (winner) {
        uiShowWinner(`🏆 ${winner.nome} venceu a corrida!`);
        uiCelebrateWinner(winner.nome);
    } else {
        uiShowWinner("🤝 Empate técnico!");
    }
}

// Inicialização chamada pelo app.js
export function initGame() {
    console.log("🎮 Game carregado com Engine 2.0!");
}
