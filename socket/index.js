module.exports = function(io) {
    var app = require('express');
    var router = app.Router();

    let onlineUsers = [];

    const addNewUser = (username, socketId) => {
        !onlineUsers.some((user) => user.username === username) &&
            onlineUsers.push({ username, socketId });
    };

    const removeUser = (socketId) => {
        onlineUsers = onlineUsers.filter((user) => user.socketId !== socketId);
    };

    const getUser = (username) => {
        return onlineUsers.find((user) => user.username === username);
    };

    io.on("connection", (socket) => {
        console.log('Connection established socket');
        
        socket.on("newUser", (username) => {

            addNewUser(username, socket.id);
        });

        socket.on("sendNotification", ({ senderName, receiverName, type }) => {
            const receiver = getUser(receiverName);
            io.to(receiver.socketId).emit("getNotification", {
                senderName,
                type,
            });
        });

        socket.on("sendText", ({ senderName, receiverName, text }) => {
            const receiver = getUser(receiverName);
            io.to(receiver.socketId).emit("getText", {
                senderName,
                text,
            });
        });

        socket.on("disconnect", () => {
            removeUser(socket.id);
            });
    });

    return router;
}