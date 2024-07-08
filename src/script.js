import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import fragment from "./shaders/test/fragment.glsl";
import vertex from "./shaders/test/vertex.glsl";
import * as dat from "lil-gui";
const gui = new dat.GUI();

// Textures
const textureLoader = new THREE.TextureLoader();
const texture = textureLoader.load("/textures/palestine.jpg");

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

const PlanGeo = new THREE.PlaneBufferGeometry(10, 7, 32, 32);
const count = PlanGeo.attributes.position.count;
const randoms = new Float32Array(count);
for (let i = 0; i < count; i++) {
  randoms[i] = Math.random();
}
PlanGeo.setAttribute("aRandom", new THREE.BufferAttribute(randoms, 1));

const material = new THREE.RawShaderMaterial({
  vertexShader: vertex,
  fragmentShader: fragment,
  side: THREE.DoubleSide,
  uniforms: {
    // uFrequency: { value: 2 },
    uFrequency: { value: new THREE.Vector2(1, 2) },
    uTime: { value: 0 },
    uTexture: { value: texture },
  },
});
gui
  .add(material.uniforms.uFrequency.value, "x")
  .min(0)
  .max(10)
  .step(0.01)
  .name("Frequency X");

gui
  .add(material.uniforms.uFrequency.value, "y")
  .min(0)
  .max(10)
  .step(0.01)
  .name("Frequency Y");

const cube = new THREE.Mesh(PlanGeo, material);
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
  // Update material
  material.uniforms.uTime.value = elapsedTime + 10;
  renderer.render(scene, camera);
  window.requestAnimationFrame(tick);
};
tick();
