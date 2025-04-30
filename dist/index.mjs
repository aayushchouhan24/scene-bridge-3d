import * as THREE from 'three';

// src/index.ts
function computeBox(o) {
  let hasMesh = false;
  const box = new THREE.Box3();
  o.traverse((child) => {
    if (child instanceof THREE.Mesh && child.geometry) {
      hasMesh = true;
      child.geometry.computeBoundingBox();
    }
  });
  if (hasMesh) box.expandByObject(o);
  return box;
}
var DomObject = class {
  constructor(node, element, camera) {
    this.node = node;
    this.element = element;
    this.camera = camera;
    this.center = new THREE.Vector3();
    this.size = new THREE.Vector3();
    this.world = new THREE.Vector3();
    this.dir = new THREE.Vector3();
    this.ray = new THREE.Ray();
    this.plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
    this.tempV1 = new THREE.Vector3();
    // reuse temp vectors
    this.tempV2 = new THREE.Vector3();
    const wb = new THREE.Box3().setFromObject(node);
    this.center.copy(wb.getCenter(this.tempV1));
    this.size.copy(computeBox(node).getSize(this.tempV2));
  }
  update() {
    const r = this.element.getBoundingClientRect();
    const w = window.innerWidth;
    const h = window.innerHeight;
    const ndcX = (r.left + r.width * 0.5) / w * 2 - 1;
    const ndcY = -(r.top + r.height * 0.5) / h * 2 + 1;
    this.world.set(ndcX, ndcY, 0.5).unproject(this.camera);
    this.dir.copy(this.world).sub(this.camera.position).normalize();
    this.ray.origin.copy(this.camera.position);
    this.ray.direction.copy(this.dir);
    this.ray.intersectPlane(this.plane, this.node.position);
    const dist = this.camera.position.distanceTo(this.node.position);
    const vh = 2 * Math.tan(THREE.MathUtils.DEG2RAD * 0.5 * this.camera.fov) * dist;
    const vw = vh * this.camera.aspect;
    const pixelToWorldX = vw / w;
    const pixelToWorldY = vh / h;
    const dz = this.element.hasAttribute("data-z") ? parseFloat(this.element.getAttribute("data-z") ?? "0") : 0;
    const rotX = this.element.hasAttribute("data-rot-x") ? THREE.MathUtils.DEG2RAD * parseFloat(this.element.getAttribute("data-rot-x") ?? "0") : 0;
    const rotY = this.element.hasAttribute("data-rot-y") ? THREE.MathUtils.DEG2RAD * parseFloat(this.element.getAttribute("data-rot-y") ?? "0") : 0;
    const rotZ = this.element.hasAttribute("data-rot-z") ? THREE.MathUtils.DEG2RAD * parseFloat(this.element.getAttribute("data-rot-z") ?? "0") : 0;
    if (this.element.hasAttribute("data-z")) this.node.position.z += dz * pixelToWorldY;
    const sx = r.width * pixelToWorldX / this.size.x;
    const sy = r.height * pixelToWorldY / this.size.y;
    const s = Math.min(sx, sy);
    this.node.scale.set(s, s, s * this.size.z / this.size.y);
    this.node.position.x -= this.center.x * s;
    this.node.position.y -= this.center.y * s;
    this.node.position.z -= this.center.z * s;
    if (this.element.hasAttribute("data-rot-x") || this.element.hasAttribute("data-rot-y") || this.element.hasAttribute("data-rot-z"))
      this.node.rotation.set(rotX, rotY, rotZ);
  }
};

// src/index.ts
var Scene2 = class extends THREE.Scene {
  constructor(camera) {
    super();
    this.camera = camera;
    this.aligned = [];
  }
  add(...args) {
    if (args.length === 2 && args[1] instanceof Element) {
      const [object, el] = args;
      const domObj = new DomObject(object, el, this.camera);
      this.aligned.push(domObj);
      super.add(object);
      return this;
    }
    super.add(...args);
    return this;
  }
  update() {
    this.aligned.forEach((o) => o.update());
  }
};

export { Scene2 as default };
//# sourceMappingURL=index.mjs.map
//# sourceMappingURL=index.mjs.map