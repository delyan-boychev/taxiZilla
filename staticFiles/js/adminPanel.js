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
            document.getElementById("bodyTable").innerHTML += `<tr><td>${el["id"]}</td><td>${el["fName"]}</td><td>${el["lName"]}</td><td>${el["email"]}</td><td>${el["telephone"]}</td><td>${el["role"]}</td><td>${el["address"]}</td><td>${verified}</td><td><i class='far fa-times-circle text-danger h5' style='cursor: pointer;' onclick='removeUserShowModal("${el["id"]}");'></i></td></tr>`
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
function removeUserShowModal(id)
{
    document.getElementById("modalAdminBody").innerText = `Сигурни ли сте, че искате да премахнете потребител с ID-${id}?`;
    document.getElementById("modalAdminButton").onclick = function() {removeUser(id); $("#modalAdmin").modal('hide');};
    $("#modalAdmin").modal();
}
function removeUser(id)
{
    if(arguments.callee.caller === null) {console.log("%c You are not permitted to use this method!!!",  'color: red'); return;}
    $.post("/auth/removeUser", 
    {
        userid: id,
    },
    function(data, status)
    {
        document.getElementById("modalBody").innerText = "Успешно е премахнат потребител!";
        actionOnCloseModal = userRemoveTab;
        $("#modal").modal();
    }
    );
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