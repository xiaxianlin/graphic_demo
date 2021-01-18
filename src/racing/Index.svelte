<script>
    import { onMount } from 'svelte'
    import { FRAGMENT_SHADER, VERTEX_SHADER } from '~/racing/shaders'
    import Renderer from '~/3d/Renderer'
    import Scene from '~/3d/Scene'
    import Box from '~/3d/shape/Box'

    onMount(() => {
        let renderer = new Renderer(document.getElementById('container'), VERTEX_SHADER, FRAGMENT_SHADER)
        let scene = new Scene()

        let cube = new Box([300, 100, 600])
        cube.translate.x = 150
        cube.rotate.set(15, 1, 1, 0)

        scene.add(cube)

        renderer.render(scene)
    })
</script>

<style>
    #container {
        position: absolute;
        top: 0;
        bottom: 0;
        right: 0;
        left: 0;
    }
</style>

<div id="container" />
