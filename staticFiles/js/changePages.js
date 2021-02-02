function pageRegisterUser()//Smqna na stranica za registraciq na klient
{
        if(arguments.callee.caller === null) {console.log("%c You are not permitted to use this method!!!",  'color: red'); return;}
        if(loginInfo["isLoggedIn"] == "true")
        {
                if(loginInfo["Type"] == "Firm")
                {
                        profileFirmPage();
                        return;
                }
                else
                {
                        if(loginInfo["Role"] == "Driver")
                        {
                                profileDriverPage();
                                return;
                        }
                        else
                        {
                                profilePage();
                                return;
                        }
                }
        }
        getRequest(window.location.protocol+'//'+ window.location.host +'/pages/registerPageUser.html').then(data=> {
        document.getElementById("pageContent").innerHTML = data;
});

          
}
function resetPasswordPage()//Smqna na stranica za zabravena parola
{
        if(arguments.callee.caller === null) {console.log("%c You are not permitted to use this method!!!",  'color: red'); return;}
        getRequest(window.location.protocol+'//'+ window.location.host +'/pages/resetPasswordPage.html').then(data=>{
        document.getElementById("pageContent").innerHTML = data;
});
}
function adminPanelPage()//Smqna na stranica za administratorski panel
{
        if(arguments.callee.caller === null) {console.log("%c You are not permitted to use this method!!!",  'color: red'); return;}
        getRequest(window.location.protocol+'//'+ window.location.host +'/pages/adminPanel.html').then(data=>{
        document.getElementById("pageContent").innerHTML = data;
        userRemoveTab();
});

}
function makeOrderPage()//Smqna na stranica za poruchka
{
        if(arguments.callee.caller === null) {console.log("%c You are not permitted to use this method!!!",  'color: red'); return;}
        if(loginInfo.isLoggedIn == "false") return loginPage();
        getRequest(window.location.protocol+'//'+ window.location.host +'/pages/makeOrderPage.html').then(data=>{
        document.getElementById("pageContent").innerHTML = data;
        if(!window.mobileCheck()) document.getElementById("formOrderTaxi").innerHTML =  '<input type="text" id="addressTaxi" class="form-control" placeholder="Адрес"><div class="invalid-feedback">Адресът трябва да е по-дълъг от 5 символа!</div><br><label class="text-left mt-3">Населено място: </label><select class="form-control" id="city"></select><br><textarea placeholder="Бележки(по избор)" class="form-control mt-3" id="notes" style="resize: none; height: 200px" rows="3"></textarea><br><button id="currentLocationReload" class="btn btn-primary ml-0 mt-3 black-text btn-block rounded" type="submit" onclick="updateMapAddress()">Обнови картата</button><br><button class="btn btn-primary ml-0 black-text mt-3 btn-block rounded" type="submit" onclick="makeOrderTaxiAddress()">Направи поръчка</button>';
        getAllCities();
});
}
function pageRegisterFirm()//Smqna na stranica za registraciq na firma
{
        if(arguments.callee.caller === null) {console.log("%c You are not permitted to use this method!!!",  'color: red'); return;}
        if(loginInfo["isLoggedIn"] == "true")
        {
                if(loginInfo["Type"] == "Firm")
                {
                        profileFirmPage();
                        return;
                }
                else
                {
                        if(loginInfo["Role"] == "Driver")
                        {
                                profileDriverPage();
                                return;
                        }
                        else
                        {
                                profilePage();
                                return;
                        }
                }
        }
        getRequest(window.location.protocol+'//'+ window.location.host +'/pages/registerPageFirm.html').then(data=>{
        document.getElementById("pageContent").innerHTML = data;
});
}
function homePage()//Smqna na nachalna stranica
{
        if(arguments.callee.caller === null) {console.log("%c You are not permitted to use this method!!!",  'color: red'); return;}
        hideTooltips();
        getRequest(window.location.protocol+ '//'+ window.location.host +'/pages/homePage.html').then(data=>{
        document.getElementById("pageContent").innerHTML = data;
});
          
}
function loginPage()//Smqna na stranica za vlizane na klient
{
        if(arguments.callee.caller === null) {console.log("%c You are not permitted to use this method!!!",  'color: red'); return;}
        hideTooltips();
        getRequest(window.location.protocol+'//'+ window.location.host +'/pages/loginPage.html').then(data=>{
        document.getElementById("pageContent").innerHTML = data;
});
          
}
function loginFirmPage()//Smqna na stranica za vlizane na firma
{
        if(arguments.callee.caller === null) {console.log("%c You are not permitted to use this method!!!",  'color: red'); return;}
        hideTooltips();
        getRequest(window.location.protocol+'//'+ window.location.host +'/pages/loginFirmPage.html').then(data=>{
        document.getElementById("pageContent").innerHTML = data;
});
          
}
function profilePage()//Smqna na stranica za profila na klienta
{
        if(arguments.callee.caller === null) {console.log("%c You are not permitted to use this method!!!",  'color: red'); return;}
        hideTooltips()
        getRequest(window.location.protocol+'//'+ window.location.host +'/pages/profilePage.html').then(data=>{
        document.getElementById("pageContent").innerHTML = data; getProfile(); getOrdersUser();});

}
function profileDriverPage()//Smqna na stranica za profila na shofyor
{
        if(arguments.callee.caller === null) {console.log("%c You are not permitted to use this method!!!",  'color: red'); return;}
        hideTooltips()
        getRequest(window.location.protocol+'//'+ window.location.host +'/pages/profileDriverPage.html').then(data=>{
        document.getElementById("pageContent").innerHTML = data; getProfile(); getOrdersDriver();});

}
function profileFirmPage()//Smqna na stranica za profila na firmata
{
        if(arguments.callee.caller === null) {console.log("%c You are not permitted to use this method!!!",  'color: red'); return;}
        hideTooltips();
        getRequest(window.location.protocol+'//'+ window.location.host +'/pages/profileFirmPage.html').then(data=>{
        document.getElementById("pageContent").innerHTML = data; getProfileFirm();
        getTaxiDrivers();
        getSupportedCitiesByFirm();
});
}
