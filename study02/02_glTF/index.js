import * as THREE from 'three'
import { GLTFLoader } from 'GLTFLoader'
import { OrbitControls } from 'OrbitControls'
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
    _setupControls() {
        new OrbitControls(this._camera, this._divContainer)
    }
    _zoomFit(object3D, camera) {
        //모델 경계 박스
        const box = new THREE.Box3().setFromObject(object3D)
        //모델의 경계 박스 대각 길이
        const sizeBox = box.getSize(new THREE.Vector3()).length()
        //모델의 경계 박스 중심 위치
        const centerBox = box.getCenter(new THREE.Vector3())
        //모델크기의 절반값
        const halfSizeModel = sizeBox * 0.5
        //카메라의 fov의 절반값
        const halfFov = THREE.MathUtils.degToRad(camera.fov * .5)
        //모델을 화면에 꽉 채우기 위한 거리
        const distance = halfSizeModel / Math.tan(halfFov)
        //모델 중심에서 카메라 위치로 향하는 방향 단위 벡터 계산
        const direction = (new THREE.Vector3()).subVectors(
            camera.position, centerBox
        ).normalize()

        //"단위 방향 벡터" 방향으로 모델 중심 위치에서 distance 거리에 대한 위치
        const position = direction.multiplyScalar(distance).add(centerBox)
        camera.position.copy(position)

        camera.near = sizeBox / 100
        camera.far = sizeBox * 100

        camera.updateProjectionMatrix()

        camera.lookAt(centerBox.x, centerBox.y, centerBox.z)

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
        camera.position.z = 4
        this._camera = camera
        this._scene.add(this._camera);
    }
    _setupLight() {
        const color = 0xffffff
        const intensity = 1
        const light = new THREE.DirectionalLight(color, intensity)
        light.position.set(-1, 2, 4)
        // this._scene.add(light)
        this._camera.add(light)
    }
    _setupModel() {
        const gltfLoader = new GLTFLoader()
        const url = '../data/adamHead/adamHead.gltf'
        gltfLoader.load(
            url,
            (gltf) => {
                const root = gltf.scene
                this._scene.add(root)
            }
        )
        
        
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
        // this._cube.rotation.x = time
        // this._cube.rotation.y = time
    }
}

window.onload = function (){
    new App()
}