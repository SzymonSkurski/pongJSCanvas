let elements2d = []; //store all 2d elements
let ballId = -1;
let p1 = 0;
let p2 = 0;
let lastScored = 0; //0 - no one; 1 - left; 2 -right
let rLeft = null;
let rRight = null;
let maxP = 5;
let game = 0;
let touchLastX = 0;
let touchLastY = 0;

//keys listener
document.onkeydown = (e) => {
    let key = e.key;
    //any key
    document.getElementById('manual').style.display = "none";
    if (key === 'w') {
        racketMoveUp(getRacketLeft());
    }
    if (key === 's') {
        racketMoveDown(getRacketLeft());
    }
    if (key === 'ArrowUp') {
        e.preventDefault();
        racketMoveUp(getRacketRight());
    }
    if (key === 'ArrowDown') {
        e.preventDefault();
        racketMoveDown(getRacketRight());
    }
    if (key === 'Enter') restart();
    if (key === 'Escape') {
        clearInterval(game);
        game = 0;
    }
}
document.onkeyup = (e) => {
    let key = e.key;
    if (key === 'w') {
        getRacketLeft().vectorY = 0;
    }
    if (key === 's') {
        getRacketLeft().vectorY = 0;
    }
    if (key === 'ArrowUp') {
        getRacketRight().vectorY = 0;
    }
    if (key === 'ArrowDown') {
        getRacketRight().vectorY = 0;
    }
}

function racketMoveUp(racket) {
    racket.vectorY = -getAspect();
    racket.controlAI = false;
}

function racketMoveDown(racket) {
    racket.vectorY = getAspect();
    racket.controlAI = false;
}

document.addEventListener('click', manualClose);
document.getElementById('play').addEventListener('touchstart', (e) => {
    touch(e);
    manualClose();
    restart();
});

document.getElementById('play').addEventListener('touchend', (e) => {
    e.preventDefault();
    touchOver();
});

document.getElementById('play').addEventListener('touchcancel', (e) => {
    e.preventDefault();
    touchOver();
});

document.getElementById('play').addEventListener('touchmove', (e) => {
    e.preventDefault();
    touch(e);
});

window.addEventListener("orientationchange", function() {
    // screen.orientation.angle 90 | 180 is preferred
    //TODO:: rotate screen on mobile; display notification rotate
});

function manualClose() {
    document.getElementById('manual').style.display = 'none';
}

function touchOver() {
    let x = touchLastX;
    if (!touchLastX) return;
    let r = getRacketDependOnSide(x);
    r.vectorY = 0;
    touchLastX = 0;
    touchLastY = 0;
}

function touch(e) {
    let off = (window.innerHeight - document.getElementById('play').height) / 2;
    let y = Math.floor(e.targetTouches[0].clientY - off);
    let x = Math.floor(e.targetTouches[0].clientX);
    touchLastX = x;
    touchLastY = y;
    let r = getRacketDependOnSide(x);
    let rCY = r.getCenterY();
    // console.log(JSON.stringify([r.y, rCY, y, rCY - y]));
    if (y === rCY) {
        return;
    }
    y > r.getCenterY()
        ? racketMoveDown(r)
        : racketMoveUp(r);

}

function touchMove(e) {
    let y = Math.floor(e.targetTouches[0].clientY || 0);
    let x = Math.floor(e.targetTouches[0].clientX || 0);
    let r = getRacketDependOnSide(x);
    if (touchLastY) touchLastY < y ? racketMoveDown(r) : racketMoveUp(r);
    touchLastX = x;
    touchLastY = y;
}

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

// function range(start, end) {
//     let r = [];
//     if (start === end) {
//         return r;
//     }
//     let s = Math.min(start, end);
//     let e = Math.max(start, end);
//     while(s <= e) {
//         r.push(s);
//         s++;
//     }
//     return r;
// }

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
    let aspect = getAspect();
    //draw dashed line in middle
    while (s > 0) {
        s--;
        ctx.beginPath();
        ctx.setLineDash([aspect * 2, aspect * 5]);
        ctx.moveTo(cmx + s, 0);
        ctx.lineTo(cmx + s, canvas.height);
        ctx.stroke();
    }
}

function getCanvasMiddleX(id = 'board') {
    let w = document.getElementById(id).width - 1;
    return w % 2 === 0 ? Math.floor(w / 2) : Math.ceil(w / 2); //middle x
}

function getCanvasMiddleY(id = 'play') {
    let h = document.getElementById(id).height - 1;
    return h % 2 === 0 ? Math.floor(h / 2) : Math.ceil(h / 2); //middle y
}

function drawBoardPoints() {
    let id = 'board';
    let mx = getCanvasMiddleX(id);
    let canvas = document.getElementById(id);
    let size = Math.ceil(canvas.width * 0.08);
    let space = Math.ceil(size / 2);
    let ctx = canvas.getContext('2d');
    ctx.font = size + "px Courier New CE";
    ctx.fillText(p1.toString(), mx - size  , size);
    ctx.fillText(p2.toString(), mx + space, size);
}

function drawBoard() {
    let cid = 'board';
    clearCanvas(cid)
    let canvas = document.getElementById(cid);
    let ctx = canvas.getContext('2d');
    ctx.fillStyle = 'white';
    ctx.strokeStyle = "white";
    drawBoardLine();
    drawBoardPoints();
}

