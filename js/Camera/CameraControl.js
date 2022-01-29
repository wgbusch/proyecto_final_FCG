TIME_TO_TRAVEL_ONE_BLOCK = 2000;
TIME_TO_ROTATE_90_DEGREES = 1000;
UPDATE_SPEED = 100;

class North {

    rotateFromNorth(list) {
    }

    rotateFromWest(list) {
        list.push(get90DegreeClockwiseRotationPromise());
    }

    rotateFromEast(list) {
        list.push(get90DegreeAntiClockwiseRotationPromise());
    }

    rotateFromSouth(list) {
        list.push(get90DegreeClockwiseRotationPromise());
        list.push(get90DegreeClockwiseRotationPromise());
    }

    move(list) {
        list.push(getForwardPromise());
    }

    rotateToNextDirection(nextDirection, list) {
        nextDirection.rotateFromNorth(list);
    }

    rightSide() {
        return new East();
    }

    getIdOfMovingOneStepFrom(id, uts) {
        return uts.getIdOfMovingOneStepInNorthDirection(id);
    }

    opposite() {
        return new South();
    }
}

class East {

    rotateFromNorth(list) {
        list.push(get90DegreeClockwiseRotationPromise());
    }

    rotateFromWest(list) {
        list.push(get90DegreeClockwiseRotationPromise());
        list.push(get90DegreeClockwiseRotationPromise());
    }

    rotateFromEast(list) {
    }

    rotateFromSouth(list) {
        list.push(get90DegreeAntiClockwiseRotationPromise());
    }

    move(list) {
        list.push(getRightPromise());
    }

    rotateToNextDirection(nextDirection, list) {
        nextDirection.rotateFromEast(list);
    }

    rightSide() {
        return new South();
    }

    getIdOfMovingOneStepFrom(id, uts) {
        return uts.getIdOfMovingOneStepInEastDirection(id);
    }

    opposite() {
        return new West();
    }
}

class West {

    rotateFromNorth(list) {
        list.push(get90DegreeAntiClockwiseRotationPromise());
    }

    rotateFromWest(list) {
    }

    rotateFromEast(list) {
        list.push(get90DegreeAntiClockwiseRotationPromise());
        list.push(get90DegreeAntiClockwiseRotationPromise());
    }

    rotateFromSouth(list) {
        list.push(get90DegreeClockwiseRotationPromise());
    }

    move(list) {
        list.push(getLeftPromise());
    }

    rotateToNextDirection(nextDirection, list) {
        nextDirection.rotateFromWest(list);
    }

    rightSide() {
        return new North();
    }

    getIdOfMovingOneStepFrom(id, uts) {
        return uts.getIdOfMovingOneStepInWestDirection(id);
    }

    opposite() {
        return new East();
    }
}

class South {

    rotateFromNorth(list) {
        list.push(get90DegreeAntiClockwiseRotationPromise());
        list.push(get90DegreeAntiClockwiseRotationPromise());
    }

    rotateFromWest(list) {
        list.push(get90DegreeAntiClockwiseRotationPromise());
    }

    rotateFromEast(list) {
        list.push(get90DegreeClockwiseRotationPromise());
    }

    rotateFromSouth(list) {
    }

    move(list) {
        list.push(getBackwardPromise());
    }

    rotateToNextDirection(nextDirection, list) {
        nextDirection.rotateFromSouth(list);
    }

    rightSide() {
        return new West();
    }

    getIdOfMovingOneStepFrom(id, uts) {
        return uts.getIdOfMovingOneStepInSouthDirection(id);
    }

    opposite() {
        return new North();
    }
}

class PathInstruction {
    promise;

    constructor(promise) {
        this.promise = promise;
    }

    evaluate() {
        return this.promise();
    }
}

function getForwardPromise() {
    let forwardPromise = () => {
        return new Promise((resolve, reject) => {
            let length = 2 / numberOfZSquares;
            let speed = UPDATE_SPEED * length / TIME_TO_TRAVEL_ONE_BLOCK;
            let original = transZ;
            let forward = () => {
                // transZ -= speed;
                moveZ(-speed);
                // DrawScene();
                if (transZ <= original - length) {
                    resolve();
                    return;
                }
                setTimeout(forward, UPDATE_SPEED);
            }
            forward();
        });
    };
    return new PathInstruction(forwardPromise);
}

