import Joi from 'joi';
import Boom from 'boom';
const course_lesson = [{
    method: 'GET',
    path: '/api/course_lesson/{param*}',
    config: {
        handler: (request, reply) => {
            var select = `SELECT course_lesson.id, level.name AS course, courses.year, lesson.name AS lesson 
                          FROM course_lesson
                          LEFT JOIN courses ON courses.id=course_lesson.course
                          LEFT JOIN level ON level.id=courses.level
                          LEFT JOIN lesson ON lesson.id=course_lesson.lesson
                          ORDER BY level.id ASC`;
            request.pg.client.query(select, (err, result) => {
                if(err) {
                    return reply(err);    
                }
                let course_lesson = result.rows;
                return reply(course_lesson);
            })
        },
        validate: {
            query: Joi.object().keys({
                _: Joi.number().min(0)
            })
        },
        auth: false
            /*auth: { mode: 'try' },
            plugins: { 'hapi-auth-cookie': { redirectTo: false } }*/
    }
}, {
    method: 'GET',
    path: '/api/course_lesson/{course}/course/',
    config: {
        handler: (request, reply) => {
            var select = `SELECT course_lesson.id, level.name AS course, courses.year, lesson.name AS lesson 
                          FROM course_lesson
                          LEFT JOIN courses ON courses.id=course_lesson.course
                          LEFT JOIN level ON level.id=courses.level
                          LEFT JOIN lesson ON lesson.id=course_lesson.lesson
                          WHERE courses.id=$1
                          ORDER BY level.id ASC`;
            request.pg.client.query(select, [encodeURIComponent(request.params.course)], (err, result) => {
                let course_lesson = result.rows;
                return reply(course_lesson);
            })
        },
        validate: {
            params: {
                course: Joi.number().min(0)
            }
        },
        auth: false
    }
}, {
    method: 'POST',
    path: '/api/course_lesson',
    config: {
        handler: (request, reply) => {
            let course = request.payload.course;
            let lesson = request.payload.lesson;
            let sql = `INSERT INTO course_lesson (course, lesson)
                        VALUES (${course}, ${lesson})`;
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
                course: Joi.number().required().min(1).max(60),
                lesson: Joi.number().required(),
            })
        },
        auth: false
    }
}, {
    method: 'PUT',
    path: '/api/course_lesson/{id}',
    config: {
        handler: (request, reply) => {
            let id = encodeURIComponent(request.params.id);
            let year = request.payload.year;
            let level = request.payload.level;
            let sql = `UPDATE course_lesson SET level = '${level}', year = '${year}'
                       WHERE id = ${id}`;
            request.pg.client.query(sql, (err, result) => {
                if (err) {
                    reply({ message: err });
                } else {
                    reply({ message: result });
                }
            })
        },
        validate: {
            params: {
                id: Joi.number()
            },
            payload: Joi.object().keys({
                level: Joi.number().required().min(1).max(60),
                year: Joi.number().required().min(2016).max(2116),
            })
        },
        auth: false
    }
}, {
    method: 'DELETE',
    path: '/api/course_lesson',
    config: {
        handler: (request, reply) => {
            let course = request.payload.course;
            let lesson = request.payload.lesson;
            let sql = `DELETE FROM course_lesson WHERE course = $1 AND lesson = $2`;
            request.pg.client.query(sql, [course, lesson], (err, result) => {
                if (err) {
                    reply({ message: err });
                } else {
                    reply({ message: result });
                }
            })
        },
        validate: {
            payload: Joi.object().keys({
                course: Joi.number().required(),
                lesson: Joi.number().required(),
            })
        },
        auth: false
    }
}];
export default course_lesson;
