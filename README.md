# Scene Bridge 3D

![Scene-Bridge-3D-Logo](https://bit.ly/scene-bridge-3d-banner)

`Scene-Bridge-3D` is a sophisticated Three.js extension that revolutionizes 3D web integration by providing precise alignment between 3D meshes and DOM elements. It creates a seamless bridge between virtual and traditional web environments, automatically handling complex tasks like real-time synchronization, responsive scaling, DOM-driven positioning and rotation, and precise projection of Three.js objects relative to HTML elements — making it an elegant solution for developers building everything from interactive product showcases to dynamic data visualizations and cutting-edge web applications.

#

## 📑 Table of Contents

- [✨ Features](#-features)
- [📦 Installation](#-installation)
- [🛠️ Usage](#%EF%B8%8F-usage)
- [🌐 API](#-api)
- [🌟 Meet the Visionary Behind Shader3](#-meet-the-visionary-behind-shader3)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)
- [🙌 Acknowledgements](#-acknowledgements)

##

## ✨ Features

- 🔥 **Align 3D meshes to HTML DOM elements** with pixel-perfect synchronization.
- 🔄 **Real-time updates**: Dynamically syncs positions and rotations based on DOM attribute values (`data-z`, `data-rot-x`, `data-rot-y`, `data-rot-z`).
- 📱 **Responsive scaling**: Adapts to window resizes automatically.
- 📷 **Perspective-correct mapping**: 3D meshes appear exactly over corresponding HTML elements.
- 🎮 **Full DOM-driven control**: Change mesh `position.z`, rotations, **and even X/Y positions and width/height** via DOM.
- ⚡ **Optimized for performance**: Only updates meshes if relevant attributes are present.
- 🖼️ **Texture loading from images** (Optional, for future versions).
- 🔗 **Seamless integration** with Three.js, GSAP, and modern web tools.
- 🚀 **Ultra-lightweight** and easy to integrate.

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

---

### Basic Example

```javascript
import Scene from "scene-bridge-3d";

const camera = new THREE.PerspectiveCamera(
  1, // Lower FOV for less distortion
  window.innerWidth / window.innerHeight,
  0.1,
  100
);
camera.position.set(0, 0, 1);

const scene = new Scene(camera);

const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });

const mesh = new THREE.Mesh(geometry, material);
const el = document.querySelector("#my-dom-element");

scene.add(mesh, el);

function animate() {
  requestAnimationFrame(animate);
  scene.update();
  renderer.render(scene, camera);
}
animate();
```

---

### Advanced Example (Using DOM Attributes)

Add attributes to your HTML element:

```html
<div
  id="my-dom-element"
  data-z="0.5"
  data-rot-x="45"
  data-rot-y="30"
  data-rot-z="15"
></div>
```

- `data-z`: Move along the Z-axis (in Three.js units).
- `data-rot-x`: Rotate on X-axis (in degrees).
- `data-rot-y`: Rotate on Y-axis (in degrees).
- `data-rot-z`: Rotate on Z-axis (in degrees).

✅ `Scene-Bridge-3D` reads these every frame automatically!

---

### GSAP Animation Example

Easily animate the DOM element's attributes dynamically using **GSAP**:

```javascript
import gsap from "gsap";

// Animate the DOM element's attributes
gsap.to("#my-dom-element", {
  duration: 2,
  attr: {
    "data-z": 1,
    "data-rot-x": 360,
    "data-rot-y": 360,
    "data-rot-z": 360,
  },
  repeat: -1,
  yoyo: true,
  ease: "power2.inOut",
});
```

- The mesh will **move in Z** and **rotate** around **X**, **Y**, and **Z** axes.
- No manual mesh transformation needed — everything driven through DOM attributes.

---

### Animate X/Y Position, Width and Height!

⚡ `Scene-Bridge-3D` automatically syncs:

- DOM `x` and `y` (left, top)
- DOM `width` and `height`

with the 3D mesh's position and size.  
This means **you can move and resize your mesh** just by animating the DOM element!

For example, using **CSS**:

```css
#my-dom-element {
  transition: all 0.5s ease;
}
#my-dom-element:hover {
  left: 200px;
  top: 100px;
  width: 150px;
  height: 150px;
}
```

Or using **GSAP**:

```javascript
gsap.to("#my-dom-element", {
  duration: 2,
  left: 300,
  top: 150,
  width: 200,
  height: 200,
  ease: "power2.inOut",
});
```

✅ As the DOM element **moves or resizes**, the linked 3D mesh **moves and scales perfectly** along with it!

---

##

## 🌐 API

### `Scene`

#### Constructor

```javascript
new Scene(camera);
```

- **camera** (`THREE.PerspectiveCamera`): The camera used to project and sync the 3D scene.

---

#### Methods

- **`add(object: THREE.Object3D, domElement: HTMLElement): void`**

  > Associates a 3D object with a DOM element for automatic alignment and transformation.

- **`update(): void`**

  > Updates all linked meshes based on the latest DOM element attributes and layout.  
  > **Call this inside your animation loop.**

---

### Supported Attributes and Layout Mapping

| Source                   | Effect in 3D mesh           | How to animate                |
| ------------------------ | --------------------------- | ----------------------------- |
| `left` + `top` (CSS)     | Mesh X/Y position           | Animate with CSS or GSAP      |
| `width` + `height` (CSS) | Mesh scaling in X/Y         | Animate with CSS or GSAP      |
| `data-z`                 | Mesh position in Z-axis     | Animate with GSAP or manually |
| `data-rot-x`             | Mesh rotation around X-axis | Animate with GSAP or manually |
| `data-rot-y`             | Mesh rotation around Y-axis | Animate with GSAP or manually |
| `data-rot-z`             | Mesh rotation around Z-axis | Animate with GSAP or manually |

---

##

## 🌟 Meet the Visionary Behind Shader3

In the dynamic world of web development, the creator of Shader3 and Scene-Bridge-3D is making waves with unique visions and unwavering creativity.

### 🎮 Aayush Chouhan - [@aayushchouhan24](https://github.com/aayushchouhan24)

![Aayush Chouhan](https://gravatar.com/userimage/226260988/f5429ad9b09c533449dab984eb05cdbf.jpeg?size=1024)

Aayush Chouhan, a tech enthusiast and gamer at heart, embarked on an exciting journey from freelancing to mastering web and Android development. Joining Sheryians Coding School, he delved deep into Three.js and 3D web graphics, pushing the boundaries of web experiences with his innovative tools and libraries.

[![Instagram](https://img.shields.io/badge/Instagram-%23E4405F.svg?style=for-the-badge&logo=Instagram&logoColor=white)](https://www.instagram.com/aayushchouhan_24/) [![LinkedIn](https://img.shields.io/badge/linkedin-%230077B5.svg?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/aayushchouhan24/) [![GitHub](https://img.shields.io/badge/github-%23121011.svg?style=for-the-badge&logo=github&logoColor=white)](https://github.com/aayushchouhan24)

---

##

## 🤝 Contributing

We welcome contributions!  
If you have ideas for new features, bug fixes, or improvements, feel free to open an issue or submit a pull request on our [GitHub repository](https://github.com/aayushchouhan24/shader3).

---

##

## 📄 License

`Scene-Bridge-3D` is licensed under the ICS License.  
For more information, refer to the [LICENSE](LICENSE) file.

---

##

## 🙌 Acknowledgements

- **[Three.js](https://threejs.org/)**: The core engine powering the 3D magic.
- **[GSAP](https://greensock.com/gsap/)**: For mind-blowing web animations.
- **[Sheryians Coding School](https://sheryians.com/)**: For supporting innovation and creativity.

---

# 🚀 Let’s Bridge the Virtual and Real Worlds Together!
