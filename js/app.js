let elements2d = []; //store all 2d elements
let ballId = -1;
let p1 = 0;
let p2 = 0;
let r1 = null;
let r = null;
let maxP = 5;
let game = 0;
let ai1 = true;
let ai2 = true;

//keys listener
document.onkeydown = (e) => {
    let key = e.key;
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
        getRacket2().vectorY = -1;
        ai2 = false;
    }
    if (key === 'ArrowDown') {
        e.preventDefault();
        getRacket2().vectorY = 1;
        ai2 = false;
    }
    if (key === 'Enter') {
        restart();
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
}

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
    let cid = 'play'
    let canvas = document.getElementById(cid);
    let cmy = getCanvasMiddleY(cid);
    let padding = Math.ceil(canvas.width * 0.01);
    let racket1 = new PongRacket(elements2d.length, cid);
    racket1.height = padding * 6;
    racket1.width = padding;
    racket1.x = padding;
    racket1.y = cmy - (racket1.height / 2);
    racket1.vectorX = 0;
    racket1.vectorY = 0;
    racket1.draw();
    elements2d[racket1.id] = racket1;
    r1 = racket1;
    let racket2 = new PongRacket(elements2d.length, cid);
    racket2.height = padding * 6;
    racket2.width = padding;
    racket2.x = canvas.width - padding - racket2.width;
    racket2.y = cmy - (racket2.height / 2);
    racket2.vectorX = 0;
    racket2.vectorY = 0;
    racket2.draw();
    elements2d[racket2.id] = racket2;
    r = racket2;
}

/**
 * @returns {Rectangle}
 */
function getRacket1() {
    if (r1 === null) addRackets();
    return r1;
}

/**
 *
 * @returns {Rectangle}
 */
function getRacket2() {
    if (r === null) addRackets();
    return r;
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
    ball.setRandomVectors(false);
    ball.draw();
    ball.out = false;
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
    }
    if (out === 2) {
        //points for player 1
        p1++;
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
    //left move if ball is on left side and right opposite
    if ((!side && ball.x > mx) || (side === 1 && ball.x < mx)) {
        r.vectorY = 0;
        return;
    }
    let y = r.getCenterY();
    if (ball.y < y) r.vectorY = -1;
    if (ball.y > y) r.vectorY = 1;
    if (ball.y === y) r.vectorY = 0
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
        el.addMSLC(); //count moves since last colision
        el.collisions();
        el.draw();
        score();
    });
}

function restart() {
    if (game) return;
    p1 = 0;
    p2 = 0;
    ai1 = true;
    ai2 = true;
    restartBall();
    drawBoard();
    game = setInterval(run, 10);
}

function start() {
    drawBoard();
    addRackets();
    addBall();
    game = setInterval(run, 10);
}

start();