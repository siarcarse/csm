const userRules = [{
    method: 'GET',
    path: '/user',
    config: {
        handler: (request, reply) => {
            let columns = ['Usuario', 'Rol', 'Nombre', 'Apellidos', 'Rut', 'Mail', 'Estado'];
            return reply.view('administration/users', { columns });
        },
        auth: { mode: 'try' },
        plugins: { 'hapi-auth-cookie': { redirectTo: false } }
    }
}, {
    method: 'GET',
    path: '/user/{id}',
    handler: (request, reply) => {
        reply('Hello! Users : id');
    }
}]
export default userRules;
