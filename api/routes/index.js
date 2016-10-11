import Joi from 'joi';

import usersAPI from './users/users-api'
import roleAPI from './role/role-api'
import levelAPI from './level/level-api'
import lessonAPI from './lesson/lesson-api'
import coursesAPI from './courses/courses-api'
import course_lessonAPI from './course_lesson/course_lesson-api'
import course_studentAPI from './course_student/course_student-api'
import course_lesson_scheduleAPI from './course_lesson_schedule/course_lesson_schedule-api'
import course_lesson_teacherAPI from './course_lesson_teacher/course_lesson_teacher-api'
import studentAPI from './student/student-api'
import teacherAPI from './teacher/teacher-api'
import parentAPI from './parent/parent-api'
import person_commentAPI from './person_comment/person_comment-api'


const Password = {
    method: 'POST',
    path: '/api/change_password',
    config: {
        handler: (request, reply) => {
            var sql = "SELECT password FROM users WHERE id=$1";
            var password = request.payload.password;
            var user = request.payload.user;
            var new_password = request.payload.new_password;
            var new_password_repeat = request.payload.new_password_repeat;

            request.pg.client.query(sql, [user], (err, result) => {
                let passwordDB = result.rows[0].password;
                var message = {};
                message.error = false;
                if (password === passwordDB) {
                    let sql = "UPDATE users SET password=$1 WHERE id=$2";
                    request.pg.client.query(sql, [new_password, user], (err, result) => {
                        if (!err) {
                            return reply({ message });
                        }
                    });
                } else {
                    message.error = true;
                    message.text = 'La contraseña actual no coincide con la del usuario!';
                    return reply({ message });
                }
            });
        },
        validate: {
            payload: Joi.object().keys({
                password: Joi.string().required().min(1),
                user: Joi.number().required().min(1),
                new_password: Joi.string().required().min(1),
                new_password_repeat: Joi.string().required().min(1),
            })
        }
    }
}
const rulesAPI = [].concat(
    usersAPI,
    roleAPI,
    levelAPI,
    lessonAPI,
    studentAPI,
    teacherAPI,
    coursesAPI,
    parentAPI,
    course_lessonAPI,
    course_studentAPI,
    course_lesson_teacherAPI,
    person_commentAPI,
    course_lesson_scheduleAPI,
    Password
);
export default rulesAPI;
