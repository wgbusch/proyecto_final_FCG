let boxDrawer;          // clase para contener el comportamiento de la caja
let meshDrawer;         // clase para contener el comportamiento de la malla
let floorDrawer;
let ceilingDrawer;
let canvas, gl;         // canvas y contexto WebGL
let perspectiveMatrix;	// matriz de perspectiva
let buttonsPressed;
let labyrinthGenerator;
let utsx;

let start_id = 20;
let end_id = 9;
let rotX = 0, rotY = 0, rotZ = 0, transX = 0, transY = 0, transZ = 3, autorot = 0, cameraRotationXY = 0;
let movementSpeed = 100;

//TODO add controls for speed and position of camera.
window.onload = function () {
    showBox = document.getElementById('show-box');
    InitWebGL();

    buttonsPressed = {};

    lightView = new LightView();

    canvas.zoom = function (s) {
        transZ *= s / canvas.height + 1;
        UpdateProjectionMatrix();
        DrawScene();
    }
    canvas.onwheel = function () {
        canvas.zoom(0.3 * event.deltaY);
    }

    canvas.onmousedown = function () {
        let cx = event.clientX;
        let cy = event.clientY;
        if (event.ctrlKey) {
            canvas.onmousemove = function () {
                canvas.zoom(5 * (event.clientY - cy));
                cy = event.clientY;
            }
        } else {
            // Si se mueve el mouse, actualizo las matrices de rotación
            canvas.onmousemove = function () {
                rotY += (cx - event.clientX) / canvas.width * 5;
                rotX += (cy - event.clientY) / canvas.height * 5;

                cx = event.clientX;
                cy = event.clientY;
                UpdateProjectionMatrix();
                DrawScene();
            }
        }
    }

    canvas.onmouseup = canvas.onmouseleave = function () {
        canvas.onmousemove = null;
    }

    canvas.onkeyup = canvas.onkeydown = function () {
        let validKey = false;
        buttonsPressed[event.key] = event.type !== 'keyup';

        if (event.type === 'keyup') return;
        if (buttonsPressed['w'] === true) {
            transZ += -movementSpeed / canvas.height;
            validKey = true;
        } else if (buttonsPressed['s'] === true) {
            transZ += movementSpeed / canvas.height;
            validKey = true;
        }
        if (buttonsPressed['a'] === true) {
            transX += movementSpeed / canvas.height;
            validKey = true;
        }
        if (buttonsPressed['d'] === true) {
            transX += -movementSpeed / canvas.height;
            validKey = true;
        }
        if (buttonsPressed['q'] === true) {
            transY += movementSpeed / canvas.height;
            validKey = true;
        }
        if (buttonsPressed['e'] === true) {
            transY += -movementSpeed / canvas.height;
            validKey = true;
        }
        if (event.code === 'ArrowRight') {
            cameraRotationXY -= Math.PI / 32;
            validKey = true;
        }
        if (event.code === 'ArrowLeft') {
            cameraRotationXY += Math.PI / 32;
            validKey = true;
        }
        if (validKey && (event.type === 'keydown')) {
            UpdateProjectionMatrix();
            DrawScene();
        }
    }

    let textureLoaded = document.getElementById('texture')
    LoadTexture(textureLoaded);

    DrawScene();
};

function InitWebGL() {
    // Inicializamos el canvas WebGL
    canvas = document.getElementById("canvas");
    canvasDiv = document.getElementById("canvas-div");
    canvas.oncontextmenu = function () {
        return false;
    };

    gl = canvas.getContext("webgl", {antialias: false, depth: true});
    if (!gl) {
        alert("Imposible inicializar WebGL. Tu navegador quizás no lo soporte.");
        return;
    }

    // Inicializar color clear
    gl.clearColor(0, 0, 0, 0);
    gl.enable(gl.DEPTH_TEST); // habilitar test de profundidad

    // Inicializar los shaders y buffers para renderizar
    boxDrawer = new BoxDrawer();
    meshDrawer = new MeshDrawerSimple();
    ceilingDrawer = new CeilingDrawer();
    //mvp that has error
    // transX = 1.2000000000000015;
    // transY = -0.08959999999999997;
    // transZ = 0.4559999999999461;
    // rotX =rotY =rotZ= 0;
    // cameraRotationXY = -2.0616701789183027;

    // Setear el tamaño del viewport
    UpdateCanvasSize();
}

