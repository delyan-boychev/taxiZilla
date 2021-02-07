

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
            console.log(data);
            if(data=="true") document.getElementById("messageText").innerText="Вие се регистрирахте успешно!";
            else document.getElementById("messageText").innerText="Вече съществува профил с този имейл адрес!";
            $("#registerMessage").modal();
        }
        );
        return false;
    }

