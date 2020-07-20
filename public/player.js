class Player {
    constructor(pos) {
        this.pos = pos.copy();
        this.vel = createVector(0, 0);
        this.acc = createVector(0, 0);
        // this.dir = createVector(1, 0);
        this.angle = 0;
        this.angVel = 0;
        this.r = 20;
        this.health = 100;
        this.bullets = [];
    }

    respawn() {
        this.pos = createVector(random(20, width - 20), random(20, height - 20));
        this.vel = createVector(0, 0);
        this.acc = createVector(0, 0);
        this.angle = 0;
        this.angVel = 0;
        this.health = 100;
        this.bullets = [];
    }

    copy(p) {
        this.pos.x = p.pos.x;
        this.pos.y = p.pos.y;
        this.angle = p.angle;
        this.health = p.health;
        this.bullets = p.bullets;
    }

    applyForce(f) {
        this.acc.add(f);
    }

    applyTorque(t) {
        this.angVel += t / 10;
    }

    moveForward(f) {
        let dir = createVector(f, 0);
        dir.rotate(this.angle);
        this.applyForce(dir);
    }

    fire() {
        this.bullets.push(new Bullet(this.pos, this.angle));
    }

    data() {
        let b = [];
        for (let bullet of this.bullets) {
            b.push(bullet.data());
        }
        return {
            pos: new p5.Vector(this.pos.x, this.pos.y),
            angle: this.angle,
            bullets: b,
            health: this.health,
        };
    }

    update() {
        if (this.health <= 0) {
            this.respawn();
        }
        this.vel.add(this.acc);
        this.vel.mult(0.94);
        this.pos.add(this.vel);
        this.acc.mult(0);

        this.angVel = constrain(this.angVel, -0.1, 0.1);
        this.angVel *= 0.6;
        // this.dir.rotate(this.angVel);
        this.angle += this.angVel;
        // this.angAcc = 0;

        for (let bullet of this.bullets) {
            bullet.update();
        }
    }

    edges() {
        if (this.pos.x < 0) {
            this.pos.x = width;
        } else if (this.pos.x > width) {
            this.pos.x = 0;
        }

        if (this.pos.y < 0) {
            this.pos.y = height;
        } else if (this.pos.y > height) {
            this.pos.y = 0;
        }

        for (let i = this.bullets.length - 1; i >= 0; i--) {
            if (this.bullets[i].isOffScreen()) {
                this.bullets.splice(i, 1);
            }
        }
    }

    render() {
        push();
        translate(width / 2, height / 2);
        // console.log(this.pos.x, this.pos.y);
        stroke(100);
        strokeWeight(2);
        fill(0, 125, 255);
        // circle(this.pos.x, this.pos.y, this.r * 2);
        circle(0, 0, this.r * 2);

        // Health bar
        strokeWeight(4);
        stroke(0, 255, 0);
        line(-this.r, -this.r - 10, -this.r + map(this.health, 0, 100, 0, this.r * 2), -this.r - 10);

        let end = createVector(1, 0);
        end.rotate(this.angle);
        stroke(255);
        strokeWeight(2);
        line(0, 0, end.x * 40, end.y * 40);

        pop();

        for (let bullet of this.bullets) {
            // bullet.render();
            stroke(255);
            strokeWeight(10);
            point(width / 2 - this.pos.x + bullet.pos.x, height / 2 - this.pos.y + bullet.pos.y);
        }
    }
}
