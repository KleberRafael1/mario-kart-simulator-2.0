import { initGame } from "./game.js";
import { initUI } from "./ui.js";

window.addEventListener("DOMContentLoaded", () => {
    console.log("🏁 Mario Kart Simulator 2.0 iniciado!");

    initUI();   // ← inicializa a interface (pega DOM + eventos)
    initGame(); // ← inicializa engine
});
