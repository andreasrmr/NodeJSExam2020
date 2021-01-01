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
            $('.content').html(data.responseText).css('color', 'red');
        }
    });
});