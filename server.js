var hapi = require('hapi');
var Inert = require('inert');
var Vision = require('vision');
var routes = require('./routes'); //Import all routes
require('dotenv').load(); // Load .env file for DATABASE connection

// Create hapi server instance
var server = new hapi.Server();

// add connection parameters
server.connection({
    host: 'localhost',
    port: 3000
});
server.register([Vision,
    { register:  Inert },
    { register: require('hapi-postgres-connection') }, // no options required
], (err) => {

    if (err) {
        console.log("Failed to load vision.");
    }
});
//server.register(Inert);

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
// tell your server about the defined routes
server.route(routes);

// Start the server
server.start(function() {
    // Log to the console the host and port info
    console.log('Server started at: ' + server.info.uri);
});
