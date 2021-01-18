import { vec4 } from '~/utils/mv'

const points = [
    vec4(-0.5, -0.5, 0.5, 1.0),
    vec4(-0.5, 0.5, 0.5, 1.0),
    vec4(0.5, 0.5, 0.5, 1.0),
    vec4(0.5, -0.5, 0.5, 1.0),
    vec4(-0.5, -0.5, -0.5, 1.0),
    vec4(-0.5, 0.5, -0.5, 1.0),
    vec4(0.5, 0.5, -0.5, 1.0),
    vec4(0.5, -0.5, -0.5, 1.0)
]

const vertices = []

function quad(a, b, c, d) {
    let indices = [a, b, c, a, c, d]
    for (let i = 0; i < 6; ++i) {
        vertices.push(points[indices[i]])
    }
}

export default function cube() {
    quad(1, 0, 3, 2) // 前面
    quad(2, 3, 7, 6) // 左面
    quad(3, 0, 4, 7) // 下面
    quad(6, 5, 1, 2) // 上面
    quad(4, 5, 6, 7) // 后面
    quad(5, 4, 0, 1) // 右面
    return vertices
}
