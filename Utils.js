let Utils={
    colide(x, y, entity, entityList) {
        for (const tmpEntity of entityList) {
            if (!( tmpEntity.x > x + entity.width
                || tmpEntity.x < x - tmpEntity.width
                || tmpEntity.y > y + entity.height
                || tmpEntity.y < y - tmpEntity.height) ) {
                return true;
            }
        }
        return false;
    },
    drawRec(x, y, h, w, color, ctx){
        ctx.fillStyle = color;
        ctx.fillRect(x, y, w, h);
    },
    drawBackground(walls, ctx){
        for (var i = 0; i < walls.length; i++) {
            var wall = walls[i];
            this.drawRec(wall.x, wall.y, wall.height, wall.width, "#333",ctx);
        }
    }
}