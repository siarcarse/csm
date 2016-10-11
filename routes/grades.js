const gradesRules = [{
    method: 'GET',
    path: '/grades',
    config: {
        handler: (request, reply) => {
            return reply.view('academic/grades', {});
        }
    }
}]
export default gradesRules;
