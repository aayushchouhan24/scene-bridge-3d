import * as THREE from "three";
export declare class DomObject {
    private node;
    private element;
    private camera;
    private center;
    private size;
    private world;
    private dir;
    private ray;
    private plane;
    private tempV1;
    private tempV2;
    constructor(node: THREE.Object3D, element: Element, camera: THREE.PerspectiveCamera);
    update(): void;
}
