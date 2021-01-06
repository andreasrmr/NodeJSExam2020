$('#submitEmail').on('submit', function(event) {
    event.preventDefault();
    const formValues = $(this).serialize();
    $.ajax({
        url: '/forgotpassword/submitEmail',
        type: 'POST',
        data: formValues,
        success : function(data){
                $('.content').html(data).css('color', 'green');
        },
        error : function(data){
            $('.notifications').html(data.responseText).css('color', 'red');
        }
    });
});

$('#submitTempKey').on('submit', function(event) {
    event.preventDefault();
    const formValues = $(this).serialize();
    $.ajax({
        url: '/forgotpassword/submitTempKey',
        type: 'POST',
        data: formValues,
        success : function(data){
            $('.content').html(data).css('color', 'green');
        },
        error : function(data){
            $('.notifications').html(data.responseText).css('color', 'red');
        }
    });
});

$('#changePassword').on('submit', function(event) {
    event.preventDefault();
    const formValues = $(this).serialize();
    $.ajax({
        url: '/forgotpassword/changePassword',
        type: 'POST',
        data: formValues,
        success : function(data){
            $('.content').html(data).css('color', 'green');
        },
        error : function(data){
            $('.notifications').html(data.responseText).css('color', 'red');
        }
    });
});
