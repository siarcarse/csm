import Joi from 'joi';
import Boom from 'boom';
const course_lesson_teacher = [{
    method: 'POST',
    path: '/api/course_lesson_teacher',
    config: {
        handler: (request, reply) => {
            let course_lesson = request.payload.course_lesson;
            let teacher = request.payload.teacher;
            let sql = `INSERT INTO course_lesson_teacher (course_lesson, teacher)
                        VALUES (${course_lesson}, ${teacher})`;
            request.pg.client.query(sql, (err, result) => {
                if (err) {
                    reply({ message: err });
                } else {
                    reply({ message: result });
                }
            })
        },
        validate: {
            payload: Joi.object().keys({
                course_lesson: Joi.number().required().min(1).max(60),
                teacher: Joi.number().required(),
            })
        },
        auth: false
    }
}, {
    method: 'DELETE',
    path: '/api/course_lesson_teacher',
    config: {
        handler: (request, reply) => {
            let course_lesson = request.payload.course_lesson;
            let teacher = request.payload.teacher;
            let sql = `DELETE FROM course_lesson_teacher WHERE course_lesson = $1 AND teacher = $2`;
            request.pg.client.query(sql, [course_lesson, teacher], (err, result) => {
                if (err) {
                    reply({ message: err });
                } else {
                    reply({ message: result });
                }
            })
        },
        validate: {
            payload: Joi.object().keys({
                course_lesson: Joi.number().required(),
                teacher: Joi.number().required(),
            })
        },
        auth: false
    }
}];
export default course_lesson_teacher;
