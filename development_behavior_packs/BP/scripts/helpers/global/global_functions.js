export { positionInAreCheck };
/**
 * Checks if a position is inside a certain area.
 * @param position position for the check.
 * @param firstPoint beginning of area, must be the minimum of each axis.
 * @param secondPoint end of area, must be the maximum number of each axis.
 */
function positionInAreCheck(position, firstPoint, secondPoint) {
    if (
    // +1 and -1 is used to ensure full block detection
    position.x >= firstPoint.x - 1 && position.x <= secondPoint.x + 1 &&
        position.y >= firstPoint.y - 1 && position.y <= secondPoint.y + 1 &&
        position.z >= firstPoint.z - 1 && position.z <= secondPoint.z + 1) {
        return true;
    }
    return false;
}
