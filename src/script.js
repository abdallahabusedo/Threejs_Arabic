import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

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

const cube = new THREE.Mesh(
  new THREE.BoxGeometry(4, 4, 4),
  new THREE.MeshBasicMaterial({ color: 0xff0000 })
);
scene.add(cube);
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

// method 1 using Date.now
let time = Date.now();

// method 2 using Clock class
const clock = new THREE.Clock();

const tick = () => {
  //method 1
  // const currentTime = Date.now();
  // const deltaTime = currentTime - time;
  // time = currentTime;
  // cube.rotation.y += 0.01 * deltaTime;

  // method 2
  const elapsedTime = clock.getElapsedTime();
  // cube.rotation.y = elapsedTime;

  // animation 1
  // cube.rotation.x = elapsedTime;

  // animation 2
  // cube.scale.x = Math.sin(elapsedTime);

  // animation 3
  // cube.position.x = Math.cos(elapsedTime) * 10;
  // cube.position.y = Math.sin(elapsedTime) * 10;

  // animation 4
  // camera.position.x = Math.cos(elapsedTime) * 10;
  // camera.position.y = Math.sin(elapsedTime) * 10;
  // camera.lookAt(cube.position);

  renderer.render(scene, camera);
  window.requestAnimationFrame(tick);
};
tick();
