import employee from './employee';
import user from './user';
import JWT from 'jsonwebtoken';
import { cookie_options } from '../config/config';
import login from './handlers/loginHandler'
import logout from './handlers/logoutHandler'

const Index = {
    method: ['GET', 'POST'],
    path: '/',
    config: {
        handler: function(request, reply) {
            var data = {
                title: 'This is Index!',
                message: 'Hello, World. You crazy handlebars layout'
            };
            return reply.view('index', data);
        }
    }
};
const Public = {
    method: "GET",
    path: "/public/{path*}",
    config: { auth: false },
    handler: {
        directory: {
            path: "./public",
            listing: false,
            index: false
        }
    }
};
/*const Login = {
    method: 'GET',
    path: '/login',
    config: { auth: false },
    handler: function(request, reply) {
        var data = {
            title: 'Iniciar Sesión'
        };

        return reply.view('login', data);
    }
};*/
const Login = {
    method: ['GET', 'POST'],
    path: '/login',
    config: {
        handler: login,
        auth: { mode: 'try' },
        plugins: { 'hapi-auth-cookie': { redirectTo: false } }
    }
};
const Logout = {
    method: 'GET',
    path: '/logout',
    config: {
        handler: logout
    }
};
const rules = [].concat(Public, Index, Login, Logout, employee, user);
export default rules;
