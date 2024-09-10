function Board(){
    this.gameBoard = [];

    const gameContainer = document.querySelector(".game-container");

    gameContainer.style.gridTemplateColumns = "repeat(9, 1fr)"

    this.init = () => {
        for(let i = 0; i < 81; i++){
            var elm = document.createElement("div");
            elm.classList.add("game-cell")
            gameContainer.appendChild(elm)
        }
    }

    this.spawnMines = () => {

    }
}