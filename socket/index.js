const moment = require('moment');
var app = require('express');
var router = app.Router();

const jwtHelper = require("../utils/jwt.helper");
const assignments_db = require('../models/assignments')
const users_db = require('../models/users')
const classes_db = require('../models/classes')
const class_user_db = require('../models/class_user')
const notis_db = require('../models/notifications')

const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
let onlineUsers = [];

module.exports = function(io) {
    const addNewUser = (id_uni, socketId) => {
        removeUser(id_uni);
        onlineUsers.push({ id_uni, socketId });
    };

    const removeUser = (socketId) => {
        onlineUsers = onlineUsers.filter((user) => user.socketId !== socketId);
    };

    const getUser = (id_uni) => {
        return onlineUsers.find((user) => user.id_uni === id_uni);
    };


    const tokenToUser = async (token) => {
        decodedToken = await jwtHelper.verifyToken(token, accessTokenSecret);
        console.log('decodedToken', decodedToken);
        return users_db.one(decodedToken.data.id);
    }

    io.on("connection", async (socket) => {
        console.log('Connection established socket');
        console.log('OnlineUser', onlineUsers);
        // // console.log("Socket header", socket.headers["x-access-token"]);
        // // console.log("Socket request", socket.request);
        // const tokenFromClient = socket.request.headers["x-access-token"];
        // // console.log("Socket token", tokenFromClient);

        socket.on('newUser', async (access_token) => {
            console.log('Socket newUser');
            console.log('access token', access_token);
            decoded_user = await tokenToUser(access_token);
            console.log('socket decoded_user', decoded_user);
            console.log('onlineUsers old', onlineUsers);
            addNewUser(decoded_user.id_uni, socket.id);
            console.log('onlineUsers update', onlineUsers);
        });

        socket.on("sendfromStudentReview", async ({ access_token, id_class, id_assignment }) => {
            console.log('Socket sendfromStudentReview');
            const decoded_user = await tokenToUser(access_token);
            console.log('socket decoded_user', decoded_user);
            const id_uni_user = decoded_user.id_uni;

            const assign = await assignments_db.one(id_assignment);
            console.log("assign", assign);
            const _class = await classes_db.one(id_class, id_uni_user);
            console.log("_class", _class);
            const message = `${decoded_user.full_name} vừa mới phúc khảo điểm bài tập ${assign.name}`;
            const new_noti = {
                id_class: id_class,
                id_assignment: id_assignment,
                message: message,
                create_time: moment(),
                status: 0
            }
            console.log('new notifications not have id_user_uni', new_noti);


            const receivers = _class.list_teacher;
            console.log('List teacher get noti from review of student', receivers)
            for (let i = 0; i < receivers.length; i++){
                new_noti.id_user_uni =  receivers[i].id_uni;
                console.log('new notifications had id_user_uni', new_noti);
                await notis_db.add(new_noti);
                receiver = getUser(receivers[i].id_uni);
                console.log('teacher ', i, ":", receiver)
                if (receiver){
                    io.to(receiver.socketId).emit("getStudentReview", {
                        id_user_uni: receivers[i].id_uni,
                        id_class: id_class,
                        id_assignment: id_assignment,
                        message: message,
                        create_time: moment(new_noti.create_time).format("DD/MM/YYYY HH:mm:ss"),
                        status: 0,
                        class_name: _class.class_name,
                    });
                }
            }
        });

        socket.on("disconnect", () => {
            console.log('disconnect socket');
            removeUser(socket.id);
        });
    });

    return router;
}