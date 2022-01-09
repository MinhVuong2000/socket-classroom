const db = require('../utils/connectDB');
const users_db = require('../models/users.js');
const review_grade_db = require('../models/review_grade.js');
const moment = require('moment');

module.exports = {
    all(){
        return db('comments');
    },

    async commentsByReviewID(id_review){
        let items = await db('comments').where('id_review', id_review);
        for (let i = 0; i < items.length; i++){
            items[i].teacher = await users_db.one(items[i].id_teacher, false);
            items[i].student = await users_db.oneIDUni(items[i].id_user_uni, false);
            items[i].create_time = moment(items[i].create_time).format("DD/MM/YYYY HH:mm:ss");
        }
        console.log("commentsByReviewID(id_review)", items);
        return items;
    },

    async commentsByIDUniStudent(id_user_uni){
        let items = await db('comments').where('id_user_uni', id_user_uni);
        for (let i = 0; i < items.length; i++){
            items[i].teacher = await users_db.one(items[i].id_teacher, false);
            items[i].review_grade = await review_grade_db.one(items[i].id_review);
            items[i].create_time = moment(items[i].create_time).format("DD/MM/YYYY HH:mm:ss");
        }
        console.log("commentsByIDUniStudent(id_user_uni)", items);
        return items;
    },

    async commentsByIDTeacher(id_teacher){
        let items = await db('comments').where('id_teacher', id_teacher);
        for (let i = 0; i < items.length; i++){
            items[i].student = await users_db.oneIDUni(items[i].id_user_uni, false);
            items[i].review_grade = await review_grade_db.one(items[i].id_review);
            items[i].create_time = moment(items[i].create_time).format("DD/MM/YYYY HH:mm:ss");
        }
        console.log("commentsByIDTeacher of id_teacher", items);
        return items;
    },

    add(new_comments) {
        return db('comments').insert(new_comments);
    }
}