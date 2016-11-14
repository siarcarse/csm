import Boom from 'boom';
import Joi from 'joi';

let uuid = 1;
const login = function(request, reply) {

    if (request.auth.isAuthenticated) {
        return reply.redirect('/external');
    }

    let message = '';
    let account = null;

    if (request.method === 'post') {
        if (!request.payload.rut || !request.payload.password) {
            Boom.expectationFailed('Falta Rut o Contraseña');
        } else {
            let rut = request.payload.rut;
            let password = request.payload.password;
            let sql = `SELECT * FROM persons
                       WHERE rut = '${rut}' 
                       AND password = '${password}'`;
            request.pg.client.query(sql, (err, result) => {
                if (err) {
                    Boom.badImplementation(err);
                }
                account = result.rows[0];
                if (!account || account.password !== password) {
                    reply.view('loginStudent', { error: 'Rut y/o contraseña no corresponden' }, { layout: 'clean' });
                } else {
                    if (account.type === "apoderado") {
                        let apoderado = account.id;
                        let query = `SELECT * FROM persons
                                   WHERE
                                   father = '${apoderado}'`;
                        let childs;
                        request.pg.client.query(query, (err, result) => {
                            if (err) {
                                Boom.badImplementation(err);
                            }
                            childs = result.rows;
                            account.childs = childs;
                            const sid = String(++uuid);
                            request.server.app.cache.set(sid, { account: account }, 0, (err) => {

                                if (err) {
                                    Boom.badImplementation(err);
                                }

                                request.cookieAuth.set({ sid: sid });
                                return reply.redirect('/external');
                            });
                        });
                    } else {
                        const sid = String(++uuid);
                        request.server.app.cache.set(sid, { account: account }, 0, (err) => {

                            if (err) {
                                Boom.badImplementation(err);
                            }

                            request.cookieAuth.set({ sid: sid });
                            return reply.redirect('/external');
                        });
                    }
                }
            })
        }
    }

    if (request.method === 'get' ||
        message) {

        return reply.view('loginStudent', message, { layout: 'clean' });
    }
};
export default login;
