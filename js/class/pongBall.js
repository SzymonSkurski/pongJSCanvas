class PongBall extends  Rectangle {
    out = 0; //0 - no, 1 - left, 2 - right
    edgeCollisionEffectsLeft() {
        this.out = 1;
        this.edgeStopped();
    }
    edgeCollisionEffectsRight() {
        this.out = 2;
        this.mSLC = 0;
        this.edgeStopped();
    }
    edgeStopped() {
        this.mSLC = 0;
        this.vectorX = 0;
        this.vectorY = 0;
    }
    bounce(el) {
        this.revertVectors();
        if (this.vectorX) this.vectorX = this.changeVector(this.vectorX);
        this.vectorY = this.changeVector(el.vectorY);
    }
    show() {
        this.draw();
        this.drawTrace(this.draw);
    }
}