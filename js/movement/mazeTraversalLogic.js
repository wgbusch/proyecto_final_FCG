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

function FindEscapeRecursion(labyrinthMovement, startId, startDirection, nextId) {

    let [movementInstructions, nextDirection] = labyrinthMovement.getMovementInstructionsAndNextDirection(startId,
                                                                                                          startDirection,
                                                                                                          nextId);
    let callback = () => {
        startId = nextId;
        nextId = labyrinthMovement.getNextIdBasedOnRightSideAlgorithm(startId, nextDirection);

        if (startId !== end_id) {
            FindEscapeRecursion(labyrinthMovement, startId, nextDirection, nextId);
        }
    }
    executeListOfInstructions(movementInstructions, callback);
}

function FindEscape(labyrinthMovement) {

    let startingDirection = new North();
    let nextId = labyrinthMovement.getNextIdBasedOnRightSideAlgorithm(start_id, startingDirection);

    FindEscapeRecursion(labyrinthMovement, start_id, new North(), nextId);
}
