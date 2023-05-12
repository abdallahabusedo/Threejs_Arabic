import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

/**
 * ! How to get the fonts
 */
import typefaceFont from "three/examples/fonts/helvetiker_regular.typeface.json";

/**
 * ! Load the font
 */
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";

const scene = new THREE.Scene();

const canvas = document.querySelector("canvas.webgl");

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();
const matcapTexture = textureLoader.load("/textures/matcaps/8.png");
const cubeTextureLoader = new THREE.CubeTextureLoader();
const environmentMap = cubeTextureLoader.load([
  "./textures/envMap/px.png",
  "./textures/envMap/nx.png",
  "./textures/envMap/py.png",
  "./textures/envMap/ny.png",
  "./textures/envMap/pz.png",
  "./textures/envMap/nz.png",
]);
scene.background = environmentMap;
scene.environmentMap = environmentMap;

/**
 * Fonts
 */
const fontLoader = new FontLoader();
fontLoader.load("/fonts/helvetiker_regular.typeface.json", (font) => {
  const textGeometry = new TextGeometry("Abdallah zaher", {
    font: font,
    size: 2,
    height: 1,
    curveSegments: 1,
    bevelEnabled: true,
    bevelThickness: 0.03,
    bevelSize: 0.01,
    bevelOffset: 0,
    bevelSegments: 100,
  });
  textGeometry.center();
  const textMaterial = new THREE.MeshMatcapMaterial();
  // textMaterial.wireframe = true;
  textMaterial.matcap = matcapTexture;
  const text = new THREE.Mesh(textGeometry, textMaterial);
  scene.add(text);
});

/**
 * Objects
 */
const donutGeometry = new THREE.TetrahedronGeometry(1, 0);
const donutMaterial = new THREE.MeshMatcapMaterial({ matcap: matcapTexture });
const group = new THREE.Group();
for (let i = 0; i < 100; i++) {
  const donut = new THREE.Mesh(donutGeometry, donutMaterial);
  donut.position.x = (Math.random() - 0.5) * 20;
  donut.position.y = (Math.random() - 0.5) * 20;
  donut.position.z = (Math.random() - 0.5) * 20;
  donut.rotation.x = Math.random() * Math.PI;
  donut.rotation.y = Math.random() * Math.PI;
  const scale = Math.random();
  donut.scale.set(scale, scale, scale);
  group.add(donut);
}
scene.add(group);
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

const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.z = 20;
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
  group.children.forEach((mesh) => {
    mesh.rotation.x = Math.PI * elapsedTime * 0.01;
    mesh.rotation.z = Math.PI * elapsedTime * 0.1;
  });
  group.rotation.x = Math.PI * elapsedTime * 0.01;
  group.rotation.y = Math.PI * elapsedTime * 0.01;
  group.rotation.z = Math.PI * elapsedTime * 0.05;
  renderer.render(scene, camera);
  window.requestAnimationFrame(tick);
};
tick();
