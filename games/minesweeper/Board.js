function Board(){
    this.gameBoard = [];

    const gameContainer = document.querySelector(".game-container");

    gameContainer.style.gridTemplateColumns = "repeat(9, 1fr)"

    this.init = () => {
        for(let i = 0; i < 9; i++){
            this.gameBoard.push([]);
            for(let j = 0; j < 9; j++){
                this.gameBoard[i].push({});
                var elm = document.createElement("div");
                elm.classList.add("game-cell")
                gameContainer.appendChild(elm)
            }
        }
        console.log(this.gameBoard)
    }

    this.spawnMines = () => {
        for(let i = 0; i < 10;){
            const random = Math.floor(Math.random() * (81 - 1) + 1);
            const col = random % 9;
            const row = Math.floor(random / 9);
            
            if(!this.gameBoard[row][col].isMine){
                this.gameBoard[row][col].isMine = true;
                i++;
            }
        }

        for(let row = 0; row < 9; row++){
            for(let col = 0; col < 9; col++){
                if(this.gameBoard[row][col].isMine){
                    const elmIndex = (row * 9) - (col - 9) - 1;
                    gameContainer.childNodes[elmIndex].style.borderColor = "red"
                }
            }
        }
    }

    this.getAdjacentBombs = (row, col) => {
        let mineCount = 0;
        const adjacentCoords = [
            [-1, -1], [-1, 0], [-1, 1],
            [ 0, -1],          [ 0, 1],
            [ 1, -1], [ 1, 0], [ 1, 1],
        ]

        adjacentCoords.forEach(coord => {
            let adjacentTile;
            try {
                adjacentTile = this.gameBoard[row + coord[1]][col + coord[0]]
            } catch {}

            if(adjacentTile){
                console.log(adjacentTile)
                if(adjacentTile.isMine) mineCount++;
            }
        })

        return mineCount;
    }
}