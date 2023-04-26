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
var width = 200;
var height = 150;
var backgroundWidth = width*10;
var backgroundHeight = height*10;

// Objet joueur
var player = {
    x: 100,
    y: 100,
    ySpeed:0,
    xSpeed:0,
    color: "#00FF00",
    moveSpeed: 10, height: squareSize, width: squareSize
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
        x: 4 * squareSize,
        y: 2 * squareSize,
        color: "#0000FF",
        radius: squareSize / 2,
        moveSpeed: 5, height: squareSize, width: squareSize,
        path: []
    },
    {
        x: 2 * squareSize,
        y: 4 * squareSize,
        color: "#0000FF",
        radius: squareSize / 2,
        moveSpeed: 5, height: squareSize, width: squareSize,
        path: []
    }
];

// Liste des murs
var walls = [];

// Créer les murs fixes
for (var i = 0; i < 20; i++) {
    var wallX = Math.floor(Math.random() * backgroundWidth);
    var wallY = Math.floor(Math.random() * backgroundHeight);
    walls.push({ x: wallX, y: wallY, height: 50, width: 20 });
} console.log(player,walls)

// Créer le canvas et le contexte
var canvas = document.getElementById("gameCanvas");
canvas.width = backgroundWidth;
canvas.height = backgroundHeight;
var ctx = canvas.getContext("2d");

var backgroundXOffset = (canvas.width - backgroundWidth) / 2;
var backgroundYOffset = (canvas.height - backgroundHeight) / 2;

function drawBackground() {
    // Dessiner les murs fixes
    ctx.fillStyle = "#333";
    for (var i = 0; i < walls.length; i++) {
        var wall = walls[i];
        ctx.fillRect(wall.x, wall.y, wall.height, wall.width);
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
        ctx.fillRect(npc.x, npc.y, squareSize, squareSize);
    }
}

