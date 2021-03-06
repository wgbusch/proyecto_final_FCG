WALL_WIDTH = 0;
FLOOR_WIDTH = 0.1;
LABYRINTH_HEIGHT = 0.15;

class LabyrinthMeshConstructor {

    labyrinth;
    height;
    wallXLength;
    wallZLength;

    constructor(labyrinth) {
        this.labyrinth = labyrinth;
        this.height = LABYRINTH_HEIGHT;
        this.wallXLength = TOTAL_X_LENGTH / numberOfXSquares;
        this.wallZLength = TOTAL_Z_LENGTH / numberOfZSquares;
    }

    constructInnerWallsMesh(mesh) {

        let labyrinth = this.labyrinth;
        let wallsToCreate = [];
        for (let zIndex = 0; zIndex < numberOfXSquares - 1; zIndex++) {
            wallsToCreate[zIndex] = [];
            for (let xIndex = 0; xIndex < numberOfZSquares - 1; xIndex++) {
                let node1 = labyrinth.nodes[zIndex][xIndex];
                let node2 = labyrinth.nodes[zIndex][xIndex + 1];
                let node3 = labyrinth.nodes[zIndex + 1][xIndex + 1];
                let node4 = labyrinth.nodes[zIndex + 1][xIndex];
                let cross = this.defineWallsToCreate(node1, node2, node3, node4);
                wallsToCreate[zIndex][xIndex] = cross;
                mesh = this.constructCrossings(mesh, cross, xIndex, zIndex);
            }
        }
        return mesh;
    }

    constructOuterWallsMesh(mesh) {

        let negative_x_triangle_1_a = new Vertex([-TOTAL_X_LENGTH / 2, 0, -TOTAL_Z_LENGTH / 2]);
        let negative_x_triangle_1_b = new Vertex([-TOTAL_X_LENGTH / 2, LABYRINTH_HEIGHT, -TOTAL_Z_LENGTH / 2]);
        let negative_x_triangle_1_c = new Vertex([-TOTAL_X_LENGTH / 2, 0, TOTAL_Z_LENGTH / 2]);

        let negative_x_triangle_2_d = new Vertex([-TOTAL_X_LENGTH / 2, LABYRINTH_HEIGHT, -TOTAL_Z_LENGTH / 2]);
        let negative_x_triangle_2_e = new Vertex([-TOTAL_X_LENGTH / 2, LABYRINTH_HEIGHT, TOTAL_Z_LENGTH / 2]);
        let negative_x_triangle_2_f = new Vertex([-TOTAL_X_LENGTH / 2, 0, TOTAL_Z_LENGTH / 2]);

        let negative_x_triangle_1 = new Triangle(negative_x_triangle_1_a, negative_x_triangle_1_b,
            negative_x_triangle_1_c);
        let negative_x_triangle_2 = new Triangle(negative_x_triangle_2_d, negative_x_triangle_2_e,
            negative_x_triangle_2_f);
        let positive_x_triangle_1 = negative_x_triangle_1.translateAlongNormal(TOTAL_Z_LENGTH);
        let positive_x_triangle_2 = negative_x_triangle_2.translateAlongNormal(TOTAL_Z_LENGTH);

        let negative_z_triangle_1_a = new Vertex([-TOTAL_X_LENGTH / 2, 0, -TOTAL_Z_LENGTH / 2]);
        let negative_z_triangle_1_b = new Vertex([-TOTAL_X_LENGTH / 2, LABYRINTH_HEIGHT, -TOTAL_Z_LENGTH / 2]);
        let negative_z_triangle_1_c = new Vertex([TOTAL_X_LENGTH / 2, 0, -TOTAL_Z_LENGTH / 2]);

        let negative_z_triangle_2_d = new Vertex([-TOTAL_X_LENGTH / 2, LABYRINTH_HEIGHT, -TOTAL_Z_LENGTH / 2]);
        let negative_z_triangle_2_e = new Vertex([TOTAL_X_LENGTH / 2, LABYRINTH_HEIGHT, -TOTAL_Z_LENGTH / 2]);
        let negative_z_triangle_2_f = new Vertex([TOTAL_X_LENGTH / 2, 0, -TOTAL_Z_LENGTH / 2]);

        let negative_z_triangle_1 = new Triangle(negative_z_triangle_1_a, negative_z_triangle_1_b,
            negative_z_triangle_1_c);

        let negative_z_triangle_2 = new Triangle(negative_z_triangle_2_d, negative_z_triangle_2_e,
            negative_z_triangle_2_f);

        let positive_z_triangle_1 = negative_z_triangle_1.translateAlongNormal(TOTAL_X_LENGTH);
        let positive_z_triangle_2 = negative_z_triangle_2.translateAlongNormal(TOTAL_X_LENGTH);

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
                                     width) {

        let endPoint = sum(startPoint, endDirection.times(endScalar));

        let heightPoint = sum(startPoint, heightDirection.times(heightScalar));

        return this.wallFromStartToEndWithPoints(mesh, startPoint, endPoint,
            heightPoint, width);
    }

