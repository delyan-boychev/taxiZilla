var actionOnCloseModal = "";
function loginSubmit()//Post zaqvka za login na klient
{
    $.post("/auth/loginUser",
    {
        email: $("#email").val(),
        password: $("#password").val(),
    },
    function(data,status){
        if(data=="true") { 
            document.getElementById("messageText").innerText="Успешно  влязохте в профила си!";
            actionOnCloseModal = "refresh";
        }
        else if(data=="notVerified") document.getElementById("messageText").innerText="Моля проверете имейла си и потвърдете профила!";
        else document.getElementById("messageText").innerText="Неправилна парола или имейл адрес!";
        $("#modal").modal();
    }
    );
    return false;
}
function changeEmail()//Post zaqvka za smqna na email adresa na klient
{
    var isEmail = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    if(!isEmail.test($("#newEmail").val()))
    {
        $('#newEmail').addClass("is-invalid");
    }
    else
    {
        $('#newEmail').removeClass("is-invalid");
    $.post("/auth/changeEmail",
    {
        newEmail: $("#newEmail").val(),
    },
    function(data,status){
        if(data=="true") 
        {
            document.getElementById("messageText").innerText="Имейл адресът е сменен успешно! Сега автоматчно ще излезете от профила си! Моля проверете новия си имейл адрес и го потвърдете!";
            actionOnCloseModal = "logout";
        }
        else if(data=="emailExists") {
            document.getElementById("messageText").innerText="Вече съществува потребител с този имейл адрес!";
        }
        $("#modal").modal();
        
    }
    );
    }
}
function loginFirmSubmit()//Post zaqvka za login na firma
{
    var checked = true;
    if($("#eik").val().length < 13)
    {
        
    }
    $.post("/firm/loginFirm",
    {
        eik: $("#eik").val(),
        password: $("#password").val(),
    },
    function(data,status){
        if(data=="true")
        { 
            document.getElementById("messageText").innerText="Успешно  влязохте в профила си!";
            actionOnCloseModal = "refresh";
        }
        else if(data=="notVerified") document.getElementById("messageText").innerText="Моля проверете имейла си и потвърдете профила!";
        else if(data=="notModerationVerified") document.getElementById("messageText").innerText="Фирмата все още не е преминала одобрение от модераторите! Обикновено това отнема няколко дни!";
        else document.getElementById("messageText").innerText="Неправилна парола или ЕИК!";
        $("#modal").modal();
        
    }
    );
    return false;
}
function check_eik(eik_str)//Proverka dali EIK e validen
{
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
function registerFirmSubmit()//Post zaqvka za registrirane na firma
{
    $("input").removeClass("is-invalid");
    var isChecked = true;
    var isDigit = /^\d+$/;
    var hasNumber = /\d/;
    var isEmail = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    if($("#firmName").val().length < 3)
    {
        $('#firmName').addClass("is-invalid");
        isChecked = false;
    }
    else $('#firmName').addClass("is-valid");
    if(!check_eik($("#eik").val()))
    {
        $('#eik').addClass("is-invalid");
        isChecked = false;
    }
    else $('#eik').addClass("is-valid");
    if($("#city").val().length < 3)
    {
        $('#city').addClass("is-invalid");
        isChecked = false;
    }
    else $('#city').addClass("is-valid");
    if($("#address").val().length < 3)
    {
        $('#address').addClass("is-invalid");
        isChecked = false;
    }
    else $('#address').addClass("is-valid");
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
    if($("#password").val() != $("#repeatPass").val())
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
        $.post("/firm/registerFirm",
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
function registerSubmit()//Post zaqvka za registrirane na klient
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
function getProfile()//Get zaqvka za vzemane na informaciqta ot profila na klient
{
    $.get("/auth/profile", function(data, status){
        var json = data;
        document.getElementById("fName").value = json["fName"];
        document.getElementById("lName").value = json["lName"];
        document.getElementById("phoneNumber").value = json["telephone"];
        document.getElementById("email").value = json["email"];
      });
}
function getProfileFirm()//Get zaqvka za vzemane na inforamciqta ot profila na firma
{
    $.get("/firm/profile", function(data, status){
        var json = data;
        document.getElementById("firmName").innerText = json["firmName"];
        document.getElementById("eik").innerText = json["eik"];
        document.getElementById("address").innerText = json["city"] + ", " + json["address"];
      });
}
function changePassword()//Post zaqvka za smqna na parola na klient
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
function delProfile()//Post zaqvka za iztrivane na profil na klient
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
function addTaxiDriver()//Post zaqvka za dobavqne na taksimetrovi shofyori
{
    var isEmail = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    if(!isEmail.test($("#emailDriver").val()))
    {
        $('#emailDriver').addClass("is-invalid");
    }
    else
    {
    $.post("/firm/addTaxiDriver",
        {
            email: $("#emailDriver").val()
        },
        function(data,status){
            if(data=="true")
            { 
                document.getElementById("messageText").innerText="Успешено е добавен таксиметровият шофьор!";
                actionOnCloseModal = "rewriteFirmDriversTab";
            }
            else document.getElementById("messageText").innerText="Не съществува профил с такъв имейл адрес!";
            $("#modal").modal();
        }
        );
    }
}
function removeTaxiDriver(email)//Post zaqvka za premahvane na taksimetrov shofyor
{
    $.post("/firm/removeTaxiDriver",
        {
            email: email
        },
        function(data,status){
            if(data=="true") document.getElementById("messageText").innerText="Шофьорът е премахнат успешно!";
            actionOnCloseModal = "rewriteFirmDriversTab";
            $("#modal").modal();
        }
        );
}
function getTaxiDrivers()//Get zaqvka za vzimane na taksimetrovi shofyori
{
    $.get("/firm/getTaxiDrivers", function(data, status){
        var json = data;
        if(json.length	=== 0)
        { 
            document.getElementById("noDrivers").style = "display: block;";
            document.getElementById("addedTaxiDrivers").innerHTML = "";
        }
        else
        {
            document.getElementById("noDrivers").style = "display: none;";
            document.getElementById("addedTaxiDrivers").innerHTML = "";
            json.forEach(a => {
                document.getElementById("addedTaxiDrivers").innerHTML += "<tr><td>"+ a["fName"] +"</td><td>"+ a["lName"]  +"</td><td>"+ a["email"]  +"</td><td>"+ a["telephone"]  +"</td><td><i class='far fa-times-circle text-danger h5' style='cursor: pointer;' onclick='removeTaxiDriver(\""+ a["email"] +"\");'></i></td></tr>";
            });
        }
      });
}
function logout()//Funkciq za izlizane ot profila
{
    window.location = "./logout";
}
$('#modal').on('hidden.bs.modal', function () {
    if(actionOnCloseModal == "refresh")
    {
      refreshPage();
    }
    else if(actionOnCloseModal == "logout")
    {
        logout();
    }
    else if(actionOnCloseModal == "rewriteFirmDriversTab")
    {
        getTaxiDrivers();
    }
    actionOnCloseModal = "";
  });
