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

WALL_WIDTH = 0.01;

function GetModelViewMatrix(translationX, translationY, translationZ,
                            rotationX, rotationY, rotationZ, cameraRotationXY) {

    const cosRotX = Math.cos(rotationX);
    const sinRotX = Math.sin(rotationX);

    const cosRotY = Math.cos(rotationY);
    const sinRotY = Math.sin(rotationY);

    const cosRotZ = Math.cos(rotationZ);
    const sinRotZ = Math.sin(rotationZ);

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

    var rotationMatrixZ = [
        cosRotZ, sinRotZ, 0, 0,
        -sinRotZ, cosRotZ, 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1
    ]

    var rotations = MatrixMult(rotationMatrixZ, MatrixMult(rotationMatrixX, rotationMatrixY));

    var trans = [
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        translationX, translationY, translationZ, 1
    ];

    var mv = MatrixMult(trans, rotations);

    var alpha = 0;
    var theta = cameraRotationXY;

    var w = {
        x: Math.cos(alpha) * Math.sin(theta),
        y: Math.sin(alpha) * Math.sin(theta),
        z: Math.cos(theta)
    };

    var v2 = {x: -w.z, y: 0, z: w.y};
    var p = proj(w, v2);
    var u2 = {x: v2.x - p.x, y: v2.y - p.y, z: v2.z - p.z};

    var u = Norm(u2);

    var u3 = crossProduct(w, u);
    var v = Norm(u3);

    var direction = [
        -u.x, -u.y, -u.z, 0,
        -v.x, -v.y, -v.z, 0,
        w.x, w.y, w.z, 0,
        0, 0, 0, 1
    ];

    return MatrixMult(direction, mv);
}

function Norm(u) {
    var norm = Math.sqrt(u.x * u.x + u.y * u.y + u.z * u.z);
    var l = {x: u.x / norm, y: u.y / norm, z: u.z / norm};
    return l;
}

function proj(u, v) {
    var num = u.x * v.x + u.y * v.y + u.z * v.z;
    var den = u.x * u.x + u.y * u.y + u.z * u.z;
    var c = num / den;
    return {x: c * u.x, y: c * u.y, z: c * u.z}
}

function crossProduct(u, v) {
    var s1 = u.y * v.z - u.z * v.y;
    var s2 = u.z * v.x - u.x * v.z;
    var s3 = u.x * v.y - u.y * v.x;
    return {x: s1, y: s2, z: s3};
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

        // 3. Obtenemos los IDs de los atributos de los vértices en los shaders
        this.vertPos = gl.getAttribLocation(this.prog, 'pos');

        // 4. Obtenemos los IDs de los atributos de los vértices en los shaders
        this.u_swapYZ = gl.getUniformLocation(this.prog, 'swapYZ');

        this.color = gl.getAttribLocation(this.prog, 'clr');

        this.positionBuffer = gl.createBuffer();
        this.color_buffer = gl.createBuffer();

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
    setMesh(vertPos, texCoords, normals) {
        let vertPos2 = new Mesh();

        let triangle1 = new Triangle([-1.0, 0.0, 1.0,
                                             1.0, 0.0, -1.0,
                                            -1.0, 0.0, -1.0]);

        vertPos2 = this.translateTriangle(vertPos2, triangle1,
            0, -0.3, 0);

        let triangle2 = new Triangle([-1.0, 0.0, 1.0,
            1.0, 0.0, -1.0,
            1.0, 0.0, 1.0]);

        let N = 10;
        let triangleBaseLength = 1/N;

        let triangle = new Triangle([-1.0, 0.0, -1.0,
            -1.0, 0.0, -1 + triangleBaseLength,
            -1.0, 0.1, -1.0]);
        vertPos2 = this.translateTriangle(vertPos2, triangle,
            0.01, 0, 0);
        let triangle3 = new Triangle([-1.0, 0.1, -1.0 + triangleBaseLength,
            -1.0, 0.0, -1 + triangleBaseLength,
            -1.0, 0.1, -1.0]);
        vertPos2 = this.translateTriangle(vertPos2, triangle3,
            0.01, 0, 0);

        for (let i = 0; i < 2 * N - 1; i++) {
            triangle = triangle.transZ(triangleBaseLength);
            vertPos2 = this.translateTriangle(vertPos2, triangle,
                WALL_WIDTH, 0, 0);
            triangle3 = triangle3.transZ(triangleBaseLength);
            vertPos2 = this.translateTriangle(vertPos2, triangle3,
                WALL_WIDTH, 0, 0);
        }

        vertPos2 = this.translateTriangle(vertPos2, triangle2,
            0, -0.3, 0);

        this.numVertex = vertPos2.numVertex;
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

        gl.bindBuffer(
            gl.ARRAY_BUFFER,
            this.color_buffer);

        gl.bufferData(
            gl.ARRAY_BUFFER,
            new Float32Array(colors),
            gl.STATIC_DRAW);

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


        gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
        gl.vertexAttribPointer(this.vertPos, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(this.vertPos);

        // Link atributo color
        gl.bindBuffer(gl.ARRAY_BUFFER, this.color_buffer);
        gl.vertexAttribPointer(this.color, 4, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(this.color);


        // Dibujamos
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.useProgram(this.prog);
        gl.drawArrays(gl.TRIANGLES, 0, this.numVertex);
    }

    // Esta función se llama para setear una textura sobre la malla
    // El argumento es un componente <img> de html que contiene la textura.
    setTexture(img) {
        // Pueden setear la textura utilizando esta función:
    }

    // Esta función se llama cada vez que el usuario cambia el estado del checkbox 'Mostrar textura'
    // El argumento es un boleano que indica si el checkbox está tildado
    showTexture(show) {
        this.show = show;
        // Setear variables uniformes en el fragment shader
    }

    setLightDir(x, y, z) {
    }

    // Este método se llama al actualizar el brillo del material
    setShininess(shininess) {
        // [COMPLETAR] Setear variables uniformes en el fragment shader para especificar el brillo.
    }

    translateTriangle(mesh, triangle, x, y, z) {
        let translatedTriangle = triangle.transX(x).transY(y).transZ(z);

        mesh.addTriangle(triangle);
        mesh.addTriangle(translatedTriangle);

        mesh.fillTwoTriangles(triangle, translatedTriangle);
        return mesh;
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
	
	attribute vec4 clr;
    varying vec4 vcolor;
    
	void main()
	{
	    vec3 drawPos = pos;
	    if (swapYZ == 1) {
            drawPos = vec3(pos[0],pos[2],pos[1]);
        }
        gl_Position = mvp * vec4(drawPos, 1.0);
        vcolor = clr;
	}
`;

// Otras aclaraciones:
//
//      * Utilizaremos una sola fuente de luz direccional en toda la escena
//      * La intensidad I para el modelo de iluminación debe ser seteada como blanca (1.0,1.0,1.0,1.0) en RGB
//      * Es opcional incorporar la componente ambiental (Ka) del modelo de iluminación
//      * Los coeficientes Kd y Ks correspondientes a las componentes difusa y especular del modelo
//        deben ser seteados con el color blanco. En caso de que se active el uso de texturas, la
//        componente difusa (Kd) será reemplazada por el valor de textura.
var meshFS = `
	precision mediump float;
	varying vec4 vcolor;
	void main()
	{		        
        gl_FragColor = vcolor;
	}
`
