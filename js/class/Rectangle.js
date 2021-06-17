class Rectangle extends Element2d {
    constructor(id, canvasId) {
        super(id, canvasId);
    }
    draw(op = 1, rgb = []) {
        let canvas = this.getCanvas();
        let ctx = canvas.getContext('2d');
        rgb = rgb.length ? rgb : this.colorRGB;
        ctx.fillStyle = 'rgb(' + rgb.join() + ', ' + op + ')';
        ctx.fillRect(this.x, this.y, this.width, this.height);
        // this.drawPolygon(this.getPixelsMap(), 1, true);
    }

    createPixelsMap() {
        let pixelMap = [];
        let x = 0;
        let y = 0;
        let w = this.width;
        let h = this.height;
        pixelMap.push([x,y]); //top left corner
        pixelMap.push([x + w, y]) //top right corner
        pixelMap.push([x + w, y + h]) //bottom right
        pixelMap.push([x, y + h]) //bottom left
        this.pixelMap = pixelMap;
        return pixelMap;
    }
}