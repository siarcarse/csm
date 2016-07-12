import Joi from 'joi';
import Boom from 'boom';
const users = [{
    method: 'GET',
    path: '/api/users/{param*}',
    config: {
        handler: (request, reply) => {
            var select = `SELECT u.id, u.username, (e.name || ' ' || e.lastname) AS name, 
                            e.mail, r.name AS role, u.state, e.cellphone AS phone, u.password
                            FROM users AS u
                            LEFT JOIN employee AS e ON e.id=u.employee
                            LEFT JOIN role AS r ON r.id=u.role`;
            request.pg.client.query(select, (err, result) => {
                let users = result.rows;
                return reply(users);
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
    path: '/api/users/{id}',
    config: {
        handler: (request, reply) => {
            console.log();
            var select = `SELECT u.id, u.username, (e.name || ' ' || e.lastname) AS name, 
                            e.mail, r.name AS rol, e.phone
                            FROM users AS u
                            LEFT JOIN employee AS e ON e.id=u.employee
                            LEFT JOIN role AS r ON r.id=u.role
                            WHERE u.id = $1`;
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
    path: '/api/users',
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
    path: '/api/users/{id}',
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
    path: '/api/users/{id}',
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
export default users;
