class Node {
    id;
    neighbors = []

    constructor(id) {
        this.id = id;
        this.neighbors = [];
    }

    addEdge(id) {
        this.neighbors.push(id);
    }
}

class Graph {
    n;
    m;
    nodes;
    size = 0;

    constructor(n, m) {
        this.n = n;
        this.m = m;
        this.nodes = [];
    }

    add(id) {
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
        return Math.floor(id / this.m);
    }

    column(id) {
        return id % this.m;
    }

    has(id) {
        return this.nodes[this.row(id)] && this.nodes[this.row(id)][this.column(id)] ? true : false;
    }

    addWalk(randomWalk) {
        for (let i = 0; i < randomWalk.length - 1; i++) {
            let currentNode = randomWalk[i];
            let nextNode = randomWalk[i + 1];
            let row = this.row(currentNode);
            let column = this.column(currentNode);
            this.add(currentNode);
            this.nodes[row][column].neighbors.push(nextNode);
            if (i > 0) {
                let previousNode = randomWalk[i - 1];
                this.nodes[row][column].neighbors.push(previousNode);
            }
        }
        let utsNode = randomWalk[randomWalk.length - 1];
        this.nodes[this.row(utsNode)][this.column(utsNode)].neighbors.push(randomWalk[randomWalk.length - 2])
    }
}

Graph.prototype.toString = function graphToString() {
    let output = "";
    for (let i = 0; i < this.n; i++) {
        for (let j = 0; j < this.m; j++) {
            if (this.nodes[i] != null && this.nodes[i][j] != null) {
                let id = i * this.n + j;
                output += "  " + id + "  "
            } else {
                output += "  X  ";
            }
        }
        output += "\n";
    }
    return output;
};