const coursesRules = [{
    method: 'GET',
    path: '/courses',
    handler: (request, reply) => {
        let columns = ['Id', 'Nivel', 'Año', 'Asignaturas', 'Alumnos'];
        reply.view('administration/courses', { columns });
    }
}]
export default coursesRules;
