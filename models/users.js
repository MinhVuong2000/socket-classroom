const db = require('../utils/connectDB')

module.exports = {
    all(){
        return db('users');
    },

    async one(ID, is_detail=false){
        let items = await db('users').where('id', ID);
        if (items.length==0)
            return null;
        if (!is_detail){
            let item = {};
            item.full_name = items[0].full_name;
            item.username = items[0].username;
            return item;
        }
        return items[0];
    },

    async findUserByID(ID, is_detail=false){
        let items = await db('users').where('id', ID);
        if (items.length==0)
            return null;
        if (!is_detail){
            let userinfor = {};
            userinfor.username = items[0].username;
            userinfor.password = items[0].password;
            userinfor.fullname = items[0].full_name;
            userinfor.email = items[0].email;
            userinfor.phone = items[0].phone;
            userinfor.address = items[0].address;
            userinfor.mssv = items[0].id_uni;
            let listclass = [];
            let grade = await db('class_user').where('id_user', ID);
            if (grade.length > 0){
                for (i = 0; i < grade.length; i++){
                    let classdetail = await db('classes').where('id', grade[i].id_class);
                    let item =  {};
                    item.id_class = grade[i].id_class;
                    item.classname = classdetail[0].class_name;
                    item.description = classdetail[0].description;
                    item.score = grade[i].mark;
                    item.isteacher = grade[i].is_teacher;
                    listclass.push(item);
                }
            }
            userinfor.listclass = listclass;
            console.log(userinfor);
            return userinfor;
        }
        return items[0];
    },

    async findUserByMSSV(mssv, is_detail=false){
        let items = await db('users').where('id_uni', mssv);
        if (items.length==0)
            return null;
        if (!is_detail){
            let userinfor = {};
            userinfor.username = items[0].username;
            userinfor.password = items[0].password;
            userinfor.fullname = items[0].full_name;
            userinfor.email = items[0].email;
            userinfor.phone = items[0].phone;
            userinfor.address = items[0].address;
            userinfor.mssv = items[0].id_uni;
            let listclass = [];
            let grade = await db('class_user').where('id_user', ID);
            if (grade.length > 0){
                for (i = 0; i < grade.length; i++){
                    let classdetail = await db('classes').where('id', grade[i].id_class);
                    let item =  {};
                    item.id_class = grade[i].id_class;
                    item.classname = classdetail[0].class_name;
                    item.description = classdetail[0].description;
                    item.score = grade[i].mark;
                    item.isteacher = grade[i].is_teacher;
                    listclass.push(item);
                }
            }
            userinfor.listclass = listclass;
            console.log(userinfor);
            return userinfor;
        }
        return items[0];
    },

    async findUserByUsername(username){
        let items = await db('users').where('username', username);
        if (items.length==0)
            return null;
        return items[0];
    },

    async findUserByEmail(email, is_detail=false){
        let items = await db('users').where('email', email);
        if (items.length==0)
            return null;
        return items[0];
    },

    async checkAvailableMSSV(mssv){
        let items = await db('users').where('id_uni', mssv);
        if (items.length==0)
            return null;
        return items[0];
    },
    async addNewUser(new_user){
        return db('users').insert(new_user);
    }
}