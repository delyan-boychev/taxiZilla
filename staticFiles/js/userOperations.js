var actionOnCloseModal = undefined;
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
            actionOnCloseModal = refreshPage;
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
            actionOnCloseModal = logout;
        }
        else if(data=="emailExists") {
            document.getElementById("messageText").innerText="Вече съществува потребител с този имейл адрес!";
        }
        $("#modal").modal();
        
    }
    );
    }
}
function makeOrderAddress()
{
    $.ajax(
        {
            async: true,
            url: "https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/findAddressCandidates",
            type: "GET",
            data:
            {
            SingleLine: $("#addressTaxi").val(),
            f: "json"
            }
        }).done(function(json) {document.getElementById("map").src = "https://maps.google.com/maps?q="+ json.candidates[0].location.y + ", " + json.candidates[0].location.x +"&t=&z=17&ie=UTF8&iwloc=&output=embed";});
}
window.mobileCheck = function() {
    let check = false;
    (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
    if(navigator.maxTouchPoints <= 1) check = false;
    return check;
  };
var getStackTrace = function() {
    var obj = {};
    Error.captureStackTrace(obj, getStackTrace);
    return obj.stack;
  };
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
            actionOnCloseModal = refreshPage;
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
            if(data=="true"){
                document.getElementById("messageText").innerText="Профилът е изтрит успешно!";
                actionOnCloseModal = logout;
            }
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
                actionOnCloseModal = getTaxiDrivers;
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
            actionOnCloseModal = getTaxiDrivers;
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
    actionOnCloseModal();
  });
