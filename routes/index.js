import role from './role';
import level from './level';
import lesson from './lesson';
import courses from './courses';
import course_lesson from './course_lesson';
import student from './student';
import parent from './parent';
import comments from './comments';
import user from './user';
import { cookie_options } from '../config/config';
import login from './handlers/loginHandler'
import logout from './handlers/logoutHandler'

import API from '../api/routes/';

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
const rules = [].concat(
    Public,
    Index,
    Login,
    Logout,
    role,
    level,
    lesson,
    courses,
    course_lesson,
    user, 
    student,
    parent,
    comments,
    API,
);
export default rules;
