import Joi from 'joi';
import Boom from 'boom';
const person_comment = [{
    method: 'POST',
    path: '/api/person_comment',
    config: {
        handler: (request, reply) => {
            let course_lesson = request.payload.course_lesson;
            let teacher = request.payload.teacher;
            let date = request.payload.date;
            let type = request.payload.type;
            let student = request.payload.student;
            let comment = request.payload.comment;
            let sql = `INSERT INTO person_comment (course_lesson, teacher, student, comment, type, date)
                        VALUES (${course_lesson}, ${teacher}, ${student}, '${comment}', '${type}', '${date}')`;
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
                course_lesson: Joi.number().required().min(1),
                teacher: Joi.number().required(),
                student: Joi.number().required(),
                comment: Joi.string().required(),
                date: Joi.string().required(),
                type: Joi.string().required(),
            })
        }
    }
}, {
    method: 'DELETE',
    path: '/api/person_comment',
    config: {
        handler: (request, reply) => {
            let course_lesson = request.payload.course_lesson;
            let teacher = request.payload.teacher;
            let sql = `DELETE FROM person_comment WHERE course_lesson = $1 AND teacher = $2`;
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
export default person_comment;
