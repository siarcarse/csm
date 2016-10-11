const course_lesson_teacherRules = [{
    method: 'GET',
    path: '/course_lesson_teacher',
    handler: (request, reply) => {
        let columns = ['Id', 'Asignatura', 'Curso', 'Año', 'Profesores'];
        reply.view('administration/course_lesson_teacher', { columns });
    }
}]
export default course_lesson_teacherRules;
