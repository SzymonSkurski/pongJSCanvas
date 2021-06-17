let elements2d = []; //store all 2d elements
let ballId = -1;
let p1 = 0;
let p2 = 0;
let lastScored = 0; //0 - no one; 1 - left; 2 -right
let rLeft = null;
let rRight = null;
let maxP = 5;
let game = 0;
let ai1 = true;
let ai2 = true;

//keys listener
document.onkeydown = (e) => {
    let key = e.key;
    //any key
    document.getElementById('manual').style.display = "none";
    if (key === 'w') {
        ai1 = false;
        getRacket1().vectorY = -1;
    }
    if (key === 's') {
        ai1 = false;
        getRacket1().vectorY = 1;
    }
    if (key === 'ArrowUp') {
        e.preventDefault();
        getRacket2().vectorY = -getAspect();
        ai2 = false;
    }
    if (key === 'ArrowDown') {
        e.preventDefault();
        getRacket2().vectorY = getAspect();
        ai2 = false;
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
        getRacket1().vectorY = 0;
    }
    if (key === 's') {
        getRacket1().vectorY = 0;
    }
    if (key === 'ArrowUp') {
        getRacket2().vectorY = 0;
    }
    if (key === 'ArrowDown') {
        getRacket2().vectorY = 0;
    }
}

document.addEventListener("click", () => document.getElementById('manual').style.display = "none");

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

/**
 * @returns {Rectangle}
 */
function getRacket1() {
    if (rLeft === null) addRackets();
    return rLeft;
}

/**
 *
 * @returns {Rectangle}
 */
function getRacket2() {
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
    if (ai1) racketAI(0);
    if (ai2) racketAI(1);
}

/**
 * @param side 0 - left; 1 - right
 */
function racketAI(side = 0) {
    let r = !side ? getRacket1() : getRacket2();
    let mx = getCanvasMiddleX('play');
    let ball = getBall();
    let ry = r.getCenterY();
    let aspect = getAspect();
    //left move if ball is on left side and right opposite
    if ((!side && ball.x > mx) || (side === 1 && ball.x < mx)) {
        r.vectorY = 0;
        return;
    }
    let by = ball.getCenterY();
    if (by < ry) r.vectorY = - aspect;
    if (by > ry + 1) r.vectorY = aspect;
    if (by < ry - 1 && by > ry + 1) r.vectorY = 0
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
    ai1 = true;
    ai2 = true;
    lastScored = 0;
    restartBall();
    drawBoard();
    game = setInterval(run, 10);
}

function setCanvasSize() {
    let width = window.innerWidth * 0.8;
    let ratio = 0.6;
    let cw = width;
    let ch = Math.min(width * ratio, window.innerHeight);
    let board = document.getElementById('board');
    let play = document.getElementById('play');
    board.width = cw;
    board.height = ch;
    play.width = cw;
    play.height = ch;
    play.style.marginTop = "-" + (ch) + "px";
    let manual = document.getElementById('manual');
    manual.style.marginTop = "-" + (ch * 0.8) + "px";
}

function start() {
    setCanvasSize();
    drawBoard();
    addRackets();
    addBall();
    game = setInterval(run, 10);
}

start();