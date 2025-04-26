import * as THREE from 'three';
export declare class DomObject {
    private node;
    private element;
    private camera;
    private viewport;
    private center;
    private size;
    private world;
    private dir;
    private ray;
    private plane;
    private viewFac;
    constructor(node: THREE.Object3D, element: Element, camera: THREE.PerspectiveCamera);
    private resize;
    update(): void;
}
