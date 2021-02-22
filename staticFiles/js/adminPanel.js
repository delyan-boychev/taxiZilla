//Deklarirane na promenlivi i konstanti
var currentActiveTabId = "";
const userRole = Object.freeze({
    Admin: "Администратор",
    Moderator: "Модератор",
    Driver: "Шофьор",
    User: "Потребител",
    });
const tableText = {
    "language": {
        "sProcessing":     "Обработка на данни...",
        "sSearch":         "Търсене:",
        "sLengthMenu":     "Покажи _MENU_ потребители на страница",
        "sInfo":           "Показани са от _START_ до _END_ потребител от общо _TOTAL_ потребители",
        "sInfoEmpty":      "Показани са 0 потребители",
        "sInfoFiltered":   "(общ брой потребители - _MAX_)",
        "sInfoPostFix":    "",
        "sLoadingRecords": "Зареждане на данни...",
        "sZeroRecords":    "Няма намерени потребители!",
        "sEmptyTable":     "Няма потребители",
        "oPaginate": {
            "sPrevious":   "Предишна страница",
            "sNext":       "Следваща страница",
        }
    }
};
const tableTextFirm = {
    "language": {
        "sProcessing":     "Обработка на данни...",
        "sSearch":         "Търсене:",
        "sLengthMenu":     "Покажи _MENU_ фирми на страница",
        "sInfo":           "Показани са от _START_ до _END_ фирма от общо _TOTAL_ фирми",
        "sInfoEmpty":      "Показани са 0 фирми",
        "sInfoFiltered":   "(общ брой фирми - _MAX_)",
        "sInfoPostFix":    "",
        "sLoadingRecords": "Зареждане на данни...",
        "sZeroRecords":    "Няма намерени фирми!",
        "sEmptyTable":     "Няма фирми",
        "oPaginate": {
            "sPrevious":   "Предишна страница",
            "sNext":       "Следваща страница",
        }
    }
};
const tableTextOrder = {
    "language": {
        "sProcessing":     "Обработка на данни...",
        "sSearch":         "Търсене:",
        "sLengthMenu":     "Покажи _MENU_ поръчки на страница",
        "sInfo":           "Показани са от _START_ до _END_ поръчка от общо _TOTAL_ поръчки",
        "sInfoEmpty":      "Показани са 0 фирми",
        "sInfoFiltered":   "(общ брой поръчки - _MAX_)",
        "sInfoPostFix":    "",
        "sLoadingRecords": "Зареждане на данни...",
        "sZeroRecords":    "Няма намерени поръчки!",
        "sEmptyTable":     "Няма поръчки",
        "oPaginate": {
            "sPrevious":   "Предишна страница",
            "sNext":       "Следваща страница",
        }
    }
};
function getAllUsersForRemoveTable()//Injectvane na potrebiteli v tablica za premahvane na potrebiteli
{
    if(arguments.callee.caller === null) {console.log("%c You are not permitted to use this method!!!",  'color: red'); return;}
    getRequest("/auth/getAllUsers").then(json=>
    {
        json.forEach(el => {
            if(el["email"] != profileInfo["email"] && el["role"] != "Admin")
            {
            var firmId = "Няма";
            var verified = "";
            if(el["verified"] == 1) verified = "Да";
            else verified = "Не";
            if(el["firmId"] != null) firmId = el["firmId"];
            document.getElementById("bodyTable").innerHTML += `<tr><td>${el["id"]}</td><td>${el["fName"]}</td><td>${el["lName"]}</td><td>${el["email"]}</td><td>${el["telephone"]}</td><td>${userRole[el["role"]]}</td><td>${firmId}</td><td>${verified}</td><td class="text-danger h5"><i class='far fa-times-circle' style='cursor: pointer;' onclick='removeUserShowModal("${el["id"]}");'></i></td></tr>`
            }
        });
        $('#userRemoveDt').DataTable(tableText);
        $('.dataTables_length').addClass('bs-select');
    });
    

}
function getAllUsersForActivateUserTable()//Injectvane na potrebiteli v tablica za aktivirane na akaunti na potrebiteli
{
    if(arguments.callee.caller === null) {console.log("%c You are not permitted to use this method!!!",  'color: red'); return;}
    getRequest("/auth/getAllUsers").then(json=>
    {
        json.forEach(el => {
            if(el["email"] != profileInfo["email"])
            {
                if(el["verified"] == 0)
                {
                var firmId = "Няма";
                if(el["firmId"] != null) firmId = el["firmId"];
                document.getElementById("bodyTable").innerHTML += `<tr><td>${el["id"]}</td><td>${el["fName"]}</td><td>${el["lName"]}</td><td>${el["email"]}</td><td>${el["telephone"]}</td><td>${userRole[el["role"]]}</td><td>${firmId}</td><td>Не</td><td class="text-danger h5"><i class='far fa-check-square text-success' style='cursor: pointer;' onclick='activateUserShowModal("${el["id"]}");'></i></td></tr>`
                }
            }
        });
        $('#userActivateDt').DataTable(tableText);
        $('.dataTables_length').addClass('bs-select');
    });
    

}
function getAllUsersForEditTable()//Injectvane na potrebiteli v tablica za redkatirane na potrebiteli
{
    if(arguments.callee.caller === null) {console.log("%c You are not permitted to use this method!!!",  'color: red'); return;}
    getRequest("/auth/getAllUsers").then(json=>
    {
        json.forEach(el => {
            if(el["email"] != profileInfo["email"])
            {
            var verified = "";
            var firmId = "Няма";
            if(el["firmId"] != null) firmId = el["firmId"];
            if(el["verified"] == 1) verified = "Да";
            else verified = "Не";
            document.getElementById("bodyTable").innerHTML += `<tr><td>${el["id"]}</td><td>${el["fName"]}</td><td>${el["lName"]}</td><td>${el["email"]}</td><td>${el["telephone"]}</td><td>${userRole[el["role"]]}</td><td>${firmId}</td><td>${verified}</td><td class="text-secondary h5"><i class='far fa-edit' style='cursor: pointer;' onclick='editUserShowModal("${el["id"]}", "${escapeQuotes(el["fName"])}", "${escapeQuotes(el["lName"])}", "${escapeQuotes(el["email"])}", "${escapeQuotes(el["telephone"])}");'></i></td></tr>`
            }
        });
        $('#userEditDt').DataTable(tableText);
        $('.dataTables_length').addClass('bs-select');
    });
    

}
function getAllUsersForChangeRoleTable()//Injectvane na potrebiteli v tablica za smqna rolq na potrebiteli
{
    if(arguments.callee.caller === null) {console.log("%c You are not permitted to use this method!!!",  'color: red'); return;}
    getRequest("/auth/getAllUsers").then(json=>
    {
        json.forEach(el => {
            if(el["email"] != profileInfo["email"])
            {
            var verified = "";
            var firmId = "Няма";
            if(el["firmId"] != null) firmId = el["firmId"];
            if(el["verified"] == 1) verified = "Да";
            else verified = "Не";
            document.getElementById("bodyTable").innerHTML += `<tr><td>${el["id"]}</td><td>${el["fName"]}</td><td>${el["lName"]}</td><td>${el["email"]}</td><td>${el["telephone"]}</td><td>${userRole[el["role"]]}</td><td>${firmId}</td><td>${verified}</td><td class="text-secondary h5"><i class='fas fa-tag' style='cursor: pointer;' onclick='changeUserRoleShowModal("${el["id"]}");'></i></td></tr>`
            }
        });
        $('#userChangeRoleDt').DataTable(tableText);
        $('.dataTables_length').addClass('bs-select');
    });
    

}
function getAllFirmsForRemoveFirmTable()//Injectvane na firmi v tablica za premahvane na firmi
{
    if(arguments.callee.caller === null) {console.log("%c You are not permitted to use this method!!!",  'color: red'); return;}
    getRequest("/firm/getAllFirms").then(json=>
    {
        json.forEach(el => {
            if(el["email"] != profileInfo["email"])
            {
            var verified = "";
            if(el["verified"] == 1) verified = "Да";
            else verified = "Не";
            var modVerified = "";
            if(el["moderationVerified"] == 1) modVerified = "Да";
            else modVerified = "Не";
            document.getElementById("bodyTable").innerHTML += `<tr><td>${el["id"]}</td><td>${el["firmName"]}</td><td>${el["eik"]}</td><td>${el["city"]}</td><td>${el["address"]}</td><td>${el["email"]}</td><td>${el["phoneNumber"]}</td><td>${verified}</td><td>${modVerified}</td><td class="text-secondary h5"><i class='far fa-times-circle text-danger' style='cursor: pointer;' onclick='removeFirmShowModal("${el["id"]}");'></i></td></tr>`
            }
        });
        $('#firmRemoveDt').DataTable(tableTextFirm);
        $('.dataTables_length').addClass('bs-select');
    });
    

}
function getAllFirmsForEditFirmTabTable()//Injectvane na firmi v tablica za redaktirane na firmi
{
    if(arguments.callee.caller === null) {console.log("%c You are not permitted to use this method!!!",  'color: red'); return;}
    getRequest("/firm/getAllFirms").then(json=>
    {
        json.forEach(el => {
            if(el["email"] != profileInfo["email"])
            {
            var verified = "";
            if(el["verified"] == 1) verified = "Да";
            else verified = "Не";
            var modVerified = "";
            if(el["moderationVerified"] == 1) modVerified = "Да";
            else modVerified = "Не";
            document.getElementById("bodyTable").innerHTML += `<tr><td>${el["id"]}</td><td>${el["firmName"]}</td><td>${el["eik"]}</td><td>${el["city"]}</td><td>${el["address"]}</td><td>${el["email"]}</td><td>${el["phoneNumber"]}</td><td>${verified}</td><td>${modVerified}</td><td class="text-secondary h5"><i class='far fa-edit' style='cursor: pointer;' onclick='editFirmShowModal("${el["id"]}", "${escapeQuotes(el["firmName"])}", "${el["eik"]}", "${escapeQuotes(el["city"])}", "${escapeQuotes(el["address"])}", "${escapeQuotes(el["email"])}", "${escapeQuotes(el["phoneNumber"])}");'></i></td></tr>`
            }
        });
        $('#firmEditDt').DataTable(tableTextFirm);
        $('.dataTables_length').addClass('bs-select');
    });
}
function getAllFirmsForModerationVerifyFirmTable()//Injectvane na firmi v tablica za odobrqvane na firmi
{
    if(arguments.callee.caller === null) {console.log("%c You are not permitted to use this method!!!",  'color: red'); return;}
    getRequest("/firm/getAllFirms").then(json=>
    {
        json.forEach(el => {
            if(el["email"] != profileInfo["email"])
            {
                if(el["moderationVerified"] == 0)
                {
            var verified = "";
            if(el["verified"] == 1) verified = "Да";
            else verified = "Не";
            document.getElementById("bodyTable").innerHTML += `<tr><td>${el["id"]}</td><td>${el["firmName"]}</td><td>${el["eik"]}</td><td>${el["city"]}</td><td>${el["address"]}</td><td>${el["email"]}</td><td>${el["phoneNumber"]}</td><td>${verified}</td><td>Не</td><td class="text-secondary h5"><i class='far fa-check-square text-success' style='cursor: pointer;' onclick='firmModerationVerifyShowModal("${el["id"]}");'></i></td></tr>`
            }
        }
        });
        $('#firmModerationVerifyDt').DataTable(tableTextFirm);
        $('.dataTables_length').addClass('bs-select');
    });
    

}
function getAllUsersForAddDriverTabTable()//Injectvane na potrebitel v tablica za dobavqne na shofyori
{
    if(arguments.callee.caller === null) {console.log("%c You are not permitted to use this method!!!",  'color: red'); return;}
    getRequest("/auth/getAllUsers").then(json=>
    {
        json.forEach(el => {
            if(el["email"] != profileInfo["email"])
            {
                if(el["role"] ==  "User" )
                {
                    var verified = "";
                    var firmId = "Няма";
                    if(el["firmId"] != null) firmId = el["firmId"];
                    if(el["verified"] == 1) verified = "Да";
                    else verified = "Не";
                    document.getElementById("bodyTable").innerHTML += `<tr><td>${el["id"]}</td><td>${el["fName"]}</td><td>${el["lName"]}</td><td>${el["email"]}</td><td>${el["telephone"]}</td><td>${userRole[el["role"]]}</td><td>${firmId}</td><td>${verified}</td><td class="text-secondary h5"><i class='fas fa-plus text-success' style='cursor: pointer;' onclick='addTaxiDriverShowModal("${el["id"]}");'></i></td></tr>`
                }
            }
        });
        $('#addDriverDt').DataTable(tableText);
        $('.dataTables_length').addClass('bs-select');
    });
}
function getAllFirmsForAddDrivers()//Injektvane na firmi v select tag za dobavqne na taksimetrovi shofyori
{
    if(arguments.callee.caller === null) {console.log("%c You are not permitted to use this method!!!",  'color: red'); return;}
    getRequest("/firm/getAllFirms").then(json=>
    {
        json.forEach(el => {
            document.getElementById("allFirmsForAddDriver").innerHTML += `<option value="${el["id"]}">${el["firmName"]}</option>`

        });
    });
}
function getAllOrdersForListAndRemove()//Injektvane na poruchki v tablica za premahvane i razgledjdane na poruchki
{
    if(arguments.callee.caller === null) {console.log("%c You are not permitted to use this method!!!",  'color: red'); return;}
    getRequest("/order/getAllOrders").then(json=>
    {
        json.forEach(order => {
            var driverId = "Няма";
            var listOrder = "Няма";
            var notes = "Няма";
            if(order["driverId"] != null) driverId = order["driverId"];
            if(order["notes"] != "") notes = order["notes"];
            if(order["items"] != "") listOrder = order["items"];
            document.getElementById("bodyTable").innerHTML += `<tr><td>${order["id"]}</td><td>${order["address"]}</td><td>${order["y"]}</td><td>${order["x"]}</td><td>${driverId}</td><td>${order["userId"]}</td><td>${listOrder}</td><td>${notes}</td><td>${order["date"]}</td><td>${order["ip"]}</td><td>${orderStatus[order["orderStatus"]]}</td><td class="text-danger h5"><i class='far fa-times-circle' style='cursor: pointer;' onclick='removeOrderShowModal("${order["id"]}");'></i></td></tr>`;
        });
        $('#allOrdersDt').DataTable(tableTextOrder);
        $('.dataTables_length').addClass('bs-select');
    });

}
function changeRoleUser(id)//Smqna rolq na potrebitel po id
{
    if(arguments.callee.caller === null) {console.log("%c You are not permitted to use this method!!!",  'color: red'); return;}
    $("#modalAdmin").modal('hide');
    postRequest("/auth/changeUserRoleByAdmin", 
    {
        userid: id,
        role: $("#newRole").val(),
    }).then(data=>
    {
        document.getElementById("modalBody").innerText = `Успешно е сменена ролята на потребител с ID-${id}!`;
        actionOnCloseModal = userChangeRoleTab;
        $("#modal").modal();
    }
    );
}
function activateUser(id)//Aktivirane na potrebitel po id
{
    if(arguments.callee.caller === null) {console.log("%c You are not permitted to use this method!!!",  'color: red'); return;}
    $("#modalAdmin").modal('hide');
    postRequest("/auth/activateUserByAdmin", 
        {
            userid: id,
        }).then(data=>
        {
            document.getElementById("modalBody").innerText = `Профилът на потребител с ID-${id} е активиран успешно!`;
            actionOnCloseModal = userActivateTab;
            $("#modal").modal();
        }
        );
}
function editUser(id)//Redaktirane na potrebitel po id
{
    if(arguments.callee.caller === null) {console.log("%c You are not permitted to use this method!!!",  'color: red'); return;}
    $("input").removeClass("is-invalid");
    var isChecked = true;
    var isDigit = /^\d+$/;
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
    if($("#phoneNumber").val().length < 10 || $("#phoneNumber").val().charAt(0) != '0' || !isDigit.test($("#phoneNumber").val()))
    {
        $('#phoneNumber').addClass("is-invalid");
        isChecked = false;
    }
    else $('#phoneNumber').addClass("is-valid");
    if(isChecked)
    {
        $("#modalAdmin").modal('hide');
        postRequest("/auth/editUserByAdmin", 
        {
            userid: id,
            fName: $("#fName").val(),
            lName: $("#lName").val(),
            email: $("#email").val(),
            phoneNumber: $("#phoneNumber").val(),
        }).then(data=>
        {
            document.getElementById("modalBody").innerText = `Успешно е редактиран потребител с ID-${id}!`;
            actionOnCloseModal = userEditTab;
            $("#modal").modal();
        }
        );
    }
}
function addTaxiDriverByAdmin(id)
{
    $("#modalAdmin").modal('hide');
        postRequest("/firm/addTaxiDriverByAdmin", 
        {
            firmID: $("#allFirmsForAddDriver").val(),
            userID: id,
        }).then(data=>
        {
            document.getElementById("modalBody").innerText = `Успешно е добавен таксиметров шофьор с ID-${id} към фирма с име-${document.getElementById("allFirmsForAddDriver").options[document.getElementById("allFirmsForAddDriver").selectedIndex].text}!`;
            actionOnCloseModal = addDriverTab;
            $("#modal").modal();
        }
        );
}
function activateUserShowModal(id)//Pokazvane na modal za aktivirane na potrebitel
{
    if(arguments.callee.caller === null) {console.log("%c You are not permitted to use this method!!!",  'color: red'); return;}
    document.getElementById("modalAdminLabel").innerText = `Активация профил на потребител`;
    document.getElementById("modalAdminBody").innerHTML =  `Сигурни ли сте, че искате да активирате профила на потребител с ID-${id}?`;
    document.getElementById("modalAdminButton").onclick = function() {activateUser(id);};
    $("#modalAdmin").modal();
}
function changeUserRoleShowModal(id)//Pokazvane na modal za smqna rolq na potrebitel
{
    if(arguments.callee.caller === null) {console.log("%c You are not permitted to use this method!!!",  'color: red'); return;}
    document.getElementById("modalAdminLabel").innerText = `Смяна роля на потребителя`;
    document.getElementById("modalAdminBody").innerHTML =  `<div class="d-flex justify-content-between "><label class="text-center w-100" for="newRole">Нова роля: </label><select name="newRole" id="newRole" class="form-control"> <option value="Admin">Администратор</option> <option value="Moderator">Модератор</option> <option value="User">Потребител</option></select></div>`;
    document.getElementById("modalAdminButton").onclick = function() {changeRoleUser(id);};
    $("#modalAdmin").modal();
}
function editUserShowModal(id, fName, lName, email, phoneNumber)//Pokazvane na modal za redaktirane na potrebitel
{
    if(arguments.callee.caller === null) {console.log("%c You are not permitted to use this method!!!",  'color: red'); return;}
    document.getElementById("modalAdminLabel").innerText = `Редактиране на потребител`;
    document.getElementById("modalAdminBody").innerHTML =  `<div class="form-group"><input type="text" class="form-control" id="fName"  placeholder="Име"> </div> <div class="form-group"> <input type="text" class="form-control" id="lName" placeholder="Фамилия"> </div> <div class="form-group"><input type="email" class="form-control" id="email" placeholder="Имейл"></div> <div class="form-group"><input type="text" class="form-control" id="phoneNumber" placeholder="Телефонен номер"> </div> <div class="form-group"></div>`;
    document.getElementById("fName").value = fName;
    document.getElementById("lName").value = lName;
    document.getElementById("email").value = email;
    document.getElementById("phoneNumber").value = phoneNumber;
    document.getElementById("modalAdminButton").onclick = function() {editUser(id);};
    $("#modalAdmin").modal();
}
function removeUserShowModal(id)//Pokazvane na modal za premahvane na potrebitel
{
    if(arguments.callee.caller === null) {console.log("%c You are not permitted to use this method!!!",  'color: red'); return;}
    document.getElementById("modalAdminLabel").innerText = `Премахване на потребител`;
    document.getElementById("modalAdminBody").innerText = `Сигурни ли сте, че искате да премахнете потребител с ID-${id}?`;
    document.getElementById("modalAdminButton").onclick = function() {removeUser(id);};
    $("#modalAdmin").modal();
}
function removeFirmShowModal(id)//Pokazvane na modal za premahvane na firma
{
    if(arguments.callee.caller === null) {console.log("%c You are not permitted to use this method!!!",  'color: red'); return;}
    document.getElementById("modalAdminLabel").innerText = `Премахване на фирма`;
    document.getElementById("modalAdminBody").innerText = `Сигурни ли сте, че искате да премахнете фирма с ID-${id}?`;
    document.getElementById("modalAdminButton").onclick = function() {removeFirm(id);};
    $("#modalAdmin").modal();
}
function firmModerationVerifyShowModal(id)//Pokazvane na modal za odobrqvane na firma
{
    if(arguments.callee.caller === null) {console.log("%c You are not permitted to use this method!!!",  'color: red'); return;}
    document.getElementById("modalAdminLabel").innerText = `Одобряване на фирма`;
    document.getElementById("modalAdminBody").innerText = `Сигурни ли сте, че искате да одобрите фирма с ID-${id}?`;
    document.getElementById("modalAdminButton").onclick = function() {moderationVerifyFirm(id);};
    $("#modalAdmin").modal()
}
function addTaxiDriverShowModal(id)//Pokazvane na modal za dobavqne na shofyori
{
    if(arguments.callee.caller === null) {console.log("%c You are not permitted to use this method!!!",  'color: red'); return;}
    document.getElementById("modalAdminLabel").innerText = `Добавяне на шофьор`;
    document.getElementById("modalAdminBody").innerHTML = `<p class="text-center">Към коя фирма искате да добавите шофьор с ID-${id}?</p><select id="allFirmsForAddDriver" class="form-control"></select>`;
    getAllFirmsForAddDrivers();
    document.getElementById("modalAdminButton").onclick = function() {addTaxiDriverByAdmin(id);};
    $("#modalAdmin").modal()
}
function removeOrderShowModal(id)//Pokazvane na modal za iztrivane na poruchka
{
    if(arguments.callee.caller === null) {console.log("%c You are not permitted to use this method!!!",  'color: red'); return;}
    document.getElementById("modalAdminLabel").innerText = `Премахване на поръчка`;
    document.getElementById("modalAdminBody").innerText = `Сигурни ли сте, че искате да премахнете поръчка с ID-${id}?`;
    document.getElementById("modalAdminButton").onclick = function() {removeOrder(id);};
    $("#modalAdmin").modal()
}
function removeOrder(id)//Premahvane na poruchka po id
{
    if(arguments.callee.caller === null) {console.log("%c You are not permitted to use this method!!!",  'color: red'); return;}
    $("#modalAdmin").modal('hide');
    postRequest("/order/removeOrder", 
    {
        orderId: id,
    }).then(data=>
    {
        document.getElementById("modalBody").innerText = `Успешно е премахната поръчка с ID-${id}!`;
        actionOnCloseModal = orderListAndRemoveTab;
        $("#modal").modal();
    }
    );
}
function removeUser(id)//Premahvane na potrebitel po id
{
    if(arguments.callee.caller === null) {console.log("%c You are not permitted to use this method!!!",  'color: red'); return;}
    $("#modalAdmin").modal('hide');
    postRequest("/auth/removeUserByAdmin", 
    {
        userid: id,
    }).then(data=>
    {
        document.getElementById("modalBody").innerText = `Успешно е премахнат потребител с ID-${id}!`;
        actionOnCloseModal = userRemoveTab;
        $("#modal").modal();
    }
    );
}
function removeFirm(id)//Premahvane na firma po id
{
    if(arguments.callee.caller === null) {console.log("%c You are not permitted to use this method!!!",  'color: red'); return;}
    $("#modalAdmin").modal('hide');
    postRequest("/firm/removeFirmByAdmin", 
    {
        firmID: id,
    }).then(data=>
    {
        document.getElementById("modalBody").innerText = `Успешно е премахната фирма с ID-${id}!`;
        actionOnCloseModal = firmRemoveTab;
        $("#modal").modal();
    }
    );

}
function editFirm(id)//Redaktirane na firma po id
{
    if(arguments.callee.caller === null) {console.log("%c You are not permitted to use this method!!!",  'color: red'); return;}
    $("input").removeClass("is-invalid");
    var isChecked = true;
    var isDigit = /^\d+$/;
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
    if($("#phoneNumber").val().length < 10 || $("#phoneNumber").val().charAt(0) != '0' || !isDigit.test($("#phoneNumber").val()))
    {
        $('#phoneNumber').addClass("is-invalid");
        isChecked = false;
    }
    else $('#phoneNumber').addClass("is-valid");
    if(isChecked == true)
    {
        $("#modalAdmin").modal('hide');
        postRequest("/firm/editFirmByAdmin",
        {
            firmID: id,
            firmName: $("#firmName").val(),
            eik: $("#eik").val(),
            city: $("#city").val(),
            address: $("#address").val(),
            email: $("#email").val(),
            phoneNumber: $("#phoneNumber").val()
        }).then(data=>
        {
            document.getElementById("modalBody").innerText=`Фирма с ID-${id} е редактирана успешно!`;
            actionOnCloseModal = firmEditTab;
            $("#modal").modal();
        }
        );
    }
}
function moderationVerifyFirm(id)//Odobrqvane na firma po id
{
    if(arguments.callee.caller === null) {console.log("%c You are not permitted to use this method!!!",  'color: red'); return;}
    $("#modalAdmin").modal('hide');
    postRequest("/firm/moderationVerifyFirm", 
    {
         firmID: id,
    }).then(data=>
    {
        document.getElementById("modalBody").innerText = `Успешно е одобрена фирма с ID-${id}!`;
        actionOnCloseModal = moderationVerifyFirmTab;
        $("#modal").modal();
    }
    );
}
function editFirmShowModal(id, firmName, eik, city, address, email, phoneNumber)//Pokazvane na modal za redaktirane na firma
{
    if(arguments.callee.caller === null) {console.log("%c You are not permitted to use this method!!!",  'color: red'); return;}
    document.getElementById("modalAdminLabel").innerText = `Редактиране на фирма`;
    document.getElementById("modalAdminBody").innerHTML =  `<div class="form-group"><input type="text" class="form-control" id="firmName"  placeholder="Име на фирма"> </div> <div class="form-group"> <input type="text" class="form-control" id="eik" placeholder="ЕИК"> </div> <div class="form-group"><input type="text" class="form-control" id="city" placeholder="Град седалище на фирма"></div><div class="form-group"><input type="text" class="form-control" id="address" placeholder="Адрес на седалището на фирма"></div><div class="form-group"><input type="email" class="form-control" id="email" placeholder="Имейл"></div> <div class="form-group"><input type="text" class="form-control" id="phoneNumber" placeholder="Телефонен номер"> </div> <div class="form-group"></div>`;
    document.getElementById("firmName").value = firmName;
    document.getElementById("eik").value = eik;
    document.getElementById("email").value = email;
    document.getElementById("city").value = city;
    document.getElementById("address").value = address;
    document.getElementById("phoneNumber").value = phoneNumber;
    document.getElementById("modalAdminButton").onclick = function() {editFirm(id);};
    $("#modalAdmin").modal();
}
function userRemoveTab()//Tab za premahvane na potrebiteli
{
    if(arguments.callee.caller === null) {console.log("%c You are not permitted to use this method!!!",  'color: red'); return;}
    if(currentActiveTabId != "") 
    {
        document.getElementById(currentActiveTabId).classList.remove("active");
    }
    currentActiveTabId = "userRemoveTab";
    document.getElementById(currentActiveTabId).classList.add("active");
    getRequest(window.location.protocol+'//'+ window.location.host +'/adminPanelTabs/userRemoveTab.html').then(data=>{
        document.getElementById("tabContent").innerHTML = data;
        getAllUsersForRemoveTable();  
            });

}
function userEditTab()//Tab za redaktirane na potrebiteli
{
    if(arguments.callee.caller === null) {console.log("%c You are not permitted to use this method!!!",  'color: red'); return;}
    if(currentActiveTabId != "") 
    {
        document.getElementById(currentActiveTabId).classList.remove("active");
    }
    currentActiveTabId = "userEditTab";
    document.getElementById(currentActiveTabId).classList.add("active");
    getRequest(window.location.protocol+'//'+ window.location.host +'/adminPanelTabs/userEditTab.html').then(data=>{
        document.getElementById("tabContent").innerHTML = data;
        getAllUsersForEditTable();
});
}
function userActivateTab()//Tab za aktivirane na potrebiteli
{
    if(arguments.callee.caller === null) {console.log("%c You are not permitted to use this method!!!",  'color: red'); return;}
    if(currentActiveTabId != "") 
    {
        document.getElementById(currentActiveTabId).classList.remove("active");
    }
    currentActiveTabId = "userActivateTab";
    document.getElementById(currentActiveTabId).classList.add("active");
    getRequest(window.location.protocol+'//'+ window.location.host +'/adminPanelTabs/userActivateTab.html').then(data=>{
        document.getElementById("tabContent").innerHTML = data;
        getAllUsersForActivateUserTable();
});
}
function userChangeRoleTab()//Tab za smqna rolq na potrebiteli
{
    if(arguments.callee.caller === null) {console.log("%c You are not permitted to use this method!!!",  'color: red'); return;}
    if(currentActiveTabId != "") 
    {
        document.getElementById(currentActiveTabId).classList.remove("active");
    }
    currentActiveTabId = "userChangeRoleTab";
    document.getElementById(currentActiveTabId).classList.add("active");
    getRequest(window.location.protocol+'//'+ window.location.host +'/adminPanelTabs/userChangeRoleTab.html').then(data=>{
        document.getElementById("tabContent").innerHTML = data;
        getAllUsersForChangeRoleTable();
});
}
function firmRemoveTab()//Tab za premahvane na firmi
{
    if(arguments.callee.caller === null) {console.log("%c You are not permitted to use this method!!!",  'color: red'); return;}
    if(currentActiveTabId != "") 
    {
        document.getElementById(currentActiveTabId).classList.remove("active");
    }
    currentActiveTabId = "firmRemoveTab";
    document.getElementById(currentActiveTabId).classList.add("active");
    getRequest(window.location.protocol+'//'+ window.location.host +'/adminPanelTabs/firmRemoveTab.html').then(data=>{
        document.getElementById("tabContent").innerHTML = data;
        getAllFirmsForRemoveFirmTable();
});

}
function moderationVerifyFirmTab()//Tab za odobrqvane na firmi
{
    if(arguments.callee.caller === null) {console.log("%c You are not permitted to use this method!!!",  'color: red'); return;}
    if(currentActiveTabId != "") 
    {
        document.getElementById(currentActiveTabId).classList.remove("active");
    }
    currentActiveTabId = "moderationVerifyFirmTab";
    document.getElementById(currentActiveTabId).classList.add("active");
    getRequest(window.location.protocol+'//'+ window.location.host +'/adminPanelTabs/moderationVerifyFirmTab.html').then(data=>{
        document.getElementById("tabContent").innerHTML = data;
        getAllFirmsForModerationVerifyFirmTable();
});

}
function addDriverTab()//Tab za dobavqne na shofyori
{
    if(arguments.callee.caller === null) {console.log("%c You are not permitted to use this method!!!",  'color: red'); return;}
    if(currentActiveTabId != "") 
    {
        document.getElementById(currentActiveTabId).classList.remove("active");
    }
    currentActiveTabId = "addDriverTab";
    document.getElementById(currentActiveTabId).classList.add("active");
    getRequest(window.location.protocol+'//'+ window.location.host +'/adminPanelTabs/addDriverTab.html').then(data=>{
        document.getElementById("tabContent").innerHTML = data;
        getAllUsersForAddDriverTabTable();
    });
}
function firmEditTab()
{
    if(arguments.callee.caller === null) {console.log("%c You are not permitted to use this method!!!",  'color: red'); return;}
    if(currentActiveTabId != "") 
    {
        document.getElementById(currentActiveTabId).classList.remove("active");
    }
    currentActiveTabId = "firmEditTab";
    document.getElementById(currentActiveTabId).classList.add("active");
    getRequest(window.location.protocol+'//'+ window.location.host +'/adminPanelTabs/firmEditTab.html').then(data=>{
        document.getElementById("tabContent").innerHTML = data;
        getAllFirmsForEditFirmTabTable();
    });
}
function addRemoveSupportedCityTab()
{
    if(arguments.callee.caller === null) {console.log("%c You are not permitted to use this method!!!",  'color: red'); return;}
    if(currentActiveTabId != "") 
    {
        document.getElementById(currentActiveTabId).classList.remove("active");
    }
    currentActiveTabId = "addRemoveSupportedCityTab";
    document.getElementById(currentActiveTabId).classList.add("active");
    getRequest(window.location.protocol+'//'+ window.location.host +'/adminPanelTabs/addRemoveSupportedCityTab.html').then(data=>{
        document.getElementById("tabContent").innerHTML = data;
    });
}
function orderListAndRemoveTab()
{
    if(arguments.callee.caller === null) {console.log("%c You are not permitted to use this method!!!",  'color: red'); return;}
    if(currentActiveTabId != "") 
    {
        document.getElementById(currentActiveTabId).classList.remove("active");
    }
    currentActiveTabId = "orderListAndRemoveTab";
    document.getElementById(currentActiveTabId).classList.add("active");
    getRequest(window.location.protocol+'//'+ window.location.host +'/adminPanelTabs/orderListAndRemoveTab.html').then(data=>{
        document.getElementById("tabContent").innerHTML = data;
        getAllOrdersForListAndRemove();
    });
}