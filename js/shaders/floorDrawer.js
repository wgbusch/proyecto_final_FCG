class FloorDrawer {
    FLOOR_LEVEL = -0.0001;

    // El constructor es donde nos encargamos de realizar las inicializaciones necesarias.
    constructor() {
        // 1. Compilamos el programa de shaders
        this.prog = InitShaderProgram(this.floorVS, this.floorFS);

        // 2. Obtenemos los IDs de las variables uniformes en los shaders
        this.mvp = gl.getUniformLocation(this.prog, 'mvp');
        this.texGPU = gl.getUniformLocation(this.prog, 'texGPU');

        // 3. Obtenemos los IDs de los atributos de los vértices en los shaders
        this.vertPos = gl.getAttribLocation(this.prog, 'pos');
        this.aTextureCoord = gl.getAttribLocation(this.prog, 'aTextureCoord');

        this.texCoordBuffer = gl.createBuffer();
        this.aTexCoordBuffer = gl.createBuffer();

        // 4. Obtenemos los IDs de los atributos de los vértices en los shaders
        this.positionBuffer = gl.createBuffer();

        let FLOOR_LEVEL = this.FLOOR_LEVEL;
        this.vertPos = [-TOTAL_X_LENGTH / 2, FLOOR_LEVEL, -TOTAL_Z_LENGTH / 2,
                        -TOTAL_X_LENGTH / 2, FLOOR_LEVEL, TOTAL_Z_LENGTH / 2,
                        TOTAL_X_LENGTH / 2, FLOOR_LEVEL, -TOTAL_Z_LENGTH / 2,
                        TOTAL_X_LENGTH / 2, FLOOR_LEVEL, TOTAL_Z_LENGTH / 2,
                        -TOTAL_X_LENGTH / 2, FLOOR_LEVEL, TOTAL_Z_LENGTH / 2,
                        TOTAL_X_LENGTH / 2, FLOOR_LEVEL, -TOTAL_Z_LENGTH / 2];

        this.numTriangles = this.vertPos.length / 9;

        gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertPos), gl.STATIC_DRAW);

        let texCoords = getSquareTexture(TOTAL_X_LENGTH, TOTAL_Z_LENGTH);
        texCoords = texCoords.concat(getSquareTexture(TOTAL_X_LENGTH, TOTAL_Z_LENGTH));

        gl.bindBuffer(gl.ARRAY_BUFFER, this.texCoordBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texCoords), gl.STATIC_DRAW);
        this.texCoords = texCoords;

        gl.bindBuffer(gl.ARRAY_BUFFER, this.aTexCoordBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texCoords), gl.STATIC_DRAW);

        gl.useProgram(this.prog);
    }

    draw(matrixMVP) {
        // 1. Seleccionamos el shader
        gl.useProgram(this.prog);

        // 2. Setear matriz de transformacion
        gl.uniformMatrix4fv(this.mvp, false, matrixMVP);

        gl.useProgram(this.prog);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.texCoordBuffer);
        gl.vertexAttribPointer(this.texCoords, 2, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(this.texCoords);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.aTexCoordBuffer);
        gl.vertexAttribPointer(this.aTextureCoord, 2, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(this.aTextureCoord);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
        gl.vertexAttribPointer(this.vertPos, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(this.vertPos);

        // Make the "texture unit" 1 be the active texture unit.
        gl.activeTexture(gl.TEXTURE2);

        // Make the texture_object be the active texture. This binds the
        // texture_object to "texture unit" 1.
        gl.bindTexture(gl.TEXTURE_2D, this.texture_object);

        // Tell the shader program to use "texture unit" 1
        gl.uniform1i(this.texGPU, 2);

        // Dibujamos
        gl.drawArrays(gl.TRIANGLES, 0, this.numTriangles * 3);
    }

    // Esta función se llama para setear una textura sobre la malla
    // El argumento es un componente <img> de html que contiene la textura.
    setTexture(img) {
        gl.useProgram(this.prog);
        gl.activeTexture(gl.TEXTURE2);
        this.texture_object = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, this.texture_object);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
        gl.texImage2D(gl.TEXTURE_2D,
                      0,
                      gl.RGB,
                      gl.RGB,
                      gl.UNSIGNED_BYTE,
                      img);
        gl.generateMipmap(gl.TEXTURE_2D);
    }

    floorVS = `
	precision mediump float;

	attribute vec3 pos;
	uniform mat4 mvp;
	
	attribute vec2 aTextureCoord;
    varying vec2 texCoord;
    
	void main()
	{
        gl_Position = mvp * vec4(pos, 1.0);
        texCoord = aTextureCoord;
	}
`;

    floorFS = `
	precision mediump float;

    uniform sampler2D texGPU;
	varying vec2 texCoord;

	void main()
	{   
        gl_FragColor = texture2D(texGPU, texCoord);
	}
`
}


