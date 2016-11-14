$(document).ready(function() {
    controller.loadSelectCourse();
    $('#type').selectpicker({
        maxOptions: 1,
        size: 4
    });
    $('#lesson').selectpicker({
        liveSearch: true,
        maxOptions: 1,
        size: 4
    });
    $('#courses').selectpicker({
        liveSearch: true,
        maxOptions: 1,
        size: 10
    });
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent)) {
        $('#lesson, #courses, #type').selectpicker('mobile');
    }
    $('#lesson, #type, #courses').on('show.bs.select', function(a) {
        $(this).selectpicker('setStyle', 'btn-danger', 'remove');
        $(this).selectpicker('refresh');
    });
    $('#courses').on('changed.bs.select', function() {
        let course = $(this).val();
        controller.loadSelectLesson(course);
    });

    /** AQUI **/

    $('#lesson').on('changed.bs.select', function() {
        let course = $('#courses').val();
        let course_lesson = $(this).val();
        $.get('/api/course_lesson_grade/' + course_lesson, function(data) {
            if (data.index) {
                controller.loadStudentGrades(data, course);
            } else {
                controller.loadStudents(course);
            }
        });
    });
    $('#saveGrade').click(function(event) {
        var nullTextGrades = '',
            studentGrades = [],
            grade, student;
        //var personGrades = {};
        $('.gradeToSave', $('#student-data')).each(function(index, el) {
            grade = parseFloat($(el).val()) || 0;
            if (grade <= 0) {
                nullTextGrades = 'existen notas vacias, ';
            }
            student = parseInt($(el).parent().siblings().first().attr('id'));
            if (student) {
                studentGrades.push({ student, grade });
            }
        });
        controller.validate(function(err) {
            if (!err) {
                x0p({
                    title: 'Ingreso de Notas',
                    text: 'Favor revisar información, ' + nullTextGrades + 'desea continuar?',
                    icon: 'warning',
                    animationType: 'fadeIn',
                    buttons: [{
                        type: 'cancel',
                        text: 'Cancelar',
                    }, {
                        type: 'info',
                        text: 'Continuar',
                        showLoading: true
                    }]
                }).then(function(data) {
                    if (data.button == 'info') {
                        let course_lesson = $('#lesson').val();
                        let date = moment().format('YYYY-MM-DD HH:mm:ss');
                        let teacher = credentials.id;
                        let grades = [];
                        $('.gradeToSave').each(function(index, el) {
                            let student = parseInt($(el).parent().siblings().first().attr('id'));
                            let grade = parseFloat($(el).val());
                            grade = grade || 0;
                            let indexGrade = parseInt($(el).attr('data-index'));
                            grades.push({ student, grade, index: indexGrade });
                        });
                        $.post('/api/course_lesson_grade', { course_lesson, teacher, date, grades: JSON.stringify(grades) }, function(data, textStatus, xhr) {
                            x0p('Datos guardados', null, 'ok', false);
                        });
                    }
                });
            }
        });
    });
});
