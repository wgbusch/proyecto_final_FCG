class LabyrinthGenerator {

    constructor(numberOfXSquares, numberOfZSquares) {
        this.numberOfXSquares = numberOfXSquares;
        this.numberOfZSquares = numberOfZSquares;
    }

    wilsonAlgorithm() {
        let numberOfXSquares = this.numberOfXSquares;
        let numberOfZSquares = this.numberOfZSquares;

        let uniformSpanningTree = new Graph(numberOfXSquares, numberOfZSquares);
        uniformSpanningTree.insertNode(this.random(numberOfZSquares * numberOfXSquares));
        while (uniformSpanningTree.size < numberOfZSquares * numberOfXSquares) {
            let randomWalk = this.generateRandomWalk(uniformSpanningTree);
            uniformSpanningTree.insertWalk(randomWalk);
        }
        return uniformSpanningTree;
    }

    random(range) {
        return Math.floor(Math.random() * range);
    }

    generateRandomWalk(uniformSpanningTree) {
        let numberOfXSquares = this.numberOfXSquares;
        let numberOfZSquares = this.numberOfZSquares;

        let pickIdNotInUTS = (uniformSpanningTree) => {
            let randomNumber = this.random(numberOfZSquares * numberOfXSquares);
            while (uniformSpanningTree.has(randomNumber)) {
                randomNumber = this.random(numberOfZSquares * numberOfXSquares);
            }
            return randomNumber;
        }

        let makesALoop = (nextEdge, randomWalk) => {
            return randomWalk.includes(nextEdge);
        }

        let removeLoop = (nextEdge, randomWalk) => {
            for (let i = randomWalk.length - 1; i >= 0; i--) {
                if (randomWalk[i] === nextEdge) {
                    randomWalk = randomWalk.slice(0, i);
                    randomWalk.push(nextEdge);
                    break;
                }
            }
            return randomWalk;
        }

        let randomWalk = [];
        let previousNode = -1;
        let currentId = pickIdNotInUTS(uniformSpanningTree);
        randomWalk.push(currentId);

        while (!uniformSpanningTree.has(currentId)) {
            let possibleMovementDirections = [];

            let xIndex = uniformSpanningTree.getXIndex(currentId);
            let zIndex = uniformSpanningTree.getZIndex(currentId);

            let topSquare = uniformSpanningTree.getIdOfMovingOneStepInNorthDirection(currentId);
            let bottomSquare = uniformSpanningTree.getIdOfMovingOneStepInSouthDirection(currentId);
            let leftSquare = uniformSpanningTree.getIdOfMovingOneStepInWestDirection(currentId);
            let rightSquare = uniformSpanningTree.getIdOfMovingOneStepInEastDirection(currentId);

            let isOnTopBorder = uniformSpanningTree.isOnTopBorder(zIndex);
            let isOnBottomBorder =  uniformSpanningTree.isOnBottomBorder(zIndex);
            let isOnLeftBorder =  uniformSpanningTree.isOnLeftBorder(xIndex);
            let isOnRightBorder =  uniformSpanningTree.isOnRightBorder(xIndex);

            if (!isOnTopBorder && topSquare !== previousNode)
                possibleMovementDirections.push(topSquare);
            if (!isOnBottomBorder && bottomSquare !== previousNode)
                possibleMovementDirections.push(bottomSquare)
            if (!isOnLeftBorder && leftSquare !== previousNode)
                possibleMovementDirections.push(leftSquare)
            if (!isOnRightBorder && rightSquare !== previousNode)
                possibleMovementDirections.push(rightSquare)
            let nextNode = possibleMovementDirections[this.random(possibleMovementDirections.length)];

            if (!makesALoop(nextNode, randomWalk)) {
                randomWalk.push(nextNode);
            } else {
                randomWalk = removeLoop(nextNode, randomWalk);
            }
            previousNode = currentId;
            currentId = nextNode;
        }
        return randomWalk;
    }
}

class Proportion {
    // Create new instances of the same class as static attributes
    static Large = 20;
    static Medium = 15;
    static Small = 10;
}
