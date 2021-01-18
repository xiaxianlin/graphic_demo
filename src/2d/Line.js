class Line {
    size = 0.5
    color = 'gray'
    begin = [0, 0]
    end = [0, 0]

    constructor(begin = [0, 0], end = [0, 0], size = 0.5, color = 'gray') {
        this.begin = begin
        this.end = end
        this.size = size
        this.color = color
    }

    draw(ctx) {
        ctx.lineWidth = this.size
        ctx.strokeStyle = this.color
        ctx.beginPath()
        ctx.moveTo(...this.begin)
        ctx.lineTo(...this.end)
        ctx.stroke()
    }
}

export default Line
