let timer;
let onlyFloor;
function AutoRotate(param) {
    // Si hay que girar...
    if (param.checked) {
        // Vamos rotando una cantiad constante cada 30 ms
        timer = setInterval(function () {
                                let v = document.getElementById('rotation-speed').value;
                                autorot += 0.0005 * v;
                                if (autorot > 2 * Math.PI) autorot -= 2 * Math.PI;

                                // Reenderizamos
                                DrawScene();
                            }, 30
        );
        document.getElementById('rotation-speed').disabled = false;
    } else {
        clearInterval(timer);
        document.getElementById('rotation-speed').disabled = true;
    }
}

function OnlyFloor(param) {
    onlyFloor = param.checked;
    DrawScene();
}

function LoadTextureCeiling(param) {
    if (param.files && param.files[0]) {
        let reader = new FileReader();
        reader.onload = function (e) {
            let img = document.getElementById('texture-img-ceiling');
            img.onload = function () {
                ceilingDrawer.setTexture(img);
                DrawScene();
            }
            img.src = e.target.result;
        };
        reader.readAsDataURL(param.files[0]);
    }
}

function ShowTexture(param) {
    meshDrawer.showTexture(param.checked);
    DrawScene();
}

function LoadTexture(param) {
    if (param.files && param.files[0]) {
        let reader = new FileReader();
        reader.onload = function (e) {
            let img = document.getElementById('texture-img');
            img.onload = function () {
                meshDrawer.setTexture(img);
                DrawScene();
            }
            img.src = e.target.result;
        };
        reader.readAsDataURL(param.files[0]);
    }
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
    onlyFloor = document.getElementById("only-floor").checked? 1: 0;
    meshDrawer.setMesh([], [], [], onlyFloor);

    start_id = getStartId();
    end_id = getEndId();

    let converter = new Converter(utsx);

    [transX, transZ] = converter.calculateCenterCoordinates(start_id);
    transY = StartingPoint(uts.zLength);

    UpdateCanvasSize();
    DrawScene();
}
