let controller = {
    validate: (cb) => {
        let err = false;
        $('#courses, #lesson').each((index, el) => {
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
            var apiPath = '/api/course_lesson/' + course + '/course/';
        } else {
            var apiPath = '/api/course_lesson/' + course + '/teacher/' + userId;
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
                        .attr("value", item.id).attr('selected', 'selected').text(item.lesson));
                } else {
                    $select.append($("<option></option>")
                        .attr("value", item.id).text(item.lesson));
                }
            });
            $('#lesson').selectpicker('refresh');
            if (parseInt(count) === 1) {
                controller.loadStudents($('#courses').val());
            }
        });
    },
    loadStudents: (course) => {
        $.get('/api/student/courses/' + course, function(students) {
            $('#student-data').empty();
            $.each(students, function(index, student) {
                $('#student-data')
                    .append($('<tr></tr>')
                        .append($('<td></td>').attr('id', student.id).text((index + 1) + '.- ' + student.name))
                        .append($('<td></td>')
                            .append($('<input data-index="1" onChange="controller.handleChangeInput(this);"class="grade gradeToSave text-center" type="number" step="0.1" />').val(4)))
                        .append($('<td></td>')
                            .append($('<input class="average text-center" type="number" step="0.1" readonly />').val(4))))
            });
        });
    },
    loadStudentGrades: (obj, course) => {
        var htmlHeader = '<tr>';
        htmlHeader += '<th>Alumno</th>';
        for (var i = 0; i < (parseInt(obj.index) + 1); i++) {
            htmlHeader += '<th width="10%">Nota ' + (i + 1) + '</th>';
        }
        htmlHeader += '<th width="10%">Promedio</th>';
        htmlHeader += '</tr>';
        $('#headerGrades').html(htmlHeader);
        $.get('/api/student/courses/' + course, function(students) {
            var bodyStudent = '';
            $.each(students, function(index, student) {
                bodyStudent += '<tr>';
                bodyStudent += '<td id="' + student.id + '"> ' + (index + 1) + '.- ' + student.name + '</td>';
                var sum = 0;
                for (var i = 0; i < parseInt(obj.index); i++) {
                    let grade = obj.grades[_.findKey(obj.grades, { 'student': student.id, index: (parseInt(i) + 1) })].grade;
                    sum = sum + parseFloat(grade);
                    bodyStudent += '<td><input readonly class="grade gradeToShow" type="number" step="0.1" value="' + grade + '" /></td>';
                }
                var avg = sum / parseInt(obj.index);
                bodyStudent += '<td><input class="grade gradeToSave" type="number" step="0.1" value="" /></td>';
                bodyStudent += '<td><input readonly class="average" type="number" step="0.1" value="' + avg + '" /></td>';
                bodyStudent += '</tr>';
            });
            $('#student-data').html(bodyStudent);
            $(':input[type="number"]').change(function(event) {
                controller.handleChangeInput(this);
            });
        });
    },
    handleChangeInput: (input) => {
        let sum = parseFloat($(input).val());
        var factor = 1;
        $(input).parent().siblings().children('.grade').each(function(index, el) {
            if (parseFloat($(el).val())) {
                sum = sum + parseFloat($(el).val());
                factor++;
            }
        });
        var avg = round(parseFloat(sum / factor), 1);
        $(input).parent().siblings().children('.average').val(avg)
    }
}

function round(value, precision) {
    var multiplier = Math.pow(10, precision || 0);
    return Math.round(value * multiplier) / multiplier;
}
