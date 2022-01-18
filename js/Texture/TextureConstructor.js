function constructOuterWallsTexture(textureCoordinates, lengthOfWall) {
    for (let i = 0; i < 48; i += 12) {
        //triangle 1
        textureCoordinates[i + 0] = 0;
        textureCoordinates[i + 1] = 0;

        textureCoordinates[i + 2] = 0;
        textureCoordinates[i + 3] = 2 * lengthOfWall / 2;

        textureCoordinates[i + 4] = 22;
        textureCoordinates[i + 5] = 0;

        //triangle 2
        textureCoordinates[i + 6] = 0;
        textureCoordinates[i + 7] = 2 * lengthOfWall / 2;

        textureCoordinates[i + 8] = 22;
        textureCoordinates[i + 9] = 2 * lengthOfWall / 2;

        textureCoordinates[i + 10] = 22;
        textureCoordinates[i + 11] = 0;
    }
}

function constructInnerWallsTexture(textureCoordinates,
                                    start,
                                    numOfTriangles,
                                    lengthOfWall) {
    for (let i = start; i < numOfTriangles * 3 * 2; i += 12) {
        //triangle 1
        textureCoordinates[i + 0] = 0;
        textureCoordinates[i + 1] = 0;

        textureCoordinates[i + 2] = 0;
        textureCoordinates[i + 3] = 2;

        textureCoordinates[i + 4] = 22 * lengthOfWall;
        textureCoordinates[i + 5] = 0;

        //triangle 2
        textureCoordinates[i + 6] = 0;
        textureCoordinates[i + 7] = 2;

        textureCoordinates[i + 8] = 22 * lengthOfWall;
        textureCoordinates[i + 9] = 2;

        textureCoordinates[i + 10] = 22 * lengthOfWall;
        textureCoordinates[i + 11] = 0;
    }
}

function getSquareTexture(xLength, zLength) {
    return [0, 0,
            0, 13 * zLength / 2,
            13 * xLength / 2, 0,
            13 * xLength / 2, 13 * zLength / 2,
            0, 13 * zLength / 2,
            13 * xLength / 2, 0];
}