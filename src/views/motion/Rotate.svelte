<script>
    import { onMount } from 'svelte'
    import Rect from '~/2d/Rect'
    import Point from '~/2d/Point'
    import Axis from '~/2d/Axis'

    let ctx = null
    let core = [450, 300]
    let center = [250, 250]
    let rect = new Rect(center, 100, 80)

    onMount(() => {
        let canvas = document.querySelector('canvas')
        ctx = canvas.getContext('2d')
        let draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height)
            let point = new Point(core, 4)
            point.draw(ctx)

            let axis = new Axis(core)
            axis.draw(ctx)

            rect.draw(ctx)

            // rect.setCenter([275, 275])
            rect.rotate(1)

            rect.rotateWith(0.5, core)

            requestAnimationFrame(draw)
        }
        draw()
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
