const db = require('../../../utils/connectDB')

module.exports = {
    all(){
        return db('Users');
    },

    async one(ID, is_detail=false){
        let items = await db('Users').where('id', ID);
        if (items.length==0)
            return null;
        if (!is_detail){
            let item = {};
            item.full_name = items[0].full_name;
            item.username = items[0].username;
            return item;
        }
        return items[0];
    }
}
