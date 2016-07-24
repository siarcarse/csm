const employeeRules = [{
    method: 'GET',
    path: '/parent',
    config: { auth: false },
    handler: (request, reply) => {
        let columns = ['Nombre', 'Apellidos', 'Rut', 'Genero', 'Fecha Nacimiento', 'Dirección'];
        reply.view('parent', {columns});
    }
}]
export default employeeRules;
