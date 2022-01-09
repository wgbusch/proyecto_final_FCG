function GetModelViewMatrix(translationX, translationY, translationZ,
                            rotationX, rotationY, rotationZ, cameraRotationXY) {

    const cosRotX = Math.cos(rotationX);
    const sinRotX = Math.sin(rotationX);

    const cosRotY = Math.cos(rotationY);
    const sinRotY = Math.sin(rotationY);

    const cosRotZ = Math.cos(rotationZ);
    const sinRotZ = Math.sin(rotationZ);

    let rotationMatrixX = [
        1, 0, 0, 0,
        0, cosRotX, sinRotX, 0,
        0, -sinRotX, cosRotX, 0,
        0, 0, 0, 1
    ]

    let rotationMatrixY = [
        cosRotY, 0, -sinRotY, 0,
        0, 1, 0, 0,
        sinRotY, 0, cosRotY, 0,
        0, 0, 0, 1
    ]

    let rotationMatrixZ = [
        cosRotZ, sinRotZ, 0, 0,
        -sinRotZ, cosRotZ, 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1
    ]

    let rotations = MatrixMult(rotationMatrixZ, MatrixMult(rotationMatrixX, rotationMatrixY));

    let trans = [
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        translationX, translationY, translationZ, 1
    ];

    let mv = MatrixMult(trans, rotations);

    let alpha = 0;
    let theta = cameraRotationXY;

    let w = new Vertex([
                           Math.cos(alpha) * Math.sin(theta),
                           Math.sin(alpha) * Math.sin(theta),
                           Math.cos(theta)]);

    let v2 = new Vertex([-w.z, 0, w.y]);
    let p = proj(w, v2);
    let u2 = new Vertex([v2.x - p.x, v2.y - p.y, v2.z - p.z]);

    let u = Normalize(u2);

    let u3 = crossProduct(w, u);
    let v = Normalize(u3);

    let direction = [
        -u.x, -u.y, -u.z, 0,
        -v.x, -v.y, -v.z, 0,
        w.x, w.y, w.z, 0,
        0, 0, 0, 1
    ];

    return MatrixMult(direction, mv);
}

colours = {
    pink: [1, 0.8, 0.9, 1.0],
    green: [0.3, 0.6, 0.3, 1.0],
    orange: [1, 0.5, 0, 1.0],
    gold: [1, 0.92, 0, 1.0],
    tomato: [1, 0.35, 0.29, 1.0],
    grey: [0.6, 0.6, 0.6, 1.0],
    black: [0, 0, 0, 1.0]
}
coloursEnum = ["pink", "green", "orange", "gold", "tomato", "grey", "black"]

class MeshDrawerSimple {
    // El constructor es donde nos encargamos de realizar las inicializaciones necesarias.
    constructor() {
        // 1. Compilamos el programa de shaders
        this.prog = InitShaderProgram(meshVS, meshFS);

        // 2. Obtenemos los IDs de las variables uniformes en los shaders
        this.mvp = gl.getUniformLocation(this.prog, 'mvp');
        this.mv = gl.getUniformLocation(this.prog, 'mv');
        // this.u_useTexture = gl.getUniformLocation(this.prog, 'useTexture');

        // 3. Obtenemos los IDs de los atributos de los vértices en los shaders
        this.vertPos = gl.getAttribLocation(this.prog, 'pos');
        this.aTextureCoord = gl.getAttribLocation(this.prog, 'aTextureCoord');

        // 4. Obtenemos los IDs de los atributos de los vértices en los shaders

        this.positionBuffer = gl.createBuffer();
        this.color_buffer = gl.createBuffer();
        this.texCoordBuffer = gl.createBuffer();
        this.aTexCoordBuffer = gl.createBuffer();

        // this.color = gl.getAttribLocation(this.prog, 'clr');
        // this.color_buffer = gl.createBuffer();

        gl.useProgram(this.prog);
    }

