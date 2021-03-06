import Joi from 'joi';
import Boom from 'boom';
const role = [{
    method: 'GET',
    path: '/api/role/{param*}',
    config: {
        handler: (request, reply) => {
            var select = `SELECT * FROM role`;
            request.pg.client.query(select, (err, result) => {
                let role = result.rows;
                return reply(role);
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
    path: '/api/role/{id}',
    config: {
        handler: (request, reply) => {
            console.log();
            var select = `SELECT * FROM role WHERE id = $1`;
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
    method: 'POST',
    path: '/api/role',
    config: {
        handler: (request, reply) => {
            let description = request.payload.description;
            let name = request.payload.name;
            let sql = `INSERT INTO role (name, description)
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
    path: '/api/role/{id}',
    config: {
        handler: (request, reply) => {
            let id = encodeURIComponent(request.params.id);
            let description = request.payload.description;
            let name = request.payload.name;
            let sql = `UPDATE role SET name = '${name}', description = '${description}'
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
    path: '/api/role/{id}',
    config: {
        handler: (request, reply) => {
            let sql = `DELETE FROM role WHERE id = $1`;
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
export default role;
