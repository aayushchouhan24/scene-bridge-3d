# Scene Bridge 3D

![Shader3-Logo](https://bit.ly/scene-bridge-3d-banner)

`Scene-Bridge-3D` is a sophisticated Three.js extension that revolutionizes 3D web integration by providing precise alignment between 3D meshes and DOM elements, creating a seamless bridge between virtual and traditional web environments while automatically handling complex tasks like real-time synchronization, responsive scaling, and precise positioning of Three.js objects relative to HTML elements - making it an elegant solution for developers building everything from interactive product showcases to dynamic data visualizations and cutting-edge web applications.

#

## 📑 Table of Contents

- [✨ Features](#-features)
- [📦 Installation](#-installation)
- [🛠️ Usage](#%EF%B8%8F-usage)
- [👾 Api](#-api)
- [🌟 Meet the Visionary Behind Shader3](#-meet-the-visionary-behind-shader3)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)
- [🙌 Acknowledgements](#-acknowledgements)

##

## ✨ Features

- 🔥 **Align 3D meshes to HTML DOM elements** with perfect synchronization.
- 📱 **Responsive**: Automatically handles viewport resizing and realigns 3D objects accordingly.
- 🖼️ **Texture loading from images**: Supports easy texture mapping to 3D objects directly from DOM images.
- 🔗 **Seamless Integration**: Works smoothly with Three.js and other web technologies.
- 🎮 **Interactive**: Great for creating interactive UIs with 3D elements.

##

## 📦 Installation

Install `Scene-Bridge-3D` using your preferred package manager:

```bash
npm install scene-bridge-3d
```

or

```bash
yarn add scene-bridge-3d
```

##

## 🛠️ Usage

```javascript
import { DomScene } from "domscene";

const camera = new THREE.PerspectiveCamera(
  1, // lower fov for less destortion
  window.innerWidth / window.innerHeight,
  0.1,
  100
);
camera.position.set(0, 0, 1);

const scene = new DomScene(camera);

const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial();
const el = document.querySelector("#my-dom-element");

const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh, el);

function animate(time) {
  requestAnimationFrame(animate);
  scene.update();
  renderer.render(scene, camera);
}
animate();
```

##

## 🌐 API

### `DomScene`

#### Constructor

```javascript
new DomScene(camera);
```

- **camera** (`THREE.PerspectiveCamera`): The camera used to project the 3D scene.

#### Methods

- **`add(object: THREE.Object3D, domElement: HTMLElement): void`**

  Adds a 3D object and a DOM element to the scene. The 3D object will be aligned with the DOM element.

- **`update(): void`**

  Updates the alignment of all objects in the scene with respect to their associated DOM elements. This is typically called in the animation loop.

##

## 🌟 Meet the Visionary Behind Shader3

In the heart of the dynamic world of web development, the creator of Shader is making waves with their unique visions and unwavering determination.

### 🎮 Aayush Chouhan - [@aayushchouhan24](https://github.com/aayushchouhan24)

![Aayush Chouhan](https://gravatar.com/userimage/226260988/f5429ad9b09c533449dab984eb05cdbf.jpeg?size=1024)

Aayush Chouhan, a tech lover and gaming enthusiast, embarked on a journey through cyberspace. From freelancing to diving into web and Android development, he honed his skills in programming languages. Joining Sheryians, he embraced Three.js, immersing himself in the captivating realm of 3D graphics, marking an exciting milestone in his career.

[![Instagram](https://img.shields.io/badge/Instagram-%23E4405F.svg?style=for-the-badge&logo=Instagram&logoColor=white)](https://www.instagram.com/aayushchouhan_24/) [![LinkedIn](https://img.shields.io/badge/linkedin-%230077B5.svg?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/aayushchouhan24/) [![GitHub](https://img.shields.io/badge/github-%23121011.svg?style=for-the-badge&logo=github&logoColor=white)](https://github.com/aayushchouhan24)

## 🤝 Contributing

We welcome contributions! If you have ideas for new features, bug fixes, or improvements, feel free to open an issue or submit a pull request on our [GitHub repository](https://github.com/aayushchouhan24/shader3).

## 📄 License

`Shader3` is licensed under the ICS License. For more information, refer to the [LICENSE](LICENSE) file.

## 🙌 Acknowledgements

- **[Three.js](https://threejs.org/):** The core library for 3D rendering.
