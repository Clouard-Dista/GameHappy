// Variables pour les touches de déplacement
var leftPressed = false;
var rightPressed = false;
var upPressed = false;
var downPressed = false;
var spacePressed = false;

var xOffset = 0;
var yOffset = 0;
// Taille d'un carré en pixels
var squareSize = 50;

// Dimensions du fond d'écran en pixels
var backgroundWidth = 200 * squareSize;
var backgroundHeight = 150 * squareSize;

// Objet joueur
var player = {
    x: 100,
    y: 100,
    ySpeed:0,
    xSpeed:0,
    color: "#00FF00",
    moveSpeed: 10
};

// Objet ordinateur
var computer = {
    x: backgroundWidth - squareSize,
    y: backgroundHeight - squareSize,
    color: "#FF0000",
    collided: false
};

// Liste des PNJ
var npcList = [
    {
        x: 5 * squareSize,
        y: 5 * squareSize,
        color: "#0000FF",
        radius: squareSize / 2,
        moveSpeed: 5,
        path: []
    },
    {
        x: 15 * squareSize,
        y: 10 * squareSize,
        color: "#FFA500",
        radius: squareSize / 2,
        moveSpeed: 5,
        path: []
    },
    {
        x: 10 * squareSize,
        y: 20 * squareSize,
        color: "#800080",
        radius: squareSize / 2,
        moveSpeed: 5,
        path: []
    }
];

// Liste des murs
var walls = [];

// Créer les murs fixes
for (var i = 0; i < 20; i++) {
    var wallX = Math.floor(Math.random() * backgroundWidth);
    var wallY = Math.floor(Math.random() * backgroundHeight);
    walls.push({ x: wallX, y: wallY });
}

// Créer le canvas et le contexte
var canvas = document.getElementById("gameCanvas");
canvas.width = 800;
canvas.height = 600;
var ctx = canvas.getContext("2d");

var backgroundXOffset = (canvas.width - backgroundWidth) / 2;
var backgroundYOffset = (canvas.height - backgroundHeight) / 2;

function drawBackground() {
    // Dessiner le quadrillage de fond
    ctx.strokeStyle = "#000";
    ctx.lineWidth = 1;
    for (var x = 0; x < backgroundWidth; x += squareSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, backgroundHeight);
        ctx.stroke();
    }
    for (var y = 0; y < backgroundHeight; y += squareSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(backgroundWidth, y);
        ctx.stroke();
    }

    // Dessiner les murs fixes
    ctx.fillStyle = "#333";
    for (var i = 0; i < walls.length; i++) {
        var wall = walls[i];
        ctx.fillRect(wall.x, wall.y, squareSize, squareSize);
    }
}

function drawPlayer() {
    // Dessiner le joueur
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, squareSize, squareSize);
}

function drawComputer() {
    // Dessiner l'ordinateur
    if (computer.collided) {
        ctx.fillStyle = "#FFA500";
    } else {
        ctx.fillStyle = computer.color;
    }
    ctx.fillRect(computer.x, computer.y, squareSize, squareSize);
}
function drawNPCs() {
    // Dessiner les PNJ
    for (var i = 0; i < npcList.length; i++) {
        var npc = npcList[i];
        ctx.fillStyle = npc.color;
        ctx.beginPath();
        ctx.arc(npc.x + squareSize / 2, npc.y + squareSize / 2, npc.radius, 0, 2 * Math.PI);
        ctx.fill();
    }
}

function checkCollisions() {
    // Vérifier les collisions avec les murs
    for (var i = 0; i < walls.length; i++) {
        var wall = walls[i];
        if (player.x < wall.x + squareSize &&
            player.x + squareSize > wall.x &&
            player.y < wall.y + squareSize &&
            player.y + squareSize > wall.y) {
            // Collision entre le joueur et le mur
            if (player.x < wall.x) {
                player.x = wall.x - squareSize;
            } else if (player.x > wall.x) {
                player.x = wall.x + squareSize;
            }
            if (player.y < wall.y) {
                player.y = wall.y - squareSize;
            } else if (player.y > wall.y) {
                player.y = wall.y + squareSize;
            }
        }
    }

    // Vérifier les collisions avec les PNJ
    for (var i = 0; i < npcList.length; i++) {
        var npc = npcList[i];
        var dx = player.x + squareSize / 2 - (npc.x + npc.radius);
        var dy = player.y + squareSize / 2 - (npc.y + npc.radius);
        var distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < player.radius + npc.radius) {
            // Collision entre le joueur et un PNJ
            if (spacePressed) {
                npc.color = "green";
            } else {
                player.color = "red";
            }
        }
    
    }
