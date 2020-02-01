console.log('did it');
/*
what if humans were the second highest form of life on earth.
what if there ws a species that's just WAYY bigger than us, but still visible. 

like giants or gods or titans

and we're still the same us so sentient smart whatever

"An overlord stepped on my house again today."
an insurance guy just "Sorry mam we dont cover acts by the overlords."



I think life would be so impressive at that size.
*/



let KeyCode = {};
KeyCode.KEY_LEFT = 37;
KeyCode.KEY_UP = 38;
KeyCode.KEY_RIGHT = 39;
KeyCode.KEY_DOWN = 40;
KeyCode.KEY_PAGE_UP = 33;
KeyCode.KEY_PAGE_DOWN = 34;
KeyCode.KEY_X = 88;
KeyCode.KEY_Z = 90;


// mandelbrot
// f(X) = X^2 + c
// coordinate is not c. coordinate is x0


function nextX(x, c) {
    return x.mul(x).add(c);
}

function mandelbrot(x, c) {
    let stop = false;
    let i = 0;
    for(i = 0; i < maxIterations && !stop; i++) {
        x = nextX(x, c);
        //if (!x.isFinite()) {
        if (x.abs() > maxAllowed) {
            stop = true;
        }
    }

    return [i, x];
}

function getColorIndicesForCoord(x, y, width) {
    var red = y * (width * 4) + x * 4;
    return [red, red + 1, red + 2, red + 3];
}

function drawPixel(myContext, x, y, r, g, b, a) {
    let id = myContext.createImageData(1,1); // only do this once per page
    let d  = id.data;                        // only do this once per page
    d[0]   = r;
    d[1]   = g;
    d[2]   = b;
    d[3]   = a;
    myContext.putImageData( id, x, y );
}

function relMouseCoords(event){

    return {
        x : (event.clientX - dispRect.x) * width / dispRect.width,
        y : (event.clientY - dispRect.y) * height / dispRect.height
    };


    var totalOffsetX = 0;
    var totalOffsetY = 0;
    var canvasX = 0;
    var canvasY = 0;
    var currentElement = this;

    do{
        totalOffsetX += currentElement.offsetLeft - currentElement.scrollLeft;
        totalOffsetY += currentElement.offsetTop - currentElement.scrollTop;
    }
    while(currentElement = currentElement.offsetParent)

    canvasX = event.pageX - totalOffsetX;
    canvasY = event.pageY - totalOffsetY;

    return {x:canvasX, y:canvasY}
}
HTMLCanvasElement.prototype.relMouseCoords = relMouseCoords;


function render() {
    for (let i = 0; i < width; i+=1) {
        for (let j = 0; j < height; j+=1) {
            let cmp = new Complex(magnification*(i / width - 0.5) - x,magnification*(j / height - 0.5) - y);
            let current = mandelbrot(new Complex(0,0), cmp);
            if (current[0] < maxIterations) {
                // Then it escaped
                //draw pixel here dark.
                let factor = Math.sqrt(current[0] / maxIterations);
                let color = Math.floor(factor * 255);//current[1].abs() * 500 ;
                
                //ctx.fillStyle = `rgb(${Math.floor(color/2)}, ${Math.floor(color/2)}, ${Math.floor(color/2)})`;
                ctx.fillStyle = `rgb(${color}, ${color}, ${color})`;
                ctx.fillRect( i, j, 1, 1 );
            } else {
                //ctx.fillStyle = `rgb(255, 255, 255)`;
                ctx.fillStyle = `rgb(0, 0, 0)`;
                ctx.fillRect( i, j, 1, 1 );
            }
    
        }
    }
}

function zoomIn() {
    magnification = magnification * 0.9;
    clearTimeout(timeoutId);
    timeoutId = setTimeout(render, 0);
}


function zoomOut() {
    magnification = magnification * 1.1;
    clearTimeout(timeoutId);
    timeoutId = setTimeout(render, 0);
}

// ------------------------- MAIN -------------------------
let canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

let val = new Complex(0,0);
let dots = [];
let height = 200.0;
let width = 200.0;
let dispRect = canvas.getBoundingClientRect();


let c = new Complex(0.3, 0.2);
let maxIterations = 200;
let maxAllowed = 100;

let x = 0.8;
let y = 0;
let magnification = 2;

render()

let move_factor = 0.001;

let timeoutId;
document.addEventListener("keydown", event => {
    if (event.isComposing || event.keyCode === 229) {
      return;
    }
    // do something
    if (event.keyCode === KeyCode.KEY_LEFT) {
        x += (move_factor) * magnification;
        clearTimeout(timeoutId);
        timeoutId = setTimeout(render, 0);
    } else if (event.keyCode === KeyCode.KEY_RIGHT) {
        x -= (move_factor) * magnification;
        clearTimeout(timeoutId);
        timeoutId = setTimeout(render, 0);
    } else if (event.keyCode === KeyCode.KEY_UP) {
        y += (move_factor) * magnification;
        clearTimeout(timeoutId);
        timeoutId = setTimeout(render, 0);
    } else if (event.keyCode === KeyCode.KEY_DOWN) {
        y -= (move_factor) * magnification;
        clearTimeout(timeoutId);
        timeoutId = setTimeout(render, 0);
    } else if (event.keyCode === KeyCode.KEY_X) {
        zoomIn();
    } else if (event.keyCode === KeyCode.KEY_Z) {
        zoomOut();
    } 
});
canvas.addEventListener('click', function(e) { 

    console.log("click at: ");
    let coords = canvas.relMouseCoords(e);
    let clickX  = coords.x;
    let clickY  = coords.y;
    console.log(clickY);
    console.log(clickY);
    let dx = ((clickX / width) - 0.5 ) * magnification;
    let dy = ((clickY / height) - 0.5) * magnification;
    console.log(dx);
    console.log(dy);

    x -= dx;
    y -= dy;
    console.log(x);
    console.log(y);

    clearTimeout(timeoutId);
    timeoutId = setTimeout(render, 0);
}, false);



/*
nice coords:
0.4680550207308777
0.5416627210156446
*/




