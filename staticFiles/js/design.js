

let loginInfo;
function refreshPage()//Refreshvane na stranicata
{
    window.location.href = "/";
}
function hideTooltips()//Izchistvane na tooltipovete
{
    $('.tooltip').tooltip('hide');
}
function changeTabOrder(radio)
{
    var contentTab = document.getElementById("contentTab");
    if(radio.value=="address")
    {
        contentTab.innerHTML = '<input type="text" id="addressTaxi" class="form-control" placeholder="Адрес"><br><button id="currentLocationReload" class="btn btn-primary ml-0 black-text btn-block rounded" type="submit" onclick="updateMapAddress()">Обнови картата</button><br><button class="btn btn-primary ml-0 black-text mt-2 btn-block rounded" type="submit" onclick="makeOrderAddress()">Направи поръчка</button>';
    }
    else 
    {
        showCurrentPosition();
        contentTab.innerHTML = '<button class="btn btn-primary ml-0 black-text btn-block rounded" type="submit" onclick="showCurrentPosition()">Обнови картата</button><br><button class="btn btn-primary ml-0 mt-2 black-text btn-block rounded" type="submit" onclick="">Направи поръчка</button>';
    }
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
async function showCurrentPosition() 
{
    var x, y;
    if(navigator.geolocation) {
        await navigator.geolocation.getCurrentPosition(async function(position) {
            x = position.coords.longitude;
            y= position.coords.latitude;
            document.getElementById("map").src = "https://maps.google.com/maps?q="+ y + ", " + x +"&t=&z=17&ie=UTF8&iwloc=&output=embed";
        });
    }
}
function updateMapAddress()
{
    $.ajax(
        {
            async: true,
            url: "https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/findAddressCandidates",
            type: "GET",
            data:
            {
            SingleLine: $("#addressTaxi").val(),
            f: "json"
            }
        }).done(function(json) {document.getElementById("map").src = "https://maps.google.com/maps?q="+ json.candidates[0].location.y + ", " + json.candidates[0].location.x +"&t=&z=17&ie=UTF8&iwloc=&output=embed"; $([document.documentElement, document.body]).animate({
            scrollTop: $("#map").offset().top
        }, 1000);});
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
        document.getElementById("makeOrderButton").remove();
        nav.innerHTML += '<li class="nav-item" id="loginNav"><a class="nav-link text-secondary" onclick="profileFirmPage()">Моят профил</a></li><li class="nav-item" id="loginNav"><a class="nav-link text-secondary" onclick="document.location = \'./logout\'">Излизане</a></li>';
        }
        else
        {
        if(loginInfo["Role"] != "User") document.getElementById("makeOrderButton").remove();
        document.getElementById("loginNav").remove();
        document.getElementById("registerNav").remove();
        nav.innerHTML += '<li class="nav-item" id="loginNav"><a class="nav-link text-secondary" onclick="profilePage()">Моят профил</a></li><li class="nav-item" id="loginNav"><a class="nav-link text-secondary" onclick="document.location = \'./logout\'">Излизане</a></li>';
    }
   }
}
