import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

/**
 * Create the Scene
 */
const scene = new THREE.Scene();

/**
 * Fetch the canvas from the DOM
 */
const canvas = document.querySelector("canvas.webgl");

/**
 * Set the sizes of the window
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

/**
 * handel resizing the screen
 */
window.addEventListener("resize", () => {
  // by updating the width and the height
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;
  // and updating the aspect ratio of the camera
  camera.aspect = sizes.width / sizes.height;
  // don forget to update the camera
  camera.updateProjectionMatrix();
  // and update the renderer sizes
  renderer.setSize(sizes.width, sizes.height);
  // and limit the pixel ratio for better performance
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

//! ** 1 **
/**
 * Cube
 */
// const cube = new THREE.Mesh(
//   // Geometry
//   new THREE.BoxGeometry(4, 4, 4),
//   // Material
//   new THREE.MeshBasicMaterial({ color: 0xff0000 })
// );
// // don't forget to add it to the scene
// scene.add(cube);
//! ** 2 **
// // or we can do this
// // Geometry
// const cubeGeometry = new THREE.BoxGeometry(4, 4, 4);
// // Material
// const cubeMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
// // mesh must have the geometry and the material
// const cubeMesh = new THREE.Mesh(cubeGeometry, cubeMaterial);
// cube.position.x = 10;
// // add it to the scene
// scene.add(cubeMesh);

// PerspectiveCamera
const camera = new THREE.PerspectiveCamera(
  // Fov
  75,
  // ratio
  sizes.width / sizes.height,
  // near
  0.1,
  // far
  1000
);

// moving the camera far from us to see the cube
camera.position.z = 20;

// add te camera to the scene
scene.add(camera);

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

// pass the canvas to the renderer
const renderer = new THREE.WebGLRenderer({
  canvas,
});
// set the sizes of the renderer
renderer.setSize(sizes.width, sizes.height);
// pass the scene and the camera to the renderer
renderer.render(scene, camera);

// get the clock class from three js
const clock = new THREE.Clock();

// animate function
const animate = () => {
  // get the elapsedTime from the clock class
  const elapsedTime = clock.getElapsedTime();

  controls.update();
  // render the renderer every frame
  renderer.render(scene, camera);
  // call the function every frame
  window.requestAnimationFrame(animate);
};
// function call
animate();
