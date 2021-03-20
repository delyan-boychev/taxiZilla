//Deklarirane na promenlivi
var settings = {
  title: "Бисквитки",
  message: 'Този сайт използва бисквитки! С кликването на бутона отдолу се съгласявате с използването им!',
  moreLinkLabel: '',
  messageMaxHeightPercent: 30,
  delay: 1000,
  acceptButtonLabel: "Приемам"
}
//Zarejdane na kod pri otvarqne na prilozenieto
$(document).ready(function()
{
  setLoginInfo();
  homePage();
  decryptLoginInfoAndLogin(false);
  designChangeOnStart();
  $('body').bsgdprcookies(settings);

  $('#cookiesBtn').on('click', function(){
      $('body').bsgdprcookies(settings, 'reinit');
  });
  setTimeout(function(){checkForLastPage();}, 500);
}
);
