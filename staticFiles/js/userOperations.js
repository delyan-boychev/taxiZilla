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
function check_eik(eik_str){
    var isValid = false;
	eik_str = eik_str.replace(/\s+/, '');
	eik_len = eik_str.length;
	if((eik_len == 9) || (eik_len == 13)){
		eik = parseInt(eik_str);
		if(isNaN(eik)){
		}else{
			sum = 0;
			for(var i = 0; i < 8; i++){
				sum += eik_str.charAt(i)*(i+1);
			}
			new_value = sum % 11;
			if(new_value == 10){
				sum = 0;
				for(i = 0; i < 8; i++){
					sum += eik_str.charAt(i)*(i+3);
				}
				new_value = sum % 11;
				if(new_value == 10){
					new_value = 0;
				}
			}

			if(new_value == eik_str.charAt(8)){
				if (eik_len == 9){
					isValid = true;
				}else{
					sum = eik_str.charAt(8)*2 + eik_str.charAt(9)*7 + eik_str.charAt(10)*3 + eik_str.charAt(11)*5;
					new_value = sum % 11;
					if(new_value == 10){
						sum = eik_str.charAt(8)*4 + eik_str.charAt(9)*9 + eik_str.charAt(10)*5 + eik_str.charAt(11)*7;
						new_value = sum % 11;
						if(new_value == 10){
							new_value = 0;
						}
					}
					if(new_value == eik_str.charAt(12)){
						isValid = true;
					}
				}
			}
		}
    }
    return isValid;
}
function registerFirmSubmit()
{
    hideTooltips();
    var isChecked = true;
    var isDigit = /^\d+$/;
    var hasNumber = /\d/;
    var isEmail = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    if($("#firmName").val().length < 3)
    {
        $('#firmName').tooltip({'placement':'left','trigger': 'manual', 'title': 'Името на фирмата трябва да е по-дълго от 2 символа!'}).tooltip('show');
        isChecked = false;
    }
    if(!check_eik($("#eik").val()))
    {
        $('#eik').tooltip({'placement':'left', 'trigger': 'manual', 'title': 'Въвели сте неправилен ЕИК!'}).tooltip('show');
        isChecked = false;
    }
    if($("#city").val().length < 3)
    {
        $('#city').tooltip({'placement':'left', 'trigger': 'manual', 'title': 'Не сте въвели град!'}).tooltip('show');
        isChecked = false;
    }
    if($("#address").val().length < 3)
    {
        $('#address').tooltip({'placement':'left', 'trigger': 'manual', 'title': 'Не сте въвели адрес!'}).tooltip('show');
        isChecked = false;
    }
    if(!isEmail.test($("#email").val()))
    {
        $('#email').tooltip({ 'placement':'left','trigger': 'manual', 'title': 'Имейл адресът е невалиден!'}).tooltip('show');
        isChecked = false;
    }
    if($("#password").val().length < 8 || !hasNumber.test($("#password").val()))
    {
        $('#password').tooltip({'placement':'left','trigger': 'manual', 'title': 'Паролата трябва да съдържа поне 1 число и да е по-дълга от 7 символа!'}).tooltip('show');
        isChecked = false;
    }
    if($("#phoneNumber").val().length < 10 || $("#phoneNumber").val().charAt(0) != '0' || !isDigit.test($("#phoneNumber").val()))
    {
        $('#phoneNumber').tooltip({'placement':'left','trigger': 'manual', 'title': 'Телефонният номер е невалиден!'}).tooltip('show');
        isChecked = false;
    }
    if(isChecked == true)
    {
        $.post("/auth/registerFirm",
        {
            firmName: $("#firmName").val(),
            eik: $("#eik").val(),
            city: $("#city").val(),
            address: $("#address").val(),
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
function registerSubmit()
{
    $("input").removeClass("is-invalid");
    var isChecked = true;
    var isDigit = /^\d+$/;
    var hasNumber = /\d/;
    var isEmail = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    if($("#fName").val().length < 2)
    {
        $('#fName').addClass("is-invalid");
        isChecked = false;
    }
    else $('#fName').addClass("is-valid");
    if($("#lName").val().length < 2)
    {
        $('#lName').addClass("is-invalid");
        isChecked = false;
    }
    else $('#lName').addClass("is-valid");
    if(!isEmail.test($("#email").val()))
    {
        $('#email').addClass("is-invalid");
        isChecked = false;
    }
    else $('#email').addClass("is-valid");
    if($("#password").val().length < 8 || !hasNumber.test($("#password").val()))
    {
        $('#password').addClass("is-invalid");
        isChecked = false;
    }
    else $('#password').addClass("is-valid");
    if($("#repeatPass").val() != $("#password").val())
    {
        $('#repeatPass').addClass("is-invalid");
        isChecked = false;
    }
    else $('#repeatPass').addClass("is-valid");
    if($("#phoneNumber").val().length < 10 || $("#phoneNumber").val().charAt(0) != '0' || !isDigit.test($("#phoneNumber").val()))
    {
        $('#phoneNumber').addClass("is-invalid");
        isChecked = false;
    }
    else $('#phoneNumber').addClass("is-valid");
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
    hideTooltips();
    if($("#oldPass").val().length == 0)
    {
        $('#oldPass').tooltip({'placement':'right','trigger': 'manual', 'title': 'Не сте въвели старата парола!'}).tooltip('show');
        isChecked = false;
    }
    if($("#newPass").val().length < 8 && !hasNumber.test($("#newPass").val()))
    {
        $('#newPass').tooltip({'placement':'right','trigger': 'manual', 'title': 'Новата парола трябва да съдържа поне 1 цифра и да е по-дълга от 7 символа!'}).tooltip('show');
        isChecked = false;
    }
    if(isChecked == true)
    {
    $.post("/auth/changePassword",
        {
            oldPass: $("#oldPass").val(),
            newPass: $("#newPass").val()
        },
        function(data,status){
            if(data=="true") document.getElementById("messageText").innerText="Паролата е сменена успешно!";
            else document.getElementById("messageText").innerText="Въвели сте грешна стара парола!";
            $("#modal").modal();
        }
        );
    }
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
