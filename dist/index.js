'use strict';

var THREE = require('three');

function _interopNamespace(e) {
  if (e && e.__esModule) return e;
  var n = Object.create(null);
  if (e) {
    Object.keys(e).forEach(function (k) {
      if (k !== 'default') {
        var d = Object.getOwnPropertyDescriptor(e, k);
        Object.defineProperty(n, k, d.get ? d : {
          enumerable: true,
          get: function () { return e[k]; }
        });
      }
    });
  }
  n.default = e;
  return Object.freeze(n);
}

var THREE__namespace = /*#__PURE__*/_interopNamespace(THREE);

// src/index.ts
function computeBox(o) {
  let hasMesh = false;
  const box = new THREE__namespace.Box3();
  o.traverse((child) => {
    if (child instanceof THREE__namespace.Mesh && child.geometry) {
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
    this.center = new THREE__namespace.Vector3();
    this.size = new THREE__namespace.Vector3();
    this.world = new THREE__namespace.Vector3();
    this.dir = new THREE__namespace.Vector3();
    this.ray = new THREE__namespace.Ray();
    this.plane = new THREE__namespace.Plane(new THREE__namespace.Vector3(0, 0, 1), 0);
    this.tempV1 = new THREE__namespace.Vector3();
    // reuse temp vectors
    this.tempV2 = new THREE__namespace.Vector3();
    const wb = new THREE__namespace.Box3().setFromObject(node);
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
    const vh = 2 * Math.tan(THREE__namespace.MathUtils.DEG2RAD * 0.5 * this.camera.fov) * dist;
    const vw = vh * this.camera.aspect;
    const pixelToWorldX = vw / w;
    const pixelToWorldY = vh / h;
    const dz = this.element.hasAttribute("data-z") ? parseFloat(this.element.getAttribute("data-z") ?? "0") : 0;
    const rotX = this.element.hasAttribute("data-rot-x") ? THREE__namespace.MathUtils.DEG2RAD * parseFloat(this.element.getAttribute("data-rot-x") ?? "0") : 0;
    const rotY = this.element.hasAttribute("data-rot-y") ? THREE__namespace.MathUtils.DEG2RAD * parseFloat(this.element.getAttribute("data-rot-y") ?? "0") : 0;
    const rotZ = this.element.hasAttribute("data-rot-z") ? THREE__namespace.MathUtils.DEG2RAD * parseFloat(this.element.getAttribute("data-rot-z") ?? "0") : 0;
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
var Scene2 = class extends THREE__namespace.Scene {
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

module.exports = Scene2;
//# sourceMappingURL=index.js.map
//# sourceMappingURL=index.js.map