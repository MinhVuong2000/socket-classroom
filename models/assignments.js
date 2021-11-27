const db = require('../utils/connectDB');
const { add } = require('./classes');

module.exports = {
    all(){
        return db('assignments');
    },

    async one(id){
        const items = await db('assignments').where({id:id});
        return items.length > 0? items[0]: null;
    },

    add(new_assignment){
        return db('assignments').insert(new_assignment);
    },

    del(id){
        return db('assignments').where("id", id).del();
    },

    async isAssignmentinClass(id, id_class){
        const items = await db('assignments').where({
            id:id,
            id_class: id_class
        });
        return items.length > 0? true: false;
    },
}