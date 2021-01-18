import Vector3 from './Vector3'

const kBigNumber = 1e37
const kNoIntersection = 1e30
class AABB3 {
    static createByDotList(list) {
        let box = new AABB3()
        box.empty()
        list.forEach((dot) => {
            box.add(dot)
        })
        return box
    }

    static intersectAABBs(box1, box2, boxIntersect) {
        if (box1.min.x > box2.max.x) return false
        if (box1.max.x < box2.min.x) return false
        if (box1.min.y > box2.max.y) return false
        if (box1.max.y < box2.min.y) return false
        if (box1.min.z > box2.max.z) return false
        if (box1.max.z < box2.min.z) return false

        const { max, min } = Math

        if (boxIntersect !== null) {
            boxIntersect.min.x = max(box1.min.x, box2.min.x)
            boxIntersect.max.x = min(box1.max.x, box2.max.x)
            boxIntersect.min.y = max(box1.min.y, box2.min.y)
            boxIntersect.max.y = min(box1.max.y, box2.max.y)
            boxIntersect.min.z = max(box1.min.z, box2.min.z)
            boxIntersect.max.z = min(box1.max.z, box2.max.z)
        }

        return true
    }
    /**
     * 动态AABB相交性检测，返回值>1则未相交
     */
    static intersectMovingAABB(stationaryBox, movingBox, d) {
        // 初始化时间区间，包含需要考虑的全部时间段
        let tEnter = 0.0,
            tLeave = 1.0

        // 计算每一维上的重叠部分，再将这个重叠部分和前面的重叠部分作相交
        // 如果有一维上重叠部分为零则返回（不会相交）
        // 每一维上必须当心零重叠

        // 检查x轴
        if (d.x === 0.0) {
            // 检查x轴上重叠部分为空
            if (stationaryBox.min.x >= movingBox.max.x || stationaryBox.max.x <= movingBox.min.x) {
                return kNoIntersection
            }
            // 无穷大空间，没有必要的更新
        } else {
            // 只除一次
            let oneOverD = 1.0 / d.x
            // 计算开始接触时间和脱离接触时间
            let xEnter = (stationaryBox.min.x - movingBox.max.x) * oneOverD
            let xLeave = (stationaryBox.max.x - movingBox.min.x) * oneOverD
            // 检查顺序
            if (xEnter > xLeave) {
                let tmp = xEnter
                xEnter = xLeave
                xLeave = tmp
            }
            // 更新空间
            if (xEnter > tEnter) {
                tEnter = xEnter
            }
            if (xLeave < tLeave) {
                tLeave = xLeave
            }
            // 是否导致空重叠区
            if (tEnter > tLeave) {
                return kNoIntersection
            }
        }

        // 检查y轴
        if (d.y === 0.0) {
            if (stationaryBox.min.y >= movingBox.max.y || stationaryBox.max.y <= movingBox.min.y) {
                return kNoIntersection
            }
        } else {
            let oneOverD = 1.0 / d.y
            let yEnter = (stationaryBox.min.y - movingBox.max.y) * oneOverD
            let yLeave = (stationaryBox.max.y - movingBox.min.y) * oneOverD
            if (yEnter > yLeave) {
                let tmp = yEnter
                yEnter = yLeave
                yLeave = tmp
            }
            if (yEnter > tEnter) {
                tEnter = yEnter
            }
            if (yLeave < tLeave) {
                tLeave = yLeave
            }
            if (tEnter > tLeave) {
                return kNoIntersection
            }
        }

        // 检查z轴
        if (d.z === 0.0) {
            if (stationaryBox.min.z >= movingBox.max.z || stationaryBox.max.z <= movingBox.min.z) {
                return kNoIntersection
            }
        } else {
            let oneOverD = 1.0 / d.z
            let zEnter = (stationaryBox.min.z - movingBox.max.z) * oneOverD
            let zLeave = (stationaryBox.max.z - movingBox.min.z) * oneOverD
            if (zEnter > zLeave) {
                let tmp = zEnter
                zEnter = zLeave
                zLeave = tmp
            }
            if (zEnter > tEnter) {
                tEnter = zEnter
            }
            if (zLeave < tLeave) {
                tLeave = zLeave
            }
            if (tEnter > tLeave) {
                return kNoIntersection
            }
        }

        // 如果有相交，返回交点的参数值
        return tEnter
    }
    // 最小点
    min = new Vector3()
    // 最大点
    max = new Vector3()
    // 查询各种参数
    size() {
        return this.max.minus(this.min)
    }