/**
    // Suivre le joueur avec le scrolling
    var leftLimit = canvas.width / 2;
    var rightLimit = backgroundWidth - canvas.width / 2;
    var topLimit = canvas.height / 2;
    var bottomLimit = backgroundHeight - canvas.height / 2;
    if (player.x < leftLimit) {
        xOffset = player.x - leftLimit;
        if (xOffset < 0 && backgroundXOffset < 0) {
            backgroundXOffset += xOffset;
        }
    } else if (player.x > rightLimit) {
        xOffset = player.x - rightLimit;
        if (xOffset > 0 && backgroundXOffset > canvas.width - backgroundWidth) {
            backgroundXOffset += xOffset;
        }
    }
    if (player.y < topLimit) {
        yOffset = player.y - topLimit;
        if (yOffset < 0 && backgroundYOffset < 0) {
            backgroundYOffset += yOffset;
        }
    } else if (player.y > bottomLimit) {
        yOffset = player.y - bottomLimit;
        if (yOffset > 0 && backgroundYOffset > canvas.height - backgroundHeight) {
            backgroundYOffset += yOffset;
        }
    }
/**/
    
}

function findPath(entity, target, obstacles) {
    // Créer les noeuds de départ et d'arrivée
    var startNode = { x: entity.x, y: entity.y };
    var endNode = { x: target.x, y: target.y };

    // Créer la liste ouverte et la liste fermée
    var openList = [startNode];
    var closedList = [];

    // Boucler jusqu'à ce que la liste ouverte soit vide
    while (openList.length > 0) {
        // Trouver le noeud avec le coût le plus faible
        var currentNode = openList[0];
        for (var i = 1; i < openList.length; i++) {
            if (openList[i].f < currentNode.f) {
                currentNode = openList[i];
            }
        }

        // Déplacer le noeud courant de la liste ouverte vers la liste fermée
        openList.splice(openList.indexOf(currentNode), 1);
        closedList.push(currentNode);

        // Vérifier si on est arrivé à destination
        if (currentNode.x === endNode.x && currentNode.y === endNode.y) {
            // Reconstituer le chemin à partir des parents
            var path = [endNode];
            while (currentNode.parent) {
                currentNode = currentNode.parent;
                path.unshift(currentNode);
            }
            return path;
        }

        // Trouver les voisins du noeud courant
        var neighbors = [];
        for (var dx = -1; dx <= 1; dx++) {
            for (var dy = -1; dy <= 1; dy++) {
                if (dx === 0 && dy === 0) {
                    continue;
                }
                var neighborX = currentNode.x + dx * entity.width;
                var neighborY = currentNode.y + dy * entity.height;
                var neighbor = { x: neighborX, y: neighborY, parent: currentNode };
                // Vérifier si le voisin est dans les limites de la zone de jeu
                if (neighbor.x >= 0 && neighbor.x + entity.width <= backgroundWidth &&
                    neighbor.y >= 0 && neighbor.y + entity.height <= backgroundHeight) {
                    // Vérifier si le voisin est libre
                    var isObstacle = false;
                    for (var j = 0; j < obstacles.length; j++) {
                        if (detectCollision(neighbor, obstacles[j])) {
                            isObstacle = true;
                            break;
                        }
                    }
                    if (!isObstacle) {
                        neighbors.push(neighbor);
                    }
                }
            }
        }

        // Mettre à jour les coûts des voisins et les ajouter à la liste ouverte
        for (var i = 0; i < neighbors.length; i++) {
            var neighbor = neighbors[i];
            // Vérifier si le voisin est déjà dans la liste fermée
            if (closedList.find(function (node) { return node.x === neighbor.x && node.y === neighbor.y })) {
                continue;
            }
            // Calculer les coûts du voisin
            neighbor.g = currentNode.g + 1;
            neighbor.h = Math.abs(neighbor.x - endNode.x) + Math.abs(neighbor.y - endNode.y);
            neighbor.f = neighbor.g + neighbor.h;
            // Vérifier si le voisin est déjà dans la liste ouverte
            var existingNeighbor = openList.find(function (node) { return node.x === neighbor.x && node.y === neighbor.y });
            if (existingNeighbor) {
                // Mettre à jour le voisin s'il a un coût inférieur
                if (neighbor.g < existingNeighbor.g) {
                    existingNeighbor.g = neighbor.g;
                    existingNeighbor.f = existingNeighbor.g + existingNeighbor.h;
                    existingNeighbor.parent = currentNode;
                }
            } else {
                // Ajouter le voisin à la liste ouverte
                openList.push(neighbor);
            }
        }
    }

    // Aucun chemin trouvé
    return null;
}


