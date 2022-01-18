TIME_TO_TRAVEL_ONE_BLOCK = 2000;
TIME_TO_ROTATE_90_DEGREES = 1000;
UPDATE_SPEED = 100;

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
        return;
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

    moveRightSide(id, direction) {
        let rightSide = direction.rightSide();
        if (this.uts.areNeighbors(id, this.uts.getIdOfMovingOneStepInThatDirection(id, rightSide))) {
            return this.uts.getIdOfMovingOneStepInThatDirection(id, rightSide);

        }
        if (this.uts.areNeighbors(id, this.uts.getIdOfMovingOneStepInThatDirection(id, direction))) {
            return this.uts.getIdOfMovingOneStepInThatDirection(id, direction);
        }

        if (this.uts.areNeighbors(id, this.uts.getIdOfMovingOneStepInThatDirection(id, rightSide.opposite()))) {
            return this.uts.getIdOfMovingOneStepInThatDirection(id, rightSide.opposite());
        }
        return this.uts.getIdOfMovingOneStepInThatDirection(id, direction.opposite());
    }
}

function GetModelViewMatrix(translationX, translationY, translationZ,
                            rotationX, rotationY, rotationZ, cameraRotationXY) {

    const cosRotX = Math.cos(rotationX);
    const sinRotX = Math.sin(rotationX);

    const cosRotY = Math.cos(rotationY);
    const sinRotY = Math.sin(rotationY);

    const cosRotZ = Math.cos(rotationZ);
    const sinRotZ = Math.sin(rotationZ);

    let rotationMatrixX = [
        1, 0, 0, 0,
        0, cosRotX, sinRotX, 0,
        0, -sinRotX, cosRotX, 0,
        0, 0, 0, 1
    ]

    let rotationMatrixY = [
        cosRotY, 0, -sinRotY, 0,
        0, 1, 0, 0,
        sinRotY, 0, cosRotY, 0,
        0, 0, 0, 1
    ]

    let rotationMatrixZ = [
        cosRotZ, sinRotZ, 0, 0,
        -sinRotZ, cosRotZ, 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1
    ]

    let rotations = MatrixMult(rotationMatrixZ, MatrixMult(rotationMatrixX, rotationMatrixY));

    let trans = [
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        translationX, translationY, translationZ, 1
    ];

    let mv = MatrixMult(trans, rotations);

    let alpha = 0;
    let theta = cameraRotationXY;

    let w = new Vertex([
                           Math.cos(alpha) * Math.sin(theta),
                           Math.sin(alpha) * Math.sin(theta),
                           Math.cos(theta)]);

    let v2 = new Vertex([-w.z, 0, w.y]);
    let p = proj(w, v2);
    let u2 = new Vertex([v2.x - p.x, v2.y - p.y, v2.z - p.z]);

    let u = Normalize(u2);

    let u3 = crossProduct(w, u);
    let v = Normalize(u3);

    let direction = [
        -u.x, -u.y, -u.z, 0,
        -v.x, -v.y, -v.z, 0,
        w.x, w.y, w.z, 0,
        0, 0, 0, 1
    ];

    return MatrixMult(direction, mv);
}

