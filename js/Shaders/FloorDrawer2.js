class FloorDrawer2 {
    HEIGHT_CEILING = LABYRINTH_HEIGHT + 0.001

    // El constructor es donde nos encargamos de realizar las inicializaciones necesarias.
    constructor() {
        // 1. Compilamos el programa de shaders
        this.prog = InitShaderProgram(this.floorVS, this.floorFS);

        // 2. Obtenemos los IDs de las variables uniformes en los shaders
        this.mvp = gl.getUniformLocation(this.prog, 'mvp');
        this.mv = gl.getUniformLocation(this.prog, 'mv');
        this.texGPU = gl.getUniformLocation(this.prog, 'texGPU');

        // 3. Obtenemos los IDs de los atributos de los vértices en los shaders
        this.vertPos = gl.getAttribLocation(this.prog, 'pos');
        this.aTextureCoord = gl.getAttribLocation(this.prog, 'aTextureCoord');

        this.texCoordBuffer = gl.createBuffer();
        this.aTexCoordBuffer = gl.createBuffer();

        // 4. Obtenemos los IDs de los atributos de los vértices en los shaders
        this.positionBuffer = gl.createBuffer();

        this.vertPosFloor = [-TOTAL_X_LENGTH / 2, -0.0001, -TOTAL_Z_LENGTH / 2,
                        -TOTAL_X_LENGTH / 2, -0.0001, TOTAL_Z_LENGTH / 2,
                        TOTAL_X_LENGTH / 2, -0.0001, -TOTAL_Z_LENGTH / 2,
                        TOTAL_X_LENGTH / 2, -0.0001, TOTAL_Z_LENGTH / 2,
                        -TOTAL_X_LENGTH / 2, -0.0001, TOTAL_Z_LENGTH / 2,
                        TOTAL_X_LENGTH / 2, -0.0001, -TOTAL_Z_LENGTH / 2];

        let HEIGHT_CEILING = this.HEIGHT_CEILING;
        this.vertPosCeiling = [-TOTAL_X_LENGTH / 2, HEIGHT_CEILING, -TOTAL_Z_LENGTH / 2,
                                            -TOTAL_X_LENGTH / 2, HEIGHT_CEILING, TOTAL_Z_LENGTH / 2,
                                            TOTAL_X_LENGTH / 2, HEIGHT_CEILING, -TOTAL_Z_LENGTH / 2,
                                            TOTAL_X_LENGTH / 2, HEIGHT_CEILING, TOTAL_Z_LENGTH / 2,
                                            -TOTAL_X_LENGTH / 2, HEIGHT_CEILING, TOTAL_Z_LENGTH / 2,
                                            TOTAL_X_LENGTH / 2, HEIGHT_CEILING, -TOTAL_Z_LENGTH / 2];

        this.numTrianglesCeiling = this.vertPosCeiling.length / 9;
        this.numTrianglesFloor = this.vertPosFloor.length / 9;

        gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertPos), gl.STATIC_DRAW);

        let texCoordsCeiling = getSquareTexture(TOTAL_X_LENGTH, TOTAL_Z_LENGTH);
        let texCoordsFloor = getSquareTexture(TOTAL_X_LENGTH, TOTAL_Z_LENGTH);
        this.texCoordsFloor = texCoordsFloor;
        this.texCoordsCeiling = texCoordsCeiling;

        gl.bindBuffer(gl.ARRAY_BUFFER, this.texCoordBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texCoordsFloor), gl.STATIC_DRAW);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.aTexCoordBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texCoordsFloor), gl.STATIC_DRAW);



        gl.bindBuffer(gl.ARRAY_BUFFER, this.texCoordBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texCoordsCeiling), gl.STATIC_DRAW);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.aTexCoordBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texCoordsCeiling), gl.STATIC_DRAW);

        gl.useProgram(this.prog);
    }

    draw2(matrixMVP, matrixMV, matrixNormal) {
        // 1. Seleccionamos el shader
        gl.useProgram(this.prog);

        // 2. Setear matriz de transformacion
        gl.uniformMatrix4fv(this.mvp, false, matrixMVP);

        // 2.  Setear matrix mv
        gl.uniformMatrix4fv(this.mv, false, matrixMV);

        gl.useProgram(this.prog);


        gl.bindBuffer(gl.ARRAY_BUFFER, this.texCoordBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.texCoordsFloor), gl.STATIC_DRAW);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.aTexCoordBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.texCoordsFloor), gl.STATIC_DRAW);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.texCoordBuffer);
        gl.vertexAttribPointer(this.texCoordsFloor, 2, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(this.texCoordsFloor);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.aTexCoordBuffer);
        gl.vertexAttribPointer(this.aTextureCoord, 2, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(this.aTextureCoord);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
        gl.vertexAttribPointer(this.vertPos, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(this.vertPos);

        // Make the "texture unit" 2 be the active texture unit.
        gl.activeTexture(gl.TEXTURE2);

        // Make the texture_object be the active texture. This binds the
        // texture_object to "texture unit" 2.
        gl.bindTexture(gl.TEXTURE_2D, this.texture_floor);

        // Tell the shader program to use "texture unit" 2
        gl.uniform1i(this.texGPU, 2);

        // Dibujamos
        gl.drawArrays(gl.TRIANGLES, 0, this.numTrianglesFloor * 3);




        // Make the "texture unit" 3 be the active texture unit.
        gl.activeTexture(gl.TEXTURE3);

        // Make the texture_object be the active texture. This binds the
        // texture_object to "texture unit" 3.
        gl.bindTexture(gl.TEXTURE_2D, this.texture_ceiling);

        // Tell the shader program to use "texture unit" 3
        gl.uniform1i(this.texGPU, 3);

        // Dibujamos
        gl.drawArrays(gl.TRIANGLES, 0, this.numTrianglesCeiling * 3);

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

    setTextureFloor(img) {
        gl.useProgram(this.prog);
        gl.activeTexture(gl.TEXTURE2);
        this.texture_floor = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, this.texture_floor);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
        gl.texImage2D(gl.TEXTURE_2D,
                      0,
                      gl.RGB,
                      gl.RGB,
                      gl.UNSIGNED_BYTE,
                      img);
        gl.generateMipmap(gl.TEXTURE_2D);
    }

    setTextureCeiling(img) {
        gl.useProgram(this.prog);
        gl.activeTexture(gl.TEXTURE3);
        this.texture_ceiling = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, this.texture_ceiling);
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



function LoadTextureFloor2() {

    let img = document.getElementById('texture-img-floor');
    img.onload = () => {
        floorDrawer.setTextureFloor(img);
        DrawScene();
    }
    img.crossOrigin = "";
    img.src = FLOOR_URL_SMALL;
}

function LoadTextureCeiling2() {

    let img = document.getElementById('texture-img-ceiling');
    img.onload = () => {
        floorDrawer.setTextureCeiling(img);
        DrawScene();
    }
    img.crossOrigin = "";
    img.src = CEILING_URL_SMALL;
}
