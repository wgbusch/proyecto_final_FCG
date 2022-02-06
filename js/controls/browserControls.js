function LoadTextureWalls() {
    LoadTexture(WALLS_URL_SMALL, 'texture-img-walls', labyrinthDrawer);
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

function LoadTextureWallsFromFile(param) {
    if (param.files && param.files[0]) {
        let reader = new FileReader();
        reader.onload = function (e) {
            let img = document.getElementById('texture-img-walls');
            img.onload = function () {
                ceilingDrawer.setTexture(img);
                DrawScene();
            }
            img.src = e.target.result;
        };
        reader.readAsDataURL(param.files[0]);
    }
}

function LoadTextureFloorFromFile(param) {
    if (param.files && param.files[0]) {
        let reader = new FileReader();
        reader.onload = function (e) {
            let img = document.getElementById('texture-img-floor');
            img.onload = function () {
                ceilingDrawer.setTexture(img);
                DrawScene();
            }
            img.src = e.target.result;
        };
        reader.readAsDataURL(param.files[0]);
    }
}

function LoadTextureCeilingFromFile(param) {
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

function StartScreensaver() {
    GenerateLabyrinth();
    AddGems();
    CreateMinimap();
    UpdateCanvasSize();
    DrawScene();
}

function StartMovement() {
    FindEscape(labyrinthMovement);
}
