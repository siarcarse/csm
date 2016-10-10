import hapi from 'hapi';
import Inert from 'inert';
import Vision from 'vision';
import hapiAuthCookie from 'hapi-auth-cookie';
import handlebars from 'handlebars';
import extend from 'handlebars-extend-block';

import routes from './routes'; //Import all routes
import cookiePassword, { PORT } from './config/config';

var server = new hapi.Server();
require('dotenv').load(); // Load .env file for evoriment vars

// add connection parameters
server.connection({
    host: '0.0.0.0',
    port: PORT || 3000
});
server.register([Vision,
    { register: hapiAuthCookie }, // no options required
    { register:  Inert },
    { register: require('hapi-postgres-connection') }
], (err) => {
    if (err) {
        console.log("Failed to load module. ", err);
    }
    const cache = server.cache({ segment: 'sessions', expiresIn: 3 * 60 * 60 * 1000 });
    server.app.cache = cache;

    server.auth.strategy('session', 'cookie', true, {
        password: cookiePassword,
        cookie: 'sid-csm',
        redirectTo: '/login',
        isSecure: false,
        validateFunc: function(request, session, callback) {

            cache.get(session.sid, (err, cached) => {

                if (err) {
                    return callback(err, false);
                }

                if (!cached) {
                    return callback(null, false);
                }

                return callback(null, true, cached.account);
            });
        }
    });
    //Load Routes
    server.route(routes);
});
server.ext('onPreResponse', function(request, reply) {
    if (request.response.source && request.response.source.context) {
        request.response.source.context.credentials = request.auth.credentials;
    }
    reply.continue();
});
server.views({
    engines: {
        html: {
            module: extend(handlebars),
            isCached: false
        }
    },
    path: 'views',
    layoutPath: 'views/layout',
    layout: 'default',
    helpersPath: 'views/helpers',
    partialsPath: 'views/partials'
});

// Start the server
server.start(() => {
    console.log('Server started at: ' + server.info.uri);
});
