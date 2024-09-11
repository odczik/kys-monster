function Board(){
    this.gameBoard = [];
    
    const gameContainer = document.querySelector(".game-container");
    
    gameContainer.style.gridTemplateColumns = "repeat(9, 1fr)"
    
    this.getIndex = (row, col) => {
        return row * 9 + col;
    }
    this.getCoords = (index) => {
        return [Math.floor(index / 9), index % 9];
    }


    this.init = () => {
        for(let i = 0; i < 9; i++){
            this.gameBoard.push([]);
            for(let j = 0; j < 9; j++){
                this.gameBoard[i].push({});
                var elm = document.createElement("div");
                elm.classList.add("game-cell")
                elm.innerText = "0";
                elm.style.color = "transparent";
                gameContainer.appendChild(elm)
            }
        }
        console.log(this.gameBoard)
    }

    this.spawnMines = () => {
        for(let i = 0; i < 10;){
            const randomIndex = Math.floor(Math.random() * (81 - 1) + 1);
            const [row, col] = this.getCoords(randomIndex);
            
            if(!this.gameBoard[row][col].isMine){
                this.gameBoard[row][col].isMine = true;
                i++;
            }
        }

        for(let row = 0; row < 9; row++){
            for(let col = 0; col < 9; col++){
                if(this.gameBoard[row][col].isMine){
                    gameContainer.childNodes[this.getIndex(row, col)].style.borderColor = "red"
                }
            }
        }
    }

    this.getAdjacentTiles = (row, col) => {
        let getAdjacentTiles = [];
        const adjacentCoords = [
            [-1, -1], [-1, 0], [-1, 1],
            [ 0, -1],          [ 0, 1],
            [ 1, -1], [ 1, 0], [ 1, 1],
        ]

        adjacentCoords.forEach(coord => {
            const adjacentRow = row + coord[0];
            const adjacentCol = col + coord[1];
            if(adjacentRow < 0 || adjacentRow >= 9 || adjacentCol < 0 || adjacentCol >= 9) return;

            let adjacentTile = this.gameBoard[adjacentRow][adjacentCol]
            adjacentTile.row = adjacentRow;
            adjacentTile.col = adjacentCol;

            if(adjacentTile) getAdjacentTiles.push(adjacentTile);
        })
        return getAdjacentTiles;
    }

    this.getAdjacentBombs = (row, col) => {
        let mineCount = 0;
        const adjacentTiles = this.getAdjacentTiles(row, col);

        adjacentTiles.forEach(tile => {
            if(tile.isMine) mineCount++;
        })

        return mineCount;
    }

    this.revealAdjacentTiles = (row, col) => {
        let adjacentTiles = this.getAdjacentTiles(row, col);
        adjacentTiles = JSON.parse(JSON.stringify(adjacentTiles));
        
        adjacentTiles.forEach(tile => {
            if(tile.isRevealed) return;

            const index = this.getIndex(tile.row, tile.col);
            const mineCount = this.getAdjacentBombs(tile.row, tile.col);

            this.gameBoard[tile.row][tile.col].isRevealed = true;
            gameContainer.childNodes[index].classList.add("revealed");
            gameContainer.childNodes[index].innerText = mineCount;
            if(mineCount > 0){
                gameContainer.childNodes[index].style.color = "white";
            } else {
                this.revealAdjacentTiles(tile.row, tile.col);
            }
        })
    }

    this.start = () => {
        gameContainer.childNodes.forEach((elm, index) => {
            elm.addEventListener("click", () => {
                this.handleClick(index);
            });
        });
    }

    this.handleClick = (index) => {
        const col = index % 9;
        const row = Math.floor(index / 9);

        if(this.gameBoard[row][col].isRevealed) return;
        if(this.gameBoard[row][col].isMine){
            console.log("Game Over")
            return;
        }

        const mineCount = this.getAdjacentBombs(row, col);
        this.gameBoard[row][col].isRevealed = true;
        gameContainer.childNodes[index].classList.add("revealed");
        gameContainer.childNodes[index].innerText = mineCount;
        if(mineCount > 0){
            gameContainer.childNodes[index].style.color = "white";
        } else {
            this.revealAdjacentTiles(row, col);
        }
    }
}