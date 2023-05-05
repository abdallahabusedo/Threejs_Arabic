import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "lil-gui";

/**
 * Debug
 */
const gui = new dat.GUI();
const parameters = {};

/**
 * Scene
 */
const scene = new THREE.Scene();
const canvas = document.querySelector("canvas.webgl");

/**
 * Sizes Object
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

/**
 * Resize Event Listener
 */
window.addEventListener("resize", () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Meshes
 */
//! Cube
const cubeMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
const cubeGeometry = new THREE.BoxGeometry(4, 4, 4, 512, 512, 512);
const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
scene.add(cube);

//! Sphere
const sphereMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
const sphereGeometry = new THREE.SphereGeometry(2, 512, 512);
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
sphere.position.x = 10;
scene.add(sphere);

//! turos
const toursMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
const toursGeometry = new THREE.TorusGeometry(2, 0.4, 512, 512);
const tours = new THREE.Mesh(toursGeometry, toursMaterial);
tours.position.x = -10;
scene.add(tours);
/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.z = 15;
scene.add(camera);

/**
 * Controls
 */
const controls = new OrbitControls(camera, canvas);

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.render(scene, camera);

/**
 * Clock
 */
const clock = new THREE.Clock();

/**
 * Animate Function
 */
const animate = () => {
  const elapsedTime = clock.getElapsedTime();

  cube.rotation.y = 0.1 * elapsedTime;
  sphere.rotation.y = 0.1 * elapsedTime;
  tours.rotation.y = 0.1 * elapsedTime;
  cube.rotation.x = 0.15 * elapsedTime;
  sphere.rotation.x = 0.15 * elapsedTime;
  tours.rotation.x = 0.15 * elapsedTime;
  renderer.render(scene, camera);
  window.requestAnimationFrame(animate);
};
animate();
