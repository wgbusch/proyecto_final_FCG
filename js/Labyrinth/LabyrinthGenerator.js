class LabyrinthGenerator {
    zLength;
    xLength;

    constructor(zLength, xLength) {
        this.zLength = zLength;
        this.xLength = xLength;
    }

    wilsonAlgorithm() {
        let xLength = this.xLength;
        let zLength = this.zLength;
        let uniform_spanning_tree = new Graph(xLength, zLength);
        uniform_spanning_tree.insertNode(this.random(zLength * xLength));
        while (uniform_spanning_tree.size < zLength * xLength) {
            let randomWalk = this.generateRandomWalk(uniform_spanning_tree);
            uniform_spanning_tree.insertWalk(randomWalk);
        }
        return uniform_spanning_tree;
    }

    pickNodeNotInUts(uts) {
        let zIndex = this.zLength;
        let xIndex = this.xLength;
        let randomNumber = this.random(zIndex * xIndex);
        while (uts.has(randomNumber)) {
            randomNumber = this.random(zIndex * xIndex);
        }
        return randomNumber;
    }

    random(range) {
        return Math.floor(Math.random() * range);
    }

    generateRandomWalk(uts) {
        let randomWalk = [];
        let previousNode = -1;
        let currentNode = this.pickNodeNotInUts(uts);
        randomWalk.push(currentNode);
        let zIndex = this.zLength;
        let xIndex = this.xLength;
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

            if (!this.makesALoop(nextNode, randomWalk)) {
                randomWalk.push(nextNode);
            } else {
                randomWalk = this.removeLoop(nextNode, randomWalk);
            }
            previousNode = currentNode;
            currentNode = nextNode;
        }
        return randomWalk;
    }

    makesALoop(nextEdge, randomWalk) {
        return randomWalk.includes(nextEdge);
    }

    removeLoop(nextEdge, randomWalk) {
        for (let i = randomWalk.length - 1; i >= 0; i--) {
            if (randomWalk[i] === nextEdge) {
                randomWalk = randomWalk.slice(0, i);
                randomWalk.push(nextEdge);
                break;
            }
        }
        return randomWalk;
    }
}