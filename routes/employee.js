module.exports = [
    { method: 'GET', path: '/employee', handler: function(request, reply) {
        reply('Hello! Employees');
    } },
    { method: 'GET', path: '/employee/{id}', handler: function(request, reply) {
        reply('Hello! Employees : id');
    } }
]
