import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { DotScreenPass } from "three/examples/jsm/postprocessing/DotScreenPass.js";
import { GlitchPass } from "three/examples/jsm/postprocessing/GlitchPass.js";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";
import { RGBShiftShader } from "three/examples/jsm/shaders/RGBShiftShader.js";
import { GammaCorrectionShader } from "three/examples/jsm/shaders/GammaCorrectionShader.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import * as dat from "dat.gui";

const gui = new dat.GUI();
const scene = new THREE.Scene();

const textureLoader = new THREE.TextureLoader();
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

const gltfLoader = new GLTFLoader();
gltfLoader.load("/robot_model/scene.gltf", (gltf) => {
  model = gltf.scene;
  model.scale.set(0.5, 0.5, 0.5);
  scene.add(model);
  updateAllMaterials();

  const animations = gltf.animations;
  if (animations && animations.length) {
    mixer = new THREE.AnimationMixer(model);
    const action = mixer.clipAction(animations[0]);
    action.play();
    const animationFolder = gui.addFolder("Animation");
    animationFolder
      .add(action, "time")
      .min(0)
      .max(action.getClip().duration)
      .step(0.01);
    animationFolder.add(action, "paused").name("pause");
  }
});

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
camera.position.y = 70;
scene.add(camera);

const controls = new OrbitControls(camera, canvas);

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

/**
 * Post processing
 */

const effectComposer = new EffectComposer(renderer);
effectComposer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
effectComposer.setSize(sizes.width, sizes.height);
// render pass
const renderPass = new RenderPass(scene, camera);
effectComposer.addPass(renderPass);
// dot screen pass
const dotScreenPass = new DotScreenPass();
dotScreenPass.enabled = false;
dotScreenPass.uniforms.scale.value = 10;
dotScreenPass.uniforms.angle.value = Math.PI / 2;
dotScreenPass.uniforms.center.value = new THREE.Vector2(0.5, 0.5);
dotScreenPass.setSize(sizes.width / 2, sizes.height);
const dotScreenPassFolder = gui.addFolder("DotScreen");
dotScreenPassFolder.add(dotScreenPass, "enabled").name("enabled");
dotScreenPassFolder
  .add(dotScreenPass.uniforms.scale, "value")
  .min(1)
  .max(20)
  .step(0.01)
  .name("scale");
dotScreenPassFolder
  .add(dotScreenPass.uniforms.angle, "value")
  .min(0)
  .max(Math.PI * 2)
  .step(0.01)
  .name("angle");
dotScreenPassFolder
  .add(dotScreenPass.uniforms.center.value, "x")
  .min(0)
  .max(1)
  .step(0.01)
  .name("centerX");
effectComposer.addPass(dotScreenPass);

// glitch pass
const glitchPass = new GlitchPass();
glitchPass.enabled = false;
glitchPass.goWild = true;
const glitchPassFolder = gui.addFolder("Glitch");
glitchPassFolder.add(glitchPass, "enabled").name("enabled");
glitchPassFolder.add(glitchPass, "goWild").name("goWild");
effectComposer.addPass(glitchPass);

// RGBShiftPass
const rgbShiftPass = new ShaderPass(RGBShiftShader);
rgbShiftPass.enabled = false;
const rgbShiftPassFolder = gui.addFolder("RGBShift");
rgbShiftPassFolder.add(rgbShiftPass, "enabled").name("enabled");
effectComposer.addPass(rgbShiftPass);
const gammaCorrectionPass = new ShaderPass(GammaCorrectionShader);
gammaCorrectionPass.enabled = false;
const gammaCorrectionPassFolder = gui.addFolder("GammaCorrection");
gammaCorrectionPassFolder.add(gammaCorrectionPass, "enabled").name("enabled");
effectComposer.addPass(gammaCorrectionPass);

// UnrealBloomPass
const unrealBloomPass = new UnrealBloomPass();
unrealBloomPass.strength = 0.3;
unrealBloomPass.radius = 1;
unrealBloomPass.threshold = 0.6;
unrealBloomPass.enabled = false;
const unrealBloomPassFolder = gui.addFolder("UnrealBloom");
unrealBloomPassFolder.add(unrealBloomPass, "enabled").name("enabled");
unrealBloomPassFolder.add(unrealBloomPass, "strength").min(0).max(2).step(0.01);
unrealBloomPassFolder.add(unrealBloomPass, "radius").min(0).max(2).step(0.01);
unrealBloomPassFolder
  .add(unrealBloomPass, "threshold")
  .min(0)
  .max(1)
  .step(0.01);
