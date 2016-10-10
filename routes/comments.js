const commentsRules = [{
    method: 'GET',
    path: '/comments',
    config: {
        handler: (request, reply) => {
            let users = request.auth.credentials.id;
            return reply.view('academic/comments', { users });
        }
    }
}, {
    method: 'GET',
    path: '/comments/{id}',
    handler: (request, reply) => {
        reply('Hello! Comments : id');
    }
}]
export default commentsRules;