function getLeftPromise() {
    let leftPromise = () => {
        return new Promise((resolve, reject) => {

            let length = 2 / numberOfXSquares;
            let speed = UPDATE_SPEED * length / TIME_TO_TRAVEL_ONE_BLOCK;
            let original = transX;

            let left = () => {
                transX += speed;
                DrawScene();
                if (transX >= original + length) {
                    resolve();
                    return;
                }
                setTimeout(left, UPDATE_SPEED);
            }
            left();

        });
    };
    return new PathInstruction(leftPromise);
}

function getRightPromise() {
    let rightPromise = () => {
        return new Promise((resolve, reject) => {
            let length = 2 / numberOfXSquares;
            let speed = UPDATE_SPEED * length / TIME_TO_TRAVEL_ONE_BLOCK;
            let original = transX;

            let right = () => {
                transX -= speed;
                DrawScene();
                if (transX <= original - length) {
                    resolve();
                    return;
                }
                setTimeout(right, UPDATE_SPEED);
            }
            right();
        });
    };
    return new PathInstruction(rightPromise);
}

function getBackwardPromise() {
    let backwardPromise = () => {
        return new Promise((resolve, reject) => {
            let length = 2 / numberOfZSquares;
            let speed = UPDATE_SPEED * length / TIME_TO_TRAVEL_ONE_BLOCK;
            let original = transZ;

            let backwards = () => {
                moveZ(speed);
                // transZ += speed;
                // DrawScene();
                if (transZ >= original + length) {
                    resolve();
                    return;
                }
                setTimeout(backwards, UPDATE_SPEED);
            }
            backwards();
        });
    };
    return new PathInstruction(backwardPromise);
}

function get90DegreeClockwiseRotationPromise() {
    let clockwiseRotationPromise = () => {
        return new Promise((resolve, reject) => {
            let original = cameraRotationXY;
            let speed = UPDATE_SPEED * (Math.PI / 2) / TIME_TO_ROTATE_90_DEGREES;

            let rotationClockwise = () => {
                cameraRotationXY -= speed;
                DrawScene();
                if (cameraRotationXY <= original - Math.PI / 2) {
                    if (cameraRotationXY <= -2 * Math.PI) {
                        cameraRotationXY += 2 * Math.PI;
                    }
                    resolve();
                    return;
                }
                setTimeout(rotationClockwise, UPDATE_SPEED);
            };
            rotationClockwise();
        });
    }
    return new PathInstruction(clockwiseRotationPromise);
}

function get90DegreeAntiClockwiseRotationPromise() {
    let counterClockwisePromise = () => {
        return new Promise((resolve, reject) => {

            let original = cameraRotationXY;
            let speed = UPDATE_SPEED * (Math.PI / 2) / TIME_TO_ROTATE_90_DEGREES;

            let rotationAntiClockwise = () => {
                cameraRotationXY += speed;
                DrawScene();
                if (cameraRotationXY >= original + Math.PI / 2) {
                    if (cameraRotationXY >= 2 * Math.PI) {
                        cameraRotationXY -= 2 * Math.PI;
                    }
                    resolve();
                    return;
                }
                setTimeout(rotationAntiClockwise, UPDATE_SPEED);
            };
            rotationAntiClockwise();
        });
    }
    return new PathInstruction(counterClockwisePromise);
}

function moveX(change) {
    let id = calculateIdFromCoordinates(transX, transZ);
    transX += change;
    score += Number.parseInt(labyrinthMovement.consumeGemIfAny(id));
    DrawScene();
}

function moveY(change) {
    let id = 0;
    transY += change;
    score += Number.parseInt(labyrinthMovement.consumeGemIfAny(id));
    DrawScene();
}

function moveZ(change) {
    let id = calculateIdFromCoordinates(transX, transZ);
    transZ += change;
    score += Number.parseInt(labyrinthMovement.consumeGemIfAny(id));
    DrawScene();
}

function calculateIdFromCoordinates(x, z) {
    let xIndex = Math.floor((numberOfXSquares / TOTAL_X_LENGTH) * (1 - x) - 1);
    let zIndex = Math.floor(5 * (z + 1));
    return [xIndex, zIndex];
}