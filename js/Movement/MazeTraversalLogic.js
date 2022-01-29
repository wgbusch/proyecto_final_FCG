
function executeListOfInstructions(instructions, callback) {
    if (instructions.length === 1) {
        instructions[0].evaluate().finally(() => {
            callback();
        });
        return;
    }
    instructions[0].evaluate().then(() => {
        executeListOfInstructions(instructions.slice(1, instructions.length), callback);
    });
}

function FindEscapeRecursion(labyrinthMovement, start_id, start_direction, next_id) {

    let [movementInstructions, nextDirection] = labyrinthMovement.getMovementInstructionsAndNextDirection(start_id, start_direction, next_id);
    let callback = () => {
        start_id = next_id;
        next_id = labyrinthMovement.getNextIdBasedOnRightSideAlgorithm(start_id, nextDirection);

        if (start_id !== end_id) {
            FindEscapeRecursion(labyrinthMovement, start_id, nextDirection, next_id);
        }
    }
    executeListOfInstructions(movementInstructions, callback);
 }

function FindEscape(labyrinthMovement) {

    let startingDirection = new North();
    let next_id = labyrinthMovement.getNextIdBasedOnRightSideAlgorithm(start_id, startingDirection);

    FindEscapeRecursion(labyrinthMovement, start_id, new North(), next_id);
}
