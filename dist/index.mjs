import * as THREE from 'three';

function computeBox(o) {
    const b = new THREE.Box3();
    o.traverse(c => {
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
    viewport = { w: 0, h: 0 };
    center = new THREE.Vector3();
    size = new THREE.Vector3();
    world = new THREE.Vector3();
    dir = new THREE.Vector3();
    ray = new THREE.Ray(new THREE.Vector3(), new THREE.Vector3());
    plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
    viewFac = 1;
    constructor(node, element, camera) {
        this.node = node;
        this.element = element;
        this.camera = camera;
        this.resize();
        const wb = new THREE.Box3().setFromObject(node);
        this.center.copy(wb.getCenter(new THREE.Vector3()));
        this.size.copy(computeBox(node).getSize(new THREE.Vector3()));
        window.addEventListener('resize', () => this.resize());
    }
    resize() {
        this.viewport.w = window.innerWidth;
        this.viewport.h = window.innerHeight;
        this.camera.aspect = this.viewport.w / this.viewport.h;
        this.camera.updateProjectionMatrix();
        const f = THREE.MathUtils.degToRad(this.camera.fov) / 2;
        this.viewFac = 2 * Math.tan(f);
    }
    update() {
        const r = this.element.getBoundingClientRect();
        const ndcX = (r.left + r.width * .5) / this.viewport.w * 2 - 1;
        const ndcY = -(r.top + r.height * .5) / this.viewport.h * 2 + 1;
        this.world.set(ndcX, ndcY, .5).unproject(this.camera);
        this.dir.copy(this.world).sub(this.camera.position).normalize();
        this.ray.origin.copy(this.camera.position);
        this.ray.direction.copy(this.dir);
        this.ray.intersectPlane(this.plane, this.node.position);
        const d = this.camera.position.distanceTo(this.node.position);
        const vh = this.viewFac * d;
        const vw = vh * this.camera.aspect;
        const sx = r.width / this.viewport.w * vw / this.size.x;
        const sy = r.height / this.viewport.h * vh / this.size.y;
        const s = Math.min(sx, sy);
        this.node.scale.set(s, s, s * this.size.z / this.size.y);
        this.node.position.x -= this.center.x * s;
        this.node.position.y -= this.center.y * s;
        this.node.position.z -= this.center.z * s;
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
//# sourceMappingURL=index.mjs.map
