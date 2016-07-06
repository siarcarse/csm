import employee from './employee';
import user from './user';

const index = {
    method: 'GET',
    path: '/',
    handler: function(request, reply) {
        // Render the view with the custom greeting
        var data = {
            title: 'This is Index!',
            message: 'Hello, World. You crazy handlebars layout'
        };

        return reply.view('index', data);
    }
};
const Public = {
    method: "GET",
    path: "/public/{path*}",
    handler: {
        directory: {
            path: "./public",
            listing: false,
            index: false
        }
    }
};
const rules = [].concat(Public, index, employee, user);
export default rules;
