let labyrinthDrawer;         // clase para contener el comportamiento de la malla
let floorDrawer;
let ceilingDrawer;
let gemsDrawer;
let canvas, gl;         // canvas y contexto WebGL
let perspectiveMatrix;	// matriz de perspectiva
let buttonsPressed;
let labyrinthMovement;
let gemsManager;

let numberOfXSquares;
let numberOfZSquares;

let grid;

let start_id;
let end_id;
let rotX = 0, rotY = 0, rotZ = 0, transX = 0, transY = 0, transZ = 3, autorot = 0, cameraRotationXY = 0;
let movementSpeed = 10;
let FAR_CLIPPING_PLANE;
let CAMERA_HEIGHT = -0.05;
let TOTAL_X_LENGTH = 2;
let TOTAL_Z_LENGTH = 2;

let WALLS_URL_SMALL = "https://i.imgur.com/nKQZ60l.jpg";
let FLOOR_URL_SMALL = "https://i.imgur.com/xChDZVr.png";
let CEILING_URL_SMALL = "https://i.imgur.com/ghE9cGA.png";

let score = 0;

window.onload = function () {
    InitWebGL();

    FAR_CLIPPING_PLANE = Math.floor(Math.sqrt(TOTAL_X_LENGTH ^ 2 + TOTAL_Z_LENGTH ^ 2)) + 1

    //Configure controls
    buttonsPressed = {};
    SetUpCanvasZoom();
    SetUpOnMouseWheel();
    SetUpOnMouseDown();
    SetUpOnMouseUp();
    SetUpOnKeyUp();

    LoadTextureWalls();
    LoadTextureFloor();
    LoadTextureCeiling();
    GenerateLabyrinth();
    AddGems();
    CreateMinimap();
    UpdateCanvasSize();
    DrawScene();
};

function InitWebGL() {
    // Inicializamos el canvas WebGL
    canvas = document.getElementById("canvas");
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
    labyrinthDrawer = new LabyrinthDrawer();
    ceilingDrawer = new CeilingDrawer();
    floorDrawer = new FloorDrawer();
    gemsDrawer = new GemsDrawer();
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
    CreatePerspectiveMatrix();
}

