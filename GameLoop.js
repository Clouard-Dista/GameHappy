class Game {
    canvas = null;
    ctx = null;
    backgroundWidth =0;
    backgroundHeight =0;
    constructor(width, height) {
        this.backgroundWidth = width;
        this.backgroundHeight = height;

    }
    gameLoop() {
        // Effacer le canvas
        Utils.drawRec(0, 0, this.canvas.width, this.canvas.height, "white", this.ctx);

        // Dessiner le fond d'écran et les murs
        Utils.drawBackground(walls,this.ctx);

        /*/ Dessiner les entités
        drawPlayer();
        drawComputer();
        drawNPCs();

        // Tester les collisions
        checkCollisions();

        // Déplacer les entités
        moveNPCs();
        //Input.getInstance().inputActive
        movePlayer();

        // Demander une nouvelle frame
        requestAnimationFrame(this.gameLoop);
        /**/
    }
    initGame() {
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

let game = new Game(2000, 1500);

var walls = [];
for (var i = 0; i < 20; i++) {
    var wallX = Math.floor(Math.random() * game.backgroundWidth);
    var wallY = Math.floor(Math.random() * game.backgroundHeight);
    walls.push({ x: wallX, y: wallY, height: 50, width: 20 });
}
game.initGame()