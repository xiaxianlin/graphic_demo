import { rotate } from '~/math/point'
import { radians, length } from '~/utils/mv'

class Arrow {
    begin = []
    end = []

    size = 0
    color = ''

    constructor(begin = [0, 0], end = [100, 100], size = 6, color = 'orange') {
        this.begin = begin
        this.end = end
        this.size = size
        this.color = color
    }

    getHead() {
        let point = [this.size, 0]
        let v = [this.end[0] - this.begin[0], this.end[1] - this.begin[1]]
        let len = length(v)
        let rate = (len - this.size) / len
        let theta = Math.atan2(this.size, len - this.size)
        v = [v[0] * rate, v[1] * rate]
        return [rotate(v, theta), rotate(v, -theta)]
    }

    draw(ctx, dashed = false) {
        if (dashed) {
            ctx.setLineDash([3, 2])
        }
        ctx.lineWidth = 2
        ctx.strokeStyle = this.color
        ctx.beginPath()
        ctx.moveTo(...this.begin)
        ctx.lineTo(...this.end)
        // 画头部
        let [x, y] = this.begin
        let [left, right] = this.getHead()
        ctx.moveTo(x + left[0], y + left[1])
        ctx.lineTo(...this.end)
        ctx.lineTo(x + right[0], y + right[1])
        ctx.stroke()
    }
}

export default Arrow
