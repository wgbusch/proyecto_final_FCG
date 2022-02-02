class LabyrinthGenerator {

    constructor(numberOfXSquares, numberOfZSquares) {
        this.numberOfXSquares = numberOfXSquares;
        this.numberOfZSquares = numberOfZSquares;
    }

    wilsonAlgorithm() {
        let numberOfXSquares = this.numberOfXSquares;
        let numberOfZSquares = this.numberOfZSquares;

        let uniform_spanning_tree = new Graph(numberOfXSquares, numberOfZSquares);
        uniform_spanning_tree.insertNode(this.random(numberOfZSquares * numberOfXSquares));
        while (uniform_spanning_tree.size < numberOfZSquares * numberOfXSquares) {
            let randomWalk = this.generateRandomWalk(uniform_spanning_tree);
            uniform_spanning_tree.insertWalk(randomWalk);
        }
        return uniform_spanning_tree;
    }

    random(range) {
        return Math.floor(Math.random() * range);
    }

    generateRandomWalk(uts) {
        let numberOfXSquares = this.numberOfXSquares;
        let numberOfZSquares = this.numberOfZSquares;

        let pickNodeNotInUts = (uts) => {
            let randomNumber = this.random(numberOfZSquares * numberOfXSquares);
            while (uts.has(randomNumber)) {
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
        let currentNode = pickNodeNotInUts(uts);
        randomWalk.push(currentNode);

        while (!uts.has(currentNode)) {
            let possibleMovementDirections = [];

            let row = uts.zIndex(currentNode);
            let column = uts.xIndex(currentNode);
            if (row > 0 && currentNode - numberOfXSquares !== previousNode)
                possibleMovementDirections.push(currentNode - numberOfXSquares);
            if (row < numberOfZSquares - 1 && currentNode + numberOfXSquares !== previousNode)
                possibleMovementDirections.push(currentNode + numberOfXSquares)
            if (column > 0 && currentNode - 1 !== previousNode)
                possibleMovementDirections.push(currentNode - 1)
            if (column < numberOfXSquares - 1 && currentNode + 1 !== previousNode)
                possibleMovementDirections.push(currentNode + 1)
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
