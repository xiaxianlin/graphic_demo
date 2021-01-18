import Vector3 from '~/geometric/Vector3'

class Polygon {
    /**
     * 判断多边形是否为凸多边形，假设多边形是平面的
     * @param {Vector3[]} v 多边形顶点列表
     */
    static isConvex(v) {
        let angleSum = 0.0
        let n = v.length
        for (let i = 0; i < n; ++i) {
            // 计算边向量，必须小心第一个和最后一个顶点
            let e1 = new Vector3()
            if (i === 0) {
                e1 = v[n - 1].minus(v[i])
            } else {
                e1 = v[i - 1].minus(v[i])
            }
            let e2 = new Vector3()
            if (i === n - 1) {
                e2 = v[0].minus(v[i])
            } else {
                e2 = v[i + 1].minus(v[i])
            }
            // 标准化并计算点乘
            e1.normalize()
            e2.normalize()
            let dot = e1.dot(e2)

            // 计算较小的角
            let theta = MathUtil.safeAcos(dot)
            angleSum += theta
        }
        // 计算内角和
        let covnexAngleSum = (n - 2) * MathUtil.kPi
        // 允许一定误差
        if (angleSum < covnexAngleSum - n * 0.0001) {
            return false
        }
        return true
    }
}

export default Polygon