    xSize() {
        return this.max.x - this.min.x
    }

    ySize() {
        return this.max.y - this.min.y
    }

    zSize() {
        return this.max.z - this.min.z
    }

    center() {
        return this.min.add(this.max).multi(0.5)
    }
    /**
     * 返回顶点
     *
     *         6 - - - - - - - - - - - - 7
     *        /|                        /|
     *       / |                       / |
     *      /  |                      /  |
     *     /   |                     /   |
     *    /    |                    /    |
     *   /     |                   /     |
     *  /      |                  /      |
     * 2 - - - - - - - - - - - - 3       |
     * |       |                 |       |
     * |       |                 |       |
     * |       4 - - - - - - - - | - - - 5
     * |      /                  |      /
     * |     /                   |     /             +y
     * |    /                    |    /              |   +z
     * |   /                     |   /               |  /
     * |  /                      |  /                | /
     * | /                       | /                 |/
     * 0 - - - - - - - - - - - - 1                   + - - - - +x
     */
    corner(i) {
        if (i < 0 || i > 7) {
            throw '索引不合法'
        }
        return new Vector3(
            i & 1 ? this.max.x : this.min.x,
            i & 2 ? this.max.y : this.min.y,
            i & 4 ? this.max.z : this.min.z
        )
    }

    /**
     * 清空矩形边界框
     */
    empty() {
        this.min.x = this.min.y = this.min.z = kBigNumber
        this.max.x = this.max.y = this.max.z = -kBigNumber
    }

    /**
     * 向矩形边界框添加点/AABB
     */
    add(p | AABB3) {
        if (p instanceof Vector3) {
            this.addPoint(p)
        } else {
            this.addBox(p)
        }
    }
    /**
     * 向矩形边界框添加点
     */
    addPoint(p) {
        if (p.x < this.min.x) this.min.x = p.x
        if (p.x > this.max.x) this.max.x = p.x
        if (p.y < this.min.y) this.min.y = p.y
        if (p.y > this.max.y) this.max.y = p.y
        if (p.z < this.min.z) this.min.z = p.z
        if (p.z > this.max.z) this.max.z = p.z
    }
    /**
     * 向矩形边界框添加AABB
     */
    addBox(box) {
        if (box.min.x < this.min.x) this.min.x = box.min.x
        if (box.min.x > this.max.x) this.max.x = box.min.x
        if (box.min.y < this.min.y) this.min.y = box.min.y
        if (box.min.y > this.max.y) this.max.y = box.min.y
        if (box.min.z < this.min.z) this.min.z = box.min.z
        if (box.min.z > this.max.z) this.max.z = box.min.z
    }

