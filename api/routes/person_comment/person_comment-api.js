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
    method: 'GET',
    path: '/api/person_comment/{student}',
    config: {
        handler: (request, reply) => {
            var select = `SELECT person_comment.id, (users.name || ' ' || users.lastname) AS teacher, (level.name || ' ' || courses.year) AS course, lesson.name AS lesson,
                          person_comment.comment, person_comment.type, person_comment.date
                          FROM person_comment
                          LEFT JOIN users ON users.id=person_comment.teacher
                          LEFT JOIN course_lesson ON course_lesson.id=person_comment.course_lesson
                          LEFT JOIN courses ON courses.id=course_lesson.course
                          LEFT JOIN lesson ON lesson.id=course_lesson.lesson
                          LEFT JOIN level ON level.id=courses.level
                          WHERE student = $1
                          ORDER BY person_comment.date DESC`;
            request.pg.client.query(select, [encodeURIComponent(request.params.student)], (err, result) => {
                let user = result.rows;
                return reply(user);
            })
        },
        validate: {
            params: {
                student: Joi.number().min(0)
            }
        },
        auth: false
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
