var loggedIn;
function loginSubmit()
{
    $.post("/auth/loginUser",
    {
        email: $("#email").val(),
        password: $("#password").val(),
    },
    function(data,status){
        if(data=="true") document.getElementById("messageText").innerText="Успешно се влязохте в профила си!";
        else document.getElementById("messageText").innerText="Неправилна парола или имейл адрес!";
        $("#registerMessage").modal();
    }
    );
    return false;
}
function registerSubmit()
{
        $.post("/auth/registerUser",
        {
            fName: $("#fName").val(),
            lName: $("#lName").val(),
            email: $("#email").val(),
            password: $("#password").val(),
            phoneNumber: $("#phoneNumber").val()
        },
        function(data,status){
            if(data=="true") document.getElementById("messageText").innerText="Вие се регистрирахте успешно!";
            else document.getElementById("messageText").innerText="Вече съществува профил с този имейл адрес!";
            $("#registerMessage").modal();
        }
        );
        return false;
}
async function isLoggedIn()
{
    let response = await fetch(document.location);
    return response.headers.get('isLoggedIn');
}

