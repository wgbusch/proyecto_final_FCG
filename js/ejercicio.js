// <============================================ EJERCICIOS ============================================>
// a) Implementar la función:
//
//      GetModelViewMatrix( translationX, translationY, translationZ, rotationX, rotationY )
//
//    Si la implementación es correcta, podrán hacer rotar la caja correctamente (como en el video). Notar
//    que esta función no es exactamente la misma que implementaron en el TP4, ya que no recibe por parámetro
//    la matriz de proyección. Es decir, deberá retornar solo la transformación antes de la proyección model-view (MV)
//    Es necesario completar esta implementación para que funcione el control de la luz en la interfaz.
//    IMPORTANTE: No es recomendable avanzar con los ejercicios b) y c) si este no funciona correctamente.
//
// b) Implementar los métodos:
//
//      setMesh( vertPos, texCoords, normals )
//      swapYZ( swap )
//      draw( matrixMVP, matrixMV, matrixNormal )
//
//    Si la implementación es correcta, podrán visualizar el objeto 3D que hayan cargado, asi como también intercambiar
//    sus coordenadas yz. Notar que es necesario pasar las normales como atributo al VertexShader.
//    La función draw recibe ahora 3 matrices en column-major:
//
//       * model-view-projection (MVP de 4x4)
//       * model-view (MV de 4x4)
//       * normal transformation (MV_3x3)
//
//    Estas últimas dos matrices adicionales deben ser utilizadas para transformar las posiciones y las normales del
//    espacio objeto al esapcio cámara.
//
// c) Implementar los métodos:
//
//      setTexture( img )
//      showTexture( show )
//
//    Si la implementación es correcta, podrán visualizar el objeto 3D que hayan cargado y su textura.
//    Notar que los shaders deberán ser modificados entre el ejercicio b) y el c) para incorporar las texturas.
//
// d) Implementar los métodos:
//
//      setLightDir(x,y,z)
//      setShininess(alpha)
//
//    Estas funciones se llaman cada vez que se modifican los parámetros del modelo de iluminación en la
//    interface. No es necesario transformar la dirección de la luz (x,y,z), ya viene en espacio cámara.
//
// Otras aclaraciones:
//
//      * Utilizaremos una sola fuente de luz direccional en toda la escena
//      * La intensidad I para el modelo de iluminación debe ser seteada como blanca (1.0,1.0,1.0,1.0) en RGB
//      * Es opcional incorporar la componente ambiental (Ka) del modelo de iluminación
//      * Los coeficientes Kd y Ks correspondientes a las componentes difusa y especular del modelo
//        deben ser seteados con el color blanco. En caso de que se active el uso de texturas, la
//        componente difusa (Kd) será reemplazada por el valor de textura.
//
// <=====================================================================================================>

// Esta función recibe la matriz de proyección (ya calculada), una
// traslación y dos ángulos de rotación (en radianes). Cada una de
// las rotaciones se aplican sobre el eje x e y, respectivamente.
// La función debe retornar la combinación de las transformaciones
// 3D (rotación, traslación y proyección) en una matriz de 4x4,
// representada por un arreglo en formato column-major.

function GetModelViewMatrix(translationX, translationY, translationZ, rotationX, rotationY) {

    const cosRotX = Math.cos(rotationX);
    const sinRotX = Math.sin(rotationX);

    const cosRotY = Math.cos(rotationY);
    const sinRotY = Math.sin(rotationY);
    var rotationMatrixX = [
        1, 0, 0, 0,
        0, cosRotX, sinRotX, 0,
        0, -sinRotX, cosRotX, 0,
        0, 0, 0, 1
    ]

    var rotationMatrixY = [
        cosRotY, 0, -sinRotY, 0,
        0, 1, 0, 0,
        sinRotY, 0, cosRotY, 0,
        0, 0, 0, 1
    ]
    var rotations = MatrixMult(rotationMatrixX, rotationMatrixY);

    var trans = [
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        translationX, translationY, translationZ, 1
    ];

    return MatrixMult(trans, rotations);
}

