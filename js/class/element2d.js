class Element2d {
    x = 0;
    y = 0;
    width = 1;
    height = 1;
    vectorX = 1;
    vectorY = 1;
    #mSLC = 0; //moves since last collision
    constructor(id, canvasId) {
        this.id = id; //id from elements
        this.canvasId = canvasId; //html element id
    }
    getCanvas() {
        return document.getElementById(this.canvasId);
    };
    getSize() {
        return this.width * this.height;
    }
    collisions() {
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
            this.#mSLC = 0; //has collision reset
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
    addMSLC() {
        this.#mSLC++;
    }
    collisionCanvasEdges() {
        let canvas = this.getCanvas();
        if (this.x + this.width > canvas.width) this.vectorX = -1; //right edge collision
        if (this.y + this.width > canvas.height) this.vectorY = -1; //bottom edge collision
        if (this.x < 0) this.vectorX = 1; //left edge collision
        if (this.y < 0) this.vectorY = 1; //bottom edge collision
        if (this.hasEdgeCollision()) {
            this.#mSLC = 0; //has collision reset
            this.collisionRandEffects()
        }
    };
    hasEdgeCollision() {
        let canvas = this.getCanvas();
        return (this.x + this.width > canvas.width ||
            this.y + this.width > canvas.height ||
            this.x < 0 || this.y < 0
        );
    }
    draw() {
        //implement draw on canvas
    };
    drawTrace(drawCallback, max) {
        let x = this.x; //store current
        let y = this.y;
        let t = Math.min(max, this.#mSLC); //how many traces, max
        let rgb = [255,255,155]; //trace color
        while(t > 1) {
            t--;
            this.moveBack();
            drawCallback.apply(this, [(t * 2) / 10, rgb]);
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
        this.vectorX *= -1;
        this.vectorY *= -1;
    };
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
    setRandomVectors() {
        this.vectorX = this.getRandVector();
        this.vectorY = this.getRandVector();
        if (this.vectorX + this.vectorY === 0) {
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
}