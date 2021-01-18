const { sin, cos } = Math

export function mult(u, v) {
    let result = []
    for (let i = 0; i < u.length; ++i) {
        result.push([])
        for (let j = 0; j < v.length; ++j) {
            let sum = 0.0
            for (let k = 0; k < u[i].length; ++k) {
                sum += u[i][k] * v[k][j]
            }
            result[i].push(sum)
        }
    }
    return result
}

export function fromEuler(n) {
    let [h, p, b] = n
    return [
        [cos(h) * cos(b) + sin(h) * sin(p) * sin(b), -cos(h) * sin(b) + sin(h) * sin(p) * cos(b), sin(h) * cos(p)],
        [sin(b) * cos(p), cos(b) * cos(p), -sin(p)],
        [-sin(h) * cos(b) + cos(h) * sin(p) * sin(b), sin(b) * sin(h) + cos(h) * sin(p) * cos(b), cos(h) * cos(p)]
    ]
}

export function fromQuaternion(q) {
    let [w, x, y, z] = q
    return [
        [1 - 2 * y * y - 2 * z * z, 2 * x * y + 2 * w * z, 2 * x * z - 2 * w * y],
        [2 * x * y - 2 * w * z, 1 - 2 * x * x - 2 * z * z, 2 * y * z + 2 * w * x],
        [2 * x * z + 2 * w * y, 2 * y * z - 2 * w * x, 1 - 2 * x * x - 2 * y * y]
    ]
}

const Matrix = { mult, fromEuler, fromQuaternion }
export default Matrix
