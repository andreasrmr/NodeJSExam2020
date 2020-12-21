$(document).ready(function() {
    //Click på home når siden er loadet.
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
})

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
             $(".notifications").html(data);
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
});

