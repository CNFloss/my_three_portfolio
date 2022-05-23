import FiniteStateMachine from "./FiniteStateMachine";
import WalkState from "./WalkState";
import IdleState from "./IdleState";

export class CharacterFSM extends FiniteStateMachine {
  constructor(proxy) {
    super();
    this._proxy = proxy;
    this._Init();
  }

  _Init() {
    this._AddState("idle", IdleState);
    this._AddState("walk", WalkState);
  }
}
