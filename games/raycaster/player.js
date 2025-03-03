function Player(startX, startY, tdCtx, fpCtx) {
    this.x = startX;
    this.y = startY;
    this.direction = 0;
    this.speed = 2;
    this.turnSpeed = 3;
    this.size = 10;
    this.radius = 5;
    this.fishEyeFix = true;
    this.collisions = true;
    this.FOV = 60;
    // this.rays = fpCanvas.width;
    this.rays = fpCanvas.width / 2;
    // this.DR = 0.0174533;
    this.DR = (this.FOV / this.rays) * Math.PI / 180;

    this.setFov = (fov) => {
        player.FOV = fov;
        player.DR = (player.FOV / player.rays) * Math.PI / 180;
    }

    this.setRays = (rays) => {
        player.rays = rays;
        player.DR = (player.FOV / player.rays) * Math.PI / 180;
    }

    this.update = (buttons) => {
        // Movement
        let vector = { x: 0, y: 0 }
        if (buttons['w']) {
            vector.x += Math.cos(this.direction * Math.PI / 180) * this.speed;
            vector.y += Math.sin(this.direction * Math.PI / 180) * this.speed;
        }
        if (buttons['s']) {
            vector.x -= Math.cos(this.direction * Math.PI / 180) * this.speed;
            vector.y -= Math.sin(this.direction * Math.PI / 180) * this.speed;
        }
        if (buttons['a']) {
            vector.x -= Math.cos((this.direction + 90) * Math.PI / 180) * this.speed;
            vector.y -= Math.sin((this.direction + 90) * Math.PI / 180) * this.speed;
        }
        if (buttons['d']) {
            vector.x -= Math.cos((this.direction - 90) * Math.PI / 180) * this.speed;
            vector.y -= Math.sin((this.direction - 90) * Math.PI / 180) * this.speed;
        }

        // Normalize vector
        let distance = Math.sqrt(vector.x * vector.x + vector.y * vector.y);
        if (distance != 0) {
            vector.x /= distance;
            vector.y /= distance;
        }

        // Collision detection with circular hitbox
        let newX = this.x + vector.x * this.speed;
        let newY = this.y + vector.y * this.speed;
        let collisionX = false, collisionY = false;

        if(this.collisions){
            // Check for collisions in the x direction
            for (let angle = 0; angle <= 360; angle += 10) {
                let checkX = newX + Math.cos(angle * Math.PI / 180) * this.radius;
                let checkY = this.y + Math.sin(angle * Math.PI / 180) * this.radius;
                if (map[Math.floor(checkY / mapS)][Math.floor(checkX / mapS)] != 0) {
                    collisionX = true;
                    break;
                }
            }
            // Check for collisions in the y direction
            for (let angle = 0; angle < 360; angle += 10) {
                let checkX = this.x + Math.cos(angle * Math.PI / 180) * this.radius;
                let checkY = newY + Math.sin(angle * Math.PI / 180) * this.radius;
                if (map[Math.floor(checkY / mapS)][Math.floor(checkX / mapS)] != 0) {
                    collisionY = true;
                    break;
                }
            }
        }

        // Update position based on collision detection
        if (!collisionX) this.x = newX;
        if (!collisionY) this.y = newY;
        
        // Turn
        if (buttons['q'] || buttons['ArrowLeft']) {
            this.direction -= this.turnSpeed;
            if(this.direction < 0) this.direction = 359;
        }
        if (buttons['e'] || buttons['ArrowRight']) {
            this.direction += this.turnSpeed;
            if(this.direction >= 360) this.direction = 0;
        }
    }

    const distance = (x1, y1, x2, y2) => {
        return Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) *(y2 - y1));
    }

    const normalizeAngle = (angle) => {
        angle = angle % (2 * Math.PI);
        if (angle < 0) {
            angle += 2 * Math.PI;
        }
        return angle;
    }

    this.drawRays = () => {
        let mapX, mapY, dof, rayDistance,
            rayX, rayY, rayAngle, rayXoffset, rayYoffset;
        let shade = 0;
        rayAngle = (this.direction * Math.PI / 180) - this.FOV * (Math.PI / 180) / 2;
        rayAngle = normalizeAngle(rayAngle);

        for (let i = 0; i < this.rays; i++) {
            /* HORIZONTAL CHECK */
            dof = 0;
            let distanceH = 1000000,
                horizontalX = this.x,
                horizontalY = this.y;
            let aTan = -1 / Math.tan(rayAngle);
            // looking up
            if (rayAngle > Math.PI){
                rayY = Math.floor(this.y / mapS) * mapS;
                rayX = (this.y - rayY) * aTan + this.x;
                rayYoffset = -mapS;
                rayXoffset = -rayYoffset * aTan;
            }
            // looking down
            if (rayAngle < Math.PI){
                rayY = Math.ceil(this.y / mapS) * mapS;
                rayX = (this.y - rayY) * aTan + this.x;
                rayYoffset = mapS;
                rayXoffset = -rayYoffset * aTan;
            }
            // looking straight left or right
            if (rayAngle == 0 || rayAngle == Math.PI){
                rayX = this.x;
                rayY = this.y;
                dof = 8;
            }

            // Hit detection
            while (dof < size) {
                mapX = Math.floor((rayX / mapS) + (rayAngle > Math.PI ? - 0.0001 : null));
                mapY = Math.floor((rayY / mapS) + (rayAngle > Math.PI ? - 0.0001 : null));

                if (
                    0 <= mapX && mapX < mapXsize &&
                    0 <= mapY && mapY < mapYsize &&
                    map[mapY][mapX] == 1
                ) {
                    horizontalX = rayX;
                    horizontalY = rayY;
                    distanceH = distance(this.x, this.y, horizontalX, horizontalY);
                    break;
                } else {
                    rayX += rayXoffset;
                    rayY += rayYoffset;
                    dof += 1;
                }
            }

            /* VERTICAL CHECK */
            dof = 0;
            let distanceV = 1000000,
                verticalX = this.x,
                verticalY = this.y;
            let nTan = -Math.tan(rayAngle);
            // looking left
            if (rayAngle > Math.PI / 2 && rayAngle < 3 * Math.PI / 2){
                rayX = Math.floor(this.x / mapS) * mapS;
                rayY = (this.x - rayX) * nTan + this.y;
                rayXoffset = -mapS;
                rayYoffset = -rayXoffset * nTan;
            }
            // looking right
            if (rayAngle < Math.PI / 2 || rayAngle > 3 * Math.PI / 2){
                rayX = Math.ceil(this.x / mapS) * mapS;
                rayY = (this.x - rayX) * nTan + this.y;
                rayXoffset = mapS;
                rayYoffset = -rayXoffset * nTan;
            }
            // looking straight up or down
            if (rayAngle == Math.PI / 2 || rayAngle == 3 * Math.PI / 2){
                rayX = this.x;
                rayY = this.y;
                dof = 8;
            }

            // Max distance (depth of field)
            while (dof < size) {
                mapX = Math.floor((rayX / mapS) + ((rayAngle < Math.PI / 2 || rayAngle > 3 * Math.PI / 2) ? null : - 0.0001));
                mapY = Math.floor((rayY / mapS) + ((rayAngle > Math.PI / 2 || rayAngle > 3 * Math.PI / 2) ? - 0.0001 : null));

                if (
                    0 <= mapX && mapX < mapXsize &&
                    0 <= mapY && mapY < mapYsize &&
                    map[mapY][mapX] == 1
                ) {
                    verticalX = rayX;
                    verticalY = rayY;
                    distanceV = distance(this.x, this.y, verticalX, verticalY);
                    break;
                } else {
                    rayX += rayXoffset;
                    rayY += rayYoffset;
                    dof += 1;
                }
            }

            // Choose the shortest distance
            if(distanceV < distanceH){
                rayX = verticalX;
                rayY = verticalY;
                rayDistance = distanceV;
                shade = 0;
            } else /*if(distanceH < distanceV)*/{
                rayX = horizontalX;
                rayY = horizontalY;
                rayDistance = distanceH;
                shade = 50;
            }

            // Draw rays
            tdCtx.strokeStyle = 'blue';
            tdCtx.beginPath();
            tdCtx.moveTo(this.x, this.y);
            tdCtx.lineTo(rayX, rayY);
            tdCtx.stroke();

            /* DRAW 3D */
            // Correct distance (fish eye effect)
            if(this.fishEyeFix){
                let ca = this.direction * Math.PI / 180 - rayAngle;
                ca = normalizeAngle(ca);
                rayDistance *= Math.cos(ca);
            }

            // Wall height
            let wallHeight = mapS * fpCanvas.height / rayDistance;
            if(wallHeight > fpCanvas.height) wallHeight = fpCanvas.height;

            // Wall color
            const wallColor = (255 - rayDistance / 10) - shade;

            // Draw wall
            fpCtx.fillStyle = `rgb(100, 100, ${wallColor})`;
            fpCtx.fillRect(i * fpCanvas.width / this.rays, fpCanvas.height / 2 - wallHeight / 2, fpCanvas.width / this.rays, wallHeight);

            // Draw floor
            const grad = fpCtx.createLinearGradient(0, 0, 0, 960);
            grad.addColorStop(0, "lightblue");
            grad.addColorStop(1, "darkblue");
            // const grad = fpCtx.createRadialGradient(480, 1000, 10, 480, 640, 960);
            // grad.addColorStop(0, "darkblue");
            // grad.addColorStop(1, "lightblue");
            fpCtx.fillStyle = grad;
            fpCtx.fillRect(i * fpCanvas.width / this.rays, fpCanvas.height / 2 + wallHeight / 2, fpCanvas.width / this.rays, fpCanvas.height / 2 - wallHeight / 2);


            // Update ray angle
            rayAngle += this.DR;
            rayAngle = normalizeAngle(rayAngle);
        }
    }

    this.render = () => {
        this.drawRays();

        // Player
        tdCtx.fillStyle = 'red';
        tdCtx.fillRect(this.x - this.size / 2, this.y - this.size / 2, this.size, this.size);
        // Direction
        tdCtx.strokeStyle = 'red';
        tdCtx.lineWidth = 2;
        tdCtx.beginPath();
        tdCtx.moveTo(this.x, this.y);
        tdCtx.lineTo(this.x + Math.cos(this.direction * Math.PI / 180) * 20, this.y + Math.sin(this.direction * Math.PI / 180) * 20);
        tdCtx.stroke();
        // Hitbox
        tdCtx.strokeStyle = 'red';
        tdCtx.beginPath();
        tdCtx.arc(this.x, this.y, this.radius * 1.1, 0, 2 * Math.PI);
        tdCtx.stroke();
    }
}