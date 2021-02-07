function postRequest(url, dataPost)//Custom post zaqvka
{
    if(arguments.callee.caller === null) {console.log("%c You are not permitted to use this method!!!",  'color: red'); return;}
    var json = $.post(url, dataPost, function(data)
    {
        
    });
    return json;
}
function getRequest(url)//Custom get zaqvka
{
    if(arguments.callee.caller === null) {console.log("%c You are not permitted to use this method!!!",  'color: red'); return;}
    var json = $.get(url, function(data)
    {
        if(data=="401") refreshPage();
    });
    return json;
}