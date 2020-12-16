function refreshPage()//Refreshvane na stranicata
{
    if(arguments.callee.caller === null) return;
    window.location.href = "/";
}
function hideTooltips()//Izchistvane na tooltipovete
{
    if(arguments.callee.caller === null) return;
    $('.tooltip').tooltip('hide');
}
function changeTabOrder(radio)
{
    if(arguments.callee.caller === null) return;
    var contentTab = document.getElementById("contentTab");
    if(radio.value=="address")
    {
        contentTab.innerHTML = '<input type="text" id="addressTaxi" class="form-control" placeholder="Адрес"><div class="invalid-feedback">Адресът трябва да е по-дълъг от 5 символа!</div><br><textarea placeholder="Бележки(по избор)" class="form-control mt-3" id="notes" style="resize: none; height: 200px" rows="3"></textarea><br><button id="currentLocationReload" class="btn btn-primary ml-0 black-text btn-block rounded" type="submit" onclick="updateMapAddress()">Обнови картата</button><br><button class="btn btn-primary ml-0 black-text mt-2 btn-block rounded" type="submit" onclick="makeOrderTaxiAddress()">Направи поръчка</button>';
    }
    else 
    {
        showCurrentPosition();
        contentTab.innerHTML = '<textarea placeholder="Бележки(по избор)" class="form-control mt-3" id="notes" style="resize: none; height: 200px" rows="3"></textarea><br><button class="btn btn-primary ml-0 black-text btn-block rounded" type="submit" onclick="showCurrentPosition()">Обнови картата</button><br><button class="btn btn-primary ml-0 mt-2 black-text btn-block rounded" type="submit" onclick="makeOrderCurrentLocation()">Направи поръчка</button>';
    }
}
function collapse()//Promqna na navbara pri otvarqne i zatvarqne
{
    if(arguments.callee.caller === null) return;
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
    if(arguments.callee.caller === null) return;
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
    if(arguments.callee.caller === null) return;
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
    if(arguments.callee.caller === null) return;
    var nav = document.getElementById("navElements");
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
