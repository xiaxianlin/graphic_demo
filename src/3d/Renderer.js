import { setupWebgl } from '~/utils/webgl'
import Scene from '~/3d/Scene'

class Renderer {
    gl = null
    refLength = 0

    constructor(container, vShader, fShader) {
        this.gl = setupWebgl(container, vShader, fShader)
        let { width, height } = this.gl.canvas
        this.whRate = width / height
        this.scaleRate = this.whRate / width
    }
    render(scene) {
        if (!(scene instanceof Scene)) {
            throw '渲染场景不合法'
        }
        let { gl, scaleRate } = this
        let { width, height } = gl.canvas
        this.refLength = width > height ? width : height
        if (width > height) {
            gl.viewport(0, (height - width) / 2, this.refLength, this.refLength)
        } else {
            gl.viewport((width - height) / 2, 0, this.refLength, this.refLength)
        }
        gl.clearColor(1, 1, 1, 1)
        gl.enable(gl.DEPTH_TEST)
        // gl.enable(gl.BLEND)
        // gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)
        scene.shapes.forEach((shape) => {
            shape.draw(gl, this.refLength)
        })
    }
}

export default Renderer
