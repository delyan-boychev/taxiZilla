let loginInfo;
function refreshPage()//Refreshvane na stranicata
{
    window.location.href = "/";
}
function hideTooltips()//Izchistvane na tooltipovete
{
    $('.tooltip').tooltip('hide');
}
function collapse()//Promqna na navbara pri otvarqne i zatvarqne
{
    if($("#collapse").is(":visible"))
    {
        console.log(true);
        document.getElementById("navbar").style.setProperty("background-image", "url('/assets/img/navbar.png')");
    }
    else
    {
        console.log(false);
        document.getElementById("navbar").style.removeProperty("background-image");
    }
}
function designChangeOnStart()//Nastroivane na dizain pri startirane
{
    var nav = document.getElementById("navElements");
    loginInfo = JSON.parse(document.getElementById("res").innerText);
    document.getElementById("res").remove();
    if(loginInfo["isLoggedIn"] == "true")
    {
        if(loginInfo["Type"] == "Firm")
        {
        document.getElementById("loginNav").remove();
        document.getElementById("registerNav").remove();
        nav.innerHTML += '<li class="nav-item" id="loginNav"><a class="nav-link text-secondary" onclick="profileFirmPage()">Моят профил</a></li><li class="nav-item" id="loginNav"><a class="nav-link text-secondary" onclick="document.location = \'./logout\'">Излизане</a></li>';
        }
        else
        {
        document.getElementById("loginNav").remove();
        document.getElementById("registerNav").remove();
        nav.innerHTML += '<li class="nav-item" id="loginNav"><a class="nav-link text-secondary" onclick="profilePage()">Моят профил</a></li><li class="nav-item" id="loginNav"><a class="nav-link text-secondary" onclick="document.location = \'./logout\'">Излизане</a></li>';
    }
   }
}
