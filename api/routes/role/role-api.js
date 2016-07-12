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
            reply({ message: 'hello' });
        },
        validate: {
            payload: Joi.object().length(1).keys({
                task: Joi.string().required().min(1).max(60)
            })
        }
    }
}, {
    method: 'PUT',
    path: '/api/role/{id}',
    config: {
        handler: (request, reply) => {
            reply({ message: 'hello' });
        },
        validate: {
            params: {
                id: Joi.string().regex(/[a-zA-Z0-9]{16}/)
            },
            payload: Joi.object().length(1).keys({
                task: Joi.string().required().min(1).max(60)
            })
        }
    }
}, {
    method: 'DELETE',
    path: '/api/role/{id}',
    config: {
        handler: (request, reply) => {
            reply({ message: 'hello' });
        },
        validate: {
            params: {
                id: Joi.string().regex(/[a-zA-Z0-9]{16}/)
            }
        }
    }
}];
export default role;
