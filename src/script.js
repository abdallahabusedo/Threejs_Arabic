import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

const textureLoader = new THREE.TextureLoader();
const particleTexture = textureLoader.load("/textures/particles/8.png");

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
// ***********************
// Step 1 ****************
// ***********************
const particlesGeometry = new THREE.SphereGeometry(1, 32, 32);
const particlesMaterial = new THREE.PointsMaterial();
particlesMaterial.size = 0.1;
particlesMaterial.sizeAttenuation = true;
// const particles = new THREE.Points(particlesGeometry, particlesMaterial);
// scene.add(particles);

// ***********************
// Step 2 ****************
// ***********************
const particlesGeo = new THREE.BufferGeometry();
const count = 50000;
// Multiply by 3 because each position is composed of 3 values (x, y, z)
const positions = new Float32Array(count * 3);
const colors = new Float32Array(count * 3);
for (let i = 0; i < count * 3; i++) {
  positions[i] = (Math.random() - 0.5) * 10;
  colors[i] = Math.random();
}
// particlesMaterial.color = new THREE.Color("#ff88cc");
particlesMaterial.map = particleTexture;
particlesMaterial.transparent = true;
particlesMaterial.alphaMap = particleTexture;
// particlesMaterial.alphaTest = 0.001
particlesMaterial.depthWrite = false;
particlesMaterial.blending = THREE.AdditiveBlending;
particlesMaterial.vertexColors = true;
particlesGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
particlesGeo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
const particles = new THREE.Points(particlesGeo, particlesMaterial);
scene.add(particles);

const cube = new THREE.Mesh(
  new THREE.BoxGeometry(),
  new THREE.MeshBasicMaterial()
);
scene.add(cube);

const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.z = 6;
scene.add(camera);

const controls = new OrbitControls(camera, canvas);

const renderer = new THREE.WebGLRenderer({
  canvas,
});

renderer.setSize(sizes.width, sizes.height);
renderer.render(scene, camera);

const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  for (let i = 0; i < count; i++) {
    const i3 = i * 3;

    const x = particlesGeo.attributes.position.array[i3];
    particlesGeo.attributes.position.array[i3 + 1] = Math.sin(elapsedTime + x);
  }
  particlesGeo.attributes.position.needsUpdate = true;
  renderer.render(scene, camera);
  window.requestAnimationFrame(tick);
};
tick();
