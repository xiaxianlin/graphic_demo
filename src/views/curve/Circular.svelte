<script>
    import { onMount } from 'svelte'
    import { GUI } from 'dat.gui'
    import Motion from '~/math/motion'
    import Axis from '~/2d/Axis'

    let ctx = null
    let controls = null
    let core = [450, 300]

    let axis = new Axis(core)

    function setControlGui() {
        class Control {
            constructor() {
                this.radius = 100
            }
        }
        controls = new Control()

        let gui = new GUI()
        let angle = gui.add(controls, 'radius', 50, 250)
        angle.onFinishChange(() => render(controls))
    }

    function render({ radius }) {
        ctx.clearRect(0, 0, 900, 600)
        axis.draw(ctx)

        let t = 0
        let max = 360

        ctx.lineWidth = 0.5
        ctx.strokeStyle = 'red'
        ctx.beginPath()
        do {
            let [x, y] = Motion.circular(radius, 0, (Math.PI * 2) / max, t)
            t += 1
            ctx.lineTo(core[0] + x, core[1] - y)
        } while (t < max)
        ctx.stroke()
    }

    onMount(() => {
        setControlGui()
        let canvas = document.querySelector('canvas')
        ctx = canvas.getContext('2d')
        render(controls)
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
