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
            $('#errors').html(data).css('color', 'red');
        }
    });
});

