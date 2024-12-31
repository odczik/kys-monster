function PID(kp, ki, kd) {
    this.kp = kp;
    this.ki = ki;
    this.kd = kd;
    this.rollSetpoint = 0;
    this.rollError = 0;
    this.prevRollError = 0;
    this.rollSum = 0;
    this.prevTime = 0;

    const velocityInput = document.getElementById('velocity');

    velocityInput.addEventListener('mouseup', () => {
        velocityInput.value = 0;
    });

    this.map = function(value, inMin, inMax, outMin, outMax) {
        return (value - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
    }

    this.update = function(angle) {
        // if(keys['d']) this.rollSetpoint += 1;
        // if(keys['a']) this.rollSetpoint -= 1;
        this.rollSetpoint += Number(velocityInput.value);
        this.rollSetpoint = this.rollSetpoint % 360;
        if(this.rollSetpoint < 0) this.rollSetpoint = 360;

        let currentTime = Date.now();
        let deltaTime = (currentTime - this.prevTime) / 1000;
        this.prevTime = currentTime;

        this.rollError = this.rollSetpoint - angle;
        this.rollSum += this.rollError * deltaTime;
        let rollRate = (this.rollError - this.prevRollError) / deltaTime;

        let output = (this.kp * this.rollError) + (this.ki * this.rollSum) + (this.kd * rollRate);

        this.prevRollError = this.rollError;

        return this.map(output, -45, 45, -16, 16);
        // return output;
    }

    const kpInput = document.getElementById('kp');
    const kiInput = document.getElementById('ki');
    const kdInput = document.getElementById('kd');

    document.getElementById('kpValue').innerText = "Kp: " + this.kp;
    kpInput.value = this.kp;
    document.getElementById('kiValue').innerText = "Ki: " + this.ki;
    kiInput.value = this.ki;
    document.getElementById('kdValue').innerText = "Kd: " + this.kd;
    kdInput.value = this.kd;

    kpInput.addEventListener('input', () => {
        this.kp = Number(kpInput.value);
        document.getElementById('kpValue').innerText = "Kp: " + this.kp;
    });

    kiInput.addEventListener('input', () => {
        this.ki = Number(kiInput.value);
        document.getElementById('kiValue').innerText = "Ki: " + this.ki;
    });

    kdInput.addEventListener('input', () => {
        this.kd = Number(kdInput.value);
        document.getElementById('kdValue').innerText = "Kd: " + this.kd;
    });
}