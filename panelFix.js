<!--
//adjusting width of panels
//global variables:
function panelResize() {
    var hash = window.location.hash;
    var curWidth = window.innerWidth;

    //adjusting homepage regardless of panel open
    var home = document.getElementById("home");
    if(curWidth>1067) {
        home.style.width = curWidth - 320 + "px";
        home.style.padding = "0";
        home.style.marginLeft = "320px";
    } else if(curWidth<733) {
        home.style.width = curWidth - 220 + "px";
        home.style.padding = "0";
        home.style.marginLeft = "220px";
    } else {
        home.style.width = "70%";
        home.style.padding = "0";
        home.style.marginLeft = "30%";
    }


    if (hash != "") {

        var targetId = hash.substring(1, hash.length);
        target = document.getElementById(targetId);        //the actual element
        var panels = document.getElementsByClassName("firstpanel");

        for (i = 0; i<panels.length; i++){ //loop through panels

            //panels[i] is target
            if(curWidth>1067) {
                //HUGE
                panels[i].style.width = curWidth - 380 + "px";
                panels[i].style.padding = "0 30px";    
                panels[i].style.marginLeft = "320px";
            } else if(curWidth<733) {
                //SMALL
                panels[i].style.width = curWidth - 220 + "px";
                panels[i].style.padding = "0";    
                panels[i].style.marginLeft = "220px";
            } else {
                //RESPONSIVE
                panels[i].style.width = "66%";
                panels[i].style.padding = "0 2%";
                panels[i].style.marginLeft = "30%";
            }
            if (panels[i].getAttribute('id') != targetId) 
            {
                panels[i].style.marginLeft = "-" + curWidth + "px"; //not matching, not showing
            }
        
        }
    }
}



//Adding Event listeners.
if(window.addEventListener) {
    window.addEventListener('resize', panelResize, false);
    window.addEventListener('load', panelResize, false);
} else if(window.attachEvent) {
    window.attachEvent('onresize', panelResize);
    window.attachEvent('onload', panelResize);
}

if ("onhashchange" in window) { // event supported?
    window.onhashchange = function () {
        panelResize();
    }
}
else { // event not supported:
    var storedHash = window.location.hash;
    window.setInterval(function () {
        if (window.location.hash != storedHash) {
            storedHash = window.location.hash;
            panelResize();
        }
    }, 100);
}
-->