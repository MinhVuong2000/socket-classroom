const db = require('../utils/connectDB');
const users_db = require('../models/users.js');
const classess_db = require('../models/classes.js');
const assignments_db = require('../models/assignments.js');
const user_assignments_db = require('./user_assignments');

module.exports = {
    all(){
        return db('review_grade');
    },

    async one(id){
        const items = await db('review_grade').where('id', id);
        if (items.length===0)
            return null;
        let item = items[0];
        item.student = users_db.oneIDUni(item.id_user_uni, false);
        item.assignment = assignments_db.one(item.id_assignment);
        item.class = classess_db.one(item.id_class, item.id_user_uni);
        console.log(item);
        return item;
    },

    add(new_review) {
        return db('review_grade').insert(new_review);
    },

    updateStatus(id, new_status){
        return db('review_grade').where('id', id).update('status', new_status);
    },
    async getStatus(idAssignment, id_uni){
        item = await db('review_grade').where({
            id_assignment: idAssignment,
            id_user_uni: id_uni
        });
        if(item.length > 0){
            return item[0];
        }
        return null;
    },
    async findReviewByUserAssignment(id_uni, id_assignment){
        const items = await db('review_grade').where({
            id_user_uni: id_uni,
            id_assignment: id_assignment
        });
        if (items.length===0)
            return null;
        let item = {};
        item.review = items[0];
        item.student = users_db.oneIDUni(items[0].id_user_uni, false);
        item.assignment = assignments_db.one(items[0].id_assignment);
        item.class = classess_db.one(items[0].id_class, items[0].id_user_uni);
        console.log(item.student);
        return item;
    },
    async findReviewGradeByUserAssignment(id_uni, id_assignment){
        const items = await db('review_grade').where({
            id_user_uni: id_uni,
            id_assignment: id_assignment
        });
        if (items.length===0)
            return null;
        let item = items[0];
        if(item.status == -1){
            return null;
        }
        let grade = await user_assignments_db.find1ScoreByIDAssignmentUser(id_assignment, id_uni);
        if(grade == null){
            return null;
        }
        return grade.grade;
    },
}