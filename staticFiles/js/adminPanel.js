var currrentActiveTabId = "";
function getAllUsersForRemoveTable()
{
    $.get("/auth/getAllUsers", function(json, status)
    {
        json.forEach(el => {
            if(el["email"] != profileInfo["email"])
            {
            var verified = "";
            if(el["verified"] == 1) verified = "Да";
            else verified = "Не";
            document.getElementById("bodyTable").innerHTML += `<tr><td>${el["id"]}</td><td>${el["fName"]}</td><td>${el["lName"]}</td><td>${el["email"]}</td><td>${el["telephone"]}</td><td>${el["role"]}</td><td>${el["address"]}</td><td>${verified}</td></tr>`
            }
        });
        $('#userRemoveDt').DataTable({
            "language": {
                "sProcessing":     "Обработка на данни...",
                "sSearch":         "Търсене:",
                "sLengthMenu":     "Покажи _MENU_ потребители на страница",
                "sInfo":           "Показани са _START_ до _END_ потребител от _TOTAL_ потребители",
                "sInfoEmpty":      "Показани са 0 потребители",
                "sInfoFiltered":   "(общ брой потребители - _MAX_)",
                "sInfoPostFix":    "",
                "sLoadingRecords": "Зареждане на данни...",
                "sZeroRecords":    "Няма намерени потребители!",
                "sEmptyTable":     "Няма потребители",
                "oPaginate": {
                    "sPrevious":   "Предишна страница",
                    "sNext":       "Следваща страница",
                }
            }
        });
        $('.dataTables_length').addClass('bs-select');
    });
    

}

function userRemoveTab()
{
    if(currrentActiveTabId != "") 
    {
        document.getElementById(currrentActiveTabId).classList.remove("active");
    }
    currrentActiveTabId = "userRemoveTab";
    document.getElementById(currrentActiveTabId).classList.add("active");
    $.get(window.location.protocol+'//'+ window.location.host +'/adminPanelTabs/userRemoveTab.html', function( data, textStatus, jqXHR ) {
        document.getElementById("tabContent").innerHTML = data;
        getAllUsersForRemoveTable();  
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
    $.get(window.location.protocol+'//'+ window.location.host +'/adminPanelTabs/userRemoveTab.html', function( data, textStatus, jqXHR ) {
        document.getElementById("tabContent").innerHTML = data;
});
}