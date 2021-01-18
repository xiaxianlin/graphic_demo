<script>
    import { onMount } from 'svelte'
    import Arrow from '~/views/2d/Arrow.svelte'

    import Helix from '~/views/chats/Helix.svelte'

    import Bezier from '~/views/curve/Bezier.svelte'
    import Circular from '~/views/curve/Circular.svelte'
    import Projectile from '~/views/curve/Projectile.svelte'
    import SecondOrder from '~/views/curve/SecondOrder.svelte'
    import SimpleHarmonic from '~/views/curve/SimpleHarmonic.svelte'
    import ThirdOrder from '~/views/curve/ThirdOrder.svelte'

    import Scale from '~/views/transform/Scale.svelte'
    import Projection from '~/views/transform/Projection.svelte'
    import Reflection from '~/views/transform/Reflection.svelte'
    import Shearing from '~/views/transform/Shearing.svelte'
    import Translate from '~/views/transform/Translate.svelte'
    import MatrixRotate from '~/views/transform/rotate/Matrix.svelte'

    import ProjectileMotion from '~/views/motion/Projectile.svelte'
    import RotateAnimate from '~/views/motion/Rotate.svelte'
    import UniformCircularMotion from '~/views/motion/UniformCircular.svelte'

    let page = '2d_arrow'

    function switchPage(id) {
        return () => {
            if (document.querySelector('.dg .main')) {
                document.querySelector('.dg .main').remove()
            }
            page = id
        }
    }
</script>

<style>
    .app {
        display: flex;
        height: 100%;
    }
    .aside {
        width: 200px;
        padding: 15px;
        background-color: #f8f9fa;
    }
    .content {
        flex-grow: 1;
        position: relative;
    }
    .group {
        margin-bottom: 10px;
    }
    .group header {
        color: #6c757d;
        font-size: 14px;
    }
    .group ul {
        list-style: none;
        padding: 0;
        margin: 0;
    }
    .group ul li {
        padding: 0;
        cursor: pointer;
        font-weight: 500;
        color: #333;
        font-size: 14px;
        padding: 8px;
    }
    .group ul li.selected,
    .group ul li:hover.selected {
        color: #fff;
        background-color: #1890ff;
    }
    .group ul li:hover {
        background-color: bisque;
        color: #000;
    }
</style>

<div class="app">
    <div class="aside">
        <div class="group">
            <header>二维图形</header>
            <ul>
                <li class:selected={page === '2d_arrow'} on:click={switchPage('2d_arrow')}>箭头</li>
            </ul>
        </div>
        <div class="group">
            <header>曲线</header>
            <ul>
                <li class:selected={page === 'curve_bezier'} on:click={switchPage('curve_bezier')}>贝塞尔曲线</li>
                <li class:selected={page === 'curve_circular'} on:click={switchPage('curve_circular')}>圆形曲线</li>
                <li class:selected={page === 'curve_second_order'} on:click={switchPage('curve_second_order')}>二阶曲线</li>
                <li class:selected={page === 'curve_third_order'} on:click={switchPage('curve_third_order')}>三阶曲线</li>
                <li class:selected={page === 'curve_projectile'} on:click={switchPage('curve_projectile')}>抛物线</li>
                <li class:selected={page === 'curve_simple_harmonic'} on:click={switchPage('curve_simple_harmonic')}>简谐曲线</li>
            </ul>
        </div>
        <div class="group">
            <header>图表</header>
            <ul>
                <li class:selected={page === 'chat_helix'} on:click={switchPage('chat_helix')}>螺旋竟速图</li>
            </ul>
        </div>
        <div class="group">
            <header>动画</header>
            <ul>
                <li class:selected={page === 'motion_rotate'} on:click={switchPage('motion_rotate')}>旋转</li>
                <li class:selected={page === 'motion_projectile'} on:click={switchPage('motion_projectile')}>抛物线运动</li>
                <li class:selected={page === 'motion_uniform_circular'} on:click={switchPage('motion_uniform_circular')}>圆周运动</li>
            </ul>
        </div>
        <div class="group">
            <header>过渡</header>
            <ul>
                <li class:selected={page === 'transform_rotate_matrix'} on:click={switchPage('transform_rotate_matrix')}>矩阵旋转</li>
                <li class:selected={page === 'transform_projection'} on:click={switchPage('transform_projection')}>投影</li>
                <li class:selected={page === 'transform_reflection'} on:click={switchPage('transform_reflection')}>反射</li>
                <li class:selected={page === 'transform_scale'} on:click={switchPage('transform_scale')}>缩放</li>
                <li class:selected={page === 'transform_shearing'} on:click={switchPage('transform_shearing')}>错切</li>
                <li class:selected={page === 'transform_translate'} on:click={switchPage('transform_translate')}>平移</li>
            </ul>
        </div>
    </div>

    <div class="content">
        {#if page === '2d_arrow'}
            <Arrow />
        {/if}
        {#if page === 'curve_bezier'}
            <Bezier />
        {/if}
        {#if page === 'curve_circular'}
            <Circular />
        {/if}
        {#if page === 'curve_second_order'}
            <SecondOrder />
        {/if}
        {#if page === 'curve_third_order'}
            <ThirdOrder />
        {/if}
        {#if page === 'curve_projectile'}
            <Projectile />
        {/if}
        {#if page === 'curve_simple_harmonic'}
            <SimpleHarmonic />
        {/if}
        {#if page === 'chat_helix'}
            <Helix />
        {/if}
        {#if page === 'motion_rotate'}
            <RotateAnimate />
        {/if}
        {#if page === 'motion_projectile'}
            <ProjectileMotion />
        {/if}
        {#if page === 'motion_uniform_circular'}
            <UniformCircularMotion />
        {/if}
        {#if page === 'transform_rotate_matrix'}
            <MatrixRotate />
        {/if}
        {#if page === 'transform_projection'}
            <Projection />
        {/if}
        {#if page === 'transform_reflection'}
            <Reflection />
        {/if}
        {#if page === 'transform_scale'}
            <Scale />
        {/if}
        {#if page === 'transform_shearing'}
            <Shearing />
        {/if}
        {#if page === 'transform_translate'}
            <Translate />
        {/if}
    </div>
</div>
