import Boom from 'boom';
import Joi from 'joi';

let uuid = 1;
const login = function(request, reply) {

    if (request.auth.isAuthenticated) {
        return reply.redirect('/');
    }

    let message = '';
    let account = null;

    if (request.method === 'post') {
        if (!request.payload.username || !request.payload.password) {
            Boom.expectationFailed('Falta Usuario o Contraseña');
        } else {
            let username = request.payload.username;
            let password = request.payload.password;
            let sql = `SELECT * FROM users 
                       WHERE username = '${username}' 
                       AND password = '${password}' 
                       AND state = 'activo'`;
            request.pg.client.query(sql, (err, result) => {
                if (err) {
                    Boom.badImplementation(err);
                }
                account = result.rows[0];
                if (!account || account.password !== password) {
                    reply.view('login', { error: 'Usuario y/o contraseña no corresponden' });
                } else {
                    const sid = String(++uuid);
                    request.server.app.cache.set(sid, { account: account }, 0, (err) => {

                        if (err) {
                            Boom.badImplementation(err);
                        }

                        request.cookieAuth.set({ sid: sid });
                        return reply.redirect('/');
                    });
                }
            })
        }
    }

    if (request.method === 'get' ||
        message) {

        return reply.view('login', message);
    }
};
export default login;
