WALL_WIDTH = 0.01;
FLOOR_WIDTH = 0.1;
LABYRINTH_HEIGHT = 0.15;
CAMERA_HEIGHT = -0.05;

class LabyrinthDrawer {

    abstractLabyrinth;
    N;
    height;
    M;

    constructor(abstractLabyrinth) {
        this.abstractLabyrinth = abstractLabyrinth;
        this.N = abstractLabyrinth.getZLength();
        this.M = abstractLabyrinth.getXLength();
        this.height = LABYRINTH_HEIGHT;
    }

    drawInnerWalls(mesh) {
        let labyrinth = this.abstractLabyrinth;
        let wallsToCreate = [];
        for (let zIndex = 0; zIndex < this.M - 1; zIndex++) {
            //TODO delete walls to create ?
            wallsToCreate[zIndex] = [];
            for (let xIndex = 0; xIndex < this.N - 1; xIndex++) {
                let node1 = labyrinth.nodes[zIndex][xIndex];
                let node2 = labyrinth.nodes[zIndex][xIndex + 1];
                let node3 = labyrinth.nodes[zIndex + 1][xIndex + 1];
                let node4 = labyrinth.nodes[zIndex + 1][xIndex];
                let cross = this.defineWallsToCreate(node1, node2, node3, node4);
                wallsToCreate[zIndex][xIndex] = cross;
                mesh = this.drawCrossing(mesh, cross, xIndex, zIndex);
            }
        }
        return mesh;
    }

    drawOuterWalls(mesh) {
        let negative_x_triangle_1_a = new Vertex([-1, 0, -1]);
        let negative_x_triangle_1_b = new Vertex([-1, LABYRINTH_HEIGHT, -1]);
        let negative_x_triangle_1_c = new Vertex([-1, 0, 1]);

        let negative_x_triangle_2_d = new Vertex([-1, LABYRINTH_HEIGHT, -1]);
        let negative_x_triangle_2_e = new Vertex([-1, LABYRINTH_HEIGHT, 1]);
        let negative_x_triangle_2_f = new Vertex([-1, 0, 1]);

        let negative_x_triangle_1 = new Triangle(negative_x_triangle_1_a, negative_x_triangle_1_b, negative_x_triangle_1_c);
        let negative_x_triangle_2 = new Triangle(negative_x_triangle_2_d, negative_x_triangle_2_e, negative_x_triangle_2_f);
        let positive_x_triangle_1 = negative_x_triangle_1.translateAlongNormal(+2);
        let positive_x_triangle_2 = negative_x_triangle_2.translateAlongNormal(+2);

        let negative_z_triangle_1_a = new Vertex([-1, 0, -1]);
        let negative_z_triangle_1_b = new Vertex([-1, LABYRINTH_HEIGHT, -1]);
        let negative_z_triangle_1_c = new Vertex([1, 0, -1]);

        let negative_z_triangle_2_d = new Vertex([-1, LABYRINTH_HEIGHT, -1]);
        let negative_z_triangle_2_e = new Vertex([1, LABYRINTH_HEIGHT, -1]);
        let negative_z_triangle_2_f = new Vertex([1, 0, -1]);

        let negative_z_triangle_1 = new Triangle(negative_z_triangle_1_a, negative_z_triangle_1_b, negative_z_triangle_1_c);
        let negative_z_triangle_2 = new Triangle(negative_z_triangle_2_d, negative_z_triangle_2_e, negative_z_triangle_2_f);
        let positive_z_triangle_1 = negative_z_triangle_1.translateAlongNormal(+2);
        let positive_z_triangle_2 = negative_z_triangle_2.translateAlongNormal(+2);

        mesh.insert(negative_x_triangle_1);
        mesh.insert(negative_x_triangle_2);
        mesh.insert(positive_x_triangle_1);
        mesh.insert(positive_x_triangle_2);

        mesh.insert(negative_z_triangle_1);
        mesh.insert(negative_z_triangle_2);
        mesh.insert(positive_z_triangle_1);
        mesh.insert(positive_z_triangle_2);
        return mesh;
    }

    wallFromStartToEndWithDirections(mesh,
                                     startPoint,
                                     endDirection,
                                     endScalar,
                                     heightDirection,
                                     heightScalar,
                                     numSubdivisions,
                                     width) {
        let endPoint = sum(startPoint, endDirection.times(endScalar));

        let heightPoint = sum(startPoint, heightDirection.times(heightScalar));

        mesh = this.wallFromStartToEndWithPoints(mesh, startPoint, endPoint,
                                                 heightPoint, numSubdivisions, width);
        return mesh;
    }

    //TODO delete method
    wallFromStartToEndWithPoints(mesh, start, end, height, numOfSubdivisions, width) {
        let direction = directionOfLine(start, end);

        let baseLength = Norm(minus(start, end)) / numOfSubdivisions;
        let translatedPoint = sum(start, direction.times(baseLength));

        let initialTriangle = new Triangle(start, translatedPoint, height);

        mesh = this.drawRectangularBox(mesh, initialTriangle, width);
        return mesh;
    }

    drawRectangularBox(mesh, triangle, alpha) {
        mesh = this.extrude(mesh, triangle, alpha);

        let [orthogonalAngle, P1, P2] = triangle.orthogonalVertex();

        let oppositeOrthogonalVertexTemp = sum(minus(P1, orthogonalAngle), minus(P2, orthogonalAngle));
        let oppositeOrthogonalVertex = sum(oppositeOrthogonalVertexTemp, orthogonalAngle);

        let triangle2 = new Triangle(P1, P2, oppositeOrthogonalVertex);
        //TODO skip hypothenuse from rectangle. Use only
        mesh = this.extrude(mesh, triangle2, alpha);
        return mesh;
    }

