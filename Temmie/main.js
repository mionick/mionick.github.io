let rightEye = document.getElementById('right-eye')
let leftEye = document.getElementById('left-eye')
let svg = document.getElementById("temmie");
let leftMax = 50;
let RightMax = 70;

let boxHeight = svg.clientHeight;
let boxWidth = window.innerWidth;

let centerOfEyesX = (offset(svg).top + 1350 * svg.clientWidth / 2300) / boxWidth;
let centerOfEyesY = (offset(svg).left + 500 * svg.clientHeight / 2000) / boxHeight;

let centerOfRightEyeX = (offset(svg).top + 1560 * svg.clientWidth / 2300) / boxWidth;
let centerOfRightEyeY = (offset(svg).left + 475 * svg.clientHeight / 2000) / boxHeight;

let centerOfLeftEyeX = (offset(svg).top + 1140 * svg.clientWidth / 2300) / boxWidth;
let centerOfLeftEyeY = (offset(svg).left + 495 * svg.clientHeight / 2000) / boxHeight;


function offset(el) {
    let rect = el.getBoundingClientRect(),
    scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
    scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    return { top: rect.top + scrollTop, left: rect.left + scrollLeft }
}

function mag(x, y) {
    return Math.sqrt(x*x + y*y);
}


function moveEyes(e) {
    let x = (e.clientX / boxWidth);
    let y = (e.clientY / boxHeight);

    yOffset = y - centerOfEyesY;
    xLeftOffset = x - centerOfLeftEyeX;
    xRightOffset = x - centerOfRightEyeX;

    let xLeftPercent;
    let yLeftPercent;
    let xRightPercent;
    let yRightPercent;

    if (yOffset < 0) {
        yLeftPercent = yOffset / (centerOfEyesY)
    } else {
        yLeftPercent = yOffset / (1 - centerOfEyesY)
    }

    if (xLeftOffset < 0) {
        xLeftPercent = xLeftOffset / (centerOfLeftEyeX)
    } else {
        xLeftPercent = xLeftOffset / (centerOfEyesX - centerOfLeftEyeX)
    }
    
    if (xRightOffset < 0) {
        xRightPercent = xRightOffset / (centerOfRightEyeX - centerOfEyesX)
    } else {
        xRightPercent = xRightOffset / (1 - (centerOfRightEyeX - centerOfEyesX))
    }

    //yLeftPercent = Math.max(Math.min(x, 1), -1);
    xLeftPercent = Math.max(Math.min(xLeftPercent, 1), -1);
    xRightPercent = Math.max(Math.min(xRightPercent, 1), -1);
    //xLeftPercent = Math.max(Math.min(xRightPercent, 1), -1);

    leftMag = mag(xLeftPercent, yLeftPercent);
    rightMag = mag(xRightPercent, yLeftPercent);

    // xRightPercent = xRightPercent / rightMag; 
    // yRightPercent = yLeftPercent / rightMag;

    // xLeftPercent = xLeftPercent / leftMag; 
    // yLeftPercent = yLeftPercent / leftMag; 

    leftEye.style.transform = `translate(${(xLeftPercent) * leftMax}px, ${(yLeftPercent) * leftMax}px)`;
    rightEye.style.transform = `translate(${(xRightPercent) * RightMax}px, ${(yLeftPercent) * RightMax}px)`;
}