const employeeRules = [{
    method: 'GET',
    path: '/student',
    handler: (request, reply) => {
        let columns = ['Nombre', 'Apellidos', 'Rut', 'Genero', 'Fecha Nacimiento', 'Dirección'];
        reply.view('administration/student', {columns});
    }
}]
export default employeeRules;
