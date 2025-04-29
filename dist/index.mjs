import * as THREE from 'three';

function computeBox(o) {
    const b = new THREE.Box3();
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
    center = new THREE.Vector3();
    size = new THREE.Vector3();
    world = new THREE.Vector3();
    dir = new THREE.Vector3();
    ray = new THREE.Ray();
    plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
    tempV1 = new THREE.Vector3(); // reuse temp vectors
    tempV2 = new THREE.Vector3();
    constructor(node, element, camera) {
        this.node = node;
        this.element = element;
        this.camera = camera;
        const wb = new THREE.Box3().setFromObject(node);
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
        const vh = 2 * Math.tan(THREE.MathUtils.DEG2RAD * 0.5 * this.camera.fov) * dist;
        const vw = vh * this.camera.aspect;
        const pixelToWorldX = vw / w;
        const pixelToWorldY = vh / h;
        // Only update if attribute exists
        const dz = this.element.hasAttribute("data-z")
            ? parseFloat(this.element.getAttribute("data-z") ?? "0")
            : 0;
        const rotX = this.element.hasAttribute("data-rot-x")
            ? THREE.MathUtils.DEG2RAD *
                parseFloat(this.element.getAttribute("data-rot-x") ?? "0")
            : 0;
        const rotY = this.element.hasAttribute("data-rot-y")
            ? THREE.MathUtils.DEG2RAD *
                parseFloat(this.element.getAttribute("data-rot-y") ?? "0")
            : 0;
        const rotZ = this.element.hasAttribute("data-rot-z")
            ? THREE.MathUtils.DEG2RAD *
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

class Scene extends THREE.Scene {
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

export { Scene as default };
