const db = require('../utils/connectDB')
const user_db = require('./users')
const class_user_db = require('./class_user')
const class_user = require('./class_user')

module.exports = {
    async all(iduser){
        let listclass_user = await db('class_user').where('id_user', iduser);
        if(listclass_user.length == 0){
            return {message: 'not enroll class'};
        }
        //console.log(listclass_user);
        let listitems = [];
        for (let index = 0; index < listclass_user.length; index ++ ){
            let items = await db('classes').where('id',listclass_user[index].id_class);
            for (let i = 0; i < items.length; i++){
                items[i].id_admin = await user_db.one(items[i].id_admin)
            }
            listitems.push(items[0]);
        }
        console.log(listitems);
        return listitems;
    },

    async one(idclass, iduser){
        let class_user_item = await db('class_user').where({
            'id_user': iduser,
            'id_class': idclass
        });
        console.log(class_user_item);
        if (class_user_item.length==0){
            return {message: 'not enroll class'};
        }
        let item = await db('classes').where('id', idclass);
        if (item.length==0){
            return {message: 'not enroll class'};
        }
        item = item[0];
        item.admin_info = await user_db.one(item.id_admin);
        item.list_teacher = await class_user_db.roleByClass(idclass,true)
        item.list_student = await class_user_db.roleByClass(idclass,false);
        item.isTeacher = class_user_item[0].is_teacher;
        console.log(item);
        return item;
    },

    async findClassByLink(link){
        let item = await db('classes').where('invitation_link', link);
        if (item.length==0){
            return null;
        }
        item = item[0];
        console.log(item);
        let ID = item.id;
        item.admin_info = await user_db.one(item.id_admin);
        item.list_teacher = await class_user_db.roleByClass(ID,true)
        item.list_student = await class_user_db.roleByClass(ID,false)
        return item;
    },
    async findIDClassByLink(link){
        console.log("inside findIDClassByLink");
        let item = await db('classes').where('invitation_link', link);
        // console.log("typeof item:" + typeof item);
        // console.log("item 0:" + item[0]);
        console.log("found ID: " + item[0].id);
        if (item.length==0){
            return null;
        }
        
        return item[0].id;
    },

    async isExisted(className){
        const item = await db('classes').where(db.raw('LOWER("class_name") = ?', className.toLowerCase()));
        return item.length>0 ? true : false;
    },

    async add(new_classroom){
        await db('classes').insert(new_classroom);
        let items = await db('classes').where({
            class_name: new_classroom.class_name
        })
        if(items.length == 0){
            return null;
        }
        await db('class_user').insert({
            id_class: items[0].id,
            id_user: new_classroom.id_admin,
            is_teacher: true
        });
        return true;
    },
}