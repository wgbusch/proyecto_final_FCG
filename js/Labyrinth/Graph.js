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

    getZLength(){
        return this.zLength;
    }
    getXLength(){
        return this.xLength;
    }
}

Graph.prototype.toString = function graphToString() {
    let output = "";
    for (let i = 0; i < this.zLength; i++) {
        for (let j = 0; j < this.xLength; j++) {
            if (this.nodes[i] != null && this.nodes[i][j] != null) {
                let id = i * this.zLength + j;
                output += "  " + id + "  "
            } else {
                output += "  X  ";
            }
        }
        output += "\n";
    }
    return output;
};