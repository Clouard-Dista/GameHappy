class Npc extends Entity {
    path = [];
    speed=1
    arive=false;
    controle() {
        if (this.lock) {
            return;
        }
        this.x += Math.round((Math.random() * 2) - 1);
        this.y += Math.round((Math.random() * 2) - 1);
    }
    controle2(endEntity, colideGrid, sizePx) {
        if (this.path.length < 2) {
            this.path = Utils.findPath(this, endEntity, colideGrid, sizePx);
        }
        if (this.path[1]) {
            game.ctx.fillStyle = "yellow";
            game.ctx.fillRect(tmpX * sizePx - 4, tmpY * sizePx - 4, 8, 8);


            let nextNode = this.path[1];
            let dx = (nextNode.x * sizePx) - this.x;
            let dy = (nextNode.y * sizePx) +- this.y;

            for (let i = 0; i < this.path.length; i++) {
                let nextNode3 = this.path[i];
                let dx3 = (nextNode3.x * sizePx) - this.x;
                let dy3 = (nextNode3.y * sizePx) - this.y;
                game.ctx.fillRect(this.x + dx3, this.y +dy3, 8, 8);
                
            }

            let dist = Math.sqrt(dx * dx + dy * dy);
            if (dist > 10) {
                dx = dx * 5 / dist;
                dy = dy * 5 / dist;
            } else {
                this.path.shift();
            }
            this.move((dx == 0 ? null : (dx > 0 ? true : false)), (dy == 0 ? null : (dy > 0 ? true : false)), colideGrid)
        }
    }
    /*
    controle3(endEntity, colideGrid, sizePx) {
        this.arive = false;
        if (this.path.length < 2) {
            this.path = Utils.findPath(this, endEntity, colideGrid, sizePx);
            this.arive = true;
        }
        if (this.path[1]) {
            let nextNode = this.path[1];
            let dx = (nextNode.x * sizePx) - this.x;
            let dy = (nextNode.y * sizePx) - this.y;
            let dist = Math.sqrt(dx * dx + dy * dy);
            if (dist > 10) {
                dx = dx * 5 / dist;
                dy = dy * 5 / dist;
            } else {
                this.path.shift();
            }
            this.move((dx == 0 ? null : (dx > 0 ? true : false)), (dy == 0 ? null : (dy > 0 ? true : false)), colideGrid)
        }
    }/**/
    constructor(x, y, width, height, box) {
        super(x, y, width, height, box)
        // this.model = mod;
    }
    draw(ctx) {
        Utils.drawRec(this.x, this.y, this.width, this.height, "blue", ctx);

        this.drawBox(ctx)
    }
}