export function getCanvasAxis(evt) {
    let { target, clientX, clientY } = evt
    let { left, top } = target.getBoundingClientRect()
    return [clientX - left, clientY - top]
}
