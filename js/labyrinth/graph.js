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
        let zIndex = this.getZIndex(id);
        let xIndex = this.getXIndex(id);
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
        let zIndex = this.getZIndex(id);
        let xIndex = this.getXIndex(id);

        if(!this.nodes[zIndex]) return false;

        return this.nodes[zIndex][xIndex];
    }

    getIndexes(id) {
        return [this.getXIndex(id), this.getZIndex(id)];
    }

    insertWalk(randomWalk) {
        for (let i = 0; i < randomWalk.length - 1; i++) {
            let currentNode = randomWalk[i];
            let nextNode = randomWalk[i + 1];
            let zIndex = this.getZIndex(currentNode);
            let xIndex = this.getXIndex(currentNode);
            this.insertNode(currentNode);
            this.nodes[zIndex][xIndex].neighbors.push(nextNode);
            if (i > 0) {
                let previousNode = randomWalk[i - 1];
                this.nodes[zIndex][xIndex].neighbors.push(previousNode);
            }
        }
        let utsNode = randomWalk[randomWalk.length - 1];
        this.nodes[this.getZIndex(utsNode)][this.getXIndex(utsNode)].neighbors.push(randomWalk[randomWalk.length - 2])
    }

    getZIndex(id) {
        return Math.floor(id / this.numberOfXSquares);
    }

    getXIndex(id) {
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

    isOnTopBorder(zIndex) {
        return zIndex === 0;
    }

    isOnBottomBorder(zIndex) {
        return zIndex === this.numberOfZSquares - 1;
    }

    isOnRightBorder(xIndex) {
        return xIndex === this.numberOfXSquares - 1;
    }

    isOnLeftBorder(xIndex) {
        return xIndex === 0;
    }

    getNode(id) {
        if (this.has(id)) {
            return this.nodes[this.getZIndex(id)][this.getXIndex(id)];
        }
    }

    getIdFromCoordinates(xIndex, zIndex) {
        return zIndex * this.numberOfZSquares + xIndex;
    }
}