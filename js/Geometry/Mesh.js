
class Shape {
    triangles;

    constructor() {
        this.triangles = [];
    }

    insert(triangles) {
        this.triangles = this.triangles.concat(triangles);
    }

    get(i) {
        return this.triangles[i];
    }

    length(){
        return this.triangles.length
    }

    fillTwoLines([A1, B1], [A2, B2]) {
        let twoLinesTriangulated = [];
        twoLinesTriangulated.push(new Triangle(A1, B1, A2));
        twoLinesTriangulated.push(new Triangle(A2, B1, B2));
        return twoLinesTriangulated;
    }
}

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

class Triangle extends Shape{
    A;
    B;
    C;
    orthogonal;

    constructor(A, B, C) {
        super();
        this.A = A;
        this.B = B;
        this.C = C;
        return this;
    }

    translateAlongNormal(alpha) {
        let A = this.A;
        let B = this.B;
        let C = this.C;
        let cp = Normalize(crossProduct(minus(A, B), minus(C, B)));

        return this.trans(new Vertex([Math.abs(cp.x) * alpha,
                                      Math.abs(cp.y) * alpha,
                                      Math.abs(cp.z) * alpha]));
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

    //TODO add option to skip sides.
    fill(triangle2) {
        let A1 = this.A;
        let B1 = this.B;
        let C1 = this.C;
        let A2 = triangle2.A;
        let B2 = triangle2.B;
        let C2 = triangle2.C;
        let arrayToReturn = new Shape();
        arrayToReturn.insert(this.fillTwoLines(
            [A1, B1],
            [A2, B2]));
        arrayToReturn.insert(this.fillTwoLines(
            [A1, C1],
            [A2, C2]));
        arrayToReturn.insert(this.fillTwoLines(
            [B1, C1],
            [B2, C2]));
        return arrayToReturn;
    }

    get(i) {
        if (i === 0)
            return this;
    }

    length(){
        return 1;
    }
}

class Rectangle extends Shape{
    triangle1;
    triangle2;

    constructor(triangle1, triangle2) {
        super();
        this.triangle1 = triangle1;
        this.triangle2 = triangle2;
        return this;
    }

    translateAlongNormal(alpha) {
        let triangle1 = this.triangle1;
        let A = triangle1.A;
        let B = triangle1.B;
        let C = triangle1.C;
        let cp = Normalize(crossProduct(minus(A, B), minus(C, B)));

        return this.trans(new Vertex([Math.abs(cp.x) * alpha,
                                      Math.abs(cp.y) * alpha,
                                      Math.abs(cp.z) * alpha]));
    }

    fill(rectangle2){

        let A1 = this.A;
        let B1 = this.B;
        let C1 = this.C;
        let A2 = triangle2.A;
        let B2 = triangle2.B;
        let C2 = triangle2.C;
        let arrayToReturn = new Shape();
        arrayToReturn.insert(this.fillTwoLines(
            [A1, B1],
            [A2, B2]));
        arrayToReturn.insert(this.fillTwoLines(
            [A1, C1],
            [A2, C2]));
        arrayToReturn.insert(this.fillTwoLines(
            [B1, C1],
            [B2, C2]));
        return arrayToReturn;
    }

    length(){
        return 2;
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
        for (let i = 0; i < shape.length(); i++) {
            let triangle = shape.get(i);
            this.vertex = this.vertex.concat(triangle.A).concat(triangle.B).concat(triangle.C);
        }
        this.numTriangles += shape.length();
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
}
