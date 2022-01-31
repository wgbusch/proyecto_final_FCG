class LabyrinthMovement {
    labyrinth;

    constructor(labyrinth) {
        this.labyrinth = labyrinth;
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

    getMovementInstructionsAndNextDirection(startPoint, startDirection, endPoint) {
        let instructions = [];
        let [startX, startZ] = this.getCoordinates(startPoint);
        let [nextX, nextZ] = this.getCoordinates(endPoint);

        let nextDirection = this.calculateRelativeDirection(startX, startZ, nextX, nextZ);
        startDirection.rotateToNextDirection(nextDirection, instructions);

        nextDirection.move(instructions);
        return [instructions, nextDirection];
    }

    calculateCenterCoordinates(id) {
        let [xIndex, zIndex] = this.labyrinth.getCoordinates(id);
        return [(1 / numberOfXSquares) * (2 * xIndex - 1) + 1,
            (1 / numberOfZSquares) * (2 * zIndex + 1) - 1];
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
        return numberOfXSquares * (numberOfZSquares - 1);
    }

    getEndId() {
        return numberOfXSquares - 1;
    }

    calculateIndexesFromCoordinates(x, z) {
        let xIndex = Math.floor((numberOfXSquares / TOTAL_X_LENGTH) * (1 - x));
        let zIndex = Math.floor((numberOfZSquares / TOTAL_Z_LENGTH) * (z + 1));
        return [xIndex, zIndex];
    }

    getIdFromCoordinates(xIndex, zIndex) {
        return this.labyrinth.getIdFromCoordinates(xIndex, zIndex);
    }
}