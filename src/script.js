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

/**
 * Cube
 */
const cube = new THREE.Mesh(
  // Geometry
  new THREE.BoxGeometry(4, 4, 4),
  // Material
  new THREE.MeshBasicMaterial({ color: 0xff0000 })
);
// don't forget to add it to the scene
scene.add(cube);

// Camera
const camera = new THREE.PerspectiveCamera(
  // Fov
  75,
  // ratio
  sizes.width / sizes.height,
  // near
  0.1,
  // far
  100
);
// moving the camera far from us to see the cube
camera.position.z = 20;

// add te camera to the sceen
scene.add(camera);

// add the orbitControl
const controls = new OrbitControls(camera, canvas);

// pass the canvas to the renderer
const renderer = new THREE.WebGLRenderer({
  canvas,
});
// set the sizes of the renderer
renderer.setSize(sizes.width, sizes.height);
// pass the scene and the camera to the renderer
renderer.render(scene, camera);

//! method 1 using Date.now
let time = Date.now();

//! method 2 using Clock class
const clock = new THREE.Clock();

const tick = () => {
  //! method 1
  // const currentTime = Date.now();
  // const deltaTime = currentTime - time;
  // time = currentTime;
  // cube.rotation.y += 0.01 * deltaTime;

  //! method 2
  const elapsedTime = clock.getElapsedTime();
  // cube.rotation.y = elapsedTime;

  //! animation 1
  // cube.rotation.x = elapsedTime;

  //! animation 2
  // cube.scale.x = Math.sin(elapsedTime);

  //! animation 3
  // cube.position.x = Math.cos(elapsedTime) * 10;
  // cube.position.y = Math.sin(elapsedTime) * 10;

  //! animation 4
  // camera.position.x = Math.cos(elapsedTime) * 10;
  // camera.position.y = Math.sin(elapsedTime) * 10;
  // camera.lookAt(cube.position);

  // render the renderer every frame
  renderer.render(scene, camera);
  // call the function every frame
  window.requestAnimationFrame(tick);
};
// function call
tick();
