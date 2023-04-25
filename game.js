var canvas = document.getElementById("gameCanvas");
var ctx = canvas.getContext("2d");

var squareSize = 50;
var squareX = (canvas.width - squareSize) / 2;
var squareY = (canvas.height - squareSize) / 2;

var circleX = 100;
var circleY = 100;
var circleRadius = 25;

var moveSpeed = 10;
var leftPressed = false;
var rightPressed = false;
var upPressed = false;
var downPressed = false;

var backgroundWidth = 2000;
var backgroundHeight = 1500;

function drawSquare() {
    ctx.beginPath();
    ctx.rect(squareX, squareY, squareSize, squareSize);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}

function drawCircle() {
    ctx.beginPath();
    ctx.arc(circleX, circleY, circleRadius, 0, Math.PI * 2);
    ctx.fillStyle = "#FF0000";
    ctx.fill();
    ctx.closePath();
}

function drawBackground() {
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.beginPath();
    ctx.strokeStyle = "#666666";
    ctx.lineWidth = 1;

    for (var i = 0; i <= backgroundHeight; i += squareSize) {
        ctx.moveTo(0, i);
        ctx.lineTo(backgroundWidth, i);
    }

    for (var j = 0; j <= backgroundWidth; j += squareSize) {
        ctx.moveTo(j, 0);
        ctx.lineTo(j, backgroundHeight);
    }

    ctx.stroke();
    ctx.closePath();
}

function update() {
    if (leftPressed && squareX > 0) {
        squareX -= moveSpeed;
    } else if (rightPressed && squareX < backgroundWidth - squareSize) {
        squareX += moveSpeed;
    }

    if (upPressed && squareY > 0) {
        squareY -= moveSpeed;
    } else if (downPressed && squareY < backgroundHeight - squareSize) {
        squareY += moveSpeed;
    }
}

function keyDownHandler(event) {
    if (event.keyCode == 37) {
        leftPressed = true;
    } else if (event.keyCode == 39) {
        rightPressed = true;
    }

    if (event.keyCode == 38) {
        upPressed = true;
    } else if (event.keyCode == 40) {
        downPressed = true;
    }
}

function keyUpHandler(event) {
    if (event.keyCode == 37) {
        leftPressed = false;
    } else if (event.keyCode == 39) {
        rightPressed = false;
    }

    if (event.keyCode == 38) {
        upPressed = false;
    } else if (event.keyCode == 40) {
        downPressed = false;
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBackground();
    drawSquare();
    drawCircle();
    update();
    requestAnimationFrame(draw);
}

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

draw();
