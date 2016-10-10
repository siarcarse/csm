const employeeRules = [{
    method: 'GET',
    path: '/parent',
    handler: (request, reply) => {
        let columns = ['Nombre', 'Apellidos', 'Rut', 'Genero', 'Fecha Nacimiento', 'Dirección', 'Alumnos Asociados'];
        reply.view('administration/parent', {columns});
    }
}]
export default employeeRules;
