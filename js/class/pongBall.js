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
        this.vectorX = this.changeVector(this.vectorX);
        this.vectorY = this.changeVector(this.vectorY);
    }
}