$(document).ready(function() {
    //Simuler click på home når siden er loadet.
    $("#home").click();
});

/*
$("#about").click(function (event) {
    const url = "/about";
    event.preventDefault();
    $(".content").load(url);
});
*/

$("#home").click(function(event) {
    const url = "/home";
    event.preventDefault();
    $(".content").load(url);
});

//if log in success.
$("#login").on("submit", function(event) {
    event.preventDefault();
    const formValues = $(this).serialize();
    $.ajax({
        url: "/auth/login",
        type: "POST",
        data: formValues,
        success : function(data){
             $("#login").toggle();
             $("#logout").toggle();
             $(".loggedin").toggle();
             $(".notifications").html(data).css("color", "green");
        },
        error : function(data){
            $(".notifications").html(data.responseText).css("color", "red");
        }
    });
   
});

//TODO: ikke færdig.
$("#logout").on("submit", function(event) {
    event.preventDefault();
    $("#logout").toggle();
    $("#login").toggle();
    $(".loggedin").toggle();
    $(".notifications").html("You logged out").css("color", "red");
});

$('#about').click(function (e){
    const url = '/about';
    e.preventDefault(); 
    getAuthPage(url); 
});

async function getAuthPage(url) {
    //renew accessToken if expired.
    if($.cookie('accessToken') == null) {
        const urlToken = '/auth/token';
        const refreshToken = $.cookie("refreshToken");
        const userId = $.cookie("userId");
        const data = {
            "token": refreshToken,
            "userId": userId
        }
        await $.ajax({
            type: 'POST',
            url: urlToken,
            data: data,
            ContentType: "application/json",
            success : function(data){
                $('.notifications').html(data);
            },
            error : function(data){
                $('.notifications').html(data.responseText);
            }
        });        
    }
    await $.ajax({
        url: url,
        type:'GET',
        beforeSend: function(xhr) {
            xhr.setRequestHeader ("Authorization", "Bearer " + $.cookie("accessToken"));      
        },
        success : function(data){
            $(".content").html(data);
        },
        error : function(data){
            $(".notifications").html(data.responseText);        
        }
    });
}

async function updateAccessToken() {
    const url = '/auth/token';
    const refreshToken = $.cookie("refreshToken");
    const userId = $.cookie("userId");
    const data = {
        "token": refreshToken,
        "userId": userId
    }
    await $.ajax({
        type: 'POST',
        url: url,
        data: data,
        ContentType: "application/json",
        success : function(data){
            $('.notifications').html(data);
        },
        error : function(data){
            $('.notifications').html(data.responseText);
        }
    });
}
