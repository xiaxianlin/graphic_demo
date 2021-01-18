const { sin, cos } = Math
class Motion {
    /**
     * 抛射体运动方程
     * @param {*} theta 角度
     * @param {*} s 初始速度
     * @param {*} t 时间
     * @param {*} g 重力
     */
    static projectile(theta, s, t, g) {
        return [t * s * cos(theta), t * s * sin(theta) + 0.5 * g * t * t]
    }

    /**
     * 获取匀速圆周运动的坐标
     * @param raidus 半径
     * @param theta 初始角度
     * @param omega 角速度
     * @param t 时间
     */
    static circular(raidus, theta, omega, t) {
        return [raidus * cos(theta + omega * t), raidus * sin(theta + omega * t)]
    }
}

export default Motion
