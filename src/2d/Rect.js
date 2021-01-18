import { add, rotate } from '~/math/point'
class Rect {
    borderColor = 'gray'
    borderWidth = 1

    constructor(center, width, height) {
        // 原始中心点
        this.center = center
        // 宽度
        this.width = this.width
        // 高度
        this.height = this.height
        // 顶点
        this.vertices = [
            [width / 2, height / 2],
            [-width / 2, height / 2],
            [-width / 2, -height / 2],
            [width / 2, -height / 2],
        ]
        // 自转角度
        this.radius = 0
        // 公转角度
        this.revolutionRadius = 0
        // 公转核心
        this.revolutionCore = [0, 0]
        this.revolutionCenter = [0, 0]
    }

    getVertices() {
        let center = this.center
        let core = this.revolutionCore
        let rCenter = [center[0] - core[0], center[1] - core[1]]
        let tCenter = rotate(rCenter, this.revolutionRadius)
        center = [tCenter[0] + core[0], tCenter[1] + core[1]]
        this.revolutionCenter = center
        // 计算顶点
        return this.vertices.map((point) => {
            let theta = this.radius
            let [x, y] = rotate(point, this.radius)
            return [center[0] + x, center[1] + y]
        })
    }

    rotate(theta, core) {
        this.radius += theta * (Math.PI / 180)
        if (this.radius >= Math.PI * 2) {
            this.radius = 0
        }
        return this
    }

    rotateWith(theta, core) {
        this.revolutionCore = core
        this.revolutionRadius += theta * (Math.PI / 180)
        if (this.revolutionRadius >= Math.PI * 2) {
            this.revolutionRadius = 0
        }
        return this
    }

    setCenter(center) {
        let [x, y] = center
        let [ox, oy] = this.center
        let offsetX = x - ox,
            offsetY = y - oy
        this.vertices = this.vertices.map((p) => [p[0] - offsetX, p[1] + offsetY])
        this.center = center
    }

    draw(ctx) {
        let points = this.getVertices()
        ctx.strokeStyle = this.borderColor
        ctx.lineWidth = this.borderWidth
        ctx.beginPath()
        ctx.moveTo(...points[0])
        ctx.lineTo(...points[1])
        ctx.lineTo(...points[2])
        ctx.lineTo(...points[3])
        ctx.closePath()
        ctx.stroke()
    }
}

export default Rect
