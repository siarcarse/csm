import role from './role';
import level from './level';
import lesson from './lesson';
import courses from './courses';
import course_lesson from './course_lesson';
import course_lesson_teacher from './course_lesson_teacher';
import student from './student';
import parent from './parent';
import comments from './comments';
import grades from './grades';
import user from './user';
import { cookie_options } from '../config/config';
import login from './handlers/loginHandler'
import loginPublic from './handlers/loginPublicHandler'
import logout from './handlers/logoutHandler'

import API from '../api/routes/';

const Index = {
    method: ['GET', 'POST'],
    path: '/',
    config: {
        handler: function(request, reply) {
            var credentials = request.auth.credentials;
            var data = {
                title: 'Bienvenido!',
                message: 'Intranet Académica Colegio Santa Madre de Dios',
                credentials
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

const LoginPublic = {
    method: ['GET', 'POST'],
    path: '/loginPublic',
    config: {
        handler: loginPublic,
        auth: { mode: 'try' },
        plugins: { 'hapi-auth-cookie': { redirectTo: false } }
    }
};

const External = {
    method: 'GET',
    path: '/external',
    config: {
        handler: function(request, reply) {
            return reply.view('external', {}, { layout: 'clean' });
        },
        plugins: { 'hapi-auth-cookie': { redirectTo: '/loginPublic' } }
    }
};
const Logout = {
    method: 'GET',
    path: '/logout',
    config: {
        handler: logout
    }
};
const Password = {
    method: 'GET',
    path: '/change_password',
    config: {
        handler: function(request, reply) {
            var credentials = request.auth.credentials;
            var data = {
                title: 'Bienvenido!',
                message: 'Intranet Académica Colegio Santa Madre de Dios',
                credentials
            };
            return reply.view('password', data);
        }
    }
};
const rules = [].concat(
    Public,
    Index,
    External,
    Login,
    LoginPublic,
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
    grades,
    Password,
    course_lesson_teacher,
    API
);
export default rules;
