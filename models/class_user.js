const db = require('../utils/connectDB')
const user_db = require('./users')

module.exports = {
    all(){
        return db('class_user');
    },

    async roleByClass(classID, is_teacher){
        let items = await db('class_user').where({id_class:classID,is_teacher:is_teacher})
        for (let i = 0; i < items.length; i++){
            items[i] = await user_db.one(items[i].id_user);
        }
        return items;
    },
    async addUserToClass(classID, userid){
        console.log("add useer");
        await db('class_user').insert({
            id_class: classID,
            id_user: userid,
            is_teacher: false
        })
    },
    async checkIsExistUserOnClass(classid, userid){
        let item = await db('class_user').where({
            id_class: classid,
            id_user: userid
        })
        console.log('Is exit on class', item);
        if(item.length==0){
            return false;
        }
        return true;
    },

    async isTeacherinClass(id_class, id_user){
        let items = await db('class_user').where({
            'id_user': id_user,
            'id_class': id_class,
            'is_teacher': true,
        });
        console.log(items);
        return items.length==0? false: true;
    },
}