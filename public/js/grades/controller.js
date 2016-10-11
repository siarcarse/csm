let controller = {
    validate: (cb) => {
        let err = false;
        $('#student, #courses, #type').each((index, el) => {
            if (parseInt($(el).val()) === 0) {
                //$(el).parent().addClass('has-error');
                $(el).selectpicker('setStyle', 'btn-danger');
                err = true;
            }
        });
        cb(err);
    },
    loadSelectCourse: () => {
        if (credentials.rolename === 'Administrador') {
            var apiPath = '/api/courses';
        } else {
            var apiPath = '/api/courses/' + credentials.id + '/teacher';
        }
        $.get(apiPath, (data) => {
            var count = data.length;
            var $select = $('#courses');
            $select.empty();
            $select.append($("<option></option>")
                .attr("value", 0).text('- Seleccione -'));

            $.each(data, function(i, item) {
                if (parseInt(count) === 1) {
                    $select.append($("<option></option>")
                        .attr("value", item.id).attr('selected', 'selected').text(item.level_name + ' - ' + item.year));
                } else {
                    $select.append($("<option></option>")
                        .attr("value", item.id).text(item.level_name + ' - ' + item.year));
                }

            });
            $('#courses').selectpicker('refresh');
            if (parseInt(count) === 1) {
                controller.loadSelectLesson(data[0].id);
            }
        });
    },
    loadSelectLesson: (course) => {
        var userId = credentials.id;
        if (credentials.rolename === 'Administrador') {
            var apiPath = '/api/lesson/courses/' + course;
        } else {
            var apiPath = '/api/lesson/courses/' + course + '/teacher/' + userId;
        }
        $.get(apiPath, function(data) {
            var count = data.length;
            var $select = $('#lesson');
            $select.empty();
            $select.append($("<option></option>")
                .attr("value", 0).text('- Seleccione -'));

            $.each(data, function(i, item) {
                if (parseInt(count) === 1) {
                    $select.append($("<option></option>")
                        .attr("value", item.id).attr('selected', 'selected').text(item.name));
                } else {
                    $select.append($("<option></option>")
                        .attr("value", item.id).text(item.name));
                }
            });
            $('#lesson').selectpicker('refresh');
            if (parseInt(count) === 1) {
                controller.loadStudents($('#courses').val());
            }
        });
    },
    loadStudents: (course) => {
        $.get('/api/student/courses/' + course, function(data) {
            var bodyStudent = '';
            $.each(data, function(index, val) {
                bodyStudent += '<tr><td>' + val.name + '</td><td><input type="number" step="0.1" ></td></tr>';
            });
            $('#student-data').html(bodyStudent);
        });
    }
}