    // Esta función se llama cada vez que el usuario carga un nuevo
    // archivo OBJ. En los argumentos de esta función llegan un areglo
    // con las posiciones 3D de los vértices, un arreglo 2D con las
    // coordenadas de textura y las normales correspondientes a cada
    // vértice. Todos los items en estos arreglos son del tipo float.
    // Los vértices y normales se componen de a tres elementos
    // consecutivos en el arreglo vertPos [x0,y0,z0,x1,y1,z1,..] y
    // normals [n0,n0,n0,n1,n1,n1,...]. De manera similar, las
    // cooredenadas de textura se componen de a 2 elementos
    // consecutivos y se  asocian a cada vértice en orden.
    setMesh(vertPos, texCoords, normals, onlyFloor) {

        let labyrinthDrawer = new LabyrinthDrawer(this.abstractLabyrinth, 0.05);

        let mesh = new Mesh();
        let vertPos2 = labyrinthDrawer.drawFloor(mesh);

        if (!onlyFloor){
            labyrinthDrawer.drawOutterWalls(mesh);
            vertPos2 = labyrinthDrawer.drawInnerWalls(mesh);
        }

        this.numTriangles = vertPos2.numTriangles;
        this.vertPos = vertPos2.convertToArray();

        gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertPos), gl.STATIC_DRAW);

        let numTriangles = vertPos2.numTriangles;
        let colors = [];
        for (let i = 0; i < numTriangles; i++) {
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

        texCoords = new Array(16*6);
        for(let i = 0; i < texCoords.length; i++){
            texCoords[i] = Math.random();
        }

        gl.bindBuffer(gl.ARRAY_BUFFER, this.texCoordBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texCoords), gl.STATIC_DRAW);
        this.texCoords = texCoords;

        gl.bindBuffer(gl.ARRAY_BUFFER, this.aTexCoordBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texCoords), gl.STATIC_DRAW);

        // gl.bindBuffer(
        //     gl.ARRAY_BUFFER,
        //     this.color_buffer);
        //
        // gl.bufferData(
        //     gl.ARRAY_BUFFER,
        //     new Float32Array(colors),
        //     gl.STATIC_DRAW);
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

        // Link atributo color
        // gl.bindBuffer(gl.ARRAY_BUFFER, this.color_buffer);
        // gl.vertexAttribPointer(this.color, 4, gl.FLOAT, false, 0, 0);
        // gl.enableVertexAttribArray(this.color);

        // Dibujamos
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.useProgram(this.prog);
        gl.drawArrays(gl.TRIANGLES, 0, this.numTriangles*3);
    }

    // Esta función se llama para setear una textura sobre la malla
    // El argumento es un componente <img> de html que contiene la textura.
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

    showTexture(show) {
        gl.useProgram(this.prog);
        gl.uniform1i(this.u_useTexture, show ? 1 : 0);
        if (show) {
            gl.activeTexture(gl.TEXTURE0);
            gl.bindTexture(gl.TEXTURE_2D, this.textura);
            const sampler = gl.getUniformLocation(this.prog, 'texGPU');
            gl.useProgram(this.prog);
            gl.uniform1f(sampler, 0);
        }
    }

    setLightDir(x, y, z) {
    }

    setShininess(shininess) {
    }

    setAbstractLabyrinth(labyrinth) {
        this.abstractLabyrinth = labyrinth;
    }
}

var meshVS = `
	precision mediump float;

	attribute vec3 pos;
	uniform mat4 mvp;
	
    attribute vec2 aTextureCoord;
    varying vec2 texCoord;
    	
	// attribute vec4 clr;
    // varying vec4 vcolor;
    
	void main()
	{
        gl_Position = mvp * vec4(pos, 1.0);
        texCoord = aTextureCoord;
        // vcolor = clr;
	}
`;

var meshFS = `
	precision mediump float;

	uniform sampler2D texGPU;
	varying vec2 texCoord;
	// uniform int useTexture;

    // varying vec4 vcolor;
	void main()
	{   
	    // if(useTexture== 1){
            gl_FragColor = texture2D(texGPU, texCoord);
        // } else{
        //     gl_FragColor = vcolor;
        // }
	}
`
