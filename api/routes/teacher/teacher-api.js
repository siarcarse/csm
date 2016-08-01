import Joi from 'joi';
import Boom from 'boom';
const teacher = [{
    method: 'GET',
    path: '/api/teacher/{param*}',
    config: {
        handler: (request, reply) => {
            var select = `SELECT u.id, u.username, u.name, u.lastname, 
                            u.mail, r.name AS role_name, r.id AS roleid, 
                            u.state, u.phone, u.password, to_char(u.birthdate, 'YYYY-MM-DD') AS birthdate
                            FROM users AS u
                            LEFT JOIN role AS r ON r.id=u.role
                            WHERE role=2`;
            request.pg.client.query(select, (err, result) => {
                let teacher = result.rows;
                return reply(teacher);
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
    path: '/api/teacher/{course_lesson}/course_lesson',
    config: {
        handler: (request, reply) => {
            var sql = `SELECT id, (name || ' ' || lastname) AS name
                          FROM users 
                          WHERE id NOT IN (SELECT teacher FROM course_lesson_teacher WHERE course_lesson=$1)
                          AND role = 2`;
            request.pg.client.query(sql, [encodeURIComponent(request.params.course_lesson)], (err, result) => {
                if (err) {
                    return reply(err);
                }

                let teacher = result.rows;
                return reply(teacher);
            })
        },
        validate: {
            params: {
                course_lesson: Joi.number().min(0)
            }
        },
        auth: false
    }
}, {
    method: 'GET',
    path: '/api/teacher/course_lesson/{course_lesson}',
    config: {
        handler: (request, reply) => {
            var select = `SELECT id, (name || ' ' || lastname) AS name
                          FROM users 
                          WHERE id IN (SELECT teacher FROM course_lesson_teacher WHERE course_lesson=$1)
                          AND role = 2`;
            request.pg.client.query(select, [encodeURIComponent(request.params.course_lesson)], (err, result) => {
                let teacher = result.rows;
                return reply(teacher);
            })
        },
        validate: {
            params: {
                course_lesson: Joi.number().min(0)
            }
        },
        auth: false
    }
}];
export default teacher;
