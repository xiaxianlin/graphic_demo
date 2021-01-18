import { mat4, rotate, mult, normalize, flatten } from '~/utils/mv'
import Translate from '~/transform/Translate'
import Rotate from '~/transform/Rotate'
import { initArrayBuffer, initElementArrayBuffer } from '~/utils/webgl'

class Shape {
    verties = []
    indices = []
    normals = []

    mvpMatrix = mat4()

    translate = new Translate()
    rotate = new Rotate()

    getMvpMatrix(rate) {
        let mvpMatrix = mat4()
        if (this.translate.isTransform()) {
            let { x, y, z } = this.translate
            let matrix = mat4()
            matrix[3][0] = x * rate
            matrix[3][1] = y * rate
            matrix[3][2] = z * rate
            mvpMatrix = mult(mvpMatrix, matrix)
        }
        if (this.rotate.isTransform()) {
            let { theta, x, y, z } = this.rotate
            let matrix = rotate(theta, x, y, z)
            mvpMatrix = mult(mvpMatrix, matrix)
        }
        return mvpMatrix
    }

    draw(gl, refLength) {
        let vertices = this.verties.reduce((data, v) => data.concat(...v.map((i) => i / refLength)), [])
        let indices = this.indices.reduce((data, v) => data.concat(...v), [])
        initArrayBuffer(gl, 'a_Position', new Float32Array(vertices), gl.FLOAT, 3)
        initElementArrayBuffer(gl, new Uint8Array(indices))

        let matrixLoc = gl.getUniformLocation(gl.program, 'mvpMatrix')
        gl.uniformMatrix4fv(matrixLoc, false, flatten(this.getMvpMatrix(1 / refLength)))

        gl.clear(gl.COLOR_BUFFER_BIT)
        gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_BYTE, 0)
    }
}

export default Shape
