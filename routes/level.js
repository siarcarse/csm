const levelRules = [{
    method: 'GET',
    path: '/level',
    config: { auth: false },
    handler: (request, reply) => {
        let columns = ['Nombre', 'Descripción'];
        reply.view('level', {columns});
    }
}]
export default levelRules;
