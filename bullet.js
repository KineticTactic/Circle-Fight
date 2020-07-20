const Vector = require("./Vector");

class Bullet {
    constructor(pos, angle) {
        this.pos = pos.copy();
        this.dir = new Vector(1, 0);
        this.dir.rotate(angle);
    }

    update() {
        this.pos.add(Vector.mult(this.dir, 50));
    }

    isOffScreen(worldSize) {
        return this.pos.x < -20 || this.pos.x > worldSize + 20 || this.pos.y < -20 || this.pos.y > worldSize + 20;
    }
}

module.exports = Bullet;
