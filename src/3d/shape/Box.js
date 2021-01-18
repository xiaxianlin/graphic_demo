import Shape from './Shape'
import { initArrayBuffer, initElementArrayBuffer } from '~/utils/webgl'
import { normalize, flatten } from '~/utils/mv'
class Box extends Shape {
    width = 0
    height = 0
    depth = 0

    constructor([width, height, depth]) {
        super()
        this.width = width
        this.height = height
        this.depth = depth
        this.init()
    }

    init() {
        let x = this.width,
            y = this.height,
            z = this.depth
        this.verties = [
            // 前面
            [-x, y, -z], // 左上角
            [-x, -y, -z], // 左下角
            [x, -y, -z], // 右下角
            [x, y, -z], // 右上角
            // 后面
            [-x, y, z], // 左上角
            [-x, -y, z], // 左下角
            [x, -y, z], // 右下角
            [x, y, z], // 右上角
        ]
        this.indices = [
            // 前面
            [0, 1, 2],
            [0, 3, 2],
            // 右面
            [2, 3, 7],
            [2, 6, 7],
            // 后面
            [7, 4, 5],
            [7, 6, 5],
            // 下面
            [5, 6, 2],
            [5, 1, 2],
            // 左面
            [2, 5, 4],
            [2, 0, 4],
            // 上面
            [4, 0, 3],
            [4, 7, 3],
        ]

        // this.indices = [
        //     // 前面
        //     ...this.createMeshIndices(0, 1, 2, 3),
        //     // 后面
        //     ...this.createMeshIndices(4, 5, 6, 7),
        //     // 上面
        //     ...this.createMeshIndices(0, 3, 7, 4),
        //     // 下面
        //     ...this.createMeshIndices(1, 2, 6, 5),
        //     // 左面
        //     ...this.createMeshIndices(0, 1, 5, 4),
        //     // 右面
        //     ...this.createMeshIndices(2, 3, 7, 6),
        // ]
    }

    createMeshIndices(v1, v2, v3, v4) {
        return [
            [v1, v2],
            [v2, v3],
            [v3, v4],
            [v4, v1],
            [v1, v3],
            [v2, v4],
        ]
    }
}

export default Box
