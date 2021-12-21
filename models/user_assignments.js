const { assign } = require('nodemailer/lib/shared');
const db = require('../utils/connectDB');

module.exports = {
    async findAllScoreByMSSV(iduni){
        const items = await db('user_assignments').where("id_user_uni", iduni);
        return items.length > 0? items: null;
    },

    async findAllScoreByClassID(idclass){
        let items = await db('user_assignments').where("id_class", idclass);
        
        console.log("findAllScoreByClassID: ", items);
        let listStudentGrade = [];
        if(items.length <= 0){
            return null;
        }
        while(items.length>0){
            let average = 0;
            let structure = 0;
            let userRemove = items[0].id_user_uni;
            let new_arr = await items.filter(item => item.id_user_uni == userRemove); //new_arr là danh sách các bài tập của user_a
            console.log("Danh sach cac bai tap usera: ", new_arr);
            let temp = {};
            let userinfo = await db('class_user').where({
                id_uni_user: items[0].id_user_uni,
                id_class: idclass
            });
            
            temp.username = userinfo[0].full_name_user;
            temp.id_uni_user = userinfo[0].id_uni_user;
            temp.assignmentGrade = [];
            //Xét từng môn học của học sinh a
            for(let i = 0; i < new_arr.length; i++){
                let assignmentinfo = await db('assignments').where("id", new_arr[i].id_assignment);
                let assignTemp = {};
                assignTemp.nameAssignment = assignmentinfo[0].name;
                assignTemp.gradeAssignment = new_arr[i].grade;
                assignTemp.orders = assignmentinfo[0].orders;
                assignTemp.idAssignment = assignmentinfo[0].id;
                assignTemp.point = assignmentinfo[0].point;
                temp.assignmentGrade.push(assignTemp);
                if(new_arr[i].grade != null){
                    average = average + assignmentinfo[0].point*new_arr[i].grade
                }
                structure += assignmentinfo[0].point;
            }
            average = average/structure;
            average = average.toFixed(2);
            await temp.assignmentGrade.sort((firstItem, secondItem) => firstItem.orders - secondItem.orders);
            temp.assignmentGrade.push({
                nameAssignment: "Điểm tổng kết",
                gradeAssignment: average,
                orders: null,
                point: 10
            })
            listStudentGrade.push(temp);
            
            items = await items.filter(item => item.id_user_uni !== userRemove);
             //Loại các rows của user_a khỏi list bài tập
            
        }
        let templist = []; 
        for(i = 0; i<listStudentGrade[0].assignmentGrade.length; i++){
            let temp2 = {};
            temp2.name = listStudentGrade[0].assignmentGrade[i].nameAssignment;
            temp2.orders = listStudentGrade[0].assignmentGrade[i].orders;
            temp2.point = listStudentGrade[0].assignmentGrade[i].point;
            temp2.idAssignment = listStudentGrade[0].assignmentGrade[i].idAssignment;
            templist.push(temp2);
        }
        
        let result = {
            listAssignment: templist,
            listStudentGrade: listStudentGrade
        }
        return result;
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