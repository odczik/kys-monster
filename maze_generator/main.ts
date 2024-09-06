import GenerateMaze from './backtracking_depth-first_search.js';

const maze_width_slider = document.getElementById('maze_width_slider') as HTMLInputElement;
const maze_width_label = document.getElementById('maze_width_text') as HTMLLabelElement;
const maze_height_slider = document.getElementById('maze_height_slider') as HTMLInputElement;
const maze_height_label = document.getElementById('maze_height_text') as HTMLLabelElement;
const regen_btn = document.getElementById("regen-btn") as HTMLButtonElement;
const solve_btn = document.getElementById("solve-btn") as HTMLButtonElement;
const show_path_checkbox = document.getElementById('show_path') as HTMLInputElement;

maze_width_slider.addEventListener('input', () => {
    maze_width_label.innerText = "width: " + maze_width_slider.value;
    if(parseInt(maze_width_slider.value) >= 50) solve_btn.disabled = true;
    else solve_btn.disabled = false; 
})
maze_height_slider.addEventListener('input', () => {
    maze_height_label.innerText = "height: " + maze_height_slider.value;
    if(parseInt(maze_height_slider.value) >= 50) solve_btn.disabled = true;
    else solve_btn.disabled = false; 
})

const canvas = document.querySelector('canvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

const scale: number = 100;

let maze: { grid: { wall: boolean, visited?: boolean }[][], path: [number, number][], time: number };

const generate_maze = () => {
    maze_width_label.innerText = "width: " + maze_width_slider.value;
    maze_height_label.innerText = "height: " + maze_height_slider.value;

    const maze_width = parseInt(maze_width_slider.value);
    const maze_height = parseInt(maze_height_slider.value);

    canvas.width = maze_width * scale;
    canvas.height = maze_height * scale;

    update_maze(maze_width, maze_height);
}
maze_width_slider.addEventListener('change', generate_maze);
maze_height_slider.addEventListener('change', generate_maze);
regen_btn.addEventListener('click', generate_maze)
window.addEventListener('load', generate_maze);

const render_canvas = (grid: { wall: boolean, visited?: boolean }[][]) => {
    const cell_size = scale;
    /*let cell_height: number;
    let cell_width: number;*/

    grid.forEach((row, row_index) => {
        row.forEach((cell, col_index) => {
            if(cell.wall) {
                ctx.fillStyle = 'black';
            } else {
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
}

const render_path = (path: [number, number][], show: Boolean) => {
    ctx.beginPath();
    ctx.strokeStyle = show ? 'red' : 'white';
    ctx.lineWidth = show ? scale / 3 : scale / 2;
    ctx.moveTo((path[0][1] * scale) + (scale / 2), (path[0][0] * scale) + (scale / 2));
    path.forEach((cell) => {
        ctx.lineTo((cell[1] * scale) + (scale / 2), (cell[0] * scale) + (scale / 2));
    });
    ctx.stroke();
}

const update_maze = (width: number, height: number) => {
    canvas.width = ((width * 2) + 1) * scale;
    canvas.height = ((height * 2) + 1) * scale;

    maze = GenerateMaze(width, height, [1, 1]);

    render_canvas(maze.grid);

    if(show_path_checkbox.checked) render_path(maze.path, true);

    document.getElementById('gen-info-text')!.innerText = `Maze generated in ${maze.time}ms`;
}

show_path_checkbox.addEventListener('change', () => {
    render_path(maze.path, show_path_checkbox.checked);
})

solve_btn.addEventListener('click', () => {
    const t0 = performance.now();
    const path = findPath(maze.grid, {x: 1, y: 1}, {x: maze.grid.length - 2, y: maze.grid[0].length - 2}, true);
    const t1 = performance.now();
    const time = t1 - t0;
    console.info(`Path found in ${time}ms`);
    document.getElementById('solve-info-text')!.innerText = `Maze solved in ${time}ms`;


    /*path.forEach((cell) => {
        ctx.fillStyle = 'red';
        ctx.fillRect(cell.x * scale, cell.y * scale, scale, scale);
    });*/
    let lastNode = path[0];
    path.forEach((node: any) => {
        ctx.beginPath();
        ctx.moveTo((lastNode.x * scale) + (scale / 2), (lastNode.y * scale) + (scale / 2));
        ctx.lineTo((node.x * scale) + (scale / 2), (node.y * scale) + (scale / 2));
        ctx.lineWidth = scale / 6;
        ctx.strokeStyle = "green";
        ctx.stroke();
        lastNode = node;
    });
})

document.getElementById('download-btn')!.addEventListener('click', () => {
    const a = document.createElement('a');
    a.href = canvas.toDataURL();
    a.download = 'maze.png';
    a.click();
})