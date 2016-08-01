const employeeRules = [{
    method: 'GET',
    path: '/student',
    config: { auth: false },
    handler: (request, reply) => {
        let columns = ['Nombre', 'Apellidos', 'Rut', 'Genero', 'Fecha Nacimiento', 'Dirección'];
        reply.view('administration/student', {columns});
    }
}]
export default employeeRules;
