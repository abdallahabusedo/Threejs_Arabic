import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import fragment from "./shaders/test/fragment.glsl";
import vertex from "./shaders/test/vertex.glsl";
const scene = new THREE.Scene();

const canvas = document.querySelector("canvas.webgl");

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.z = 20;
scene.add(camera);

window.addEventListener("resize", () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

//? Step 1: Change the MeshBasicMaterial to RawShaderMaterial
//? Step 2: Provide the RawShaderMaterial with a vertex and fragment shader
//? Step 3: Make you make it with `` not ''
//? Step 4: Add the following code to the vertex shader
//? Step 5: Add the following code to the fragment shader
//? Step 6: Create the New file of vertex and fragment shader
//? Step 7: Copy the code from the vertex and fragment shader to the new file
//? Step 8: Import the new file to the main file
//? Step 9: Install the GLSL extension in the VSCode
//? Step 10: Test the code
//! Note 1: map, alphaMap, opacity, and color are not available in RawShaderMaterial because they are handled in the shader
//! Note 2: The RawShaderMaterial does have a wireframe property.
//! Note 3: There is no console and, thus, no way to log values. That is due to the code being executed for every vertex and every fragment. It would make no sense to log one value or because it runs on the GPU not the CPU.
//! Note 4: The indentation is not essential. You can indent as you like.
//! Note 6: The semicolon is required to end any instruction. Forgetting even one semicolon will probably result in a compilation error, and the whole material won't work.
//! Note 7: It's a typed language, meaning that we must specify a variable's type, and we cannot assign any other type to that variable.
//! Note 8: In JS you can assign any type to a variable, but in GLSL you must specify the type of the variable.

const cube = new THREE.Mesh(
  new THREE.PlaneBufferGeometry(2, 3, 32, 32),
  new THREE.RawShaderMaterial({
    vertexShader: vertex,
    fragmentShader: fragment,
    // wireframe: true,
    // side: THREE.DoubleSide,
  })
);
scene.add(cube);

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
