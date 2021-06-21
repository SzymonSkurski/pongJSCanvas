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
// let previousAngle = null; //cache previous angle
// let rotation = null; //h - horizontal | v - vertical

// Math.median = (values = []) => {
//     let l = values.length;
//     if (l === 0) return 0 //no bother
//     values.sort((a,b) => {
//         return a - b;
//     });
//     let half = Math.floor(values.length / 2);
//     if (l % 2) return values[half] * 1.0; //odd
//     return (values[half] + values[half + 1]) / 2.0;  //even
// }

window.mobileCheck = () => {
    let check = false;
    ((a) => {// noinspection RegExpSingleCharAlternation,RegExpRedundantEscape
        if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
    return check;
};

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

document.addEventListener('click', () => {
    manualClose();
    toggleFullScreen(true);
});
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

window.addEventListener('resize', () => {
    setCanvasSize();
    drawBoard(); //reset
}, true);

// window.addEventListener("orientationchange", () => {
//     const angle = screen.orientation.angle;
//     console.log(angle);
//     // if (previousAngle === null) {
//     //     previousAngle = angle;
//     // }
//     // // screen.orientation.angle 90 | 180 is preferred
// }); CSS is enough

function toggleFullScreen(force = false) {
    const   doc = window.document,
            docEl = doc.documentElement,
            requestFullScreen = docEl.requestFullscreen || docEl.webkitRequestFullScreen,
            cancelFullScreen = doc.exitFullscreen || doc.webkitExitFullscreen;
    lockLandscape();
    if (!doc.fullscreenElement && !doc.webkitFullscreenElement) {
        requestFullScreen.call(docEl);
        setCanvasSize();
        drawBoard();
    }
    else if (!force) {
        cancelFullScreen.call(doc);
        setCanvasSize();
        drawBoard();
    }
}

function lockLandscape() {
    const so = screen.orientation;
    if (so.type === 'landscape-primary' || so.type === 'landscape-secondary') {
        return;
    }
    screen.orientation.lock('landscape-primary').catch(function(error) {
        //exception handle
    });
    //display rotate screen notification
}

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
    let racket = new PongRacket(elements2d.length, cid, left);
    racket.resetCanvasRelative();
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
    const sw = mobileCheck() ? screen.availWidth
        : document.documentElement.clientWidth;
    const sh = mobileCheck() ? screen.availHeight
        : document.documentElement.clientHeight;
    let width = Math.ceil(sw * 0.96);
    let ratio = 0.52;
    let cw = width;
    let ch = Math.ceil(Math.min(width * ratio, sh * 0.96));
    // let ch = window.innerHeight * 0.9;
    let board = document.getElementById('board');
    let play = document.getElementById('play');
    // console.log([sw, sh, cw, ch]);
    board.width = cw;
    board.height = ch;
    play.width = cw;
    play.height = ch;
    if (rRight) rRight.resetCanvasRelative();
    if (rLeft) rLeft.resetCanvasRelative();
}

function greetings() {
    const manual = document.getElementById('manual');
    manual.innerHTML = '<br/>As default both rackets are AI controlled.';
    manual.innerHTML += window.mobileCheck()
        ? '<br/>To start act as left or right racket touch racket.\n' +
        '    <h2>control</h2>\n' +
        '    <br/>\'up\' - touch or slide above racket\n' +
        '    <br/>\'down\' - touch or slide below racket\n' +
        '    <br/>\'restart\' - touch\n' +
        '    <br/>\n' +
        '    <br/>touch to hide <br/><button class="btn">enter full screen</button>'
        : '<br/>To start act as left or right racket use control keys.\n' +
        '    <h2>keys</h2>\n' +
        '    <br/>\'w\' - move left racket up\n' +
        '    <br/>\'s\' - move left racket down\n' +
        '    <br/>\'arrowUp\' - move right racket up\n' +
        '    <br/>\'arrowDown\' - move right racket down\n' +
        '    <br/>\'Enter\' - restart the game\n' +
        '    <br/>\'Escape\' - end game\n' +
        '    <br/>\n' +
        '    <br/>press any key'
}

function start() {
    greetings();
    setCanvasSize();
    drawBoard();
    addRackets();
    addBall();
    game = setInterval(run, 10);
}

start();