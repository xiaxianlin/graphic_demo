import Vector3 from '~/geometric/Vector3'

class Vertex {
    // 位置
    position = [0, 0, 0, 0]
    // 法线
    normal = [0, 0, 0, 0]
    // 颜色
    color = [0, 0, 0, 0]
    // 切线空间基矢量
    basisVector = [0, 0, 0, 1]
    // 纹理坐标
    texture = [0, 0]
}

export default Vertex
