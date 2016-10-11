import Joi from 'joi';
import Boom from 'boom';
import Moment from 'moment';
const courses = [{
    method: 'GET',
    path: '/api/courses/{param*}',
    config: {
        handler: (request, reply) => {
            var select = `SELECT courses.id, level.name AS level_name, year, level.id AS level
                          FROM courses
                          LEFT JOIN level ON level.id=courses.level 
                          ORDER BY id ASC`;
            request.pg.client.query(select, (err, result) => {
                let courses = result.rows;
                return reply(courses);
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
    path: '/api/courses/{teacher}/teacher',
    config: {
        handler: (request, reply) => {
            var year = Moment().format('YYYY');
            var select = `SELECT courses.id, level.name AS level_name, courses.year 
                          FROM courses
                          LEFT JOIN level ON level.id=courses.level 
                          WHERE courses.id IN (
                            SELECT course FROM course_lesson WHERE id IN (
                                SELECT course_lesson FROM course_lesson_teacher WHERE teacher=$1)) AND courses.year=$2
                          ORDER BY id ASC`;
            request.pg.client.query(select, [encodeURIComponent(request.params.teacher), year], (err, result) => {
                let user = result.rows;
                return reply(user);
            })
        },
        validate: {
            params: {
                teacher: Joi.number().min(0)
            }
        }
    }
}, {
    method: 'GET',
    path: '/api/courses/{id}',
    config: {
        handler: (request, reply) => {
            var select = `SELECT courses.id, level.name AS level, year 
                          FROM courses
                          LEFT JOIN level ON level.id=courses.level 
                          WHERE courses.id = $1
                          ORDER BY id ASC`;
            request.pg.client.query(select, [encodeURIComponent(request.params.id)], (err, result) => {
                let user = result.rows;
                return reply(user);
            })
        },
        validate: {
            params: {
                id: Joi.number().min(0)
            }
        }
    }
}, {
    method: 'GET',
    path: '/api/courses/{year}/year',
    config: {
        handler: (request, reply) => {
            var select = `SELECT courses.id, level.name AS level_name, year, level.id AS level, courses.id AS lesson,
                          courses.id AS student
                          FROM courses
                          LEFT JOIN level ON level.id=courses.level 
                          WHERE year = $1
                          ORDER BY id ASC`;
            request.pg.client.query(select, [parseInt(encodeURIComponent(request.params.year))], (err, result) => {
                let user = result.rows;
                return reply(user);
            })
        },
        validate: {
            params: {
                year: Joi.number().min(2016)
            }
        }
    }
}, {
    method: 'POST',
    path: '/api/courses',
    config: {
        handler: (request, reply) => {
            let level = request.payload.level;
            let year = request.payload.year;
            let sql = `INSERT INTO courses (level, year)
                        VALUES ('${level}', '${year}')`;
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
                level: Joi.number().required().min(1).max(60),
                year: Joi.number().required().min(2016).max(2116),
            })
        }
    }
}, {
    method: 'PUT',
    path: '/api/courses/{id}',
    config: {
        handler: (request, reply) => {
            let id = encodeURIComponent(request.params.id);
            let year = request.payload.year;
            let level = request.payload.level;
            let sql = `UPDATE courses SET level = '${level}', year = '${year}'
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
        }
    }
}, {
    method: 'DELETE',
    path: '/api/courses/{id}',
    config: {
        handler: (request, reply) => {
            let sql = `DELETE FROM courses WHERE id = $1`;
            request.pg.client.query(sql, [encodeURIComponent(request.params.id)], (err, result) => {
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
            }
        }
    }
}];
export default courses;
