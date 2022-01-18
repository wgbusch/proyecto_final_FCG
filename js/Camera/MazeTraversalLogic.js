
function evaluatePath(list, callback) {
    if (list.length === 1) {
        list[0].evaluate().finally(() => {
            callback();
        });
        return;
    }
    list[0].evaluate().then(() => {
        evaluatePath(list.slice(1, list.length), callback);
    });
}

function FindEscapeRecursion(labyrinthMovement, start_id, start_direction, next_id) {

    let [movementInstructions, nextDirection] = labyrinthMovement.getNextDirection(start_id, start_direction, next_id);
    let callback = () => {
        start_id = next_id;
        next_id = labyrinthMovement.moveRightSide(start_id, nextDirection);
        if (start_id !== end_id) {
            FindEscapeRecursion(labyrinthMovement, start_id, nextDirection, next_id);
        }
    }
    evaluatePath(movementInstructions, callback);
}

function FindEscape(labyrinthMovement) {

    let startingDirection = new North();
    let next_id = labyrinthMovement.moveRightSide(start_id, startingDirection);

    FindEscapeRecursion(labyrinthMovement, start_id, new North(), next_id);
}
