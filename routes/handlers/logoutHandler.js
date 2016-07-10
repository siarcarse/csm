const logout = function(request, reply) {

    request.cookieAuth.clear();
    return reply.redirect('/');
};
export default logout;