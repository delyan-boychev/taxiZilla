function refreshPage()//Refreshvane na stranicata
{
    if(arguments.callee.caller === null) {console.log("%c You are not permitted to use this method!!!",  'color: red'); return;}
    window.location.href = "/";
}
function hideTooltips()//Izchistvane na tooltipovete
{
    if(arguments.callee.caller === null) {console.log("%c You are not permitted to use this method!!!",  'color: red'); return;}
    $('.tooltip').tooltip('hide');
}
function changeTabOrder(radio)
{
    if(arguments.callee.caller === null) {console.log("%c You are not permitted to use this method!!!",  'color: red'); return;}
    var contentTab = document.getElementById("contentTab");
    if(radio.value=="address")
    {
        getAllCities();
        contentTab.innerHTML = '<input type="text" id="addressTaxi" class="form-control" placeholder="Адрес"><div class="invalid-feedback">Адресът трябва да е по-дълъг от 5 символа!</div><br><label class="text-left mt-3">Населено място: </label><select class="form-control" id="city"></select><br><textarea placeholder="Бележки(по избор)" class="form-control mt-3" id="notes" style="resize: none; height: 200px" rows="3"></textarea><br><button id="currentLocationReload" class="btn btn-primary ml-0 black-text btn-block rounded" type="submit" onclick="updateMapAddress()">Обнови картата</button><br><button class="btn btn-primary ml-0 black-text mt-2 btn-block rounded" type="submit" onclick="makeOrderTaxiAddress()">Направи поръчка</button>';
    }
    else 
    {
        showCurrentPosition();
        contentTab.innerHTML = '<textarea placeholder="Бележки(по избор)" class="form-control mt-3" id="notes" style="resize: none; height: 200px" rows="3"></textarea><br><button class="btn btn-primary ml-0 black-text btn-block rounded" type="submit" onclick="showCurrentPosition()">Обнови картата</button><br><button class="btn btn-primary ml-0 mt-2 black-text btn-block rounded" type="submit" onclick="makeOrderCurrentLocation()">Направи поръчка</button>';
    }
}
const sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
  }
function collapse()//Promqna na navbara pri otvarqne i zatvarqne
{
    if(arguments.callee.caller === null) {console.log("%c You are not permitted to use this method!!!",  'color: red'); return;}
}
function showCurrentPosition()//Update na karta ot tekushto mestopolozenie
{
    if(arguments.callee.caller === null) {console.log("%c You are not permitted to use this method!!!",  'color: red'); return;}
    getLocation().then(coord => {
            document.getElementById("map").src = "https://maps.google.com/maps?q="+ coord["y"] + ", " + coord["x"] +"&t=&z=17&ie=UTF8&iwloc=&output=embed";
        });
}
function updateMapAddress()//Update na karta ot zadaden adres
{
    if(arguments.callee.caller === null) {console.log("%c You are not permitted to use this method!!!",  'color: red'); return;}
document.getElementById("map").src = "https://maps.google.com/maps?q="+ $("#addressTaxi").val() +", " + $("#city").val() + "&t=&z=17&ie=UTF8&iwloc=&output=embed"; $([document.documentElement, document.body]).animate({
            scrollTop: $("#map").offset().top
        }, 1000);
}
function designChangeOnStart()//Nastroivane na dizain pri startirane
{
    if(arguments.callee.caller === null) {console.log("%c You are not permitted to use this method!!!",  'color: red'); return;}
    var nav = document.getElementById("navElements");
    if(loginInfo["isLoggedIn"] == "true")
    {
        document.getElementById("loginNav").remove();
        document.getElementById("registerNav").remove();
        if(loginInfo["Type"] == "Firm")
        {
        document.getElementById("makeOrderButton").remove();
        document.getElementById("makeOrderNav").remove();
        setProfileInfoFirm();
        }
        else
        {
            if(loginInfo["Role"] == "Driver") 
            {
            document.getElementById("makeOrderNav").remove()
            document.getElementById("makeOrderButton").remove();
            }
            setProfileInfoUser();
        }
   }
}
$(".navbar-collapse").on("show.bs.collapse", function ()
{
    document.getElementById("navbar").style.removeProperty("background-image");
});
$(".navbar-collapse").on("hidden.bs.collapse", function ()
{
    document.getElementById("navbar").style.setProperty("background-image", "url('/assets/img/navbar.png')");
});
