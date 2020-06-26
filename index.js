const express = require("express");
const app = express();

// const server = app.listen(5500, () => {
//     console.log("Server listening at http://localhost:" + server.address().port);
// });

const server = app.listen(process.env.PORT || 5500);

const io = require("socket.io")(server);

app.use(express.static("public"));

let players = [];

setInterval(() => {
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
