class Element2d {
    x = 0;
    y = 0;
    width = 1;
    height = 1;
    vectorX = 1;
    vectorY = 1;
    colorRGB = [255, 255, 255];
    // edgeCollisions = [1, 1, 1, 1]; // [left, top, right, bottom] 1 - bounce | 0 - pass
    pixelMap = []; //use for polygons [[x1, x2], ..., [xn, yn]]
    mSLC = 0; //moves since last collision
    #perimeterCache = [];
    #perimeterMaxCache = []; //[minX, minY, maxX, maxY];
    constructor(id, canvasId) {
        this.id = id; //id from elements
        this.canvasId = canvasId; //html element id
    }
    getCanvas() {
        return document.getElementById(this.canvasId);
    };
    getContext2d() {
        return this.getCanvas().getContext('2d');
    }
    getSize() {
        return this.width * this.height;
    }
    getPerimeterMax() {
        let c = this.getCanvas();
        let maxX = 0;
        let minX = c.width;
        let maxY = 0;
        let minY = c.height;
        this.#perimeterCache.forEach((p) => {
            let x = p[0];
            let y = p[1];
            maxX = Math.max(maxX, x);
            maxY = Math.max(maxY, y);
            minX = Math.min(minX, x);
            minY = Math.min(minY, y);
        })
        return [minX, minY, maxX, maxY];
    }
    collisions() {
        this.#perimeterCache = this.getPerimeterPixels(); //cache current
        this.#perimeterMaxCache = this.getPerimeterMax(); //cache current
        this.collisionCanvasEdges();
        this.collisionOtherObjects();
    };
    collisionOtherObjects() {
        if (!this.getSize()) {
            return; //no bother cannot collide
        }
        elements2d.forEach(function(el) {
            if (!el || el.id === this.id) {
                return;
            }
            if (!el.getSize() || !el.hasCollision(this)) {
                return;
            }
            this.mSLC = 0; //has collision reset
            this.bounce(el);
            //implement has collision
        }, this);
    };
    isEven() {
        return this.id % 2 === 0;
    }
    bounce(el) {
        let vx1 = this.vectorX;
        let vy1 = this.vectorY;
        let vx2 = el.vectorX;
        let vy2 = el.vectorY;
        //central collision; objects pass vectors to each other
        this.vectorX = vx2;
        this.vectorY = vy2;
        el.vectorX = vx1;
        el.vectorY = vy1;
    }
    hasCollision(el) {
        return ((el.y >= this.y - el.height && el.y <= this.y + this.height)
            && (el.x >= this.x - el.width && el.x <= this.x + this.width));
    };
    getCenterTile() {
        return [this.x, this.y]; //center tile dependant on shape, implement in child class
    };
    getCenterX() {
        return this.x + Math.floor(this.width / 2);
    }
    getCenterY() {
        return this.y + Math.floor(this.height / 2);
    }
    addMSLC() {
        this.mSLC++;
    }
    collisionCanvasEdges() {
        let c = false; //has collision
        if (this.hasEdgeCollisionRight()) {this.edgeCollisionEffectsRight(); c = true} //right
        if (this.hasEdgeCollisionBottom()) {this.edgeCollisionEffectsBottom(); c = true} //bottom
        if (this.hasEdgeCollisionLeft()) {this.edgeCollisionEffectsLeft(); c = true} //left
        if (this.hasEdgeCollisionTop()) {this.edgeCollisionEffectsTop(); c = true} //top
        if (c) {
            //has collision
            this.mSLC = 0; //has collision reset
            this.collisionRandEffects()
        }
    };
    hasEdgeCollisionLeft() {
        //[minX, minY, maxX, maxY]; minX < 0
        return this.#perimeterMaxCache[0] < 0;
    }
    edgeCollisionEffectsLeft() {
        this.revertVectorX();
    }
    hasEdgeCollisionRight() {
        let w = this.getCanvas().width;
        //[minX, minY, maxX, maxY]; maxX > w
        return this.#perimeterMaxCache[2] > w;
    }
    edgeCollisionEffectsRight() {
        this.revertVectorX();
    }
    hasEdgeCollisionBottom() {
        let h = this.getCanvas().height;
        //[minX, minY, maxX, maxY]; maxY > h
        return this.#perimeterMaxCache[3] > h;
    }
    edgeCollisionEffectsBottom() {
        this.revertVectorY();
    }
    hasEdgeCollisionTop() {
        //[minX, minY, maxX, maxY]; minY < 0
        return this.#perimeterMaxCache[1] < 0;
    }
    edgeCollisionEffectsTop() {
        this.revertVectorY();
    }
    show() {
        this.draw();
        // this.drawTrace();
    }
    draw(op = 1, rgb = []) {
        //implement draw on canvas
    };
    drawTrace(drawCallback, traceRGB = [], max = 4, fade = 22) {
        let x = this.x; //store current
        let y = this.y;
        let t = Math.min(max, this.mSLC); //how many traces, max
        let rgb = traceRGB.length ? traceRGB : this.colorRGB; //trace color
        while(t > 1) {
            t--;
            this.moveBack();
            drawCallback.apply(this, [t / fade, rgb]);
        }
        this.x = x;
        this.y = y; //restore to previous
    }
    destroy() {
        elements2d[this.id] = null;
    }
    createClone() {
        let cEl = new Element2d(elements2d.length || 0, this.canvasId);
        cEl.vectorX = this.vectorX;
        cEl.vectorY = this.vectorY;
        cEl.width = this.width;
        cEl.x = this.x;
        cEl.y = this.y;
        cEl.colorRGB = this.colorRGB;
        elements2d.push(cEl);
        return cEl.id;
    }
    move() {
        if (!this.width) return;
        this.x += this.vectorX;
        this.y += this.vectorY;
    };
    moveBack() {
        if (!this.width) return;
        this.x -= this.vectorX;
        this.y -= this.vectorY;
    }
    revertVectors() {
        this.revertVectorY();
        this.revertVectorX();
    };
    revertVectorX() {
        this.vectorX *= -1;
    }
    revertVectorY() {
        this.vectorY *= -1;
    }
    changeVector(v, plus = 1) {
        return v < 0 ? v - plus : v + plus;
    }
    setRandomXY() {
        let canvas = this.getCanvas();
        let maxX = canvas.width - this.width;
        let maxY = canvas.height - this.width;
        let minX = Math.floor(canvas.width / 2);
        let minY = Math.floor(canvas.height / 2);
        if (this.isEven()) {
            maxX = Math.floor(canvas.width / 2) - this.width;
            maxY = Math.floor(canvas.height / 2) - this.width;
            minX = 0;
            minY = 0;
        }
        this.x = randInt(minX, maxX);
        this.y = randInt(minY, maxY);
    }
    //return rand -1 || 0 || 1
    getRandVector(allowZero = true) {
        return allowZero
            ? randInt(-1, 1)
            : randInt(0, 1) || -1; // 0 will give -1
    }
    setRandomVectors(allowZero = true) {
        this.vectorX = this.getRandVector(allowZero);
        this.vectorY = this.getRandVector(allowZero);
        if (!allowZero && this.vectorX + this.vectorY === 0) {
            !randInt(0, 2)
                ? this.vectorX = this.getRandVector(false)
                : this.vectorY = this.getRandVector(false);
        }
    }
    setRandomRGB() {
        this.colorRGB = [randInt(0, 255), randInt(0, 255), randInt(0, 255)];
    };
    setRGBFoF() {
        this.colorRGB = this.isEven() ? [0,0,255] : [255,255,255];
    }
    collisionRandEffects() {
    }
    drawPolygon(pixelMap, op = 1, fill = false) {
        let ctx = this.getContext2d();
        ctx.beginPath();
        pixelMap.forEach((p, i) => {
            let x = p[0];
            let y = p[1];
            (i === 0) ? ctx.moveTo(x,y) : ctx.lineTo(x, y);
        }, ctx);
        ctx.lineTo(pixelMap[0][0], pixelMap[0][1]); //close shape
        if (fill) {
            ctx.fillStyle = 'rgb(' + this.colorRGB.join() + ', ' + op + ')';
            ctx.fill();
        } else {
            ctx.strokeStyle = 'rgb(' + this.colorRGB.join() + ', ' + op + ')';
            ctx.stroke();
        }
    }
    getPixelsMap() {
        return this.pixelMap.length
            ? this.pixelMap //has own pixel map no bother
            : this.createPixelsMap(); //create pixels map (only for basic shapes)
    }
    createPixelsMap() {
        this.pixelMap = [];
        return []; //template in child class like rectangle
    }
    getPerimeterPixels() {
        let pixelMap = this.getPixelsMap();
        let perimeter = []; //[[x1,y1], ..., [xn,yn]]
        pixelMap.forEach((p, i) => {
            let x = p[0] + this.x;
            let y = p[1] + this.y;
            //last turn will close shape
            let nx = (pixelMap[i][0] || pixelMap[0][0]) + this.x; //next x
            let ny = (pixelMap[i][1] || pixelMap[0][1]) + this.y; //next y
            this.getPixelsOnLine(x, y, nx, ny).forEach(pp => {
                perimeter.push(pp);
            }, perimeter);
        }, perimeter);
        return perimeter;
    }
    getPixelsOnLine(startX, startY, endX, endY) {
        const pixelCols = [];
        let x = Math.floor(startX);
        let y = Math.floor(startY);
        const xx = Math.floor(endX);
        const yy = Math.floor(endY);
        const dx = Math.abs(xx - x);
        const sx = x < xx ? 1 : -1;
        const dy = -Math.abs(yy - y);
        const sy = y < yy ? 1 : -1;
        let err = dx + dy;
        let e2;
        let end = false;
        while (!end) {
            pixelCols.push([x,y]);
            if ((x === xx && y === yy)) {
                end = true;
            } else {
                e2 = 2 * err;
                if (e2 >= dy) {
                    err += dy;
                    x += sx;
                }
                if (e2 <= dx) {
                    err += dx;
                    y += sy;
                }
            }
        }
        return pixelCols;
    }
}