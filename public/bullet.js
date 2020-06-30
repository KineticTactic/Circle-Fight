class Bullet {
    constructor(pos, angle) {
        this.pos = pos.copy();
        this.dir = p5.Vector.fromAngle(angle);
    }

    data() {
        return {
            pos: new p5.Vector(this.pos.x, this.pos.y),
            dir: new p5.Vector(this.dir.x, this.dir.y),
        };
    }

    update() {
        this.pos.add(p5.Vector.mult(this.dir, 50));
    }

    isOffScreen() {
        return this.pos.x < -20 || this.pos.x > width + 20 || this.pos.y < -20 || this.pos.y > height + 20;
    }

    render() {
        strokeWeight(10);
        point(this.pos.x, this.pos.y);
    }
}