// Funcion para actualizar el tamaño de la ventana cada vez que se hace resize
function UpdateCanvasSize() {
    // 1. Calculamos el nuevo tamaño del viewport
    canvas.style.width = "100%";
    canvas.style.height = "100%";

    const pixelRatio = window.devicePixelRatio || 1;
    canvas.width = pixelRatio * canvas.clientWidth;
    canvas.height = pixelRatio * canvas.clientHeight;

    const width = (canvas.width / pixelRatio);
    const height = (canvas.height / pixelRatio);

    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';

    // 2. Lo seteamos en el contexto WebGL
    gl.viewport(0, 0, canvas.width, canvas.height);

    // 3. Cambian las matrices de proyección, hay que actualizarlas
    UpdateProjectionMatrix();
}

// Devuelve la matriz de perspectiva (column-major)
function UpdateProjectionMatrix() {
    perspectiveMatrix = ProjectionMatrix(canvas, transZ);
}

// Calcula la matriz de perspectiva (column-major)
function ProjectionMatrix(c, z, fov_angle = 60) {
    const magia_z = 1.74;

    let r = c.width / c.height;
    let n = (z - magia_z);
    const min_n = 0.001;
    if (n < min_n) n = min_n;
    let f = (z + magia_z);
    let fov = Math.PI * fov_angle / 180;
    let s = 1 / Math.tan(fov / 2);

    return [
        s / r, 0, 0, 0,
        0, s, 0, 0,
        0, 0, (n + f) / (f - n), 1,
        0, 0, -2 * n * f / (f - n), 0
    ];
}

// Funcion que reenderiza la escena.
function DrawScene() {
    // 1. Obtenemos las matrices de transformación
    let mv = GetModelViewMatrix(transX, transY, transZ, rotX, autorot + rotY, rotZ, cameraRotationXY);
    let mvp = MatrixMult(perspectiveMatrix, mv);
    // 2. Limpiamos la escena
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // 3. Le pedimos a cada objeto que se dibuje a si mismo
    let nrmTrans = [mv[0], mv[1], mv[2], mv[4], mv[5], mv[6], mv[8], mv[9], mv[10]];

    meshDrawer.draw(mvp, mv, nrmTrans);
    ceilingDrawer.draw(mvp, mv, nrmTrans);
    // floorDrawer.draw(mvp, mv, nrmTrans);

    if (showBox.checked) {
        boxDrawer.draw(mvp);
    }
    document.getElementById("cameraRotationXY").innerText = cameraRotationXY + "";
    document.getElementById("transX").innerText = transX + "";
    document.getElementById("transY").innerText = transY + "";
    document.getElementById("transZ").innerText = transZ + "";
}

// Función que compila los shaders que se le pasan por parámetro (vertex & fragment shaders)
// Recibe los strings de cada shader y retorna un programa
function InitShaderProgram(vsSource, fsSource, wgl = gl) {
    // Función que compila cada shader individualmente
    const vs = CompileShader(wgl.VERTEX_SHADER, vsSource, wgl);
    const fs = CompileShader(wgl.FRAGMENT_SHADER, fsSource, wgl);

    // Crea y linkea el programa
    const prog = wgl.createProgram();
    wgl.attachShader(prog, vs);
    wgl.attachShader(prog, fs);
    wgl.linkProgram(prog);

    if (!wgl.getProgramParameter(prog, wgl.LINK_STATUS)) {
        alert('No se pudo inicializar el programa: ' + wgl.getProgramInfoLog(prog));
        return null;
    }
    return prog;
}

// Función para compilar shaders, recibe el tipo (gl.VERTEX_SHADER o gl.FRAGMENT_SHADER)
// y el código en forma de string. Es llamada por InitShaderProgram()
function CompileShader(type, source, wgl = gl) {
    // Creamos el shader
    const shader = wgl.createShader(type);

    // Lo compilamos
    wgl.shaderSource(shader, source);
    wgl.compileShader(shader);

    // Verificamos si la compilación fue exitosa
    if (!wgl.getShaderParameter(shader, wgl.COMPILE_STATUS)) {
        alert('Ocurrió un error durante la compilación del shader:' + wgl.getShaderInfoLog(shader));
        wgl.deleteShader(shader);
        return null;
    }

    return shader;
}

let showBox;  // boleano para determinar si se debe o no mostrar la caja

// Evento resize
function WindowResize() {
    UpdateCanvasSize();
    DrawScene();
}
