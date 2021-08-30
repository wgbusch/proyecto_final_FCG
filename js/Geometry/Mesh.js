class Vertex {
    x;
    y;
    z;

    constructor(array) {
        if (!array || array.length === 0)
            array = [0, 0, 0];
        this.x = array[0];
        this.y = array[1];
        this.z = array[2];
    }

    times(constant) {
        return new Vertex([constant * this.x, constant * this.y, constant * this.z]);
    }
}

class Triangle {
    A;
    B;
    C;
    orthogonal;

    constructor(array) {
        if (!array) {
            array = [];
        }
        this.A = new Vertex(array.slice(0, 3));
        this.B = new Vertex(array.slice(3, 6));
        this.C = new Vertex(array.slice(6, 9));
    }

    constructFromVertices(A, B, C) {
        this.A = A;
        this.B = B;
        this.C = C;
        return this;
    }

    trans(diff) {
        let triangle = new Triangle();
        triangle.constructFromVertices(sum(this.A, diff), sum(this.B, diff), sum(this.C, diff));
        return triangle;
    }

    orthogonalVertex() {
        if (this.orthogonal != null)
            return this.orthogonal;
        let A = this.A;
        let B = this.B;
        let C = this.C;
        if (dot(minus(B, A), minus(C, A)) === 0) {
            this.orthogonal = [A, B, C];
        }
        if (dot(minus(A, B), minus(C, B)) === 0) {
            this.orthogonal = [B, A, C];
        }
        if (dot(minus(A, C), minus(B, C)) === 0) {
            this.orthogonal = [C, A, B];
        }
        return this.orthogonal;
    }
}

class Mesh {
    numTriangles;
    numVertex;
    vertex;

    constructor() {
        this.vertex = [];
        this.numVertex = 0;
        this.numTriangles = 0;
    }

    insertTriangle(triangle) {
        this.vertex = this.vertex.concat(triangle.A).concat(triangle.B).concat(triangle.C);
        this.numVertex += 3;
        this.numTriangles++;
    }

    convertToArray() {
        let answer = [];
        for (let i = 0; i < this.vertex.length; i++) {
            let vertex = this.vertex[i];
            answer.push(vertex.x);
            answer.push(vertex.y);
            answer.push(vertex.z);
        }
        return answer;
    }

    //TODO add option to skip sides.
    fillTwoTriangles(triangle1, triangle2) {
        let A1 = triangle1.A;
        let B1 = triangle1.B;
        let C1 = triangle1.C;
        let A2 = triangle2.A;
        let B2 = triangle2.B;
        let C2 = triangle2.C;

        this.fillTwoLines(
            [A1, B1],
            [A2, B2]);
        this.fillTwoLines(
            [A1, C1],
            [A2, C2]);
        this.fillTwoLines(
            [B1, C1],
            [B2, C2]);
    }

    fillTwoLines([A1, B1], [A2, B2]) {
        this.insertTriangle((new Triangle()).constructFromVertices(A1, B1, A2));
        this.insertTriangle((new Triangle()).constructFromVertices(A2, B1, B2));
    }
}