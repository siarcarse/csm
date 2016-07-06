import hapi from 'hapi';
import Yar from 'yar';
import Inert from 'inert';
import Vision from 'vision';
import routes from './routes'; //Import all routes
import config  from './config/config.js';

require('dotenv').load(); // Load .env file for evoriment vars

var server = new hapi.Server();
 
// add connection parameters
server.connection({
    host: 'localhost',
    port: process.env.SERVER_PORT
});
server.register([Vision,
    { register:  Inert },
    { register: require('hapi-postgres-connection') }, // no options required
    { register: Yar, options: config.cookies }, //Cookies config for sessions
], (err) => {
    if (err) {
        console.log("Failed to load vision.");
    }
});

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
//Load Routes
server.route(routes);

// Start the server
server.start(()=> {
    console.log('Server started at: ' + server.info.uri);
});
