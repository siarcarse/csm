const employeeRules = [
    { method: 'GET', path: '/employee', handler: (request, reply)=> {
        reply('Hello! Employees');
    } },
    { method: 'GET', path: '/employee/{id}', handler: (request, reply)=> {
        reply('Hello! Employees : id');
    } }
]
export default employeeRules;