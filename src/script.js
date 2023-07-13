import * as THREE from "three";
import gsap from "gsap";

// Textures
const textureLoader = new THREE.TextureLoader();
// Water
const watercolor = textureLoader.load("Textures/Water/WaterCOLOR.jpg");
const waterDisp = textureLoader.load("Textures/Water/WaterDISP.png");
const waterNormal = textureLoader.load("Textures/Water/WaterNORM.jpg");
const waterOcc = textureLoader.load("Textures/Water/WaterOCC.jpg");
const waterSpec = textureLoader.load("Textures/Water/WaterSPEC.jpg");

// Stone
const stoneColor = textureLoader.load(
  "Textures/Stone/Stone_Floorbasecolor.jpg"
);
const stoneOcc = textureLoader.load(
  "Textures/Stone/Stone_FloorambientOcclusion.jpg"
);
const stoneHeight = textureLoader.load("Textures/Stone/Stone_Floorheight.png");
const stoneNormal = textureLoader.load("Textures/Stone/Stone_Floornormal.jpg");
const stoneRoughness = textureLoader.load(
  "Textures/Stone/Stone_Floorroughness.jpg"
);

// Lava
const lavaColor = textureLoader.load("Textures/Lava/LavaCOLOR.jpg");
const lavaDisp = textureLoader.load("Textures/Lava/LavaDISP.png");
const lavaMask = textureLoader.load("Textures/Lava/LavaMASK.jpg");
const lavaNormal = textureLoader.load("Textures/Lava/LavaNORM.jpg");
const lavaOcc = textureLoader.load("Textures/Lava/LavaOCC.jpg");
const lavaRoughness = textureLoader.load("Textures/Lava/LavaROUGH.jpg");

// Scene
const scene = new THREE.Scene();

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Screen Sizes
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

// Resize Listener
window.addEventListener("resize", () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

// Mesh Material
// Water material
const waterMaterial = new THREE.MeshPhongMaterial({
  color: "#ffeded",
  map: watercolor,
  displacementScale: 0.01,
  displacementMap: waterDisp,
  normalMap: waterNormal,
  aoMap: waterOcc,
  specularMap: waterSpec,
});

// stone material
const stoneMaterial = new THREE.MeshStandardMaterial({
  color: "#ffeded",
  map: stoneColor,
  displacementScale: 0.01,
  displacementMap: stoneHeight,
  normalMap: stoneNormal,
  aoMap: stoneOcc,
  roughness: 0.5,
  roughnessMap: stoneRoughness,
});

// lava material
const lavaMaterial = new THREE.MeshStandardMaterial({
  color: "#ffeded",
  map: lavaColor,
  displacementScale: 0.1,
  displacementMap: lavaDisp,
  normalMap: lavaNormal,
  aoMap: lavaOcc,
  roughness: 0.1,
  roughnessMap: lavaMask,
  alphaMap: lavaMask,
});

// Distance between Meshes
const objectsDistance = 4;

// Meshes
const mesh1 = new THREE.Mesh(new THREE.SphereGeometry(1, 32, 32), lavaMaterial);
const mesh2 = new THREE.Mesh(new THREE.ConeGeometry(1.5, 2, 4), stoneMaterial);
const mesh3 = new THREE.Mesh(
  new THREE.TorusKnotGeometry(0.8, 0.35, 100, 16),
  waterMaterial
);
mesh1.position.y = 0;
mesh2.position.y = -objectsDistance;
mesh3.position.y = -objectsDistance * 2;
mesh1.position.x = -2;
mesh2.position.x = 2;
mesh3.position.x = -2;
scene.add(mesh1, mesh2, mesh3);
const sectionsMeshes = [mesh1, mesh2, mesh3];

/**
 * Lights
 */
const directionalLight = new THREE.DirectionalLight("#ffffff", 1);
directionalLight.position.set(1, 1, 0);
scene.add(directionalLight);

// Camera
const cameraGroup = new THREE.Group();
scene.add(cameraGroup);
const camera = new THREE.PerspectiveCamera(
  35,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.z = 6;
cameraGroup.add(camera);

/**
 * scroll
 */
let scrollY = window.scrollY;
let currentSection = 0;
window.addEventListener("scroll", () => {
  scrollY = window.scrollY;
  // To detect which section we are in
  const newSection = Math.round(scrollY / sizes.height);
  if (newSection != currentSection) {
    currentSection = newSection;
    gsap.to(sectionsMeshes[currentSection].rotation, {
      duration: 2,
      ease: "power2.inOut",
      x: "+=6",
      y: "+=3",
      z: "+=6",
    });
  }
});
/**
 * Cursor
 */
const cursor = {};
cursor.x = 0;
cursor.y = 0;

window.addEventListener("mousemove", (e) => {
  cursor.x = e.clientX / sizes.width - 0.5;
  cursor.y = e.clientY / sizes.height - 0.5;
});

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas,
});

renderer.setSize(sizes.width, sizes.height);
renderer.render(scene, camera);

// Clock
const clock = new THREE.Clock();
let prevTime = 0;

// Animations
const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  const deltaTime = elapsedTime - prevTime;
  prevTime = elapsedTime;
  // Animate camera
  camera.position.y = (-scrollY / sizes.height) * objectsDistance;
  const parallaxX = cursor.x;
  const parallaxY = -cursor.y;

  // Camera Animation
  cameraGroup.position.x +=
    (parallaxX - cameraGroup.position.x) * 5 * deltaTime;
  cameraGroup.position.y +=
    (parallaxY - cameraGroup.position.y) * 5 * deltaTime;

  // Meshes animations
  for (const mesh of sectionsMeshes) {
    mesh.rotation.x += deltaTime * 0.1;
    mesh.rotation.y += deltaTime * 0.12;
  }

  renderer.render(scene, camera);
  window.requestAnimationFrame(tick);
};
tick();
