<script>
    import { onMount } from 'svelte'
    import { GUI } from 'dat.gui'
    import Axis from '~/2d/Axis'

    let ctx = null
    let controls = null
    let core = [10, 300]
    let time = 0
    let maxTime = 900

    let axis = new Axis(core)

    function setControlGui() {
        class Control {
            constructor() {
                this.k = 5
                this.m = 250
                this.A = 200
            }
        }
        controls = new Control()

        let gui = new GUI()
        gui.add(controls, 'k', 1, 10).onChange(() => render())
        gui.add(controls, 'm', 50, 500).onChange(() => render())
        gui.add(controls, 'A', 100, 300).onChange(() => render())
    }

    function getLen() {
        let { k, m, A } = controls
        let omega = Math.sqrt(k / m)
        let F = (omega / 2) * Math.PI
        // return A * Math.cos(2 * Math.PI * F * time)
        return A * Math.cos(omega * time)
    }

    function render() {
        ctx.clearRect(0, 0, 900, 600)
        axis.draw(ctx, core)

        time = 0

        ctx.lineWidth = 0.5
        ctx.strokeStyle = 'red'
        ctx.beginPath()
        do {
            ctx.lineTo(core[0] + time, core[1] - getLen())
            time += 1
        } while (time < maxTime)
        ctx.stroke()
    }

    onMount(() => {
        setControlGui()
        let canvas = document.querySelector('canvas')
        ctx = canvas.getContext('2d')
        render()
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
