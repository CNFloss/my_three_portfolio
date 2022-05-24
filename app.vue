<script setup>
import { onMounted } from "vue";
import * as THREE from "three";
import * as CANNON from "cannon-es";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { BasicCharacterController } from "./utils/BasicCharacterController.js";
import PickHelper from "./utils/PickHelper";

class CharacterControllerDemo {
  constructor() {
    this._Initialize();
  }

  _Initialize() {
    this._world = new CANNON.World({ gravity: new CANNON.Vec3(0, -9.82, 0) });
    this._threejs = new THREE.WebGLRenderer({
      antialias: true,
    });
    this._threejs.outputEncoding = THREE.sRGBEncoding;
    this._threejs.shadowMap.enabled = true;
    this._threejs.shadowMap.type = THREE.PCFSoftShadowMap;
    this._threejs.setPixelRatio(window.devicePixelRatio);
    this._threejs.setSize(window.innerWidth, window.innerHeight);

    document.body.appendChild(this._threejs.domElement);

    this._pickHelper = new PickHelper();

    window.addEventListener(
      "resize",
      () => {
        this._OnWindowResize();
      },
      false
    );

    window.addEventListener("click", (event) => {
      const rect = this._threejs.domElement.getBoundingClientRect();
      const point = this._pickHelper.pick(
        {
          x:
            ((event.clientX - rect.left) /
              this._threejs.domElement.clientWidth) *
              2 -
            1,
          y:
            ((event.clientY - rect.top) /
              this._threejs.domElement.clientHeight) *
              -2 +
            1,
        },
        this._scene,
        this._camera
      );
      this._controls._point = point;
    });

    const fov = 60;
    const aspect = 1920 / 1080;
    const near = 1.0;
    const far = 1000.0;
    this._camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    this._camera.position.set(25, 10, 25);

    this._scene = new THREE.Scene();

    let light = new THREE.DirectionalLight(0xffffff, 1.0);
    light.position.set(-100, 100, 100);
    light.target.position.set(0, 0, 0);
    light.castShadow = true;
    light.shadow.bias = -0.001;
    light.shadow.mapSize.width = 4096;
    light.shadow.mapSize.height = 4096;
    light.shadow.camera.near = 0.5;
    light.shadow.camera.far = 500.0;
    light.shadow.camera.left = 50;
    light.shadow.camera.right = -50;
    light.shadow.camera.top = 50;
    light.shadow.camera.bottom = -50;
    this._scene.add(light);

    light = new THREE.AmbientLight(0xffffff, 0.25);
    this._scene.add(light);

    const controls = new OrbitControls(this._camera, this._threejs.domElement);
    controls.target.set(0, 10, 0);
    controls.update();

    const plane = new THREE.Mesh(
      new THREE.PlaneGeometry(100, 100, 10, 10),
      new THREE.MeshStandardMaterial({
        color: 0x808080,
      })
    );
    plane.castShadow = false;
    plane.receiveShadow = true;
    plane.quaternion.setFromEuler(new THREE.Euler(-Math.PI / 2, 0, 0), "XYZ");
    this._scene.add(plane);
    const groundBody = new CANNON.Body({
      type: CANNON.Body.STATIC,
      shape: new CANNON.Plane(),
    });
    groundBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0);
    plane.position.copy(groundBody.position);
    this._world.addBody(groundBody);

    this._mixers = [];
    this._previousRAF = null;

    this._LoadAnimatedModel();

    this._RAF();
  }

  _LoadAnimatedModel() {
    const params = {
      camera: this._camera,
      scene: this._scene,
      world: this._world,
    };
    this._controls = new BasicCharacterController(params);
  }

  _OnWindowResize() {
    this._camera.aspect = window.innerWidth / window.innerHeight;
    this._camera.updateProjectionMatrix();
    this._threejs.setSize(window.innerWidth, window.innerHeight);
  }

  _RAF() {
    requestAnimationFrame((t) => {
      if (this._previousRAF === null) {
        this._previousRAF = t;
      }

      this._RAF();

      this._threejs.render(this._scene, this._camera);
      this._Step(t - this._previousRAF);
      this._previousRAF = t;
    });
    this._world.fixedStep();
  }

  _Step(timeElapsed) {
    const timeElapsedS = timeElapsed * 0.001;
    if (this._mixers) {
      this._mixers.map((m) => m.update(timeElapsedS));
    }

    if (this._controls) {
      this._controls.Update(timeElapsedS);
    }
  }
}

let _APP = null;

onMounted(() => {
  window.addEventListener("DOMContentLoaded", () => {
    _APP = new CharacterControllerDemo();
  });
});
</script>

<template>
  <div></div>
</template>

<style>
html,
body {
  margin: 0;
  height: 100%;
}

#c {
  width: 100%;
  height: 100%;
  display: block;
}
</style>
