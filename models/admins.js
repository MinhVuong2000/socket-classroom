const db = require('../utils/connectDB');
const moment = require('moment');
const { add } = require('./comments');

module.exports = {
    async all(){
        let items = await db('admins');
        for(let i = 0; i<items.length; i++){
            items[i].create_time = moment(items[i].create_time).format("DD/MM/YYYY HH:mm:ss");
        }
        return items
    },

    async one(id, is_detail=false){
        let items = await db('admins').where('id', id);
        if (items.length==0)
            return null;
        if (!is_detail){
            let item = {};
            item.id = items[0].id;
            item.full_name = items[0].full_name;
            item.username = items[0].username;
            item.is_super = items[0].is_super;
            item.email = items[0].email;
            item.create_time = moment(items[0].create_time).format("DD/MM/YYYY HH:mm:ss");
            item.otp = items[0].otp;
            return item;
        }
        return items[0];
    },

    async findAdminByUsername(username){
        let items = await db('admins').where('username', username);
        if (items.length==0)
            return null;
        return items[0];
    },
    async findAdminByEmail(email){
        let items = await db('admins').where('email', email);
        if (items.length==0)
            return null;
        return items[0];
    },
    add(new_admin){
        return db('admins').insert(new_admin);
    }
}