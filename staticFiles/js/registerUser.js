function registerSubmit()
    {
        $.post("/auth/registerUser",
        {
            fName: $("#lName").val(),
            lName: $("#fName").val(),
            email: $("#email").val(),
            password: $("#password").val(),
            phoneNumber: $("#phoneNumber").val()
        },
        function(data,status){
            alert("Data: " + data + "\nStatus: " + status);
        }
        );
        return false;
    }

