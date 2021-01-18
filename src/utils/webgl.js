import { vec4 } from './mv'

export function getWebGL(canvas, vertexShaderSource, fragmentShaderSource) {
    let gl = canvas.getContext('webgl')
    gl.program = getShader(gl, vertexShaderSource, fragmentShaderSource)
    gl.useProgram(gl.program)
    return gl
}

export function setupWebgl(container, vertexShaderSource, fragmentShaderSource) {
    let width = document.body.offsetWidth
    let height = document.body.offsetHeight

    let canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    container.appendChild(canvas)

    let gl = canvas.getContext('webgl')
    gl.program = getShader(gl, vertexShaderSource, fragmentShaderSource)
    gl.useProgram(gl.program)
    return gl
}

export function getShader(gl, vertexShaderSource, fragmentShaderSource) {
    let vShader = gl.createShader(gl.VERTEX_SHADER)
    if (!vShader) {
        throw '顶点着色器创建失败'
    }
    gl.shaderSource(vShader, vertexShaderSource)
    gl.compileShader(vShader)
    if (!gl.getShaderParameter(vShader, gl.COMPILE_STATUS)) {
        throw '顶点着色器编译失败：' + gl.getShaderInfoLog(vShader)
    }

    let fShader = gl.createShader(gl.FRAGMENT_SHADER)
    if (!fShader) {
        throw '片元着色器创建失败'
    }
    gl.shaderSource(fShader, fragmentShaderSource)
    gl.compileShader(fShader)
    if (!gl.getShaderParameter(fShader, gl.COMPILE_STATUS)) {
        throw '片元着色器编译失败：' + gl.getShaderInfoLog(fShader)
    }

    let program = gl.createProgram()
    gl.attachShader(program, vShader)
    gl.attachShader(program, fShader)
    gl.linkProgram(program)

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        throw '程序链接失败'
    }
    return program
}

export function initArrayBuffer(gl, attribName, data, type, size) {
    let location = gl.getAttribLocation(gl.program, attribName)
    if (location < 0) {
        return null
    }
    let buffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW)
    gl.vertexAttribPointer(location, size, type, false, 0, 0)
    gl.enableVertexAttribArray(location)
    return buffer
}

export function initElementArrayBuffer(gl, data) {
    let buffer = gl.createBuffer()
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer)
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, data, gl.STATIC_DRAW)
    return buffer
}

export function getColors(index) {
    return [
        vec4(0.0, 0.0, 0.0, 1.0), // 黑
        vec4(1.0, 0.0, 0.0, 1.0), // 红
        vec4(1.0, 1.0, 0.0, 1.0), // 黄
        vec4(0.0, 1.0, 0.0, 1.0), // 绿
        vec4(0.0, 0.0, 1.0, 1.0), // 蓝
        vec4(1.0, 0.0, 1.0, 1.0), // 品红
        vec4(0.0, 1.0, 1.0, 1.0), // 青
        vec4(1.0, 1.0, 1.0, 1.0), // 白
    ][index]
}

export function createMotionFrame(callback) {
    let last = Date.now()
    return () => {
        let now = Date.now()
        callback(now - last)
        last = now
    }
}
