function generateString(length) 
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
function algorithm()
{
    if(arguments.callee.caller === null) {console.log("%c You are not permitted to use this method!!!",  'color: red'); return;}
    var d = new Date();
    var data = d.getUTCFullYear() + ("0" + d.getUTCDate()).slice(-2) + ("0" + d.getUTCMonth()+1).slice(-2) + ("0" + d.getUTCHours()).slice(-2) + ("0" + d.getUTCMinutes()).slice(-2) + ("0" + 
    d.getUTCSeconds()).slice(-2);
    console.log(data);
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