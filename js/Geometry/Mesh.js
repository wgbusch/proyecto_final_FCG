
class Vertex {
    x;y;z;
    constructor(array) {
        if (!array || array.length===0)
            array = [0,0,0];
        this.x = array[0]; this.y = array[1]; this.z = array[2];
    }

    add(vertex) {
        return new Vertex([this.x + vertex.x, this.y + vertex.y, this.z + vertex.z]);
    }
}

class Triangle{
    A; B; C;

    constructor(array) {
        if (!array){
            array = [];
        }
        this.A = new Vertex(array.slice(0, 3));
        this.B = new Vertex(array.slice(3, 6));
        this.C = new Vertex(array.slice(6, 9));
    }

    construct(A,B,C) {
        this.A = A; this.B = B; this.C = C;
        return this;
    }

    transX(translation) {
        let diff = new Vertex([translation,0, 0]);
        let triangle =  new Triangle();
        triangle.construct(this.A.add(diff), this.B.add(diff), this.C.add(diff));
        return triangle;
    }

    transY(translation) {
        let diff = new Vertex([0,translation, 0]);
        let triangle =  new Triangle();
        triangle.construct(this.A.add(diff), this.B.add(diff), this.C.add(diff));
        return triangle;
    }

    transZ(translation) {
        let diff = new Vertex([0,0, translation]);
        let triangle =  new Triangle();
        triangle.construct(this.A.add(diff), this.B.add(diff), this.C.add(diff));
        return triangle;
    }
}

class Mesh{
    numTriangles;
    numVertex;
    vertex;

    constructor() {
        this.vertex = [];
        this.numVertex = 0;
        this.numTriangles = 0;
    }

    addTriangle(triangle) {
        this.vertex = this.vertex.concat(triangle.A).concat(triangle.B).concat(triangle.C);
        this.numVertex += 3;
        this.numTriangles++;
    }

    convertToArray(){
        let answer = [];
        for (let i = 0; i < this.vertex.length; i++){
            let vertex = this.vertex[i];
            answer.push(vertex.x);
            answer.push(vertex.y);
            answer.push(vertex.z);
        }
        return answer;
    }

    fillTwoLines([A1, B1], [A2, B2]) {
        this.addTriangle((new Triangle()).construct(A1,B1,A2));
        this.addTriangle((new Triangle()).construct(A2, B1, B2));
    }

    fillTwoTriangles(triangle1, triangle2) {
        let A1 = triangle1.A; let B1 = triangle1.B; let C1 = triangle1.C;
        let A2 = triangle2.A; let B2 = triangle2.B; let C2 = triangle2.C;

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
}