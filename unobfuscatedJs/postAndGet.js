function postRequest(url, dataPost)//Custom post zaqvka
{
    if (arguments.callee.caller === null) { console.log("%c You are not permitted to use this method!!!", 'color: red'); return; }
    var json = $.post(url, dataPost, function (data) {
        if (data == "401") {
            localStorage.setItem("isReLogged", "true");
            document.getElementById("pageContent").innerHTML = `<div class="text-center mt-3">
            <div class="spinner-grow mt-3 text-primary text-center" style="width: 17rem; height: 17rem;" role="status">
                <img src="./assets/img/logo300x300.png" class="text-center" style="height: 220px; width:220px;">
            </div>
        </div>`;
            decryptLoginInfoAndLogin(true);
        }
    });
    return json;
}
function getRequest(url)//Custom get zaqvka
{
    if (arguments.callee.caller === null) { console.log("%c You are not permitted to use this method!!!", 'color: red'); return; }
    var json = $.get(url, function (data) {

        if (data == "401") {
            localStorage.setItem("isReLogged", "true");
            document.getElementById("pageContent").innerHTML = `<div class="text-center mt-3">
            <div class="spinner-grow mt-3 text-primary text-center" style="width: 17rem; height: 17rem;" role="status">
                <img src="./assets/img/logo300x300.png" class="text-center" style="height: 220px; width:220px;">
            </div>
        </div>`;
           decryptLoginInfoAndLogin(true);
        }
    });
    return json;
}