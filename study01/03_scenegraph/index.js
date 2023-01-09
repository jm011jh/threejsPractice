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
        camera.position.z = 25
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
        //태양계-오브젝트 정의 및 추가
        const solarSystem = new THREE.Object3D()
        this._scene.add(solarSystem)

        //구체모양 정의
        const radius = 1
        const widthSegments = 120
        const heightSegments = 120
        const sphereGeometry = new THREE.SphereGeometry(radius, widthSegments, heightSegments)
        
        const sunMaterial = new THREE.MeshPhongMaterial({
            emissive : 0xffff00, flatShading: true
        })
        const sunMesh = new THREE.Mesh(sphereGeometry, sunMaterial)
            sunMesh.scale.set(3,3,3)
        solarSystem.position.x = 0
        solarSystem.add(sunMesh)

        //지구-오브젝트 정의 및 추가
        const earthOrbit = new THREE.Object3D()
        solarSystem.add(earthOrbit)
        
        const earthMaterial = new THREE.MeshPhongMaterial({
            color: 0x2233ff, emissive: 0x112244, flatShading: true
        })
        const earthMesh = new THREE.Mesh(sphereGeometry, earthMaterial)
            earthMesh.scale.set(1,1,1)
        earthOrbit.position.x = 10
        earthOrbit.add(earthMesh)
        
        //달-오브젝트 정의 및 추가
        const moonOrbit = new THREE.Object3D()
        earthOrbit.add(moonOrbit)
        
        const moonMaterial = new THREE.MeshPhongMaterial({
            color: 0x888888, emissive: 0x222222, flatShading: true
        })
        const moonMesh = new THREE.Mesh(sphereGeometry, moonMaterial)
            moonMesh.scale.set(0.5, 0.5, 0.5)
        moonOrbit.position.x = 2
        moonOrbit.add(moonMesh)

        //마무리
        this._solarSystem = solarSystem
        this._earthOrbit = earthOrbit
        this._moonOrbit = moonOrbit
    }
    resize() {
        const width = this._divContainer.clientWidth
        const height = this._divContainer.clientHeight

        this._camera.aspect = width / height
        this._camera.updateProjectionMatrix()
        
        this._renderer.setSize(width, height)
    }

    render(time) {
        time *= 0.001
        this._renderer.render(this._scene, this._camera)
        this.update(time)
        requestAnimationFrame(this.render.bind(this))
    }
    update(time) {
        this._solarSystem.rotation.y = time / 2
        this._earthOrbit.rotation.y = time * 2
        this._moonOrbit.rotation.y = time * 5
    }
}

window.onload = function (){
    new App()
}