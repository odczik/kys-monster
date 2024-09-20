const Game = new Board;

document.getElementById("easy").addEventListener("click", () => Game.setDifficulty("easy"));
document.getElementById("medium").addEventListener("click", () => Game.setDifficulty("medium"));
document.getElementById("hard").addEventListener("click", () => Game.setDifficulty("hard"));

document.getElementById("easy").click();

document.getElementById("debug").checked = false;
document.getElementById("debug").addEventListener("change", (e) => {
    let color;
    e.target.checked ? color = "red" : color = "black";
    Game.gameContainer.style.setProperty("--debug-color", color);
})
