const db = require('../utils/connectDB');

module.exports = {
    async findAllScoreByMSSV(iduni){
        const items = await db('user_assignments').where("id_user_uni", iduni);
        return items.length > 0? items: null;
    },

    async findAllScoreByClassID(idclass){
        const items = await db('user_assignments').where("id_class", idclass);
        return items.length > 0? items: null;
    },

    async findAllScoreByIDAssignment(idassignment){
        const items = await db('user_assignments').where({id_assignment:idassignment});
        return items.length > 0? items: null;
    },
    async find1ScoreByIDAssignmentUser(idassignment, iduni){
        const items = await db('user_assignments')
                            .where({
                                id_assignment: idassignment,
                                id_user_uni: iduni
                            });
        return items.length > 0? items[0]: null;
    },


    del(id){
        return db('assignments').where("id", id).del();
    },

    addAssigmentGrade(listgradeassignment){
        return db('user_assignments').insert(listgradeassignment);
    },
    updateAssigmentGrade(idassignment, iduni, newgrade){
        return db('user_assignments')
                .update({grade: newgrade})
                .where({
                    id_user_uni: iduni,
                    id_assignment: idassignment
                });
    },
}