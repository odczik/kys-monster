/* Rekurzivní náhodné hloubkové hledání */
const generate_maze = (width, height, start, render) => {
    const grid = [];
    const stack = [];
    for (let row = 0; row < (height * 2) + 1; row++) {
        if (row == 0 || row == (height * 2))
            grid.push(new Array((width * 2) + 1).fill({ wall: true }));
        else {
            grid.push([]);
            for (let col = 0; col < (width * 2) + 1; col++) {
                if (col == 0 || col == (width * 2))
                    grid[row].push({ wall: true });
                else {
                    if (row % 2 != 0 && col % 2 != 0)
                        grid[row].push({ wall: false });
                    else
                        grid[row].push({ wall: true });
                }
            }
        }
    }
    const neighbours_coords = [[0, -2], [2, 0], [0, 2], [-2, 0]];
    const recursive_backtracking = (current) => {
        if (!grid[current[0]][current[1]].visited) {
            grid[current[0]][current[1]].visited = true;
            stack.push(current);
        }
        let neighbours = [];
        neighbours_coords.forEach(coord => {
            let neighbour = [current[0] + coord[0], current[1] + coord[1]];
            if (neighbour[0] > 0 && neighbour[0] < grid.length && neighbour[1] > 0 && neighbour[1] < grid[0].length) {
                if (!grid[neighbour[0]][neighbour[1]].visited)
                    neighbours.push([neighbour[0], neighbour[1]]);
            }
        });
        const next_node = neighbours[Math.floor(Math.random() * neighbours.length)];
        if (next_node) {
            let wall = [current[0] + Math.sign(next_node[0] - current[0]), current[1] + Math.sign(next_node[1] - current[1])];
            grid[wall[0]][wall[1]].wall = false;
            grid[wall[0]][wall[1]].visited = true;
            recursive_backtracking(next_node);
        }
        else {
            stack.pop();
            //if(render) render(grid);
            if (stack.length > 0)
                recursive_backtracking(stack[stack.length - 1]);
        }
    };
    recursive_backtracking(start);
    return grid;
};

const maze = generate_maze(10, 5, [1, 1]);
maze[maze.length - 1] = JSON.parse(JSON.stringify(maze[maze.length - 1]))
maze[maze.length - 1][maze[0].length - 2].wall = false

console.log(maze)

let bitmap = '';
maze.forEach(row => {
    let line = '';
    row.forEach(cell => {
        if (cell.wall)
            line += '█';
            //line += '0';
        else
            line += ' ';
    });
    bitmap += line + '\n';
})
console.log(bitmap);

// flip maze vertically
maze.forEach(row => row.reverse());
bitmap = '';
maze.forEach(row => {
    let line = '';
    row.forEach(cell => {
        if (cell.wall)
            line += '█';
            //line += '0';
        else
            line += ' ';
    });
    bitmap += line + '\n';
})
console.log(bitmap);