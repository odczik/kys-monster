const sizeInput = document.getElementById("size");
const minesInput = document.getElementById("mines");

const Game = new Board;

const diffButtons = document.querySelectorAll("input[name='diff']");
diffButtons.forEach(button => {
    button.addEventListener("click", (e) => {
        const [size, mines] = Game.setDifficulty(e.target.value);

        minesInput.value = mines;
        sizeInput.value = size;

        if(e.target.value == "custom"){
            sizeInput.disabled = false;
            minesInput.disabled = false;
        } else {
            sizeInput.disabled = true;
            minesInput.disabled = true;
        }
    })
})

document.getElementById("easy").click();

document.getElementById("debug").checked = false;
document.getElementById("debug").addEventListener("change", (e) => {
    let color;
    e.target.checked ? color = "red" : color = "black";
    Game.gameContainer.style.setProperty("--debug-color", color);
})
