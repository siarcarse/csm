import Boom from 'boom';
import Joi from 'joi';

const users = {
    siarcarse: {
        id: 'siarcarse',
        password: '138982033',
        name: 'Simplicio Carcamo'
    }
};
let uuid = 1;
const login = function(request, reply) {

    if (request.auth.isAuthenticated) {
        return reply.redirect('/');
    }

    let message = '';
    let account = null;

    if (request.method === 'post') {
        if (!request.payload.username ||
            !request.payload.password) {

            Boom.expectationFailed('Falta Usuario o Contraseña');
        } else {
            let username = request.payload.username;
            let password = request.payload.password;
            /*var schema = Joi.object().keys({
                username: Joi.string().alphanum().min(1).max(3).required(),
                password: Joi.string().alphanum().min(3).max(30).required(),
            });
            Joi.validate({ username: username, password: password }, schema, (err, value)=> {
                if(err !== null) {
                    Boom.expectationFailed(err.details[0].message);
                    console.log(err.details[0].message);
                }
            }); // err === null -> valid*/
            let sql = 'SELECT * FROM users WHERE username = $1 AND password = $2';
            request.pg.client.query(sql, [username, password], (err, result) => {
                if (err) {
                    Boom.badImplementation(err);
                }
                account = result.rows[0];
                if (!account ||
                    account.password !== password) {

                    Boom.expectationFailed('Usuario y/o contraseña no corresponden');
                }
                const sid = String(++uuid);
                request.server.app.cache.set(sid, { account: account }, 0, (err) => {

                    if (err) {
                        Boom.badImplementation(err);
                    }

                    request.cookieAuth.set({ sid: sid });
                    return reply.redirect('/');
                });
            })
        }
    }

    if (request.method === 'get' ||
        message) {

        return reply.view('login', message);
    }
};
export default login;
