const lessonRules = [{
    method: 'GET',
    path: '/lesson',
    config: { auth: false },
    handler: (request, reply) => {
        let columns = ['Nombre', 'Descripción'];
        reply.view('lesson', { columns });
    }
}]
export default lessonRules;
