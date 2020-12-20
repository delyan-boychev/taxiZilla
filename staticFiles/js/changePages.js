function pageRegisterUser()//Smqna na stranica za registraciq na klient
{
        if(arguments.callee.caller === null) {console.log("%c You are not permitted to use this method!!!",  'color: red'); return;}
        hideTooltips();
        $.get(window.location.protocol+'//'+ window.location.host +'/pages/registerPageUser.html', function( data, textStatus, jqXHR ) {
        document.getElementById("pageContent").innerHTML = data;
});

          
}
function makeOrderPage()//Smqna na stranica za poruchka
{
        if(arguments.callee.caller === null) {console.log("%c You are not permitted to use this method!!!",  'color: red'); return;}
        if(loginInfo.isLoggedIn == "false") return loginPage();
        hideTooltips();
        $.get(window.location.protocol+'//'+ window.location.host +'/pages/makeOrderPage.html', function( data, textStatus, jqXHR ) {
        document.getElementById("pageContent").innerHTML = data;
        if(!window.mobileCheck()) document.getElementById("formOrderTaxi").innerHTML =  '<input type="text" id="addressTaxi" class="form-control" placeholder="Адрес"><div class="invalid-feedback">Адресът трябва да е по-дълъг от 5 символа!</div><br><textarea placeholder="Бележки(по избор)" class="form-control mt-3" id="notes" style="resize: none; height: 200px" rows="3"></textarea><br><button id="currentLocationReload" class="btn btn-primary ml-0 mt-3 black-text btn-block rounded" type="submit" onclick="updateMapAddress()">Обнови картата</button><br><button class="btn btn-primary ml-0 black-text mt-3 btn-block rounded" type="submit" onclick="makeOrderTaxiAddress()">Направи поръчка</button>';
       
});
}
function pageRegisterFirm()//Smqna na stranica za registraciq na firma
{
        if(arguments.callee.caller === null) {console.log("%c You are not permitted to use this method!!!",  'color: red'); return;}
        hideTooltips();
        $.get(window.location.protocol+'//'+ window.location.host +'/pages/registerPageFirm.html', function( data, textStatus, jqXHR ) {
        document.getElementById("pageContent").innerHTML = data;
});
}
function homePage()//Smqna na nachalna stranica
{
        if(arguments.callee.caller === null) {console.log("%c You are not permitted to use this method!!!",  'color: red'); return;}
        hideTooltips();
        $.get(window.location.protocol+ '//'+ window.location.host +'/pages/homePage.html', function( data, textStatus, jqXHR ) {
        document.getElementById("pageContent").innerHTML = data;
});
          
}
function loginPage()//Smqna na stranica za vlizane na klient
{
        if(arguments.callee.caller === null) {console.log("%c You are not permitted to use this method!!!",  'color: red'); return;}
        hideTooltips();
        $.get(window.location.protocol+'//'+ window.location.host +'/pages/loginPage.html', function( data, textStatus, jqXHR ) {
        document.getElementById("pageContent").innerHTML = data;
});
          
}
function loginFirmPage()//Smqna na stranica za vlizane na firma
{
        if(arguments.callee.caller === null) {console.log("%c You are not permitted to use this method!!!",  'color: red'); return;}
        hideTooltips();
        $.get(window.location.protocol+'//'+ window.location.host +'/pages/loginFirmPage.html', function( data, textStatus, jqXHR ) {
        document.getElementById("pageContent").innerHTML = data;
});
          
}
function profilePage()//Smqna na stranica za profila na klienta
{
        if(arguments.callee.caller === null) {console.log("%c You are not permitted to use this method!!!",  'color: red'); return;}
        hideTooltips()
        $.get(window.location.protocol+'//'+ window.location.host +'/pages/profilePage.html', function( data, textStatus, jqXHR ) {
        document.getElementById("pageContent").innerHTML = data; getProfile();});

}
function profileFirmPage()//Smqna na stranica za profila na firmata
{
        if(arguments.callee.caller === null) {console.log("%c You are not permitted to use this method!!!",  'color: red'); return;}
        hideTooltips();
        $.get(window.location.protocol+'//'+ window.location.host +'/pages/profileFirmPage.html', function( data, textStatus, jqXHR ) {
        document.getElementById("pageContent").innerHTML = data; getProfileFirm();
        getTaxiDrivers();});
}
