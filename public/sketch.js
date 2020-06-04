const socket = io.connect("http://192.168.2.6:5500");

let player;
let players = [];

let upKey, downKey, leftKey, rightKey, spaceKey;

let bulletDelay = 500;
let prevBullet = 0;

function setup() {
    createCanvas(800, 600);

    player = new Player(createVector(random(20, width - 20), random(20, height - 20)));

    // socket.emit("start", player.data());
    socket.emit("start", player.data());

    socket.on("tick", (data) => {
        players = data;
    });

    socket.on("disconnected", () => {
        socket.emit("remove");
    });
}

function draw() {
    background(51);

    if (upKey) {
        player.applyForce(p5.Vector.mult(player.dir, 1));
    }
    if (rightKey) {
        player.applyTorque(1);
    }
    if (leftKey) {
        player.applyTorque(-1);
    }

    if (spaceKey && millis() - prevBullet >= bulletDelay) {
        player.fire();
        prevBullet = millis();
    }

    if (mouseIsPressed) {
        player.dir = p5.Vector.sub(createVector(mouseX, mouseY), player.pos).normalize();
        player.applyForce(p5.Vector.mult(player.dir, 1));
    }

    player.update();
    player.edges();

    for (let p of players) {
        // if (p !== player) {
        renderPlayer(p);
        // }
    }

    player.render();

    socket.emit("update", player.data());
}

function renderPlayer(p) {
    stroke(100);
    strokeWeight(2);
    fill(255);
    circle(p.pos.x, p.pos.y, 40);

    stroke(255);
    line(p.pos.x, p.pos.y, p.pos.x + p.dir.x * 40, p.pos.y + p.dir.y * 40);

    if (p.bullets) {
        for (let bullet of p.bullets) {
            strokeWeight(10);
            point(bullet.pos.x, bullet.pos.y);
        }
    }
}

function keyPressed() {
    if (keyCode === UP_ARROW) {
        upKey = true;
    }
    if (keyCode === DOWN_ARROW) {
        downKey = true;
    }
    if (keyCode === LEFT_ARROW) {
        leftKey = true;
    }
    if (keyCode === RIGHT_ARROW) {
        rightKey = true;
    }
    if (key === " ") {
        spaceKey = true;
    }
}

function keyReleased() {
    if (keyCode === UP_ARROW) {
        upKey = false;
    }
    if (keyCode === DOWN_ARROW) {
        downKey = false;
    }
    if (keyCode === LEFT_ARROW) {
        leftKey = false;
    }
    if (keyCode === RIGHT_ARROW) {
        rightKey = false;
    }
    if (key === " ") {
        spaceKey = false;
    }
}

window.onbeforeunload = function (event) {
    socket.emit("remove");
};
