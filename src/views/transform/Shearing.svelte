<script>
    import { GUI } from "dat.gui";
    import { onMount } from "svelte";
    import { getWebGL, initArrayBuffer, getColors } from "~/utils/webgl";
    import { flatten, mult, normalize } from "~/utils/mv";
    import { createSheringMatrix, createRotateMatrix } from "~/math/transform";
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
    let plane = "",
        s = 0,
        t = 0;

    function draw() {
        // 生成旋转矩阵
        let rotateMatrix = createRotateMatrix(normalize([1, 1, 1]), 15);
        let shearingMatrix = createSheringMatrix(plane, s, t);

        let martrix = mult(rotateMatrix, shearingMatrix);

        let matrixLoc = gl.getUniformLocation(gl.program, "matrix");
        gl.uniformMatrix4fv(matrixLoc, false, flatten(martrix));

        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        gl.drawArrays(gl.TRIANGLES, 0, 36);
    }

    function render() {
        s = controls.s;
        t = controls.t;
        draw();
        requestAnimationFrame(render);
    }

    function setControlGui() {
        class Control {
            constructor() {
                this.s = 0;
                this.t = 0;
                this.xy = false;
                this.xz = false;
                this.yz = false;
            }
        }
        controls = new Control();

        let gui = new GUI();
        let xyc = gui.add(controls, "xy");
        let xzc = gui.add(controls, "xz");
        let yzc = gui.add(controls, "yz");
        let sc = gui.add(controls, "s", -1, 1, 0.01);
        let tc = gui.add(controls, "t", -1, 1, 0.01);

        let change = (e, p) => {
            if (!e) return;
            plane = e ? p : "";
            sc.setValue(0);
            tc.setValue(0);
            switch (p) {
                case "xy":
                    xzc.setValue(false);
                    yzc.setValue(false);
                    break;
                case "xz":
                    xyc.setValue(false);
                    yzc.setValue(false);
                    break;
                case "yz":
                    xyc.setValue(false);
                    xzc.setValue(false);
                    break;
            }
        };
        xyc.onChange((e) => change(e, "xy"));
        xzc.onChange((e) => change(e, "xz"));
        yzc.onChange((e) => change(e, "yz"));
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
