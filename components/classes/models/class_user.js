const db = require('../../../utils/connectDB')
const user_db = require('./users')

module.exports = {
    all(){
        return db('Class_User');
    },

    async roleByClass(classID, is_teacher){
        let items = await db('Class_User').where({id_class:classID,is_teacher:is_teacher})
        for (let i = 0; i < items.length; i++){
            items[i] = await user_db.one(items[i].id_user);
        }
        return items;
    },
}