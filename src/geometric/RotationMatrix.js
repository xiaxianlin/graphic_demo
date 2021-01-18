import { sinCos } from './MathUtil'
import Vector3 from './Vector3'

class RotationMatrix {
    m11 = 1.0
    m12 = 0.0
    m13 = 0.0
    m21 = 0.0
    m22 = 1.0
    m23 = 0.0
    m31 = 0.0
    m32 = 0.0
    m33 = 1.0

    constructor(data) {
        if (data) {
            this.m11 = data[0][0]
            this.m12 = data[0][1]
            this.m13 = data[0][2]
            this.m21 = data[1][0]
            this.m22 = data[1][1]
            this.m23 = data[1][2]
            this.m31 = data[2][0]
            this.m32 = data[2][1]
            this.m33 = data[2][2]
        }
    }

    toArray() {
        return [
            [this.m11, this.m12, this.m13],
            [this.m21, this.m22, this.m23],
            [this.m31, this.m32, this.m33]
        ]
    }

    /**
     * 构造单位矩阵
     */
    identity() {
        this.m11 = 1.0
        this.m12 = 0.0
        this.m13 = 0.0
        this.m21 = 0.0
        this.m22 = 1.0
        this.m23 = 0.0
        this.m31 = 0.0
        this.m32 = 0.0
        this.m33 = 1.0
    }

    /**
     * 构造矩阵：欧拉角
     */
    setup(orientation) {
        let [sh, ch] = sinCos(orientation.heading)
        let [sp, cp] = sinCos(orientation.pitch)
        let [sb, cb] = sinCos(orientation.bank)

        this.m11 = ch * cb + sh * sp * sb
        this.m12 = -ch * sb + sh * sp * cb
        this.m13 = sh * cp

        this.m21 = sb * cp
        this.m22 = cb * cp
        this.m23 = -sp

        this.m31 = -sh * cb + ch * sp * sb
        this.m32 = sb * sh + ch * sp * cb
        this.m33 = ch * cp
    }

    /**
     * 构造矩阵：惯性-对象四元数
     */
    fromInertialToObjectQuaternion(q) {
        let { w, x, y, z } = q
        this.m11 = 1.0 - 2.0 * (y * y + z * z)
        this.m12 = 2.0 * (x * y + w * z)
        this.m13 = 2.0 * (x * z - w * y)

        this.m21 = 2.0 * (x * y - w * z)
        this.m22 = 1.0 - 2.0 * (x * x + z * z)
        this.m23 = 2.0 * (y * z + w * x)

        this.m31 = 2.0 * (x * z + w * y)
        this.m32 = 2.0 * (y * z - w * x)
        this.m33 = 1.0 - 2.0 * (x * x + y * y)
    }

    /**
     * 构造矩阵：对象-惯性四元数
     */
    fromObjectToInertialQuaternion(q) {
        let { w, x, y, z } = q
        this.m11 = 1.0 - 2.0 * (y * y + z * z)
        this.m12 = 2.0 * (x * y - w * z)
        this.m13 = 2.0 * (x * z + w * y)

        this.m21 = 2.0 * (x * y + w * z)
        this.m22 = 1.0 - 2.0 * (x * x + z * z)
        this.m23 = 2.0 * (y * z - w * x)

        this.m31 = 2.0 * (x * z - w * y)
        this.m32 = 2.0 * (y * z + w * x)
        this.m33 = 1.0 - 2.0 * (x * x + y * y)
    }

    /**
     * 从惯性-对象旋转向量
     */
    rotateInertialToObjectVector3(v) {
        let { x, y, z } = v
        return new Vector3(
            this.m11 * x + this.m21 * y + this.m31 * z,
            this.m12 * x + this.m22 * y + this.m32 * z,
            this.m13 * x + this.m23 * y + this.m33 * z
        )
    }
    /**
     * 从对象-惯性旋转向量
     */
    rotateObjectToInertialVector3(v) {
        let { x, y, z } = v
        return new Vector3(
            this.m11 * x + this.m12 * y + this.m13 * z,
            this.m21 * x + this.m22 * y + this.m23 * z,
            this.m31 * x + this.m32 * y + this.m33 * z
        )
    }
}

export default RotationMatrix
