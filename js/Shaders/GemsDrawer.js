class GemsDrawer {

    // El constructor es donde nos encargamos de realizar las inicializaciones necesarias.
    constructor() {

        // 1. Compilamos el programa de shaders
        this.prog = InitShaderProgram(this.gemsVS, this.gemsFS);

        // 2. Obtenemos los IDs de las variables uniformes en los shaders
        this.mvp = gl.getUniformLocation(this.prog, 'mvp');

        // 3. Obtenemos los IDs de los atributos de los vértices en los shaders
        this.vertPos = gl.getAttribLocation(this.prog, 'pos');

        this.color = gl.getAttribLocation(this.prog, 'clr');

        // 4. Obtenemos los IDs de los atributos de los vértices en los shaders
        this.positionBuffer = gl.createBuffer();
        this.color_buffer = gl.createBuffer();

        gl.useProgram(this.prog);
    }

    draw(mvp, indexesOfGemsToDraw) {
        // 1. Seleccionamos el shader
        gl.useProgram(this.prog);

        // 2. Setear matriz de transformacion
        gl.uniformMatrix4fv(this.mvp, false, mvp);

        gl.useProgram(this.prog);

        //drawing gems and colors

        gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);

        this.vertPos = this.createMeshOfGemsToDraw(indexesOfGemsToDraw);
        // this.vertPos = [0,0,0, 1,1,1];
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertPos), gl.STATIC_DRAW);

        this.numTriangles = this.vertPos.length / 9;
        let colors = [];
        for (let i = 0; i < this.numTriangles; i++) {
            colors.push(0.725, 0.239, 0.741, 1);
            colors.push(0.725, 0.239, 0.741, 1);
            colors.push(0.725, 0.239, 0.741, 1);
        }

        // setting up colour buffers
        gl.bindBuffer(
            gl.ARRAY_BUFFER,
            this.color_buffer);

        gl.bufferData(
            gl.ARRAY_BUFFER,
            new Float32Array(colors),
            gl.STATIC_DRAW);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
        gl.vertexAttribPointer(this.vertPos, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(this.vertPos);

        // Link atributo color
        gl.bindBuffer(gl.ARRAY_BUFFER, this.color_buffer);
        gl.vertexAttribPointer(this.color, 4, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(this.color);

        // Dibujamos
        gl.useProgram(this.prog);
        gl.drawArrays(gl.TRIANGLES, 0, this.numTriangles * 3);
        // gl.drawElements(gl.LINES, this.numTriangles * 3, gl.UNSIGNED_SHORT, 0);

    }

    createMeshOfGemsToDraw(indexesOfGemsToDraw) {

        let vertexes = [];
        let result = indexesOfGemsToDraw.next();
        while (!result.done) {
            let [xIndex, zIndex] = result.value;
            let xTranslation = (xIndex + 1 / 2) * (TOTAL_X_LENGTH / numberOfXSquares) - TOTAL_X_LENGTH / 2;
            let yTranslation = 0.01;
            let zTranslation = (zIndex + 1 / 2) * (TOTAL_Z_LENGTH / numberOfZSquares) - TOTAL_Z_LENGTH / 2;

            let translatedGem =
                [-(TOTAL_X_LENGTH / (4 * numberOfXSquares)) + xTranslation, 0.001 + yTranslation, 0 - zTranslation,
                    (TOTAL_X_LENGTH / (4 * numberOfXSquares)) + xTranslation, 0.001 + yTranslation, 0 - zTranslation,
                    (TOTAL_X_LENGTH / (4 * numberOfXSquares)) + xTranslation, 0.1 + yTranslation, 0 - zTranslation,
                    xTranslation, 0.001 + yTranslation, (TOTAL_X_LENGTH / (4 * numberOfXSquares)) - zTranslation,
                    xTranslation, 0.001 + yTranslation, -(TOTAL_X_LENGTH / (4 * numberOfXSquares)) - zTranslation,
                    xTranslation, 0.1 + yTranslation, -(TOTAL_X_LENGTH / (4 * numberOfXSquares)) - zTranslation]


            vertexes = vertexes.concat(translatedGem);

            result = indexesOfGemsToDraw.next();
        }

        let objToMeshConverter = new ObjToMeshConverter();

        let obj = "v -0.000000 0.065948 0.018899\n" +
            "v 0.014775 0.065948 0.011784\n" +
            "v 0.018424 0.065948 -0.004204\n" +
            "v 0.008200 0.065948 -0.017026\n" +
            "v -0.008200 0.065948 -0.017026\n" +
            "v -0.018424 0.065948 -0.004204\n" +
            "v -0.014775 0.065948 0.011784\n" +
            "v -0.000000 0.015793 0.000001\n" +
            "v -0.000000 0.052440 0.033093\n" +
            "v 0.025873 0.052440 0.020634\n" +
            "v 0.032263 0.052440 -0.007363\n" +
            "v 0.014358 0.052440 -0.029814\n" +
            "v -0.014358 0.052440 -0.029814\n" +
            "v -0.032263 0.052440 -0.007363\n" +
            "v -0.025873 0.052440 0.020634\n" +
            "s off\n" +
            "f 9 8 10\n" +
            "f 10 8 11\n" +
            "f 11 8 12\n" +
            "f 12 8 13\n" +
            "f 13 8 14\n" +
            "f 6 7 2\n" +
            "f 14 8 15\n" +
            "f 15 8 9\n" +
            "f 1 10 2\n" +
            "f 2 11 3\n" +
            "f 3 12 4\n" +
            "f 4 13 5\n" +
            "f 6 13 14\n" +
            "f 6 15 7\n" +
            "f 7 9 1\n" +
            "f 7 1 2\n" +
            "f 2 3 6\n" +
            "f 3 4 6\n" +
            "f 4 5 6\n" +
            "f 1 9 10\n" +
            "f 2 10 11\n" +
            "f 3 11 12\n" +
            "f 4 12 13\n" +
            "f 6 5 13\n" +
            "f 6 14 15\n" +
            "f 7 15 9\n"

        objToMeshConverter.parse(obj);
        let xx = objToMeshConverter.getVertexBuffers();

        return xx.positionBuffer;
        // return vertexes;
    }

    gemsVS = `
	precision mediump float;

	attribute vec3 pos;
	uniform mat4 mvp;
    
    attribute vec4 clr;
    varying vec4 vcolor;
    
	void main()
	{
        gl_Position = mvp * vec4(pos, 1.0);
        vcolor = clr;
	}
`;

    gemsFS = `
precision mediump float;
varying vec4 vcolor;

void main()
{
        gl_FragColor = vcolor;
}
`;
}

