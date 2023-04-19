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

//! PerspectiveCamera
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

//! OrthographicCamera
// const aspectRatio = sizes.width / sizes.height;
// const OrthographicCamera = new THREE.OrthographicCamera(
//   // left
//   -1,
//   // right
//   1,
//   // top
//   1,
//   // bottom
//   -1,
//   // near
//   0.1,
//   // far
//   100
// );
// camera.position.z = 20;
// scene.add(OrthographicCamera);
// add the orbitControl
const controls = new OrbitControls(camera, canvas);

//! Cursor Events
//! why outside the event listener because of the js scoping
const cursor = {
  x: 0,
  y: 0,
};
//! add the event listener mousemove
window.addEventListener("mousemove", (event) => {
  //! --1-- check the event object
  // console.log(event.clientX, event.clientY)
  //! --2-- update the value of the cursor
  // cursor.x = event.clientX;
  // cursor.y = event.clientY;
  //! --3-- normalize the value of the cursor
  // cursor.x = event.clientX / sizes.width - 0.5;
  // cursor.y = event.clientY / sizes.height - 0.5;
  //! check the values
  // console.log(cursor.x, cursor.y);
});

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

  //! --1-- update the camera (**don't forget the - in the y direction**)
  // camera.position.x = cursor.x
  // camera.position.y = cursor.y

  //! --2--
  // camera.position.x = cursor.x * 5;
  // camera.position.y = cursor.y * 5;
  // camera.lookAt(mesh.position);

  //! --3--
  // camera.position.x = Math.sin(cursor.x * Math.PI * 2) * 2;
  // camera.position.z = Math.cos(cursor.x * Math.PI * 2) * 2;
  // camera.position.y = cursor.y * 3;
  // camera.lookAt(mesh.position);

  // render the renderer every frame
  renderer.render(scene, camera);
  // call the function every frame
  window.requestAnimationFrame(animate);
};
// function call
animate();
