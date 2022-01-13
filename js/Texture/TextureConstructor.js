function constructOuterWallsTexture(textureCoordinates) {
    for (let i = 0; i < 48; i += 12) {
        //triangle 1
        textureCoordinates[i + 0] = 0;
        textureCoordinates[i + 1] = 0;

        textureCoordinates[i + 2] = 0;
        textureCoordinates[i + 3] = 2;

        textureCoordinates[i + 4] = 22;
        textureCoordinates[i + 5] = 0;

        //triangle 2
        textureCoordinates[i + 6] = 0;
        textureCoordinates[i + 7] = 2;

        textureCoordinates[i + 8] = 22;
        textureCoordinates[i + 9] = 2;

        textureCoordinates[i + 10] = 22;
        textureCoordinates[i + 11] = (0);
    }
}

function constructInnerWallsTexture(textureCoordinates, start, numOfTriangles) {
    for (let i = start; i < numOfTriangles * 3 * 2; i += 12) {
        //triangle 1
        textureCoordinates[i + 0] = 2;
        textureCoordinates[i + 1] = 2;

        textureCoordinates[i + 2] = 0;
        textureCoordinates[i + 3] = 0;

        textureCoordinates[i + 4] = 0;
        textureCoordinates[i + 5] = 2;

        //triangle 2
        textureCoordinates[i + 6] = 2;
        textureCoordinates[i + 7] = 0;

        textureCoordinates[i + 8] = 0;
        textureCoordinates[i + 9] = 2;

        textureCoordinates[i + 10] = 2;
        textureCoordinates[i + 11] = 2;
    }
}