
function LoadTextureWalls() {
    LoadTexture(WALLS_URL_SMALL, 'texture-img-walls', meshDrawer);
}

function LoadTextureFloor() {
    LoadTexture(FLOOR_URL_SMALL, 'texture-img-floor', floorDrawer);
}

function LoadTextureCeiling() {
    LoadTexture(CEILING_URL_SMALL, 'texture-img-ceiling', ceilingDrawer);
}

function LoadTexture(url, id, drawer) {
    let img = document.getElementById(id);
    img.onload = () => {
        drawer.setTexture(img);
        DrawScene();
    }
    img.crossOrigin = "";
    img.src = url;
}

function SetShininess(param) {
    let exp = param.value;
    let s = Math.pow(10, exp / 25);
    document.getElementById('shininess-value').innerText = s.toFixed(s < 10 ? 2 : 0);
    meshDrawer.setShininess(s);
    DrawScene();
}

function SetTransZ(param) {
    let exp = param.value;
    transZ = Number.parseFloat(exp);
    DrawScene();
}

function SetTransX(param) {
    let exp = param.value;
    transX = Number.parseFloat(exp);
    DrawScene();
}

function MoveForward() {
    getForwardPromise().evaluate();
}

function MoveRight() {
    getRightPromise().evaluate();
}

function MoveLeft() {
    getLeftPromise().evaluate();
}

function MoveBackward() {
    getBackwardPromise().evaluate();
}

function Rotate90DegreesClockwise() {
    get90DegreeClockwiseRotationPromise().evaluate();
}

function Rotate90DegreesCounterClockwise() {
    get90DegreeAntiClockwiseRotationPromise().evaluate();
}


function GenerateLabyrinth() {
    let columns = parseInt(document.getElementById("columns").value);
    let rows = parseInt(document.getElementById("rows").value);
    labyrinthGenerator = new LabyrinthGenerator(rows, columns);

    //draw in right side bar
    let grid = document.getElementsByClassName("grid").item(0);
    grid.innerHTML = '';
    grid.style.gridTemplateColumns = `repeat(${columns}, 10px)`;
    grid.style.gridTemplateRows = `repeat(${rows}, 10px)`;

    let uts = labyrinthGenerator.wilsonAlgorithm();
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < columns; j++) {
            let node = uts.nodes[i][j];
            let id = node.id;

            let cell = document.createElement("div");
            cell.setAttribute("class", "cell");
            cell.setAttribute("id", id + "");

            if (i > 0 && node.neighbors.includes(id - columns))
                cell.style.borderTop = "hidden";
            if (i < rows - 1 && node.neighbors.includes(id + columns))
                cell.style.borderBottom = "hidden";
            if (j > 0 && node.neighbors.includes(id - 1))
                cell.style.borderLeft = "hidden";
            if (j < columns - 1 && node.neighbors.includes(id + 1))
                cell.style.borderRight = "hidden";
            grid.appendChild(cell)
        }
    }
    utsx = uts;
    meshDrawer.setAbstractLabyrinth(uts);
    meshDrawer.setMesh([], [], []);

    start_id = getStartId();
    end_id = getEndId();

    let converter = new Converter(utsx);

    [transX, transZ] = converter.calculateCenterCoordinates(start_id);
    transY = CAMERA_HEIGHT;
}
