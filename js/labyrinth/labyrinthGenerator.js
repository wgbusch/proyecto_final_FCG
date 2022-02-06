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
        let currentNode = pickIdNotInUTS(uniformSpanningTree);
        randomWalk.push(currentNode);

        while (!uniformSpanningTree.has(currentNode)) {
            let possibleMovementDirections = [];

            let xIndex = uniformSpanningTree.getXIndex(currentNode);
            let zIndex = uniformSpanningTree.getZIndex(currentNode);

            let topSquare = uniformSpanningTree.getIdOfMovingOneStepInNorthDirection(currentNode);
            let bottomSquare = uniformSpanningTree.getIdOfMovingOneStepInSouthDirection(currentNode);
            let rightSquare = uniformSpanningTree.getIdOfMovingOneStepInEastDirection(currentNode);
            let leftSquare = uniformSpanningTree.getIdOfMovingOneStepInWestDirection(currentNode);

            let isOnTopBorder = zIndex === 0;
            let isOnBottomBorder = zIndex === numberOfZSquares - 1;
            let isOnRightBorder = xIndex === numberOfXSquares - 1;
            let isOnLeftBorder = xIndex === 0;

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
            previousNode = currentNode;
            currentNode = nextNode;
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
