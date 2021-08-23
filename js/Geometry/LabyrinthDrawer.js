class LabyrinthDrawer {

    N;
    height;

    constructor(N, height) {
        this.N = N;
        this.height = height;
    }

    draw() {
        let mesh = new Mesh();

        let triangle1 = new Triangle([-1.0, 0.0, 1.0,
            1.0, 0.0, -1.0,
            -1.0, 0.0, -1.0]);

        this.drawRectangle(mesh, triangle1, -0.1);

        let N = this.N;
        let triangleBaseLength = 1 / N;
        let height = this.height;

        let triangle = new Triangle([-1.0, 0.0, -1.0,
                                          -1.0, 0.0, -1 + triangleBaseLength,
                                          -1.0, height, -1.0]);
        mesh = this.translateTriangle(mesh, triangle,0.01);
        let triangle3 = new Triangle([-1.0, height, -1.0 + triangleBaseLength,
                                            -1.0, 0.0, -1 + triangleBaseLength,
                                            -1.0, height, -1.0]);
        mesh = this.translateTriangle(mesh, triangle3,0.01);

        for (let i = 0; i < 2 * N - 1; i++) {
            triangle = triangle.transZ(triangleBaseLength);
            mesh = this.translateTriangle(mesh, triangle,WALL_WIDTH);
            triangle3 = triangle3.transZ(triangleBaseLength);
            mesh = this.translateTriangle(mesh, triangle3,WALL_WIDTH);
        }

        let triangleDiag = new Triangle([0.0, 0.0, 0.0,
            0.35, 0.0, 0.4,
            0.35, 0.2, 0.4]);
        mesh.addTriangle(triangleDiag);
        mesh = this.translateTriangle(mesh, triangleDiag,0.3);

        return mesh;
    }

    drawRectangle(mesh, triangle, alpha) {

        mesh = this.translateTriangle(mesh, triangle,alpha);

        let triangle2 = (new Triangle()).construct(triangle.A,
                                                triangle.B,
                                                (new Vertex()).minus(triangle.C));

        mesh = this.translateTriangle(mesh, triangle2, alpha);
        return mesh;

    }

    translateTriangle(mesh, triangle, alpha) {
        let A = triangle.A;
        let B = triangle.B;
        let C = triangle.C;
        let cp = Normalize(crossProduct(A.minus(B), C.minus(B)));

        let translatedTriangle = triangle
            .transX(Math.abs(cp.x) * alpha)
            .transY(Math.abs(cp.y) * alpha)
            .transZ(Math.abs(cp.z) * alpha);

        mesh.addTriangle(triangle);
        mesh.addTriangle(translatedTriangle);

        mesh.fillTwoTriangles(triangle, translatedTriangle);
        return mesh;
    }
}