import Line from './Line'

class Axis {
    origin = [0, 0]
    color = 'gray'
    constructor(origin = [0, 0], color = 'gray') {
        this.origin = origin
        this.color = color
    }
    draw(ctx, gap = 4) {
        let { width, height } = document.querySelector('canvas')
        let [x, y] = this.origin
        // x轴
        let xAxis = new Line([0, y - 0.5], [width, y - 0.5], 0.5, this.color)
        xAxis.draw(ctx)
        for (let i = 0; i <= width; i += 20) {
            let line = new Line([i - 0.5, y - gap], [i - 0.5, y], 0.5, this.color)
            line.draw(ctx)
        }
        // y轴
        let yAxis = new Line([x - 0.5, 0], [x - 0.5, height], 0.5, this.color)
        yAxis.draw(ctx)
        for (let i = 0; i <= height; i += 20) {
            let line = new Line([x, i - 0.5], [x + gap, i - 0.5], 0.5, this.color)
            line.draw(ctx)
        }
    }
}

export default Axis
