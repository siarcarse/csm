const levelRules = [{
    method: 'GET',
    path: '/level',
    config: { auth: false },
    handler: (request, reply) => {
        let columns = ['id', 'Nombre', 'Descripción'];
        reply.view('administration/level', { columns });
    }
}]
export default levelRules;
