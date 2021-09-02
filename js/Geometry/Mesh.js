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
    numberOfTriangles = 1;

    constructor(A, B, C) {
        this.A = A;
        this.B = B;
        this.C = C;
        return this;
    }

    trans(diff) {
        return new Triangle(sum(this.A, diff), sum(this.B, diff), sum(this.C, diff));
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

    getIterator() {
        return new ShapeIterator([[this.A, this.B, this.C]]);
    }
}

class Mesh {
    numTriangles;
    vertex;

    constructor() {
        this.vertex = [];
        this.numTriangles = 0;
    }

    insert(shape) {
        let iterator = shape.getIterator();
        while (iterator.hasValue()) {
            let triangle = iterator.getNextTriangle();
            this.vertex = this.vertex.concat(triangle[0]).concat(triangle[1]).concat(triangle[2]);
        }
        this.numTriangles += shape.numberOfTriangles;
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
        this.insert(new Triangle(A1, B1, A2));
        this.insert(new Triangle(A2, B1, B2));
    }
}

class ShapeIterator {
    triangles;
    indexPosition = 0;

    constructor(listOfTriangles) {
        this.triangles = listOfTriangles;
        this.indexPosition = 0;
    }

    hasValue() {
        return this.indexPosition < this.triangles.length;
    }

    getNextTriangle() {
        let triangleToReturn = this.triangles[this.indexPosition];
        this.indexPosition++;
        return triangleToReturn;
    }

}