class MeshDrawer {
    // El constructor es donde nos encargamos de realizar las inicializaciones necesarias.
    constructor() {
        // 1. Compilamos el programa de shaders
        this.prog = InitShaderProgram(meshVS, meshFS);

        // 2. Obtenemos los IDs de las variables uniformes en los shaders
        this.mvp = gl.getUniformLocation(this.prog, 'mvp');
        this.mv = gl.getUniformLocation(this.prog, 'mv');
        this.mn = gl.getUniformLocation(this.prog, 'mn');

        this.light = gl.getUniformLocation(this.prog, 'light');


        // 3. Obtenemos los IDs de los atributos de los vértices en los shaders
        this.vertPos = gl.getAttribLocation(this.prog, 'pos');

        this.aTextureCoord = gl.getAttribLocation(this.prog, 'aTextureCoord');

        this.normCoord = gl.getAttribLocation(this.prog, 'aNormCoord');

        // 4. Obtenemos los IDs de los atributos de los vértices en los shaders
        this.u_swapYZ = gl.getUniformLocation(this.prog, 'swapYZ');
        this.u_useTexture = gl.getUniformLocation(this.prog, 'useTexture');
        this.shininess = gl.getUniformLocation(this.prog, 'shininess');

        this.positionBuffer = gl.createBuffer();

        this.texCoordBuffer = gl.createBuffer();

        this.aTexCoordBuffer = gl.createBuffer();

        this.normalBuffer = gl.createBuffer();

        gl.useProgram(this.prog);
        gl.uniform1f(this.shininess, 1.0);
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
    setMesh(vertPos, texCoords, normals) {
        this.numTriangles = vertPos.length / 3;
        gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertPos), gl.STATIC_DRAW);
        this.vertPos = vertPos;

        gl.bindBuffer(gl.ARRAY_BUFFER, this.texCoordBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texCoords), gl.STATIC_DRAW);
        this.texCoords = texCoords;

        gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW);
        this.normCoord = normals;

        gl.bindBuffer(gl.ARRAY_BUFFER, this.aTexCoordBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texCoords), gl.STATIC_DRAW);
    }

    // Esta función se llama cada vez que el usuario cambia el estado del checkbox 'Intercambiar Y-Z'
    // El argumento es un boleano que indica si el checkbox está tildado
    swapYZ(swap) {
        gl.useProgram(this.prog);
        gl.uniform1i(this.u_swapYZ, swap ? 1 : 0);
    }

    // Esta función se llama para dibujar la malla de triángulos
    // El argumento es la matriz model-view-projection (matrixMVP),
    // la matriz model-view (matrixMV) que es retornada por
    // GetModelViewProjection y la matriz de transformación de las
    // normales (matrixNormal) que es la inversa transpuesta de matrixMV
    draw(matrixMVP, matrixMV, matrixNormal) {
        // 1. Seleccionamos el shader
        gl.useProgram(this.prog);

        // 2. Setear matriz de transformacion
        gl.uniformMatrix4fv(this.mvp, false, matrixMVP);

        // 2.  Setear matrix mv
        gl.uniformMatrix4fv(this.mv, false, matrixMV);

        gl.uniformMatrix3fv(this.mn, false, matrixNormal);

        // 3.Binding de los buffers
        gl.bindBuffer(gl.ARRAY_BUFFER, this.aTexCoordBuffer);
        gl.vertexAttribPointer(this.aTextureCoord, 2, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(this.aTextureCoord);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer);
        gl.vertexAttribPointer(this.normCoord, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(this.normCoord);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
        gl.vertexAttribPointer(this.vertPos, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(this.vertPos);

        // Dibujamos
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.useProgram(this.prog);
        gl.drawArrays(gl.TRIANGLES, 0, this.numTriangles);
    }

    // Esta función se llama para setear una textura sobre la malla
    // El argumento es un componente <img> de html que contiene la textura.
    setTexture(img) {
        // Pueden setear la textura utilizando esta función:
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
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, this.textura);

        const sampler = gl.getUniformLocation(this.prog, 'texGPU');
        gl.uniform1f(sampler, 0);
        gl.uniform1i(this.u_useTexture, 1);
    }

    // Esta función se llama cada vez que el usuario cambia el estado del checkbox 'Mostrar textura'
    // El argumento es un boleano que indica si el checkbox está tildado
    showTexture(show) {
        this.show = show;
        // Setear variables uniformes en el fragment shader
        gl.useProgram(this.prog);
        gl.uniform1i(this.u_useTexture, show ? 1 : 0);
    }

    // Este método se llama al actualizar la dirección de la luz desde la interfaz
    setLightDir(x, y, z) {
        gl.useProgram(this.prog);
        gl.uniform3f(this.light, x, y, z);
    }

    // Este método se llama al actualizar el brillo del material
    setShininess(shininess) {
        // [COMPLETAR] Setear variables uniformes en el fragment shader para especificar el brillo.
        gl.useProgram(this.prog);
        gl.uniform1f(this.shininess, shininess);
    }
}

