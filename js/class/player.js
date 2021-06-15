class Player {
    points = 0;
    constructor(name) {
        this.name = name;
    }
    hasWin(points) {
        return this.points >= points;
    }
}