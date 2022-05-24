import * as THREE from "three";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader.js";
import * as CANNON from "cannon-es";
import { CharacterFSM } from "./states/UnitStateMachine";
import TEXTURE from "/VoxelRPGCharacters/Content/Textures/DungeonCrawler_Character.png";

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
      let geometries = [];
      fbx.traverse((c) => {
        if (c.isMesh) {
          c.material.map = texture;
        }
        if (c.geometry) {
          let verts = [];
          let vertices = c.geometry.getAttribute("position");
          for (let i = 0; i < vertices.count; i += 3) {
            verts.push(
              new CANNON.Vec3(
                vertices.array[i],
                vertices.array[i + 1],
                vertices.array[i + 2]
              )
            );
          }
          geometries.push(verts);
          this._body.addShape(new CANNON.ConvexPolyhedron({ vertices: verts }));
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

    this._target.position.copy(this._body.position);
    this._stateMachine.Update(timeInSeconds, this._point);

    if (this._mixer) {
      this._mixer.update(timeInSeconds);
    }
  }
}
