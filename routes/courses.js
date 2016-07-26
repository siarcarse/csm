const coursesRules = [{
    method: 'GET',
    path: '/courses',
    config: { auth: false },
    handler: (request, reply) => {
        let columns = ['Id', 'Nivel', 'Año', 'Asignaturas'];
        reply.view('courses', { columns });
    }
}]
export default coursesRules;
