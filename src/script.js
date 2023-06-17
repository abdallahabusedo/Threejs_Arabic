import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "lil-gui";
import { RectAreaLightHelper } from "three/addons/helpers/RectAreaLightHelper";
const gui = new dat.GUI();
const parameter = {
  LightColor: 0xff0000,
};

const scene = new THREE.Scene();

const canvas = document.querySelector("canvas.webgl");

/**
 * Meshes
 */
/**
 * Geometries
 */
const BoxGeo = new THREE.BoxGeometry(5, 5, 5);
const sphereGeo = new THREE.SphereGeometry(4, 32, 32);
const toursGeo = new THREE.TorusGeometry(3, 1, 32, 32);
const planeGeo = new THREE.PlaneGeometry(30, 30);

// Material
const material = new THREE.MeshStandardMaterial();
/**
 * Meshes
 */
//Box
const boxMesh = new THREE.Mesh(BoxGeo, material);
//Sphere
const sphereMesh = new THREE.Mesh(sphereGeo, material);
sphereMesh.position.x = 10;
//torus
const toursMesh = new THREE.Mesh(toursGeo, material);
toursMesh.position.x = -10;
//Plan
const planMesh = new THREE.Mesh(planeGeo, material);
planMesh.rotation.x = Math.PI * 0.5;
planMesh.position.y = -5;
planMesh.material.side = THREE.DoubleSide;
scene.add(boxMesh, sphereMesh, toursMesh, planMesh);

// const ambientLight = new THREE.AmbientLight(parameter.ambientLightColor, 0.5);
// scene.add(ambientLight);

// const ambientLightFolder = gui.addFolder("AmbientLight");
// ambientLightFolder.add(ambientLight, "visible");
// ambientLightFolder.add(ambientLight, "intensity", 0, 1, 0.001);
// ambientLightFolder.addColor(parameter, "ambientLightColor").onChange(() => {
//   ambientLight.color.set(parameter.ambientLightColor);
// });

// const directionalLight = new THREE.DirectionalLight(parameter.LightColor, 0.5);
// scene.add(directionalLight);
// directionalLight.position.x = 1;

// const directionalLightHelper = new THREE.DirectionalLightHelper(
//   directionalLight,
//   10
// );
// scene.add(directionalLightHelper);

// const hemiSphereLight = new THREE.HemisphereLight(0xff0000, 0x00ff00, 0.5);
// scene.add(hemiSphereLight);

// const hemiSphereLightHelper = new THREE.HemisphereLightHelper(
//   hemiSphereLight,
//   10
// );
// scene.add(hemiSphereLightHelper);

// const pointLight = new THREE.PointLight(parameter.LightColor, 1, 20);
// pointLight.position.z = 10;
// scene.add(pointLight);

// const pointLightHelper = new THREE.PointLightHelper(pointLight, 2);
// scene.add(pointLightHelper);

// const RectAreaLight = new THREE.RectAreaLight(parameter.LightColor, 1, 10, 10);
// RectAreaLight.position.z = 10;
// RectAreaLight.lookAt(new THREE.Vector3());
// scene.add(RectAreaLight);
// const RectAreaHelper = new RectAreaLightHelper(RectAreaLight);
// scene.add(RectAreaHelper);

const spotLight = new THREE.SpotLight(parameter.LightColor, 10, 10, Math.PI);
spotLight.position.z = 10;
scene.add(spotLight);

const spotLightHelper = new THREE.SpotLightHelper(spotLight);
scene.add(spotLightHelper);
/**
 * Sizes
 */
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

  renderer.render(scene, camera);
  window.requestAnimationFrame(tick);
};
tick();
