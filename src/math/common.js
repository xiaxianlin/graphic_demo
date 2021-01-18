const { floor, abs, PI } = Math
const TWOPI = 2 * PI
function wrapPi(theta) {
    if (abs(theta) > PI) {
        return theta - floor((theta + PI) / TWOPI) * TWOPI
    }
    return theta
}

const CommonMath = { wrapPi }
export default CommonMath
