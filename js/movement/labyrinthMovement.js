class LabyrinthMovement {
    labyrinth;

    constructor(labyrinth) {
        this.labyrinth = labyrinth;
    }

    calculateRelativeDirection(startXIndex, startZIndex, nextXIndex, nextZIndex) {
        if (startXIndex === nextXIndex) {
            if (startZIndex + 1 === nextZIndex) {
                return new South();
            }
            if (startZIndex - 1 === nextZIndex) {
                return new North();
            }
        } else if (startZIndex === nextZIndex) {
            if (startXIndex + 1 === nextXIndex) {
                return new East();
            }
            if (startXIndex - 1 === nextXIndex) {
                return new West();
            }
        } else {
            console.log("error in path");
        }
    }

    getIndexes(id) {
        return this.labyrinth.getIndexes(id);
    }

    getMovementInstructionsAndNextDirection(startPoint, startDirection, endPoint) {
        let instructions = [];
        let [startXIndex, startZIndex] = this.getIndexes(startPoint);
        let [nextXIndex, nextZIndex] = this.getIndexes(endPoint);

        let nextDirection = this.calculateRelativeDirection(startXIndex, startZIndex, nextXIndex, nextZIndex);
        startDirection.rotateToNextDirection(nextDirection, instructions);

        nextDirection.move(instructions);
        return [instructions, nextDirection];
    }

    calculateCenterCoordinates(id) {
        let [xIndex, zIndex] = this.labyrinth.getIndexes(id);
        return [(1 / numberOfXSquares) * (TOTAL_X_LENGTH * xIndex - 1) + 1,
            (1 / numberOfZSquares) * (TOTAL_Z_LENGTH * zIndex + 1) - 1];
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