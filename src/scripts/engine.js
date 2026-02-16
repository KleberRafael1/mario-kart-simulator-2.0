// ===============================
// 🏎️ ENGINE.JS - LÓGICA DO JOGO
// ===============================

// Lista de personagens disponíveis
const characters = [
    { nome: "Mario", VELOCIDADE: 4, MANOBRABILIDADE: 3, PODER: 3, PONTOS: 0 },
    { nome: "Luigi", VELOCIDADE: 3, MANOBRABILIDADE: 4, PODER: 4, PONTOS: 0 },
    { nome: "Peach", VELOCIDADE: 3, MANOBRABILIDADE: 4, PODER: 2, PONTOS: 0 },
    { nome: "Yoshi", VELOCIDADE: 2, MANOBRABILIDADE: 4, PODER: 3, PONTOS: 0 },
    { nome: "Bowser", VELOCIDADE: 5, MANOBRABILIDADE: 2, PODER: 5, PONTOS: 0 },
    { nome: "Toad", VELOCIDADE: 2, MANOBRABILIDADE: 3, PODER: 5, PONTOS: 0 },
    { nome: "Donkey Kong", VELOCIDADE: 2, MANOBRABILIDADE: 2, PODER: 5, PONTOS: 0 }
];

// ===== FUNÇÕES DO JOGO =====

// Cria jogador baseado no nome
export function createPlayer(name) {
    const base = characters.find(c => c.nome === name);
    return { ...base }; // copia para estado do jogo
}

// Player 2 computador aleatório
export function createComputerPlayer(excludeName) {
    const available = characters.filter(c => c.nome !== excludeName);
    const random = available[Math.floor(Math.random() * available.length)];
    return { ...random };
}

// Rola dado de 6 lados
export async function rollDice() {
    return Math.floor(Math.random() * 6 + 1);
}

// Sorteia bloco de pista
export async function getRandomBlock() {
    const random = Math.random();
    if (random < 0.33) return "RETA";
    if (random < 0.66) return "CURVA";
    return "CONFRONTO";
}

// Sorteia item em confronto
export async function getRandomItem() {
    return Math.random() < 0.5
        ? { nome: "CASCO", dano: 1, emoji: "🐢💥" }
        : { nome: "BOMBA", dano: 2, emoji: "💣🔥" };
}

// Tenta ativar turbo
export async function tryTurbo() {
    return Math.random() < 0.5;
}

// Resolve rodada
export async function resolveRound(p1, p2, block, dice1, dice2) {
    let logs = [];
    let total1 = 0;
    let total2 = 0;

    if (block === "RETA") {
        total1 = dice1 + p1.VELOCIDADE;
        total2 = dice2 + p2.VELOCIDADE;
        logs.push(`${p1.nome} rolou ${dice1} + Velocidade ${p1.VELOCIDADE} = ${total1}`);
        logs.push(`${p2.nome} rolou ${dice2} + Velocidade ${p2.VELOCIDADE} = ${total2}`);
    } else if (block === "CURVA") {
        total1 = dice1 + p1.MANOBRABILIDADE;
        total2 = dice2 + p2.MANOBRABILIDADE;
        logs.push(`${p1.nome} rolou ${dice1} + Manobrabilidade ${p1.MANOBRABILIDADE} = ${total1}`);
        logs.push(`${p2.nome} rolou ${dice2} + Manobrabilidade ${p2.MANOBRABILIDADE} = ${total2}`);
    } else if (block === "CONFRONTO") {
        const power1 = dice1 + p1.PODER;
        const power2 = dice2 + p2.PODER;
        logs.push(`${p1.nome} rolou ${dice1} + Poder ${p1.PODER} = ${power1}`);
        logs.push(`${p2.nome} rolou ${dice2} + Poder ${p2.PODER} = ${power2}`);

        if (power1 === power2) {
            logs.push("Confronto empatado! Nenhum item foi usado.");
        } else {
            const item = await getRandomItem();
            let winner, loser;

            if (power1 > power2) {
                winner = p1; loser = p2;
            } else {
                winner = p2; loser = p1;
            }

            loser.PONTOS = Math.max(0, loser.PONTOS - item.dano);
            logs.push(`${winner.nome} venceu o confronto e usou ${item.nome}! ${item.emoji}`);
            logs.push(`${loser.nome} perdeu ${item.dano} ponto(s)!`);

            if (await tryTurbo()) {
                winner.PONTOS++;
                logs.push(`🏎️ TURBO! ${winner.nome} ganhou +1 ponto!`);
            }
        }

        // confronto não pontua rodada normal
        return { total1: p1.PONTOS, total2: p2.PONTOS, logs };
    }

    // Rodada normal: quem tiver total maior ganha 1 ponto
    if (total1 > total2) {
        p1.PONTOS++;
        logs.push(`${p1.nome} marcou 1 ponto!`);
    } else if (total2 > total1) {
        p2.PONTOS++;
        logs.push(`${p2.nome} marcou 1 ponto!`);
    } else {
        logs.push("Rodada empatada! Ninguém pontuou.");
    }

    return { total1, total2, logs };
}

// Determina vencedor final
export function getWinner(p1, p2) {
    if (p1.PONTOS > p2.PONTOS) return p1;
    if (p2.PONTOS > p1.PONTOS) return p2;
    return null; // empate
}
