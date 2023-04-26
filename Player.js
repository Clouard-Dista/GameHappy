export class Player extends Entity {
    controle() {
        return 'I have a ' + this.carname;
    }
    constructor(x, y, height, width, box) {
        super(x, y, height, width, box)
            this.model = mod;
    }

}