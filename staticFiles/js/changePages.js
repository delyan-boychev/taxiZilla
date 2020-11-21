function pageRegisterUser()
{
        hideTooltips();
        $.get('http://'+ window.location.host +'/pages/registerPageUser.html', function( data, textStatus, jqXHR ) {
        document.getElementById("pageContent").innerHTML = data;
});

          
}
function pageRegisterFirm()
{
        hideTooltips();
        $.get('http://'+ window.location.host +'/pages/registerPageFirm.html', function( data, textStatus, jqXHR ) {
        document.getElementById("pageContent").innerHTML = data;
});
}
function homePage()
{
        hideTooltips();
        $.get('http://'+ window.location.host +'/pages/homePage.html', function( data, textStatus, jqXHR ) {
        document.getElementById("pageContent").innerHTML = data;
});
          
}
function loginPage()
{
        hideTooltips();
        $.get('http://'+ window.location.host +'/pages/loginPage.html', function( data, textStatus, jqXHR ) {
        document.getElementById("pageContent").innerHTML = data;
});
          
}
function loginFirmPage()
{
        hideTooltips();
        $.get('http://'+ window.location.host +'/pages/loginFirmPage.html', function( data, textStatus, jqXHR ) {
        document.getElementById("pageContent").innerHTML = data;
});
          
}
function profilePage()
{
        hideTooltips()
        $.get('http://'+ window.location.host +'/pages/profilePage.html', function( data, textStatus, jqXHR ) {
        document.getElementById("pageContent").innerHTML = data;});
        getProfile();
}
function profileFirmPage()
{
        hideTooltips()
        $.get('http://'+ window.location.host +'/pages/profileFirmPage.html', function( data, textStatus, jqXHR ) {
        document.getElementById("pageContent").innerHTML = data;});
        getProfileFirm();
}
