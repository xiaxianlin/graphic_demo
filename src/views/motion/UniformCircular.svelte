<script>
    import { onMount } from 'svelte'
    import { GUI } from 'dat.gui'
    import Motion from '~/math/motion'
    import { createMotionFrame } from '~/utils/webgl'
    import Axis from '~/2d/Axis'
    import Point from '~/2d/Point'

    let ctx = null
    let controls = null
    let core = [450, 300]
    let time = 0
    let omega = (Math.PI * 2) / 3600
    let axis = new Axis(core)

    function setControlGui() {
        class Control {
            constructor() {
                this.radius = 100
            }
        }
        controls = new Control()

        let gui = new GUI()
        gui.add(controls, 'radius', 50, 250)
    }

    function renderTrace() {
        ctx.lineWidth = 0.5
        ctx.strokeStyle = 'red'
        ctx.beginPath()
        ctx.arc(core[0], core[1], controls.radius, 0, Math.PI * 2)
        ctx.stroke()
    }

    function render() {
        ctx.clearRect(0, 0, 900, 600)
        axis.draw(ctx)
        renderTrace()
        let [x, y] = Motion.circular(controls.radius, 0, omega, time)

        let point = new Point([core[0] + x, core[1] - y], 20, 'orange')
        point.draw(ctx)
    }

    onMount(() => {
        setControlGui()
        let canvas = document.querySelector('canvas')
        ctx = canvas.getContext('2d')

        let renderFrame = createMotionFrame((gap) => {
            render()
            time += gap
            requestAnimationFrame(renderFrame)
        })

        renderFrame()
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
