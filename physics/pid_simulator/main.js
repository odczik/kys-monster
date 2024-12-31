const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

canvas.width = 800;
canvas.height = 600;

let keys = [];

const sim = new Simulator(ctx, keys);
const pid = new PID(2.5, 1.5, 0.25);

const updateHnadler = () => {
    let output = pid.update(sim.angle);
    sim.velocity += output/20;

    sim.update();
    sim.draw(pid.rollSetpoint);

    // debug
    console.log(`${pid.rollSetpoint}\n${sim.angle}\n${sim.angleRad}\n${sim.velocity}\n${output}`);

    requestAnimationFrame(updateHnadler);
}
updateHnadler();

document.addEventListener('keydown', (e) => {
    keys[e.key] = true;
});
document.addEventListener('keyup', (e) => {
    keys[e.key] = false;
});