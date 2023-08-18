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

const pointer = new THREE.Vector2();
const raycaster = new THREE.Raycaster();
const addNewBoxMesh = (x, y, z) => {
  const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
  const boxMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
  const boxMesh = new THREE.Mesh(boxGeometry, boxMaterial);
  boxMesh.position.set(x, y, z);
  scene.add(boxMesh);
};

addNewBoxMesh(0, 2, 0);
addNewBoxMesh(2, 2, 0);
addNewBoxMesh(-2, 2, 0);
addNewBoxMesh(0, 2, -2);
addNewBoxMesh(2, 2, -2);
addNewBoxMesh(-2, 2, -2);
addNewBoxMesh(0, 2, 2);
addNewBoxMesh(2, 2, 2);
addNewBoxMesh(-2, 2, 2);

addNewBoxMesh(0, 0, 0);
addNewBoxMesh(2, 0, 0);
addNewBoxMesh(-2, 0, 0);
addNewBoxMesh(0, 0, -2);
addNewBoxMesh(2, 0, -2);
addNewBoxMesh(-2, 0, -2);
addNewBoxMesh(0, 0, 2);
addNewBoxMesh(2, 0, 2);
addNewBoxMesh(-2, 0, 2);

addNewBoxMesh(0, -2, 0);
addNewBoxMesh(2, -2, 0);
addNewBoxMesh(-2, -2, 0);
addNewBoxMesh(0, -2, -2);
addNewBoxMesh(2, -2, -2);
addNewBoxMesh(-2, -2, -2);
addNewBoxMesh(0, -2, 2);
addNewBoxMesh(2, -2, 2);
addNewBoxMesh(-2, -2, 2);
/**
 * Mouse
 */
const mouse = new THREE.Vector2();

window.addEventListener("mousemove", (event) => {
  mouse.x = (event.clientX / sizes.width) * 2 - 1;
  mouse.y = -(event.clientY / sizes.height) * 2 + 1;
});

const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.z = 10;
scene.add(camera);

const controls = new OrbitControls(camera, canvas);

const renderer = new THREE.WebGLRenderer({
  canvas,
});

renderer.setSize(sizes.width, sizes.height);
renderer.render(scene, camera);

const clock = new THREE.Clock();

let currentIntersect = null;

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  raycaster.setFromCamera(mouse, camera);

  const objectsToTest = scene.children.filter(
    (e) => e.isPerspectiveCamera != true
  );
  const intersects = raycaster.intersectObjects(objectsToTest);

  // for (const intersect of intersects) {
  //   intersect.object.material.color.set("#0000ff");
  // }

  for (let i = 0; i < intersects.length; i++) {
    intersects[0].object.material.color.set("#0000ff");
  }

  for (const object of objectsToTest) {
    if (!intersects.find((intersect) => intersect.object === object)) {
      object.material.color.set("#ff0000");
    }
  }
  if (intersects.length) {
    if (!currentIntersect) {
      // Mouse Enter
      currentIntersect = intersects[0];
      currentIntersect.object.scale.set(1.5, 1.5, 1.5);
    }
  } else {
    if (currentIntersect) {
      // Mouse Leave
      currentIntersect.object.scale.set(1, 1, 1);
      currentIntersect = null;
    }
  }

  controls.update();

  renderer.render(scene, camera);
  window.requestAnimationFrame(tick);
};
tick();
