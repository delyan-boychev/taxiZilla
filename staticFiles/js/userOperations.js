var loggedIn;
function loginSubmit()
{
    $.post("/auth/loginUser",
    {
        email: $("#email").val(),
        password: $("#password").val(),
    },
    function(data,status){
        if(data=="true") document.getElementById("messageText").innerText="Успешно  влязохте в профила си!";
        else if(data=="notVerified") document.getElementById("messageText").innerText="Моля проверете имейла си и потвърдете профила!";
        else document.getElementById("messageText").innerText="Неправилна парола или имейл адрес!";
        $("#modal").modal();
    }
    );
    return false;
}
function registerSubmit()
{
    $('#fName').tooltip('hide');
    $('#lName').tooltip('hide');
    $('#password').tooltip('hide');
    $('#email').tooltip('hide');
    $('#phoneNumber').tooltip('hide');
    var isChecked = true;
    var isDigit = /^\d+$/;
    var hasNumber = /\d/;
    var isEmail = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    var fName = document.getElementById('fName').value;
    var lName = document.getElementById('lName').value
    var email = document.getElementById('email').value;
    var password = document.getElementById('password').value;
    var phoneNumber = document.getElementById('phoneNumber').value;
    if(fName.length < 2)
    {
        $('#fName').tooltip({'placement':'left','trigger': 'manual', 'title': 'Името трябва да е по-дълго от 2 символа!'}).tooltip('show');
        isChecked = false;
    }
    if(lName.length < 2)
    {
        $('#lName').tooltip({'placement':'left', 'trigger': 'manual', 'title': 'Фамилията трябва да е по-дългa от 2 символа!'}).tooltip('show');
        isChecked = false;
    }
    if(!isEmail.test(email))
    {
        $('#email').tooltip({ 'placement':'left','trigger': 'manual', 'title': 'Имейл адресът е невалиден!'}).tooltip('show');
        isChecked = false;
    }
    if(password.length < 8 || !hasNumber.test(password))
    {
        $('#password').tooltip({'placement':'left','trigger': 'manual', 'title': 'Паролата трябва да съдържа поне 1 число и да е по-дълга от 7 символа!'}).tooltip('show');
        isChecked = false;
    }
    if(phoneNumber.length < 10 || phoneNumber.charAt(0) != '0' || !isDigit.test(phoneNumber))
    {
        $('#phoneNumber').tooltip({'placement':'left','trigger': 'manual', 'title': 'Телефонният номер е невалиден!'}).tooltip('show');
        isChecked = false;
    }
    if(isChecked == true)
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
            $("#modal").modal();
        }
        );
    }
        return false;
}
function getProfile()
{
    $.get("/auth/profile", function(data, status){
        var json = data;
        document.getElementById("fName").value = json["fName"];
        document.getElementById("lName").value = json["lName"];
        document.getElementById("phoneNumber").value = json["telephone"];
        document.getElementById("email").value = json["email"];
      });
}
function changePassword()
{
    var hasNumber = /\d/;
    var isChecked = true;
    $('#oldPass').tooltip('hide');
    $('#newPass').tooltip('hide');
    if($("#oldPass").val().length == 0)
    {
        $('#oldPass').tooltip({'placement':'left','trigger': 'manual', 'title': 'Не сте въвели старата парола!'}).tooltip('show');
        isChecked = false;
    }
    if($("#newPass").val().length < 8 && !hasNumber.test($("#newPass").val()))
    {
        $('#newPass').tooltip({'placement':'left','trigger': 'manual', 'title': 'Новата парола трябва да съдържа поне 1 цифра и да е по-дълга от 7 символа!'}).tooltip('show');
        isChecked = false;
    }

    $.post("/auth/changePassword",
        {
            oldPass: $("#oldPass").val(),
            newPass: $("#newPass").val()
        },
        function(data,status){
            if(data=="true") document.getElementById("messageText").innerText="Вие се регистрирахте успешно!";
            else document.getElementById("messageText").innerText="Вече съществува профил с този имейл адрес!";
            $("#modal").modal();
        }
        );
}
function delProfile()
{
    $("#passDel").tooltip('hide');
    if($("#passDel").val().length > 0)
    {
    
    $.post("/auth/deleteUser",
        {
            password: $("#passDel").val()
        },
        function(data,status){
            if(data=="true") document.getElementById("messageText").innerText="Профилът е изтрит успешно!";
            else document.getElementById("messageText").innerText="Въвели сте грешна парола!";
            $("#modal").modal();
        }
        );
    }
    else
    {
        $("#passDel").tooltip({'placement':'left','trigger': 'manual', 'title': 'Въведете парола!'}).tooltip('show');
    }
}
async function isLoggedIn()
{
    let response = await fetch(document.location);
    return response.headers.get('isLoggedIn');
}

