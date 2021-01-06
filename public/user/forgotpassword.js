$('#submitEmail').on('submit', function(event) {
    event.preventDefault();
    const formValues = $(this).serialize();
    $.ajax({
        url: '/user/forgotpassword',
        type: 'POST',
        data: formValues,
        success : function(data){
                $('.content').html(data).css('color', 'green');
        },
        error : function(data){
            $('.notifications').html(data).css('color', 'red');
        }
    });
});

$('#insertKey').on('submit', function(event) {
    event.preventDefault();
    const formValues = $(this).serialize();
    $.ajax({
        url: '/user/submitTempKey',
        type: 'POST',
        data: formValues,
        success : function(data){
            $('.content').html(data).css('color', 'green');
        },
        error : function(data){
            $('.notifications').html(data).css('color', 'red');
        }
    });
});

$('#changePassword').on('submit', function(event) {
    event.preventDefault();
    const formValues = $(this).serialize();
    $.ajax({
        url: '/user/changePassword',
        type: 'POST',
        data: formValues,
        success : function(data){
            $('.content').html(data).css('color', 'green');
        },
        error : function(data){
            $('.notifications').html(data).css('color', 'red');
        }
    });
});
