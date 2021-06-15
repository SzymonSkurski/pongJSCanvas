let elements2d = []; //store all 2d elements


/**
 * returns a random number between min and max (both included)
 * @param min
 * @param max
 * @returns {*}
 */
function randInt(min, max)
{
    return Math.floor(Math.random() * (max - min + 1) ) + min;
}

function range(start, end) {
    let r = [];
    if (start === end) {
        return r;
    }
    let s = Math.min(start, end);
    let e = Math.max(start, end);
    while(s <= e) {
        r.push(s);
        s++;
    }
    return r;
};

function addDrone() {
    let drone = new Drone(elements2d.length || 0);
    // drone.setRandomRGB();
    drone.setRGBFoF();
    drone.setRandomXY();
    drone.setRandomVectors();
    elements2d.push(drone);
}

function clearCanvas(id = 'play') {
    let canvas = document.getElementById(id);
    let ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function drawBoardLine() {
    let id = 'board'
    let canvas = document.getElementById(id);
    let w = canvas.width - 1;
    let cmx = getCanvasMiddleX(id);
    let s = w % 2 === 0 ? 2 : 1; //even board has 2 px line
    let ctx = canvas.getContext('2d');
    //draw dashed line in middle
    while (s > 0) {
        s--;
        ctx.beginPath();
        ctx.setLineDash([5, 15]);
        ctx.moveTo(cmx + s, 0);
        ctx.lineTo(cmx + s, canvas.height);
        ctx.stroke();
    }
}

function getCanvasMiddleX(id = 'board') {
    let w = document.getElementById(id).width - 1;
    return w % 2 === 0 ? Math.floor(w / 2) : Math.ceil(w / 2); //middle x
}

function drawBoardPoints() {
    let id = 'board';
    let p1 = 2;
    let p2 = 2;
    let mx = getCanvasMiddleX(id);
    let canvas = document.getElementById(id);
    let size = Math.ceil(canvas.width * 0.08);
    let space = Math.ceil(size / 2);
    let ctx = canvas.getContext('2d');
    ctx.font = size + "px Courier New CE";
    ctx.fillText(p1, mx - size, size);
    ctx.fillText(p2, mx + space, size);
    console.log(size);
}

function drawBoard() {
    let canvas = document.getElementById('board');
    let ctx = canvas.getContext('2d');
    ctx.fillStyle = 'white';
    ctx.strokeStyle = "white";
    drawBoardLine();
    drawBoardPoints();
}

// function run() {
//     clearCanvas();
//     elements2d.forEach(function(el) {
//         if (!el) {
//             return;
//         }
//         if (el.size < 1) {
//             el.destroy();
//             return;
//         }
//         el.move();
//         el.addMSLC(); //count moves since last colision
//         el.colisions();
//         el.draw();
//     });
// };
//
// let d = 100;
// while (d > 0) {
//     addDrone();
//     d--;
// }
// setInterval(run, 33);
drawBoard();