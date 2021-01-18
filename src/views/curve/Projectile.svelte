<script>
    import { onMount } from 'svelte'
    import { GUI } from 'dat.gui'
    import { radians } from '~/utils/mv'
    import Motion from '~/math/motion'
    import Axis from '~/2d/Axis'

    let ctx = null
    let controls = null
    let core = [10, 200]

    let axis = new Axis(core)

    function setControlGui() {
        class Control {
            constructor() {
                this.angle = 45
                this.s = 7
                this.g = -1
            }
        }
        controls = new Control()

        let gui = new GUI()
        let angle = gui.add(controls, 'angle', 0, 90)
        angle.onFinishChange(() => render(controls))

        let s = gui.add(controls, 's', 1, 10, 0.1)
        s.onFinishChange(() => render(controls))

        let g = gui.add(controls, 'g', -10, -1, 0.1)
        g.onFinishChange(() => render(controls))
    }

    function render({ angle, s, g }) {
        ctx.clearRect(0, 0, 900, 600)
        axis.draw(ctx)

        let radius = radians(angle)
        let scale = 10
        let x = 0
        let y = 0
        let t = 0

        ctx.lineWidth = 0.5
        ctx.strokeStyle = 'red'
        ctx.moveTo(x, y)
        ctx.beginPath()
        do {
            let p = Motion.projectile(radius, s, t, g)
            x = p[0]
            y = p[1]
            t += 0.01
            ctx.lineTo(core[0] + x * scale, core[1] - y * scale)
        } while (t < 20)
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
