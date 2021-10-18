const db = require('../../utils/connectDB')

module.exports = {
    all(){
        return db('Classes');
    },

    async one(ID){
        const item = await db('Classes').where('id', ID);
        return item.length>0 ? item[0] : null;
    },

    async isExisted(className){
        const item = await db('Classes').where('className', className);
        return item.length>0 ? true : false;
    },

    add(new_classroom){
        return db('Classes').insert(new_classroom);
    }

}