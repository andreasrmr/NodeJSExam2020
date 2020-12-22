$(document).ready(function() {
    //Simuler click på home når siden er loadet.
    $("#home").click();
});

$("#about").click(function (event) {
    const url = "/about";
    event.preventDefault();
    $(".content").load(url);
});

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
        url: "/login",
        type: "POST",
        data: formValues,
        success : function(data){
             $("#login").toggle();
             $("#logout").toggle();
             $(".loggedin").toggle();
             $(".notifications").html(data).css("color", "green");
        },
        error : function(data){
            $(".notifications").html(data);
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

