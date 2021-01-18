<script>
    import { GUI } from "dat.gui";
    import { onMount } from "svelte";
    import { getWebGL, initArrayBuffer, getColors } from "~/utils/webgl";
    import { flatten, isZeroVec, mult, normalize } from "~/utils/mv";
    import {
        createRelectionMatrix,
        createRotateMatrix,
    } from "~/math/transform";
    import Cube from "~/dataset/cube";

    const VERTEX_SHADER = `
attribute vec4 a_Position;
attribute vec4 a_Color;

uniform mat4 matrix;

varying vec4 v_Color;

void main(){
    v_Color = a_Color;
    gl_Position = a_Position * matrix;
}`;
    const FRAGMENT_SHADER = `
precision mediump float;

varying vec4 v_Color;

void main(){
    gl_FragColor = v_Color;
}`;

    let gl = null;
    let canvas = null;
    let controls = null;
    let colors = [];
    let n = [0, 0, 0];

    function draw() {
        // 生成旋转矩阵
        let rotateMatrix = createRotateMatrix(normalize([1, 1, 1]), 15);
        let reflectionMatrix = createRelectionMatrix(n);

        let martrix = isZeroVec(n)
            ? rotateMatrix
            : mult(rotateMatrix, reflectionMatrix);

        let matrixLoc = gl.getUniformLocation(gl.program, "matrix");
        gl.uniformMatrix4fv(matrixLoc, false, flatten(martrix));

        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        gl.drawArrays(gl.TRIANGLES, 0, 36);
    }

    function render() {
        n[0] = controls.x;
        n[1] = controls.y;
        n[2] = controls.z;
        draw();
        requestAnimationFrame(render);
    }

    function setControlGui() {
        class Control {
            constructor() {
                this.x = 0;
                this.y = 0;
                this.z = 0;
            }
        }
        controls = new Control();

        let gui = new GUI();
        gui.add(controls, "x", -1, 1, 0.01);
        gui.add(controls, "y", -1, 1, 0.01);
        gui.add(controls, "z", -1, 1, 0.01);
    }

    onMount(() => {
        setControlGui();

        canvas = document.querySelector("canvas");
        gl = getWebGL(canvas, VERTEX_SHADER, FRAGMENT_SHADER);

        gl.enable(gl.BLEND);
        gl.blendFunc(gl.ONE_MINUS_SRC_ALPHA, gl.ONE_MINUS_DST_ALPHA);
        gl.clearColor(1, 1, 1, 1);

        for (let i = 1; i < 7; i++) {
            for (let j = 1; j < 7; j++) {
                let color = getColors(i);
                color[3] = 0.9;
                colors.push(color);
            }
        }

        initArrayBuffer(gl, "a_Position", flatten(Cube()), gl.FLOAT, 4);
        initArrayBuffer(gl, "a_Color", flatten(colors), gl.FLOAT, 4);

        render();
    });
</script>

<style>
    .container {
        background: #fff;
        width: 600px;
        margin-left: -300px;
        margin-top: -300px;
        position: absolute;
        top: 50%;
        left: 50%;
    }
</style>

<div class="container"><canvas width="600" height="600" /></div>
