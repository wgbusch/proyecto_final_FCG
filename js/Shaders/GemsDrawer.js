class GemsDrawer {

    // El constructor es donde nos encargamos de realizar las inicializaciones necesarias.
    constructor() {

        // 1. Compilamos el programa de shaders
        this.prog = InitShaderProgram(this.ceilingVS, this.ceilingFS);

        // 2. Obtenemos los IDs de las variables uniformes en los shaders
        this.mvp = gl.getUniformLocation(this.prog, 'mvp');

        // 3. Obtenemos los IDs de los atributos de los vértices en los shaders
        this.vertPos = gl.getAttribLocation(this.prog, 'pos');

        // 4. Obtenemos los IDs de los atributos de los vértices en los shaders
        this.positionBuffer = gl.createBuffer();

        this.numTriangles = this.vertPos.length / 9;

        gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertPos), gl.STATIC_DRAW);

        gl.useProgram(this.prog);
    }

    draw(mvp) {
        // 1. Seleccionamos el shader
        gl.useProgram(this.prog);

        // 2. Setear matriz de transformacion
        gl.uniformMatrix4fv(this.mvp, false, mvp);

        gl.useProgram(this.prog);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
        gl.vertexAttribPointer(this.vertPos, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(this.vertPos);

        // Dibujamos
        gl.drawArrays(gl.TRIANGLES, 0, this.numTriangles * 3);
    }

    ceilingVS = `
	precision mediump float;

	attribute vec3 pos;
	uniform mat4 mvp;
	
	attribute vec2 aTextureCoord;
    varying vec2 texCoord;
    
	void main()
	{
        gl_Position = mvp * vec4(pos, 1.0);
	}
`;

    ceilingFS = `
	precision mediump float;

	void main()
	{   
        gl_FragColor = vec;
	}
`;
}

