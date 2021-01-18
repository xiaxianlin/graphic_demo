<script>
    import { onMount } from 'svelte'
    import { toCartesion } from '~/math/polar'
    import { radians } from '~/utils/mv'
    import Axis from '~/2d/Axis'

    let ctx = null

    let core = [450, 300]

    let axis = new Axis(core)

    function drawCurve(start, end, r, width, step, color, rotate) {
        let line1 = [],
            line2 = []

        for (let i = start; i <= end; i++) {
            r += step
            let [x1, y1] = toCartesion(r - width / 2, radians(i + rotate))
            line1.push([core[0] + x1, core[1] - y1])
            let [x2, y2] = toCartesion(r + width / 2, radians(i + rotate))
            line2.push([core[0] + x2, core[1] - y2])
        }

        line2.reverse()

        let points = line1.concat(line2)

        ctx.lineWidth = 1
        ctx.strokeStyle = 'red'
        ctx.beginPath()
        ctx.moveTo(points[0][0], points[0][1])
        for (let index = 1; index < points.length; index++) {
            ctx.lineTo(points[index][0], points[index][1])
        }
        ctx.closePath()
        ctx.fillStyle = color
        ctx.fill()
    }

    onMount(() => {
        let canvas = document.querySelector('canvas')
        ctx = canvas.getContext('2d')
        axis.draw(ctx)

        let width = 26,
            step = 0.3,
            rotate = 90

        drawCurve(0, 360, 50, width, step, 'orange', rotate)
        drawCurve(0, 320, 80, width, step, 'lightgreen', rotate)
        drawCurve(0, 280, 110, width, step, 'lightblue', rotate)
    })
</script>

<style>
    .container {
        background: #fff;
        width: 900px;
        margin-left: -450px;
        margin-top: -300px;
        position: absolute;
        top: 50%;
        left: 50%;
    }
</style>

<div class="container"><canvas width="900" height="600" /></div>