    /**
     * 变换矩形边界框，计算新的AABB
     */
    setToTransformedBox(box, m) {
        if (box.isEmpty()) {
            this.empty()
            return
        }
        this.min = this.max = m.getTranslation()

        if (m.m11 > 0.0) {
            this.min.x += m.m11 * box.min.x
            this.max.x += m.m11 * box.max.x
        } else {
            this.min.x += m.m11 * box.max.x
            this.max.x += m.m11 * box.min.x
        }
        if (m.m12 > 0.0) {
            this.min.x += m.m12 * box.min.x
            this.max.x += m.m12 * box.max.x
        } else {
            this.min.x += m.m12 * box.max.x
            this.max.x += m.m12 * box.min.x
        }
        if (m.m13 > 0.0) {
            this.min.x += m.m13 * box.min.x
            this.max.x += m.m13 * box.max.x
        } else {
            this.min.x += m.m13 * box.max.x
            this.max.x += m.m13 * box.min.x
        }
        if (m.m21 > 0.0) {
            this.min.x += m.m21 * box.min.y
            this.max.x += m.m21 * box.max.y
        } else {
            this.min.x += m.m21 * box.max.y
            this.max.x += m.m21 * box.min.y
        }
        if (m.m22 > 0.0) {
            this.min.x += m.m22 * box.min.y
            this.max.x += m.m22 * box.max.y
        } else {
            this.min.x += m.m22 * box.max.y
            this.max.x += m.m22 * box.min.y
        }
        if (m.m23 > 0.0) {
            this.min.x += m.m23 * box.min.y
            this.max.x += m.m23 * box.max.y
        } else {
            this.min.x += m.m23 * box.max.y
            this.max.x += m.m23 * box.min.y
        }
        if (m.m31 > 0.0) {
            this.min.x += m.m31 * box.min.z
            this.max.x += m.m31 * box.max.z
        } else {
            this.min.x += m.m31 * box.max.z
            this.max.x += m.m31 * box.min.z
        }
        if (m.m32 > 0.0) {
            this.min.x += m.m32 * box.min.z
            this.max.x += m.m32 * box.max.z
        } else {
            this.min.x += m.m32 * box.max.z
            this.max.x += m.m32 * box.min.z
        }
        if (m.m33 > 0.0) {
            this.min.x += m.m33 * box.min.z
            this.max.x += m.m33 * box.max.z
        } else {
            this.min.x += m.m33 * box.max.z
            this.max.x += m.m33 * box.min.z
        }
    }
    /**
     * 判断矩形边界框是否为空
     */
    isEmpty() {
        return this.min.x > this.max.x || this.min.y > this.max.y || this.min.z > this.max.z
    }
    /**
     * 判断矩形边界框是否包含某点
     */
    contains(p) {
        return (
            p.x >= this.min.x &&
            p.x <= this.max.x &&
            p.y >= this.min.y &&
            p.y <= this.max.y &&
            p.z >= this.min.z &&
            p.z <= this.max.z
        )
    }
    /**
     * 计算最近距离的矩形边界框上的点
     */
    closestPointTo(p) {
        let { x, y, z } = p
        if (x < this.min.x) {
            x = this.min.x
        } else if (x > this.max.x) {
            x = this.max.x
        }
        if (y < this.min.y) {
            y = this.min.y
        } else if (y > this.max.y) {
            y = this.max.y
        }
        if (z < this.min.z) {
            z = this.min.z
        } else if (z > this.max.z) {
            z = this.max.z
        }
        return new Vector3(x, y, z)
    }
    /**
     * 检测是否与球相交
     */
    intersectSphere(center, radius) {
        let closestPoint = this.closestPointTo(center)
        return center.distance(closestPoint) < radius * radius
    }
    /**
     * 检测是否与射线相交
     */
    intersectRay(rayOrg, rayDelta, intersectPoint) {
        let inside = true
        // 检查点在矩形边界框内的情况，并计算到每个面的距离
        let xt, xn
        if (rayOrg.x < this.min.x) {
            xt = this.min.x - rayOrg.x
            if (xt > rayDelta.x) {
                return kNoIntersection
            }
            xt /= rayDelta.x
            inside = false
            xn = -1.0
        } else if (rayOrg.x > this.max.x) {
            xt = this.max.x - rayOrg.x
            if (xt < rayDelta.x) {
                return kNoIntersection
            }
            xt /= rayDelta.x
            inside = false
            xn = 1.0
        } else {
            xn = -1.0
        }

        let yt, yn
        if (rayOrg.y < this.min.y) {
            yt = this.min.y - rayOrg.y
            if (yt > rayDelta.y) {
                return kNoIntersection
            }
            yt /= rayDelta.y
            inside = false
            yn = -1.0
        } else if (rayOrg.y > this.max.y) {
            yt = this.max.y - rayOrg.y
            if (yt < rayDelta.y) {
                return kNoIntersection
            }
            yt /= rayDelta.y
            inside = false
            yn = 1.0
        } else {
            yn = -1.0
        }

        let zt, zn
        if (rayOrg.z < this.min.z) {
            zt = this.min.z - rayOrg.z
            if (zt > rayDelta.z) {
                return kNoIntersection
            }
            zt /= rayDelta.z
            inside = false
            zn = -1.0
        } else if (rayOrg.z > this.max.z) {
            zt = this.max.z - rayOrg.z
            if (zt < rayDelta.z) {
                return kNoIntersection
            }
            zt /= rayDelta.z
            inside = false
            zn = 1.0
        } else {
            zn = -1.0
        }
        // 是否在矩形边界框内
        if (inside) {
            if (intersectPoint !== null) {
                intersectPoint.x = -rayDelta.x
                intersectPoint.y = -rayDelta.y
                intersectPoint.z = -rayDelta.z
                intersectPoint.normalize()
            }
            return 0.0
        }
        // 选择最远的平面，发生相交的地方
        let which = 0
        let t = xt
        if (yt > t) {
            which = 1
            t = yt
        }
        if (zt > t) {
            which = 2
            t = zt
        }

        let x, y, z
        switch (which) {
            case 0:
                y = rayOrg.y + rayDelta.y * t
                if (y < this.min.y || y > this.max.y) return kNoIntersection
                z = rayOrg.z + rayDelta.z * t
                if (z < this.min.z || z > this.max.z) return kNoIntersection
                if (intersectPoint !== null) {
                    intersectPoint.x = xn
                    intersectPoint.y = 0.0
                    intersectPoint.z = 0.0
                }
                break
            case 1:
                x = rayOrg.x + rayDelta.x * t
                if (x < this.min.x || y > this.max.x) return kNoIntersection
                z = rayOrg.z + rayDelta.z * t
                if (z < this.min.z || z > this.max.z) return kNoIntersection
                if (intersectPoint !== null) {
                    intersectPoint.x = 0.0
                    intersectPoint.y = yn
                    intersectPoint.z = 0.0
                }
                break
            case 2:
                x = rayOrg.x + rayDelta.x * t
                if (x < this.min.x || y > this.max.x) return kNoIntersection
                y = rayOrg.y + rayDelta.y * t
                if (y < this.min.y || y > this.max.y) return kNoIntersection
                if (intersectPoint !== null) {
                    intersectPoint.x = 0.0
                    intersectPoint.y = 0.0
                    intersectPoint.z = zn
                }
                break
        }
        return t
    }
    /**
     * 判断矩形边界框在平面的哪一面
     */
    classifyPlane(n, d) {
        let minD, maxD

        if (n.x > 0.0) {
            minD = n.x * this.min.x
            maxD = n.x * this.max.x
        } else {
            minD = n.x * this.max.x
            maxD = n.x * this.min.x
        }

        if (n.y > 0.0) {
            minD = n.y * this.min.y
            maxD = n.y * this.max.y
        } else {
            minD = n.y * this.max.y
            maxD = n.y * this.min.y
        }

        if (n.z > 0.0) {
            minD = n.z * this.min.z
            maxD = n.z * this.max.z
        } else {
            minD = n.z * this.max.z
            maxD = n.z * this.min.z
        }

        if (minD >= d) {
            return 1
        }
        if (maxD <= d) {
            return -1
        }
        return 0
    }
    /**
     * 检测是否与平面相交
     */
    intersectPlane(n, planeD, dir) {
        if (Math.abs(n.dot(n) - 1.0) < 0.01) {
            throw '向量未正则化'
        }
        if (Math.abs(dir.dot(dir) - 1.0) < 0.01) {
            throw '向量未正则化'
        }
        // 计算夹角，确保我们是在向平面的正面移动
        let dot = n.dot(dir)
        if (dot >= 0.0) {
            return kNoIntersection
        }

        // 检查法向量，计算最小和最大D值，minD是”跑在最前面的“顶点的D值
        let minD, maxD
        if (n.x > 0.0) {
            minD = n.x * this.min.x
            maxD = n.x * this.max.x
        } else {
            minD = n.x * this.max.x
            maxD = n.x * this.min.x
        }

        if (n.y > 0.0) {
            minD = n.y * this.min.y
            maxD = n.y * this.max.y
        } else {
            minD = n.y * this.max.y
            maxD = n.y * this.min.y
        }

        if (n.z > 0.0) {
            minD = n.z * this.min.z
            maxD = n.z * this.max.z
        } else {
            minD = n.z * this.max.z
            maxD = n.z * this.min.z
        }

        // 检测是否已经全部在平面的另一面
        if (maxD <= planeD) {
            return kNoIntersection
        }

        // 将最前顶点代入标准色相方程
        let t = (planeD - minD) / dot

        // 检查是否已经穿过它
        if (t < 0.0) {
            return 0.0
        }

        // 如果>1，则未能及时到达平面
        return t
    }
}

export default AABB3
