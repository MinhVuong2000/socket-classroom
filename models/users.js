const db = require('../utils/connectDB')
const moment = require('moment');
module.exports = {
    async all(){
        let items = await db('users');
        for(let i = 0; i<items.length; i++){
            items[i].create_time = moment(items[i].create_time).format("DD/MM/YYYY HH:mm:ss");
        }
        return items
    },

    async one(ID, is_detail=false){
        let items = await db('users').where('id', ID);
        if (items.length==0)
            return null;
        if (!is_detail){
            let item = {};
            item.id = items[0].id;
            item.full_name = items[0].full_name;
            item.username = items[0].username;
            item.id_uni = items[0].id_uni;
            item.email = items[0].email;
            item.address = items[0].address;
            item.phone = items[0].phone;
            return item;
        }
        return items[0];
    },
    
    async oneIDUni(IDuni, is_detail=false){
        let items = await db('users').where('id_uni', IDuni);
        if (items.length==0)
            return null;
        if (!is_detail){
            let item = {};
            item.full_name = items[0].full_name;
            item.username = items[0].username;
            item.id_uni = items[0].id_uni;
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

    lockAccount(id){
        return db('users').where('id', id).update('status', 0);
    },
    
    addNewUser(new_user){
        new_user.create_time = new Date().toISOString();
        return db('users').insert(new_user);
    },

    updateProfile(id, updated_profile){
        return db('users').where('id', id).update(updated_profile);
    },
    adminUpdateProfile(id, stuid){
        return db('users').where('id', id).update({
            id_uni: stuid,
        });
    },
    updateOTP(email, OTP){
        return db('users').where('email', email).update({'otp': OTP});
    },
    updateStudentID(id, newstuid){
        return db('users').where('id', id).update({'id_uni': newstuid});
    },
    updateOTPByIDUser(id_user, OTP){
        return db('users').where('id', id_user).update({'otp': OTP});
    },
    updatePassword(email, password){
        return db('users').where('email', email).update({'password': password});
    }
}