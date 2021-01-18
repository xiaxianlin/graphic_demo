class Vector3 {
    x = 0.0
    y = 0.0
    z = 0.0
    constructor(x = 0.0, y = 0.0, z = 0.0) {
        this.x = x
        this.y = y
        this.z = z
    }

    toArray() {
        return [this.x, this.y, this.z]
    }

    zero() {
        this.x = this.y = this.z = 0.0
    }

    add(v) {
        return new Vector3(this.x + v.x, this.y + v.y, this.z + v.z)
    }

    minus(v) {
        return new Vector3(this.x - v.x, this.y - v.y, this.z - v.z)
    }

    multi(k) {
        return new Vector3(this.x * k, this.y * k, this.z * k)
    }

    multiWithMartix(m) {
        return new Vector3(
            this.x * m.m11 + this.y * m.m21 + this.z * m.m31,
            this.x * m.m12 + this.y * m.m22 + this.z * m.m32,
            this.x * m.m13 + this.y * m.m23 + this.z * m.m33
        )
    }

    divide(k) {
        k = 1.0 / k
        return this.multi(k)
    }

    cross(v) {
        return new Vector3(this.y * v.z - this.z * v.y, this.z * v.x - this.x * v.z, this.x * v.y - this.y * v.x)
    }

    mag() {
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z)
    }

    dot(v) {
        return this.x * v.x + this.y * v.y + this.z * v.z
    }

    normalize() {
        let magSq = this.x * this.x + this.y * this.y + this.z * this.z
        let oneOverMag = 1.0 / Math.sqrt(magSq)
        if (magSq > 0.0) {
            this.x *= oneOverMag
            this.y *= oneOverMag
            this.z *= oneOverMag
        }
    }

    distance(v) {
        let dx = this.x - v.x
        let dy = this.y - v.y
        let dz = this.z - v.z
        return Math.sqrt(dx * dx + dy * dy + dz * dz)
    }
}

export default Vector3
