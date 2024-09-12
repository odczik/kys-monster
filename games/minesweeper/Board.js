function Board(){
    this.gameBoard = [];
    this.firstMove = true;
    
    this.gameContainer = document.querySelector(".game-container");
    
    this.gameContainer.style.gridTemplateColumns = "repeat(9, 1fr)"

    // Converts x & y coordinates to index
    this.getIndex = (row, col) => {
        return row * 9 + col;
    }
    // Converts index to x & y coordinates
    this.getCoords = (index) => {
        return [Math.floor(index / 9), index % 9];
    }
    // Sets color of the tile based on the number of mines around it
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
        this.gameContainer.childNodes[index].style.color = color;
    }


    // Initializes the game board by creating all the necessary elements
    this.init = () => {
        for(let i = 0; i < 9; i++){
            this.gameBoard.push([]);
            for(let j = 0; j < 9; j++){
                this.gameBoard[i].push({});
                var elm = document.createElement("div");
                elm.classList.add("game-cell")
                elm.innerText = "0";
                elm.style.color = "transparent";
                this.gameContainer.appendChild(elm)
            }
        }
    }

    // Randomly spawns 10 mines
    this.spawnMines = () => {
        // Spawn mines
        for(let i = 0; i < 10;){
            const randomIndex = Math.floor(Math.random() * (81 - 1) + 1);
            const [row, col] = this.getCoords(randomIndex);
            
            if(!this.gameBoard[row][col].isMine){
                this.gameBoard[row][col].isMine = true;
                i++;
            }
        }

        // Set their color for debugging purpouses
        for(let row = 0; row < 9; row++){
            for(let col = 0; col < 9; col++){
                if(this.gameBoard[row][col].isMine){
                    this.gameContainer.childNodes[this.getIndex(row, col)].style.borderColor = "var(--debug-color)";
                }
            }
        }
    }

    // Returns the adjacent tiles (array of objects)
    this.getAdjacentTiles = (row, col) => {
        let adjacentTiles = [];
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

            if(adjacentTile) adjacentTiles.push(adjacentTile);
        })
        return adjacentTiles;
    }

    // Returns number of bombs in adjacent tiles
    this.getAdjacentBombs = (row, col) => {
        let mineCount = 0;
        const adjacentTiles = this.getAdjacentTiles(row, col);

        adjacentTiles.forEach(tile => {
            if(tile.isMine) mineCount++;
        })

        return mineCount;
    }

    // Reveals all adjacent tiles with no mine count (recursive)
    this.revealAdjacentTiles = (row, col) => {
        let adjacentTiles = this.getAdjacentTiles(row, col);
        adjacentTiles = JSON.parse(JSON.stringify(adjacentTiles));
        
        adjacentTiles.forEach(tile => {
            if(tile.isRevealed) return;

            const index = this.getIndex(tile.row, tile.col);
            const mineCount = this.getAdjacentBombs(tile.row, tile.col);

            this.gameBoard[tile.row][tile.col].isRevealed = true;
            this.gameContainer.childNodes[index].classList.add("revealed");
            this.gameContainer.childNodes[index].innerText = mineCount;
            if(mineCount > 0){
                this.setColor(mineCount, index);
            } else {
                this.revealAdjacentTiles(tile.row, tile.col);
            }
        })
    }

    // Replaces mines in a 3x3 square in case first move have any adjacent bombs
    this.replaceMine = (row, col) => {
        let minesToReplace = 0;
        if(this.gameBoard[row][col].isMine){
            this.gameBoard[row][col].isMine = false;
            minesToReplace++;
        }
        this.gameContainer.childNodes[this.getIndex(row, col)].style.borderColor = "";
        
        let adjacentTiles = this.getAdjacentTiles(row, col);

        adjacentTiles.forEach(tile => {
            if(tile.isMine){
                minesToReplace++;
                tile.isMine = false;
                this.gameContainer.childNodes[this.getIndex(tile.row, tile.col)].style.borderColor = "";
            }
        })

        for(let i = 0; i < minesToReplace;){
            const randomIndex = Math.floor(Math.random() * (81 - 1) + 1);
            const [randomRow, randomCol] = this.getCoords(randomIndex);

            if(!this.gameBoard[randomRow][randomCol].isMine){
                if(Math.abs(row - randomRow) <= 1 && Math.abs(col - randomCol) <= 1) continue;

                this.gameBoard[randomRow][randomCol].isMine = true;
                this.gameContainer.childNodes[this.getIndex(randomRow, randomCol)].style.borderColor = "var(--debug-color)";
                i++;
                minePlaced = true;
            }
        }
    }

    // Attaches click event to all tiles
    this.start = () => {
        this.gameContainer.childNodes.forEach((elm, index) => {
            elm.addEventListener("click", () => {
                this.handleClick(index);
            });
        });
    }

    // Handles click events (no shit ikr)
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
            alert("Game Over")
            return;
        }

        this.gameBoard[row][col].isRevealed = true;
        this.gameContainer.childNodes[index].classList.add("revealed");
        this.gameContainer.childNodes[index].innerText = mineCount;
        if(mineCount > 0){
            this.setColor(mineCount, index);
        } else {
            this.revealAdjacentTiles(row, col);
        }
    }
}
