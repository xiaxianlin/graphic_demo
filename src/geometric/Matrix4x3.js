import MathUtil from './MathUtil'
import Vector3 from './Vector3'
import RotationMatrix from './RotationMatrix'

class Matrix4x3 {
    m11 = 1.0
    m12 = 0.0
    m13 = 0.0
    m21 = 0.0
    m22 = 1.0
    m23 = 0.0
    m31 = 0.0
    m32 = 0.0
    m33 = 1.0

    tx = 0.0
    ty = 0.0
    tz = 1.0

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
        this.tx = 0.0
        this.ty = 0.0
        this.tz = 1.0
    }

    multi(b) {
        let r = new Matrix4x3()

        r.m11 = this.m11 * b.m11 + this.m12 * b.m21 + this.m13 * b.m31
        r.m12 = this.m11 * b.m12 + this.m12 * b.m22 + this.m13 * b.m32
        r.m13 = this.m11 * b.m13 + this.m12 * b.m23 + this.m13 * b.m33

        r.m21 = this.m21 * b.m11 + this.m22 * b.m21 + this.m23 * b.m31
        r.m22 = this.m21 * b.m12 + this.m22 * b.m22 + this.m23 * b.m32
        r.m23 = this.m21 * b.m13 + this.m22 * b.m23 + this.m23 * b.m33

        r.m31 = this.m31 * b.m11 + this.m32 * b.m21 + this.m33 * b.m31
        r.m32 = this.m31 * b.m12 + this.m32 * b.m22 + this.m33 * b.m32
        r.m33 = this.m31 * b.m13 + this.m32 * b.m23 + this.m33 * b.m33

        r.tx = this.tx * b.m11 + this.ty * b.m21 + this.tz * b.m31
        r.ty = this.tx * b.m12 + this.ty * b.m22 + this.tz * b.m32
        r.tz = this.tx * b.m13 + this.ty * b.m23 + this.tz * b.m33

        return r
    }

    multiWithVector3(p) {}

    determinant() {
        return (
            this.m11 * (this.m22 * this.m33 - this.m23 * this.m32) +
            this.m12 * (this.m23 * this.m31 - this.m21 * this.m33) +
            this.m13 * (this.m21 * this.m32 - this.m22 * this.m31)
        )
    }

    inverse() {
        let det = this.determinant()

        if (Math.abs(det) <= 0.000001) {
            throw '当前矩阵为奇异矩阵，无法求逆'
        }

        let oneOverDet = 1.0 / det

        let r = new Matrix4x3()
        r.m11 = (this.m22 * this.m33 - this.m23 * this.m32) * oneOverDet
        r.m12 = (this.m13 * this.m32 - this.m12 * this.m33) * oneOverDet
        r.m13 = (this.m12 * this.m23 - this.m13 * this.m22) * oneOverDet

        r.m21 = (this.m23 * this.m31 - this.m21 * this.m33) * oneOverDet
        r.m22 = (this.m11 * this.m33 - this.m13 * this.m31) * oneOverDet
        r.m23 = (this.m13 * this.m21 - this.m11 * this.m23) * oneOverDet

        r.m31 = (this.m21 * this.m32 - this.m22 * this.m31) * oneOverDet
        r.m32 = (this.m12 * this.m31 - this.m11 * this.m32) * oneOverDet
        r.m33 = (this.m11 * this.m22 - this.m12 * this.m21) * oneOverDet

        r.tx = -(this.tx * r.m11 + this.ty * r.m21 + this.tz * r.m31)
        r.ty = -(this.tx * r.m12 + this.ty * r.m22 + this.tz * r.m32)
        r.tz = -(this.tx * r.m13 + this.ty * r.m23 + this.tz * r.m33)

        return r
    }

    getTranslation() {
        return new Vector3(this.tx, this.ty, this.tz)
    }

    getPositionFromParentToLocalMatrix() {
        return new Vector3(
            -(this.tx * this.m11 + this.ty * this.m12 + this.tz * this.m13),
            -(this.tx * this.m21 + this.ty * this.m22 + this.tz * this.m23),
            -(this.tx * this.m31 + this.ty * this.m32 + this.tz * this.m33)
        )
    }

    getPositionFromLocalToParentMatrix() {
        return new Vector3(this.tx, this.ty, this.tz)
    }

    /**
     * 消除平移
     */
    zeroTranslate() {
        this.tx = this.ty = this.tz = 0.0
    }

    /**
     * 设置平移，参数为向量形式
     */
    setTranslation(d) {
        this.tx = d.x
        this.ty = d.y
        this.tz = d.z
    }

    /**
     * 构建矩阵，设置平移
     */
    setupTranslation(d) {
        this.m11 = 1.0
        this.m12 = 0.0
        this.m13 = 0.0
        this.m21 = 0.0
        this.m22 = 1.0
        this.m23 = 0.0
        this.m31 = 0.0
        this.m32 = 0.0
        this.m33 = 1.0
        this.tx = d.x
        this.ty = d.y
        this.tz = d.z
    }

    //------------------------------------------------------------------------
    // 构造执行子-父空间变换的矩阵，子空间的位置和方位在父空间中描述
    // 该方法最常见的用途是构造物体-世界的变换矩阵，这个变换是非常直接的
    // 首先从物体空间变换到惯性空间，接着变换到世界空间
    // 方位可以由欧拉角或旋转矩阵指定

    /**
     * 构建执行子-父空间变换：欧拉角
     */
    setupLocalToParentByEulerAngles(pos, orient) {
        // 创建旋转矩阵
        let orientMatrix = new RotationMatrix()
        orientMatrix.setup(orient)
        // 构造4x3矩阵
        // 如果性能优先，可以直接计算矩阵
        return this.setupLocalToParentByRotationMatrix(pos, orientMatrix)
    }

    /**
     * 构建执行局部-父空间变换：矩阵
     */
    setupLocalToParentByRotationMatrix(pos, orient) {
        // 复制矩阵的旋转部分
        // 旋转矩阵一般为世界-物体矩阵，即父-子关系
        // 因为要求子-父转换，所以要转置
        this.m11 = orient.m11
        this.m12 = orient.m21
        this.m13 = orient.m31

        this.m21 = orient.m12
        this.m22 = orient.m22
        this.m23 = orient.m32

        this.m31 = orient.m13
        this.m32 = orient.m23
        this.m33 = orient.m33

        // 设置平移部分。平移在3x3部分“之后”
        this.tx = pos.x
        this.ty = pos.y
        this.tz = pos.z
    }

    //------------------------------------------------------------------------
    // 构造执行父-子空间变换矩阵，子空间的位置和方位在父空间中描述
    // 该方法最常见的用途是构造世界-物体的变换矩阵
    // 通常该变换从世界空间->惯性空间->物体空间
    // 4x3矩阵可以完成后一个转换
    // 所以构造两个矩阵T和R，再连接M=TR
    // 方位可以由欧拉角或旋转矩阵指定

    /**
     * 构建执行父-子空间变换：欧拉角
     */
    setupParentToLocalByEulerAngles(pos, orient) {
        let orientMatrix = new RotationMatrix()
        orientMatrix.setup(orient)
        return this.setupParentToLocalByRotationMatrix(pos, orientMatrix)
    }

    /**
     * 构建执行父-子空间变换：矩阵
     */
    setupParentToLocalByRotationMatrix(pos, orient) {
        // 复制矩阵的旋转部分
        this.m11 = orient.m11
        this.m12 = orient.m12
        this.m13 = orient.m13

        this.m21 = orient.m21
        this.m22 = orient.m22
        this.m23 = orient.m23

        this.m31 = orient.m31
        this.m32 = orient.m32
        this.m33 = orient.m33

        // 设置平移部分
        // 一般来说，从世界空间到惯性空间只需平移坐负的量
        // 但必须记得旋转是“先”发生的，所以应该旋转平移部分
        // 这和先创建平移-pos的矩阵T，再创建旋转矩阵R，再把它们连接成TR是一样的
        this.tx = -(pos.x * this.m11 + pos.y * this.m21 + pos.z * this.m31)
        this.ty = -(pos.x * this.m12 + pos.y * this.m22 + pos.z * this.m32)
        this.tz = -(pos.x * this.m13 + pos.y * this.m23 + pos.z * this.m33)
    }

    //------------------------------------------------------------------------
    // 构造绕坐标轴旋转的矩阵
    // 旋转轴由一个从1开始的索引指定
    //
    //   1 -> 绕x轴旋转
    //   2 -> 绕y轴旋转
    //   3 -> 绕z轴旋转
    // theta是旋转量，以弧度表示，用左手法则定义正方向

    /**
     * 构造绕坐标轴旋转的矩阵: 绕单一轴旋转
     */
    setupRotate(axis, theta) {
        let [s, c] = MathUtil.sinCos(theta)

        switch (axis) {
            case 1:
                this.m11 = 1.0
                this.m12 = 0.0
                this.m13 = 0.0
                this.m21 = 0.0
                this.m22 = c
                this.m23 = s
                this.m31 = 0.0
                this.m32 = -s
                this.m33 = c
                break
            case 2:
                this.m11 = c
                this.m12 = 0.0
                this.m13 = -s
                this.m21 = 0.0
                this.m22 = 1.0
                this.m23 = 0.0
                this.m31 = s
                this.m32 = 0.0
                this.m33 = c
                break
            case 3:
                this.m11 = c
                this.m12 = s
                this.m13 = 0.0
                this.m21 = -s
                this.m22 = c
                this.m23 = 0.0
                this.m31 = 0.0
                this.m32 = 0.0
                this.m33 = 1.0
                break
            default:
                throw '出现未知轴'
        }
        this.zeroTranslate()
    }

    //------------------------------------------------------------------------
    // 构造绕任意轴旋转的矩阵，旋转轴通过原点
    // 旋转轴为单位向量
    // theta是旋转量，以弧度表示，用左手法则定义正方向

    /**
     * 构造绕坐标轴旋转的矩阵: 绕任意轴旋转
     */
    setupRotateByVector3(axis, theta) {
        if (Math.abs(axis.dot(axis) - 1.0) > 0) {
            throw '旋转轴不是单位向量'
        }
        let { x, y, z } = axis
        let [s, c] = MathUtil.sinCos(theta)
        let a = 1.0 - c,
            ax = a * x,
            ay = a * y,
            az = a * z

        this.m11 = ax * x + c
        this.m12 = ax * y + z * s
        this.m13 = ax * z - y * s

        this.m21 = ay * x - z * s
        this.m22 = ay * y + c
        this.m23 = ay * z + x * s

        this.m31 = az * x + y * s
        this.m32 = az * y - x * s
        this.m33 = az * z + c

        this.zeroTranslate()
    }

    /**
     * 构造矩阵: 四元数
     */
    fromQuaternion(q) {
        let { w, x, y, z } = q
        let ww = 2.0 * w,
            xx = 2.0 * x,
            yy = 2.0 * y,
            zz = 2.0 * z

        this.m11 = 1.0 - yy * y - zz * z
        this.m12 = xx * y + ww * z
        this.m13 = xx * z - ww * x

        this.m21 = xx * y - ww * z
        this.m22 = 1.0 - xx * x - zz * z
        this.m23 = yy * z + ww * x

        this.m31 = xx * z + ww * y
        this.m32 = yy * z - ww * x
        this.m33 = 1.0 - xx * x - yy * y

        this.zeroTranslate()
    }

    /**
     * 构造沿各坐标轴缩放的矩阵
     * 对于缩放因子k，使用向量Vector3(k,k,k)表示
     */
    setupScale(s) {
        let { x, y, z } = s
        this.m11 = x
        this.m12 = 0.0
        this.m13 = 0.0

        this.m21 = 0.0
        this.m22 = y
        this.m23 = 0.0

        this.m31 = 0.0
        this.m32 = 0.0
        this.m33 = z

        this.zeroTranslate()
    }

    /**
     * 构造沿任意轴缩放的矩阵
     * 旋转轴为单位向量，k为缩放因子
     */
    setupScaleAlongAxis(axis, k) {
        if (Math.abs(axis.dot(axis) - 1.0) > 0) {
            throw '旋转轴不是单位向量'
        }
        let { x, y, z } = axis
        let a = k - 1.0,
            ax = a * x,
            ay = a * y,
            az = a * z

        this.m11 = ax * x + 1.0
        this.m22 = ay * y + 1.0
        this.m33 = az * z + 1.0

        this.m21 = this.m21 = ax * y
        this.m13 = this.m31 = ax * z
        this.m23 = this.m32 = ay * z

        this.zeroTranslate()
    }

    /**
     * 构造切变矩阵
     * 切变类型由一个索引指定，效果如所示：
     *     axis === 1 => y += s*x, z += t*x
     *     axis === 2 => x += s*y, z += t*y
     *     axis === 3 => x += s*z, y += t*z
     */
    setupShear(axis, s, t) {
        switch (axis) {
            case 1: // 用x切变y和z
                this.m11 = 1.0
                this.m12 = s
                this.m13 = t
                this.m21 = 0.0
                this.m22 = 1.0
                this.m23 = 0.0
                this.m31 = 0.0
                this.m32 = 0.0
                this.m33 = 1.0
                break
            case 2: // 用y切变x和z
                this.m11 = 1.0
                this.m12 = 0.0
                this.m13 = 0.0
                this.m21 = s
                this.m22 = 1.0
                this.m23 = t
                this.m31 = 0.0
                this.m32 = 0.0
                this.m33 = 1.0
                break
            case 3: // 用z切变x和y
                this.m11 = 1.0
                this.m12 = 0.0
                this.m13 = 0.0
                this.m21 = 0.0
                this.m22 = 1.0
                this.m23 = 0.0
                this.m31 = s
                this.m32 = t
                this.m33 = 1.0
                break
            default:
                throw '出现未知轴'
        }
        this.zeroTranslate()
    }

    /**
     * 构造投影矩阵，投影平面过原点，且垂直于单位向量n
     */
    setupProject(n) {
        if (Math.abs(n.dot(n) - 1.0) > 0) {
            throw '旋转轴不是单位向量'
        }
        let { x, y, z } = n
        this.m11 = 1.0 - x * x
        this.m22 = 1.0 - y * y
        this.m33 = 1.0 - z * z

        this.m21 = this.m21 = -x * y
        this.m13 = this.m31 = -x * z
        this.m23 = this.m32 = -y * z

        this.zeroTranslate()
    }

    /**
     * 构造反射矩阵，反射平面平行于坐标平面
     * 反射平面由一个索引指定
     *   1 => 沿x = k平面反射
     *   2 => 沿y = k平面反射
     *   3 => 沿z = k平面反射
     * 平移部分置为合适的值，因为k != 0时平移一定会发生的
     */
    setupReflect(axis, k = 0.0) {
        switch (axis) {
            case 1: // 用x切变y和z
                this.m11 = -1.0
                this.m12 = 0.0
                this.m13 = 0.0
                this.m21 = 0.0
                this.m22 = 1.0
                this.m23 = 0.0
                this.m31 = 0.0
                this.m32 = 0.0
                this.m33 = 1.0
                this.tx = 2.0 * k
                this.ty = 0.0
                this.tz = 0.0
                break
            case 2: // 用y切变x和z
                this.m11 = 1.0
                this.m12 = 0.0
                this.m13 = 0.0
                this.m21 = 0.0
                this.m22 = -1.0
                this.m23 = 0.0
                this.m31 = 0.0
                this.m32 = 0.0
                this.m33 = 1.0
                this.tx = 0.0
                this.ty = 2.0 * k
                this.tz = 0.0
                break
            case 3: // 用z切变x和y
                this.m11 = 1.0
                this.m12 = 0.0
                this.m13 = 0.0
                this.m21 = 0.0
                this.m22 = 1.0
                this.m23 = 0.0
                this.m31 = 0.0
                this.m32 = 0.0
                this.m33 = -1.0
                this.tx = 0.0
                this.ty = 0.0
                this.tz = 2.0 * k
                break
            default:
                throw '出现未知轴'
        }
    }

    /**
     * 构造反射矩阵，反射平面为通过原点的任意平面，且垂直于单位向量n
     * 反射平面由一个索引指定
     *   1 => 沿x = k平面反射
     *   2 => 沿y = k平面反射
     *   3 => 沿z = k平面反射
     * 平移部分置为合适的值，因为k != 0时平移一定会发生的
     */
    setupReflectByVector3(n) {
        if (Math.abs(n.dot(n) - 1.0) > 0) {
            throw '旋转轴不是单位向量'
        }
        let { x, y, z } = n
        let ax = -2.0 * x,
            ay = -2.0 * y,
            az = -2.0 * z

        this.m11 = 1.0 + ax * x
        this.m22 = 1.0 + ay * y
        this.m33 = 1.0 + az * z

        this.m21 = this.m21 = ax * y
        this.m13 = this.m31 = ax * z
        this.m23 = this.m32 = ay * z

        this.zeroTranslate()
    }
}

export default Matrix4x3
