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
    $('#saveComment').click(function(event) {
        controller.validate(function(err) {
            if (!err) {
                let comment = $('.summernote').summernote('code');
                let course_lesson = $('#courses').val();
                let student = $('#student').val();
                let type = $('#type').val();
                let date = moment().format('YYYY-MM-DD HH:mm:ss');
                $.post('/api/person_comment', { comment, course_lesson, student, type, date, teacher: users_session }, function(data, textStatus, xhr) {
                    controller.loadSelectCourse();
                    $('.summernote').summernote('reset');
                    $('#type, #student').selectpicker('val', 0);
                    global.sendMessage('success', 'Anotación ingresada con éxito!');
                });
            }
        });
    });
});