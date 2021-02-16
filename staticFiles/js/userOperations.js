
//Deklarirane na promenlivi i konstanti
eval = function () {console.log("%c You are not permitted to use this method!!!",  'color: red');}
var actionOnCloseModal = undefined;
const loginInfo = {};
const profileInfo = {};
const orderStatus = Object.freeze({
    OPEN: "Приета",
    CLOSED: "Приключена",
    CANCELED: "Отказана",
    });
function loginSubmit()//Post zaqvka za login na klient
{
    if(arguments.callee.caller === null) {console.log("%c You are not permitted to use this method!!!",  'color: red'); return;}
    getServerDate().then(dateServer =>{
    postRequest("/auth/loginUser",
    {
        email: $("#email").val(),
        password: $("#password").val(),
        key: algorithm(),
        offset: dateServer["offset"]
    },
    ).then(data=>
    {
        if(data=="true") {
            if($("#rememberMe").prop('checked') == true)
            {
                rememberMe($("#email").val(), $("#password").val(), "User");
            }
            document.getElementById("modalBody").innerText="Успешно  влязохте в профила си!";
            actionOnCloseModal = refreshPage;
        }
        else if(data=="notVerified") document.getElementById("modalBody").innerText="Моля проверете имейла си и потвърдете профила!";
        else document.getElementById("modalBody").innerText="Неправилна парола или имейл адрес!";
        $("#modal").modal();
    });
    });
    return false;
}
function getSupportedCitiesByFirm()//Vzemane na poddurzani gradove kato firma
{
    if(arguments.callee.caller === null) {console.log("%c You are not permitted to use this method!!!",  'color: red'); return;}
    getRequest("/firm/getCitiesByFirm").then(data=>
    {
            var json = data;
            if(json.length	=== 0)
            { 
                document.getElementById("noCities").style = "display: block;";
                document.getElementById("addedSupportedCities").innerHTML = "";
            }
            else
            {
                document.getElementById("noCities").style = "display: none;";
                document.getElementById("addedSupportedCities").innerHTML = "";
                json.forEach(el => {
                    document.getElementById("addedSupportedCities").innerHTML += "<tr><td>"+ el["city"] +"</td><td>"+ el["region"]  +"</td><td><i class='far fa-times-circle text-danger h5' style='cursor: pointer;' onclick='removeSupportedCity(\""+ el["city"] +"\", \"" + el["region"] +"\");'></i></td></tr>";
                });
            }
    });

}
function addSupporttedCity()//Dobavqne na poddurzan grad
{
    if(arguments.callee.caller === null) {console.log("%c You are not permitted to use this method!!!",  'color: red'); return;}
    $('#nameCity').addClass("is-valid");
    if($("#nameCity").val().length < 4)
    {
        $('#nameCity').addClass("is-invalid");
    }
    else
    {
    postRequest("/firm/addSupportedCity", 
    {
        city: document.querySelector('input[name="type"]:checked').value + " " + $("#nameCity").val(),
        region: $("#nameRegion").val()
    }).then(data=>
    {
        if(data=="true") 
        {
            document.getElementById("modalBody").innerText="Населеното място е добавено успешно!";
            actionOnCloseModal = getSupportedCitiesByFirm;
        }
        else document.getElementById("modalBody").innerText="Вече сте добавили населено място с това име!";

    $("#modal").modal();
        }
        ).fail(function(){
            refreshPage();
        });
    }
}
function getAllCities()//Vzemane na vsichki gradove, koito sa poddurzani
{
    if(arguments.callee.caller === null) {console.log("%c You are not permitted to use this method!!!",  'color: red'); return;}
    getRequest("/firm/getAllCities").then(data=>
    {
        var json = data;
        json.forEach(el => {
            document.getElementById("city").innerHTML += "<option>"+ el["city"]+", "+ el["region"] +"</option>"
        });
    });
}
function makeOrderTaxiAddress()//Suzdavane na poruchka ot adres
{
    if(arguments.callee.caller === null) {console.log("%c You are not permitted to use this method!!!",  'color: red'); return;}
    if($("#addressTaxi").val().length < 6)
    {
        $('#addressTaxi').addClass("is-invalid");
    }
    else
    {
        $('#addressTaxi').addClass("is-valid");
        $.ajax(
            {
                async: true,
                url: "https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/findAddressCandidates",
                type: "GET",
                data:
                {
                SingleLine: $("#addressTaxi").val() + ", " + $("#city").val(),
                f: "json"
                }
            }).done(function(json)
            {
                postRequest("/order/createOrder",
                {
                x: json.candidates[0].location.x,
                y: json.candidates[0].location.y,
                address: $("#addressTaxi").val() + ", " + $("#city").val(),
                notes: $('#notes').val(),
                }).then(data=>
                {
                document.getElementById("modalBody").innerText="Успешно е направенa поръчка!";
                $("#modal").modal();
                }
                );
            });

    }
}
async function getLocation()//Vzemane na tekushto mestopolozenie
{
    coord = {};
    if(navigator.geolocation) {
        await navigator.geolocation.getCurrentPosition(async function(position) {
            coord["x"] = position.coords.longitude;
            coord["y"] = position.coords.latitude;
        });
        await new Promise(r => setTimeout(r, 500));
        return coord;
    }
}
function makeOrderCurrentLocation()//Suzdavane na poruchka ot tekushto mestopolozenie
{
    if(arguments.callee.caller === null) {console.log("%c You are not permitted to use this method!!!",  'color: red'); return;}
    getLocation().then(coord => {
            getRequest("https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/reverseGeocode?location="+ coord["x"]+", " + coord["y"] + "&f=pjson").then(data=>
            {
                data = JSON.parse(data);
                getRequest("/firm/getAllCities").then(data2=>
                {
                    var exists = false;
                    data2.forEach(el => {
                        if(el["city"].includes(data["address"]["City"]) && el["region"] == data["address"]["Region"]) exists = true;
                    });
                    if(exists)
                    {
                    postRequest("/order/createOrder",
                    {
                    x: coord["x"],
                    y: coord["y"],
                    address: "",
                    notes: $('#notes').val(),
                    }).then(data3=>
                    {
                    document.getElementById("modalBody").innerText="Успешно е направенa поръчка!";
                    $("#modal").modal();
                    }
                    );
                    }
                    else
                    {
                        document.getElementById("modalBody").innerText="Не се намирате в поддържано населено място!";
                        $("#modal").modal();
                    }
                });
            });
        });

}
function setProfileInfoUser()//Zadavene na informaciq profil na potrebitel
{
    if(arguments.callee.caller === null) {console.log("%c You are not permitted to use this method!!!",  'color: red'); return;}
    getRequest("/auth/profile").then(data=> {
            var json = data;
            var nav = document.getElementById("navElements");
            Object.keys(json).forEach(key => 
                {
                    Object.defineProperty(profileInfo, key, {
                        value: json[key]
                    });
                });
                if(loginInfo["Role"] == "Admin")
                {
                    nav.innerHTML += '<li class="nav-item"><a class="nav-link text-secondary waves-effect waves-light" onclick="adminPanelPage()">Администраторски панел</a></li><li class="nav-item"><a class="nav-link text-secondary waves-effect waves-light" onclick="profilePage()">Моят профил (<i class="fas fa-user-cog"></i><span id="fullNameNav">'+ profileInfo["fName"] + " " + profileInfo["lName"] +'</span>)</a></li><li class="nav-item"><a class="nav-link text-secondary waves-effect waves-light" onclick="logOut()">Излизане</a></li>';
                }
                else if(loginInfo["Role"] == "Moderator")
                {
                    nav.innerHTML += '<li class="nav-item"><a class="nav-link text-secondary waves-effect waves-light" onclick="profilePage()">Моят профил (<i class="fas fa-user-shield"></i><span id="fullNameNav">'+ profileInfo["fName"] + " " + profileInfo["lName"] +'</span>)</a></li><li class="nav-item"><a class="nav-link text-secondary waves-effect waves-light" onclick="logOut()">Излизане</a></li>';
                }
                else if(loginInfo["Role"] == "User")
                {
                nav.innerHTML += '<li class="nav-item"><a class="nav-link text-secondary waves-effect waves-light" onclick="profilePage()">Моят профил (<i class="fas fa-user"></i><span id="fullNameNav">'+ profileInfo["fName"] + " " + profileInfo["lName"] +'</span>)</a></li><li class="nav-item"><a class="nav-link text-secondary waves-effect waves-light" onclick="logOut()">Излизане</a></li>';
                }
                else if(loginInfo["Role"] == "Driver")
                {
                    nav.innerHTML += '<li class="nav-item"><a class="nav-link text-secondary waves-effect waves-light" onclick="profileDriverPage()">Моят профил (<i class="fas fa-taxi"></i><span id="fullNameNav">'+ profileInfo["fName"] + " " + profileInfo["lName"] +'</span>)</a></li><li class="nav-item"><a class="nav-link text-secondary waves-effect waves-light" onclick="logOut()">Излизане</a></li>';
                }         
            });

}
function setProfileInfoFirm()//Zadavene na informaciq profil na firma
{
    if(arguments.callee.caller === null) {console.log("%c You are not permitted to use this method!!!",  'color: red'); return;}
    getRequest("/firm/profile").then(data=>
        {
        var json = data;
            var nav = document.getElementById("navElements");
            Object.keys(json).forEach(key => 
                {
                    Object.defineProperty(profileInfo, key, {
                        value: json[key]
                    });
                });
            nav.innerHTML += '<li class="nav-item"><a class="nav-link text-secondary waves-effect waves-light" onclick="profileFirmPage()">Моят профил(<i class="fas fa-building"></i>'+ profileInfo["firmName"] +')</a></li><li class="nav-item"><a class="nav-link text-secondary waves-effect waves-light" onclick="logOut()">Излизане</a></li>';
      });

}
function getOrdersUser()//Vzemane na poruchki napraveni ot potrebitel
{
    if(arguments.callee.caller === null) {console.log("%c You are not permitted to use this method!!!",  'color: red'); return;}
    getRequest("/order/getOrdersByUser").then(
        data=>
        {
            var bodyTableOrders = document.getElementById("ordersTableBody");
            bodyTableOrders.innerHTML = "";
            if(data.length === 0)
            {
                document.getElementById("noOrders").style = "display:block";
            }
            else
            {
            data.forEach(order => {
                var driverId = "Няма";
                var listOrder = "Няма";
                var notes = "Няма";
                if(order["driverId"] != null) driverId = order["driverId"];
                if(order["notes"] != "") driverId = order["notes"];
                if(order["items"] != "") driverId = order["items"];
                bodyTableOrders.innerHTML += `<td>${order["id"]}</td><td>${order["address"]}</td><td>${order["y"]}</td><td>${order["x"]}</td><td>${driverId}</td><td>${listOrder}</td><td>${notes}</td><td>${order["date"]}</td><td>${orderStatus[order["orderStatus"]]}</td>`;
            });
            }

        }
    );
}
function getOrdersDriver()//Vzemane na poruchki prieti ot shofyor
{
    if(arguments.callee.caller === null) {console.log("%c You are not permitted to use this method!!!",  'color: red'); return;}
    getRequest("/order/getOrdersByDriver").then(
        data=>
        {
            var bodyTableOrders = document.getElementById("ordersTableBody");
            bodyTableOrders.innerHTML = "";
            if(data.length === 0)
            {
                document.getElementById("noOrders").style = "display:block";
            }
            else
            {
            data.forEach(order => {
                var listOrder = "Няма";
                var notes = "Няма";
                if(order["notes"] != "") driverId = order["notes"];
                if(order["items"] != "") driverId = order["items"];
                bodyTableOrders.innerHTML += `<td>${order["id"]}</td><td>${order["address"]}</td><td>${order["y"]}</td><td>${order["x"]}</td><td>${order["userOrderedId"]}</td><td>${listOrder}</td><td>${notes}</td><td>${order["date"]}</td><td>${orderStatus[order["orderStatus"]]}</td>`;
            });
            }

        }
    );
}
function setLoginInfo()//Zadavene na informaciq za login
{
    if(arguments.callee.caller === null) {console.log("%c You are not permitted to use this method!!!",  'color: red'); return;}
    const loginInf = JSON.parse(document.getElementById("res").innerText);
    Object.keys(loginInf).forEach(key => 
        {
            Object.defineProperty(loginInfo, key, {
                value: loginInf[key]
            });
        });
    document.getElementById("res").remove();
}
function resetPassword()//Post zaqvka za generirane na nova parola na potrebitel
{
    if(arguments.callee.caller === null) {console.log("%c You are not permitted to use this method!!!",  'color: red'); return;}
    var isEmail = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    if(!isEmail.test($("#email").val()))
    {
        $('#email').addClass("is-invalid");
    }
    else
    {
        $('#email').removeClass("is-invalid");
        $('#email').addClass("is-valid");
    getServerDate().then(dateServer =>{
    postRequest("/auth/resetPassword",
    {
        email: $("#email").val(),
        key: algorithm(),
        offset: dateServer["offset"]
    }).then(data=>
    {
        if(data=="true") 
        {
            document.getElementById("modalBody").innerText="Изпратено е съобщение на имейл адреса с временна парола!";
        }
        else if(data=="too often")
        {
            document.getElementById("modalBody").innerText="Може да изпращате имейл адрес с временна парола само 1 път на 1 час!";
        }
        else if(data=="false") {
            document.getElementById("modalBody").innerText="Не съществува профил с такъв имейл адрес!";
        }
        $("#modal").modal();
        
    }
    )
});
    }
}
function resetPasswordFirm()//Post zaqvka za generirane na nova parola na firma
{
    if(arguments.callee.caller === null) {console.log("%c You are not permitted to use this method!!!",  'color: red'); return;}
    var isEmail = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    if(!isEmail.test($("#email").val()))
    {
        $('#email').addClass("is-invalid");
    }
    else
    {
        $('#email').removeClass("is-invalid");
        $('#email').addClass("is-valid");
    getServerDate().then(dateServer =>{
    postRequest("/firm/resetPassword",
    {
        email: $("#email").val(),
        key: algorithm(),
        offset: dateServer["offset"]
    }).then(data=>
    {
        if(data=="true") 
        {
            document.getElementById("modalBody").innerText="Изпратено е съобщение на имейл адреса с временна парола!";
        }
        else if(data=="too often")
        {
            document.getElementById("modalBody").innerText="Може да изпращате имейл адрес с временна парола само 1 път на 1 час!";
        }
        else if(data=="false") {
            document.getElementById("modalBody").innerText="Не съществува профил с такъв имейл адрес";
        }
        $("#modal").modal();
        
    }
    );});
    }
}
function changeEmail()//Post zaqvka za smqna na email adresa na potrebitel
{
    if(arguments.callee.caller === null) {console.log("%c You are not permitted to use this method!!!",  'color: red'); return;}
    var isEmail = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    if(!isEmail.test($("#newEmail").val()))
    {
        $('#newEmail').addClass("is-invalid");
    }
    else
    {
        $('#newEmail').removeClass("is-valid");
    postRequest("/auth/changeEmail",
    {
        newEmail: $("#newEmail").val(),
    }).then(data=>
    {
        if(data=="true") 
        {
            document.getElementById("modalBody").innerText="Имейл адресът е сменен успешно! Сега автоматчно ще излезете от профила си! Моля проверете новия си имейл адрес и го потвърдете!";
            actionOnCloseModal = logout;
        }
        else if(data=="emailExists") {
            document.getElementById("modalBody").innerText="Вече съществува потребител с този имейл адрес!";
        }
        $("#modal").modal();
        
    }
    );
    }
}
window.mobileCheck = function() {
    if(arguments.callee.caller === null) {console.log("%c You are not permitted to use this method!!!",  'color: red'); return;}
    let check = false;
    (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
    if(navigator.maxTouchPoints <= 1) check = false;
    return check;
  };
function loginFirmSubmit()//Post zaqvka za login na firma
{
    if(arguments.callee.caller === null) {console.log("%c You are not permitted to use this method!!!",  'color: red'); return;}
    getServerDate().then(dateServer =>{
    postRequest("/firm/loginFirm",
    {
        eik: $("#eik").val(),
        password: $("#password").val(),
        key: algorithm(),
        offset: dateServer["offset"]
    }).then(data=>
    {
        if(data=="true")
        { 
            if($("#rememberMe").prop('checked') == true)
            {
                rememberMe($("#eik").val(), $("#password").val(), "Firm");
            }
            document.getElementById("modalBody").innerText="Успешно  влязохте в профила си!";
            actionOnCloseModal = refreshPage;
        }
        else if(data=="notVerified") document.getElementById("modalBody").innerText="Моля проверете имейла си и потвърдете профила!";
        else if(data=="notModerationVerified") document.getElementById("modalBody").innerText="Фирмата все още не е преминала одобрение от модераторите! Обикновено това отнема няколко дни!";
        else document.getElementById("modalBody").innerText="Неправилна парола или ЕИК!";
        $("#modal").modal();
        
    }
    );
    });
    return false;
}
function check_eik(eik_str)//Proverka dali EIK e validen
{
    if(arguments.callee.caller === null) {console.log("%c You are not permitted to use this method!!!",  'color: red'); return;}
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
    if(arguments.callee.caller === null) {console.log("%c You are not permitted to use this method!!!",  'color: red'); return;}
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
        getServerDate().then( dateServer =>{
        postRequest("/firm/registerFirm",
        {
            firmName: $("#firmName").val(),
            eik: $("#eik").val(),
            city: $("#city").val(),
            address: $("#address").val(),
            email: $("#email").val(),
            password: $("#password").val(),
            phoneNumber: $("#phoneNumber").val(),
            key: algorithm(),
            offset: dateServer["offset"]
        }).then(data=>
        {
            if(data=="true") document.getElementById("modalBody").innerText="Вие се регистрирахте успешно!";
            else document.getElementById("modalBody").innerText="Вече съществува профил с този имейл адрес!";
            $("#modal").modal();
        }
        );
        });
    }
        return false;
}
function registerSubmit()//Post zaqvka za registrirane na klient
{
    if(arguments.callee.caller === null) {console.log("%c You are not permitted to use this method!!!",  'color: red'); return;}
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
        getServerDate().then( dateServer =>{
        postRequest("/auth/registerUser",
        {
            fName: $("#fName").val(),
            lName: $("#lName").val(),
            email: $("#email").val(),
            password: $("#password").val(),
            phoneNumber: $("#phoneNumber").val(),
            key: algorithm(),
            offset: dateServer["offset"]
        }).then(data=>{
            if(data=="true") document.getElementById("modalBody").innerText="Вие се регистрирахте успешно!";
            else document.getElementById("modalBody").innerText="Вече съществува профил с този имейл адрес!";
            $("#modal").modal();
        }
        );
        });
    }
        return false;
}
function getProfile()//Get zaqvka za vzemane na informaciqta ot profila na klient
{
    if(arguments.callee.caller === null) {console.log("%c You are not permitted to use this method!!!",  'color: red'); return;}
    getRequest("/auth/profile").then(data=>
        {
        var json = data;
        document.getElementById("fName").value = json["fName"];
        document.getElementById("lName").value = json["lName"];
        document.getElementById("phoneNumber").value = json["telephone"];
        document.getElementById("role").innerHTML = `<span class="font-weight-bold">Роля: </span>` + userRole[json["role"]];
      });
}
function getProfileFirm()//Get zaqvka za vzemane na inforamciqta ot profila na firma
{
    if(arguments.callee.caller === null) {console.log("%c You are not permitted to use this method!!!",  'color: red'); return;}
    getRequest("/firm/profile").then(data=>{
        var json = data;
        document.getElementById("firmName").innerText = json["firmName"];
        document.getElementById("eik").innerText = json["eik"];
        document.getElementById("address").innerText = json["city"] + ", " + json["address"];
      });
}
function changePassword()//Post zaqvka za smqna na parola na potrebitel
{
    if(arguments.callee.caller === null) {console.log("%c You are not permitted to use this method!!!",  'color: red'); return;}
    var hasNumber = /\d/;
    var isChecked = true;
    $('#oldPass').removeClass("is-invalid");
    $('#newPass').removeClass("is-invalid");
    $('#newPassConfirm').removeClass("is-invalid");
    if($("#oldPass").val().length < 8)
    {
        $('#oldPass').addClass("is-invalid");
        isChecked = false;
    }
    else
    {
        $('#oldPass').addClass("is-valid");
    }
    if($("#newPass").val().length < 8 && !hasNumber.test($("#newPass").val()))
    {
        $('#newPass').addClass("is-invalid");
        isChecked = false;
    }
    else
    {
        $('#newPass').addClass("is-valid");
    }
    if($("#newPassConfirm").val() != $("#newPass").val())
    {
        $('#newPassConfirm').addClass("is-invalid");
        isChecked = false;
    }
    else
    {
        $('#newPassConfirm').addClass("is-valid");
    }
    if(isChecked == true)
    {
    postRequest("/auth/changePassword",
        {
            oldPass: $("#oldPass").val(),
            newPass: $("#newPass").val()
        }).then(data=>{
            if(data=="true") document.getElementById("modalBody").innerText="Паролата е сменена успешно!";
            else document.getElementById("modalBody").innerText="Въвели сте грешна стара парола!";
            $("#modal").modal();
        }
        );
    }
}
function changePasswordFirm()//Post zaqvka za smqna na parola na firma
{
    if(arguments.callee.caller === null) {console.log("%c You are not permitted to use this method!!!",  'color: red'); return;}
    var hasNumber = /\d/;
    var isChecked = true;
    $('#oldPass').removeClass("is-invalid");
    $('#newPass').removeClass("is-invalid");
    $('#newPassConfirm').removeClass("is-invalid");
    if($("#oldPass").val().length < 8)
    {
        $('#oldPass').addClass("is-invalid");
        isChecked = false;
    }
    else
    {
        $('#oldPass').addClass("is-valid");
    }
    if($("#newPass").val().length < 8 && !hasNumber.test($("#newPass").val()))
    {
        $('#newPass').addClass("is-invalid");
        isChecked = false;
    }
    else
    {
        $('#newPass').addClass("is-valid");
    }
    if($("#newPassConfirm").val() != $("#newPass").val())
    {
        $('#newPassConfirm').addClass("is-invalid");
        isChecked = false;
    }
    else
    {
        $('#newPassConfirm').addClass("is-valid");
    }
    if(isChecked == true)
    {
    postRequest("/firm/changePassword",
        {
            oldPass: $("#oldPass").val(),
            newPass: $("#newPass").val()
        }).then(data=>{
            if(data=="true") document.getElementById("modalBody").innerText="Паролата е сменена успешно!";
            else document.getElementById("modalBody").innerText="Въвели сте грешна стара парола!";
            $("#modal").modal();
        }
        );
    }
}
function editProfile()//Post zaqvka za redaktirane na profil na klient
{
    if(arguments.callee.caller === null) {console.log("%c You are not permitted to use this method!!!",  'color: red'); return;}
    $("input").removeClass("is-invalid");
    var checked = true;
    var isDigit = /^\d+$/;
    if($("#fName").val().length < 3)
    {
        $("#fName").addClass("is-invalid");
        checked = false;
    }
    else
    {
        $("#fName").addClass("is-valid");
    }
    if($("#lName").val().length < 3)
    {
        $("#lName").addClass("is-invalid");
        checked = false;
    }
    else
    {
        $("#lName").addClass("is-valid");
    }
    if($("#phoneNumber").val().length < 10 || $("#phoneNumber").val().charAt(0) != '0' || !isDigit.test($("#phoneNumber").val()))
    {
        $("#phoneNumber").addClass("is-invalid");
        checked = false;
    }
    else
    {
        $("#phoneNumber").addClass("is-valid");
    }
    if(checked)
    {
    postRequest("/auth/editUser",
        {
            fName: $("#fName").val(),
            lName:$("#lName").val(),
            phoneNumber: $("#phoneNumber").val()
        }).then(data=>{
                document.getElementById("modalBody").innerText="Профилът е редактиран успешно!";
                document.getElementById("fullNameNav").innerText = `${$("#fName").val()} ${$("#lName").val()}`;
                actionOnCloseModal = getProfile;
            $("#modal").modal();
        }
        );
    }
}
function addTaxiDriver()//Post zaqvka za dobavqne na taksimetrovi shofyori
{
    if(arguments.callee.caller === null) {console.log("%c You are not permitted to use this method!!!",  'color: red'); return;}
    var isEmail = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    if(!isEmail.test($("#emailDriver").val()))
    {
        $('#emailDriver').addClass("is-invalid");
    }
    else
    {
    postRequest("/firm/addTaxiDriver",
        {
            email: $("#emailDriver").val()
        }).then(data=>{
            if(data=="true")
            { 
                document.getElementById("modalBody").innerText="Успешено е добавен таксиметровият шофьор!";
                actionOnCloseModal = getTaxiDrivers;
            }
            else document.getElementById("modalBody").innerText="Не съществува профил с такъв имейл адрес!";
            $("#modal").modal();
        }
        );
    }
}
function removeSupportedCity(name, region)//Post zaqvka za premahvane na poddurjan grad
{
    if(arguments.callee.caller === null) {console.log("%c You are not permitted to use this method!!!",  'color: red'); return;}
    postRequest("/firm/removeSupportedCity",
        {
            city: name,
            region: region
        }).then(data=>{
            if(data=="true") document.getElementById("modalBody").innerText="Населеното място е премахнто успешно!";
            actionOnCloseModal = getSupportedCitiesByFirm;
            $("#modal").modal();
        }
        );
}
function removeTaxiDriver(email)//Post zaqvka za premahvane na taksimetrov shofyor
{
    if(arguments.callee.caller === null) {console.log("%c You are not permitted to use this method!!!",  'color: red'); return;}
    postRequest("/firm/removeTaxiDriver",
        {
            email: email
        }).then(data=>
        {
            if(data=="true") document.getElementById("modalBody").innerText="Шофьорът е премахнат успешно!";
            actionOnCloseModal = getTaxiDrivers;
            $("#modal").modal();
        }
        );
}
function getTaxiDrivers()//Get zaqvka za vzimane na taksimetrovi shofyori
{
    if(arguments.callee.caller === null) {console.log("%c You are not permitted to use this method!!!",  'color: red'); return;}
    getRequest("/firm/getTaxiDrivers").then(data=>{
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
    if(arguments.callee.caller === null) {console.log("%c You are not permitted to use this method!!!",  'color: red'); return;}
    window.location = "./logout";
}
//Povikvane na funkciq pri zatvarqne na modal
$('#modal').on('hidden.bs.modal', function () {
    if(actionOnCloseModal !== undefined) actionOnCloseModal();
    actionOnCloseModal = undefined;
  });

$( "#modal" ).on('shown.bs.modal', function(){
    setTimeout(()=>{
 $("#modal").modal('hide');
    }, 5000);
});
