import Joi from 'joi';
import Boom from 'boom';
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
        },
        auth: false
            /*auth: { mode: 'try' },
            plugins: { 'hapi-auth-cookie': { redirectTo: false } }*/
    }
}, {
    method: 'GET',
    path: '/api/courses/{id}',
    config: {
        handler: (request, reply) => {
            console.log();
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
        },
        auth: false
    }
}, {
    method: 'GET',
    path: '/api/courses/{year}/year',
    config: {
        handler: (request, reply) => {
            var select = `SELECT courses.id, level.name AS level_name, year, level.id AS level, courses.id AS lesson
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
        },
        auth: false
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
        },
        auth: false
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
        },
        auth: false
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
        },
        auth: false
    }
}];
export default courses;
