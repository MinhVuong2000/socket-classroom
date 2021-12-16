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
        console.log("findmaxorder: ",items[0]);
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
                                        id_assignment: idassignment
                                    });
    },
}