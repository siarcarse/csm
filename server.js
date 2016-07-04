var hapi = require('hapi');
var Inert = require('inert');

// Create hapi server instance
var server = new hapi.Server();

// add connection parameters
server.connection({
    host: 'localhost',
    port: 3000
});

server.register(require('vision'), (err) => {

    if (err) {
        console.log("Failed to load vision.");
    }
});
server.register(Inert);

server.views({
    engines: {
        html: require('handlebars')
    },
    path: 'views',
    layoutPath: 'views/layout',
    layout: 'default',
    //helpersPath: 'views/helpers',
    partialsPath: 'views/partials'
});
server.route({
    method: "GET",
    path: "/public/{path*}",
    handler: {
        directory: {
            path: "./public",
            listing: false,
            index: false
        }
    }
});
// create your routes, currently it's just one
var routes = [{
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
}];

// tell your server about the defined routes
server.route(routes);

// Start the server
server.start(function() {
    // Log to the console the host and port info
    console.log('Server started at: ' + server.info.uri);
});
