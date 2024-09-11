function Board(){
    this.gameBoard = [];
    this.firstMove = true;
    
    const gameContainer = document.querySelector(".game-container");
    
    gameContainer.style.gridTemplateColumns = "repeat(9, 1fr)"
    
    this.getIndex = (row, col) => {
        return row * 9 + col;
    }
    this.getCoords = (index) => {
        return [Math.floor(index / 9), index % 9];
    }
    this.setColor = (mineCount, index) => {
        let color = "";
        switch(mineCount){
            case 1:
                color = "blue";
                break;
            case 2:
                color = "green";
                break;
            case 3:
                color = "red";
                break;
            case 4:
                color = "purple";
                break;
            case 5:
                color = "maroon";
                break;
            case 6:
                color = "turquoise";
                break;
            case 7:
                color = "black";
                break;
            case 8:
                color = "grey";
                break;
        }
        gameContainer.childNodes[index].style.color = color;
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
                    gameContainer.childNodes[this.getIndex(row, col)].style.borderColor = "lightgrey"
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
                this.setColor(mineCount, index);
            } else {
                this.revealAdjacentTiles(tile.row, tile.col);
            }
        })
    }

    this.replaceMine = (row, col) => {
        let minesToReplace = 0;
        if(this.gameBoard[row][col].isMine){
            this.gameBoard[row][col].isMine = false;
            minesToReplace++;
        }
        gameContainer.childNodes[this.getIndex(row, col)].style.borderColor = "";
        
        let adjacentTiles = this.getAdjacentTiles(row, col);

        adjacentTiles.forEach(tile => {
            if(tile.isMine){
                minesToReplace++;
                tile.isMine = false;
                gameContainer.childNodes[this.getIndex(tile.row, tile.col)].style.borderColor = "";
            }
        })

        for(let i = 0; i < minesToReplace;){
            const randomIndex = Math.floor(Math.random() * (81 - 1) + 1);
            const [randomRow, randomCol] = this.getCoords(randomIndex);

            if(!this.gameBoard[randomRow][randomCol].isMine){
                if(Math.abs(row - randomRow) <= 1 && Math.abs(col - randomCol) <= 1) continue;

                this.gameBoard[randomRow][randomCol].isMine = true;
                gameContainer.childNodes[this.getIndex(randomRow, randomCol)].style.borderColor = "lightgrey";
                i++;
                minePlaced = true;
            }
        }
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

        let mineCount = this.getAdjacentBombs(row, col);

        if(this.firstMove && (this.gameBoard[row][col].isMine || mineCount > 0)){
            this.replaceMine(row, col);
            mineCount = this.getAdjacentBombs(row, col);
        }
        this.firstMove = false;

        if(this.gameBoard[row][col].isMine){
            console.log("Game Over")
            return;
        }

        this.gameBoard[row][col].isRevealed = true;
        gameContainer.childNodes[index].classList.add("revealed");
        gameContainer.childNodes[index].innerText = mineCount;
        if(mineCount > 0){
            this.setColor(mineCount, index);
        } else {
            this.revealAdjacentTiles(row, col);
        }
    }
}