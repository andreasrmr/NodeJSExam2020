const express = require("express");
const app = express();

const server = require('http').createServer(app);

const io = require("socket.io")(server);

const escapeHtml = require("escape-html");

io.on("connection", (socket) => {
    socket.on("client changed color", ({ data }) => {
        // broadcasts to all sockets in this namespace
        //io.emit("server sending the color", { data: data });

        // only emits to the socket in this very callback
        // socket.emit("server sending the color", { data: data });

        // sends data to all but not itself
        socket.broadcast.emit("server sending the color", { data: data });
    });

    socket.on("client submits chat message", ({ data }) => {
        io.emit("server sends the chat message", { data: escapeHtml(data) });
    });

    socket.on("disconnect", () => {
        // console.log("A socket disconnected. byeeeeeee");
    });
});

app.get("/colorpicker", (req, res) => {
    return res.sendFile(__dirname + "/colorpicker.html");
});

app.get("/chat", (req, res) => {
    return res.sendFile(__dirname + "/chat.html");
});

server.listen(8080, (error) => {
    console.log(`Server is running on port ${8080}`)
});
