import * as THREE from "three";
import { Vector3 } from "three";

export default class PickHelper {
  constructor() {
    this.raycaster = new THREE.Raycaster();
    this.pickedObject = null;
  }
  pick(normalizedPosition, scene, camera) {
    if (this.pickedObject) {
      this.pickedObject = null;
    }
    // cast a ray through the frustrum
    this.raycaster.setFromCamera(normalizedPosition, camera);
    // get the list of objects the ray intersected
    const intersectedObjects = this.raycaster.intersectObjects(scene.children);
    if (intersectedObjects.length) {
      console.log(intersectedObjects[0].point);
      this.pickedObject = intersectedObjects[0].object;
      const point = new Vector3().copy(intersectedObjects[0].point);
      point.y = 0;
      return point;
    }
  }
}
