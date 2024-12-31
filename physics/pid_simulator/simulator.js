function Simulator(ctx, keys){
    this.ctx = ctx;
    this.angle = 0;
    this.angleRad = 0;
    this.velocity = 0;
    this.maxVelocity = 16;
    this.airResistance = 0.05;
    this.inputForce = 1;

    const angleInput = document.querySelector('#angle');
    
    angleInput.addEventListener("input", () => {
        this.angle = Number(angleInput.value);
    })

    this.update = function(){
        // update velocity
        if(keys['d']) this.velocity += this.inputForce;
        if(keys['a']) this.velocity -= this.inputForce;

        // update the velocity with air resistance
        if(this.velocity > 0) this.velocity -= this.airResistance / Math.pow(0.9,  this.velocity);
        if(this.velocity < 0) this.velocity += this.airResistance / Math.pow(0.9, -this.velocity);

        if(Math.abs(this.velocity) < this.airResistance / 5) this.velocity = 0;

        if(this.velocity > this.maxVelocity) this.velocity = this.maxVelocity;
        if(this.velocity < -this.maxVelocity) this.velocity = -this.maxVelocity;

        // update the angle
        this.angle += this.velocity;
        this.angle = this.angle % 360;
        if(this.angle < 0) this.angle = 360;

        angleInput.value = this.angle;
        
        // convert the angle to radians
        this.angleRad = this.convertToRadians(this.angle);
    }

    this.convertToRadians = function(degrees){
        return degrees * Math.PI / 180;
    }

    this.draw = function(rollSetpoint){
        // clear the canvas
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

        // draw the velocity
        this.ctx.fillStyle = 'blue';
        this.ctx.fillRect(this.ctx.canvas.width / 2, 0, this.velocity * 25, 20);
        
        // draw the roll setpoint
        this.ctx.save();
        this.ctx.translate(this.ctx.canvas.width / 2, this.ctx.canvas.height / 2);
        this.ctx.rotate(this.convertToRadians(rollSetpoint));
        this.ctx.fillStyle = 'rgb(0, 70, 0, 0.7)';
        this.ctx.fillRect(-200, -25, 400, 50);
        this.ctx.restore();

        // draw a rectangle with the origin at the center of the canvas and rotate it
        this.ctx.save();
        this.ctx.translate(this.ctx.canvas.width / 2, this.ctx.canvas.height / 2);
        this.ctx.rotate(this.angleRad);
        this.ctx.fillStyle = 'rgba(255, 0, 0, 0.7)';
        this.ctx.fillRect(-195, -20, 390, 40);
        this.ctx.restore();
    }
}