$('#register').on('submit', function(event) {
    event.preventDefault();
    const formValues = $(this).serialize();
    $.ajax({
        url: '/registration/register',
        type: 'POST',
        data: formValues,
        success : function(data){
             $('.content').html(data);
        },
        error : function(data){
            $('.content').html(data.responseText);
        }
    });
});