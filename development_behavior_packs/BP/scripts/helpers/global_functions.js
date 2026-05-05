export { positionInAreCheck };
/**
 * Checks if a position is inside a certain area.
 * @param position: position for the check.
 * @param firstPoint: beginning of area, must be the minimum of each axis.
 * @param secondPoint: end of area, must be the maximum number of each axis.
 */
function positionInAreCheck(position, firstPoint, secondPoint) {
    if (position.x >= firstPoint.x && position.z <= secondPoint.x + 1 &&
        // +1 is used to make sure full block detection
        position.y >= firstPoint.y && position.z <= secondPoint.y + 1 &&
        position.z >= firstPoint.z && position.z <= secondPoint.z + 1) {
        return true;
    }
    return false;
}
