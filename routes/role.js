const roleRules = [{
    method: 'GET',
    path: '/role',
    config: { auth: false },
    handler: (request, reply) => {
        let columns = ['Nombre', 'Descripción'];
        reply.view('administration/role', {columns});
    }
}]
export default roleRules;