    wallFromStartToEndWithPoints(mesh, startPoint, endPoint, heightPoint, width) {

        let fourthPoint = sum(heightPoint, minus(endPoint, startPoint));

        let rectangle = new Rectangle(new Triangle(startPoint, heightPoint, endPoint),
            new Triangle(heightPoint, fourthPoint, endPoint));

        if (width > 0) {
            let rectangle2 = rectangle.translateAlongNormal(width / 2);
            let rectangle3 = rectangle.translateAlongNormal(-width / 2);
            let border = rectangle2.fill(rectangle3);
            mesh.insert(rectangle2);
            mesh.insert(rectangle3);
            mesh.insert(border);
        } else {
            mesh.insert(rectangle);
        }
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

    constructCrossings(mesh, cross, xIndex, zIndex) {

        let xCenterCoord = this.calculateCenterOfXCoordinate(xIndex);
        let zCenterCoord = this.calculateCenterOfZCoordinate(zIndex);
        let height = this.height;
        let wallDirection;
        let startingPoint;

        if (zIndex === 0 && cross.includes("S")) {
            startingPoint = [xCenterCoord, 0.0, zCenterCoord - WALL_WIDTH];
            wallDirection = [0.0, 0.0, 1.0];
            mesh = this.wallFromStartToEndWithDirections(mesh,
                new Vertex(startingPoint),
                new Vertex(wallDirection),
                this.wallZLength,
                new Vertex([0, 1, 0]),
                height,
                WALL_WIDTH);
        }

        if (xIndex === 0 && cross.includes("E")) {
            startingPoint = [xCenterCoord, 0.0, zCenterCoord];
            wallDirection = [-1.0, 0.0, 0.0];
            mesh = this.wallFromStartToEndWithDirections(mesh,
                new Vertex(startingPoint),
                new Vertex(wallDirection),
                this.wallXLength,
                new Vertex([0, 1, 0]),
                height,
                WALL_WIDTH);
        }

        if (zIndex < numberOfXSquares - 1 && xIndex < numberOfZSquares - 1) {
            if (cross.includes("N")) {
                startingPoint = [xCenterCoord, 0.0, zCenterCoord];
                wallDirection = [0.0, 0.0, -1.0];
                mesh = this.wallFromStartToEndWithDirections(mesh,
                    new Vertex(startingPoint),
                    new Vertex(wallDirection),
                    this.wallZLength,
                    new Vertex([0, 1, 0]),
                    height,
                    WALL_WIDTH);
            }
            if (cross.includes("W")) {
                startingPoint = [xCenterCoord - WALL_WIDTH / 2, 0.0, zCenterCoord];
                wallDirection = [1.0, 0.0, 0.0];
                mesh = this.wallFromStartToEndWithDirections(mesh,
                    new Vertex(startingPoint),
                    new Vertex(wallDirection),
                    this.wallXLength,
                    new Vertex([0, 1, 0]),
                    height,
                    WALL_WIDTH);
            }
        }
        return mesh;
    }

    calculateCenterOfXCoordinate(xIndex) {
        return -1 + WALL_WIDTH + TOTAL_Z_LENGTH * (xIndex + 1) / numberOfZSquares;
    }

    calculateCenterOfZCoordinate(zIndex) {
        return 1 - WALL_WIDTH - TOTAL_X_LENGTH * (zIndex + 1) / numberOfXSquares;
    }
}
