class Player extends Entity {
    controle() {
        if(this.lock){
            return;
        }
        return 'I have a ' + this.carname;
    }
    constructor(x, y, height, width, box) {
        super(x, y, height, width, box)
            this.model = mod;
    }

}