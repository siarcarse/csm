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
    $('#lesson').on('changed.bs.select', function() {
        let course = $('#courses').val();
        controller.loadStudents(course);
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
                        // Simulate Delay
                        setTimeout(function() {
                            x0p('Datos guardados', null, 'ok', false);
                        }, 1500);
                        let lesson = $('#lesson').val();
                        let course = $('#course').val();
                        let date = moment().format('YYYY-MM-DD HH:mm:ss');
                        let grades = {
                            course,
                            lesson,
                        }
                        /*$.post('/api/person_comment', { comment, course_lesson, student, type, date, teacher: users_session }, function(data, textStatus, xhr) {
                            controller.loadSelectCourse();
                            $('.summernote').summernote('reset');
                            $('#type, #student').selectpicker('val', 0);
                            global.sendMessage('success', 'Anotación ingresada con éxito!');
                        });*/
                    }
                });
            }
        });
    });
});
