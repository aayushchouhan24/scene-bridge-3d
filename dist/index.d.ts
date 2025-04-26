import * as THREE from "three";
export default class Scene extends THREE.Scene {
    camera: THREE.PerspectiveCamera;
    private aligned;
    constructor(camera: THREE.PerspectiveCamera);
    add(object: THREE.Object3D, domElement: Element): this;
    add(...objects: THREE.Object3D[]): this;
    update(): void;
}
