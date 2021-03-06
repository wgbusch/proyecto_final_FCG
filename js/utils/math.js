
function GetModelViewMatrix(translationX, translationY, translationZ,
                            rotationX, rotationY, rotationZ, cameraRotationXY) {

    const cosRotationX = Math.cos(rotationX);
    const sinRotationX = Math.sin(rotationX);

    const cosRotationY = Math.cos(rotationY);
    const sinRotationY = Math.sin(rotationY);

    const cosRotationZ = Math.cos(rotationZ);
    const sinRotationZ = Math.sin(rotationZ);

    let rotationMatrixX = [
        1, 0, 0, 0,
        0, cosRotationX, sinRotationX, 0,
        0, -sinRotationX, cosRotationX, 0,
        0, 0, 0, 1
    ]

    let rotationMatrixY = [
        cosRotationY, 0, -sinRotationY, 0,
        0, 1, 0, 0,
        sinRotationY, 0, cosRotationY, 0,
        0, 0, 0, 1
    ]

    let rotationMatrixZ = [
        cosRotationZ, sinRotationZ, 0, 0,
        -sinRotationZ, cosRotationZ, 0, 0,
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
// Los argumentos y el resultado son arreglos que representan matrices en orden column-major
function MatrixMult(A, B) {
    let C = [];
    for (let i = 0; i < 4; ++i) {
        for (let j = 0; j < 4; ++j) {
            let v = 0;
            for (let k = 0; k < 4; ++k) {
                v += A[j + 4 * k] * B[k + 4 * i];
            }

            C.push(v);
        }
    }
    return C;
}

function Normalize(u) {
    let norm = Math.sqrt(dot(u, u));
    return new Vertex([u.x / norm, u.y / norm, u.z / norm]);
}

function proj(u, v) {
    let num = dot(u, v);
    let den = dot(u, u);
    let c = num / den;
    return new Vertex([c * u.x, c * u.y, c * u.z]);
}

function crossProduct(u, v) {
    let s1 = u.y * v.z - u.z * v.y;
    let s2 = u.z * v.x - u.x * v.z;
    let s3 = u.x * v.y - u.y * v.x;
    return new Vertex([s1, s2, s3]);
}

function dot(u, v) {
    return u.x * v.x + u.y * v.y + u.z * v.z;
}

function sum(u, v) {
    return new Vertex([u.x + v.x, u.y + v.y, u.z + v.z]);
}

function minus(u, v) {
    return new Vertex([u.x - v.x, u.y - v.y, u.z - v.z]);
}