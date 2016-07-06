var validate = function(decoded, request, callback) {
    console.log(" - - - - - - - DECODED token:");
    console.log(decoded);
    // do your checks to see if the session is valid
    let session = request.yar.get('session');

    if (!session && decoded.id !== session.userId) {
        return callback('Error de Sesión', false);
    }
    var session;
    if (reply) {
        session = JSON.parse(reply);
    } else { // unable to find session in redis ... reply is null
  
    }

    if (session.valid === true) {
        return callback(rediserror, true);
    } else {
        return callback(rediserror, false);
    }
}


//https://github.com/nelsonic/hapi-auth-jwt2-cookie-example/blob/master/index.js
