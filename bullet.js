const Vector = require("./Vector");

class Bullet {
    constructor(pos, angle) {
        this.pos = pos.copy();
        this.dir = new Vector(1, 0);
        // this.dir = p5.Vector.fromAngle(angle);
        this.dir.rotate(angle);
    }

    data() {
        return {
            pos: new p5.Vector(this.pos.x, this.pos.y),
            dir: new p5.Vector(this.dir.x, this.dir.y),
        };
    }

    update() {
        this.pos.add(Vector.mult(this.dir, 50));
    }

    isOffScreen() {
        return this.pos.x < -20 || this.pos.x > 800 + 20 || this.pos.y < -20 || this.pos.y > 600 + 20;
    }

    render() {
        strokeWeight(10);
        point(this.pos.x, this.pos.y);
    }
}

module.exports = Bullet;
