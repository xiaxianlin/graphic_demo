class Translate {
    x = 0
    y = 0
    z = 0

    set(x, y, z) {
        this.x = x
        this.y = y
        this.z = z
    }

    isTransform() {
        return this.x != 0 || this.y != 0 || this.z != 0
    }
}

export default Translate
