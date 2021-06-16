class PongBall extends  Rectangle {
    out = 0; //0 - no, 1 - left, 2 - right
    edgeCollisionEffectsLeft() {
        this.out = 1;
    }
    edgeCollisionEffectsRight() {
        this.out = 2;
    }
    bounce(el) {
        this.revertVectors();
        if (this.vectorY) this.vectorX = Math.min(5, this.changeVector(this.vectorX));
        this.vectorY = this.changeVector(el.vectorY);
    }
}