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

        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertPos), gl.STATIC_DRAW);

        this.numTriangles = this.vertPos.length / 9;
        let colors = [];
        for (let i = 0; i < this.numTriangles; i++) {
            if (i % 3 === 0) {
                colors.push(1, 0, 0, 1);
                colors.push(1, 0, 0, 1);
                colors.push(1, 0, 0, 1);
            } else if (i % 3 === 1) {
                colors.push(0, 1, 0, 1);
                colors.push(0, 1, 0, 1);
                colors.push(0, 1, 0, 1);
            } else if (i % 3 === 2) {
                colors.push(0, 0, 1, 1);
                colors.push(0, 0, 1, 1);
                colors.push(0, 0, 1, 1);
            }
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
                [   -(TOTAL_X_LENGTH / (4 * numberOfXSquares)) + xTranslation,  0.001 + yTranslation,   0 - zTranslation,
                    (TOTAL_X_LENGTH / (4 * numberOfXSquares)) + xTranslation,   0.001 + yTranslation,   0 - zTranslation,
                    (TOTAL_X_LENGTH / (4 * numberOfXSquares)) + xTranslation,   0.1 + yTranslation,     0 - zTranslation,
                    xTranslation,                                               0.001 + yTranslation,   (TOTAL_X_LENGTH / (4 * numberOfXSquares)) - zTranslation,
                    xTranslation,                                               0.001 + yTranslation,   -(TOTAL_X_LENGTH / (4 * numberOfXSquares)) - zTranslation,
                    xTranslation,                                               0.1 + yTranslation,     -(TOTAL_X_LENGTH / (4 * numberOfXSquares)) - zTranslation]

            vertexes = vertexes.concat(translatedGem);

            result = indexesOfGemsToDraw.next();
        }
        return vertexes;
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

