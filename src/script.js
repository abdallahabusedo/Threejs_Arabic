import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "lil-gui";

const scene = new THREE.Scene();
THREE.ColorManagement.enabled = false;

const canvas = document.querySelector("canvas.webgl");
const gui = new dat.GUI();
const parameters = {
  ambientLightColor: 0xffffff,
  directionalLightColor: 0xffffff,
  spotLightColor: 0xffffff,
  pointLightColor: 0xffffff,
  cameraNear: 1,
};
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
const material = new THREE.MeshStandardMaterial();
const sphere = new THREE.Mesh(new THREE.SphereGeometry(2, 32, 32), material);
sphere.castShadow = true;
scene.add(sphere);
const plane = new THREE.Mesh(new THREE.PlaneGeometry(20, 20), material);
plane.material.side = THREE.DoubleSide;
plane.rotation.x = Math.PI * 0.5;
plane.position.y = -2;
plane.receiveShadow = true;
scene.add(plane);
/**
 * Lights
 */

/*******************************/
/*       ambientLight          */
/*******************************/
const ambientLight = new THREE.AmbientLight(parameters.ambientLightColor, 0.3);
scene.add(ambientLight);
// ambientLight Tweaks
const ambientTweaks = gui.addFolder("ambientLight");
ambientTweaks.add(ambientLight, "visible");
ambientTweaks.add(ambientLight, "intensity", 0, 1, 0.001);
ambientTweaks.addColor(parameters, "ambientLightColor").onChange(() => {
  ambientLight.color.set(parameters.ambientLightColor);
});

/*******************************/
/*       directional light     */
/*******************************/
const directionalLight = new THREE.DirectionalLight(
  parameters.directionalLightColor,
  0.4
);
directionalLight.position.set(0.346, 0.346, 0.346);
directionalLight.castShadow = true;
scene.add(directionalLight);
// directionalLight Tweaks
const directionalTweaks = gui.addFolder("directionalLight");
directionalTweaks.add(directionalLight, "visible");
directionalTweaks.add(directionalLight, "intensity", 0, 1, 0.001);
directionalTweaks.add(directionalLight.position, "x", -1, 1, 0.001);
directionalTweaks.add(directionalLight.position, "y", -1, 1, 0.001);
directionalTweaks.add(directionalLight.position, "z", -1, 1, 0.001);
directionalTweaks.addColor(parameters, "directionalLightColor").onChange(() => {
  directionalLight.color.set(parameters.directionalLightColor);
});
directionalLight.shadow.mapSize.width = 128;
directionalLight.shadow.mapSize.height = 128;
directionalLight.shadow.camera.near = 1;
directionalLight.shadow.camera.far = 10;
directionalLight.shadow.radius = 10;

console.log(directionalLight.shadow);
const directionalLightCameraHelper = new THREE.CameraHelper(
  directionalLight.shadow.camera
);
directionalLightCameraHelper.visible = false;
directionalTweaks
  .add(directionalLightCameraHelper, "visible")
  .name("helper visible");
scene.add(directionalLightCameraHelper);

directionalTweaks
  .add(directionalLight.shadow.camera, "near", -10, 1, 0.001)
  .onChange((val) => {
    directionalLight.shadow.camera.near = val;
    directionalLight.shadow.camera.updateProjectionMatrix();
    directionalLightCameraHelper.update();
  });

directionalTweaks
  .add(directionalLight.shadow.camera, "far", 1, 10, 0.001)
  .onChange((val) => {
    directionalLight.shadow.camera.far = val;
    directionalLight.shadow.camera.updateProjectionMatrix();
    directionalLightCameraHelper.update();
  });
/*******************************/
/*       Spot light            */
/*******************************/
const spotLight = new THREE.SpotLight(
  parameters.spotLightColor,
  0.4,
  10,
  Math.PI * 0.3,
  0.25,
  1
);
spotLight.visible = true;
spotLight.castShadow = true;
spotLight.position.set(-2, 5, 2);
scene.add(spotLight);
scene.add(spotLight.target);

