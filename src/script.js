import * as dat from "dat.gui";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

const gui = new dat.GUI();
const scene = new THREE.Scene();

// scene background color
const cubeTextureLoader = new THREE.CubeTextureLoader();
const environmentMapTexture = cubeTextureLoader.load([
  "/map/px.png",
  "/map/nx.png",
  "/map/py.png",
  "/map/ny.png",
  "/map/pz.png",
  "/map/nz.png",
]);
scene.background = environmentMapTexture;

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
  // Update effect composer
  effectComposer.setSize(sizes.width, sizes.height);
  effectComposer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Models
 */

const updateAllMaterials = () => {
  scene.traverse((child) => {
    if (
      child instanceof THREE.Mesh &&
      child.material instanceof THREE.MeshStandardMaterial
    ) {
      child.material.envMapIntensity = 2.5;
      child.material.needsUpdate = true;
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });
};
let model;
let mixer;
let animations;
const gltfLoader = new GLTFLoader();
gltfLoader.load("/robot_model/scene.gltf", (gltf) => {
  model = gltf.scene;
  model.scale.set(0.5, 0.5, 0.5);
  scene.add(model);
  updateAllMaterials();

  animations = gltf.animations;
  if (animations && animations.length) {
    mixer = new THREE.AnimationMixer(model);
    const action = mixer.clipAction(animations[0]);
    action.play();
  }
});

function updateAnimation() {
  if (mixer) {
    const scrollY = window.scrollY;
    const scrollMax = document.body.scrollHeight - window.innerHeight;
    const scrollFraction = scrollY / scrollMax;
    const clipAction = mixer.clipAction(animations[0]);
    clipAction.time = scrollFraction * clipAction.getClip().duration;
    mixer.update(0);
  }
}
window.addEventListener("scroll", updateAnimation);

// Lights

const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight("#ffffff", 3);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.set(1024, 1024);
directionalLight.shadow.camera.far = 15;
directionalLight.shadow.normalBias = 0.05;
directionalLight.position.set(0.25, 3, -2.25);
scene.add(directionalLight);
const directionalLight2 = new THREE.DirectionalLight(0xffffff, 1);
directionalLight2.position.set(0, 10, 10);
scene.add(directionalLight2);

const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  5000
);
camera.position.z = 150;
camera.position.y = 20;
scene.add(camera);

// const controls = new OrbitControls(camera, canvas);

const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true,
});

renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFShadowMap;
renderer.toneMapping = THREE.ReinhardToneMapping;
renderer.toneMappingExposure = 1.5;
renderer.physicallyCorrectLights = true;
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// Clock
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  // Update objects
  if (model) {
    model.rotation.y = elapsedTime * 0.1;
  }
  const delta = clock.getDelta();
  if (mixer) mixer.update(delta);

  renderer.render(scene, camera);
  // Update controls
  // controls.update();
  window.requestAnimationFrame(tick);
};
tick();
