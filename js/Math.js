
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

function Norm(u) {
    let norm = Math.sqrt(u.x * u.x + u.y * u.y + u.z * u.z);
    let l = {x: u.x / norm, y: u.y / norm, z: u.z / norm};
    return l;
}

function proj(u, v) {
    let num = u.x * v.x + u.y * v.y + u.z * v.z;
    let den = u.x * u.x + u.y * u.y + u.z * u.z;
    let c = num / den;
    return {x: c * u.x, y: c * u.y, z: c * u.z}
}

function crossProduct(u, v) {
    let s1 = u.y * v.z - u.z * v.y;
    let s2 = u.z * v.x - u.x * v.z;
    let s3 = u.x * v.y - u.y * v.x;
    return {x: s1, y: s2, z: s3};
}

