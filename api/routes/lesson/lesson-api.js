import Joi from 'joi';
import Boom from 'boom';
const lesson = [{
    method: 'GET',
    path: '/api/lesson/{param*}',
    config: {
        handler: (request, reply) => {
            var select = `SELECT * FROM lesson ORDER BY id ASC`;
            request.pg.client.query(select, (err, result) => {
                let lesson = result.rows;
                return reply(lesson);
            })
        },
        validate: {
            query: Joi.object().keys({
                _: Joi.number().min(0)
            })
        },
        auth: { mode: 'try' },
        plugins: { 'hapi-auth-cookie': { redirectTo: false } }
    }
}, {
    method: 'GET',
    path: '/api/lesson/{id}',
    config: {
        handler: (request, reply) => {
            console.log();
            var select = `SELECT * FROM lesson WHERE id = $1`;
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
    path: '/api/lesson/{course}/course',
    config: {
        handler: (request, reply) => {
            var select = `SELECT id, name 
                          FROM lesson 
                          WHERE id NOT IN (SELECT lesson FROM course_lesson WHERE course=$1)`;
            request.pg.client.query(select, [encodeURIComponent(request.params.course)], (err, result) => {
                let user = result.rows;
                return reply(user);
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
    method: 'GET',
    path: '/api/lesson/courses/{course}',
    config: {
        handler: (request, reply) => {
            var select = `SELECT id, name 
                          FROM lesson 
                          WHERE id IN (SELECT lesson FROM course_lesson WHERE course=$1)`;
            request.pg.client.query(select, [encodeURIComponent(request.params.course)], (err, result) => {
                let user = result.rows;
                return reply(user);
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
    path: '/api/lesson',
    config: {
        handler: (request, reply) => {
            let description = request.payload.description;
            let name = request.payload.name;
            let sql = `INSERT INTO lesson (name, description)
                        VALUES ('${name}', '${description}')`;
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
                name: Joi.string().required().min(1).max(60),
                description: Joi.string().min(1).max(60),
            })
        },
        auth: false
    }
}, {
    method: 'PUT',
    path: '/api/lesson/{id}',
    config: {
        handler: (request, reply) => {
            let id = encodeURIComponent(request.params.id);
            let description = request.payload.description;
            let name = request.payload.name;
            let sql = `UPDATE lesson SET name = '${name}', description = '${description}'
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
                name: Joi.string().required().min(1).max(60),
                description: Joi.string().min(1).max(60),
            })
        },
        auth: false
    }
}, {
    method: 'DELETE',
    path: '/api/lesson/{id}',
    config: {
        handler: (request, reply) => {
            let sql = `DELETE FROM lesson WHERE id = $1`;
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
export default lesson;
