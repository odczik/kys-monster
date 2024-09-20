function Board(){
    this.gameBoard = [];
    this.firstMove = true;
    this.markedMines = 0;

    this.size = 9;
    this.numberOfMines = 10;
    
    this.gameContainer = document.querySelector(".game-container");

    // Converts x & y coordinates to index
    this.getIndex = (row, col) => {
        return row * this.size + col;
    }
    // Converts index to x & y coordinates
    this.getCoords = (index) => {
        return [Math.floor(index / this.size), index % this.size];
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
    this.reset = () => {
        this.gameBoard = [];
        this.gameContainer.innerHTML = "";
        this.gameContainer.style.gridTemplateColumns = `repeat(${this.size}, 1fr)`;
        this.firstMove = true;
    }

    this.setDifficulty = (difficulty) => {
        switch(difficulty){
            case "easy":
                this.size = 9;
                this.numberOfMines = 10;
                this.gameContainer.style.fontSize = "min(5vw, 35px)";
                break;
            case "medium":
                this.size = 16;
                this.numberOfMines = 40;
                this.gameContainer.style.fontSize = "";
                break;
            case "hard":
                this.size = 24;
                this.numberOfMines = 99;
                this.gameContainer.style.fontSize = "min(2vw, 9px)";
                break;
            case "custom":
                this.size = parseInt(document.getElementById("size").value);
                this.numberOfMines = parseInt(document.getElementById("mines").value);
                this.gameContainer.style.fontSize = `9px`;
                break;
        }

        this.reset();
        this.init();
        this.spawnMines();
        this.start();

        return [this.size, this.numberOfMines];
    }


    // Initializes the game board by creating all the necessary elements
    this.init = () => {
        for(let i = 0; i < this.size; i++){
            this.gameBoard.push([]);
            for(let j = 0; j < this.size; j++){
                this.gameBoard[i].push({});
                var elm = document.createElement("div");
                elm.classList.add("game-cell")
                elm.innerText = "0";
                elm.style.color = "transparent";
                this.gameContainer.appendChild(elm)
            }
        }
    }

    // Randomly spawns X mines
    this.spawnMines = () => {
        // Spawn mines
        for(let i = 0; i < this.numberOfMines;){
            const randomIndex = Math.floor(Math.random() * (Math.pow(this.size, 2) - 1) + 1);
            const [row, col] = this.getCoords(randomIndex);
            
            if(!this.gameBoard[row][col].isMine){
                this.gameBoard[row][col].isMine = true;
                i++;
            }
        }

        // Set their color for debugging purpouses
        for(let row = 0; row < this.size; row++){
            for(let col = 0; col < this.size; col++){
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
            if(adjacentRow < 0 || adjacentRow >= this.size || adjacentCol < 0 || adjacentCol >= this.size) return;

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
                this.handleLeftClick(index);
            });
            elm.addEventListener("contextmenu", (e) => {
                this.handleRightClick(index, e);
            });
        });
    }

    // Handles left click events (no shit ikr)
    this.handleLeftClick = (index) => {
        const [row, col] = this.getCoords(index);
        const tile = this.gameBoard[row][col]
        
        if(tile.isRevealed) return;
        if(tile.marked) return this.handleRightClick(index);
        
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

        // Check if player won
        let tilesRevealed = 0;
        this.gameBoard.forEach(row => {
            row.forEach(tile => {
                if(tile.isRevealed) tilesRevealed++;
            })
        })
        if(tilesRevealed === Math.pow(this.size, 2) - this.numberOfMines){
            alert("You won!")
        }
    }
    // Handles right click events (no shit ikr)
    this.handleRightClick = (index, e) => {
        if(e) e.preventDefault();

        const [row, col] = this.getCoords(index);
        const tile = this.gameBoard[row][col]

        if(tile.isRevealed) return;

        tile.marked = !tile.marked;
        this.gameContainer.childNodes[index].style.backgroundColor = tile.marked ? "#333" : "grey"

        tile.marked ? this.markedMines++ : this.markedMines--;
        document.querySelector(".flags").innerText = "Flags: " + this.markedMines;
    }
}