// [COMPLETAR] Calcular iluminación utilizando Blinn-Phong.

// Recordar que:
// Si declarás las variables pero no las usás, es como que no las declaraste
// y va a tirar error. Siempre va punto y coma al finalizar la sentencia.
// Las constantes en punto flotante necesitan ser expresadas como x.y,
// incluso si son enteros: ejemplo, para 4 escribimos 4.0.

// Vertex Shader
var meshVS = `
	precision mediump float;

	attribute vec3 pos;

	uniform mat4 mvp;
	uniform int swapYZ;

	varying vec2 texCoord;
    attribute vec2 aTextureCoord;

	varying vec3 normCoord;
	attribute vec3 aNormCoord;
	
	varying vec4 vertCoord;
	
	void main()
	{
	    vec3 drawPos = pos;
	    if (swapYZ == 1) {
            drawPos = vec3(pos[0],pos[2],pos[1]);
        }
        gl_Position = mvp * vec4(drawPos, 1.0);
        texCoord = aTextureCoord;
        normCoord = aNormCoord;
        vertCoord = vec4(pos, 1.0);
	}
`;

// Fragment Shader
// Algunas funciones útiles para escribir este shader:
// Dot product: https://thebookofshaders.com/glossary/?search=dot
// Normalize:   https://thebookofshaders.com/glossary/?search=normalize
// Pow:         https://thebookofshaders.com/glossary/?seyarch=pow

// Otras aclaraciones:
//
//      * Utilizaremos una sola fuente de luz direccional en toda la escena
//      * La intensidad I para el modelo de iluminación debe ser seteada como blanca (1.0,1.0,1.0,1.0) en RGB
//      * Es opcional incorporar la componente ambiental (Ka) del modelo de iluminación
//      * Los coeficientes Kd y Ks correspondientes a las componentes difusa y especular del modelo
//        deben ser seteados con el color blanco. En caso de que se active el uso de texturas, la
//        componente difusa (Kd) será reemplazada por el valor de textura.
var meshFS =
    `
	precision mediump float;
	uniform int useTexture;
    uniform float shininess;
    
	uniform mat3 mn;
    uniform vec3 light;
    uniform mat4 mv;

	varying vec2 texCoord;
	varying vec3 normCoord;
	uniform sampler2D texGPU;
	varying vec4 vertCoord;
		
	void main()
	{		
        vec4 white = vec4(1.0, 1.0, 1.0, 1.0);
        vec4 I = white;
        vec4 Ia = white;
        
        vec3 n = normalize(mn * normCoord);
        vec3 v = - vec3(mv * vertCoord);
        
        vec4 Ks = white;
        vec4 Kd;
        vec4 Ka;
        if(useTexture ==1){
            Kd = texture2D(texGPU, texCoord);
            Ka = Kd;
        } else {
            Kd = white;
            Ka = Kd;
        }
        
        float cos_theta = dot(n, light);
        
        vec3 r = 2.0*dot(light, n)*n - light;  
        float cos_sigma = dot(v, r);
        
        gl_FragColor = I*( Kd*max(0.0, cos_theta) );        
	}
`;