function checkCollisions() {
    // Vérifier les collisions avec les murs
    for (var i = 0; i < walls.length; i++) {
        var wall = walls[i];
        if (player.x < wall.x + wall.width &&
            player.x + player.width > wall.x &&
            player.y < wall.y + wall.height &&
            player.y + player.height > wall.y) {
            // Collision entre le joueur et le mur
            if (player.x < wall.x) {
                player.x = wall.x - wall.width;
            } else if (player.x > wall.x) {
                player.x = wall.x + wall.width;
            }
            if (player.y < wall.y) {
                player.y = wall.y - wall.height;
            } else if (player.y > wall.y) {
                player.y = wall.y + wall.height;
            }
        }
    }

    // Vérifier les collisions avec les PNJ
    for (var i = 0; i < npcList.length; i++) {
        var npc = npcList[i];
        if (player.x < npc.x + npc.width &&
            player.x + player.width > npc.x &&
            player.y < npc.y + npc.height &&
            player.y + player.height > npc.y) {
            // Collision entre le joueur et le mur
            if (player.x < npc.x) {
                player.x = npc.x - npc.width;
            } else if (player.x > npc.x) {
                player.x = npc.x + npc.width;
            }
            if (player.y < npc.y) {
                player.y = npc.y - npc.height;
            } else if (player.y > npc.y) {
                player.y = npc.y + npc.height;
            }
        }
    }/*
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
    
    }*/
/***
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
function getDistance(entity1, entity2) {
    let y = (entity1.x + Math.floor(entity1.width /2)) - (entity2.x + Math.floor(entity2.width /2));
    let x = (entity1.y + Math.floor(entity1.height /2)) - (entity2.y + Math.floor(entity2.height /2));

    return Math.sqrt(x * x + y * y);
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

//version grille
function findPath(startEntity, endEntity, grid) {
    // Créer un tableau de noeuds représentant la grille
    var nodes = [];
    for (var x = 0; x < grid.length; x++) {
        var row = [];
        for (var y = 0; y < grid[0].length; y++) {
            var node = {
                x: x,
                y: y,
                f: 0,
                g: 0,
                h: 0,
                parent: null,
                isWall: grid[x][y] === 0
            };
            row.push(node);
        }
        nodes.push(row);
    }

    // Définir les noeuds de départ et d'arrivée
    var startNode = nodes[startEntity.x][startEntity.y];
    var endNode = nodes[endEntity.x][endEntity.y];

    // Créer des listes ouvertes et fermées
    var openList = [startNode];
    var closedList = [];

    // Calculer les distances de chaque noeud
    for (var x = 0; x < nodes.length; x++) {
        for (var y = 0; y < nodes[0].length; y++) {
            var node = nodes[x][y];
            node.h = heuristic(node, endNode);
        }
    }

    // Appliquer l'algorithme A*
    while (openList.length > 0) {
        // Trouver le noeud avec le score le plus bas
        var currentNode = openList[0];
        for (var i = 1; i < openList.length; i++) {
            if (openList[i].f < currentNode.f) {
                currentNode = openList[i];
            }
        }

        // Si on a atteint le noeud de destination, construire et retourner le chemin
        if (currentNode === endNode) {
            var path = [];
            while (currentNode.parent) {
                path.push({ x: currentNode.x, y: currentNode.y });
                currentNode = currentNode.parent;
            }
            path.push({ x: currentNode.x, y: currentNode.y });
            return path.reverse();
        }

        // Retirer le noeud courant de la liste ouverte et l'ajouter à la liste fermée
        removeFromArray(openList, currentNode);
        closedList.push(currentNode);

        // Vérifier les voisins du noeud courant
        var neighbors = getNeighbors(currentNode, nodes);
        for (var i = 0; i < neighbors.length; i++) {
            var neighbor = neighbors[i];

            // Ignorer les murs et les noeuds déjà dans la liste fermée
            if (neighbor.isWall || closedList.includes(neighbor)) {
                continue;
            }

            // Calculer les scores de ce noeud voisin
            var gScore = currentNode.g + 1;
            var gScoreIsBest = false;

            if (!openList.includes(neighbor)) {
                // Ajouter ce noeud voisin à la liste ouverte s'il n'y est pas déjà
                gScoreIsBest = true;
                neighbor.h = heuristic(neighbor, endNode);
                openList.push(neighbor);
            } else if (gScore < neighbor.g) {
                // Mettre à jour les scores de ce noeud voisin s'il a déjà été visité
                gScoreIsBest = true;
            }

            if (gScoreIsBest) {
                // Mettre à jour les scores de ce noeud voisin
                neighbor.parent = currentNode;
                neighbor.g = gScore;
                neighbor.f = neighbor.g + neighbor.h;
            }
        }
    }

    // Si on n'a pas trouvé de chemin, retourner une liste vide
    return [];
}
function simulateGrid(obstacles, width, height){
    const defaultArray = new Array(height).fill(1);
    let grid = new Array( width).fill([...defaultArray]);
    for (const obstacle of obstacles) {
        const x1 = obstacle.x - (obstacle.x%10);
        const y1 = obstacle.y - (obstacle.y % 10);
        const tmpX2 = obstacle.x + obstacle.width;
        const x2 = tmpX2 + (10 - tmpX2%10);
        const tmpY2 = obstacle.y + obstacle.height;
        const y2 = tmpY2 + (10 - tmpY2 % 10);
        for (let j = 0; j <= y1 - y2; j++) {
            let jd = j + y1;
        for (let i = 0; i <=x1-x2; i++) {
            let id = i + x1;
                if (grid[jd] && grid[jd][id]==1){
                    grid[jd][id]=0;
                }
            }            
        }
    }
    return grid;
}

function getNeighbors(node, nodes) {
    var x = node.x;
    var y = node.y;
    var neighbors = [];

    if (x > 0) {
        neighbors.push(nodes[x - 1][y]);
    }
    if (y > 0) {
        neighbors.push(nodes[x][y - 1]);
    }
    if (x < nodes.length - 1) {
        neighbors.push(nodes[x + 1][y]);
    }
    if (y < nodes[0].length - 1) {
        neighbors.push(nodes[x][y + 1]);
    }

    return neighbors;
}

function heuristic(node1, node2) {
    return Math.abs(node1.x - node2.x) + Math.abs(node1.y - node2.y);
}

function removeFromArray(array, item) {
    for (var i = array.length - 1; i >= 0; i--) {
        if (array[i] === item) {
            array.splice(i, 1);
        }
    }
}


function moveNPCs() {
    for (var i = 0; i < npcList.length; i++) {
        var npc = npcList[i];
        if (getDistance(npc,player)>squareSize+10){
      let tmpnpcList = [...npcList]
      tmpnpcList.splice(i,1)
      let obstacles = [...walls, ...tmpnpcList]//.concat(npcList)
      let tmpNpc = {}
      tmpNpc.x = (npc.x - (npc.x % 10))/10
      tmpNpc.y = (npc.y - (npc.y % 10))/10
      let tmpPlayer = {}
      tmpPlayer.x = (player.x - (player.x % 10)) / 10
      tmpPlayer.y = (player.y - (player.y % 10)) / 10
    // Trouver le chemin vers le joueur
      let grid= simulateGrid(obstacles,width,height)
      var path = findPath(tmpNpc, tmpPlayer, grid);
    if (path) {
      // Déplacer le PNJ vers le joueur en suivant le chemin
      var nextNode = path[1];
      var dx = (nextNode.x*10) - npc.x;
      var dy = (nextNode.y*10) - npc.y;
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
}


function movePlayer() {
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
    if (event.key == "ArrowLeft") {
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
