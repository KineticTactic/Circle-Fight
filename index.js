const express = require("express");
const app = express();

// const server = app.listen(5500, () => {
//     console.log("Server listening at http://localhost:" + server.address().port);
// });

const server = app.listen(process.env.PORT || 5500);

const io = require("socket.io")(server);

app.use(express.static("public"));

let players = [];

function checkCollision(player, bullet) {
    let dist = Math.sqrt((player.pos.x - bullet.pos.x) ** 2 + (player.pos.y - bullet.pos.y) ** 2);
    if (dist < 30) {
        return true;
    }
}

setInterval(() => {
    let bullets = players.map((p) => p.bullets);
    bullets = bullets.flat();
    for (let player of players) {
        let damage = false;
        for (let bullet of bullets) {
            if (bullet !== undefined) {
                if (checkCollision(player, bullet)) {
                    player.takeDamage = true;
                    damage = true;
                }
            }
        }
        if (!damage) {
            player.takeDamage = false;
        }
    }
    io.emit("tick", players);
}, 16);

io.sockets.on("connection", (socket) => {
    console.log("New Connection: " + socket.id);

    socket.on("start", (data) => {
        console.log(data.pos.x, data.pos.y);
        players.push({ pos: data.pos, angle: data.angle, id: socket.id });

        io.to(socket.id).emit("playerID", { id: socket.id });
    });

    socket.on("update", (data) => {
        for (let player of players) {
            if (player.id === socket.id) {
                player.pos = data.pos;
                player.angle = data.angle;
                player.bullets = data.bullets;
                player.health = data.health;
            }
        }
    });

    socket.on("disconnect", () => {
        for (let i = 0; i < players.length; i++) {
            if (players[i].id === socket.id) {
                console.log("User Disconnected: " + socket.id);
                players.splice(i, 1);
                break;
            }
        }
    });
});
