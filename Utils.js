class Utils{
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
    }
}