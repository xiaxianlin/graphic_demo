import { mat4, radians, isZeroVec } from '~/utils/mv'
const { sin, cos } = Math

export function createTranslateMatrix(n) {
    let [dx, dy, dz] = n
    return mat4(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, dx, dy, dz, 1)
}

export function createRotateMatrix(n, theta) {
    let r = radians(theta)
    let [x, y, z] = n
    if (isZeroVec(n)) {
        return mat4()
    }
    let ct = cos(r),
        rct = 1 - ct,
        st = sin(r)
    return mat4(
        // x轴
        x * x * rct + ct,
        x * y * rct + z * st,
        x * z * rct - y * st,
        0,
        // y轴
        x * y * rct - z * st,
        y * y * rct + ct,
        y * z * rct + x * st,
        0,
        // z轴
        x * z * rct + y * st,
        y * z * rct - x * st,
        z * z * rct + ct,
        0,
        // 齐次
        0,
        0,
        0,
        1
    )
}

export function createScaleMatrix(k, n) {
    if (!n) {
        return mat4(k, 0, 0, 0, 0, k, 0, 0, 0, 0, k, 0, 0, 0, 0, 1)
    }
    let [x, y, z] = n
    if (isZeroVec(n)) {
        return mat4()
    }
    let mk = k - 1
    return mat4(
        // x
        1 + mk * x * x,
        mk * x * y,
        mk * x * z,
        0,
        // y
        mk * x * y,
        1 + mk * y * y,
        mk * y * z,
        0,
        // z
        mk * x * z,
        mk * y * z,
        1 + mk * z * z,
        0,
        // 齐次
        0,
        0,
        0,
        1
    )
    //
}

export function createSheringMatrix(plane, s = 0, t = 0) {
    switch (plane) {
        case 'xy':
            return mat4(1, 0, 0, 0, 0, 1, 0, 0, s, t, 1, 0, 0, 0, 0, 1)
        case 'xz':
            return mat4(1, 0, 0, 0, s, 1, t, 0, 0, 0, 1, 0, 0, 0, 0, 1)
        case 'yz':
            return mat4(1, s, t, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)
        default:
            return mat4()
    }
}

export function createProjectionMatrix(n) {
    return createScaleMatrix(0, n)
}

export function createRelectionMatrix(n) {
    return createScaleMatrix(-1, n)
}

const Transform = {
    createTranslateMatrix,
    createRotateMatrix,
    createScaleMatrix,
    createSheringMatrix,
    createProjectionMatrix,
    createRelectionMatrix
}

export default Transform
