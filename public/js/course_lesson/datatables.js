let datatable = {};
$(document).ready(function() {
    let ajaxComplete = false;
    let year = parseInt(moment().format('YYYY'));
    datatable = $('#crud-grid').DataTable({
        "language": {
            "url": "/public/tools/DataTables/Spanish.json"
        },
        "ajax": {
            "url": "/api/course_lesson/0/course/",
            "dataSrc": "",
            "data": function(d) {
                ajaxComplete = true;
            }
        },
        "columns": [
            { "data": "id" },
            { "data": "lesson" },
            { "data": "course" },
            { "data": "year" },
            { "data": null }
        ],
        "responsive": true,
        "serverSide": false,
        "processing": true,
        "bFilter": true,
        "bInfo": false,
        "bLengthChange": true,
        "select": {
            style: 'multi'
        },
        "createdRow": function(row, data, index) {
            if ($('td', row).last().text() !== '') {
                var image = '<i class="fa fa-graduation-cap" aria-hidden="true"></i>';
                var button = "<button onclick='controller.loadTeacherInput(" + data.id + ", " + '"Profesores ' + data.lesson + ' ' + data.course +' ' + data.year +'"' + ");' class='btn btn-success' data-toggle='modal' href='#assoc-modal'>" + image + "</button>";
                $('td', row).last().addClass('text-center').html(button);
            }
        }
    });

});
