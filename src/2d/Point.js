class Point {
    position = [0, 0]
    size = 1
    color = 'orange'

    constructor(position = [0, 0], size = 1, color = 'orange') {
        this.position = position
        this.size = size
        this.color = color
    }

    draw(ctx) {
        let [x, y] = this.position
        ctx.beginPath()
        ctx.fillStyle = this.color
        ctx.arc(x, y, this.size, 0, 2 * Math.PI, false)
        ctx.fill()
        ctx.closePath()
    }
}

export default Point
