class Npc extends Entity {
    path = [];
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
            let nextNode = this.path[1];
            let dx = (nextNode.x * sizePx) - this.x;
            let dy = (nextNode.y * sizePx) - this.y;
            let dist = Math.sqrt(dx * dx + dy * dy);
            if (dist > 10) {
                dx = dx * 10 / dist;
                dy = dy * 10 / dist;
            } else {
                this.path.shift();
}
            this.move((dx == 0 ? null : (dx > 0 ? true : false)), (dy == 0 ? null : (dy > 0 ? true : false)), colideGrid)
        }
    }
    constructor(x, y, width, height, box) {
        super(x, y, width, height, box)
        // this.model = mod;
    }
    draw(ctx) {
        Utils.drawRec(this.x, this.y, this.width, this.height, "blue", ctx);

        this.drawBox(ctx)
    }
}