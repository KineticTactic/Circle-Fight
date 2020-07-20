const Vector = require("./Vector");
const Bullet = require("./bullet");

function constrain(val, min, max) {
    if (val < min) return min;
    else if (val > max) return max;
    else return val;
}

class Player {
    constructor(id) {
        this.pos = new Vector(Math.random() * 760 + 20, Math.random() * 660 + 20);

        this.vel = new Vector(0, 0);
        this.acc = new Vector(0, 0);
        this.angle = 0;
        this.angVel = 0;
        this.r = 20;
        this.health = 100;
        this.bullets = [];
        this.id = id;
    }

    respawn() {
        this.pos = new Vector(Math.random() * 760 + 20, Math.random() * 660 + 20);
        this.vel = new Vector(0, 0);
        this.acc = new Vector(0, 0);
        this.angle = 0;
        this.angVel = 0;
        this.health = 100;
        this.bullets = [];
    }

    getBulletsData() {
        let b = [];
        for (let bullet of this.bullets) {
            b.push({
                pos: {
                    x: bullet.pos.x,
                    y: bullet.pos.y,
                },
            });
        }
        return b;
    }

    applyForce(f) {
        this.acc.add(f);
    }

    applyTorque(t) {
        this.angVel += t / 10;
    }

    moveForward(f) {
        let dir = new Vector(f, 0);
        dir.rotate(this.angle);
        this.applyForce(dir);
    }

    fire() {
        this.bullets.push(new Bullet(this.pos, this.angle));
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
        this.angle += this.angVel;

        for (let bullet of this.bullets) {
            bullet.update();
        }
    }

    edges(worldSize) {
        if (this.pos.x < this.r) {
            this.pos.x = this.r;
        } else if (this.pos.x > worldSize - this.r) {
            this.pos.x = worldSize - this.r;
        }

        if (this.pos.y < this.r) {
            this.pos.y = this.r;
        } else if (this.pos.y > worldSize - this.r) {
            this.pos.y = worldSize - this.r;
        }

        for (let i = this.bullets.length - 1; i >= 0; i--) {
            if (this.bullets[i].isOffScreen(worldSize)) {
                this.bullets.splice(i, 1);
            }
        }
    }
}

module.exports = Player;
