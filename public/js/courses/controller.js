let controller = {
    validate: (cb) => {
        let err = false;
        $('#crudForm :input').each((index, el) => {
            if (parseInt($(el).val()) === 0) {
                $(el).parent().addClass('has-error');
                err = true;
            }
        });
        cb(err);
    },
    resetFormInputs: (cb) => {
        let err = false;
        $('#crudForm :input').each((index, el) => {
            if ($(el).attr('id') === 'level') {
                $(el).val(0);
            } else if ($(el).attr('id') === 'year') {
                $('#year').val(parseInt(moment().format('YYYY'))); // Seteo año actual por defecto
                $('#year').prop('disabled', false);
            }
            $(el).parent().removeClass('has-error');
        });
    },
    editFormData: (obj) => {
        $.each(obj, function(index, val) {
            if (index === 'roleid') index = 'role';
            $("[id=" + index + "]").val(val);
        });
        $('#year').prop('disabled', true);
    },
    loadSelectLevel: (cb) => {
        $.get('/api/level', (data) => {
            var $select = $('#level');
            $select.empty();
            $select.append($("<option></option>")
                .attr("value", 0).text('- Seleccione -'));

            $.each(data, function(i, item) {
                $select.append($("<option></option>")
                    .attr("value", item.id).text(item.name));

            });
        });
    },
    loadTokenInput: (course, name_course) => {
        $('#title-modal-assoc').text(name_course);
        $.get('/api/lesson/' + course + '/course', (data) => { // Traigo a los sin padre
            $.get('/api/lesson/courses/' + course, (selected) => { // Traigo a los hijos previos

                //Cargo a los sin padres
                $multiselect = $('#multiselect');
                $multiselect.empty();
                $.each(data, function(i, item) {
                    $multiselect.append($("<option></option>")
                        .attr("value", item.id).attr("data-course", course).text(item.name));
                });

                //Cargo los hijos previos
                $multiselect_to = $('#multiselect_to');
                $multiselect_to.empty();
                $.each(selected, function(i, item) {
                    $multiselect_to.append($("<option></option>")
                        .attr("value", item.id).attr("data-course", course).text(item.name));
                });
                $('#multiselect').multiselect({
                    search: {
                        left: '<input type="text" name="q" class="form-control" placeholder="Buscar..." />',
                        right: '<strong class="text-primary text-center">Asignaturas del curso!</strong>'
                    },
                    afterMoveToLeft: function(left, right, options) {
                        let course = options.attr('data-course');
                        let lesson = options.val();
                        if (lesson) {
                            $.ajax({
                                url: '/api/course_lesson',
                                type: 'DELETE',
                                data: { course: course, lesson: lesson }
                            });
                        }
                    },
                    afterMoveToRight: function(left, right, options) { //Reseteo el course
                        let lesson = options.val();
                        let course = options.attr('data-course');
                        if (lesson) {
                            $.post('/api/course_lesson', { course: course, lesson: lesson });
                        }
                    }
                });
            });
        });
    }
}
