import * as THREE from 'three'
import Figure from './Figure.js'

const perspective = 800

export default class Scene {
    constructor() {
        this.container = document.getElementById('stage')

        this.scene = new THREE.Scene()
        this.renderer = new THREE.WebGLRenderer({
            canvas: this.container,
            alpha: true
        })

        this.renderer.setSize(window.innerWidth, window.innerHeight)
        this.renderer.setPixelRatio(window.devicePixelRatio)

        this.initLights()
        this.initCamera()

        this.figure = new Figure(this.scene, () => {
            this.update()
        })

        window.onresize = this.resize.bind(this)
        this.resize()
    }

    initLights() {
        const ambientlight = new THREE.AmbientLight(0xffffff, 2)
        this.scene.add(ambientlight)
    }

    initCamera() {
        const fov =
            (180 * (2 * Math.atan(window.innerHeight / 2 / perspective))) / Math.PI

        this.camera = new THREE.PerspectiveCamera(
            fov,
            window.innerWidth / window.innerHeight,
            1,
            1000
        )
        this.camera.position.set(0, 0, perspective)
    }

    update() {
        if (this.renderer === undefined) return
        requestAnimationFrame(this.update.bind(this))

        this.figure.update()

        this.renderer.render(this.scene, this.camera)
    }
    resize() {
        console.log('hi')
        const width = this.container.clientWidth
        const height = this.container.clientHeight
        this.renderer.setSize(width, height)
    }
}