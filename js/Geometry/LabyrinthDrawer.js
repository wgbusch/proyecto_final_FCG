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
    wallFromStartToEndWithPoints(mesh, startPoint, endPoint, heightPoint, numOfSubdivisions, width) {
        let fourthPoint = sum(heightPoint, minus(endPoint, startPoint));

        let rectangle = new Rectangle(new Triangle(startPoint, heightPoint, endPoint),
                                      new Triangle(heightPoint, fourthPoint, endPoint));

        let rectangle2= rectangle.translateAlongNormal(width/2);
        let rectangle3= rectangle.translateAlongNormal(-width/2);
        let border = rectangle2.fill(rectangle3);
        mesh.insert(rectangle2);
        mesh.insert(rectangle3);
        mesh.insert(border);

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
