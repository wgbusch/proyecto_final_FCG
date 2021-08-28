WALL_WIDTH = 0.01;
FLOOR_WIDTH = 0.1;

DIRECTION = {
    Z: "transZ",
    Y: "transY",
    X: "transX"
}

translation = {
    "transZ": (t, length) => {
        return t.transZ(length);
    },
    "transY": (t, length) => {
        return t.transY(length);
    },
    "transX": (t, length) => {
        return t.transX(length);
    }
}

baseLength = {
    "transZ": (triangle) => {
        let [orthogonalVertex, P1, P2] = triangle.orthogonalVertex();

        if (orthogonalVertex.x === P1.x && orthogonalVertex.y === P1.y)
            return Math.abs(orthogonalVertex.z - P1.z);
        if (orthogonalVertex.x === P2.x && orthogonalVertex.y === P2.y)
            return Math.abs(orthogonalVertex.z - P2.z);
        return -1;
    },
    "transY": (triangle) => {
        let [orthogonalVertex, P1, P2] = triangle.orthogonalVertex();

        if (orthogonalVertex.x === P1.x && orthogonalVertex.z === P1.z)
            return Math.abs(orthogonalVertex.y - P1.y);
        if (orthogonalVertex.x === P2.x && orthogonalVertex.z === P2.z)
            return Math.abs(orthogonalVertex.y - P2.y);
        return -1;
    },
    "transX": (triangle) => {
        let [orthogonalVertex, P1, P2] = triangle.orthogonalVertex();

        if (orthogonalVertex.y === P1.y && orthogonalVertex.z === P1.z)
            return Math.abs(orthogonalVertex.x - P1.x);
        if (orthogonalVertex.y === P2.y && orthogonalVertex.z === P2.z)
            return Math.abs(orthogonalVertex.x - P2.x);
        return -1;
    }
}

class LabyrinthDrawer {

    N;
    height;

    constructor(N, height) {
        this.N = N;
        this.height = height;
    }

    draw() {
        let mesh = new Mesh();

        //draw floor
        let triangle1 = new Triangle([-1.0, 0.0 - FLOOR_WIDTH / 2, 1.0,
                                      1.0, 0.0 - FLOOR_WIDTH / 2, -1.0,
                                      -1.0, 0.0 - FLOOR_WIDTH / 2, -1.0]);
        this.drawWall(mesh, 0, triangle1, DIRECTION.Y, FLOOR_WIDTH);

        let N = this.N - 1;
        let triangleBaseLength = N === 0 ? 2 : 1 / N;
        let height = this.height;

        ////draw wall 1
        // this.wall(new Vertex([-1.0 + WALL_WIDTH / 2, 0.0, -1.0]),
        //     new Vertex([-1.0 + WALL_WIDTH / 2, 0.0, 1.0]),
        //     new Vertex([-1.0 + WALL_WIDTH / 2, height, -1.0]),
        //     N,
        //     WALL_WIDTH);

        let t1 = new Triangle([-1.0 + WALL_WIDTH / 2, 0.0, -1.0,
                               -1.0 + WALL_WIDTH / 2, 0.0, -1 + triangleBaseLength,
                               -1.0 + WALL_WIDTH / 2, height, -1.0]);
        this.drawWall(mesh, 2 * N - 1, t1, DIRECTION.Z, WALL_WIDTH);

        //draw wall 2
        let t2 = new Triangle([-1.0, 0.0, 1.0 - WALL_WIDTH,
                               -1.0, 0.0 + height, 1.0 - WALL_WIDTH,
                               -1.0 + triangleBaseLength, 0.0, 1.0 - WALL_WIDTH]);
        this.drawWall(mesh, 2 * N - 1, t2, DIRECTION.X, WALL_WIDTH);

        //draw wall 3
        let t3 = new Triangle([1.0 - WALL_WIDTH / 2, 0.0, -1.0,
                               1.0 - WALL_WIDTH / 2, 0.0, -1 + triangleBaseLength,
                               1.0 - WALL_WIDTH / 2, height, -1.0]);
        this.drawWall(mesh, 2 * N - 1, t3, DIRECTION.Z, WALL_WIDTH);

        //draw wall 4
        let t4 = new Triangle([-1.0, 0.0, -1.0 + WALL_WIDTH / 2,
                               -1.0, 0.0 + height, -1.0 + WALL_WIDTH / 2,
                               -1.0 + triangleBaseLength, 0.0, -1.0 + WALL_WIDTH / 2]);
        this.drawWall(mesh, 2 * N - 1, t4, DIRECTION.X, WALL_WIDTH);

        let triangleDiag = new Triangle([0.0, 0.0, 0.0,
                                         0.35, 0.0, 0.4,
                                         0.35, 0.2, 0.4]);
        mesh.insertTriangle(triangleDiag);
        mesh = this.translateTriangle(mesh, triangleDiag, 0.3);

        return mesh;
    }

    drawWall(mesh, N, triangle, direction, width) {
        mesh = this.drawRectangle(mesh, triangle, width);
        let triangleBaseLength = baseLength[direction](triangle);
        let translatedTriangle = triangle;
        for (let i = 0; i < N; i++) {
            translatedTriangle = translation[direction](translatedTriangle, triangleBaseLength);
            mesh = this.drawRectangle(mesh, translatedTriangle, width);
        }
        return mesh;
    }

    drawRectangle(mesh, triangle, alpha) {
        mesh = this.extrude(mesh, triangle, alpha);

        let [orthogonalAngle, P1, P2] = triangle.orthogonalVertex();

        let oppositeOrthogonalVertexTemp = add(minus(P1, orthogonalAngle), minus(P2, orthogonalAngle));
        let oppositeOrthogonalVertex = add(oppositeOrthogonalVertexTemp, orthogonalAngle);

        let triangle2 = (new Triangle()).constructFromVertices(P1, P2, oppositeOrthogonalVertex);

        mesh = this.extrude(mesh, triangle2, alpha);
        return mesh;
    }

    extrude(mesh, triangle, width) {
        mesh = this.translateTriangle(mesh, triangle, width / 2);
        mesh = this.translateTriangle(mesh, triangle, -width / 2);
        return mesh;
    }

    translateTriangle(mesh, triangle, alpha) {
        let A = triangle.A;
        let B = triangle.B;
        let C = triangle.C;
        let cp = Normalize(crossProduct(minus(A, B), minus(C, B)));

        let translatedTriangle = triangle.transX(Math.abs(cp.x) * alpha)
                                         .transY(Math.abs(cp.y) * alpha)
                                         .transZ(Math.abs(cp.z) * alpha);

        mesh.insertTriangle(triangle);
        mesh.insertTriangle(translatedTriangle);

        mesh.fillTwoTriangles(triangle, translatedTriangle);
        return mesh;
    }

    wall(mesh, start, end, height, N, width) {
        let A = new Vertex();
        let B = new Vertex();
        let C = new Vertex();
        let direction = DIRECTION.X;

        let t1 = new Triangle([A,
                               B,
                               C]);
        this.drawWall(mesh, N, t1, direction, width);
        return mesh;
    }
}