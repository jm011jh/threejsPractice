import * as THREE from 'three'
import { OrbitControls } from 'OrbitControls';
import { RectAreaLight, TorusGeometry } from 'three';
import { RectAreaLightUniformsLib } from 'RectAreaLightUniformsLib';
import { RectAreaLightHelper } from 'RectAreaLightHelper';
class App {
    constructor(){
        
        const divContainer = document.getElementById("webgl-container")
        this._divContainer = divContainer

        const renderer = new THREE.WebGLRenderer({antialias : true})
        renderer.setPixelRatio(window.devicePixelRatio)
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
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
        camera.position.set(7,7,0)
        camera.lookAt(0,0,0)
        this._camera = camera
    }
    _setupLight() {
        // const light_amb = new THREE.AmbientLight(0xffffff, 0.01)
        // this._scene.add(light_amb)
        // this._light_amb = light_amb
        
        // const light_hemi = new THREE.HemisphereLight("#b0d8f5", "#bb7a1c", 0.1)
        // this._scene.add(light_hemi)
        // this._light_hemi = light_hemi

        const light_aux = new THREE.DirectionalLight(0xffffff, 0.5)
        light_aux.position.set(0,5,0)
        light_aux.target.position.set(0,0,0)
        this._scene.add(light_aux.target)
        this._scene.add(light_aux)

        // const light_direct = new THREE.DirectionalLight(0xffffff, 0.5)
        // light_direct.position.set(0,5,0)
        // light_direct.target.position.set(0,0,0)
        // this._scene.add(light_direct.target)
        // light_direct.shadow.camera.top = light_direct.shadow.camera.right = 6
        // light_direct.shadow.camera.bottom = light_direct.shadow.camera.left = -6

        const light_direct = new THREE.PointLight(0xffffff, 0.7)
        light_direct.position.set(0,5,0)
        light_direct.shadow.mapSize.width = light_direct.shadow.mapSize.height = 2048
        light_direct.shadow.radius = 4

        this._scene.add(light_direct)
        this._light_direct = light_direct
        light_direct.castShadow = true;

        // const cameraHelper = new THREE.CameraHelper(light_direct.shadow.camera)
        // this._scene.add(cameraHelper)

        // const light_direct_helper = new THREE.DirectionalLightHelper(light_direct)
        // this._scene.add(light_direct_helper)
        // this._light_direct_helper = light_direct_helper

        // const light_point = new THREE.PointLight(0xffffff, 0.2)
        // light_point.position.set(0,5,0)
        // light_point.distance = 0
        // this._scene.add(light_point)
        // this._light_point = light_point

        // const light_point_helper = new THREE.PointLightHelper(light_point)
        // this._scene.add(light_point_helper)
        // this._light_point_helper = light_point_helper

        // const light_spot = new THREE.SpotLight(0xffffff, 0.1)
        // light_spot.position.set(0,5,0)
        // light_spot.target.position.set(0,0,0)
        // light_spot.angle = THREE.Math.degToRad(50)
        // light_spot.penumbra = 0.5
        // this._scene.add(light_spot.target)
        // this._scene.add(light_spot)
        // this._light_spot = light_spot

        // const light_spot_helper = new THREE.SpotLightHelper(light_spot)
        // this._scene.add(light_spot_helper)
        // this._light_spot_helper = light_spot_helper

        // RectAreaLightUniformsLib.init()
        // const light_rect = new THREE.RectAreaLight(0xffffff, 10, 7, 0.5)
        // light_rect.position.set(0,5,0)
        // light_rect.rotation.x = THREE.Math.degToRad(-90)
        
        // const light_rect_helper = new RectAreaLightHelper(light_rect)
        // light_rect.add(light_rect_helper)
        
        // this._scene.add(light_rect)
        // this._light_rect = light_rect
    }
    _setupControls() {
        new OrbitControls(this._camera, this._divContainer)
    }
    _setupModel() {
        const geom_ground = new THREE.PlaneGeometry(10,10)
        const mate_ground = new THREE.MeshStandardMaterial({
            color: "#2c3e50",
            roughness: 0.5,
            metalness: 0.5,
            side: THREE.DoubleSide
        })
        const mesh_ground = new THREE.Mesh( geom_ground, mate_ground )
        mesh_ground.rotation.x = THREE.Math.degToRad(-90);
        mesh_ground.receiveShadow = true
        this._scene.add(mesh_ground)

        //big sphere
        // const bigSphereGeometry = new THREE.SphereGeometry(1.5, 64, 64, 0, Math.PI)
        const bigSphereGeometry = new THREE.TorusKnotGeometry(1, 0.3, 128, 64, 2, 3)
        const bigSphereMaterial = new THREE.MeshStandardMaterial({
            color: "#ffffff",
            roughness: 0.1,
            metalness: 0.2
        })
        const bigSphere = new THREE.Mesh(bigSphereGeometry,bigSphereMaterial)
        // bigSphere.rotation.x = THREE.Math.degToRad(-90)
        bigSphere.position.y = 1.6
        bigSphere.receiveShadow = true
        bigSphere.castShadow = true
        this._scene.add(bigSphere)

        //torus multiple
        const torusGeometry = new TorusGeometry(0.4, 0.1, 32, 32)
        const torusMaterial = new THREE.MeshStandardMaterial({
            color: "#9b59b6",
            roughness: 0.5,
            metalness: 0.9
        })
        for (let i = 0; i < 16; i++) {
            const torusPivot = new THREE.Object3D()
            const torus = new THREE.Mesh(torusGeometry, torusMaterial)
            torusPivot.rotation.y = THREE.Math.degToRad(22.5 * i)
            torus.position.set(3, 0.5, 0)
            torus.receiveShadow = true
            torus.castShadow = true
            torusPivot.add(torus)
            this._scene.add(torusPivot)
        }

        //small sphere
        const smallSphereGeometry = new THREE.SphereGeometry(0.3, 32, 32)
        const smallSphereMaterial = new THREE.MeshStandardMaterial({
            color : "#e74c3c",
            roughness: 0.2,
            metalness: 0.5
        })
        const smallSpherePivot = new THREE.Object3D()
        const smallSphere = new THREE.Mesh(smallSphereGeometry,smallSphereMaterial)
        smallSpherePivot.add(smallSphere)
        smallSpherePivot.name = "smallSpherePivot"
        smallSphere.position.set(3,0.5,0)
        smallSphere.receiveShadow = true
        smallSphere.castShadow = true
        this._scene.add(smallSpherePivot)
    }
    resize() {
        const width = this._divContainer.clientWidth
        const height = this._divContainer.clientHeight

        this._camera.aspect = width / height
        this._camera.updateProjectionMatrix()
        
        this._renderer.setSize(width, height)
    }
    update(time) {
        time *= 0.001

        const smallSpherePivot = this._scene.getObjectByName("smallSpherePivot")
        
        if(smallSpherePivot) {
            smallSpherePivot.rotation.y = THREE.Math.degToRad(time*50)

            if(this._light_direct.target){
                const smallSphere = smallSpherePivot.children[0]
                smallSphere.getWorldPosition(this._light_direct.target.position)

                if(this._light_direct_helper) this._light_direct_helper.update()
            }
            if(this._light_direct instanceof THREE.PointLight){
                const smallSphere = smallSpherePivot.children[0]
                smallSphere.getWorldPosition(this._light_direct.position)
            }
            // if(this._light_point){
            //     const smallSphere = smallSpherePivot.children[0]
            //     smallSphere.getWorldPosition(this._light_point.position)

            //     if(this._light_point_helper) this._light_point_helper.update()
            // }
            // if(this._light_spot){
            //     const smallSphere = smallSpherePivot.children[0]
            //     smallSphere.getWorldPosition(this._light_spot.target.position)

            //     if(this._light_spot_helper) this._light_spot_helper.update()
            // }
        }
    }
    render(time) {
        
        this._renderer.render(this._scene, this._camera)
        this.update(time)
        requestAnimationFrame(this.render.bind(this))
    }
}

window.onload = function (){
    new App()
}