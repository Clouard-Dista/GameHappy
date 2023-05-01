class Entity extends Box {
    colideBox;
    interactionBox;
    speed=2;
    lock=false
    constructor(x, y, height, width, colideBox = new Box(1, 1, height - 2, width - 2), interactionBox = new Box(1, 1, height-2, width-2)) {
        super(x, y, height, width)
        this.colideBox = colideBox;
        this.interactionBox = interactionBox;
    }
    locked(duration){
        this.lock = true;
        setTimeout(() => { this.lock = false }, duration)
    }
    move(x, y, colideGrid) {
        let newX = (x == null ? this.x : this.x + (x ? this.speed : -this.speed));
        let newY = (y == null ? this.y : this.y + (y ? this.speed : -this.speed));
        switch (true) {
            case !Utils.colide(newX, this.y, this, colideGrid):
                this.x = newX;
            case !Utils.colide(this.x, newY, this, colideGrid):
                this.y = newY;
        }
    }

    draw(ctx) {
        Utils.drawRec(this.x, this.y, this.width, this.height, "green", ctx);

    }
    drawBox(ctx) {
        let boxX = this.x + this.colideBox.x;
        let boxY = this.y + this.colideBox.y;
        Utils.drawRec(boxX, boxY, this.colideBox.width, this.colideBox.height, 'rgba(0,0, 0,0.5)', ctx);
    }

}