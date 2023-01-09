import * as THREE from 'three'
import { OrbitControls } from 'OrbitControls';
import { TrackballControls } from 'TrackballControls';
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
        camera.position.z = 10
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
        function createTexture(){
            let c = document.createElement("canvas");
          c.width = c.height = 256;
          let ctx = c.getContext("2d");
          ctx.fillStyle = "maroon";
            ctx.fillRect(0, 0, c.width, c.height);
          ctx.strokeStyle = "white";
          ctx.beginPath();
          ctx.moveTo(0,0);
          ctx.lineWidth = 100;
          ctx.lineTo(c.width, c.height);
          ctx.stroke();
          
          let texture = new THREE.CanvasTexture(c);
          texture.wrapS = THREE.RepeatWrapping;
          texture.wrapT = THREE.MirroredRepeatWrapping;
          texture.repeat.set(10, 2);
          
          return texture;
        }

        const path = new THREE.Path()
        path.absarc(5, 0, 1, Math.PI * 0.5, Math.PI * 1.5, true)
        path.absarc(-5, 0, 1, Math.PI * 1.5, Math.PI * 0.5, true)
        path.closePath()
        console.log(path)
        const basePts = path.getSpacedPoints(200).reverse()

        const g = new THREE.PlaneGeometry(1,1,200,1)
        basePts.forEach((p, idx) => {
            g.attributes.position.setXYZ(idx, p.x, p.y, -2)
            g.attributes.position.setXYZ(idx + 201, p.x, p.y, 2)
        })

        const m = new THREE.MeshBasicMaterial({
            side: THREE.DoubleSide,
            map: createTexture()
        })
        this._m = m
        const band = new THREE.Mesh(g, m)
        this._scene.add(band)
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
        this._m.map.offset.x = time;
        // this._cube.rotation.x = time
        // this._cube.rotation.y = time
    }
}

window.onload = function (){
    new App()
}