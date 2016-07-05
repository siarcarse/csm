var employee = require('./employee');
var user = require('./user');

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

module.exports = [].concat(Public, index, employee, user);
