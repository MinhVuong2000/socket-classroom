const db = require('../utils/connectDB');
const { add } = require('./classes');

module.exports = {
    all(){
        return db('assignments');
    },

    allInClass(id_class){
        return db('assignments').where("id_class", id_class);
    },

    async one(id){
        const items = await db('assignments').where({id:id});
        return items.length > 0? items[0]: null;
    },
    async findAssignmentByNameIDClass(idclass, name){
        const items = await db('assignments').where({id_class:idclass, name: name});
        return items.length > 0? items[0]: null;
    },

    async assignmentShowGrade(idclass, state){
        const items = await db('assignments').where({id_class:idclass, showgrade: state});
        return items.length > 0? items: null;
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
    async findMaxOrderByIdclass(id_class){
        const items = await db('assignments')
                .orderBy('orders', 'desc')
                .where('id_class', '=', id_class)
        return items.length > 0? items[0]: false;
    },
    async updateOrderByIdAssignment(idassign,  neworder){
        const items = await db('assignments')
                .where({id: idassign})
                .update({
                    orders: neworder
                });
        return true;
    },
    async editAssignment(idassign, name, point){
        const items = await db('assignments')
                .where({id: idassign})
                .update({
                    name: name,
                    point: point
                });
        return true;
    },
    async updateShowGradeByIDAssignment(idassignment, state){
        return db('assignments').update({
                                        showgrade: state
                                    })
                                    .where({
                                        id: idassignment
                                    });
    },
}