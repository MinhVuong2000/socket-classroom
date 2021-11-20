const db = require('../../../utils/connectDB')
const user_db = require('./users')
const class_user_db = require('./class_user')

module.exports = {
    async all(){
        let items = await db('classes');
        for (let i = 0; i < items.length; i++){
            items[i].id_admin = await user_db.one(items[i].id_admin)
        }
        return items;
    },

    async one(ID){
        let item = await db('classes').where('id', ID);
        if (item.length==0){
            return null;
        }
        item = item[0];
        item.admin_info = await user_db.one(item.id_admin);
        item.list_teacher = await class_user_db.roleByClass(ID,true)
        item.list_student = await class_user_db.roleByClass(ID,false)
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