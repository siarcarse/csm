import Joi from 'joi';
import Boom from 'boom';
const parent = [{
    method: 'GET',
    path: '/api/parent/{param*}',
    config: {
        handler: (request, reply) => {
            var select = `SELECT id, name, lastname, rut, gender, to_char(birthdate, 'YYYY-MM-DD') AS birthdate,
                          address
                          FROM persons
                          WHERE type='apoderado'`;
            request.pg.client.query(select, (err, result) => {
                let parent = result.rows;
                return reply(parent);
            })
        },
        validate: {
            query: Joi.object().keys({
                _: Joi.number().min(0)
            })
        },
        auth: false
    }
}, {
    method: 'GET',
    path: '/api/parent/{id}',
    config: {
        handler: (request, reply) => {
            var select = `SELECT id, name, lastname, rut, gender, to_char(birthdate, 'YYYY-MM-DD') AS birthdate,
                          address
                          FROM persons
                          WHERE type='apoderado' AND id = $1`;
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
    method: 'POST',
    path: '/api/parent',
    config: {
        handler: (request, reply) => {
            let name = request.payload.name;
            let lastname = request.payload.lastname;
            let birthdate = request.payload.birthdate;
            let rut = request.payload.rut;
            let gender = request.payload.gender;
            let address = request.payload.address;
            let sql = `INSERT INTO persons (name, lastname,rut, birthdate, gender, address, type)
                        VALUES ('${name}', '${lastname}', '${rut}', '${birthdate}', '${gender}', '${address}', 'apoderado')`;
            request.pg.client.query(sql, (err, result) => {
                if (err) {
                    reply({ message: sql });
                } else {
                    reply({ message: sql });
                }
            })
        },
        validate: {
            payload: Joi.object().keys({
                rut: Joi.string().min(1).max(60),
                name: Joi.string().min(1).max(60),
                lastname: Joi.string().min(1).max(60),
                birthdate: Joi.string(),
                gender: Joi.string().min(1).max(2),
                address: Joi.string()
            })
        },
        auth: false
    }
}, {
    method: 'PUT',
    path: '/api/parent/{id}',
    config: {
        handler: (request, reply) => {
            let id = encodeURIComponent(request.params.id);
            let name = request.payload.name;
            let lastname = request.payload.lastname;
            let birthdate = request.payload.birthdate;
            let rut = request.payload.rut;
            let gender = request.payload.gender;
            let address = request.payload.address;
            let sql = `UPDATE persons SET name = '${name}', lastname = '${lastname}',rut = '${rut}',
                       birthdate = '${birthdate}', gender = '${gender}', address = '${address}'
                       WHERE id = ${id}`;
            request.pg.client.query(sql, (err, result) => {
                if (err) {
                    reply({ message: sql });
                } else {
                    reply({ message: sql });
                }
            })
        },
        validate: {
            params: {
                id: Joi.number()
            },
            payload: Joi.object().keys({
                name: Joi.string().min(1).max(60),
                rut: Joi.string().min(1).max(60),
                lastname: Joi.string().min(1).max(60),
                birthdate: Joi.string(),
                gender: Joi.string().min(1).max(2),
                address: Joi.string()
            })
        },
        auth: false
    }
}, {
    method: 'DELETE',
    path: '/api/parent/{id}',
    config: {
        handler: (request, reply) => {
            let sql = `DELETE FROM persons WHERE id = $1`;
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
export default parent;
