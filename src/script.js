import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "lil-gui";

/**
 * Debug
 */
const gui = new dat.GUI();

const parameters = {
  materialColor: "#ffeded",
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
 * Objects
 */
// Material
const material = new THREE.MeshToonMaterial({
  color: parameters.materialColor,
});

const objectsDistance = 8;

// Meshes
const mesh1 = new THREE.Mesh(new THREE.TorusGeometry(1, 0.4, 16, 60), material);
mesh1.position.y = -objectsDistance * 0;
mesh1.scale.set(0.5, 0.5, 0.5);
const mesh12 = new THREE.Mesh(
  new THREE.TorusGeometry(1, 0.4, 16, 60),
  material
);
mesh12.position.y = -objectsDistance * 0;
mesh12.scale.set(0.5, 0.5, 0.5);

const mesh2 = new THREE.Mesh(new THREE.ConeGeometry(1, 2, 32), material);
mesh2.position.y = -objectsDistance * 1;
mesh2.scale.set(0.5, 0.5, 0.5);

const mesh3 = new THREE.Mesh(
  new THREE.TorusKnotGeometry(0.8, 0.35, 100, 16),
  material
);
mesh3.position.y = -objectsDistance * 2;
mesh3.scale.set(0.5, 0.5, 0.5);
mesh1.position.x = 2;
mesh12.position.x = -2;
mesh12.position.y = -2;
mesh2.position.x = 2;
mesh3.position.x = 2;
gui.addColor(parameters, "materialColor").onChange(() => {
  material.color.set(parameters.materialColor);
});

scene.add(mesh1, mesh2, mesh3, mesh12);
const sectionMeshes = [mesh1, mesh2, mesh3, mesh12];
/**
 * Lights
 */
const directionalLight = new THREE.DirectionalLight("#ffffff", 1);
directionalLight.position.set(1, 1, 0);
scene.add(directionalLight);

/**
 * Scroll
 */
let scrollY = window.scrollY;
window.addEventListener("scroll", () => {
  scrollY = window.scrollY;
});

/**
 * Cursor
 */
const cursor = {};
cursor.x = 0;
cursor.y = 0;
window.addEventListener("mousemove", (event) => {
  cursor.x = event.clientX / sizes.width - 0.5;
  cursor.y = event.clientY / sizes.height - 0.5;

  console.log(cursor);
});

const cameraGroup = new THREE.Group();
scene.add(cameraGroup);
const camera = new THREE.PerspectiveCamera(
  35,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.z = 10;
cameraGroup.add(camera);

// const controls = new OrbitControls(camera, canvas);

const renderer = new THREE.WebGLRenderer({
  canvas,
  alpha: true,
});

renderer.setSize(sizes.width, sizes.height);
renderer.render(scene, camera);

const clock = new THREE.Clock();
let previousTime = 0;
const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  const deltaTime = elapsedTime - previousTime;
  previousTime = elapsedTime;

  // Animate meshes
  for (const mesh of sectionMeshes) {
    mesh.rotation.x = elapsedTime * 0.1;
    mesh.rotation.y = elapsedTime * 0.12;
  }

  camera.position.y = (-scrollY / sizes.height) * objectsDistance;

  const parallaxX = cursor.x * 0.5;
  const parallaxY = -cursor.y * 0.5;
  cameraGroup.position.x +=
    (parallaxX - cameraGroup.position.x) * 5 * deltaTime;
  cameraGroup.position.y +=
    (parallaxY - cameraGroup.position.y) * 5 * deltaTime;

  renderer.render(scene, camera);
  window.requestAnimationFrame(tick);
};
tick();
