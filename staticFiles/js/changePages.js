function pageRegisterUser()//Smqna na stranica za registraciq na klient
{
        hideTooltips();
        $.get('http://'+ window.location.host +'/pages/registerPageUser.html', function( data, textStatus, jqXHR ) {
        document.getElementById("pageContent").innerHTML = data;
});

          
}
function pageRegisterFirm()//Smqna na stranica za registraciq na firma
{
        hideTooltips();
        $.get('http://'+ window.location.host +'/pages/registerPageFirm.html', function( data, textStatus, jqXHR ) {
        document.getElementById("pageContent").innerHTML = data;
});
}
function homePage()//Smqna na nachalna stranica
{
        hideTooltips();
        $.get('http://'+ window.location.host +'/pages/homePage.html', function( data, textStatus, jqXHR ) {
        document.getElementById("pageContent").innerHTML = data;
});
          
}
function loginPage()//Smqna na stranica za vlizane na klient
{
        hideTooltips();
        $.get('http://'+ window.location.host +'/pages/loginPage.html', function( data, textStatus, jqXHR ) {
        document.getElementById("pageContent").innerHTML = data;
});
          
}
function loginFirmPage()//Smqna na stranica za vlizane na firma
{
        hideTooltips();
        $.get('http://'+ window.location.host +'/pages/loginFirmPage.html', function( data, textStatus, jqXHR ) {
        document.getElementById("pageContent").innerHTML = data;
});
          
}
function profilePage()//Smqna na stranica za profila na klienta
{
        hideTooltips()
        $.get('http://'+ window.location.host +'/pages/profilePage.html', function( data, textStatus, jqXHR ) {
        document.getElementById("pageContent").innerHTML = data;});
        getProfile();
}
function profileFirmPage()//Smqna na stranica za profila na firmata
{
        hideTooltips()
        $.get('http://'+ window.location.host +'/pages/profileFirmPage.html', function( data, textStatus, jqXHR ) {
        document.getElementById("pageContent").innerHTML = data;});
        getProfileFirm();
        getTaxiDrivers();
}
