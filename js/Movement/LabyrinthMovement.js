class LabyrinthMovement {
    numberOfZSquares;
    numberOfXSquares;
    labyrinth;

    constructor(labyrinth) {
        this.labyrinth = labyrinth;
        this.numberOfZSquares = labyrinth.getNumberOfZSquares();
        this.numberOfXSquares = labyrinth.getNumberOfXSquares();
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
        return [(1 / this.numberOfXSquares) * (2 * xIndex - 1) + 1,
            (1 / this.numberOfZSquares) * (2 * zIndex + 1) - 1];
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
        return this.numberOfXSquares * (this.numberOfZSquares - 1);
    }

    getEndId() {
        return this.numberOfXSquares - 1;
    }

    consumeGemIfAny(id){
        return this.labyrinth.consumeGemIfAny(id);
    }
}