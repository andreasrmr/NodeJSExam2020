$('#register').on('submit', function(event) {
    event.preventDefault();
    const formValues = $(this).serialize();
    $.ajax({
        url: '/registration/register',
        type: 'POST',
        data: formValues,
        success : function(data){
             $('.content').html(data).css('color', 'green');
        },
        error : function(data){
            const errors = JSON.parse(data.responseText);
            console.log(errors)
            let errorMsg = '';
            for(key in errors) {
                for(value in errors[key]){
                    errorMsg += errors[key][value].msg + '<br>';
                }
            }
            $('#errors').html(errorMsg).css('color', 'red');
        }
    });
});