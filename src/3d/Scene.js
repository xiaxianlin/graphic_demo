import Shape from '~/3d/shape/Shape'

class Scene {
    shapes = []
    lights = []
    camera = null

    add(shape) {
        if (!(shape instanceof Shape)) {
            return -1
        }
        return this.shapes.push(shape)
    }
}

export default Scene
