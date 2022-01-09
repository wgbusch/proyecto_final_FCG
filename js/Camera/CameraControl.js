TIME_TO_TRAVEL_ONE_BLOCK = 2000;
TIME_TO_ROTATE_90_DEGREES = 1000;
UPDATE_SPEED = 100;
let SPEED = 0.006;


class North {

    rotateFromNorth(list) {
        return;
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
        return;
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
}

class West {

    rotateFromNorth(list) {
        list.push(get90DegreeAntiClockwiseRotationPromise());
    }

    rotateFromWest(list) {
        return;
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
        return;
    }

    move(list) {
        list.push(getBackwardPromise());
    }

    rotateToNextDirection(nextDirection, list) {
        nextDirection.rotateFromSouth(list);
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
            let length = 2 / utsx.getZLength();
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

            let length = 2 / utsx.getXLength();
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
            let length = 2 / utsx.getXLength();
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
            let length = 2 / utsx.getZLength();
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
                console.log("rotate clockwise!!");
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
                console.log("rotate counter clockwise!!");
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

/// 4,4
/// [12 13  14 15 ]
/// [8  9   10 11 ]
/// [4  5   6   7 ]
/// [0  1   2   3 ]
/// [2, 6, 5, 1, 0, 4, 8, 12]
class Converter {
    finalList;
    zLength;
    xLength;
    uts;

    constructor(uts) {
        this.finalList = [];
        this.uts = uts;
        this.zLength = uts.getZLength();
        this.xLength = uts.getXLength();
    }

    calculateRelativeDirection(start_x, start_z, next_x, next_z) {
        if (start_x === next_x) {
            if (start_z + 1 === next_z) {
                return new South();
            }
            if (start_z - 1 === next_z) {
                return new North();
            }
        } else if (start_z === next_z) {
            if (start_x + 1 === next_x) {
                return new East();
            }
            if (start_x - 1 === next_x) {
                return new West();
            }
        } else {
            console.log("error in path");
        }
    }

    getCoordinates(id) {
        return this.uts.getCoordinates(id);
    }

    getNextDirection(starPoint, startDirection, endPoint) {
        let instructions = [];
        let [start_x, start_z] = this.getCoordinates(starPoint);
        let [next_x, next_z] = this.getCoordinates(endPoint);

        let nextDirection = this.calculateRelativeDirection(start_x, start_z, next_x, next_z);
        startDirection.rotateToNextDirection(nextDirection, instructions);

        nextDirection.move(instructions);
        return [instructions, nextDirection];
    }

    calculateCenterCoordinates(id) {
        let [xIndex, zIndex] = this.uts.getCoordinates(id);
        return [(1 / this.xLength) * (2 * xIndex - 1) + 1,
                (1 / this.zLength) * (2 * zIndex + 1) - 1];
    }

    getRandomMovement(id) {
        return this.uts.getRandomMovement(id);
    }
}

