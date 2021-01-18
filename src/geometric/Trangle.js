import Vector3 from './Vector3'
class Trangle {
    static computeBarycentricCoords3d(v, p) {
        // 计算边向量，呈顺时针方向
        let d1 = v[1].minus(v[0])
        let d2 = v[2].minus(v[1])
        // 用叉乘计算法向量，许多情况下，这一步都可以省略，因为法向量都是预先计算的
        // 不需要正则化，不管预先计算的法向量是否正则化
        let n = d1.cross(d2)

        // 判断法向量中占优势的轴，选择投影平面
        let u1, u2, u3, u4
        let v1, v2, v3, v4

        if (Math.abs(n.x) >= Math.abs(n.y) && Math.abs(n.x) >= Math.abs(n.z)) {
            // 抛弃x轴，向yz平面投影
            u1 = v[0].y - v[2].y
            u2 = v[1].y - v[2].y
            u3 = p.y - v[0].y
            u4 = p.y - v[2].y
            v1 = v[0].z - v[2].z
            v2 = v[1].z - v[2].z
            v3 = p.z - v[0].z
            v4 = p.z - v[2].z
        } else if (Math.abs(n.y) >= Math.abs(n.z)) {
            // 抛弃y轴，向xz平面投影
            u1 = v[0].z - v[2].z
            u2 = v[1].z - v[2].z
            u3 = p.z - v[0].z
            u4 = p.z - v[2].z
            v1 = v[0].x - v[2].x
            v2 = v[1].x - v[2].x
            v3 = p.x - v[0].x
            v4 = p.x - v[2].x
        } else {
            // 抛弃z轴，向xy平面投影
            u1 = v[0].x - v[2].x
            u2 = v[1].x - v[2].x
            u3 = p.x - v[0].x
            u4 = p.x - v[2].x
            v1 = v[0].y - v[2].y
            v2 = v[1].y - v[2].y
            v3 = p.y - v[0].y
            v4 = p.y - v[2].y
        }
        // 计算分母，并判断合法性
        let denom = v1 * u2 - v2 * u1
        if (denom === 0) {
            throw '三角形为退化三角形，面积为零'
        }

        //计算重心坐标
        let oneOverDenom = 1.0 / denom
        let b = []
        b[0] = (v4 * u2 - v2 * u4) * oneOverDenom
        b[1] = (v1 * u3 - v3 * u1) * oneOverDenom
        b[2] = 1.0 - b[0] - b[1]
        return b
    }
}
