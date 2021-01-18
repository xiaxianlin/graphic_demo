<script>
    import { onMount } from 'svelte'
    import Axis from '~/2d/Axis'

    let ctx = null

    let core = [450, 500]

    let start = -20,
        end = 20,
        x = 0,
        y = 0,
        step = 0.005,
        cut = 10

    let axis = new Axis(core)

    onMount(() => {
        let canvas = document.querySelector('canvas')
        ctx = canvas.getContext('2d')
        axis.draw(ctx)

        ctx.lineWidth = 0.5
        ctx.strokeStyle = 'red'
        ctx.beginPath()
        for (let i = start; i <= end; i = i + step) {
            x = core[0] + i * cut
            y = core[1] - i * i
            if (i === start) {
                ctx.moveTo(x, y)
            } else {
                ctx.lineTo(x, y)
            }
        }
        ctx.stroke()

        ctx.font = '20px Arial'
        ctx.fillStyle = 'black'
        ctx.fillText(`y = t²`, x - 20, y - 10)
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