function detectCollision(rect1, rect2) {
    if (rect1.x < rect2.x + rect2.width &&
        rect1.x + rect1.width > rect2.x &&
        rect1.y < rect2.y + rect2.height &&
        rect1.y + rect1.height > rect2.y) {
        return true;
    } else {
        return false;
    }
}

function moveNPCs() {
    let obstacles = walls.concat(npcList)
  for (var i = 0; i < npcList.length; i++) {
    var npc = npcList[i];
    // Trouver le chemin vers le joueur
    var path = findPath(npc, player, obstacles);
    if (path) {
      // Déplacer le PNJ vers le joueur en suivant le chemin
      var nextNode = path[0];
      var dx = nextNode.x - npc.x;
      var dy = nextNode.y - npc.y;
      var dist = Math.sqrt(dx * dx + dy * dy);
      if (dist > npc.moveSpeed) {
        dx = dx * npc.moveSpeed / dist;
        dy = dy * npc.moveSpeed / dist;
      }
      npc.x += dx;
      npc.y += dy;
      // Vérifier les collisions avec les murs
      for (var j = 0; j < obstacles.length; j++) {
        if (detectCollision(npc, obstacles[j])) {
          // Annuler le déplacement
          npc.x -= dx;
          npc.y -= dy;
          break;
        }
      }
      // Vérifier les collisions avec les autres PNJ
      for (var j = 0; j < npcList.length; j++) {
        if (i !== j && detectCollision(npc, npcList[j])) {
          // Annuler le déplacement
          npc.x -= dx;
          npc.y -= dy;
          break;
        }
      }
    }
  }
}


function movePlayer() {
    console.log("ca", player.xSpeed, player.ySpeed)
    player.xSpeed=player.ySpeed=0
    if (leftPressed) {
        // Left Arrow
        player.xSpeed = -5;
    } else if (rightPressed) {
        // Up Arrow
        player.xSpeed = 5;
    } 
    if (upPressed) {
        // Right Arrow
        player.ySpeed = -5;
    } else if (downPressed) {
        // Down Arrow
        player.ySpeed = 5;
    }
    var newX = player.x + player.xSpeed;
    var newY = player.y + player.ySpeed;
    var canMove = true;

    // Vérifier les collisions avec les murs
    for (var i = 0; i < walls.length; i++) {
        var wall = walls[i];
        if (detectCollision({ x: newX, y: newY, width: squareSize, height: squareSize }, wall)) {
            canMove = false;
            break;
        }
    }

    // Vérifier les collisions avec les PNJ
    for (var i = 0; i < npcList.length; i++) {
        var npc = npcList[i];
        if (detectCollision({ x: newX, y: newY, width: squareSize, height: squareSize }, npc)) {
            canMove = false;
            break;
        }
    }

    // Déplacer le joueur si possible
    if (canMove) {
        player.x = newX;
        player.y = newY;
        // Vérifier si le joueur est sorti de l'écran
        if (player.x < xOffset) {
            player.x = xOffset;
        } else if (player.x > xOffset + canvas.width - squareSize) {
            player.x = xOffset + canvas.width - squareSize;
        }
        if (player.y < yOffset) {
            player.y = yOffset;
        } else if (player.y > yOffset + canvas.height - squareSize) {
            player.y = yOffset + canvas.height - squareSize;
        }
    }
}




function draw() {
    // Effacer le canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Dessiner le fond d'écran et les murs
    drawBackground();

    // Dessiner les entités
    drawPlayer();
    drawComputer();
    drawNPCs();

    // Tester les collisions
    checkCollisions();

    // Déplacer les entités
    moveNPCs();
    movePlayer();

    // Demander une nouvelle frame
    requestAnimationFrame(draw);
}// Détecter les touches de déplacement
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

function keyDownHandler(event) {
    if (event.key == "ArrowLeft") {console.log("a")
        leftPressed = true;
    } else if (event.key == "ArrowRight") {
        rightPressed = true;
    } else if (event.key == "ArrowUp") {
        upPressed = true;
    } else if (event.key == "ArrowDown") {
        downPressed = true;
    } else if (event.code == "Space") {
        spacePressed = true;
    }
}

function keyUpHandler(event) {
    if (event.key == "ArrowLeft") {
        leftPressed = false;
    } else if (event.key == "ArrowRight") {
        rightPressed = false;
    } else if (event.key == "ArrowUp") {
        upPressed = false;
    } else if (event.key == "ArrowDown") {
        downPressed = false;
    } else if (event.code == "Space") {
        spacePressed = false;
        if (computer.collided) {
            computer.color = "#FF0000";
        }
    }
}

// Lancer le jeu
draw();
