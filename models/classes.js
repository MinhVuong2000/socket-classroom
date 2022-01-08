const db = require('../utils/connectDB')
const user_db = require('./users')
const class_user_db = require('./class_user')
const class_user = require('./class_user')

module.exports = {
    async all(iduser){
        let listclass_user = await db('class_user').where('id_uni_user', iduser);
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
        return listitems;
    },

    async one(idclass, id_uni){

        let class_user_item = await db('class_user').where({
            'id_uni_user': id_uni,
            'id_class': idclass
        });
        //console.log("Class user item",class_user_item);
        if (class_user_item.length==0){
            return {message: 'not enroll class'};
        }
        let item = await db('classes').where('id', idclass);
        if (item.length==0){
            return {message: 'not enroll class'};
        }
        item = item[0];
        //console.log("item trong cai one của class ne: ", item)
        item.admin_info = await user_db.one(item.id_admin);
        //console.log("Admin info ne: ", item);
        item.list_teacher = await class_user_db.roleByClass(idclass,true);
        item.list_student = await class_user_db.roleByClass(idclass,false);
        item.isTeacher = class_user_item[0].is_teacher;
        console.log("data get derail 1 class infor on classes db",item);
        return item;
    },

    async findClassByLink(link){
        let item = await db('classes').where('invitation_link', link);
        if (item.length==0){
            return null;
        }
        item = item[0];
        let ID = item.id;
        item.admin_info = await user_db.one(item.id_admin);
        item.list_teacher = await class_user_db.roleByClass(ID,true)
        item.list_student = await class_user_db.roleByClass(ID,false)
        return item;
    },
    async findIDClassByLink(link){
        let item = await db('classes').where('invitation_link', link);
        if (item.length==0){
            return null;
        }
        
        return item[0].id;
    },

    async findCodeClassByLink(link){
        let item = await db('classes').where('invitation_link', link);
        if (item.length==0){
            return null;
        }
        
        return item[0].code;
    },

    async isExisted(className){
        const item = await db('classes').where(db.raw('LOWER("class_name") = ?', className.toLowerCase()));
        return item.length>0 ? true : false;
    },

    async add(new_classroom, iduni, fullname){
        await db('classes').insert(new_classroom);
        let items = await db('classes').where({
            class_name: new_classroom.class_name
        })
        if(items.length == 0){
            return null;
        }
        await db('class_user').insert({
            id_class: items[0].id,
            id_uni_user: iduni,
            is_teacher: true,
            full_name_user: fullname
        });
        return true;
    },

    async isOwnerClass(id_class, id_user){
        let items = await db('classes').where({
            'id_admin': id_user,
            'id': id_class
        });
        return items.length==0? false: true;
    },

    async del(id){
        await db('classes').where('id', id).del();
    },
    async checkCodeClassExist(code){
        let item = await db('classes').where('code', code);
        if (item.length==0){
            return false;
        }
        return true;
    },
    async findClassByCode(code){
        let item = await db('classes').where('code', code);
        if (item.length==0){
            return false;
        }
        return item[0].id;
    }
}