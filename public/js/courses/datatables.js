let datatable = {};
$(document).ready(function() {
    let ajaxComplete = false;
    let year = parseInt(moment().format('YYYY'));
    datatable = $('#crud-grid').DataTable({
        "language": {
            "url": "/public/tools/DataTables/Spanish.json"
        },
        "ajax": {
            "url": "/api/courses/" + year + "/year",
            "dataSrc": "",
            "data": function(d) {
                ajaxComplete = true;
            }
        },
        "columns": [
            { "data": "id" },
            { "data": "level_name" },
            { "data": "year" },
            { "data": "lesson" }
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
                var image = '<i class="fa fa-link" aria-hidden="true"></i>';
                var button = "<button onclick='controller.loadTokenInput(" + data.id + ", " + '"' + data.level_name + '"' + ");' class='btn btn-info' data-toggle='modal' href='#assoc-modal'>" + image + "</button>";
                $('td', row).last().addClass('text-center').html(button);
            }
        }
    });

});
