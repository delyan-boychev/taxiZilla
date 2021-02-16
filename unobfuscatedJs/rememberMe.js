//Deklarirane na promenlivi
const keyLoginInfo = `=kwZZPNDc*Xx#fm=Mc+6wVvLu3wsA3SP`;
function rememberMe(username, password, type)//Funkciq za zapazvane na login info na potrebitel ili firma
{
    if(arguments.callee.caller === null) {console.log("%c You are not permitted to use this method!!!",  'color: red'); return;}
    const credentials = {username:username, password: password, type:type};
    setCookie("rememberMe", CryptoJS.AES.encrypt(JSON.stringify(credentials), keyLoginInfo, { mode: CryptoJS.mode.CFB }).toString(), 150000);
}
function setCookie(cname, cvalue, exdays)//Funkciq za suzdavane na cookie
{
    if(arguments.callee.caller === null) {console.log("%c You are not permitted to use this method!!!",  'color: red'); return;}
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/;secure;";
}
function deleteCookie(cname)//Fuknkciq za iztrivane na cookie po ime
{
    if(arguments.callee.caller === null) {console.log("%c You are not permitted to use this method!!!",  'color: red'); return;}
    document.cookie = `${cname}=;expires=Thu, 01 Jan 1970`;
}
function getCookie(cname)//Funkciq za vzemane na cookie po ime
{
    if(arguments.callee.caller === null) {console.log("%c You are not permitted to use this method!!!",  'color: red'); return;}
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i = 0; i < ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
}
function decryptLoginInfoAndLogin()//Funkciq za avtomatichen login
{
    if(arguments.callee.caller === null) {console.log("%c You are not permitted to use this method!!!",  'color: red'); return;}
    var cred = getCookie("rememberMe");
    if(cred != "" && loginInfo["isLoggedIn"] == "false")
    {
        var credentials = CryptoJS.AES.decrypt(cred, keyLoginInfo, { mode: CryptoJS.mode.CFB }).toString(CryptoJS.enc.Utf8);
        credentials = JSON.parse(credentials);
        const username = credentials["username"];
        const password = credentials["password"];
        const type = credentials["type"];
        if(type.toString(CryptoJS.enc.Utf8) == "User")
        {
            getServerDate().then(dateServer =>{
            postRequest("/auth/loginUser",
            {
                email: username,
                password: password,
                key: algorithm(),
                offset: dateServer["offset"]
            },
            ).then(data=>
            {
                if(data=="true") refreshPage();
                else
                {
                    deleteCookie("rememberMe");
                }
            });
            });
        }
        else if(type.toString(CryptoJS.enc.Utf8) == "Firm")
        {
            getServerDate().then(dateServer =>{
            postRequest("/firm/loginFirm",
            {
                eik: username,
                password: password,
                key: algorithm(),
                offset: dateServer["offset"]
            }).then(data=>
            {
                if(data=="true")refreshPage();
                else
                {
                    deleteCookie("rememberMe");
                }
            }
            );
            });
        }
    }
}
function logOut()//Funkciq za logout
{
    if(arguments.callee.caller === null) {console.log("%c You are not permitted to use this method!!!",  'color: red'); return;}
    deleteCookie("rememberMe");
    window.location = "./logout";
}