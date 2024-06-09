import GenerateMaze from './backtracking_depth-first_search.js';
const maze_size_slider = document.getElementById('maze_size_slider');
const maze_size_label = document.getElementById('maze_size_text');
const regen_btn = document.getElementById("regen-btn");
const solve_btn = document.getElementById("solve-btn");
maze_size_slider.addEventListener('input', () => {
    maze_size_label.innerText = maze_size_slider.value;
    if (parseInt(maze_size_slider.value) >= 50)
        solve_btn.disabled = true;
    else
        solve_btn.disabled = false;
});
const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
const scale = 50;
let maze;
const generate_maze = () => {
    const maze_size = parseInt(maze_size_slider.value);
    update_maze(maze_size);
};
maze_size_slider.addEventListener('change', generate_maze);
regen_btn.addEventListener('click', generate_maze);
window.addEventListener('load', generate_maze);
const render_canvas = (grid) => {
    const cell_size = scale;
    /*let cell_height: number;
    let cell_width: number;*/
    grid.forEach((row, row_index) => {
        row.forEach((cell, col_index) => {
            if (cell.wall) {
                ctx.fillStyle = 'black';
            }
            else {
                ctx.fillStyle = 'white';
            }
            /*if(!(row_index % 2)) cell_height = cell_size / 3;
                else cell_height = cell_size;
            if(!(col_index % 2)) cell_width = cell_size / 3;
                else cell_width = cell_size;
            ctx.fillRect(col_index * cell_width, row_index * cell_height, cell_width, cell_height);*/
            ctx.fillRect(col_index * cell_size, row_index * cell_size, cell_size, cell_size);
        });
    });
};
const update_maze = (size) => {
    const maze_size = size;
    canvas.width = ((maze_size * 2) + 1) * scale;
    canvas.height = ((maze_size * 2) + 1) * scale;
    maze = GenerateMaze(maze_size, [1, 1]);
    render_canvas(maze.grid);
    document.getElementById('gen-info-text').innerText = `Maze generated in ${maze.time}ms`;
};
solve_btn.addEventListener('click', () => {
    const t0 = performance.now();
    const path = findPath(maze.grid, { x: 1, y: 1 }, { x: maze.grid.length - 2, y: maze.grid[0].length - 2 }, true);
    const t1 = performance.now();
    const time = t1 - t0;
    console.info(`Path found in ${time}ms`);
    document.getElementById('solve-info-text').innerText = `Maze solved in ${time}ms`;
    /*path.forEach((cell) => {
        ctx.fillStyle = 'red';
        ctx.fillRect(cell.x * scale, cell.y * scale, scale, scale);
    });*/
    let lastNode = path[0];
    path.forEach((node, i) => {
        ctx.beginPath();
        ctx.moveTo((lastNode.x * scale) + (scale / 2), (lastNode.y * scale) + (scale / 2));
        ctx.lineTo((node.x * scale) + (scale / 2), (node.y * scale) + (scale / 2));
        ctx.lineWidth = scale / 3;
        ctx.strokeStyle = "red";
        ctx.stroke();
        lastNode = node;
    });
});
