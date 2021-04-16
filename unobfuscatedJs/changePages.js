
function pageRegisterUser()//Smqna na stranica za registraciq na klient
{
    if (arguments.callee.caller === null) { console.log("%c You are not permitted to use this method!!!", 'color: red'); return; }
    $(".navbar-collapse").collapse('hide');
    if (loginInfo["isLoggedIn"] == "true") {
        if (loginInfo["Type"] == "Firm") {
            profileFirmPage();
            return;
        }
        else {
            if (loginInfo["Role"] == "Driver") {
                profileDriverPage();
                return;
            }
            else {
                profilePage();
                return;
            }
        }
    }
    window.location.hash = "#pageRegisterUser";
    getRequest(window.location.protocol + '//' + window.location.host + '/pages/registerPageUser.html').then(data => {
        document.getElementById("pageContent").innerHTML = data;
    });


}
function resetPasswordPage()//Smqna na stranica za zabravena parola na potrebitel
{
    if (arguments.callee.caller === null) { console.log("%c You are not permitted to use this method!!!", 'color: red'); return; }
    $(".navbar-collapse").collapse('hide');
    getRequest(window.location.protocol + '//' + window.location.host + '/pages/resetPasswordPage.html').then(data => {
        document.getElementById("pageContent").innerHTML = data;
    });
}
function resetPasswordPageFirm()//Smqna na stranica za zabravena parola na firma
{
    if (arguments.callee.caller === null) { console.log("%c You are not permitted to use this method!!!", 'color: red'); return; }
    $(".navbar-collapse").collapse('hide');
    getRequest(window.location.protocol + '//' + window.location.host + '/pages/resetPasswordPageFirm.html').then(data => {
        document.getElementById("pageContent").innerHTML = data;
    });
}
function adminPanelPage()//Smqna na stranica za administratorski panel
{
    if (arguments.callee.caller === null) { console.log("%c You are not permitted to use this method!!!", 'color: red'); return; }
    window.location.hash = "#adminPanel";
    setLastPage("adminPanel");
    $(".navbar-collapse").collapse('hide');
    getRequest(window.location.protocol + '//' + window.location.host + '/pages/adminPanel.html').then(data => {
        document.getElementById("pageContent").innerHTML = data;
        userRemoveTab();

    });

}
function modPanelPage()//Smqna na stranica za moderatorski panel
{
    if (arguments.callee.caller === null) { console.log("%c You are not permitted to use this method!!!", 'color: red'); return; }
    window.location.hash = "#modPanel";
    setLastPage("modPanel");
    $(".navbar-collapse").collapse('hide');
    getRequest(window.location.protocol + '//' + window.location.host + '/pages/modPanel.html').then(data => {
        document.getElementById("pageContent").innerHTML = data;
        showAllUsersTab();
    });

}
function makeOrderPage()//Smqna na stranica za poruchka
{
    if (arguments.callee.caller === null) { console.log("%c You are not permitted to use this method!!!", 'color: red'); return; }
    setLastPage("makeOrder");
    $(".navbar-collapse").collapse('hide');
    if (loginInfo.isLoggedIn == "false") return loginPage();
    window.location.hash = "#makeOrderPage";
    getRequest(window.location.protocol + '//' + window.location.host + '/pages/makeOrderPage.html').then(data => {
        document.getElementById("pageContent").innerHTML = data;
        /*if (!window.mobileCheck()) {
            document.getElementById("formOrderTaxi").innerHTML = '<input type="text" id="addressTaxi" class="form-control" placeholder="Адрес"><div class="invalid-feedback">Адресът трябва да е по-дълъг от 5 символа!</div><br><label class="text-left mt-3">Населено място: </label><select class="form-control selectpicker show-tick" data-dropup-auto="false" data-none-results-text="Няма намерени наслени места" data-style="btn-link ml-0 border border-secondary" data-live-search="true" id="city"></select><br><textarea placeholder="Бележки(по избор)" class="form-control mt-3" id="notes" style="resize: none; height: 200px" rows="3"></textarea><br><button id="currentLocationReload" class="btn btn-primary ml-0 mt-3 black-text btn-block rounded" type="submit" onclick="updateMapAddress()">Обнови картата</button><br><button class="btn btn-primary ml-0 black-text mt-3 btn-block rounded" type="submit" onclick="makeOrderTaxiAddress()">Направи поръчка</button>';
            document.getElementById("formOrderItems").innerHTML = '<input type="text" id="addressTaxiItems" class="form-control" placeholder="Адрес"><div class="invalid-feedback">Адресът трябва да е по-дълъг от 5 символа!</div><br><label class="text-left mt-3">Населено място: </label><select class="form-control selectpicker show-tick" data-none-results-text="Няма намерени наслени места" data-dropup-auto="false"  data-style="btn-link ml-0 border border-secondary" data-live-search="true" id="city2"></select><br><textarea placeholder="Указания за пазаруване" class="form-control mt-3" id="items" style="resize: none; height: 200px" rows="3"></textarea><div class="invalid-feedback">Указанията за пазаруване трябва да са по-дълги от 5 символа!</div><br><button id="currentLocationReload" class="btn btn-primary ml-0 mt-3 black-text btn-block rounded" type="submit" onclick="updateMapAddressItems()">Обнови картата</button><br><button class="btn btn-primary ml-0 black-text mt-2 btn-block rounded" type="submit" onclick="makeOrderItemsAddress()">Направи поръчка</button>';
        }*/
        var radio = {};
        radio.value = "savedAddress";
        changeAddressTypeTab(radio);
        changeAddressTypeTabItems(radio);
    });
}
function aboutUsPage()//Smqna na stranica za nas
{
    if (arguments.callee.caller === null) { console.log("%c You are not permitted to use this method!!!", 'color: red'); return; }
    $(".navbar-collapse").collapse('hide');
    window.location.hash = "#aboutUs";
    getRequest(window.location.protocol + '//' + window.location.host + '/pages/aboutUs.html').then(data => {
        document.getElementById("pageContent").innerHTML = data;
        new WOW().init();
    });
}
function pageRegisterFirm()//Smqna na stranica za registraciq na firma
{
    if (arguments.callee.caller === null) { console.log("%c You are not permitted to use this method!!!", 'color: red'); return; }
    $(".navbar-collapse").collapse('hide');
    if (loginInfo["isLoggedIn"] == "true") {
        if (loginInfo["Type"] == "Firm") {
            profileFirmPage();
            return;
        }
        else {
            if (loginInfo["Role"] == "Driver") {
                profileDriverPage();
                return;
            }
            else {
                profilePage();
                return;
            }
        }
    }
    window.location.hash = "#pageRegisterFirm";
    getRequest(window.location.protocol + '//' + window.location.host + '/pages/registerPageFirm.html').then(data => {
        document.getElementById("pageContent").innerHTML = data;
        $('#nameRegion').selectpicker();
        $('#nameCity').selectpicker();
        setTimeout(function () { getCitiesByRegCode(document.getElementById("nameRegion")); }, 500);
    });
}
function homePage()//Smqna na nachalna stranica
{
    if (arguments.callee.caller === null) { console.log("%c You are not permitted to use this method!!!", 'color: red'); return; }
    window.location.hash = "#";
    $(".navbar-collapse").collapse('hide');
    getRequest(window.location.protocol + '//' + window.location.host + '/pages/homePage.html').then(data => {
        document.getElementById("pageContent").innerHTML = data;
    });

}
function loginPage()//Smqna na stranica za vlizane na klient
{
    if (arguments.callee.caller === null) { console.log("%c You are not permitted to use this method!!!", 'color: red'); return; }
    window.location.hash = "#loginPage";
    $(".navbar-collapse").collapse('hide');
    getRequest(window.location.protocol + '//' + window.location.host + '/pages/loginPage.html').then(data => {
        document.getElementById("pageContent").innerHTML = data;
    });

}
function loginFirmPage()//Smqna na stranica za vlizane na firma
{
    if (arguments.callee.caller === null) { console.log("%c You are not permitted to use this method!!!", 'color: red'); return; }
    window.location.hash = "#loginFirmPage";
    $(".navbar-collapse").collapse('hide');
    getRequest(window.location.protocol + '//' + window.location.host + '/pages/loginFirmPage.html').then(data => {
        document.getElementById("pageContent").innerHTML = data;
    });

}
function profilePage()//Smqna na stranica za profila na klienta
{
    if (arguments.callee.caller === null) { console.log("%c You are not permitted to use this method!!!", 'color: red'); return; }
    window.location.hash = "#profile";
    setLastPage("profile")
    $(".navbar-collapse").collapse('hide');
    getRequest(window.location.protocol + '//' + window.location.host + '/pages/profilePage.html').then(data => {
        document.getElementById("pageContent").innerHTML = data;
        getProfile();
        getOrdersUser();
        getAllCities();
        getSavedAddressesProfile();

    });

}
function profileDriverPage()//Smqna na stranica za profila na shofyor
{
    if (arguments.callee.caller === null) { console.log("%c You are not permitted to use this method!!!", 'color: red'); return; }
    window.location.hash = "#profile";
    setLastPage("profileDriver");
    $(".navbar-collapse").collapse('hide');
    getRequest(window.location.protocol + '//' + window.location.host + '/pages/profileDriverPage.html').then(data => {
        document.getElementById("pageContent").innerHTML = data; getProfile(); getOrdersDriver();
    });

}
function waitingForOrderAcceptPage()//Sqmna na strtanica za izchakvane na poruchka
{
    if (arguments.callee.caller === null) { console.log("%c You are not permitted to use this method!!!", 'color: red'); return; }
    $(".navbar-collapse").collapse('hide');
    getRequest(window.location.protocol + '//' + window.location.host + '/pages/waitingForOrderAccept.html').then(data => {
        document.getElementById("pageContent").innerHTML = data;
    });
}
function profileFirmPage()//Smqna na stranica za profila na firmata
{
    if (arguments.callee.caller === null) { console.log("%c You are not permitted to use this method!!!", 'color: red'); return; }
    window.location.hash = "#profile";
    setLastPage("profileFirm");
    $(".navbar-collapse").collapse('hide');
    getRequest(window.location.protocol + '//' + window.location.host + '/pages/profileFirmPage.html').then(data => {
        document.getElementById("pageContent").innerHTML = data; getProfileFirm();
        getTaxiDrivers();
        getSupportedCitiesByFirm();
        $('#nameRegion').selectpicker();
        $('#nameCity').selectpicker();

    });
}
function helpPage()//Smqna na stranica za help menu
{
    if (arguments.callee.caller === null) { console.log("%c You are not permitted to use this method!!!", 'color: red'); return; }
    window.location.hash = "#helpPage";
    $(".navbar-collapse").collapse('hide');
    getRequest(window.location.protocol + '//' + window.location.host + '/pages/helpPage.html').then(data => {
        document.getElementById("pageContent").innerHTML = data;
    });
}
