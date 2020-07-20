class Player {
    constructor() {
        this.pos = createVector(-1000, 0);
        this.angle = 0;
        this.r = 20;
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

    render() {
        stroke(100);
        strokeWeight(2);
        fill(0, 125, 255);
        circle(width / 2, height / 2, this.r * 2);

        // Health bar
        strokeWeight(4);
        stroke(0, 255, 0);
        line(
            width / 2 - this.r,
            height / 2 - this.r - 10,
            width / 2 - this.r + map(this.health, 0, 100, 0, this.r * 2),
            height / 2 - this.r - 10
        );

        let end = createVector(1, 0);
        end.rotate(this.angle);
        stroke(255);
        strokeWeight(2);
        line(width / 2, height / 2, width / 2 + end.x * 40, height / 2 + end.y * 40);

        for (let bullet of this.bullets) {
            stroke(255);
            strokeWeight(10);
            point(width / 2 - this.pos.x + bullet.pos.x, height / 2 - this.pos.y + bullet.pos.y);
        }
    }
}
