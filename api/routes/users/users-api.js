import Joi from 'joi';
import Boom from 'boom';
const users = [{
    method: 'GET',
    path: '/api/users/{param*}',
    config: {
        handler: (request, reply) => {
            var select = `SELECT u.id, u.username, u.name, u.lastname, 
                            u.mail, r.name AS role_name, r.id AS roleid, 
                            u.state, u.phone, u.password, to_char(u.birthdate, 'YYYY-MM-DD') AS birthdate
                            FROM users AS u
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
            var select = `SELECT u.id, u.username, u.name, u.lastname, 
                            u.mail, r.name AS role_name, r.id AS roleid, 
                            u.state, u.phone, u.password, 
                            to_char(u.birthdate, 'YYYY-MM-DD') AS birthdate
                            FROM users AS u
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
            let username = request.payload.username;
            let name = request.payload.name;
            let lastname = request.payload.lastname;
            let birthdate = request.payload.birthdate;
            let role = request.payload.role;
            let mail = request.payload.mail;
            let password = request.payload.password;
            let phone = request.payload.phone;
            let sql = `INSERT INTO users (username, name, lastname, birthdate, role, password, mail, phone)
                        VALUES ('${username}', '${name}', '${lastname}', '${birthdate}', ${role}, '${password}', '${mail}', ${phone})`;
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
                username: Joi.string().required().min(1).max(60),
                name: Joi.string().min(1).max(60),
                lastname: Joi.string().min(1).max(60),
                birthdate: Joi.string(),
                role: Joi.number().min(1).max(60),
                password: Joi.string().required().min(1).max(100),
                mail: Joi.string().email(),
                phone: Joi.number()
            })
        },
        auth: false
    }
}, {
    method: 'PUT',
    path: '/api/users/{id}',
    config: {
        handler: (request, reply) => {
            let id = encodeURIComponent(request.params.id);
            let username = request.payload.username;
            let name = request.payload.name;
            let lastname = request.payload.lastname;
            let birthdate = request.payload.birthdate;
            let role = request.payload.role;
            let mail = request.payload.mail;
            let password = request.payload.password;
            let phone = request.payload.phone;
            let sql = `UPDATE users SET username = '${username}', name = '${name}', lastname = '${lastname}',
            birthdate = '${birthdate}', role = ${role}, password = '${password}', mail = '${mail}', phone = ${phone}
            WHERE id=${id}`;
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
                username: Joi.string().required().min(1).max(60),
                name: Joi.string().min(1).max(60),
                lastname: Joi.string().min(1).max(60),
                birthdate: Joi.string(),
                role: Joi.number().required().min(1).max(60),
                password: Joi.string().required().min(1).max(100),
                mail: Joi.string().email(),
                phone: Joi.number()
            })
        },
        auth: false
    }
}, {
    method: 'DELETE',
    path: '/api/users/{id}',
    config: {
        handler: (request, reply) => {
            let sql = `DELETE FROM users WHERE id = $1`;
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
export default users;
