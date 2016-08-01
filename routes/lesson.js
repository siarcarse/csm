const lessonRules = [{
    method: 'GET',
    path: '/lesson',
    config: { auth: false },
    handler: (request, reply) => {
        let columns = ['Nombre', 'Descripción'];
        reply.view('administration/lesson', { columns });
    }
}]
export default lessonRules;
