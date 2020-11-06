
function collapse()
{
    if($("#collapse").is(":visible"))
    {
        console.log(true);
         document.getElementById("navbar").style.setProperty("background-image", "url('http://localhost:3000/assets/img/navbar.png')");
    }
    else
    {
        console.log(false);
        document.getElementById("navbar").style.removeProperty("background-image");
    }
}