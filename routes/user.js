module.exports = [{
    method: 'GET',
    path: '/user',
    handler: function(request, reply) {
        //reply('Hello! Users');
        var select = 'SELECT * FROM items';
        request.pg.client.query(select, function(err, result) {
            return reply(result.rows[0]);
        })
    }
}, {
    method: 'GET',
    path: '/user/{id}',
    handler: function(request, reply) {
        reply('Hello! Users : id');
    }
}]