// SpotLight Tweaks
const spotLightTweak = gui.addFolder("SpotLight ");
spotLightTweak.add(spotLight, "visible");
spotLightTweak.add(spotLight, "intensity", 0, 1, 0.001);
spotLightTweak.add(spotLight.position, "x", -10, 10, 0.001);
spotLightTweak.add(spotLight.position, "y", -10, 10, 0.001);
spotLightTweak.add(spotLight.position, "z", -10, 10, 0.001);
spotLightTweak.add(spotLight, "distance", 0, 20, 0.001);
spotLightTweak.add(
  spotLight,
  "angle",
  -Math.PI * 2,
  Math.PI * 2,
  Math.PI * 0.01
);
spotLightTweak.addColor(parameters, "spotLightColor").onChange(() => {
  spotLight.color.set(parameters.spotLightColor);
});

spotLight.shadow.mapSize.width = 512;
spotLight.shadow.mapSize.height = 512;
spotLight.shadow.camera.fov = 30;
spotLight.shadow.camera.near = 1;
spotLight.shadow.camera.far = 10;

spotLightTweak
  .add(spotLight.shadow.camera, "far", 1, 10, 0.001)
  .onChange((val) => {
    spotLight.shadow.camera.far = val;
    spotLight.shadow.camera.updateProjectionMatrix();
    spotLightCameraHelper.update();
  });
spotLightTweak
  .add(spotLight.shadow.camera, "fov", 10, 100, 0.001)
  .onChange((val) => {
    spotLight.shadow.camera.fov = val;
    spotLight.shadow.camera.updateProjectionMatrix();
    spotLightCameraHelper.update();
  });
spotLightTweak
  .add(spotLight.shadow.camera, "near", 0, 1, 0.001)
  .onChange((val) => {
    spotLight.shadow.camera.near = val;
    spotLight.shadow.camera.updateProjectionMatrix();
    spotLightCameraHelper.update();
  });

const spotLightCameraHelper = new THREE.CameraHelper(spotLight.shadow.camera);
spotLightCameraHelper.visible = false;
spotLightTweak.add(spotLightCameraHelper, "visible").name("helper visible");
scene.add(spotLightCameraHelper);

/*******************************/
/*       Point light           */
/*******************************/
const pointLight = new THREE.PointLight(parameters.pointLightColor, 0.8, 20);
pointLight.position.set(-1, 5, 0);
pointLight.visible = false;
pointLight.castShadow = true;

pointLight.shadow.mapSize.width = 1024;
pointLight.shadow.mapSize.height = 1024;
pointLight.shadow.camera.near = 0.1;
pointLight.shadow.camera.far = 5;
scene.add(pointLight);

// PointLight Tweaks
const pointLightTweaks = gui.addFolder("pointLight");
pointLightTweaks.add(pointLight, "visible");
pointLightTweaks.add(pointLight, "intensity", 0, 1, 0.001);
pointLightTweaks.add(pointLight.position, "x", -10, 10, 0.001);
pointLightTweaks.add(pointLight.position, "y", -10, 10, 0.001);
pointLightTweaks.add(pointLight.position, "z", -10, 10, 0.001);
pointLightTweaks.addColor(parameters, "pointLightColor").onChange(() => {
  pointLight.color.set(parameters.pointLightColor);
});

const pointLightCameraHelper = new THREE.CameraHelper(pointLight.shadow.camera);
pointLightTweaks.add(pointLightCameraHelper, "visible").name("helper visible");
scene.add(pointLightCameraHelper);

/**
 * Camera
 */
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
renderer.outputColorSpace = THREE.LinearSRGBColorSpace;

renderer.setSize(sizes.width, sizes.height);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
gui.add(renderer.shadowMap, "type", {
  BasicShadowMap: THREE.BasicShadowMap,
  PCFShadowMap: THREE.PCFShadowMap,
  PCFSoftShadowMap: THREE.PCFSoftShadowMap,
  VSMShadowMap: THREE.VSMShadowMap,
});
renderer.render(scene, camera);
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  renderer.render(scene, camera);
  window.requestAnimationFrame(tick);
};
tick();
