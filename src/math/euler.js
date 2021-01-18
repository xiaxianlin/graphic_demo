const { floor, abs, PI, atan2, asin } = Math

export function lerp() {}

export function fromMatrix(m) {
    // 以弧度形式计算欧拉角
    let h, p, b
    let [m11, m12, m13] = m[0]
    let [m21, m22, m23] = m[1]
    let [m31, m32, m33] = m[2]

    // 从m23计算pitch，小心asin()的域错误，因为浮点计算，允许一定误差
    let sp = -m23

    if (sp <= -1.0) {
        p = PI / -2
    } else if (sp >= 1.0) {
        p = PI / 2
    } else {
        p = asin(sp)
    }

    // 检查万向锁，允许一些误差
    if (sp > 0.9999) {
        // 从正上或正下看
        // 将bank置零，赋值给heading
        h = atan2(-m31, m11)
        b = 0.0
    } else {
        // 通过m13和m33计算heading
        h = atan2(m13, m33)
        // 通过m21和m22计算bank
        b = atan2(m21, m22)
    }

    return [h, p, b]
}

export function fromQuaternion(q) {
    let h, p, b
    let [w, x, y, z] = q

    let sp = -2.0 * (y * z + w * x)
    if (abs(sp) > 0.9999) {
        p = (PI / 2) * sp
        h = atan2(-x * z - w * y, 0.5 - y * y - z * z)
        b = 0.0
    } else {
        p = asin(sp)
        h = atan2(x * z - w * y, 0.5 - x * x - y * y)
        b = atan2(x * y - w * z, 0.5 - x * x - z * z)
    }

    return [h, p, b]
}

export default { lerp }
