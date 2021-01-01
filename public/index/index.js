/*$(document).ready(function() {
    //Simuler click på home når siden er loadet.
    //$('#home').click();
});
*/
$('#home').click(function(event) {
    const url = '/home';
    event.preventDefault();
    $('.content').load(url);
});

//if log in success.
$('#login').on('submit', function(event) {
    event.preventDefault();
    const formValues = $(this).serialize();
    $.ajax({
        url: '/auth/login',
        type: 'POST',
        data: formValues,
        success : function(data){
            toggleLogin();
             $('.notifications').html(data).css('color', 'green');
        },
        error : function(data){
            $('.notifications').html(data.responseText).css('color', 'red');
        }
    });
   
});

$('#logout').on('submit', function (event) {
    event.preventDefault();
    const url = '/auth/logout';
    const refreshToken = $.cookie('refreshToken');
    const data = `refreshToken=${refreshToken}`;
    $.ajax({
        url: url,
        type:'POST',
        data: data,
        success : function(data, status, xhr){ 
            $('.notifications').html(data).css('color', 'red');
            toggleLogin();   
        },
        error : function(data){
            console.log('error' + data);
            $('.notifications').html(data);
        }
    });
})

$('#about').click(function (e){
    const url = '/about';
    e.preventDefault();
    $('.content').load(url); 
});

$('#chat').click(function (e){
    const url = '/chat';
    e.preventDefault();
    getAuthPage(url); 
});

$('#registerButton').click(function(e){
    const url = '/registration/register';
    e.preventDefault();
    $('.content').load(url);
});

async function getAuthPage(url) {
    //renew accessToken if expired.
    if($.cookie('accessToken') == null) {
        const urlToken = '/auth/token';
        const refreshToken = $.cookie('refreshToken');
        const userId = $.cookie('userId');
        const data = {
            'token': refreshToken,
            'userId': userId
        }
        await $.ajax({
            type: 'POST',
            url: urlToken,
            data: data,
            ContentType: 'application/json',
            success : function(data){
                $('.notifications').html(data);
            },
            error : function(data){
                //accesstoken could not be refreshed
                $('.notifications').html(data.responseText);
                toggleLogin();
                //naviger til 'home'
                $('#home').click();
            }
        });        
    }
    await $.ajax({
        url: url,
        type:'GET',
        beforeSend: function(xhr) {
            xhr.setRequestHeader ('Authorization', 'Bearer ' + $.cookie('accessToken'));      
        },
        success : function(data){
            $('.content').html(data);
        },
        error : function(data){
            $('.notifications').html(data.responseText);        
        }
    });
}

function toggleLogin(){
    $('#login').toggle();
    $('#logout').toggle();
    $('.loggedin').toggle();
}
