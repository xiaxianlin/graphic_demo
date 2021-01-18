/**
 * 二维算法
 * @param {number} n 曲线的阶，点的数量
 * @param {Vector3[]} points 点的数组，将被覆盖
 * @param {number} t 要评估的参数值
 */
export function deCasteljau2(n, points, t) {
    let oneMinus = 1 - t
    while (n > 1) {
        --n
        for (let i = 0; i < n; i++) {
            let [x1, y1] = points[i]
            let [x2, y2] = points[i + 1]
            points[i] = [x1 * oneMinus + x2 * t, y1 * oneMinus + y2 * t]
        }
    }
    return points[0]
}

/**
 * 三维算法
 * @param {number} n 曲线的阶，点的数量
 * @param {Vector3[]} points 点的数组，将被覆盖
 * @param {number} t 要评估的参数值
 */
export function deCasteljau3(n, points, t) {
    while (n > 1) {
        --n
        for (let i = 0; i < n; i++) {
            points[i] = points[i].multi(1.0 - t).add(points[i + 1].multi(t))
        }
    }
    return points[0]
}

export function deCasteljauData2(n, points, t) {
    points = points.slice()
    let data = []
    let oneMinus = 1 - t
    while (n > 1) {
        --n
        let items = []
        for (let i = 0; i < n; ++i) {
            let [x1, y1] = points[i]
            let [x2, y2] = points[i + 1]
            let x = x1 * oneMinus + x2 * t
            let y = y1 * oneMinus + y2 * t
            items[i] = [x, y]
            points[i] = [x, y]
        }
        data.push(items)
    }
    return data
}
