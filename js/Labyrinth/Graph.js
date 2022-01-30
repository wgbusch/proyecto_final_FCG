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
    gems;
    gems2;
    GEM_SCORE = 10;

    constructor(numberOfXSquares, numberOfZSquares) {
        this.numberOfXSquares = numberOfXSquares;
        this.numberOfZSquares = numberOfZSquares;
        this.nodes = [];
        this.gems = new Set();
        this.gems2 = new Set();
    }

    insertNode(id) {
        let rowNum = this.zIndex(id);
        let column = this.xIndex(id);
        if (!this.nodes[rowNum])
            this.nodes[rowNum] = []
        if (!this.nodes[rowNum][column]) {
            this.nodes[rowNum][column] = new Node(id);
            this.size++;
        } else {
            console.log("Graph already exists at id " + id)
            throw new Error();
        }
    }


    has(id) {
        return this.nodes[this.zIndex(id)] && this.nodes[this.zIndex(id)][this.xIndex(id)] ? true : false;
    }

    insertWalk(randomWalk) {
        for (let i = 0; i < randomWalk.length - 1; i++) {
            let currentNode = randomWalk[i];
            let nextNode = randomWalk[i + 1];
            let row = this.zIndex(currentNode);
            let column = this.xIndex(currentNode);
            this.insertNode(currentNode);
            this.nodes[row][column].neighbors.push(nextNode);
            if (i > 0) {
                let previousNode = randomWalk[i - 1];
                this.nodes[row][column].neighbors.push(previousNode);
            }
        }
        let utsNode = randomWalk[randomWalk.length - 1];
        this.nodes[this.zIndex(utsNode)][this.xIndex(utsNode)].neighbors.push(randomWalk[randomWalk.length - 2])
    }

    getNumberOfZSquares() {
        return this.numberOfZSquares;
    }

    getNumberOfXSquares() {
        return this.numberOfXSquares;
    }

    zIndex(id) {
        return Math.floor(id / this.numberOfXSquares);
    }

    xIndex(id) {
        return id % this.numberOfXSquares;
    }

    getCoordinates(id) {
        return [this.xIndex(id), this.zIndex(id)];
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

    // addGem(id) {
    //     this.gems.add(id);
    //     this.gems2.add([this.xIndex(id), this.zIndex(id)])
    // }

    getIdFromCoordinates(xIndex, zIndex) {
        return zIndex * this.getNumberOfZSquares() + xIndex;
    }

    // consumeGemIfAny(id) {
    //     if (this.gems.has(id)) {
    //         this.gems.delete(id);
    //         return this.GEM_SCORE;
    //     }
    //     return 0;
    // }
    //
    // hasGem(xIndex, zIndex) {
    //     return this.gems.has(this.getIdFromCoordinates(xIndex, zIndex));
    // }
}