import * as THREE from "three";

function computeBox(o: THREE.Object3D): THREE.Box3 {
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

export class DomObject {
  private center = new THREE.Vector3();
  private size = new THREE.Vector3();
  private world = new THREE.Vector3();
  private dir = new THREE.Vector3();
  private ray = new THREE.Ray();
  private plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);

  private tempV1 = new THREE.Vector3(); // reuse temp vectors
  private tempV2 = new THREE.Vector3();

  constructor(
    private node: THREE.Object3D,
    private element: Element,
    private camera: THREE.PerspectiveCamera
  ) {
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
    const dz = this.element.hasAttribute("data-z") ? parseFloat(this.element.getAttribute("data-z") ?? "0") : 0;
    const rotX = this.element.hasAttribute("data-rot-x") ? THREE.MathUtils.DEG2RAD * parseFloat(this.element.getAttribute("data-rot-x") ?? "0") : 0;
    const rotY = this.element.hasAttribute("data-rot-y") ? THREE.MathUtils.DEG2RAD * parseFloat(this.element.getAttribute("data-rot-y") ?? "0") : 0;
    const rotZ = this.element.hasAttribute("data-rot-z") ? THREE.MathUtils.DEG2RAD * parseFloat(this.element.getAttribute("data-rot-z") ?? "0") : 0;

    // Update Z only if attribute is present
    if (this.element.hasAttribute("data-z")) this.node.position.z += dz * pixelToWorldY;

    const sx = (r.width * pixelToWorldX) / this.size.x;
    const sy = (r.height * pixelToWorldY) / this.size.y;
    const s = Math.min(sx, sy);

    this.node.scale.set(s, s, (s * this.size.z) / this.size.y);

    this.node.position.x -= this.center.x * s;
    this.node.position.y -= this.center.y * s;
    this.node.position.z -= this.center.z * s;

    if (this.element.hasAttribute("data-rot-x") || this.element.hasAttribute("data-rot-y") || this.element.hasAttribute("data-rot-z"))
      this.node.rotation.set(rotX, rotY, rotZ);

  }
}