effectComposer.addPass(unrealBloomPass);

const TintShader = {
  uniforms: {
    tDiffuse: { value: null },
    uTint: { value: null },
  },
  vertexShader: `
      varying vec2 vUv;

      void main()
      {
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          vUv = uv;
      }
  `,
  fragmentShader: `
      uniform sampler2D tDiffuse;
      uniform vec3 uTint;
      varying vec2 vUv;


      void main()
      {
          vec4 color = texture2D(tDiffuse, vUv);
          color.rgb += uTint;
          gl_FragColor = color;
      }
  `,
};

const tintPass = new ShaderPass(TintShader);
tintPass.material.uniforms.uTint.value = new THREE.Vector3();
const tintPassFolder = gui.addFolder("Tint");
tintPassFolder
  .add(tintPass.material.uniforms.uTint.value, "x")
  .min(-1)
  .max(1)
  .step(0.001)
  .name("red");
tintPassFolder
  .add(tintPass.material.uniforms.uTint.value, "y")
  .min(-1)
  .max(1)
  .step(0.001)
  .name("green");
tintPassFolder
  .add(tintPass.material.uniforms.uTint.value, "z")
  .min(-1)
  .max(1)
  .step(0.001)
  .name("blue");
effectComposer.addPass(tintPass);

const DisplacementShader2 = {
  uniforms: {
    tDiffuse: { value: null },
    uTime: { value: null },
  },
  vertexShader: `
      varying vec2 vUv;

      void main()
      {
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);

          vUv = uv;
      }
  `,
  fragmentShader: `
      uniform sampler2D tDiffuse;
      uniform float uTime;

      varying vec2 vUv;

      void main()
      {
         vec2 newUv = vec2(
                vUv.x,
                vUv.y + sin(vUv.x * 10.0 + uTime) * 0.1
            );
        vec4 color = texture2D(tDiffuse, newUv);

        gl_FragColor = color;
      }
  `,
};

const displacementPass2 = new ShaderPass(DisplacementShader2);
displacementPass2.material.uniforms.uTime.value = 0;
const displacementPassFolder2 = gui.addFolder("Displacement2");
displacementPassFolder2.add(displacementPass2, "enabled").name("enabled");
effectComposer.addPass(displacementPass2);

const DisplacementShader = {
  uniforms: {
    tDiffuse: { value: null },
    uTime: { value: null },
    uNormalMap: { value: null },
  },
  vertexShader: `
      varying vec2 vUv;

      void main()
      {
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);

          vUv = uv;
      }
  `,
  fragmentShader: `
        uniform sampler2D tDiffuse;
        uniform float uTime;
        uniform sampler2D uNormalMap;

        varying vec2 vUv;

        void main()
        {
            vec3 normalColor = texture2D(uNormalMap, vUv).xyz * 2.0 - 1.0;
            vec2 newUv = vUv + normalColor.xy * 0.1;
            vec4 color = texture2D(tDiffuse, newUv);

            vec3 lightDirection = normalize(vec3(- 1.0, 1.0, 0.0));
            float lightness = clamp(dot(normalColor, lightDirection), 0.0, 1.0);
            color.rgb += lightness * 2.0;

            gl_FragColor = color;
        }
    `,
};

const displacementPass = new ShaderPass(DisplacementShader);
// displacementPass.material.uniforms.uTime.value = 0;
displacementPass.material.uniforms.uNormalMap.value = textureLoader.load(
  "/textures/interfaceNormalMap.png"
);
const displacementPassFolder = gui.addFolder("Displacement");
displacementPassFolder.add(displacementPass, "enabled").name("enabled");
effectComposer.addPass(displacementPass);

// Clock
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  // Update objects
  if (model) {
    model.rotation.y = elapsedTime * 0.1;
  }
  if (mixer) mixer.update(Math.min(0.01, elapsedTime));
  displacementPass2.material.uniforms.uTime.value = elapsedTime;

  // renderer.render(scene, camera);
  effectComposer.render();
  // Update controls
  controls.update();
  window.requestAnimationFrame(tick);
};
tick();
