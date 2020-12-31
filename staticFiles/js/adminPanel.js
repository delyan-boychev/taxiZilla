var currrentActiveTabId = "";
function userRemoveTab()
{
    if(currrentActiveTabId != "") 
    {
        document.getElementById(currrentActiveTabId).classList.remove("active");
    }
    currrentActiveTabId = "userRemoveTab";
    document.getElementById(currrentActiveTabId).classList.add("active");
    $.get(window.location.protocol+'//'+ window.location.host +'/assets/adminPanelTabs/userRemoveTab.html', function( data, textStatus, jqXHR ) {
        document.getElementById("tabContent").innerHTML = data;
});

}
function userEditTab()
{
    if(currrentActiveTabId != "") 
    {
        document.getElementById(currrentActiveTabId).classList.remove("active");
    }
    currrentActiveTabId = "userEditTab";
    document.getElementById(currrentActiveTabId).classList.add("active");
    $.get(window.location.protocol+'//'+ window.location.host +'/assets/adminPanelTabs/userRemoveTab.html', function( data, textStatus, jqXHR ) {
        document.getElementById("tabContent").innerHTML = data;
});
}