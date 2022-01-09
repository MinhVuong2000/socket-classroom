const db = require('../utils/connectDB');
const users_db = require('../models/users.js');
const classess_db = require('../models/classes.js');
const assignments_db = require('../models/assignments.js');

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
    }
}