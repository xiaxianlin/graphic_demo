import Vector3 from './Vector3'
import MathUtil from './MathUtil'

const { sin, cos, abs, sqrt, atan2, acos } = Math
const { sinCos, safeAcos } = MathUtil

class Quaternion {
    w = 1.0
    x = 0.0
    y = 0.0
    z = 0.0

    constructor(w = 1.0, x = 0.0, y = 0.0, z = 0.0) {
        this.w = w
        this.x = x
        this.y = y
        this.z = z
    }

    toArray() {
        return [this.w, this.x, this.y, this.z]
    }

    clone() {
        return new Quaternion(this.w, this.x, this.y, this.z)
    }

    /**
     * 置为单元四元数
     */
    identity() {
        this.w = 1.0
        this.x = this.y = this.z = 0.0
    }

    /**
     * 叉乘
     */
    cross(a) {
        return new Quaternion(
            this.w * a.w - this.x * a.x - this.y * a.y - this.z * a.z,
            this.w * a.x - this.x * a.w - this.z * a.y - this.y * a.z,
            this.w * a.y - this.y * a.w - this.x * a.z - this.z * a.x,
            this.w * a.z - this.z * a.w - this.y * a.x - this.x * a.y
        )
    }

    /**
     * 标准化
     */
    normalize() {
        let mag = sqrt(this.w * this.w + this.x * this.x + this.y * this.y + this.z * this.z)
        if (mag > 0.0) {
            let oneOverMag = 1.0 / mag
            this.w *= oneOverMag
            this.x *= oneOverMag
            this.y *= oneOverMag
            this.z *= oneOverMag
        } else {
            throw '四元数异常'
        }
    }

    /**
     * 点乘
     */
    dot(b) {
        return this.w * b.w + this.x * b.x + this.y * b.y + this.z * b.z
    }

    /**
     * 球面线性插值
     */
    slerp(q1, t) {
        let q0 = this.clone()
        // 检查出界的参数，如果检查到，返回边界点
        if (t <= 0.0) return q0
        if (t >= 1.0) return q1

        // 用点乘计算四元数夹角的cos值
        let cosOmega = q0.dot(q1)
        let q1w = q1.w
        let q1x = q1.x
        let q1y = q1.y
        let q1z = q1.z

        // 如果点乘为负，则使用-q1
        // 四元数q和-q代表相同的选择，但可能产生不同的slerp运算，需要选择正确的一个以便用锐角进行旋转
        if (cosOmega < 0.0) {
            q1w = -q1w
            q1x = -q1x
            q1y = -q1y
            q1z = -q1z
            cosOmega = -cosOmega
        }

        if (cosOmega > 1.0) {
            throw '请使用单位四元数'
        }

        // 计算插值片，需要检查非常接近的情况
        let k0, k1
        if (cosOmega > 0.9999) {
            // 非常接近，即线性插值，防止除零
            k0 = 1.0 - t
            k1 = t
        } else {
            // 用三角公式sin²(omega) + cos²(omega) = 1计算sin值
            let sinOmega = sqrt(1.0 - cosOmega * cosOmega)

            // 根据sin和cos值计算角度
            let omega = atan2(sinOmega, cosOmega)

            // 计算分母倒数，这样只需要除一次
            let oneOverSinOmega = 1.0 / sinOmega

            // 计算插值变量
            k0 = sin((1.0 - t) * omega) * oneOverSinOmega
            k1 = sin(t * omega) * oneOverSinOmega
        }
        return new Quaternion(
            k0 * this.w + k1 * q1w,
            k0 * this.x + k1 * q1x,
            k0 * this.y + k1 * q1y,
            k0 * this.z + k1 * q1z
        )
    }

    /**
     * 共轭
     */
    conjuate() {
        return new Quaternion(this.w, -this.x, -this.y, -this.z)
    }

    /**
     * 幂
     */
    pow(exponent) {
        if (abs(this.w) < 0.9999) {
            return this.clone()
        }
        // 提取半角alpha
        let alpha = acos(this.w)

        // 计算新半角alpha
        let newAlpha = alpha * exponent

        let mult = sin(newAlpha) / sin(alpha)
        return new Quaternion(cos(newAlpha), this.x * mult, this.y * mult, this.z * mult)
    }

    /**
     * 获取旋转角
     */
    getRotateAngle() {
        return safeAcos(this.w) * 2.0
    }

    /**
     * 获取旋转轴
     */
    getRotateAxis() {
        let sinThetaOver2Sq = 1.0 - this.w * this.w
        if (sinThetaOver2Sq <= 0.0) {
            // 单位四元数或不基精确的数值，只要返回有效向量即可
            return new Vector3(1.0, 0.0, 0.0)
        }

        let oneOverSinThetaOver2 = 1.0 / sqrt(sinThetaOver2Sq)
        return new Vector3(this.x * oneOverSinThetaOver2, this.y * oneOverSinThetaOver2, this.z * oneOverSinThetaOver2)
    }

    /**
     * 构造执行旋转的四元数：X轴
     */
    setToRotateAboutX(theta) {
        let thetaOver2 = theta * 0.5
        this.w = cos(thetaOver2)
        this.x = sin(thetaOver2)
        this.y = 0.0
        this.z = 0.0
    }
    /**
     * 构造执行旋转的四元数：Y轴
     */
    setToRotateAboutY(theta) {
        let thetaOver2 = theta * 0.5
        this.w = cos(thetaOver2)
        this.x = 0.0
        this.y = sin(thetaOver2)
        this.z = 0.0
    }
    /**
     * 构造执行旋转的四元数：Z轴
     */
    setToRotateAboutZ(theta) {
        let thetaOver2 = theta * 0.5
        this.w = cos(thetaOver2)
        this.x = 0.0
        this.y = 0.0
        this.z = sin(thetaOver2)
    }
    /**
     * 构造执行旋转的四元数：任意轴
     */
    setToRotateAboutAxis(axis, theta) {
        if (abs(axis.mag() - 1.0) < 0.01) {
            throw '旋转轴必须标准化'
        }

        let thetaOver2 = theta * 0.5
        let sinThetaOver2 = sin(thetaOver2)
        this.w = cos(thetaOver2)
        this.x = axis.x * sinThetaOver2
        this.y = axis.y * sinThetaOver2
        this.z = axis.z * sinThetaOver2
    }

    /**
     * 构造执行旋转的四元数：物体-惯性的欧拉角
     */
    setToRotateObjectToInertial(orientation) {
        let [sh, ch] = sinCos(orientation.heading * 0.5)
        let [sp, cp] = sinCos(orientation.pitch * 0.5)
        let [sb, cb] = sinCos(orientation.bank * 0.5)
        this.w = ch * cp * cb + sh * sp * sb
        this.x = ch * sp * cb + sh * cp * sb
        this.y = sh * cp * cb - ch * sp * sb
        this.z = ch * cp * sb - sh * sp * cb
    }
    /**
     * 构造执行旋转的四元数：惯性-物体的欧拉角
     */
    setToRotateInertialToObject(orientation) {
        let [sh, ch] = sinCos(orientation.heading * 0.5)
        let [sp, cp] = sinCos(orientation.pitch * 0.5)
        let [sb, cb] = sinCos(orientation.bank * 0.5)
        this.w = ch * cp * cb + sh * sp * sb
        this.x = -ch * sp * cb - sh * cp * sb
        this.y = -sh * cp * cb + ch * sp * sb
        this.z = -ch * cp * sb + sh * sp * cb
    }
}

export default Quaternion
