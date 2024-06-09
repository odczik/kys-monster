import GenerateMaze from './backtracking_depth-first_search.js';

const maze_size_slider = document.getElementById('maze_size_slider') as HTMLInputElement;
const maze_size_label = document.getElementById('maze_size_text') as HTMLLabelElement;
const regen_btn = document.querySelector('button') as HTMLButtonElement;

maze_size_slider.addEventListener('input', () => {
    maze_size_label.innerText = maze_size_slider.value;
})

const canvas = document.querySelector('canvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

const scale: number = 50;

const generate_maze = () => {
    const maze_size = parseInt(maze_size_slider.value);
    update_maze(maze_size);
}
maze_size_slider.addEventListener('change', generate_maze);
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

const update_maze = (size: number) => {
    const maze_size = size;
    
    canvas.width = ((maze_size * 2) + 1) * scale;
    canvas.height = ((maze_size * 2) + 1) * scale;

    const maze = GenerateMaze(maze_size, [1, 1]);

    render_canvas(maze.grid);

    document.querySelector('div')!.innerText = `Maze generated in ${maze.time}ms`;
}