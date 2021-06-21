class PongRacket extends Rectangle {
    controlAI = true;
    left = true; // left || right
    constructor(id, canvasId, left = true) {
        super(id, canvasId);
        this.vectorX = 0; //cannot move in X
        this.left = left;
    }
    move() {
        this.vectorX = 0; //cannot move in X
        super.move();
    }
    bounce(el) {
    }
    edgeCollisionEffectsBottom() {
        this.vectorY = 0;
        this.y = this.getCanvas().height - this.height;
    }
    edgeCollisionEffectsTop() {
        this.vectorY = 0;
        this.y = 0;
    }
    getSizeRelativeToCanvas() {
        return Math.ceil(this.getCanvas().width * 0.01);
    }
    resetCanvasRelative() {
        this.setRelativeWidth();
        this.setRelativeHeight();
        this.setRelativeX();
        this.setRelativeY();
    }
    setRelativeHeight() {
        this.height = this.getSizeRelativeToCanvas() * 6;
    }
    setRelativeWidth() {
        this.width = this.getSizeRelativeToCanvas();
    }
    setRelativeX() {
        let size = this.getSizeRelativeToCanvas();
        this.x = this.left ? size
            : this.getCanvas().width - size - this.width;
    }
    setRelativeY() {
        let h = Math.floor(this.getCanvas().height / 2);
        this.y = h - Math.ceil(this.height / 2);
    }
}