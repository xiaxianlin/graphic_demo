<script>
    import { GUI } from "dat.gui";
    import { onMount } from "svelte";
    import { getWebGL, initArrayBuffer, getColors } from "~/utils/webgl";
    import { flatten, normalize, isZeroVec } from "~/utils/mv";
    import { createRotateMatrix } from "~/math/transform";
    import Cube from "~/dataset/cube";

    const VERTEX_SHADER = `
attribute vec4 a_Position;
attribute vec4 a_Color;

uniform mat4 rotateMatrix;

varying vec4 v_Color;

void main(){
    v_Color = a_Color;
    gl_Position = a_Position * rotateMatrix;
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
    let theta = 0;
    let rotateAxis = [0, 0, 0];

    function draw() {
        // 归一化旋转轴
        let n = isZeroVec(rotateAxis) ? rotateAxis : normalize(rotateAxis);
        // 生成旋转矩阵
        let rotateMatrix = createRotateMatrix(n, theta);

        let matrixLoc = gl.getUniformLocation(gl.program, "rotateMatrix");
        gl.uniformMatrix4fv(matrixLoc, false, flatten(rotateMatrix));

        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        gl.drawArrays(gl.TRIANGLES, 0, 36);
    }

    function render() {
        theta += controls.rotateSpeed;
        rotateAxis[0] = controls.x;
        rotateAxis[1] = controls.y;
        rotateAxis[2] = controls.z;
        draw();
        requestAnimationFrame(render);
    }

    function setControlGui() {
        class Control {
            constructor() {
                this.rotateSpeed = 0.2;
                this.x = 1;
                this.y = 1;
                this.z = 1;
            }
        }
        controls = new Control();

        let gui = new GUI();
        gui.add(controls, "rotateSpeed", 0, 1);
        gui.add(controls, "x", 0, 1);
        gui.add(controls, "y", 0, 1);
        gui.add(controls, "z", 0, 1);
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
                // colors.push(getColors(i));
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
