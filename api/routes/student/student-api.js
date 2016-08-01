import Joi from 'joi';
import Boom from 'boom';
const student = [{
    method: 'GET',
    path: '/api/student/{param*}',
    config: {
        handler: (request, reply) => {
            var select = `SELECT id, name, lastname, rut, gender, to_char(birthdate, 'YYYY-MM-DD') AS birthdate,
                          address
                          FROM persons
                          WHERE type='alumno'`;
            request.pg.client.query(select, (err, result) => {
                let student = result.rows;
                return reply(student);
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
    path: '/api/student/father/{id}',
    config: {
        handler: (request, reply) => {
            var select = `SELECT id, (rut || ' ' || name || ' ' || lastname) AS name
                          FROM persons
                          WHERE type='alumno' AND id NOT IN (SELECT id FROM persons WHERE father = $1) AND father IS NULL`;
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
    path: '/api/student/{id}/father/',
    config: {
        handler: (request, reply) => {
            var select = `SELECT id, (rut || ' ' || name || ' ' || lastname) AS name
                          FROM persons
                          WHERE type='alumno' AND father = $1`;
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
    path: '/api/student/{id}',
    config: {
        handler: (request, reply) => {
            var select = `SELECT id, name, lastname, rut, gender, to_char(birthdate, 'YYYY-MM-DD') AS birthdate,
                          address
                          FROM persons
                          WHERE type='alumno' AND id = $1`;
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
    path: '/api/student',
    config: {
        handler: (request, reply) => {
            let name = request.payload.name;
            let lastname = request.payload.lastname;
            let birthdate = request.payload.birthdate;
            let rut = request.payload.rut;
            let gender = request.payload.gender;
            let address = request.payload.address;
            let sql = `INSERT INTO persons (name, lastname,rut, birthdate, gender, address, type)
                        VALUES ('${name}', '${lastname}', '${rut}', '${birthdate}', '${gender}', '${address}', 'alumno')`;
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
    method: 'GET',
    path: '/api/student/{course}/course',
    config: {
        handler: (request, reply) => {
            var sql = `SELECT id, (rut || ' ' || name || ' ' || lastname) AS name
                          FROM persons 
                          WHERE id NOT IN (SELECT student FROM course_student)
                          AND type='alumno'`;
            request.pg.client.query(sql, (err, result) => {
                if (err) {
                    return reply(err);    
                }

                let persons = result.rows;
                return reply(persons);
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
    path: '/api/student/courses/{course}',
    config: {
        handler: (request, reply) => {
            var select = `SELECT id, (rut || ' ' || name || ' ' || lastname) AS name
                          FROM persons 
                          WHERE id IN (SELECT student FROM course_student WHERE course=$1)
                          AND type='alumno'`;
            request.pg.client.query(select, [encodeURIComponent(request.params.course)], (err, result) => {
                let persons = result.rows;
                return reply(persons);
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
    path: '/api/student/father/',
    config: {
        handler: (request, reply) => {
            let id = request.payload.id;
            let father = request.payload.father;
            if (parseInt(father) === 0) {
                father = null;
            }
            let sql = `UPDATE persons SET father = ${father} WHERE id=${id}`;
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
                id: Joi.number().min(1).max(60),
                father: Joi.number().allow(null)
            })
        },
        auth: false
    }
}, {
    method: 'PUT',
    path: '/api/student/{id}',
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
    path: '/api/student/{id}',
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
export default student;
