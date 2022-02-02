class Node {
    id;
    neighbors = []

    constructor(id) {
        this.id = id;
        this.neighbors = [];
    }
}

class Graph {
    numberOfXSquares;
    numberOfZSquares;
    nodes;
    size = 0;

    constructor(numberOfXSquares, numberOfZSquares) {
        this.numberOfXSquares = numberOfXSquares;
        this.numberOfZSquares = numberOfZSquares;
        this.nodes = [];
    }

    insertNode(id) {
        let zIndex = this.zIndex(id);
        let xIndex = this.xIndex(id);
        if (!this.nodes[zIndex])
            this.nodes[zIndex] = []
        if (!this.nodes[zIndex][xIndex]) {
            this.nodes[zIndex][xIndex] = new Node(id);
            this.size++;
        } else {
            console.log("Graph already exists at id " + id)
            throw new Error();
        }
    }


    has(id) {
        return this.nodes[this.zIndex(id)] && this.nodes[this.zIndex(id)][this.xIndex(id)] ? true : false;
    }

    getIndexes(id) {
        return [this.xIndex(id), this.zIndex(id)];
    }

    insertWalk(randomWalk) {
        for (let i = 0; i < randomWalk.length - 1; i++) {
            let currentNode = randomWalk[i];
            let nextNode = randomWalk[i + 1];
            let zIndex = this.zIndex(currentNode);
            let xIndex = this.xIndex(currentNode);
            this.insertNode(currentNode);
            this.nodes[zIndex][xIndex].neighbors.push(nextNode);
            if (i > 0) {
                let previousNode = randomWalk[i - 1];
                this.nodes[zIndex][xIndex].neighbors.push(previousNode);
            }
        }
        let utsNode = randomWalk[randomWalk.length - 1];
        this.nodes[this.zIndex(utsNode)][this.xIndex(utsNode)].neighbors.push(randomWalk[randomWalk.length - 2])
    }

    zIndex(id) {
        return Math.floor(id / this.numberOfXSquares);
    }

    xIndex(id) {
        return id % this.numberOfXSquares;
    }

    areNeighbors(id1, id2) {
        return this.getNode(id1).neighbors.includes(id2);
    }

    getIdOfMovingOneStepInThatDirection(id, direction) {
        return direction.getIdOfMovingOneStepFrom(id, this);
    }

    getIdOfMovingOneStepInSouthDirection(id) {
        return id + this.numberOfXSquares;
    }

    getIdOfMovingOneStepInEastDirection(id) {
        return id + 1;
    }

    getIdOfMovingOneStepInNorthDirection(id) {
        return id - this.numberOfXSquares;
    }

    getIdOfMovingOneStepInWestDirection(id) {
        return id - 1;
    }

    getNode(id) {
        if (this.has(id)) {
            return this.nodes[this.zIndex(id)][this.xIndex(id)];
        }
    }

    getIdFromCoordinates(xIndex, zIndex) {
        return zIndex * this.numberOfZSquares + xIndex;
    }
}