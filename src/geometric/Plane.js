import Vector3 from './Vector3'
class Plane {
    static createByBestFitNormal(vextices) {
        let n = vextices.length
        let result = new Vector3()
        let p = vextices[n - 1]
        for (let i = 0; i < n; ++i) {
            let c = vextices[i]
            result.x += (p.z + c.z) * (p.y - c.y)
            result.y += (p.x + c.x) * (p.z - c.z)
            result.z += (p.y + c.y) * (p.x - c.x)
            p = c
        }
        result.normalize()
        return result
    }
}

export default Plane
