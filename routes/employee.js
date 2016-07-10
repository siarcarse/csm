const employeeRules = [{
    method: 'GET',
    path: '/employee',
    config: { auth: false },
    handler: (request, reply) => {
        reply('Hello! Employees');
    }
}, {
    method: 'GET',
    path: '/employee/{id}',
    config: { auth: false },
    handler: (request, reply) => {
        reply('Hello! Employees : id');
    }
}]
export default employeeRules;
