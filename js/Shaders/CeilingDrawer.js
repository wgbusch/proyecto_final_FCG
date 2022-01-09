class CeilingDrawer {

    HEIGHT_CEILING = 0.25

    // El constructor es donde nos encargamos de realizar las inicializaciones necesarias.
    constructor() {

        // 1. Compilamos el programa de shaders
        this.prog = InitShaderProgram(this.ceilingVS, this.ceilingFS);

        // 2. Obtenemos los IDs de las variables uniformes en los shaders
        this.mvp = gl.getUniformLocation(this.prog, 'mvp');
        this.mv = gl.getUniformLocation(this.prog, 'mv');

        // 3. Obtenemos los IDs de los atributos de los vértices en los shaders
        this.vertPos = gl.getAttribLocation(this.prog, 'pos');

        this.color_buffer = gl.createBuffer();

        // 4. Obtenemos los IDs de los atributos de los vértices en los shaders
        this.positionBuffer = gl.createBuffer();

        this.color = gl.getAttribLocation(this.prog, 'clr');
        this.color_buffer = gl.createBuffer();

        let HEIGHT_CEILING = this.HEIGHT_CEILING;
        this.vertPos = [-2, HEIGHT_CEILING, -2,
                        -2, HEIGHT_CEILING, 2,
                        2, HEIGHT_CEILING, -2,
                        2, HEIGHT_CEILING, 2,
                        -2, HEIGHT_CEILING, 2,
                        2, HEIGHT_CEILING, -2];

        this.numTriangles = this.vertPos.length / 9;

        gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertPos), gl.STATIC_DRAW);

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

        gl.bindBuffer(
            gl.ARRAY_BUFFER,
            this.color_buffer);

        gl.bufferData(
            gl.ARRAY_BUFFER,
            new Float32Array(colors),
            gl.STATIC_DRAW);

        gl.useProgram(this.prog);
    }

    draw(matrixMVP, matrixMV, matrixNormal) {
        // 1. Seleccionamos el shader
        gl.useProgram(this.prog);

        // 2. Setear matriz de transformacion
        gl.uniformMatrix4fv(this.mvp, false, matrixMVP);

        // 2.  Setear matrix mv
        gl.uniformMatrix4fv(this.mv, false, matrixMV);

        // Link atributo color
        gl.bindBuffer(gl.ARRAY_BUFFER, this.color_buffer);
        gl.vertexAttribPointer(this.color, 4, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(this.color);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
        gl.vertexAttribPointer(this.vertPos, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(this.vertPos);

        // Dibujamos
        // gl.clear(gl.COLOR_BUFFER_BIT);
        // gl.useProgram(this.prog);
        gl.drawArrays(gl.TRIANGLES, 0, this.numTriangles * 3);
    }

    setTexture(img) {
        gl.useProgram(this.prog);
        this.textura = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, this.textura);
        gl.texImage2D(gl.TEXTURE_2D,
                      0,
                      gl.RGB,
                      gl.RGB,
                      gl.UNSIGNED_BYTE,
                      img);
        gl.generateMipmap(gl.TEXTURE_2D);
    }

    setLightDir(x, y, z) {
    }

    setShininess(shininess) {
    }

    ceilingVS = `
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

    ceilingFS = `
	precision mediump float;

    varying vec4 vcolor;
	void main()
	{   
            gl_FragColor = vcolor;
	}
`;

}

