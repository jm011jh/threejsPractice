import * as THREE from 'three'
import { OrbitControls } from 'OrbitControls';
import { FontLoader } from 'FontLoader';
import { TextGeometry } from 'TextGeometry';
class App {
    constructor(){
        
        const divContainer = document.getElementById("webgl-container")
        this._divContainer = divContainer

        const renderer = new THREE.WebGLRenderer({antialias : true})
        renderer.setPixelRatio(window.devicePixelRatio)
        divContainer.appendChild(renderer.domElement)
        this._renderer = renderer

        const scene = new THREE.Scene()
        this._scene = scene

        this._setupCamera()
        this._setupLight()
        this._setupModel()
        this._setupControls()

        window.onresize = this.resize.bind(this)
        this.resize()

        requestAnimationFrame(this.render.bind(this))
    }
    _setupCamera() {
        const width = this._divContainer.clientWidth
        const height = this._divContainer.clientHeight
        const camera = new THREE.PerspectiveCamera(
            75,
            width / height,
            0.1,
            100
        )
        // camera.position.x = -15
        camera.position.z = 50
        this._camera = camera
    }
    _setupLight() {
        const color = 0xffffff
        const intensity = 1
        const light = new THREE.DirectionalLight(color, intensity)
        light.position.set(-1, 2, 4)
        this._scene.add(light)
    }
    _setupControls() {
        new OrbitControls(this._camera, this._divContainer)
    }
    _setupModel() {
        const vertices = []
        for(let i = 0; i < 10000; i++) {
            const x = THREE.Math.randFloatSpread(5)
            const y = THREE.Math.randFloatSpread(5)
            const z = THREE.Math.randFloatSpread(5)
            vertices.push(x,y,z)
        }
        
        const geometry = new THREE.BufferGeometry()
        geometry.setAttribute(
            "position",
            new THREE.Float32BufferAttribute(vertices, 3)
        )
        const sprite = new THREE.TextureLoader().load(
            "./circle.png"
        )
        const material = new THREE.PointsMaterial({
            map: sprite,
            alphaTest: 0.5,
            // color: 0xff0000,
            size: 0.1,
            sizeAttenuation: true
        })

        const points = new THREE.Points(geometry, material)
        this._scene.add(points)
    }
    // _setupModel() {
    //     const vertices = [
    //         -1, 1, 0,
    //         1, 1, 0,
    //         -1, -1, 0,
    //         1, -1, 0,
    //     ]

    //     const geometry = new THREE.BufferGeometry()
    //     geometry.setAttribute("position",
    //         new THREE.Float32BufferAttribute(vertices, 3)
    //     )

    //     const material = new THREE.LineDashedMaterial({
    //         color: 0xffff00,
    //         dashSize: 0.2,
    //         gapSize: 0.1,
    //         scale: 1,
    //     })

    //     const line = new THREE.LineLoop(geometry,material)
    //     line.computeLineDistances()//dash선에 적용
    //     this._scene.add(line)
    // }
    // _setupModel() {
    //     const fontLoader = new FontLoader()
    //     async function loadFont(that) {
    //         const url = "../../examples/fonts/helvetiker_regular.typeface.json"
    //         const font = await new Promise((res, rej) => {
    //             fontLoader.load(url, res, undefined, rej)
    //         })
            
    //         const geometry = new TextGeometry("welcome",{
    //             font: font,
    //             size: 10,
    //             height: 1,
    //             curveSegments: 12,
    //             bevelEnabled: false,
    //             bevelThickness: 1,
    //             bevelSize: 1,
    //             bevelOffset: 0,
    //             bevelSegments: 1
    //         })

    //         const fillMaterial = new THREE.MeshPhongMaterial({color: 0x515151})
    //         const cube = new THREE.Mesh(geometry, fillMaterial)
    
    //         const lineMaterial = new THREE.LineBasicMaterial({color: 0xffff00})
    //         const line = new THREE.LineSegments(
    //             new THREE.WireframeGeometry(geometry), lineMaterial
    //         )
    
    //         const group = new THREE.Group()
    //         group.add(cube)
    //         group.add(line)
    
    //         that._scene.add(group)
    //         that._cube = group
    //     }
    //     loadFont(this)
    // }
    resize() {
        const width = this._divContainer.clientWidth
        const height = this._divContainer.clientHeight

        this._camera.aspect = width / height
        this._camera.updateProjectionMatrix()
        
        this._renderer.setSize(width, height)
    }

    render(time) {
        this._renderer.render(this._scene, this._camera)
        this.update(time)
        requestAnimationFrame(this.render.bind(this))
    }
    update(time) {
        time *= 0.001
        // this._cube.rotation.x = time
        // this._cube.rotation.y = time
    }
}

window.onload = function (){
    new App()
}