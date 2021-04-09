//Deklarirane na promenlivi
var currentActiveTabId = "";
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
const tableTextCity = {
    "language": {
        "sProcessing":     "Обработка на данни...",
        "sSearch":         "Търсене:",
        "sLengthMenu":     "Покажи _MENU_ населени места на страница",
        "sInfo":           "Показани са от _START_ до _END_ населено място от общо _TOTAL_ населени места",
        "sInfoEmpty":      "Показани са 0 населени места",
        "sInfoFiltered":   "(общ брой населени места - _MAX_)",
        "sInfoPostFix":    "",
        "sLoadingRecords": "Зареждане на данни...",
        "sZeroRecords":    "Няма намерени населени места!",
        "sEmptyTable":     "Няма населени места",
        "oPaginate": {
            "sPrevious":   "Предишна страница",
            "sNext":       "Следваща страница",
        }
    }
};
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
                var licensePlate = "Няма";
                if(el["firmId"] != null) firmId = el["firmId"];
                if(el["licensePlate"] != "") licensePlate = el["licensePlate"];
                document.getElementById("bodyTable").innerHTML += `<tr><td>${el["id"]}</td><td>${el["fName"]}</td><td>${el["lName"]}</td><td>${el["email"]}</td><td>${el["telephone"]}</td><td>${userRole[el["role"]]}</td><td>${firmId}</td><td>${licensePlate}</td><td>Не</td><td class="text-danger h5"><i class='far fa-check-square text-success' style='cursor: pointer;' onclick='activateUserShowModal("${el["id"]}");'></i></td></tr>`
                }
            }
        });
        $('#userActivateDt').DataTable(tableText);
        $('.dataTables_length').addClass('bs-select');
    });
    

}
function getAllUsersForShowUsersTable()//Injectvane na potrebiteli v tablica za pokazvane na potrebiteli
{
    if(arguments.callee.caller === null) {console.log("%c You are not permitted to use this method!!!",  'color: red'); return;}
    getRequest("/auth/getAllUsers").then(json=>
    {
        json.forEach(el => {
            var firmId = "Няма";
            var verified = "";
            var licensePlate = "Няма";
            if(el["verified"] == 1) verified = "Да";
            else verified = "Не";
            if(el["firmId"] != null) firmId = el["firmId"];
            if(el["licensePlate"] != "") licensePlate = el["licensePlate"];
            document.getElementById("bodyTable").innerHTML += `<tr><td>${el["id"]}</td><td>${el["fName"]}</td><td>${el["lName"]}</td><td>${el["email"]}</td><td>${el["telephone"]}</td><td>${userRole[el["role"]]}</td><td>${firmId}</td><td>${licensePlate}</td><td>${verified}</td></tr>`;
        });
        $('#showAllUsersDt').DataTable(tableText);
        $('.dataTables_length').addClass('bs-select');
    });
}
function getAllFirmsForShowFirmsTable()//Injectvane na firmi v tablica za pregled na firmi
{
    if(arguments.callee.caller === null) {console.log("%c You are not permitted to use this method!!!",  'color: red'); return;}
    getRequest("/firm/getAllFirms").then(json=>
    {
        json.forEach(el => {
            var verified = "";
            if(el["verified"] == 1) verified = "Да";
            else verified = "Не";
            var modVerified = "";
            if(el["moderationVerified"] == 1) modVerified = "Да";
            else modVerified = "Не";
            document.getElementById("bodyTable").innerHTML += `<tr><td>${el["id"]}</td><td>${el["firmName"]}</td><td>${el["eik"]}</td><td>${el["city"]}</td><td>${el["address"]}</td><td>${el["email"]}</td><td>${el["phoneNumber"]}</td><td>${verified}</td><td>${modVerified}</td></tr>`
        });
        $('#showFirmsDt').DataTable(tableTextFirm);
        $('.dataTables_length').addClass('bs-select');
    });
    

}
function getAllFirmsForModerationVerifyFirmTable()//Injectvane na firmi v tablica za odobrqvane na firmi
{
    if(arguments.callee.caller === null) {console.log("%c You are not permitted to use this method!!!",  'color: red'); return;}
    getRequest("/firm/getAllFirms").then(json=>
    {
        json.forEach(el => {
            if(el["moderationVerified"] == 0)
            {
            var verified = "";
            if(el["verified"] == 1) verified = "Да";
            else verified = "Не";
            document.getElementById("bodyTable").innerHTML += `<tr><td>${el["id"]}</td><td>${el["firmName"]}</td><td>${el["eik"]}</td><td>${el["city"]}</td><td>${el["address"]}</td><td>${el["email"]}</td><td>${el["phoneNumber"]}</td><td>${verified}</td><td>Не</td><td class="text-secondary h5"><i class='far fa-check-square text-success' style='cursor: pointer;' onclick='firmModerationVerifyShowModal("${el["id"]}");'></i></td></tr>`
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
            document.getElementById("allFirmsForAddDriver").innerHTML += `<option value="${el["id"]}">${el["firmName"]}</option>`;
        });
        $("#allFirmsForAddDriver").selectpicker();
    });
}
function getAllCitiesByFirmForRemoveCityTable()//Injectvane na poddurjani naseleni mesta za premahvane na naseleni mesta
{
    if(arguments.callee.caller === null) {console.log("%c You are not permitted to use this method!!!",  'color: red'); return;}
    if($("#removeCityDt").length)
    {
        document.getElementById("removeCityDt").remove();
    }
    postRequest("/firm/getCitiesByFirmId", {firmId: $("#firms option:selected").val()}).then(json=>
    {
        document.getElementById("divTableRemoveCity").innerHTML=`<h5 class="text-center" id="firmName"></h5> <table id="removeCityDt" class="table table-striped table-bordered table-responsive" cellspacing="0" width="100%"> <thead> <tr> <th class="th-sm">ID </th> <th class="th-sm">Име на населено място </th> <th class="th-sm">Име на област </th> <th class="th-sm">Премахване на населено място от фирма </th> </tr> </thead> <tbody id="bodyTable"> </tbody> <tfoot> <tr> <th>ID </th> <th>Име на населено място </th> <th>Име на област </th> <th>Премахване на населено място от фирма </th> </tr> </tfoot> </table>`;
        document.getElementById("firmName").innerText = $("#firms option:selected").text();
        json.forEach(el => {
            document.getElementById("bodyTable").innerHTML += `<tr><td>${el["id"]}</td><td>${el["city"]}</td><td>${el["region"]}</td><td><h5><i class='far fa-times-circle text-danger' style='cursor: pointer;' onclick='removeSupportedCityShowModal("${$("#firms option:selected").val()}", "${el["id"]}");'></i></h5></td></tr>`
        });
        $('#removeCityDt').DataTable(tableTextCity);
        $('.dataTables_length').addClass('bs-select');
    });
}
function getAllOrdersForList()//Injektvane na poruchki v tablica za razgledjdane na poruchki
{
    if(arguments.callee.caller === null) {console.log("%c You are not permitted to use this method!!!",  'color: red'); return;}
    getRequest("/order/getAllOrders").then(json=>
    {
        json.forEach(order => {
            var driverId = "Няма";
            var listOrder = "Няма";
            var notes = "Няма";
            var rate = "Няма";
            var rateComment = "Няма";
            if(order["driverId"] != null) driverId = order["driverId"];
            if(order["notes"] != "") notes = order["notes"];
            if(order["rate"] != 0) rate = rate = ratingStars[order["rate"]];
            if(order["rateComment"] != "") rateComment = order["rateComment"];
            if(order["items"] != "") listOrder = order["items"];
            document.getElementById("bodyTable").innerHTML += `<tr><td>${order["id"]}</td><td>${order["address"]}</td><td>${order["y"]}</td><td>${order["x"]}</td><td>${driverId}</td><td>${order["userId"]}</td><td>${listOrder}</td><td>${notes}</td><td>${order["date"]}</td><td>${order["ip"]}</td><td>${orderStatus[order["orderStatus"]]}</td><td>${rate}</td><td>${rateComment}</td></tr>`;
        });
        $('#allOrdersDt').DataTable(tableTextOrder);
        $('.dataTables_length').addClass('bs-select');
    });

}
function activateUserShowModal(id)//Pokazvane na modal za aktivirane na potrebitel
{
    if(arguments.callee.caller === null) {console.log("%c You are not permitted to use this method!!!",  'color: red'); return;}
    document.getElementById("modalModLabel").innerText = `Активация профил на потребител`;
    document.getElementById("modalModBody").innerHTML =  `Сигурни ли сте, че искате да активирате профила на потребител с ID-${id}?`;
    document.getElementById("modalModButton").onclick = function() {activateUser(id);};
    $("#modalMod").modal();
}
function firmModerationVerifyShowModal(id)//Pokazvane na modal za odobrqvane na firma
{
    if(arguments.callee.caller === null) {console.log("%c You are not permitted to use this method!!!",  'color: red'); return;}
    document.getElementById("modalModLabel").innerText = `Одобряване на фирма`;
    document.getElementById("modalModBody").innerText = `Сигурни ли сте, че искате да одобрите фирма с ID-${id}?`;
    document.getElementById("modalModButton").onclick = function() {moderationVerifyFirm(id);};
    $("#modalMod").modal()
}
function addTaxiDriverShowModal(id)//Pokazvane na modal za dobavqne na shofyori
{
    if(arguments.callee.caller === null) {console.log("%c You are not permitted to use this method!!!",  'color: red'); return;}
    document.getElementById("modalModLabel").innerText = `Добавяне на шофьор`;
    document.getElementById("modalModBody").innerHTML = `<p class="text-center">Към коя фирма искате да добавите шофьор с ID-${id}?</p><select id="allFirmsForAddDriver" class="form-control show-tick" data-dropdown-align-right="true" data-none-results-text="Няма намерени фирми" data-style="btn-link ml-0 border border-secondary" data-dropup-auto="false" data-live-search="true"></select><input type="email" class="form-control mt-4" id="licensePlate" placeholder="Регистрационен номер на колата"> <div class="invalid-feedback">Въвели сте невалиден регистрационен номер! Пример: ВТ1212АР. Регистрационният номер трябва да бъде на кирилица!</div>`;
    getAllFirmsForAddDrivers();
    document.getElementById("modalModButton").onclick = function() {addTaxiDriverByModerator(id);};
    $("#modalMod").modal()
}
function removeSupportedCityShowModal(firmId, cityId)//Pokazvane na modal za iztrivane na naseleno mqsto
{
    if(arguments.callee.caller === null) {console.log("%c You are not permitted to use this method!!!",  'color: red'); return;}
    document.getElementById("modalModLabel").innerText = `Изтриване на населено място`;
    document.getElementById("modalModBody").innerHTML =  `Сигурни ли сте, че искате да изтриете населено място с ID-${cityId} и ID на фирма-${firmId}?`;
    document.getElementById("modalModButton").onclick = function() {removeSupportedCity(firmId, cityId);};
    $("#modalMod").modal();
}

function activateUser(id)//Aktivirane na potrebitel po id
{
    if(arguments.callee.caller === null) {console.log("%c You are not permitted to use this method!!!",  'color: red'); return;}
    $("#modalMod").modal('hide');
    postRequest("/auth/activateUserById", 
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

function moderationVerifyFirm(id)//Odobrqvane na firma po id
{
    if(arguments.callee.caller === null) {console.log("%c You are not permitted to use this method!!!",  'color: red'); return;}
    $("#modalMod").modal('hide');
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
function addTaxiDriverByModerator(id)//Dobavqne na shofyor po id kato moderator
{
    if(arguments.callee.caller === null) {console.log("%c You are not permitted to use this method!!!",  'color: red'); return;}
    var isLicensePlate = /^(Е|А|В|ВТ|ВН|ВР|ЕВ|ТХ|К|КН|ОВ|М|РА|РК|ЕН|РВ|РР|Р|СС|СН|СМ|СО|СА|С|СВ|СТ|Т|Х|Н|У)[0-9][0-9][0-9][0-9][А-Я][А-Я]$/;
    $('#licensePlate').removeClass("is-invalid");
    if(!isLicensePlate.test($("#licensePlate").val()))
    {
        $('#licensePlate').addClass("is-invalid");
    }
    else
    {
        $("#modalMod").modal('hide');
        $('#licensePlate').addClass("is-valid");
    
        postRequest("/firm/addTaxiDriverById", 
        {
            firmID: $("#allFirmsForAddDriver").val(),
            userID: id,
            licensePlate: $("#licensePlate").val()
        }).then(data=>
        {
            if(data == "true")
            {
                document.getElementById("modalBody").innerText = `Успешно е добавен таксиметров шофьор с ID-${id} и регистрационен номер-${$("#licensePlate").val()} към фирма с име-${$("#allFirmsForAddDriver option:selected").text()}!`;
            }
            else if(data == "false")
            {
                document.getElementById("modalBody").innerText = `Не може да бъде добавен таксиметров шофьор към фирма с име-${$("#allFirmsForAddDriver option:selected").text()} докато фирмата не бъде одобрена!`;
            }
            actionOnCloseModal = addDriverTab;
            $("#modal").modal();
        }
        );
    }
}
function addCity()//Dobavqne na podurjan grad kum firma
{
    if(arguments.callee.caller === null) {console.log("%c You are not permitted to use this method!!!",  'color: red'); return;}
    postRequest("/firm/addSupportedCityByFirmId", 
    {
        city: $("#nameCity option:selected").text(),
        region: $("#nameRegion option:selected").text(),
        firmId: $("#firms2 option:selected").val()
    }).then(data=>
    {
        if(data=="true") 
        {
            document.getElementById("modalBody").innerText="Населеното място е добавено успешно!";
        }
        else document.getElementById("modalBody").innerText="Вече сте добавили населено място с това име!";

    $("#modal").modal();
        }
        );
}
function removeSupportedCity(firmId, cityId)//Premahvane na poddurjan grad po id na firma i id na grad
{
    if(arguments.callee.caller === null) {console.log("%c You are not permitted to use this method!!!",  'color: red'); return;}
    $("#modalMod").modal('hide');
    postRequest("/firm/removeSupportedCityById", 
    {
        firmId: firmId,
        cityId: cityId,
    }).then(data=>
    {
        if(data == "true")
        {
        document.getElementById("modalBody").innerText = `Успешно е изтрито населено място с ID-${cityId} от фирма с ID-${firmId}!`;
        actionOnCloseModal = getAllCitiesByFirmForRemoveCityTable;
        $("#modal").modal();
        }
    }
    );
}
function showAllUsersTab()//Tab za pokazvane na potrebiteli
{
    if(arguments.callee.caller === null) {console.log("%c You are not permitted to use this method!!!",  'color: red'); return;}
    if(currentActiveTabId != "") 
    {
        document.getElementById(currentActiveTabId).classList.remove("active");
    }
    currentActiveTabId = "showAllUsersTab";
    document.getElementById(currentActiveTabId).classList.add("active");
    getRequest(window.location.protocol+'//'+ window.location.host +'/modPanelTabs/showAllUsersTab.html').then(data=>{
        document.getElementById("tabContent").innerHTML = data;
        getAllUsersForShowUsersTable();
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
    getRequest(window.location.protocol+'//'+ window.location.host +'/modPanelTabs/userActivateTab.html').then(data=>{
        document.getElementById("tabContent").innerHTML = data;
        getAllUsersForActivateUserTable();
});
}
function showAllFirmsTab()//Tab za pokazvane na firmi
{
    if(arguments.callee.caller === null) {console.log("%c You are not permitted to use this method!!!",  'color: red'); return;}
    if(currentActiveTabId != "") 
    {
        document.getElementById(currentActiveTabId).classList.remove("active");
    }
    currentActiveTabId = "showAllFirmsTab";
    document.getElementById(currentActiveTabId).classList.add("active");
    getRequest(window.location.protocol+'//'+ window.location.host +'/modPanelTabs/showAllFirmsTab.html').then(data=>{
        document.getElementById("tabContent").innerHTML = data;
        getAllFirmsForShowFirmsTable();
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
    getRequest(window.location.protocol+'//'+ window.location.host +'/modPanelTabs/moderationVerifyFirmTab.html').then(data=>{
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
    getRequest(window.location.protocol+'//'+ window.location.host +'/modPanelTabs/addDriverTab.html').then(data=>{
        document.getElementById("tabContent").innerHTML = data;
        getAllUsersForAddDriverTabTable();
    });
}
function addRemoveSupportedCityTab()//Tab za premhavane i dobavqne na poddurjani naseleni mesta
{
    if(arguments.callee.caller === null) {console.log("%c You are not permitted to use this method!!!",  'color: red'); return;}
    if(currentActiveTabId != "") 
    {
        document.getElementById(currentActiveTabId).classList.remove("active");
    }
    currentActiveTabId = "addRemoveSupportedCityTab";
    document.getElementById(currentActiveTabId).classList.add("active");
    getRequest(window.location.protocol+'//'+ window.location.host +'/modPanelTabs/addRemoveSupportedCityTab.html').then(data=>{
        document.getElementById("tabContent").innerHTML = data;
        getRequest("/firm/getAllFirms/").then(json=>{
            if(json.length> 0)
            {
            json.forEach(el => {
                document.getElementById("firms").innerHTML += `<option value="${el["id"]}">${el["firmName"]}</option>`;
                document.getElementById("firms2").innerHTML += `<option value="${el["id"]}">${el["firmName"]}</option>`
            });
            $("#firms").selectpicker();
            $("#firms2").selectpicker();
            }
        });
        $('#nameRegion').selectpicker();
        $('#nameCity').selectpicker();
        setTimeout(function() {getCitiesByRegCode(document.getElementById("nameRegion"));}, 500);
    });
}
function orderListTab()//Tab za pregled na poruchki
{
    if(arguments.callee.caller === null) {console.log("%c You are not permitted to use this method!!!",  'color: red'); return;}
    if(currentActiveTabId != "") 
    {
        document.getElementById(currentActiveTabId).classList.remove("active");
    }
    currentActiveTabId = "orderListTab";
    document.getElementById(currentActiveTabId).classList.add("active");
    getRequest(window.location.protocol+'//'+ window.location.host +'/modPanelTabs/orderListTab.html').then(data=>{
        document.getElementById("tabContent").innerHTML = data;
        getAllOrdersForList();
    });
}