class PongRacket extends Rectangle {
    constructor(id, canvasId) {
        super(id, canvasId);
        this.vectorX = 0; //cannot move in X
    }
    move() {
        this.vectorX = 0; //cannot move in X
        super.move();
    }
    bounce(el) {
    }
    edgeCollisionEffectsBottom() {
        this.vectorY = 0;
    }
    edgeCollisionEffectsTop() {
        this.vectorY = 0;
    }
}