(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('three')) :
  typeof define === 'function' && define.amd ? define(['three'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.SceneBridge3D = factory(global.THREE));
})(this, (function (THREE) { 'use strict';

  function _interopNamespaceDefault(e) {
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

  var THREE__namespace = /*#__PURE__*/_interopNamespaceDefault(THREE);

  function computeBox(o) {
      const b = new THREE__namespace.Box3();
      o.traverse((c) => {
          if (c.geometry) {
              c.geometry.computeBoundingBox();
              b.expandByObject(c);
          }
      });
      return b;
  }
  class DomObject {
      node;
      element;
      camera;
      center = new THREE__namespace.Vector3();
      size = new THREE__namespace.Vector3();
      world = new THREE__namespace.Vector3();
      dir = new THREE__namespace.Vector3();
      ray = new THREE__namespace.Ray();
      plane = new THREE__namespace.Plane(new THREE__namespace.Vector3(0, 0, 1), 0);
      tempV1 = new THREE__namespace.Vector3(); // reuse temp vectors
      tempV2 = new THREE__namespace.Vector3();
      constructor(node, element, camera) {
          this.node = node;
          this.element = element;
          this.camera = camera;
          const wb = new THREE__namespace.Box3().setFromObject(node);
          this.center.copy(wb.getCenter(this.tempV1));
          this.size.copy(computeBox(node).getSize(this.tempV2));
      }
      update() {
          const r = this.element.getBoundingClientRect();
          const w = window.innerWidth;
          const h = window.innerHeight;
          const ndcX = ((r.left + r.width * 0.5) / w) * 2 - 1;
          const ndcY = (-(r.top + r.height * 0.5) / h) * 2 + 1;
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
          // Only update if attribute exists
          const dz = this.element.hasAttribute("data-z")
              ? parseFloat(this.element.getAttribute("data-z") ?? "0")
              : 0;
          const rotX = this.element.hasAttribute("data-rot-x")
              ? THREE__namespace.MathUtils.DEG2RAD *
                  parseFloat(this.element.getAttribute("data-rot-x") ?? "0")
              : 0;
          const rotY = this.element.hasAttribute("data-rot-y")
              ? THREE__namespace.MathUtils.DEG2RAD *
                  parseFloat(this.element.getAttribute("data-rot-y") ?? "0")
              : 0;
          const rotZ = this.element.hasAttribute("data-rot-z")
              ? THREE__namespace.MathUtils.DEG2RAD *
                  parseFloat(this.element.getAttribute("data-rot-z") ?? "0")
              : 0;
          // Update Z only if attribute is present
          if (this.element.hasAttribute("data-z")) {
              this.node.position.z += dz * pixelToWorldY; // use vertical scale for Z movement
          }
          const sx = (r.width * pixelToWorldX) / this.size.x;
          const sy = (r.height * pixelToWorldY) / this.size.y;
          const s = Math.min(sx, sy);
          this.node.scale.set(s, s, (s * this.size.z) / this.size.y);
          this.node.position.x -= this.center.x * s;
          this.node.position.y -= this.center.y * s;
          this.node.position.z -= this.center.z * s;
          // Update rotation only if attribute is present
          if (this.element.hasAttribute("data-rot-x") ||
              this.element.hasAttribute("data-rot-y") ||
              this.element.hasAttribute("data-rot-z")) {
              this.node.rotation.set(rotX, rotY, rotZ);
          }
      }
  }

  class Scene extends THREE__namespace.Scene {
      camera;
      aligned = [];
      constructor(camera) {
          super();
          this.camera = camera;
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
  }

  return Scene;

}));
