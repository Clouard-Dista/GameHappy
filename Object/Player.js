class Player extends Entity {
    controle(input,colideGrid) {
        if (this.lock) {
            return;
        }
        //console.log(input.inputActive)
        let x = null;
        let y = null;
        if (input.inputActive["ArrowUp"]) {
            y = false;
        }
        if (input.inputActive["ArrowDown"]) {
            y = true;
        }
        if (input.inputActive["ArrowLeft"]) {
            x = false;
        }
        if (input.inputActive["ArrowRight"]) {
            x = true;
        }
        this.move(x, y, colideGrid)
    }
    constructor(x, y, width, height, box) {
        super(x, y, width, height, box)
        // this.model = mod;
    }
    draw(ctx) {
        Utils.drawRec(this.x, this.y, this.width, this.height, "red", ctx);
        this.drawBox(ctx)
    }
}