<script>
    import { onMount } from 'svelte'
    import { GUI } from 'dat.gui'
    import { radians } from '~/utils/mv'
    import Motion from '~/math/motion'
    import { createMotionFrame } from '~/utils/webgl'
    import Axis from '~/2d/Axis'
    import Point from '~/2d/Point'

    let ctx = null
    let controls = null
    let core = [10, 200]
    let g = -0.98 // 重力加速度
    let time = 0 // 时间
    let maxTime = 60 // 最大时间
    let axis = new Axis(core)

    function setControlGui() {
        class Control {
            constructor() {
                this.angle = 30
                this.s = 25
            }
        }
        controls = new Control()

        let gui = new GUI()
        let angle = gui.add(controls, 'angle', 0, 90)
        angle.onFinishChange(() => render(controls))

        let s = gui.add(controls, 's', 10, 40)
        s.onFinishChange(() => render(controls))
    }

    function renderTrace(angle, s) {
        let t = 0
        ctx.lineWidth = 0.5
        ctx.strokeStyle = 'red'
        ctx.moveTo(core[0], core[1])
        ctx.beginPath()
        do {
            let [x, y] = Motion.projectile(radians(angle), s, t, g)
            t += 1
            ctx.lineTo(core[0] + x, core[1] - y)
        } while (t < maxTime)
        ctx.stroke()
    }

    function render() {
        ctx.clearRect(0, 0, 900, 600)
        axis.draw(ctx)

        let { angle, s } = controls
        renderTrace(angle, s)

        let [x, y] = Motion.projectile(radians(angle), s, time, g)
        if (x >= 900) {
            time = 0
        }
        let point = new Point([core[0] + x, core[1] - y], 10, 'orange')
        point.draw(ctx)
    }

    onMount(() => {
        setControlGui()
        let canvas = document.querySelector('canvas')
        ctx = canvas.getContext('2d')

        let renderFrame = createMotionFrame((gap) => {
            render()
            time += gap / 200
            if (time >= maxTime) {
                time = 0
            }
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
