

class MeshDrawerSimple {
    // El constructor es donde nos encargamos de realizar las inicializaciones necesarias.
    constructor() {
        // 1. Compilamos el programa de shaders
        this.prog = InitShaderProgram(this.meshVS, this.meshFS);

        // 2. Obtenemos los IDs de las variables uniformes en los shaders
        this.mvp = gl.getUniformLocation(this.prog, 'mvp');
        this.mv = gl.getUniformLocation(this.prog, 'mv');
        this.texGPU = gl.getUniformLocation(this.prog, 'texGPU');

        // 3. Obtenemos los IDs de los atributos de los vértices en los shaders
        this.vertPos = gl.getAttribLocation(this.prog, 'pos');
        this.aTextureCoord = gl.getAttribLocation(this.prog, 'aTextureCoord');

        // 4. Obtenemos los IDs de los atributos de los vértices en los shaders

        this.positionBuffer = gl.createBuffer();
        this.texCoordBuffer = gl.createBuffer();
        this.aTexCoordBuffer = gl.createBuffer();
    }


    setMesh(vertPos, texCoords, normals) {

        let labyrinthDrawer = new LabyrinthDrawer(this.abstractLabyrinth);

        let mesh = new Mesh();
        let vertPos2 = labyrinthDrawer.drawOuterWalls(mesh);
        vertPos2 = labyrinthDrawer.drawInnerWalls(mesh);

        this.numTriangles = vertPos2.numTriangles;
        this.vertPos = vertPos2.convertToArray();

        gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertPos), gl.STATIC_DRAW);

        texCoords = new Array(this.numTriangles * 3 * 2);

        constructOuterWallsTexture(texCoords, TOTAL_X_LENGTH);
        constructInnerWallsTexture(texCoords, 48, this.numTriangles, labyrinthDrawer.wallXLength);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.texCoordBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texCoords), gl.STATIC_DRAW);
        this.texCoords = texCoords;

        gl.bindBuffer(gl.ARRAY_BUFFER, this.aTexCoordBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texCoords), gl.STATIC_DRAW);

        gl.useProgram(this.prog);
    }

    draw(matrixMVP, matrixMV, matrixNormal) {
        // 1. Seleccionamos el shader
        gl.useProgram(this.prog);

        // 2. Setear matriz de transformacion
        gl.uniformMatrix4fv(this.mvp, false, matrixMVP);

        // 2.  Setear matrix mv
        gl.uniformMatrix4fv(this.mv, false, matrixMV);

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

        // Make the "texture unit" 0 be the active texture unit.
        gl.activeTexture(gl.TEXTURE0);

        // Make the texture_object be the active texture. This binds the
        // texture_object to "texture unit" 0.
        gl.bindTexture(gl.TEXTURE_2D, this.texture_object);

        // Tell the shader program to use "texture unit" 0
        gl.uniform1i(this.texGPU, 0);

        // Dibujamos
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.useProgram(this.prog);
        gl.drawArrays(gl.TRIANGLES, 0, this.numTriangles * 3);
    }

    setLightDir(x, y, z) {
    }

    setShininess(shininess) {
    }

    setTexture(img) {
        gl.useProgram(this.prog);
        gl.activeTexture(gl.TEXTURE0);
        this.texture_object = gl.createTexture();
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
        gl.bindTexture(gl.TEXTURE_2D, this.texture_object);
        gl.texImage2D(gl.TEXTURE_2D,
                      0,
                      gl.RGB,
                      gl.RGB,
                      gl.UNSIGNED_BYTE,
                      img);
        gl.generateMipmap(gl.TEXTURE_2D);
    }

    setAbstractLabyrinth(labyrinth) {
        this.abstractLabyrinth = labyrinth;
    }

    meshVS = `
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

    meshFS = `
	precision mediump float;

	uniform sampler2D texGPU;
	varying vec2 texCoord;
	
	void main()
	{   
            gl_FragColor = texture2D(texGPU, texCoord);
	}
`
}

