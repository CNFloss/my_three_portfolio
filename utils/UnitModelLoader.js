import * as THREE from "three";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader.js";
import * as CANNON from "cannon-es";
import TEXTURE from "/VoxelRPGCharacters/Content/Textures/DungeonCrawler_Character.png";
import CannonUtils from "./CannonUtils";

/*
This code has 6 main responsibilities:
  1) initializing a BasicCharacterController,
  2) loading a model,
  3) setting up physics,
  4) setting up animations,
  5) rendering,
  6) parsing user input. It's best to split each one of these up into separate classes/functions
*/

export class UnitModelLoader {
  constructor(params) {
    this._body = new CANNON.Body({ mass: 5 });
    this._Init(params);
  }

  _Init(params) {
    this._params = params;
    this._animations = {};
    this._rootNode = new THREE.Object3D();

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
      const { x, y, z } = this._params.point;
      this._body.position.set(x, y, z);
      this._target = fbx;
      this._rootNode.add(this._target);
      this._rootNode.position.copy(this._body.position);
      this._rootNode.quaternion.copy(this._body.quaternion);

      this._mixer = new THREE.AnimationMixer(this._target);

      this._manager = new THREE.LoadingManager();
      this._manager.onLoad = () => {
        this._params.assetCallback(this._animations);
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
}
