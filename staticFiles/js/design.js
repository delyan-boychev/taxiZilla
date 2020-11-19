
function refreshPage()
{
    window.location.reload();
}
function hideTooltips()
{
    $('.tooltip').tooltip('hide');
}
function collapse()
{
    if($("#collapse").is(":visible"))
    {
        console.log(true);
        document.getElementById("navbar").style.setProperty("background-image", "url('http://localhost:3000/assets/img/navbar.png')");
    }
    else
    {
        console.log(false);
        document.getElementById("navbar").style.removeProperty("background-image");
    }
}
function designChangeOnStart(headers)
{
    var nav = document.getElementById("navElements");
    if(headers["isloggedin"] == "true")
    {
        if(headers["type"] == "Firm")
        {
        var a = document.getElementById("loginNav");
        var b = document.getElementById("registerNav");
        nav.removeChild(a);
        nav.removeChild(b);
        }
        else
        {
        var a = document.getElementById("loginNav");
        var b = document.getElementById("registerNav");
        nav.removeChild(a);
        nav.removeChild(b);
        nav.innerHTML += '<li class="nav-item" id="loginNav"><a class="nav-link text-secondary" onclick="document.location = \'./logout\'">Излизане</a></li> <li class="nav-item" id="loginNav"><a class="nav-link text-secondary" onclick="profilePage()">Моят профил</a></li>';
    }
   }
}
