class Player {
    constructor(pos) {
        this.pos = pos.copy();
        this.vel = createVector(0, 0);
        this.acc = createVector(0, 0);
        // this.dir = createVector(1, 0);
        this.angle = 0;
        this.angVel = 0;
        this.r = 20;
        this.bullets = [];
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
        this.bullets.push(new Bullet(this.pos, this.dir));
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
        };
    }

    update() {
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
        stroke(100);
        strokeWeight(2);
        fill(0, 125, 255);
        circle(this.pos.x, this.pos.y, this.r * 2);

        let end = createVector(1, 0);
        end.rotate(this.angle);
        stroke(255);
        line(this.pos.x, this.pos.y, this.pos.x + end.x * 40, this.pos.y + end.y * 40);

        for (let bullet of this.bullets) {
            bullet.render();
        }
    }
}
