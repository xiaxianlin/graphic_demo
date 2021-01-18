class Rotate {
    theta = 0
    x = 0
    y = 0
    z = 0

    set(theta, x, y, z) {
        this.theta = theta
        this.x = x
        this.y = y
        this.z = z
    }
    
    isTransform() {
        return (this.x != 0 || this.y != 0 || this.z != 0) && this.theta != 0
    }
}

export default Rotate
