const db = require('../utils/connectDB');
const moment = require('moment');
const { add } = require('./comments');

module.exports = {
    all(){
        return db('admins');
    },

    one(id, is_detail=false){
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

    add(new_addmin){
        return db('admins').insert(new_addmin);
    }
}