const userRules = [{
    method: 'GET',
    path: '/user',
    handler: (request, reply) => {
        var select = 'SELECT * FROM items';
        request.pg.client.query(select, (err, result) => {
            return reply(result.rows[0]);
        })
    }
}, {
    method: 'GET',
    path: '/user/{id}',
    handler: (request, reply) => {
        reply('Hello! Users : id');
    }
}]
export default userRules;
