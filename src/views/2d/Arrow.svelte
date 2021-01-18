<script>
    import { onMount } from 'svelte'
    import Arrow from '~/2d/Arrow'
    import Axis from '~/2d/Axis'

    let ctx = null

    let core = [450, 300]

    let axis = new Axis(core)

    onMount(() => {
        let canvas = document.querySelector('canvas')
        ctx = canvas.getContext('2d')
        axis.draw(ctx)

        let arrow = new Arrow(core, [core[0] + 100, core[1] - 100], 10)
        arrow.draw(ctx)

        arrow = new Arrow(core, [core[0] + 100, core[1] + 100], 10)
        arrow.draw(ctx)

        arrow = new Arrow(core, [core[0] - 100, core[1] - 100], 10)
        arrow.draw(ctx)

        arrow = new Arrow(core, [core[0] - 100, core[1] + 100], 10)
        arrow.draw(ctx)
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
