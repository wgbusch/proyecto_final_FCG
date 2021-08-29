WALL_WIDTH = 0.01;
FLOOR_WIDTH = 0.1;

class LabyrinthDrawer {

    N;
    height;

    constructor(N, height) {
        this.N = N;
        this.height = height;
    }

    draw() {
        let mesh = new Mesh();

        this.wall(mesh,
            new Vertex([-1.0, 0.0 - WALL_WIDTH / 2, -1.0]),
            new Vertex([1.0, 0.0 - WALL_WIDTH / 2, -1.0]),
            new Vertex([-1.0, 0.0 - WALL_WIDTH / 2, 1.0]),
            1,
            WALL_WIDTH);

        let N = this.N - 1;
        let height = this.height;

        //draw wall 1
        this.wall(mesh,
            new Vertex([-1.0 + WALL_WIDTH / 2, 0.0, -1.0 + WALL_WIDTH / 2]),
            new Vertex([-1.0 + WALL_WIDTH / 2, 0.0, 1.0 - WALL_WIDTH / 2]),
            new Vertex([-1.0 + WALL_WIDTH / 2, height, -1.0 + WALL_WIDTH / 2]),
            N,
            WALL_WIDTH);

        //draw wall 2
        this.wall(mesh,
            new Vertex([-1.0 + WALL_WIDTH / 2, 0.0, 1.0 - WALL_WIDTH / 2]),
            new Vertex([1.0, 0.0, 1.0 - WALL_WIDTH / 2]),
            new Vertex([-1.0 + WALL_WIDTH / 2, height, 1.0 - WALL_WIDTH / 2]),
            N,
            WALL_WIDTH);

        //draw wall 3
        this.wall(mesh,
            new Vertex([1.0 - WALL_WIDTH / 2, 0.0, 1.0 - WALL_WIDTH / 2]),
            new Vertex([1.0 - WALL_WIDTH / 2, 0.0, -1.0 + WALL_WIDTH / 2]),
            new Vertex([1.0 - WALL_WIDTH / 2, height, 1.0 - WALL_WIDTH / 2]),
            N,
            WALL_WIDTH);

        //draw wall 4
        this.wall(mesh,
            new Vertex([1.0 - WALL_WIDTH / 2, 0.0, -1.0 + WALL_WIDTH / 2]),
            new Vertex([-1.0 + WALL_WIDTH / 2, 0.0, -1.0 + WALL_WIDTH / 2]),
            new Vertex([1.0 - WALL_WIDTH / 2, height, -1.0 + WALL_WIDTH / 2]),
            N,
            WALL_WIDTH);

        let triangleDiag = new Triangle([0.0, 0.0, 0.0,
                                         0.35, 0.0, 0.4,
                                         0.35, 0.2, 0.4]);
        mesh.insertTriangle(triangleDiag);
        mesh = this.translateTriangle(mesh, triangleDiag, 0.3);

        return mesh;
    }

    wall(mesh, start, end, height, N, width) {
        let direction = directionOfLine(start, end);

        let baseLength = Norm(minus(start, end)) / N;
        let translatedPoint = sum(start, direction.times(baseLength));

        let initialTriangle = (new Triangle()).constructFromVertices(start, translatedPoint, height);

        this.drawWall(mesh, N, initialTriangle, direction, width);
        return mesh;
    }

    drawWall(mesh, N, triangle, direction, width) {
        mesh = this.drawRectangle(mesh, triangle, width);

        let triangleBaseLength = calculateBaseLengthOfTriangle(triangle, direction);

        let translatedTriangle = triangle;
        for (let i = 0; i < N - 1; i++) {
            translatedTriangle = translatedTriangle.trans(direction.times(triangleBaseLength));

            mesh = this.drawRectangle(mesh, translatedTriangle, width);
        }
        return mesh;
    }

    drawRectangle(mesh, triangle, alpha) {
        mesh = this.extrude(mesh, triangle, alpha);

        let [orthogonalAngle, P1, P2] = triangle.orthogonalVertex();

        let oppositeOrthogonalVertexTemp = sum(minus(P1, orthogonalAngle), minus(P2, orthogonalAngle));
        let oppositeOrthogonalVertex = sum(oppositeOrthogonalVertexTemp, orthogonalAngle);

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

        let translatedTriangle = triangle.trans(new Vertex([Math.abs(cp.x) * alpha,
                                                            Math.abs(cp.y) * alpha,
                                                            Math.abs(cp.z) * alpha]));

        mesh.insertTriangle(triangle);
        mesh.insertTriangle(translatedTriangle);

        mesh.fillTwoTriangles(triangle, translatedTriangle);
        return mesh;
    }
}