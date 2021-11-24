const db = require('../../../utils/connectDB')
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

    async isExisted(className){
        const item = await db('classes').where(db.raw('LOWER("class_name") = ?', className.toLowerCase()));
        return item.length>0 ? true : false;
    },

    add(new_classroom){
        return db('classes').insert(new_classroom);
    },
}