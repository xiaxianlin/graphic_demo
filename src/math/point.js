import { mult } from './matrix'
export function add(point, ...others) {
    return point.map((d, i) => {
        return others.reduce((total, p) => total + p[i], d)
    })
}

export function rotate([x, y], theta) {
    let matrix = [
        [Math.cos(theta), -Math.sin(theta)],
        [Math.sin(theta), Math.cos(theta)]
    ]
    let result = mult([[x, y]], matrix)
    return result[0]
}

const Point = { add, rotate }
export default Point
