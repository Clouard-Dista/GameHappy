class Interactif extends Entity {
    controle() {
        if (this.lock) {
            return;
        }
        return 'I have a ' + this.carname;
    }
    constructor(x, y, width, height, box) {
        super(x, y, width, height, box)
        // this.model = mod;
    }
    draw(ctx) {
        Utils.drawRec(this.x, this.y, this.width, this.height, "green", ctx);

    }

}