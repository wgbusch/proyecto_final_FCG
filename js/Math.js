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

function add(u, v) {
    return new Vertex([u.x + v.x, u.y + v.y, u.z + v.z]);
}

function minus(u, v) {
    return new Vertex([u.x - v.x, u.y - v.y, u.z - v.z]);
}

