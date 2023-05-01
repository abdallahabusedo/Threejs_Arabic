import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import gsap from "gsap"; // npm install gsap

/**
 * ! Step 1
 * npm install --save lil-gui
 */

/**
 * ! Step 2
 */
import * as dat from "lil-gui";
/**
 * Debug
 */
const gui = new dat.GUI();
const parameters = {
  color: 0xff0000,
  spin: () => {
    gsap.to(mesh.rotation, { duration: 1, y: mesh.rotation.y + Math.PI * 2 });
  },
};

const scene = new THREE.Scene();

const canvas = document.querySelector("canvas.webgl");

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Cube
 */
const mesh = new THREE.Mesh(
  new THREE.BoxGeometry(4, 4, 4),
  new THREE.MeshBasicMaterial({ color: parameters.color })
);
scene.add(mesh);

/**
 * Tweaks
 */
gui.add(mesh.position, "y");
gui.add(mesh.position, "x", -3, 3, 0.01);
gui.add(mesh.position, "z").min(-3).max(3).step(0.01).name("elevation");
gui.add(mesh, "visible");
gui.add(mesh.material, "wireframe");
console.log(mesh.material.color);
gui.addColor(parameters, "color").onChange(() => {
  mesh.material.color.set(parameters.color);
});
gui.add(parameters, "spin");
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.z = 20;
scene.add(camera);

const controls = new OrbitControls(camera, canvas);

const renderer = new THREE.WebGLRenderer({
  canvas,
});

renderer.setSize(sizes.width, sizes.height);
renderer.render(scene, camera);

const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  renderer.render(scene, camera);
  window.requestAnimationFrame(tick);
};
tick();
