class LabyrinthGenerator {
    numberOfZSquares;
    numberOfXSquares;

    constructor(numberOfXSquares, numberOfZSquares) {
        this.numberOfZSquares = numberOfZSquares;
        this.numberOfXSquares = numberOfXSquares;
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

        let pickNodeNotInUts = (uts) => {
            let zIndex = this.numberOfZSquares;
            let xIndex = this.numberOfXSquares;
            let randomNumber = this.random(zIndex * xIndex);
            while (uts.has(randomNumber)) {
                randomNumber = this.random(zIndex * xIndex);
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
        let zIndex = this.numberOfZSquares;
        let xIndex = this.numberOfXSquares;
        while (!uts.has(currentNode)) {
            let possibleMovementDirections = [];

            let row = uts.row(currentNode);
            let column = uts.column(currentNode);
            if (row > 0 && currentNode - xIndex !== previousNode)
                possibleMovementDirections.push(currentNode - xIndex);
            if (row < zIndex - 1 && currentNode + xIndex !== previousNode)
                possibleMovementDirections.push(currentNode + xIndex)
            if (column > 0 && currentNode - 1 !== previousNode)
                possibleMovementDirections.push(currentNode - 1)
            if (column < xIndex - 1 && currentNode + 1 !== previousNode)
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

    addGems(labyrinth, proportion) {
        let size = labyrinth.size;
        let numberOfGems = Math.floor(size * proportion / 100);
        for (let i = 0; i < numberOfGems; i++) {
            labyrinth.addGem(Math.floor(Math.random() * size));
        }
    }
}

class Proportion {
    // Create new instances of the same class as static attributes
    static Large = 20;
    static Medium = 10;
    static Small = 5;
}
