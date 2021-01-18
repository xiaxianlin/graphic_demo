const { PI, floor, abs, sin, cos, sqrt, asin, atan2 } = Math
const TWOPI = 2 * PI
const PIOVERTWO = PI / 2
export function normal(r, h, p) {
    if (r === 0) {
        h = p = 0
    } else {
        // 处理反向
        if (r < 0) {
            r = -r
            h += PI
            p = -p
        }
        // 俯仰角是否超出范围
        if (abs(p) > PIOVERTWO) {
            // 按90°弥补
            p += PIOVERTWO
            // 包含在范围0~TWOPI
            p -= floor(p / TWOPI) * TWOPI
            // 是否超出范围
            if (p > PI) {
                // 翻转航向
                h += PI
                // 撤销弥补并设置pitch = 180 - pitch
                p = (3 * PI) / 2 - p
            } else {
                // 撤销弥补，将俯仰角切换在-90°~+90°范围
                p -= PIOVERTWO
            }
        }
        // 是否为万向节死锁
        if (abs(p) >= PIOVERTWO * 0.9999) {
            h = 0
        } else {
            // 包含航向
            if (abs(h) > PI) {
                // 按180°弥补
                h += PI
                // 包含在范围0~TWOPI
                h -= floor(h / TWOPI) * TWOPI
                // 撤销弥补，将航向切换在-1800°~+180°范围
                h -= PI
            }
        }
    }
}

export function fromCartesian(x, y, z) {
    let r = sqrt(x * x + y * y + z * z)
    let h = 0,
        p = 0

    if (r > 0) {
        p = asin(-y / r)
        if (abs(p) >= PIOVERTWO * 0.9999) {
            h = 0
        } else {
            h = atan2(x, z)
        }
    }
    return [r, h, p]
}

export function toCartesion(r, h, p) {
    let x = r * cos(p) * sin(h)
    let y = -r * sin(p)
    let z = r * cos(p) * cos(h)
    return [x, y, z]
}

const Spherical = { normal, fromCartesian, toCartesion }
export default Spherical
