$(document).ready(function() {
    controller.loadSelectRole();
    $("#phone").numeric({ decimal: false, negative: false }); //Control numeric Input

    $('input#phone').on('keyup', function() {
        controller.limitText(this, 8); // Control Lenght Numeric Input (phone max 8 characters)
    });
    //Reset state error un click inputs
    $('#crudForm :input').click(function(event) {
        $(this).parent().removeClass('has-error');
    });
    $('#crud-modal').on('hidden.bs.modal', () => { //Modal on Hide, reset inputs
        controller.resetFormInputs();
    });

    $('#edit-crud').click(function(event) {
        let rowSelected = datatable.rows('.selected').data();
        if (rowSelected.length === 1) {
            controller.editFormData(rowSelected[0]); // Lleno el formulario y abro el Modal
        } else if (rowSelected.length === 0) {
            global.sendMessage('info', 'Debes Seleccionar almenos un registro!');
        } else if(rowSelected.length > 1) {
            global.sendMessage('danger', 'Solo puedes editar 1 registro a la vez!');
        }

    });
    $('#saveUsers').click(function(event) {
        let username = $('#username').val();
        let password = $('#password').val();
        let name = $('#name').val();
        let lastname = $('#lastname').val();
        let rol = $('#rol').val();
        let mail = $('#mail').val();
        let birthdate = $('#birthdate').val();
        let phone = $('#phone').val();
        controller.validate((err) => {
            if (!err) {
                console.log('No hay error, tamos ready for the insert into the wea! xD');
            }
        });
    });
});
