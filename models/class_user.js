const db = require('../utils/connectDB')
const user_db = require('./users')

module.exports = {
    all(){
        return db('class_user');
    },

    async add(new_students_class){
        await db('class_user').insert(new_students_class);
    },

    async modify_fullname(id_class, id_uni_user, full_name_user){
        return await db('class_user').where({
            'id_class': id_class, 
            'id_uni_user': id_uni_user
        }).update('full_name_user', full_name_user)
    },

    async roleByClass(classID, is_teacher){
        let items = await db('class_user').where({id_class:classID,is_teacher:is_teacher})
        if (is_teacher){
            for (let i = 0; i < items.length; i++){
                items[i] = await user_db.oneIDUni(items[i].id_uni_user);
            }
        }
        console.log(items);
        return items;
    },
    async addUserToClass(classID, userid){
        console.log("add useer");
        await db('class_user').insert({
            id_class: classID,
            id_uni_user: userid,
            is_teacher: false
        })
    },
    async checkIsExistUserOnClass(classid, userid){
        let item = await db('class_user').where({
            id_class: classid,
            id_uni_user: userid
        })
        console.log('Is exit on class', item);
        if(item.length==0){
            return false;
        }
        return true;
    },

    async isTeacherinClass(id_class, id_user){
        let items = await db('class_user').where({
            'id_uni_user': id_user,
            'id_class': id_class,
            'is_teacher': true,
        });
        console.log(items);
        return items.length==0? false: true;
    },
    async allStudentInClass(id_class){
        let items = await db('class_user').where({
            'id_class': id_class,
            'is_teacher': false,
        });
        //console.log(items);
        return items.length==0? false: items;
    },
}