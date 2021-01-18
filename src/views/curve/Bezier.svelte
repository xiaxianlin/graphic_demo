<script>
    import { onDestroy, onMount } from 'svelte'
    import { GUI } from 'dat.gui'
    import { getCanvasAxis } from '~/utils/canvas'
    import Axis from '~/2d/Axis'
    import Point from '~/2d/Point'
    import { deCasteljau2, deCasteljauData2 } from '~/math/curve'
    import { createMotionFrame } from '~/utils/webgl'

    const colors = ['purple', 'green', 'blue', 'pink', 'coral', 'gold', 'indianred', 'maroon']

    let ctx = null
    let controls = null
    // 世界坐标系控制点
    let worldControlPoints = []
    // 对象坐标系控制点
    let objectControlPoints = []
    // 曲线点
    let curvePoints = []
    // 动画时长ms
    let time = 3000
    // 进度
    let process = 0

    function linkPoints(points, width, color, toWorld) {
        ctx.strokeStyle = color
        ctx.lineWidth = width
        ctx.beginPath()
        points.forEach(([x, y], index) => {
            if (toWorld) {
                y = 600 - y
            }
            if (index === 0) {
                ctx.moveTo(x, y)
            } else {
                ctx.lineTo(x, y)
            }
        })
        ctx.stroke()
    }

    function drawCurve() {
        process = process > time ? time : process
        let t = process / time
        let data = deCasteljauData2(controls.n, objectControlPoints, t)
        data.forEach((item, index) => {
            item.forEach(([x, y]) => new Point([x, 600 - y], 3, colors[index]).draw(ctx))
            if (item.length > 1) {
                linkPoints(item, 0.5, colors[index], true)
            } else {
                curvePoints.push(item[0])
            }
        })
    }

    function drawControlPoints() {
        // 画点
        worldControlPoints.forEach((p) => new Point(p, 4).draw(ctx))
        // 连线
        linkPoints(worldControlPoints, 0.5, 'tomato')
    }

    function render(gap) {
        ctx.clearRect(0, 0, 900, 600)
        drawControlPoints()

        // 控制点足够后开始曲线动画
        if (objectControlPoints.length === controls.n && process < time + gap) {
            drawCurve()
            process += gap / 3
        }
        linkPoints(curvePoints, 2, 'red', true)
    }

    function reset() {
        process = 0
        worldControlPoints = []
        objectControlPoints = []
        curvePoints = []
        ctx.clearRect(0, 0, 900, 600)
    }

    function handleClick(evt) {
        if (process > 0 && process <= time) {
            return
        }
        let [x, y] = getCanvasAxis(evt)
        // 重置数据
        if (worldControlPoints.length >= controls.n) {
            reset()
        }
        worldControlPoints.push([x, y])
        objectControlPoints.push([x, 600 - y])
    }

    function setControlGui() {
        class Control {
            constructor() {
                this.n = 4
            }
        }
        controls = new Control()

        let gui = new GUI()
        gui.add(controls, 'n', 3, 8, 1).onFinishChange(() => reset())
    }

    onMount(() => {
        let canvas = document.querySelector('canvas')
        ctx = canvas.getContext('2d')
        setControlGui()

        let motion = createMotionFrame((gap) => {
            render(gap)
            requestAnimationFrame(motion)
        })
        motion()
    })
</script>

<style>
    .container {
        background: #fff;
        width: 900px;
        margin-left: -450px;
        margin-top: -300px;
        position: fixed;
        top: 50%;
        left: 50%;
    }
</style>

<div class="container"><canvas width="900" height="600" on:click={handleClick} /></div>
