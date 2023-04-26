export class Entity extends Box {
    colideBox
    xSpeed=0;
    ySpeed=0;
    
    constructor(x, y, height, width,box) {
        super(x, y, height, width)
        this.colideBox=box;
    }

    move(entityList) {
        let newX = this.x + this.xSpeed;
        let newY = this.y + this.ySpeed;
        switch (true) {
            case !Utils.colide(newX, this.y, this,entityList):
                this.x = newX;
            case !Utils.colide(this.x, newY, this,entityList):
                this.y = newY;
        }
    }

    draw() {

    }
}