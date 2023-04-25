// Variables globales
var canvas, ctx, background, player, npcs, walls, computer, gameLoop;

// Taille d'un carré en pixels
var squareSize = 50;

var backgroundWidth=0;
var backgroundHeight=0;

var backgroundXOffset=0;
var backgroundYOffset=0;

var keys = {}; // Initialiser l'état des touches du clavier
document.addEventListener("keydown", function (event) {
    keys[event.keyCode] = true;
});

document.addEventListener("keyup", function (event) {
    keys[event.keyCode] = false;
});

// Initialisation du jeu
function init() {
    // Récupérer le canvas et le contexte de dessin
    canvas = document.getElementById("game-canvas");
    ctx = canvas.getContext("2d");
    canvas.width = 800;
    canvas.height = 600;

    // Dimensions du fond d'écran en pixels
    backgroundWidth = 200 * squareSize;
    backgroundHeight = 150 * squareSize;

    backgroundXOffset = (canvas.width - backgroundWidth) / 2;
    backgroundYOffset = (canvas.height - backgroundHeight) / 2;

    // Charger l'image de fond
    background = new Image();
    background.onload = function () {
        // Dessiner l'image de fond
        ctx.drawImage(background, 0, 0);
    };
    background.src = "background.jpg";

    // Initialiser le joueur
    player = {
        x: 50,
        y: 50,
        width: 50,
        height: 50,
        moveSpeed: 5
    };

    // Initialiser les PNJ
    npcs = [];
    for (var i = 0; i < 3; i++) {
        var npc = {
            x: Math.floor(Math.random() * 200) + 100,
            y: Math.floor(Math.random() * 200) + 100,
            width: 50,
            height: 50,
            moveSpeed: 5
        };
        npcs.push(npc);
    }

    // Initialiser les murs
    walls = [];
    for (var i = 0; i < 20; i++) {
        var wall = {
            x: Math.floor(Math.random() * 200) + 100,
            y: Math.floor(Math.random() * 200) + 100,
            width: 50,
            height: 50
        };
        walls.push(wall);
    }

    // Initialiser l'ordinateur
    computer = {
        x: 700,
        y: 500,
        width: 50,
        height: 50,
        color: "green"
    };


    // Dessiner le jeu
    draw();

    // Lancer la boucle de jeu
    gameLoop = setInterval(function () {
        movePlayer();
        moveNPCs(player, npcs, walls.concat(npcs), player.moveSpeed);
        draw();
    }, 20);
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

// Dessiner le jeu
function draw() {
    // Réinitialiser le canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Dessiner le fond d'écran
    ctx.drawImage(background, backgroundXOffset, backgroundYOffset);

    // Dessiner les murs
    ctx.fillStyle = "gray";
    for (var i = 0; i < walls.length; i++) {
        ctx.fillRect(walls[i].x, walls[i].y, walls[i].width, walls[i].height);
    }

    // Dessiner les PNJ
    ctx.fillStyle = "blue";
    for (var i = 0; i < npcs.length; i++) {
        ctx.fillRect(npcs[i].x, npcs[i].y, npcs[i].width, npcs[i].height);
    }

    // Dessiner le joueur
    ctx.fillStyle = "red";
    ctx.fillRect(player.x, player.y, player.width, player.height);

    // Dessiner l'ordinateur
    drawComputer();

    // Mettre à jour le scrolling
    updateScrolling();
}

// Dessiner l'ordinateur
function drawComputer() {
    // Dessiner l'ordinateur
    ctx.fillStyle = computer.color;
    ctx.fillRect(computer.x, computer.y, computer.width, computer.height);

    // Dessiner les infos de débogage (pour le débogage)
    /*
    ctx.fillStyle = "black";
    ctx.font = "16px Arial";
    ctx.fillText("Player: (" + player.x + ", " + player.y + ")", 10, 20);
    for (var i = 0; i < npcs.length; i++) {
      ctx.fillText("NPC " + (i+1) + ": (" + npcs[i].x + ", " + npcs[i].y + ")", 10, 20 + (i+1)*20);
    }
    */
}

// Déplacer le joueur
function movePlayer() {
    var dx = 0;
    var dy = 0;
    if (keys[37]) { // Gauche
        dx -= player.moveSpeed;
    }
    if (keys[38]) { // Haut
        dy -= player.moveSpeed;
    }
    if (keys[39]) { // Droite
        dx += player.moveSpeed;
    }
    if (keys[40]) { // Bas
        dy += player.moveSpeed;
    }
    // Vérifier les collisions avec les murs
    if (checkCollisions(player, dx, dy, walls.concat(npcs))) {
        player.x += dx;
        player.y += dy;
    }
}

// Déplacer les PNJ
function moveNPCs(player, npcs, obstacles, moveSpeed) {
    for (var i = 0; i < npcs.length; i++) {
        var npc = npcs[i];
        // Trouver le chemin vers le joueur
        var path = findPath(npc, player, obstacles);
        if (path) {
            // Déplacer le PNJ vers le joueur en suivant le chemin
            var nextNode = path[0];
            var dx = nextNode.x - npc.x;
            var dy = nextNode.y - npc.y;
            var dist = Math.sqrt(dx * dx + dy * dy);
            if (dist > moveSpeed) {
                dx = dx * moveSpeed / dist;
                dy = dy * moveSpeed / dist;
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
            for (var j = 0; j < npcs.length; j++) {
                if (j !== i && detectCollision(npc, npcs[j])) {
                    // Annuler le déplacement
                    npc.x -= dx;
                    npc.y -= dy;
                    break;
                }
            }
        }
    }
}

// Vérifier les collisions
function checkCollisions(entity, dx, dy, obstacles) {
    var x = entity.x + dx;
    var y = entity.y + dy;
    for (var i = 0; i < obstacles.length; i++) {
        if (detectCollision({ x: x, y: y, width: entity.width, height: entity.height }, obstacles[i])) {
            return false;
        }
    }
    return true;
}

// Détecter une collision entre deux entités
function detectCollision(entity1, entity2) {
    return (entity1.x < entity2.x + entity2.width &&
        entity1.x + entity1.width > entity2.x &&
        entity1.y < entity2.y + entity2.height &&
        entity1.y + entity1.height > entity2.y);
}

// Mettre à jour le scrolling
function updateScrolling() {
    // Scrolling horizontal
    if (player.x < canvas.width / 4) {
        if (backgroundXOffset < 0) {
            backgroundXOffset += player.moveSpeed;
        }
    } else if (player.x > canvas.width * 3 / 4) {
        if (backgroundXOffset > canvas.width - background.width) {
            backgroundXOffset -= player.moveSpeed;
        }
    }

    // Scrolling vertical
    if (player.y < canvas.height / 4) {
        if (backgroundYOffset < 0) {
            backgroundYOffset += player.moveSpeed;
        }
    } else if (player.y > canvas.height * 3 / 4) {
        if (backgroundYOffset > canvas.height - background.height) {
            backgroundYOffset -= player.moveSpeed;
        }
    }
}

// Démarrer le jeu lorsque la page est chargée
window.onload = function () {
    init();
};
