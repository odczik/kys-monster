/* Rekurzivní náhodné hloubkové hledání */

export default (width: number, height: number, start: [number, number]) => {
    const grid: { wall: boolean, visited?: boolean }[][] = [];
    const stack: [number, number][] = [];
    let path: [number, number][] = [];

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

    const recursive_backtracking = (current: [number, number]) => {
        if(!grid[current[0]][current[1]].visited){
            grid[current[0]][current[1]].visited = true;
            stack.push(current);
        }
        
        let neighbours: [number, number][] = [];
        neighbours_coords.forEach(coord => {
            let neighbour = [current[0] + coord[0], current[1] + coord[1]];
            if(neighbour[0] > 0 && neighbour[0] < grid.length && neighbour[1] > 0 && neighbour[1] < grid[0].length) {
                if(!grid[neighbour[0]][neighbour[1]].visited) neighbours.push([neighbour[0], neighbour[1]]);
            }
        })


        if(current[0] == height * 2 - 1 && current[1] == width * 2 - 1) path = stack.slice();
        
        const next_node = neighbours[Math.floor(Math.random() * neighbours.length)];

        if(next_node) {
            let wall = [current[0] + Math.sign(next_node[0] - current[0]), current[1] + Math.sign(next_node[1] - current[1])];
            grid[wall[0]][wall[1]].wall = false;
            grid[wall[0]][wall[1]].visited = true;
            recursive_backtracking(next_node);
        } else {
            stack.pop();
            if(stack.length > 0) recursive_backtracking(stack[stack.length - 1]);
        }
    }

    let t0 = performance.now();
    try {
        recursive_backtracking(start);
    } catch(e: any) {
        alert(`Error:  ${e.message}`);
        console.error("Error: ", e.message);
    }
    let t1 = performance.now();
    let time = t1 - t0;
    console.info(`Maze generated in ${time}ms`);

    return {grid, path, time};
}