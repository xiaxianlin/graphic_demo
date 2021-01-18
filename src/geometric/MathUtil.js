class MathUtil {
    static kPi = Math.PI
    static k2Pi = MathUtil.kPi * 2.0
    static kPiOver2 = MathUtil.kPi / 2.0
    static k1OverPi = 1.0 / MathUtil.kPi
    static k1Over2Pi = 1.0 / MathUtil.k2Pi

    /**
     * 通过加上适当的2pi倍数，将角度限制在-pi到pi之间
     */
    static wrapPi(theta) {
        theta += this.kPi
        theta -= Math.floor(theta * this.k1Over2Pi) * this.k2Pi
        theta -= this.kPi
        return theta
    }

    /**
     * 和Math.acos()相同，但如果x超出范围将返回最为接近的有效值
     * 返回值在0到π之间
     */
    static safeAcos(x) {
        if (x <= -1.0) {
            return this.kPi
        }
        if (x >= 1.0) {
            return 0.0
        }
        return Math.acos(x)
    }

    static sinCos(theta) {
        return [Math.sin(theta), Math.cos(theta)]
    }
}

export default MathUtil
