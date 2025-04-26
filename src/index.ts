import * as THREE from "three";
import { DomObject } from "./DomObject";

export default class Scene extends THREE.Scene {
  private aligned: DomObject[] = [];

  constructor(public camera: THREE.PerspectiveCamera) {
    super();
  }

  add(object: THREE.Object3D, domElement: Element): this;
  add(...objects: THREE.Object3D[]): this;
  add(...args: any[]): this {
    if (args.length === 2 && args[1] instanceof Element) {
      const [object, el] = args as [THREE.Object3D, Element];
      const domObj = new DomObject(object, el, this.camera);
      this.aligned.push(domObj);
      super.add(object);
      return this;
    }
    super.add(...(args as THREE.Object3D[]));
    return this;
  }

  update() {
    this.aligned.forEach((o) => o.update());
  }
}
