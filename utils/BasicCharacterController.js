import * as THREE from "three";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader.js";
import * as CANNON from "cannon-es";
import { CharacterFSM } from "./states/UnitStateMachine";
import TEXTURE from "/VoxelRPGCharacters/Content/Textures/DungeonCrawler_Character.png";
import CannonUtils from "./CannonUtils";

class BasicCharacterControllerProxy {
  constructor(animations) {
    this._animations = animations;
  }

  get animations() {
    return this._animations;
  }
}

export class BasicCharacterController {
  constructor(params) {
    this._body = new CANNON.Body({ mass: 5 });
    this._Init(params);
  }

  _Init(params) {
    this._params = params;
    this._point = null;
    this._animations = {};
    this._stateMachine = new CharacterFSM(
      new BasicCharacterControllerProxy(this._animations)
    );

    this._LoadModels();
  }

  _LoadModels() {
    const textureLoader = new THREE.TextureLoader();
    const texture = textureLoader.load(TEXTURE, (texture) => {
      return texture;
    });
    const loader = new FBXLoader();
    loader.setPath("/VoxelRPGCharacters/Content/Characters/");
    loader.load("DungeonCrawler_Character.fbx", (fbx) => {
      fbx.scale.setScalar(0.1);
      fbx.traverse((c) => {
        if (c.isMesh && c.geometry) {
          c.material.map = texture;
          let geometry = c.geometry;
          let physicsShape = CannonUtils.CreateConvexPolyhedron(geometry, 0.1);
          this._body.addShape(physicsShape);
        }
        c.castShadow = true;
      });

      this._body.position.set(0, 5, 0);
      this._params.world.addBody(this._body);
      this._target = fbx;
      this._params.scene.add(this._target);

      this._mixer = new THREE.AnimationMixer(this._target);

      this._manager = new THREE.LoadingManager();
      this._manager.onLoad = () => {
        this._stateMachine.SetState("idle");
      };

      const _OnLoad = (animName, anim) => {
        const clip = anim.animations[0];
        const action = this._mixer.clipAction(clip);

        this._animations[animName] = {
          clip: clip,
          action: action,
        };
      };

      const loader = new FBXLoader(this._manager);
      loader.setPath("/Animations/");
      loader.load("Standard_Walk.fbx", (a) => {
        _OnLoad("walk", a);
      });
      loader.load("Standing_Idle.fbx", (a) => {
        _OnLoad("idle", a);
      });
    });
  }

  Update(timeInSeconds) {
    if (!this._target) {
      return;
    }

    if (this._point) {
      const temp = new CANNON.Vec3(this._point.x, this._point.y, this._point.z);
      console.log(
        (Math.atan2(
          this._body.position.z - this._point.z,
          this._body.position.x - this._point.x
        ) *
          180) /
          Math.PI
      );
      /*this._body.quaternion.setFromEuler(
        0,
        Math.atan2(
          this._body.position.z - this._point.z,
          this._body.position.x - this._point.x
        ),
        0
      );*/
      this._point = null;
    }

    this._target.position.copy(this._body.position);
    this._target.quaternion.copy(this._body.quaternion);
    this._stateMachine.Update(timeInSeconds, this._point);

    if (this._mixer) {
      this._mixer.update(timeInSeconds);
    }
  }
}
