
var currrentActiveTabId = "";
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
        "sInfo":           "Показани са _START_ до _END_ потребител от _TOTAL_ потребители",
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
function getAllUsersForRemoveTable()
{
    $.get("/auth/getAllUsers", function(json, status)
    {
        json.forEach(el => {
            if(el["email"] != profileInfo["email"])
            {
            var verified = "";
            if(el["verified"] == 1) verified = "Да";
            else verified = "Не";
            document.getElementById("bodyTable").innerHTML += `<tr><td>${el["id"]}</td><td>${el["fName"]}</td><td>${el["lName"]}</td><td>${el["email"]}</td><td>${el["telephone"]}</td><td>${userRole[el["role"]]}</td><td>${el["address"]}</td><td>${verified}</td><td class="text-danger h5"><i class='far fa-times-circle' style='cursor: pointer;' onclick='removeUserShowModal("${el["id"]}");'></i></td></tr>`
            }
        });
        $('#userRemoveDt').DataTable(tableText);
        $('.dataTables_length').addClass('bs-select');
    });
    

}
function getAllUsersForActivateUserTable()
{
    $.get("/auth/getAllUsers", function(json, status)
    {
        json.forEach(el => {
            if(el["email"] != profileInfo["email"])
            {
            var verified = "";
            if(el["verified"] == 1) verified = "Да";
            else verified = "Не";
            document.getElementById("bodyTable").innerHTML += `<tr><td>${el["id"]}</td><td>${el["fName"]}</td><td>${el["lName"]}</td><td>${el["email"]}</td><td>${el["telephone"]}</td><td>${userRole[el["role"]]}</td><td>${el["address"]}</td><td>${verified}</td><td class="text-danger h5"><i class='far fa-check-square text-success' style='cursor: pointer;' onclick='activateUserShowModal("${el["id"]}");'></i></td></tr>`
            }
        });
        $('#userActivateDt').DataTable(tableText);
        $('.dataTables_length').addClass('bs-select');
    });
    

}
function getAllUsersForEditTable()
{
    $.get("/auth/getAllUsers", function(json, status)
    {
        json.forEach(el => {
            if(el["email"] != profileInfo["email"])
            {
            var verified = "";
            if(el["verified"] == 1) verified = "Да";
            else verified = "Не";
            document.getElementById("bodyTable").innerHTML += `<tr><td>${el["id"]}</td><td>${el["fName"]}</td><td>${el["lName"]}</td><td>${el["email"]}</td><td>${el["telephone"]}</td><td>${userRole[el["role"]]}</td><td>${el["address"]}</td><td>${verified}</td><td class="text-secondary h5"><i class='far fa-edit' style='cursor: pointer;' onclick='editUserShowModal("${el["id"]}", "${el["fName"]}", "${el["lName"]}", "${el["email"]}", "${el["telephone"]}", "${el["address"]}");'></i></td></tr>`
            }
        });
        $('#userEditDt').DataTable(tableText);
        $('.dataTables_length').addClass('bs-select');
    });
    

}
function getAllUsersForChangeRoleTable()
{
    $.get("/auth/getAllUsers", function(json, status)
    {
        json.forEach(el => {
            if(el["email"] != profileInfo["email"])
            {
            var verified = "";
            if(el["verified"] == 1) verified = "Да";
            else verified = "Не";
            document.getElementById("bodyTable").innerHTML += `<tr><td>${el["id"]}</td><td>${el["fName"]}</td><td>${el["lName"]}</td><td>${el["email"]}</td><td>${el["telephone"]}</td><td>${userRole[el["role"]]}</td><td>${el["address"]}</td><td>${verified}</td><td class="text-secondary h5"><i class='fas fa-tag' style='cursor: pointer;' onclick='changeUserRoleShowModal("${el["id"]}");'></i></td></tr>`
            }
        });
        $('#userChangeRoleDt').DataTable(tableText);
        $('.dataTables_length').addClass('bs-select');
    });
    

}
function changeRoleUser(id)
{
    $("#modalAdmin").modal('hide');
    $.post("/auth/changeUserRoleByAdmin", 
    {
        userid: id,
        role: $("#newRole").val(),
    },
    function(data, status)
    {
        document.getElementById("modalBody").innerText = "Успешно е сменена ролята на потребителя!";
        actionOnCloseModal = userChangeRoleTab;
        $("#modal").modal();
    }
    );
}
function activateUser(id)
{
    $("#modalAdmin").modal('hide');
    $.post("/auth/activateUserByAdmin", 
        {
            userid: id,
        },
        function(data, status)
        {
            document.getElementById("modalBody").innerText = "Профилът е активиран успешно!";
            actionOnCloseModal = userActivateTab;
            $("#modal").modal();
        }
        );
}
function editUser(id)
{
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
        $.post("/auth/editUserByAdmin", 
        {
            userid: id,
            fName: $("#fName").val(),
            lName: $("#lName").val(),
            email: $("#email").val(),
            phoneNumber: $("#phoneNumber").val(),
            address: $("#address").val(),
        },
        function(data, status)
        {
            document.getElementById("modalBody").innerText = "Успешно е редактиран потребител!";
            actionOnCloseModal = userEditTab;
            $("#modal").modal();
        }
        );
    }
}
function activateUserShowModal(id)
{
    document.getElementById("modalAdminLabel").innerText = `Активация профил на потребител`;
    document.getElementById("modalAdminBody").innerHTML =  `Сигурни ли сте, че искате да активирате профила на потребител с ID-${id}?`;
    document.getElementById("modalAdminButton").onclick = function() {activateUser(id);};
    $("#modalAdmin").modal();
}
function changeUserRoleShowModal(id)
{
    document.getElementById("modalAdminLabel").innerText = `Смяна роля на потребителя`;
    document.getElementById("modalAdminBody").innerHTML =  `<div class="d-flex justify-content-between "><label class="text-center w-100" for="newRole">Нова роля: </label><select name="newRole" id="newRole" class="form-control"> <option value="Admin">Администратор</option> <option value="Moderator">Модератор</option> <option value="User">Потребител</option> <option value="Driver">Шофьор</option> </select></div>`;
    document.getElementById("modalAdminButton").onclick = function() {changeRoleUser(id);};
    $("#modalAdmin").modal();
}
function editUserShowModal(id, fName, lName, email, phoneNumber, address)
{
    document.getElementById("modalAdminLabel").innerText = `Редактиране на потребител`;
    document.getElementById("modalAdminBody").innerHTML =  `<div class="form-group"><input type="text" class="form-control" id="fName"  placeholder="Име" value="${fName}"> </div> <div class="form-group"> <input type="text" class="form-control" id="lName" placeholder="Фамилия" value="${lName}"> </div> <div class="form-group"><input type="email" class="form-control" id="email" placeholder="Имейл" value="${email}"></div> <div class="form-group"><input type="text" class="form-control" id="phoneNumber" placeholder="Телефонен номер" value="${phoneNumber}"> </div> <div class="form-group"> <input type="text" class="form-control" id="address" placeholder="Адрес" value="${address}"></div>`;
    document.getElementById("modalAdminButton").onclick = function() {editUser(id);};
    $("#modalAdmin").modal();
}
function removeUserShowModal(id)
{
    document.getElementById("modalAdminLabel").innerText = `Премахване на потребител`;
    document.getElementById("modalAdminBody").innerText = `Сигурни ли сте, че искате да премахнете потребител с ID-${id}?`;
    document.getElementById("modalAdminButton").onclick = function() {removeUser(id);};
    $("#modalAdmin").modal();
}
function removeUser(id)
{
    if(arguments.callee.caller === null) {console.log("%c You are not permitted to use this method!!!",  'color: red'); return;}
    $("#modalAdmin").modal('hide');
    $.post("/auth/removeUser", 
    {
        userid: id,
    },
    function(data, status)
    {
        document.getElementById("modalBody").innerText = "Успешно е премахнат потребител!";
        actionOnCloseModal = userRemoveTab;
        $("#modal").modal();
    }
    );
}
function userRemoveTab()
{
    if(currrentActiveTabId != "") 
    {
        document.getElementById(currrentActiveTabId).classList.remove("active");
    }
    currrentActiveTabId = "userRemoveTab";
    document.getElementById(currrentActiveTabId).classList.add("active");
    $.get(window.location.protocol+'//'+ window.location.host +'/adminPanelTabs/userRemoveTab.html', function( data, textStatus, jqXHR ) {
        document.getElementById("tabContent").innerHTML = data;
        getAllUsersForRemoveTable();  
            });

}
function userEditTab()
{
    if(currrentActiveTabId != "") 
    {
        document.getElementById(currrentActiveTabId).classList.remove("active");
    }
    currrentActiveTabId = "userEditTab";
    document.getElementById(currrentActiveTabId).classList.add("active");
    $.get(window.location.protocol+'//'+ window.location.host +'/adminPanelTabs/userEditTab.html', function( data, textStatus, jqXHR ) {
        document.getElementById("tabContent").innerHTML = data;
        getAllUsersForEditTable();
});
}
function userActivateTab()
{
    if(currrentActiveTabId != "") 
    {
        document.getElementById(currrentActiveTabId).classList.remove("active");
    }
    currrentActiveTabId = "userActivateTab";
    document.getElementById(currrentActiveTabId).classList.add("active");
    $.get(window.location.protocol+'//'+ window.location.host +'/adminPanelTabs/userActivateTab.html', function( data, textStatus, jqXHR ) {
        document.getElementById("tabContent").innerHTML = data;
        getAllUsersForActivateUserTable();
});
}
function userChangeRoleTab()
{
    if(currrentActiveTabId != "") 
    {
        document.getElementById(currrentActiveTabId).classList.remove("active");
    }
    currrentActiveTabId = "userChangeRoleTab";
    document.getElementById(currrentActiveTabId).classList.add("active");
    $.get(window.location.protocol+'//'+ window.location.host +'/adminPanelTabs/userChangeRoleTab.html', function( data, textStatus, jqXHR ) {
        document.getElementById("tabContent").innerHTML = data;
        getAllUsersForChangeRoleTable();
});
}