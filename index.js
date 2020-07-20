const express = require("express");
const app = express();

const Player = require("./player");
const { millis } = require("./utils");

const server = app.listen(process.env.PORT || 5500);

const io = require("socket.io")(server);

app.use(express.static("public"));

function checkCollision(player, bullet) {
    let dist = Math.sqrt((player.pos.x - bullet.pos.x) ** 2 + (player.pos.y - bullet.pos.y) ** 2);
    if (dist < 30) {
        return true;
    }
}

function tick() {
    let players = [];

    // Update all players
    Object.keys(io.sockets.sockets).forEach((id) => {
        if (io.sockets.sockets[id].player) {
            io.sockets.sockets[id].player.update();
            io.sockets.sockets[id].player.edges();
        }
    });

    // Check if bullet collides, and push player data to players array
    Object.keys(io.sockets.sockets).forEach((id) => {
        if (io.sockets.sockets[id].player) {
            for (let bullet of io.sockets.sockets[id].player.bullets) {
                Object.keys(io.sockets.sockets).forEach((loopID) => {
                    if (io.sockets.sockets[id].player !== io.sockets.sockets[loopID].player) {
                        if (checkCollision(io.sockets.sockets[loopID].player, bullet)) {
                            io.sockets.sockets[loopID].player.health -= 20;
                        }
                    }
                });
            }

            players.push({
                pos: {
                    x: io.sockets.sockets[id].player.pos.x,
                    y: io.sockets.sockets[id].player.pos.y,
                },
                angle: io.sockets.sockets[id].player.angle,
                health: io.sockets.sockets[id].player.health,
                bullets: io.sockets.sockets[id].player.getBulletsData(),
                id: io.sockets.sockets[id].player.id,
            });
        }
    });

    io.emit("tick", { players: players });
}

setInterval(tick, 1000 / 60);

io.sockets.on("connection", (socket) => {
    console.log("New Connection: " + socket.id);

    socket.on("start", () => {
        io.sockets.sockets[socket.id].player = new Player(socket.id);

        io.to(socket.id).emit("playerID", { id: socket.id });
    });

    socket.on("up", () => {
        io.sockets.sockets[socket.id].player.moveForward(1);
    });

    socket.on("right", () => {
        io.sockets.sockets[socket.id].player.applyTorque(1);
    });

    socket.on("left", () => {
        io.sockets.sockets[socket.id].player.applyTorque(-1);
    });

    socket.on("fire", () => {
        io.sockets.sockets[socket.id].player.fire();
    });

    socket.on("message", (data) => {
        io.emit("message", data);
    });

    socket.on("testPing", () => {
        io.to(socket.id).emit("pong");
    });
});
