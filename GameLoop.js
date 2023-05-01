class Game {
    canvas = null;
    ctx = null;
    player;
    level = [];
    interact = [];
    npc = [];
    debugAff=true;
    sizePx = 15;
    colideGrid;    
    backgroundWidth = 0;
    backgroundHeight = 0;
    constructor(width, height) {
        this.backgroundWidth = width;
        this.backgroundHeight = height;

    }
    gameLoop() {


        this.drawManagement();
        this.generateColideGrid([...this.interact, ...this.level]);
        if (this.debugAff){
            this.drawGrid();
        }

        this.player.controle(Input.getInstance());
        this.npc[0].controle()
        this.npc[1].controle2(this.player,this.colideGrid,this.sizePx)
        /*/ Déplacer les entités
        moveNPCs();
        //Input.getInstance().inputActive

        // Demander une nouvelle frame
        /**/
        requestAnimationFrame(this.gameLoop.bind(this));
    }
    generateColideGrid(obstacles) {
        let width = Math.ceil(this.canvas.width / this.sizePx);
        let height = Math.ceil(this.canvas.height / this.sizePx);

        const widthArray = new Array(width).fill(1);
        this.colideGrid = [];
        for (let i = 0; i < height; i++) {
            this.colideGrid.push([...widthArray]);
        } 
        for (const obstacle of obstacles) {
            const X = obstacle.x + obstacle.colideBox.x;
            const Y = obstacle.y + obstacle.colideBox.y;
            const x1 = X - (X % this.sizePx);
            const tmpX2 = X + obstacle.colideBox.width;
            const x2 = tmpX2 + (this.sizePx - tmpX2 % this.sizePx);

            const y1 = Y - (Y % this.sizePx);
            const tmpY2 = Y + obstacle.colideBox.height;
            const y2 = tmpY2 + (this.sizePx - tmpY2 % this.sizePx);

            let maxJ = Math.ceil((y2 - y1) / this.sizePx);
            for (let j = 0; j < maxJ; j++) {
                let posY = j + Math.ceil(y1 / this.sizePx);

                let maxI = Math.ceil((x2 - x1) / this.sizePx);
                for (let i = 0; i < maxI; i++) {
                    let posX = i + Math.ceil(x1 / this.sizePx);

                    if (this.colideGrid[posY] && this.colideGrid[posY][posX] == 1) {
                        this.colideGrid[posY][posX] = 0;
                    }
                }
            }
        }
    }
    drawGrid(){
        if (!this.colideGrid){
            return;
        }
        for (let i = 0; i < this.colideGrid.length; i++) {
            const line = this.colideGrid[i];
            for (let j = 0; j < line.length; j++) {
                const element = line[j];
                Utils.drawRec(j * this.sizePx, i * this.sizePx, this.sizePx, this.sizePx, 'rgba(0,255, 0,0.2)', this.ctx);
                if (element == 0) {
                    Utils.drawRec(j * this.sizePx, i * this.sizePx, this.sizePx, this.sizePx, 'rgba(0,0, 0,0.2)', this.ctx);
                }

            }
        }
        this.ctx.beginPath();
        var bw = 400;
        var bh = 400;
        for (var x = 0; x <= this.canvas.width; x += this.sizePx) {
            this.ctx.moveTo(0.5 + x, 0);
            this.ctx.lineTo(0.5 + x, this.canvas.height);
        }

        for (var x = 0; x <= this.canvas.height; x += this.sizePx) {
            this.ctx.moveTo(0, 0.5 + x);
            this.ctx.lineTo(this.canvas.width, 0.5 + x);
        }
        this.ctx.strokeStyle = "black";
        this.ctx.stroke();
    }
    drawManagement() {
        // Effacer le canvas
        Utils.drawRec(0, 0, this.canvas.width, this.canvas.height, "white", this.ctx);
        //TMP Dessiner le fond d'écran et les murs
        Utils.drawBackground(this.level, this.ctx);
        // Dessiner les entités
        let tmpEntityDraw = [this.player, ...this.interact, ...this.npc];
        for (const entity of tmpEntityDraw) {
            entity.draw(this.ctx);
        }
        //drawForeground
        //drawHud
    }

    initGame() {
        //TMP Generation pnj et objet
        this.interact.push(new Interactif(200, 200, 50, 100, new Box(10, 10, 30, 80)))
        this.npc.push(new Npc(200, 50, 50, 100, new Box(10, 10, 30, 80)))
        this.npc.push(new Npc(50, 200, 50, 100, new Box(10, 10, 30, 80)))
        for (var i = 0; i < 20; i++) {
            var wallX = Math.floor(Math.random() * game.backgroundWidth);
            var wallY = Math.floor(Math.random() * game.backgroundHeight);
            this.level.push(new Entity(wallX, wallY, 50, 20 ));
        }
        ///TMP

        this.player = new Player(50, 50, 50, 100, new Box(10, 10, 30, 80));
        this.canvas = document.getElementById("gameCanvas");
        this.canvas.width = this.backgroundWidth;
        this.canvas.height = this.backgroundHeight;
        this.ctx = this.canvas.getContext("2d");
        Input.getInstance();
        document.addEventListener("keydown", Input.getInstance().keyDownHandler, false);
        document.addEventListener("keyup", Input.getInstance().keyUpHandler, false);
        document.addEventListener("mouseout", Input.getInstance().out, false);
        document.addEventListener("mouseover", Input.getInstance().in, false);
        this.gameLoop();
    }
}

let game = new Game(1500, 1000);

game.initGame()