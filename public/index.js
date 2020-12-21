$("#anotherPage").click(function (e) {
    console.log("did something");
    $('#content').html("healskdlæaskdkasælk");
});


//if log in success.
$("#buttonLogin").click(function (e) {
    e.preventDefault();
    console.log("clicked");
    $(".login-container").toggle();
    $(".logout-container").toggle();
});

$("#buttonLogout").click(function (e) {
    e.preventDefault();
    $(".logout-container").toggle();
    $(".login-container").toggle();
});