const db = require('../utils/connectDB');
const classess_db = require('../models/classes.js');

module.exports = {
    async allInUser(id_user_uni){
        const items = await db('notifications').where('id_user_uni', id_user_uni);
        for (let i = 0; i < items.length; i++){
            items[i].class = classess_db.one(items[i].id_class, id_user_uni);
            items[i].create_time = moment(items[i].create_time).format("DD/MM/YYYY HH:mm:ss");
        }
        return items;
    },

    async one(id){
        const items = await db('notifications').where('id', id);
        if (items.length===0) 
            return null;
        let item = items[0];
        item.class = classess_db.one(item.id_class, item.id_user_uni);
        item.create_time = moment(item.create_time).format("DD/MM/YYYY HH:mm:ss");
        return item;
    },

    updateStatus(id, new_status){
        return db('notifications').where('id', id).update('status', new_status);
    }
}
