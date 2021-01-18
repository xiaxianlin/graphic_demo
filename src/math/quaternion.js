const { abs, acos, cos, sin, sqrt, atan2 } = Math
export function exp(q, t) {
    let [w, x, y, z] = q
    if (abs(w) < 0.9999) {
        let alpha = acos(w)
        let newAlpha = alpha * t
        let mult = sin(newAlpha) / sin(alpha)
        w = cos(newAlpha)
        x *= mult
        y *= mult
        z *= mult
    }
    return [w, x, y, z]
}
/**
 * 球面线性插值
 * @param {*} q0 四元数1
 * @param {*} q1 四元数1
 * @param {*} t 插值参数
 */
export function slerp(q0, q1, t) {
    let k0, k1
    let w, x, y, z
    let [w0, x0, y0, z0] = q0
    let [w1, x1, y1, z1] = q1

    // 使用点积计算四元数之间的余弦
    let cosOmega = w0 * w1 + x0 * x1 + y0 * y1 + z0 * z1

    // 如果点积为负，则将其中一个取反，以取得最短四维弧
    if (cosOmega < 0.0) {
        w1 = -w1
        x1 = -x1
        y1 = -y1
        z1 = -z1
        cosOmega = -cosOmega
    }

    // 检查他们是否靠得很久
    if (cosOmega > 0.9999) {
        // 如果靠得非常近，则使用线性插值
        k0 = 1.0 - t
        k1 = t
    } else {
        // 计算角度正弦
        let sinOmega = sqrt(1.0 - cosOmega * cosOmega)
        // 计算角度
        let omega = atan2(sinOmega, cosOmega)
        // 计算分母的倒数，只需要除一次
        let oneOverSinOmega = 1.0 / sinOmega

        // 计算插值参数
        k0 = sin((1.0 - t) * omega) * oneOverSinOmega
        k1 = sin(t * omega) * oneOverSinOmega
    }

    // 插值
    w = w0 * k0 + w1 * k1
    x = x0 * k0 + x1 * k1
    y = y0 * k0 + y1 * k1
    z = z0 * k0 + z1 * k1
    return [w, x, y, z]
}

export function fromEuler(n) {
    let [h, p, b] = n
    return [
        cos(h / 2) * cos(p / 2) * cos(b / 2) + sin(h / 2) * sin(p / 2) * sin(b / 2),
        -cos(h / 2) * sin(p / 2) * cos(b / 2) - sin(h / 2) * cos(p / 2) * sin(b / 2),
        cos(h / 2) * sin(p / 2) * sin(b / 2) - sin(h / 2) * cos(p / 2) * cos(b / 2),
        sin(h / 2) * sin(p / 2) * cos(b / 2) - cos(h / 2) * cos(p / 2) * sin(b / 2)
    ]
}

export function fromMatrix(m) {
    let x = 0,
        y = 0,
        z = 0,
        w = 0

    let [m11, m12, m13] = m[0]
    let [m21, m22, m23] = m[1]
    let [m31, m32, m33] = m[2]

    let fourWSquareMinus1 = m11 + m22 + m33
    let fourXSquareMinus1 = m11 - m22 - m33
    let fourYSquareMinus1 = m22 - m11 - m33
    let fourZSquareMinus1 = m33 - m11 - m22

    let biggestIndex = 0
    let fourBiggestSquareMinus1 = fourWSquareMinus1
    if (fourXSquareMinus1 > fourBiggestSquareMinus1) {
        fourBiggestSquareMinus1 = fourXSquareMinus1
        biggestIndex = 1
    }

    if (fourYSquareMinus1 > fourBiggestSquareMinus1) {
        fourBiggestSquareMinus1 = fourYSquareMinus1
        biggestIndex = 2
    }

    if (fourZSquareMinus1 > fourBiggestSquareMinus1) {
        fourBiggestSquareMinus1 = fourZSquareMinus1
        biggestIndex = 3
    }

    let biggestVal = sqrt(fourBiggestSquareMinus1 + 1.0) * 0.5
    let mult = 0.25 / biggestVal

    switch (biggestIndex) {
        case 0:
            w = biggestVal
            x = (m23 - m32) * mult
            y = (m31 - m13) * mult
            z = (m12 - m21) * mult
            break
        case 1:
            x = biggestVal
            w = (m23 - m32) * mult
            y = (m12 + m21) * mult
            z = (m31 + m13) * mult
            break
        case 2:
            y = biggestVal
            w = (m31 - m13) * mult
            x = (m12 + m21) * mult
            z = (m23 + m32) * mult
            break
        case 3:
            z = biggestVal
            w = (m12 - m21) * mult
            x = (m31 + m13) * mult
            y = (m23 + m32) * mult
            break
    }

    return [w, x, y, z]
}
const Quaternion = { exp, slerp, fromEuler, fromMatrix }
export default Quaternion
