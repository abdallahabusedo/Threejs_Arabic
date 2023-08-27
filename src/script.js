import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
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

let model = null;
const gltfLoader = new GLTFLoader();
gltfLoader.load("/models/glTF-Binary/Duck.glb", (gltf) => {
  model = gltf.scene;
  scene.add(gltf.scene);
});
const raycaster = new THREE.Raycaster();
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.z = 6;
scene.add(camera);

/** Ambient Light  **/
const ambientLight = new THREE.AmbientLight(0xfffddd, 0.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(0, 1, 2);
scene.add(directionalLight);


/**
 * Mouse
 */
const mouse = new THREE.Vector2()

window.addEventListener('mousemove', (event) =>
{
    mouse.x = event.clientX / sizes.width * 2 - 1
    mouse.y = - (event.clientY / sizes.height) * 2 + 1

})

const controls = new OrbitControls(camera, canvas);

const renderer = new THREE.WebGLRenderer({
  canvas,
});

renderer.setSize(sizes.width, sizes.height);
renderer.render(scene, camera);

const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  raycaster.setFromCamera(mouse, camera)
  if(model)
  {
      const modelIntersects = raycaster.intersectObject(model)
      // console.log(modelIntersects);
      if(modelIntersects.length)
      {
          model.scale.set(1.2, 1.2, 1.2)
      }
      else
      {
          model.scale.set(1, 1, 1)
      }
  }
  renderer.render(scene, camera);
  window.requestAnimationFrame(tick);
};
tick();
