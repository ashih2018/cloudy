
// Tab functionality inspired from https://www.w3schools.com/howto/tryit.asp?filename=tryhow_js_tabs
function openTab(evt, langName, id) {
  let i, tabcontent, tablinks;
  const selector = $(id);
  tabcontent = selector.find(".tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }
  tablinks = selector.find(".tablinks")
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }
  selector.find(langName)[0].style.display = "block";
  evt.currentTarget.className += " active";
}