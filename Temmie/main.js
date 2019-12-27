let rightEye = document.getElementById('right-eye')
let leftEye = document.getElementById('left-eye')
let svg = document.getElementById("temmie");
let leftMax = 50;
let rightMax = 70;

const svgBaseWidth = 2225;
const svgBaseHeight = 2000;
const svgPosition = offset(svg);

let centerOfEyesX = svgPosition.left + 1350 * svg.clientWidth / svgBaseWidth;
let centerOfEyesY = svgPosition.top + 500 * svg.clientHeight / svgBaseHeight;

let centerOfRightEyeX = svgPosition.left + 1560 * svg.clientWidth / svgBaseWidth;
let centerOfRightEyeY = svgPosition.top + 475 * svg.clientHeight / svgBaseHeight;

let centerOfLeftEyeX = svgPosition.left + 1140 * svg.clientWidth / svgBaseWidth;
let centerOfLeftEyeY = svgPosition.top + 495 * svg.clientHeight / svgBaseHeight;

let rCent = new Vector(centerOfRightEyeX, centerOfRightEyeY, 0);
let lCent = new Vector(centerOfLeftEyeX, centerOfLeftEyeY, 0);

function offset(el) {
    let rect = el.getBoundingClientRect(),
    scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
    scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    return { top: rect.top + scrollTop, left: rect.left + scrollLeft }
}

function moveEyes(e) {
    let x = (e.clientX);
    let y = (e.clientY);

    let cursor = new Vector(x, y, 50);

    let leftV = cursor.subtract(lCent);
    let rightV = cursor.subtract(rCent);

    Vector.multiply(leftV, leftMax/leftV.length(), leftV);
    Vector.multiply(rightV, rightMax/rightV.length(), rightV);

    leftEye.style.transform = `translate(${leftV.x}px, ${leftV.y}px)`;
    rightEye.style.transform = `translate(${rightV.x}px, ${rightV.y}px)`;

}