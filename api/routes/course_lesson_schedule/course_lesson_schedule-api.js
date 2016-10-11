import Joi from 'joi';
import Boom from 'boom';
const course_lesson_schedule = [{
    method: 'GET',
    path: '/api/course_lesson_schedule/{param*}',
    config: {
        handler: (request, reply) => {
            var select = `SELECT * FROM course_lesson_schedule`;
            request.pg.client.query(select, (err, result) => {
                if (err) {
                    return reply(err);
                }
                let course_lesson_schedule = result.rows;
                return reply(course_lesson_schedule);
            })
        },
        validate: {
            query: Joi.object().keys({
                _: Joi.number().min(0)
            })
        }
    }
}, {
    method: 'GET',
    path: '/api/course_lesson_schedule/course_lesson/{course_lesson}',
    config: {
        handler: (request, reply) => {
            var select = `SELECT * FROM course_lesson_schedule WHERE course_lesson=$1`;
            request.pg.client.query(select, [encodeURIComponent(request.params.course_lesson)], (err, result) => {
                let course_lesson_schedule = result.rows;
                return reply(course_lesson_schedule);
            })
        },
        validate: {
            params: {
                course_lesson: Joi.number().min(1)
            }
        }
    }
}, {
    method: 'POST',
    path: '/api/course_lesson_schedule',
    config: {
        handler: (request, reply) => {
            let course_lesson = request.payload.course_lesson;
            let day = request.payload.day;
            let ihour = request.payload.ihour;
            let ehour = request.payload.ehour;
            let sql = `INSERT INTO course_lesson_schedule (course_lesson, day, ihour, ehour)
                        VALUES (${course_lesson}, '${day}', '${ihour}', '${ehour}')`;
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
                day: Joi.string().required().min(1),
                ihour: Joi.string().required().min(1),
                ehour: Joi.string().required().min(1),
                course_lesson: Joi.number().required()
            })
        }
    }
}, {
    method: 'DELETE',
    path: '/api/course_lesson_schedule',
    config: {
        handler: (request, reply) => {
            let id = request.payload.id;
            let sql = `DELETE FROM course_lesson_schedule WHERE id = $1`;
            request.pg.client.query(sql, [id], (err, result) => {
                if (err) {
                    reply({ message: err });
                } else {
                    reply({ message: result });
                }
            })
        },
        validate: {
            payload: Joi.object().keys({
                id: Joi.number().required()
            })
        }
    }
}];
export default course_lesson_schedule;
