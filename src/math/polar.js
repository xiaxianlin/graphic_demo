const TWOPI = 2 * Math.PI

export function normal(r, theta) {
    if (r === 0.0) {
        theta = 0.0
    } else {
        if (r < 0.0) {
            r = -r
            theta += Math.PI
        }
        if (Math.abs(theta) > Math.PI) {
            // 按PI值弥补
            theta += Math.PI
            // 包含在0~TWOPI之间
            theta -= Math.floor(theta / TWOPI) * TWOPI
            // 撤销弥补，将角度转换回范围-PI~PI
            theta -= Math.PI
        }
    }
    return [r, theta]
}

export function fromCartesian(x, y) {
    if (x === 0 && y === 0) {
        return [0, 0]
    }
    return [Math.sqrt(x * x + y * y), Math.atan2(y, x)]
}

export function toCartesion(r, theta) {
    if (r === 0 && theta === 0) {
        return [0, 0]
    }
    return [r * Math.cos(theta), r * Math.sin(theta)]
}

const Polar = { normal, fromCartesian, toCartesion }
export default Polar
