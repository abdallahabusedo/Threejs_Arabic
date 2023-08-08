import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
/**
 * Scene
 */
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x4f4daf);

const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderConfig({ type: "js" });
dracoLoader.setDecoderPath("https://www.gstatic.com/draco/v1/decoders/");

// Load models
const gltfLoader = new GLTFLoader();
gltfLoader.setDRACOLoader(dracoLoader);

gltfLoader.load("/models/Duck/glTF-Draco/Duck.gltf", (gltf) => {
  gltf.scene.position.x = -4;

  scene.add(gltf.scene);
});

gltfLoader.load("/models/Duck/glTF/Duck.gltf", (gltf) => {
  gltf.scene.children[0].position.x = -2;

  scene.add(gltf.scene);
}); // Default glTF

// Or
gltfLoader.load("/models/Duck/glTF-Binary/Duck.glb", (gltf) => {
  gltf.scene.children[0].position.x = 4;

  scene.add(gltf.scene.children[0]);
}); // glTF-Binary

// Or;
gltfLoader.load("/models/Duck/glTF-Embedded/Duck.gltf", (gltf) => {
  gltf.scene.children[0].position.x = 2;
  scene.add(gltf.scene.children[0]);
}); // glTF-Embedded

gltfLoader.load("/models/FlightHelmet/glTF/FlightHelmet.gltf", (gltf) => {
  const children = [...gltf.scene.children];
  for (const child of children) {
    scene.add(child);
  }
});
let mixer = null;

gltfLoader.load("/models/Fox/glTF/Fox.gltf", (gltf) => {
  gltf.scene.scale.set(0.03, 0.03, 0.03);
  gltf.scene.position.y = 2;
  scene.add(gltf.scene);

  mixer = new THREE.AnimationMixer(gltf.scene);
  const action = mixer.clipAction(gltf.animations[2]);
  action.play();
});
/**
 * Canvas
 */
const canvas = document.querySelector("canvas.webgl");

/**
 * window Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

/**
 * Handle Resizing window
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
 * Lights
 */
/** Ambient Light  **/
const ambientLight = new THREE.AmbientLight(0xfffddd, 0.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(0, 1, 2);
scene.add(directionalLight);

// /**
//  * Cube
//  */
// const cube = new THREE.Mesh(
//   new THREE.BoxGeometry(4, 4, 4),
//   new THREE.MeshStandardMaterial()
// );
// scene.add(cube);

/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.z = 6;
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
 * Animation
 */
const clock = new THREE.Clock();
let previousTime = 0;
const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  const deltaTime = elapsedTime - previousTime;
  previousTime = elapsedTime;
  controls.update();
  if (mixer) {
    mixer.update(deltaTime);
  }
  renderer.render(scene, camera);
  window.requestAnimationFrame(tick);
};
tick();
