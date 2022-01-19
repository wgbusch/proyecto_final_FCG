class Node {
    id;
    neighbors = []

    constructor(id) {
        this.id = id;
        this.neighbors = [];
    }


}

class Graph {
    xLength;
    zLength;
    nodes;
    size = 0;
    gems = [];

    constructor(xLength, zLength) {
        this.xLength = zLength;
        this.zLength = xLength;
        this.nodes = [];
    }

    insertNode(id) {
        let rowNum = this.row(id);
        let column = this.column(id);
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

    row(id) {
        return Math.floor(id / this.xLength);
    }

    column(id) {
        return id % this.xLength;
    }

    has(id) {
        return this.nodes[this.row(id)] && this.nodes[this.row(id)][this.column(id)] ? true : false;
    }

    insertWalk(randomWalk) {
        for (let i = 0; i < randomWalk.length - 1; i++) {
            let currentNode = randomWalk[i];
            let nextNode = randomWalk[i + 1];
            let row = this.row(currentNode);
            let column = this.column(currentNode);
            this.insertNode(currentNode);
            this.nodes[row][column].neighbors.push(nextNode);
            if (i > 0) {
                let previousNode = randomWalk[i - 1];
                this.nodes[row][column].neighbors.push(previousNode);
            }
        }
        let utsNode = randomWalk[randomWalk.length - 1];
        this.nodes[this.row(utsNode)][this.column(utsNode)].neighbors.push(randomWalk[randomWalk.length - 2])
    }

    getZLength() {
        return this.zLength;
    }

    getXLength() {
        return this.xLength;
    }

    getCoordinates(id) {
        return [this.column(id), this.row(id)];
    }

    areNeighbors(id1, id2) {
        return this.getNode(id1).neighbors.includes(id2);
    }

    getIdOfMovingOneStepInThatDirection(id, direction) {
        return direction.getIdOfMovingOneStepFrom(id, this);
    }

    getIdOfMovingOneStepInSouthDirection(id) {
        return id + this.xLength;
    }

    getIdOfMovingOneStepInEastDirection(id) {
        return id + 1;
    }

    getIdOfMovingOneStepInNorthDirection(id) {
        return id - this.xLength;
    }

    getIdOfMovingOneStepInWestDirection(id) {
        return id - 1;
    }

    getNode(id) {
        if (this.has(id)) {
            return this.nodes[this.row(id)][this.column(id)];
        }
    }

    addGem(id) {
        this.gems.push(id);
    }
}