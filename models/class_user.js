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

    async findNameByUserIDClass(id_class, id_uni){
        let items = await db('class_user').where({id_class:id_class,id_uni_user:id_uni})
        if(items.length > 0){
            return items[0].full_name_user;
        }
        return null;
    },

    async roleByClass(classID, is_teacher){
        let items = await db('class_user').where({id_class:classID,is_teacher:is_teacher})
        if (is_teacher){
            for (let i = 0; i < items.length; i++){
                items[i] = await user_db.oneIDUni(items[i].id_uni_user);
            }
        }
        return items;
    },
    async addUserToClass(classID, userid, full_name){
        console.log("add useer");
        await db('class_user').insert({
            id_class: classID,
            id_uni_user: userid,
            full_name_user: full_name,
            is_teacher: false
        })
    },
    async addTeacherToClass(classID, userid, full_name){
        console.log("add useer");
        await db('class_user').insert({
            id_class: classID,
            id_uni_user: userid,
            full_name_user: full_name,
            is_teacher: true
        })
    },
    async checkIsExistUserOnClass(classid, userid){
        let item = await db('class_user').where({
            id_class: classid,
            id_uni_user: userid
        })
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