// Devuelve la matriz de perspectiva (column-major)
function CreatePerspectiveMatrix() {

    let fov_angle = 60;
    let r = canvas.width / canvas.height;
    let n = 0.001;
    let f = FAR_CLIPPING_PLANE;
    let fov = Math.PI * fov_angle / 180;
    let s = 1 / Math.tan(fov / 2);

    perspectiveMatrix = [
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
    labyrinthDrawer.draw(mvp);
    ceilingDrawer.draw(mvp);
    floorDrawer.draw(mvp);
    gemsDrawer.draw(mvp, gemsManager.getGemsIndexes());

    configureUIScoreText();

    updateScore();
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

// Evento resize
function WindowResize() {
    UpdateCanvasSize();
    DrawScene();
}

function GenerateLabyrinth() {
    let labyrinthSize = parseInt(document.getElementById("labyrinth-size").value);
    let labyrinthGenerator = new LabyrinthGenerator(labyrinthSize, labyrinthSize);

    //draw in right side bar
    grid = document.getElementsByClassName("grid").item(0);

    let labyrinth = labyrinthGenerator.wilsonAlgorithm();

    numberOfXSquares = labyrinthSize;
    numberOfZSquares = labyrinthSize;
    labyrinthDrawer.setAbstractLabyrinth(labyrinth);
    labyrinthDrawer.setMesh([], [], []);


    labyrinthMovement = new LabyrinthMovement(labyrinth);

    start_id = labyrinthMovement.getStartId();
    end_id = labyrinthMovement.getEndId();

    [transX, transZ] = labyrinthMovement.calculateCenterCoordinates(start_id);
    transY = CAMERA_HEIGHT;
}

function CreateMinimap() {
    let labyrinth = labyrinthMovement.labyrinth;

    grid.innerHTML = '';
    grid.style.gridTemplateColumns = `repeat(${numberOfXSquares}, 10px)`;
    grid.style.gridTemplateRows = `repeat(${numberOfZSquares}, 10px)`;

    for (let zIndex = 0; zIndex < numberOfZSquares; zIndex++) {
        for (let xIndex = 0; xIndex < numberOfXSquares; xIndex++) {
            let node = labyrinth.nodes[zIndex][xIndex];
            let currentSquare = node.id;

            let cell = document.createElement("div");
            cell.setAttribute("class", "cell");
            cell.setAttribute("id", "cell-" + currentSquare);

            let topSquare = labyrinth.getIdOfMovingOneStepInNorthDirection(currentSquare);
            let bottomSquare = labyrinth.getIdOfMovingOneStepInSouthDirection(currentSquare);
            let leftSquare = labyrinth.getIdOfMovingOneStepInWestDirection(currentSquare);
            let rightSquare = labyrinth.getIdOfMovingOneStepInEastDirection(currentSquare);

            let isOnTopBorder = labyrinth.isOnTopBorder(zIndex);
            let isOnBottomBorder =  labyrinth.isOnBottomBorder(zIndex);
            let isOnLeftBorder =  labyrinth.isOnLeftBorder(xIndex);
            let isOnRightBorder =  labyrinth.isOnRightBorder(xIndex);

            if (!isOnTopBorder && node.neighbors.includes(topSquare))
                cell.style.borderTop = "hidden";
            if (!isOnBottomBorder && node.neighbors.includes(bottomSquare))
                cell.style.borderBottom = "hidden";
            if (!isOnLeftBorder && node.neighbors.includes(leftSquare))
                cell.style.borderLeft = "hidden";
            if (!isOnRightBorder && node.neighbors.includes(rightSquare))
                cell.style.borderRight = "hidden";
            if (gemsManager.hasGem(currentSquare)) {
                cell.style.backgroundImage = "radial-gradient(circle closest-side, red 0%, red 50%, transparent 50%, transparent 100%)";
                cell.style.backgroundPosition = "center center";
            }
            grid.appendChild(cell)
        }
    }
}

function updateMinimap(id) {

    let cell = document.getElementById("cell-" + id);

    if (!gemsManager.hasGem(id)) {
        cell.style.backgroundImage = "";
    }
}

function updateScore() {
    document.getElementById("score-number").innerText = score;
}

function configureUIScoreText() {
    let scoreDiv = document.getElementById("score-ui");
    scoreDiv.style.position = "absolute";
    scoreDiv.style.zIndex = "1";
    scoreDiv.style.right = "3%";
    scoreDiv.style.top = "3%"
    scoreDiv.style.color = "black";
    scoreDiv.style.fontWeight = "900";
    scoreDiv.style.fontSize = "larger";
}

function AddGems() {
    gemsManager = new GemManager(numberOfXSquares, numberOfZSquares);
    gemsManager.generateGems(Proportion.Large);
}


function SetUpCanvasZoom() {
    canvas.zoom = function (s) {
        transZ *= s / canvas.height + 1;
        CreatePerspectiveMatrix();
        DrawScene();
    }
}

function SetUpOnMouseWheel() {
    canvas.onwheel = function () {
        canvas.zoom(0.3 * event.deltaY);
    }
}

function SetUpOnMouseDown() {
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
                CreatePerspectiveMatrix();
                DrawScene();
            }
        }
    }
}

function SetUpOnMouseUp() {
    canvas.onmouseup = canvas.onmouseleave = function () {
        canvas.onmousemove = null;
    }
}

function SetUpOnKeyUp() {
    canvas.onkeyup = canvas.onkeydown = function () {

        buttonsPressed[event.key] = event.type !== 'keyup';

        if (event.type === 'keyup') return;
        if (buttonsPressed['w'] === true) {
            moveZ(-movementSpeed / canvas.height);
        } else if (buttonsPressed['s'] === true) {
            moveZ(movementSpeed / canvas.height);
        }
        if (buttonsPressed['a'] === true) {
            moveX(movementSpeed / canvas.height);
        }
        if (buttonsPressed['d'] === true) {
            moveX(-movementSpeed / canvas.height);
        }
        if (buttonsPressed['q'] === true) {
            moveY(movementSpeed / canvas.height);
        }
        if (buttonsPressed['e'] === true) {
            moveY(-movementSpeed / canvas.height);
        }
        if (event.code === 'ArrowRight') {
            cameraRotationXY -= Math.PI / 32;
            DrawScene();
        }
        if (event.code === 'ArrowLeft') {
            cameraRotationXY += Math.PI / 32;
            DrawScene();
        }
    }
}