function addRackets() {
    rLeft = addRacket();
    rRight = addRacket(false);
}

function addRacket(left = true) {
    let cid = 'play'
    let canvas = document.getElementById(cid);
    let cmy = getCanvasMiddleY(cid);
    let padding = Math.ceil(canvas.width * 0.01);
    let racket = new PongRacket(elements2d.length, cid);
    racket.height = padding * 6;
    racket.width = padding;
    racket.x = left ? padding : canvas.width - padding - racket.width;
    racket.y = cmy - (racket.height / 2);
    racket.vectorX = 0;
    racket.vectorY = 0;
    racket.show();
    elements2d[racket.id] = racket;
    return racket;
}

function getRacketDependOnSide(x) {
    return getSide(x) === -1 ? getRacketLeft() : getRacketRight();
}

/**
 *
 * @param x
 * @returns {number} -1: left; 1: right
 */
function getSide(x) {
    let cmx = getCanvasMiddleX('play');
    return x < cmx ? -1 : 1;
}

/**
 * @returns {PongRacket}
 */
function getRacketLeft() {
    if (rLeft === null) addRackets();
    return rLeft;
}

/**
 * @returns {PongRacket}
 */
function getRacketRight() {
    if (rRight === null) addRackets();
    return rRight;
}

function addBall() {
    let cid = 'play'
    let ball = new PongBall(elements2d.length, cid);
    elements2d[ball.id] = ball;
    ballId = ball.id;
    restartBall();
}

function restartBall() {
    let cid = 'play'
    let canvas = document.getElementById(cid);
    let cmy = getCanvasMiddleY(cid);
    let cmx = getCanvasMiddleX(cid);
    let padding = Math.ceil(canvas.width * 0.01);
    let ball = getBall();
    ball.height = padding;
    ball.width = padding;
    ball.x = cmx - Math.floor(padding / 2);
    ball.y = cmy - Math.floor(padding / 2);
    let asp = getAspect();
    //start from last scored side
    let minX = lastScored === 2 ? 0 : -asp;
    let maxX = lastScored === 1 ? 0 : asp;
    let excX = asp > 1 ? ArrayHelpers.rangeNum(-asp + 1, asp - 1) : [0];
    ball.setRandomVectors([minX, maxX, excX], [-asp, asp]);
    ball.show();
    ball.out = false;
}

function getAspect() {
    let canvas = document.getElementById('play');
    return Math.ceil(canvas.width / 500);
}

function getBall() {
    if (ballId === -1) addBall();
    return elements2d[ballId];
}

function score() {
    let out = this.getBall().out;
    if (!out) return; //no bother
    if (out === 1) {
        //points for player 2
        p2++;
        lastScored = 2;
    }
    if (out === 2) {
        //points for player 1
        p1++;
        lastScored = 1;
    }
    checkEndGame();
    //restart game;
    drawBoard();
    restartBall();
}

function checkEndGame() {
    if (p1 >= maxP) {
        clearInterval(game);
        game = 0;
    }
    if (p2 >= maxP) {
        clearInterval(game);
        game = 0;
    }
}

function playerAI() {
    racketAI(getRacketLeft());
    racketAI(getRacketRight());
}

/**
 *
 * @param racket {PongRacket}
 */
function racketAI(racket) {
    if (!racket.controlAI) return; //no bother
    let mx = getCanvasMiddleX('play');
    let ball = getBall();
    let ry = racket.getCenterY();
    let aspect = getAspect();
    //left move if ball is on left side and right opposite
    if ((racket.x < mx && ball.x > mx) || (racket.x > mx && ball.x < mx)) {
        racket.vectorY = 0;
        return;
    }
    let by = ball.getCenterY();
    if (by < ry) racket.vectorY = - aspect;
    if (by > ry + 1) racket.vectorY = aspect;
    if (by < ry - 1 && by > ry + 1) racket.vectorY = 0
}

function run() {
    clearCanvas();
    playerAI();
    elements2d.forEach(function(el) {
        if (!el) {
            return;
        }
        if (el.getSize() < 1) {
            el.destroy();
            return;
        }
        el.move();
        el.addMSLC(); //count moves since last collision
        el.collisions();
        el.show();
        score();
    });
}

function restart() {
    if (game) return;
    p1 = 0;
    p2 = 0;
    getRacketLeft().controlAI = true;
    getRacketRight().controlAI = true;
    lastScored = 0;
    restartBall();
    drawBoard();
    game = setInterval(run, 10);
}

function setCanvasSize() {
    let width = window.innerWidth * 0.9;
    let ratio = 0.6;
    let cw = width;
    let ch = Math.min(width * ratio, window.innerHeight);
    let board = document.getElementById('board');
    let play = document.getElementById('play');
    board.width = cw;
    board.height = ch;
    play.width = cw;
    play.height = ch;
    // play.style.marginTop = "-" + (ch) + "px";
    // let manual = document.getElementById('manual');
    // manual.style.marginTop = "-" + (ch * 0.8) + "px";
}

function start() {
    setCanvasSize();
    drawBoard();
    addRackets();
    addBall();
    game = setInterval(run, 10);
}

start();