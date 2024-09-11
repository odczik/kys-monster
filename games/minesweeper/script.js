const Game = new Board;

Game.init();
Game.spawnMines();
Game.start();

document.getElementById("debug").addEventListener("change", (e) => {
    let color;
    e.target.checked ? color = "red" : color = "black";
    Game.gameContainer.style.setProperty("--debug-color", color);
})