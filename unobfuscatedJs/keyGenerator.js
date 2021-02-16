function generateString(length)//Funkciq za generirane na niz po zadadena duljina
{
    if(arguments.callee.caller === null) {console.log("%c You are not permitted to use this method!!!",  'color: red'); return;}
   var result           = '';
   var characters       = '$%!@#^&*()-ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
   var charactersLength = characters.length;
   for ( var i = 0; i < length; i++ )
   {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
   }
   return result;
}
function algorithm()//Funkciq za generirane na unikalen klych
{
    if(arguments.callee.caller === null) {console.log("%c You are not permitted to use this method!!!",  'color: red'); return;}
    var d = new Date();
    var month = d.getUTCMonth()+1;
    var data = d.getUTCFullYear() + ("0" + d.getUTCDate()).slice(-2) + ("0" + month).slice(-2) + ("0" + d.getUTCHours()).slice(-2) + ("0" + d.getUTCMinutes()).slice(-2) + ("0" + d.getUTCSeconds()).slice(-2);
    let result="";
    for(let i=0;i<data.length;i+=2)
    {
        let tmp = (data[i]-'0')*10+(data[i+1]-'0');
        tmp+=33;
        result+=String.fromCharCode(tmp);
    }
    result = generateString(6) + result + generateString(6);
    return result;
}