    drawRectangle2(mesh, triangle1, alpha) {

        let [orthogonalAngle, P1, P2] = triangle1.orthogonalVertex();

        let oppositeOrthogonalVertexTemp = sum(minus(P1, orthogonalAngle), minus(P2, orthogonalAngle));
        let oppositeOrthogonalVertex = sum(oppositeOrthogonalVertexTemp, orthogonalAngle);

        let triangle2 = new Triangle(P1, P2, oppositeOrthogonalVertex);
        let rectangle = new Rectangle(triangle1, triangle2);

        mesh = this.extrude(mesh, rectangle, alpha);
        return mesh;
    }

    extrude(mesh, shape, width) {
        let translatedShape1 = shape.translateAlongNormal(width / 2);
        mesh.insert(translatedShape1);

        let translatedShape2 = shape.translateAlongNormal(-width / 2);
        mesh.insert(translatedShape2);

        mesh.insert(translatedShape1.fill(translatedShape2));
        return mesh;
    }

    defineWallsToCreate(node1, node2, node3, node4) {
        let cross = [];
        if (!node1.neighbors.includes(node2.id))
            cross.push("S");
        if (!node2.neighbors.includes(node3.id))
            cross.push("W");
        if (!node3.neighbors.includes(node4.id))
            cross.push("N");
        if (!node4.neighbors.includes(node1.id))
            cross.push("E");
        return cross;
    }

    drawCrossing(mesh, cross, xIndex, zIndex) {
        let xCoord = this.calculateXCoordinate(xIndex);
        let zCoord = this.calculateZCoordinate(zIndex);
        let N = this.N;
        let height = this.height;
        let baseWallLength = (2 - 2 * WALL_WIDTH) / N - WALL_WIDTH;
        let avoidClipping = 0;
        let wallDirection;
        let startingPoint;
        let wallLength;

        //TODO: FIX lengths
        if (zIndex === 0) {
            if (cross.includes("S")) {
                startingPoint = [xCoord, 0.0, zCoord - WALL_WIDTH];
                wallDirection = [0.0, 0.0, 1.0];
                wallLength = baseWallLength + WALL_WIDTH;
                mesh = this.wallFromStartToEndWithDirections(mesh,
                                                             new Vertex(startingPoint),
                                                             new Vertex(wallDirection),
                                                             wallLength,
                                                             new Vertex([0, 1, 0]),
                                                             height,
                                                             1,
                                                             WALL_WIDTH);
            }
        }
        if (xIndex === 0) {
            if (cross.includes("E")) {
                startingPoint = [xCoord, 0.0, zCoord];
                wallDirection = [-1.0, 0.0, 0.0];
                wallLength = baseWallLength;
                mesh = this.wallFromStartToEndWithDirections(mesh,
                                                             new Vertex(startingPoint),
                                                             new Vertex(wallDirection),
                                                             wallLength,
                                                             new Vertex([0, 1, 0]),
                                                             height,
                                                             1,
                                                             WALL_WIDTH);
            }
        }

        if (zIndex < this.M - 2 && xIndex < this.N - 2) {
            if (cross.includes("W")) {
                startingPoint = [xCoord - WALL_WIDTH / 2, 0.0, zCoord];
                wallDirection = [1.0, 0.0, 0.0];
                wallLength = baseWallLength + WALL_WIDTH * (1 + 2 / N);
                avoidClipping = WALL_WIDTH / 2;
                mesh = this.wallFromStartToEndWithDirections(mesh,
                                                             new Vertex(startingPoint),
                                                             new Vertex(wallDirection),
                                                             wallLength,
                                                             new Vertex([0, 1, 0]),
                                                             height,
                                                             1,
                                                             WALL_WIDTH);
            }
            if (cross.includes("N")) {
                startingPoint = [xCoord, 0.0, zCoord - avoidClipping];
                wallDirection = [0.0, 0.0, -1.0];
                wallLength = baseWallLength + WALL_WIDTH * (1 + 2 / N);
                mesh = this.wallFromStartToEndWithDirections(mesh,
                                                             new Vertex(startingPoint),
                                                             new Vertex(wallDirection),
                                                             wallLength,
                                                             new Vertex([0, 1, 0]),
                                                             height,
                                                             1,
                                                             WALL_WIDTH);
            }
        }

        if (zIndex === this.M - 2 || xIndex === this.N - 2) {
            if (cross.includes("N")) {
                startingPoint = [xCoord, 0.0, zCoord - avoidClipping];
                wallDirection = [0.0, 0.0, -1.0];
                wallLength = baseWallLength - WALL_WIDTH / 2;
                mesh = this.wallFromStartToEndWithDirections(mesh,
                                                             new Vertex(startingPoint),
                                                             new Vertex(wallDirection),
                                                             wallLength,
                                                             new Vertex([0, 1, 0]),
                                                             height,
                                                             1,
                                                             WALL_WIDTH);
            }
            if (cross.includes("W")) {
                startingPoint = [xCoord - WALL_WIDTH / 2, 0.0, zCoord];
                wallDirection = [1.0, 0.0, 0.0];
                wallLength = baseWallLength;
                mesh = this.wallFromStartToEndWithDirections(mesh,
                                                             new Vertex(startingPoint),
                                                             new Vertex(wallDirection),
                                                             wallLength,
                                                             new Vertex([0, 1, 0]),
                                                             height,
                                                             1,
                                                             WALL_WIDTH);
            }
        }
        return mesh;
    }

    calculateXCoordinate(xIndex) {
        return -1 + WALL_WIDTH + 2 * (xIndex + 1) / this.N;
    }

    calculateZCoordinate(zIndex) {
        return 1 - WALL_WIDTH - 2 * (zIndex + 1) / this.M;
    }
}
