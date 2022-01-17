const moment = require('moment');
var app = require('express');
var router = app.Router();

const jwtHelper = require("../utils/jwt.helper");
const assignments_db = require('../models/assignments')
const users_db = require('../models/users')
const classes_db = require('../models/classes')
const reviews_db = require('../models/review_grade')
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

        // ----------------------------------------------------------------
        //socket io for user
        socket.on('newUser', async (access_token) => {
            console.log('Socket newUser');
            console.log('access token', access_token);
            decoded_user = await tokenToUser(access_token);
            console.log('socket decoded_user', decoded_user);
            console.log('onlineUsers old', onlineUsers);
            addNewUser(decoded_user.id_uni, socket.id);
            console.log('onlineUsers update', onlineUsers);
        });

        // ----------------------------------------------------------------
        //socket io send to teacher
        socket.on("sendfromStudentReview", async ({ access_token, id_class, id_assignment }) => {
            console.log('Socket sendfromStudentReview');
            const decoded_user = await tokenToUser(access_token);
            console.log('socket decoded_user', decoded_user);
            const id_uni_user = decoded_user.id_uni;

            const assign = await assignments_db.one(id_assignment);
            console.log("assign", assign);
            const _class = await classes_db.one(id_class, id_uni_user);
            console.log("_class", _class);
            const message = `${decoded_user.full_name} đã phúc khảo điểm bài tập ${assign.name}`;
            let new_noti = {
                id_class: id_class,
                id_assignment: id_assignment,
                message: message,
                create_time: moment().add(7, 'hours'),
                status: 0
            }
            console.log('new notifications not have id_user_uni', new_noti);

            const receivers = _class.list_teacher;
            console.log('List teacher get noti from review of student', receivers)
            for (let i = 0; i < receivers.length; i++){
                new_noti.id_user_uni =  receivers[i].id_uni;
                console.log('new notifications had id_user_uni', new_noti);
                await notis_db.add(new_noti);
                new_noti_class = await notis_db.oneByUniIDandCreateTime(
                    new_noti.id_user_uni, 
                    new_noti.create_time
                );
                receiver = getUser(new_noti_class.id_user_uni);
                console.log('teacher ', i, ":", receiver)
                if (receiver){
                    io.to(receiver.socketId).emit("getNotifications", {
                        id: new_noti_class.id,
                        id_user_uni: new_noti_class.id_user_uni,
                        id_class: new_noti_class.id_class,
                        id_assignment: new_noti_class.id_assignment,
                        message: new_noti_class.message,
                        create_time: new_noti_class.create_time,
                        status: 0,
                        class_name: _class.class_name,
                    });
                }
            }
        });

        // ----------------------------------------------------------------
        //socket io send to student
        socket.on('sendPublicMark', async ({access_token, id_class, id_assignment}) => {
            console.log('Socket sendPublicMark');
            const decoded_user = await tokenToUser(access_token);
            console.log('socket decoded_user', decoded_user);
            const id_uni_user = decoded_user.id_uni;

            const assign = await assignments_db.one(id_assignment);
            console.log("assign", assign);
            const _class = await classes_db.one(id_class, id_uni_user);
            console.log("_class", _class);
            const message = `Điểm bài tập ${assign.name} đã được đăng tải`;
            let new_noti = {
                id_class: id_class,
                id_assignment: id_assignment,
                message: message,
                create_time: moment().add(7, 'hours'),
                status: 0
            }
            console.log('new notifications not have id_user_uni', new_noti);

            const receivers = _class.list_student;
            console.log('List students get noti from public mark', receivers)
            for (let i = 0; i < receivers.length; i++){
                new_noti.id_user_uni =  receivers[i].id_uni_user;
                console.log('new notifications had id_user_uni', new_noti);
                await notis_db.add(new_noti);
                new_noti_class = await notis_db.oneByUniIDandCreateTime(
                    new_noti.id_user_uni, 
                    new_noti.create_time
                );
                console.log("Get noti from db after add",new_noti_class);
                receiver = getUser(new_noti_class.id_user_uni);
                console.log('teacher ', i, ":", receiver)
                if (receiver){
                    io.to(receiver.socketId).emit("getNotifications", {
                        id: new_noti_class.id,
                        id_user_uni: new_noti_class.id_user_uni,
                        id_class: new_noti_class.id_class,
                        id_assignment: new_noti_class.id_assignment,
                        message: new_noti_class.message,
                        create_time: new_noti_class.create_time,
                        status: 0,
                        class_name: _class.class_name,
                    });
                }
            }
        })

        socket.on('sendFinalGradefromTeacher', async ({access_token, id_class, id_assignment, id_student}) => {
            console.log('Socket sendPublicMark');
            const decoded_user = await tokenToUser(access_token);
            console.log('socket decoded_user', decoded_user);
            const id_uni_user = decoded_user.id_uni;

            const assign = await assignments_db.one(id_assignment);
            console.log("assign", assign);
            const _class = await classes_db.one(id_class, id_uni_user);
            console.log("_class", _class);
            const message = `Điểm bài tập ${assign.name} đã được giáo viên cho điểm cuối cùng sau phúc khảo`;
            let new_noti = {
                id_user_uni: id_student,
                id_class: id_class,
                id_assignment: id_assignment,
                message: message,
                create_time: moment().add(7, 'hours'),
                status: 0
            }
            console.log('new notifications', new_noti);
            await notis_db.add(new_noti);
            new_noti_class = await notis_db.oneByUniIDandCreateTime(
                new_noti.id_user_uni, 
                new_noti.create_time
            );
            receiver = getUser(new_noti_class.id_user_uni);
            console.log('teacher ', i, ":", receiver)
            if (receiver){
                io.to(receiver.socketId).emit("getNotifications", {
                    id: new_noti_class.id,
                    id_user_uni: new_noti_class.id_user_uni,
                    id_class: new_noti_class.id_class,
                    id_assignment: new_noti_class.id_assignment,
                    message: new_noti_class.message,
                    create_time: new_noti_class.create_time,
                    status: 0,
                    class_name: _class.class_name,
                });
            }
        })
        

        // ----------------------------------------------------------------
        //socket io send Comment to student/teacher
        socket.on('sendComment', async ({access_token, id_review}) => {
            console.log('Socket sendCommentfromTeacher');
            const decoded_user = await tokenToUser(access_token);
            console.log('socket decoded_user', decoded_user);
            console.log('socket id_review', id_review);

            const review = await reviews_db.one(id_review);
            console.log("review", review);
            const message = `${decoded_user.full_name} đã bình luận trong một phúc khảo điểm của bài tập ${review.assignment.name}`;
            let new_noti = {
                id_class: review.id_class,
                id_assignment: review.id_assignment,
                message: message,
                create_time: moment().add(7, 'hours'),
                status: 0
            }
            console.log('new notifications not have id_user_uni', new_noti);
            console.log('teacher of class', review.class.list_teacher);
            if (review.class.list_teacher.some(
                teacher => teacher.id_uni===decoded_user.id_uni
            )){
                const id_student = review.id_user_uni;
                console.log('Id_uni students get noti from public mark', id_student)
                new_noti.id_user_uni = id_student;
                console.log('new notifications had id_user_uni', new_noti);
                await notis_db.add(new_noti);
                new_noti_class = await notis_db.oneByUniIDandCreateTime(
                    new_noti.id_user_uni, 
                    new_noti.create_time
                );
                receiver = getUser(new_noti_class.id_user_uni);
                console.log('student ', i, ":", receiver)
                if (receiver){
                    io.to(receiver.socketId).emit("getNotifications", {
                        id: new_noti_class.id,
                        id_user_uni: new_noti_class.id_user_uni,
                        id_class: new_noti_class.id_class,
                        id_assignment: new_noti_class.id_assignment,
                        message: new_noti_class.message,
                        create_time: new_noti_class.create_time,
                        status: 0,
                        class_name: review.class.class_name,
                    });
                }
            }
            else{
                const receivers = review.class.list_teacher;
                console.log('List students get noti from public mark', receivers)
                for (let i = 0; i < receivers.length; i++){
                    new_noti.id_user_uni =  receivers[i].id_uni;
                    console.log('new notifications had id_user_uni', new_noti);
                    await notis_db.add(new_noti);
                    new_noti_class = await notis_db.oneByUniIDandCreateTime(
                        new_noti.id_user_uni, 
                        new_noti.create_time
                    );
                    receiver = getUser(new_noti_class.id_user_uni);
                    console.log('teacher ', i, ":", receiver)
                    if (receiver){
                        io.to(receiver.socketId).emit("getNotifications", {
                            id: new_noti_class.id,
                            id_user_uni: new_noti_class.id_user_uni,
                            id_class: new_noti_class.id_class,
                            id_assignment: new_noti_class.id_assignment,
                            message: new_noti_class.message,
                            create_time: new_noti_class.create_time,
                            status: 0,
                            class_name: review.class.class_name,
                        });
                    }
                }
            }
        })

        socket.on("disconnect", () => {
            console.log('disconnect socket');
            removeUser(socket.id);
        });
    });

    return router;
}