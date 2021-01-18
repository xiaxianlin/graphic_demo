/**
 * 两点求直线
 *
 * @param {Array} point1 点1
 * @param {Array} point2 点2
 */
export function getLineByPoints([x1, y1], [x2, y2]) {
    let k = (y1 - y2) / (x1 - x2)
    return [k, y1 - k * x1]
}

/**
 * 方程式求直线
 * 方程式：ax + by = c
 *
 * @param {number} a x的系数
 * @param {number} b y的系数
 * @param {number} c 常数
 */
export function getLineByEquation(a, b, c) {
    return [-a / b, c / b]
}

/**
 * 两线求交点，使用斜率、截距表达式
 *
 * @param {Array} line1 直线1
 * @param {Array} line2 直线2
 */
export function interaction([k1, d1], [k2, d2]) {
    let x = (d2 - d1) / (k1 - k2)
    return [x, k1 * x + d1]
}

const Line = { getLineByPoints, getLineByEquation, interaction }
export default Line
