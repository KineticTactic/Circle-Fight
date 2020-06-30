// const socket = io.connect("http://192.168.2.6:5500");
const socket = io();

let player;
let players = [];

let upKey, downKey, leftKey, rightKey, spaceKey;

let bulletDelay = 300;
let prevBullet = 0;

function setup() {
    createCanvas(800, 600);

    player = new Player(createVector(random(20, width - 20), random(20, height - 20)));

    socket.emit("start", player.data());

    socket.on("tick", (data) => {
        players = data;
        for (p of players) {
            if (p.id === player.id) {
                if (p.takeDamage) {
                    player.health -= 20;
                    console.log("HIT");
                }
            }
        }
    });

    socket.on("disconnected", () => {
        socket.emit("remove");
    });

    socket.on("playerID", (data) => {
        player.id = data.id;
    });
}

function draw() {
    background(51);

    if (upKey) {
        player.moveForward(1);
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

    player.update();
    player.edges();

    for (let p of players) {
        if (p.id !== player.id) {
            renderPlayer(p);
        }
    }

    player.render();

    socket.emit("update", player.data());
}

function renderPlayer(p) {
    stroke(100);
    strokeWeight(2);
    fill(255);
    circle(p.pos.x, p.pos.y, 40);

    // Health bar
    strokeWeight(4);
    stroke(0, 255, 0);
    line(p.pos.x - player.r, p.pos.y - player.r - 10, p.pos.x - player.r + map(p.health, 0, 100, 0, player.r * 2), p.pos.y - player.r - 10);
    console.log(p.health);

    let end = createVector(1, 0);
    end.rotate(p.angle);
    stroke(255);
    strokeWeight(2);
    line(p.pos.x, p.pos.y, p.pos.x + end.x * 40, p.pos.y + end.y * 40);

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
    if (keyCode === 32) {
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
    if (keyCode === 32) {
        spaceKey = false;
    }
}

window.onbeforeunload = function (event) {
    socket.emit("remove");
};
