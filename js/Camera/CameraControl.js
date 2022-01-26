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
            let length = 2 / zLength;
            let speed = UPDATE_SPEED * length / TIME_TO_TRAVEL_ONE_BLOCK;
            let original = transZ;
            let forward = () => {
                console.log("forward first!!");
                transZ -= speed;
                DrawScene();
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

            let length = 2 / xLength;
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
            let length = 2 / xLength;
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
            let length = 2 / zLength;
            let speed = UPDATE_SPEED * length / TIME_TO_TRAVEL_ONE_BLOCK;
            let original = transZ;

            let backwards = () => {
                transZ += speed;
                DrawScene();
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

class LabyrinthMovement {
    zLength;
    xLength;
    labyrinth;

    constructor(labyrinth) {
        this.labyrinth = labyrinth;
        this.zLength = labyrinth.getZLength();
        this.xLength = labyrinth.getXLength();
    }

    calculateRelativeDirection(startX, startZ, nextX, nextZ) {
        if (startX === nextX) {
            if (startZ + 1 === nextZ) {
                return new South();
            }
            if (startZ - 1 === nextZ) {
                return new North();
            }
        } else if (startZ === nextZ) {
            if (startX + 1 === nextX) {
                return new East();
            }
            if (startX - 1 === nextX) {
                return new West();
            }
        } else {
            console.log("error in path");
        }
    }

    getCoordinates(id) {
        return this.labyrinth.getCoordinates(id);
    }

    getMovementInstructionsAndNextDirection(starPoint, startDirection, endPoint) {
        let instructions = [];
        let [startX, startZ] = this.getCoordinates(starPoint);
        let [nextX, nextZ] = this.getCoordinates(endPoint);

        let nextDirection = this.calculateRelativeDirection(startX, startZ, nextX, nextZ);
        startDirection.rotateToNextDirection(nextDirection, instructions);

        nextDirection.move(instructions);
        return [instructions, nextDirection];
    }

    calculateCenterCoordinates(id) {
        let [xIndex, zIndex] = this.labyrinth.getCoordinates(id);
        return [(1 / this.xLength) * (2 * xIndex - 1) + 1,
                (1 / this.zLength) * (2 * zIndex + 1) - 1];
    }

    getNextIdBasedOnRightSideAlgorithm(id, direction) {
        let rightSide = direction.rightSide();
        if (this.labyrinth.areNeighbors(id, this.labyrinth.getIdOfMovingOneStepInThatDirection(id, rightSide))) {
            return this.labyrinth.getIdOfMovingOneStepInThatDirection(id, rightSide);

        }
        if (this.labyrinth.areNeighbors(id, this.labyrinth.getIdOfMovingOneStepInThatDirection(id, direction))) {
            return this.labyrinth.getIdOfMovingOneStepInThatDirection(id, direction);
        }

        if (this.labyrinth.areNeighbors(id, this.labyrinth.getIdOfMovingOneStepInThatDirection(id, rightSide.opposite()))) {
            return this.labyrinth.getIdOfMovingOneStepInThatDirection(id, rightSide.opposite());
        }
        return this.labyrinth.getIdOfMovingOneStepInThatDirection(id, direction.opposite());
    }

    getStartId() {
        return this.xLength * (this.zLength - 1);
    }

    getEndId() {
        return this.xLength - 1;
    }

    consumeGemIfAny(id){
        this.labyrinth.consumeGemIfAny
    }

}


