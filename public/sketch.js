// const socket = io.connect("http://192.168.2.6:5500");
const socket = io();

let player;
let players = [];

let ping = 0;

let bulletDelay = 300;
let prevBullet = 0;

let onlineElt, pingElt, inputElt, sendBtn;
let pingTestStartMillis = 0;

function setup() {
    let canvas = createCanvas(800, 600);
    canvas.parent(document.getElementsByClassName("canvas-container")[0]);

    onlineElt = document.getElementById("onlineElt");
    pingElt = document.getElementById("pingElt");
    inputElt = document.getElementById("chatInput");
    sendBtn = document.getElementById("sendBtn");

    player = new Player(createVector(random(20, width - 20), random(20, height - 20)));

    socket.emit("start");

    socket.on("tick", (data) => {
        players = data.players;
        // console.log(data);
        for (p of players) {
            if (p.id === player.id) {
                player.copy(p);
            }
        }
    });

    socket.on("disconnected", () => {
        socket.emit("remove");
    });

    socket.on("playerID", (data) => {
        player.id = data.id;
    });

    socket.on("message", (data) => {
        let li = document.createElement("li");
        li.appendChild(document.createTextNode(data));
        document.getElementById("messages").appendChild(li);
        let list = document.getElementById("messages");

        list.scrollTop = list.scrollHeight;
    });

    socket.on("pong", () => {
        ping = millis() - pingTestStartMillis;
        pingElt.innerHTML = `Ping: ${ping.toFixed(3)}ms`;
    });

    // getPing();
    setInterval(getPing, 5000);
}

function draw() {
    background(51);

    if (keyIsDown(UP_ARROW)) {
        socket.emit("up");
    }
    if (keyIsDown(RIGHT_ARROW)) {
        socket.emit("right");
    }
    if (keyIsDown(LEFT_ARROW)) {
        socket.emit("left");
    }

    if ((keyIsDown(32) || keyIsDown(70)) && millis() - prevBullet >= bulletDelay) {
        socket.emit("fire");
        prevBullet = millis();
    }

    for (let p of players) {
        if (p.id !== player.id) {
            renderPlayer(p);
        }
    }

    player.render();

    // HTML
    onlineElt.innerHTML = `Players Online: ${players.length}`;
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

function getPing() {
    pingTestStartMillis = millis();
    socket.emit("testPing");
}

document.getElementById("sendBtn").onclick = () => {
    if (inputElt.value.length !== 0) {
        socket.emit("message", inputElt.value);
    }
};

document.getElementById("chatInput").addEventListener("keyup", (event) => {
    if (event.keyCode === 13) {
        event.preventDefault();
        document.getElementById("sendBtn").click();
        document.getElementById("chatInput").value = "";
    }
});

window.onbeforeunload = function (event) {
    socket.emit("remove");
};
