import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import particlesVertexShader from "./shaders/particlesShader/vertexShader.glsl";
import particlesFragmentShader from "./shaders/particlesShader/fragmentShader.glsl";
import gsap from "gsap";
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

let gltfMesh;
let particles;
const loader = new GLTFLoader();
loader.load("/train/scene.gltf", (gltf) => {
  gltfMesh = gltf.scene;

  gltfMesh.traverse((child) => {
    if (child instanceof THREE.Mesh) {
      child.material = new THREE.ShaderMaterial({
        vertexShader: particlesVertexShader,
        fragmentShader: particlesFragmentShader,
        uniforms: {
          size: { value: 10 },
          color: { value: new THREE.Color(0xff0000) },
        },
        transparent: true,
      });
    }
  });

  canvas.addEventListener("click", () => {
    gsap.to(gltfMesh.rotation, { y: "+=2", duration: 1 });
  });

  scene.add(gltfMesh);
});

const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  10000
);
camera.position.z = 10;
scene.add(camera);

// lights
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xffffff, 0.5);
pointLight.position.x = 2;
pointLight.position.y = 3;
pointLight.position.z = 4;
scene.add(pointLight);

const controls = new OrbitControls(camera, canvas);

const renderer = new THREE.WebGLRenderer({
  canvas,
});

renderer.setSize(sizes.width, sizes.height);
renderer.render(scene, camera);

const clock = new THREE.Clock();
let oldElapsedTime = 0;
const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  const deltaTime = elapsedTime - oldElapsedTime;
  oldElapsedTime = elapsedTime;
  // animate particles random
  if (particles) {
    const positions = particles.geometry.attributes.position.array;
    for (let i = 0; i < positions.length; i += 3) {
      positions[i + 1] -= 0.1 * deltaTime;
      if (positions[i + 1] < -10) {
        positions[i + 1] = 10;
      }
    }
    particles.geometry.attributes.position.needsUpdate = true;
  }

  renderer.render(scene, camera);
  window.requestAnimationFrame(tick);
};
tick();
