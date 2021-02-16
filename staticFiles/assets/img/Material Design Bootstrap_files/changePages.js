function pageRegisterUser()
{$.get('http://'+ window.location.host +'/pages/registerPageUser.html', function( data, textStatus, jqXHR ) {
        document.getElementById("pageContent").innerHTML = data;
});
          
}
function homePage()
{$.get('http://'+ window.location.host +'/pages/homePage.html', function( data, textStatus, jqXHR ) {
        document.getElementById("pageContent").innerHTML = data;
});
          
}
