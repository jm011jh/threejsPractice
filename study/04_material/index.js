import * as THREE from 'three'
import { OrbitControls } from 'OrbitControls';
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
        camera.position.z = 3
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
    /*
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
    */
    /*
    _setupModel() {
        const vertices = [
            -1, 1, 0,
            1, 1, 0,
            -1, -1, 0,
            1, -1, 0,
        ]

        const geometry = new THREE.BufferGeometry()
        geometry.setAttribute("position",
            new THREE.Float32BufferAttribute(vertices, 3)
        )

        const material = new THREE.LineDashedMaterial({
            color: 0xffff00,
            dashSize: 0.2,
            gapSize: 0.1,
            scale: 1,
        })

        const line = new THREE.LineLoop(geometry,material)
        line.computeLineDistances()//dash선에 적용
        this._scene.add(line)
    }
    */
    _setupModel() {
        const material = new THREE.MeshBasicMaterial({
            //Material 클래스의 기본속성
            visible: true,
            transparent: false,
            opacity: 1,
            depthTest: true,
            depthWrite: true,
            //

            color: 0xffffff,
            wireframe: false
        })
        const material2 = new THREE.MeshLambertMaterial({
            transparent: true,
            opacity: 0.5,
            color: 0xff0000,
            emissive: 0x000000,
            side: THREE.DoubleSide,//FrontSide,BackSide
            wireframe: false
        })
        const material3 = new THREE.MeshPhongMaterial({
            color : 0xffffff,
            emissive: 0x000000,
            specular: 0x0000ff,
            shininess: 5,
            flatShading: false,
            wireframe: false
        })
        const material4 = new THREE.MeshStandardMaterial({
            color: 0xff0000,
            emissive: 0x100000,
            roughness: 0.25,
            metalness: 0.5,
            wireframe: false,
            flatShading: false,
        })
        const material5 = new THREE.MeshPhysicalMaterial({
            color: 0xff0000,
            emissive: 0x000000,
            roughness: 1,
            metalness: 0,
            clearcoat: 1,
            clearcoatRoughness: 0,
            wireframe: false,
            flatShading: false,
        })
        const box = new THREE.Mesh(new THREE.BoxGeometry(1,1,1), material5)
        box.position.set(-1,0,0)
        this._scene.add(box)
        
        const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.7, 32, 32), material5)
        sphere.position.set(1,0,0)
        this._scene.add(sphere)
    }
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
    }
}

window.onload = function (){
    new App()
}