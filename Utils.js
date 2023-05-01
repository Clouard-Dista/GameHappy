let Utils = {
    colide(x, y, entity, colideGrid) {
        return false;
        return true;
    },
    drawRec(x, y, w, h, color, ctx) {
        ctx.fillStyle = color;
        ctx.fillRect(x, y, w, h);
    },
    drawBackground(walls, ctx) {
        for (var i = 0; i < walls.length; i++) {
            var wall = walls[i];
            this.drawRec(wall.x, wall.y, wall.width, wall.height, "#333", ctx);
        }
    },
    findPath(startEntity, endEntity, grid, sizePx) {
        // Créer un tableau de noeuds représentant la grille
        var nodes = [];
            for (var x = 0; x < grid[0].length; x++) {
                var row = [];
                for (var y = 0; y < grid.length; y++) {
                var node = {
                    x: x,
                    y: y,
                    f: 0,
                    g: 0,
                    h: 0,
                    parent: null,
                    isWall: grid[y][x] === 0
                };
                row.push(node);
            }
            nodes.push(row);
        }

        // Définir les noeuds de départ et d'arrivée
        tmpX = (startEntity.x - (startEntity.x % sizePx)) / sizePx
        tmpY = (startEntity.y - (startEntity.y % sizePx)) / sizePx
        if (!nodes[tmpX] || !nodes[tmpX][tmpY]) {
            return [];
        }
        var startNode = nodes[tmpX][tmpY];
        tmpX = (endEntity.x - (endEntity.x % sizePx)) / sizePx
        tmpY = (endEntity.y - (endEntity.y % sizePx)) / sizePx
        if (!nodes[tmpX] || !nodes[tmpX][tmpY]){
            return [];
        }
        var endNode = nodes[tmpX][tmpY];


        // Créer des listes ouvertes et fermées
        var openList = [startNode];
        var closedList = [];

        // Calculer les distances de chaque noeud
        for (var x = 0; x < nodes.length; x++) {
            for (var y = 0; y < nodes[0].length; y++) {
                var node = nodes[x][y];
                node.h = this.heuristic(node, endNode);
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
            this.removeFromArray(openList, currentNode);
            closedList.push(currentNode);

            // Vérifier les voisins du noeud courant
            var neighbors = this.getNeighbors(currentNode, nodes);
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
                    neighbor.h = this.heuristic(neighbor, endNode);
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
    },
    heuristic(node1, node2) {
        return Math.abs(node1.x - node2.x) + Math.abs(node1.y - node2.y);
},
    removeFromArray(array, item) {
        for (var i = array.length - 1; i >= 0; i--) {
            if (array[i] === item) {
                array.splice(i, 1);
            }
        }
    },
    getNeighbors(node, nodes) {
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
}