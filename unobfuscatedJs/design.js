function refreshPage()//Refreshvane na stranicata
{
    if (arguments.callee.caller === null) { console.log("%c You are not permitted to use this method!!!", 'color: red'); return; }
    location.reload();
}
function escapeQuotes(str) {
    return str.replace(/"/g, '\\"').replace(/'/g, "\\'");
}
function changeAddressTypeTab(radio) {
    if (arguments.callee.caller === null) { console.log("%c You are not permitted to use this method!!!", 'color: red'); return; }
    var addressTypeTab = document.getElementById("addressTypeContent");
    if (radio.value == "savedAddress") {
        addressTypeTab.innerHTML = `<select class="form-control selectpicker show-tick"
        data-dropup-auto="false" data-none-results-text="Няма запазени адреси"
        data-style="btn-link ml-0 border border-secondary" data-live-search="true" id="addressTaxi"></select>`;
        getSavedAddresses();
    }
    else {
        addressTypeTab.innerHTML = `<input type="text" id="addressTaxi" class="form-control " placeholder="Адрес"><br><p class="ml-2">Запазване на адреса: </p><input type="checkbox" id="saveAddress" data-toggle="toggle"><br><label
        class="text-left mt-3">Населено място: </label><select class="form-control selectpicker show-tick"
        data-dropup-auto="false" data-none-results-text="Няма намерени наслени места"
        data-style="btn-link ml-0 border border-secondary" data-live-search="true" id="city"></select>`;
        $("#saveAddress").bootstrapToggle({
            on: "Да",
            off: "Не",
            size: "sm",
            onstyle: 'primary',
            offstyle: 'secondary'
        });
        getAllCities();
    }

}
function changeAddressTypeTabItems(radio) {
    if (arguments.callee.caller === null) { console.log("%c You are not permitted to use this method!!!", 'color: red'); return; }
    var addressTypeTab = document.getElementById("addressTypeContent2");
    if (radio.value == "savedAddress") {
        addressTypeTab.innerHTML = `<select class="form-control selectpicker show-tick"
        data-dropup-auto="false" data-none-results-text="Няма запазени адреси"
        data-style="btn-link ml-0 border border-secondary" data-live-search="true" id="addressTaxiItems"></select>`;
        getSavedAddresses2();
    }
    else {
        addressTypeTab.innerHTML = `<input type="text" id="addressTaxiItems" class="form-control " placeholder="Адрес"><br><p class="ml-2">Запазване на адреса: </p><input type="checkbox" id="saveAddress2" data-toggle="toggle"><br><label
        class="text-left mt-3">Населено място: </label><select class="form-control selectpicker show-tick"
        data-dropup-auto="false" data-none-results-text="Няма намерени наслени места"
        data-style="btn-link ml-0 border border-secondary" data-live-search="true" id="city2"></select>`;
        $("#saveAddress2").bootstrapToggle({
            on: "Да",
            off: "Не",
            size: "sm",
            onstyle: 'primary',
            offstyle: 'secondary'
        });
        getAllCities2();
    }

}
function hideTooltips()//Izchistvane na tooltipovete
{
    if (arguments.callee.caller === null) { console.log("%c You are not permitted to use this method!!!", 'color: red'); return; }
    $('.tooltip').tooltip('hide');
}
function changeTabOrder(radio) {
    if (arguments.callee.caller === null) { console.log("%c You are not permitted to use this method!!!", 'color: red'); return; }
    var contentTab = document.getElementById("contentTab");
    if (radio.value == "address") {
        contentTab.innerHTML = '<input type="text" id="addressTaxi" class="form-control" placeholder="Адрес"><div class="invalid-feedback">Адресът трябва да е по-дълъг от 5 символа!</div><br><label class="text-left mt-3">Населено място: </label><select class="form-control selectpicker show-tick" data-dropdown-align-right="true" data-none-results-text="Няма намерени наслени места" data-dropup-auto="false"  data-style="btn-link ml-0 border border-secondary" data-live-search="true" id="city"></select><br><textarea placeholder="Бележки(по избор)" class="form-control mt-3" id="notes" style="resize: none; height: 200px" rows="3"></textarea><br><button id="currentLocationReload" class="btn btn-primary ml-0 black-text btn-block rounded" type="submit" onclick="updateMapAddressItems()">Обнови картата</button><br><button class="btn btn-primary ml-0 black-text mt-2 btn-block rounded" type="submit" onclick="makeOrderTaxiAddress()">Направи поръчка</button>';
        getAllCities();
    }
    else {
        showCurrentPosition();
        contentTab.innerHTML = '<textarea placeholder="Бележки(по избор)" class="form-control mt-3" id="notes" style="resize: none; height: 200px" rows="3"></textarea><br><button class="btn btn-primary ml-0 black-text btn-block rounded" type="submit" onclick="showCurrentPosition()">Обнови картата</button><br><button class="btn btn-primary ml-0 mt-2 black-text btn-block rounded" type="submit" onclick="makeOrderCurrentLocation()">Направи поръчка</button>';
    }
}
function changeTabOrderItems(radio) {
    if (arguments.callee.caller === null) { console.log("%c You are not permitted to use this method!!!", 'color: red'); return; }
    var contentTab = document.getElementById("contentTab2");
    if (radio.value == "addressItems") {
        contentTab.innerHTML = '<input type="text" id="addressTaxiItems" class="form-control" placeholder="Адрес"><div class="invalid-feedback">Адресът трябва да е по-дълъг от 5 символа!</div><br><label class="text-left mt-3">Населено място: </label><select class="form-control selectpicker show-tick" data-dropdown-align-right="true" data-none-results-text="Няма намерени наслени места" data-dropup-auto="false"  data-style="btn-link ml-0 border border-secondary" data-live-search="true" id="city2"></select><br><textarea placeholder="Указания за пазаруване" class="form-control mt-3" id="items" style="resize: none; height: 200px" rows="3"></textarea><div class="invalid-feedback">Указанията за пазаруване трябва да са по-дълги от 5 символа!</div><br><button id="currentLocationReload" class="btn btn-primary ml-0 black-text btn-block rounded" type="submit" onclick="updateMapAddress()">Обнови картата</button><br><button class="btn btn-primary ml-0 black-text mt-2 btn-block rounded" type="submit" onclick="makeOrderItemsAddress()">Направи поръчка</button>';
        getAllCities2();
    }
    else {
        showCurrentPosition();
        contentTab.innerHTML = '<textarea placeholder="Указания за пазаруване" class="form-control mt-3" id="items" style="resize: none; height: 200px" rows="3"></textarea><div class="invalid-feedback">Указанията за пазаруване трябва да са по-дълги от 5 символа!</div><br><button class="btn btn-primary ml-0 black-text btn-block rounded" type="submit" onclick="showCurrentPosition()">Обнови картата</button><br><button class="btn btn-primary ml-0 mt-2 black-text btn-block rounded" type="submit" onclick="makeOrderItemsCurrentLocation()">Направи поръчка</button>';
    }
}
const sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
}
function collapse()//Promqna na navbara pri otvarqne i zatvarqne
{
    if (arguments.callee.caller === null) { console.log("%c You are not permitted to use this method!!!", 'color: red'); return; }
}
function showCurrentPosition()//Update na karta ot tekushto mestopolozenie
{
    if (arguments.callee.caller === null) { console.log("%c You are not permitted to use this method!!!", 'color: red'); return; }
    getLocation().then(coord => {
        document.getElementById("map").src = "https://maps.google.com/maps?q=" + coord["y"] + ", " + coord["x"] + "&t=&z=17&ie=UTF8&iwloc=&output=embed";
    });
}
function updateMapAddress()//Update na karta ot zadaden adres
{
    if (arguments.callee.caller === null) { console.log("%c You are not permitted to use this method!!!", 'color: red'); return; }
    var address = $("#addressTaxi option:selected").val();
    if (document.getElementById("saveAddress")) {
        address = $("#addressTaxi").val() + ", " + $("#city").val();
    }
    document.getElementById("map").src = "https://maps.google.com/maps?q=" + address + "&t=&z=17&ie=UTF8&iwloc=&output=embed"; $([document.documentElement, document.body]).animate({
        scrollTop: $("#map").offset().top
    }, 1000);
}
function updateMapAddressItems()//Update na karta ot zadaden adres
{
    if (arguments.callee.caller === null) { console.log("%c You are not permitted to use this method!!!", 'color: red'); return; }
    var address = $("#addressTaxiItems option:selected").val();
    if (document.getElementById("saveAddress2")) {
        address = $("#addressTaxiItems").val() + ", " + $("#city2").val();
    }
    document.getElementById("map").src = "https://maps.google.com/maps?q=" + address + "&t=&z=17&ie=UTF8&iwloc=&output=embed"; $([document.documentElement, document.body]).animate({
        scrollTop: $("#map").offset().top
    }, 1000);
}
function designChangeOnStart()//Nastroivane na dizain pri startirane
{
    if (arguments.callee.caller === null) { console.log("%c You are not permitted to use this method!!!", 'color: red'); return; }
    var nav = document.getElementById("navElements");
    if (loginInfo["isLoggedIn"] == "true") {
        document.getElementById("loginNav").remove();
        document.getElementById("registerNav").remove();
        if (loginInfo["Type"] == "Firm") {
            document.getElementById("makeOrderButton").remove();
            document.getElementById("makeOrderNav").remove();
            setProfileInfoFirm();
        }
        else {
            if (loginInfo["Role"] == "Driver") {
                document.getElementById("makeOrderNav").remove()
                document.getElementById("makeOrderButton").remove();
            }
            setProfileInfoUser();
        }
    }
}
$(".navbar-collapse").on("show.bs.collapse", function () {
    document.getElementById("navbar").style.removeProperty("background-image");
});
$(".navbar-collapse").on("hidden.bs.collapse", function () {
    document.getElementById("navbar").style.setProperty("background-image", "url('/assets/img/navbar.png')");
});
