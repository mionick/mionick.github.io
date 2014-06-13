<!--
var backgroundPosition = 0;
var header = document.getElementById("header");
window.setInterval(function () {
	backgroundPosition++;
	if (backgroundPosition > 1000)
		backgroundPosition=0;
	header.style.backgroundPosition = "0 -" + backgroundPosition + "px, 0 0";



}, 50);


-->