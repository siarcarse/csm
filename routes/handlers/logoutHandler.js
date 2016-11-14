const logout = function(request, reply) {
    if (typeof request.auth.credentials.type === 'string') {
        request.cookieAuth.clear();
        return reply.redirect('/loginPublic');
    } else {
        request.cookieAuth.clear();
        return reply.redirect('/');
    }
};
export default logout;
