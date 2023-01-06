import * as THREE from 'three'
import { OrbitControls } from 'OrbitControls';
import { TorusGeometry } from 'three';
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
        // const light_amb = new THREE.AmbientLight(0xffffff, 5)
        // this._scene.add(light_amb)
        // this._light_amb = light_amb
        
        // const light_hemi = new THREE.HemisphereLight("#b0d8f5", "#bb7a1c", 1)
        // this._scene.add(light_hemi)
        // this._light_hemi = light_hemi

        // const light_direct = new THREE.DirectionalLight(0xffffff, 1)
        // light_direct.position.set(0,5,0)
        // light_direct.target.position.set(0,0,0)
        // this._scene.add(light_direct.target)
        // this._scene.add(light_direct)
        // this._light_direct = light_direct

        // const light_direct_helper = new THREE.DirectionalLightHelper(light_direct)
        // this._scene.add(light_direct_helper)
        // this._light_direct_helper = light_direct_helper

        const light_point = new THREE.PointLight(0xffffff, 2)
        light_point.position.set(0,5,0)
        light_point.distance = 1
        this._scene.add(light_point)
        this._light_point = light_point

        const light_point_helper = new THREE.PointLightHelper(light_point)
        this._scene.add(light_point_helper)
        this._light_point_helper = light_point_helper
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
            mesh_ground.receiveShadow = true;
            mesh_ground.scale.set(100,100,100)

            // mesh_ground.rotation.x = Math.PI / 2;
            mesh_ground.rotation.x = THREE.Math.degToRad(-90);
        this._scene.add(mesh_ground)

        //big sphere
        const bigSphereGeometry = new THREE.SphereGeometry(1.5, 64, 64, 0, Math.PI)
        const bigSphereMaterial = new THREE.MeshStandardMaterial({
            color: "#ffffff",
            roughness: 0.1,
            metalness: 0.2
        })
        const bigSphere = new THREE.Mesh(bigSphereGeometry,bigSphereMaterial)
        bigSphere.rotation.x = THREE.Math.degToRad(-90)
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

            // if(this._light_direct.target){
            //     const smallSphere = smallSpherePivot.children[0]
            //     smallSphere.getWorldPosition(this._light_direct.target.position)

            //     if(this._light_direct_helper) this._light_direct_helper.update()
            // }
            if(this._light_point){
                const smallSphere = smallSpherePivot.children[0]
                smallSphere.getWorldPosition(this._light_point.position)

                if(this._light_point_helper) this._light_point_helper.update()
            }
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