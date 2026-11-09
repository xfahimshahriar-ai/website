/**
 * Fahim Shahriar — 3D Virtual Space (PUBG Mobile Victor Edition)
 * Features:
 *  1. Authentic PUBG Victor 3D Character (Tactical jacket, ammo harness, combat gloves, boots, scar, undercut hair)
 *  2. Tactical Movement System (Walk, High-Speed Sprint [Shift], Jump [Space], Crouch [C])
 *  3. Dynamic PUBG Mobile Tactical HUD (Top Compass Ribbon, Radar Mini-Map, Health/Boost Bar, Quick Slots)
 *  4. Iconic PUBG Red & Blue Airdrop Supply Crate with Red Flare Smoke in the Courtyard
 *  5. Complete PC Mouse/Keyboard & Mobile Touch Virtual Joystick Controls
 *  6. Six Fully Furnished Exhibition Rooms & Illuminated Header Menus
 *  7. Full Integration with Fahim Shahriar's Clinical Dentistry, Tech, Research & CV Data
 */

import * as THREE from '/node_modules/three/build/three.module.js';

// ==========================================
// 1. HARDWARE DETECTION & REUSABLES
// ==========================================
const isSoftwareGl = (() => {
  try {
    const gl = document.createElement('canvas').getContext('webgl2');
    if (!gl) return true;
    const ext = gl.getExtension('WEBGL_debug_renderer_info');
    const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
    const gpu = String(gl.getParameter(param));
    gl.getExtension('WEBGL_lose_context')?.loseContext();
    return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
  } catch (e) {
    return true;
  }
})();

const _v1 = new THREE.Vector3();
const _v2 = new THREE.Vector3();
const _raycaster = new THREE.Raycaster();
const _pointer = new THREE.Vector2();

// Tactical PUBG Web Audio Synthesizer
class AudioSynthesizer {
  constructor() {
    this.ctx = null;
    this.isMuted = true;
  }
  init() {
    if (!this.ctx && (window.AudioContext || window.webkitAudioContext)) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }
  playChime(freq = 523.25, duration = 0.4) {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.4, this.ctx.currentTime + duration * 0.4);
      gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch (e) {}
  }
  playDoorSound() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(180, this.ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(320, this.ctx.currentTime + 0.3);
      gain.gain.setValueAtTime(0.06, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.5);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.5);
    } catch (e) {}
  }
  playFootstep() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(110, this.ctx.currentTime);
      gain.gain.setValueAtTime(0.03, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.08);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.08);
    } catch (e) {}
  }
  playJumpSound() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(160, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(380, this.ctx.currentTime + 0.2);
      gain.gain.setValueAtTime(0.05, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.25);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.25);
    } catch (e) {}
  }
  playLootSound() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(440, this.ctx.currentTime);
      osc.frequency.setValueAtTime(659.25, this.ctx.currentTime + 0.08);
      osc.frequency.setValueAtTime(880, this.ctx.currentTime + 0.16);
      gain.gain.setValueAtTime(0.06, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.35);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.35);
    } catch (e) {}
  }
}

const audio = new AudioSynthesizer();

// ==========================================
// 2. PROCEDURAL TEXTURES GENERATORS
// ==========================================
function createMarbleTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#f8fafc';
  ctx.fillRect(0, 0, 512, 512);

  ctx.lineWidth = 1.5;
  for (let i = 0; i < 24; i++) {
    ctx.strokeStyle = i % 3 === 0 ? 'rgba(56, 189, 248, 0.08)' : 'rgba(148, 163, 184, 0.12)';
    ctx.beginPath();
    let x = (i * 35) % 512;
    let y = 0;
    ctx.moveTo(x, y);
    while (y < 512) {
      x += (Math.random() - 0.5) * 45;
      y += 20 + Math.random() * 30;
      ctx.lineTo(x, y);
    }
    ctx.stroke();
  }

  ctx.strokeStyle = 'rgba(2, 132, 199, 0.15)';
  ctx.lineWidth = 2;
  ctx.strokeRect(1, 1, 510, 510);
  ctx.strokeRect(16, 16, 480, 480);

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function createParquetTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#78350f';
  ctx.fillRect(0, 0, 512, 512);

  const planks = 8;
  const plankH = 512 / planks;
  for (let i = 0; i < planks; i++) {
    const hue = 28 + (i % 3) * 3;
    const light = 24 + (i % 4) * 4;
    ctx.fillStyle = `hsl(${hue}, 50%, ${light}%)`;
    ctx.fillRect(0, i * plankH, 512, plankH - 2);

    ctx.strokeStyle = 'rgba(0,0,0,0.15)';
    ctx.lineWidth = 1;
    for (let g = 0; g < 6; g++) {
      ctx.beginPath();
      ctx.moveTo(0, i * plankH + g * (plankH / 6));
      ctx.lineTo(512, i * plankH + g * (plankH / 6) + (Math.random() - 0.5) * 4);
      ctx.stroke();
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function createStonePaverTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#1e293b';
  ctx.fillRect(0, 0, 512, 512);

  const rows = 8;
  const cols = 8;
  const w = 512 / cols;
  const h = 512 / rows;

  for (let r = 0; r < rows; r++) {
    const offset = (r % 2) * (w / 2);
    for (let c = -1; c <= cols; c++) {
      const shade = 65 + Math.floor(Math.random() * 35);
      ctx.fillStyle = `rgb(${shade}, ${shade + 4}, ${shade + 8})`;
      ctx.fillRect(c * w + offset + 2, r * h + 2, w - 4, h - 4);
      ctx.strokeStyle = 'rgba(255,255,255,0.06)';
      ctx.strokeRect(c * w + offset + 3, r * h + 3, w - 6, h - 6);
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function createPlaqueCanvas(title, subtitle, bullets = [], accentColor = '#f59e0b') {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 640;
  const ctx = canvas.getContext('2d');

  const grad = ctx.createLinearGradient(0, 0, 0, 640);
  grad.addColorStop(0, '#0f172a');
  grad.addColorStop(1, '#020617');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 1024, 640);

  ctx.strokeStyle = accentColor;
  ctx.lineWidth = 10;
  ctx.strokeRect(10, 10, 1004, 620);

  ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
  ctx.lineWidth = 2;
  ctx.strokeRect(24, 24, 976, 592);

  ctx.fillStyle = accentColor;
  ctx.fillRect(40, 40, 944, 8);

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 42px "Inter", sans-serif';
  ctx.fillText(title, 50, 105);

  ctx.fillStyle = '#94a3b8';
  ctx.font = '600 24px "Inter", sans-serif';
  ctx.fillText(subtitle, 50, 150);

  ctx.strokeStyle = 'rgba(255,255,255,0.12)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(50, 180);
  ctx.lineTo(974, 180);
  ctx.stroke();

  let y = 235;
  bullets.forEach((bullet) => {
    ctx.fillStyle = accentColor;
    ctx.beginPath();
    ctx.arc(65, y - 8, 6, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#f8fafc';
    ctx.font = '500 24px "Inter", sans-serif';
    ctx.fillText(bullet, 88, y);
    y += 50;
  });

  ctx.fillStyle = accentColor;
  ctx.beginPath();
  ctx.roundRect(50, 540, 280, 52, 10);
  ctx.fill();

  ctx.fillStyle = '#0f172a';
  ctx.font = 'bold 22px "Inter", sans-serif';
  ctx.fillText('[F] LOOT INTEL ➜', 74, 574);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

// Illuminated Door Sign Canvas (Bilingual Header Menu)
function createDoorSignCanvas(englishTitle, banglaSubtitle, icon = '🚪', accentColor = '#f59e0b') {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');

  const grad = ctx.createLinearGradient(0, 0, 1024, 256);
  grad.addColorStop(0, '#0a0f1d');
  grad.addColorStop(1, '#030712');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 1024, 256);

  ctx.strokeStyle = accentColor;
  ctx.lineWidth = 8;
  ctx.strokeRect(6, 6, 1012, 244);

  ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
  ctx.lineWidth = 2;
  ctx.strokeRect(18, 18, 988, 220);

  ctx.fillStyle = accentColor;
  ctx.fillRect(30, 24, 964, 6);

  ctx.font = '68px "Inter", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(icon, 110, 150);

  ctx.textAlign = 'left';
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 44px "Inter", sans-serif';
  ctx.fillText(englishTitle.toUpperCase(), 180, 115);

  ctx.fillStyle = accentColor;
  ctx.font = '600 30px "Kalpurush", "Inter", sans-serif';
  ctx.fillText(banglaSubtitle, 180, 175);

  ctx.fillStyle = 'rgba(16, 185, 129, 0.2)';
  ctx.beginPath();
  ctx.roundRect(840, 90, 140, 44, 8);
  ctx.fill();
  ctx.strokeStyle = '#10b981';
  ctx.lineWidth = 2;
  ctx.strokeRect(840, 90, 140, 44);

  ctx.fillStyle = '#10b981';
  ctx.font = 'bold 20px "Inter", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('● OPEN', 910, 120);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

// Dental X-Ray Lightbox Texture
function createDentalXRayTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 320;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#081325';
  ctx.fillRect(0, 0, 512, 320);

  ctx.strokeStyle = '#60a5fa';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(256, 380, 260, Math.PI * 1.15, Math.PI * 1.85);
  ctx.stroke();

  for (let i = 0; i < 16; i++) {
    const angle = Math.PI * 1.2 + (i / 15) * (Math.PI * 0.6);
    const x = 256 + Math.cos(angle) * 230;
    const y = 380 + Math.sin(angle) * 230;

    ctx.fillStyle = 'rgba(255, 255, 255, 0.65)';
    ctx.beginPath();
    ctx.ellipse(x, y, 9, 20, angle + Math.PI / 2, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = 'rgba(15, 23, 42, 0.7)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x, y - 10);
    ctx.lineTo(x, y + 10);
    ctx.stroke();
  }

  ctx.fillStyle = '#93c5fd';
  ctx.font = 'bold 16px monospace';
  ctx.fillText('CMC DENTAL RADIOLOGY · PANORAMIC OPG', 24, 34);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

// Code Editor Screen Texture for Tech Room
function createCodeScreenTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 320;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#1e1e1e';
  ctx.fillRect(0, 0, 512, 320);

  ctx.fillStyle = '#252526';
  ctx.fillRect(0, 0, 512, 28);
  ctx.fillStyle = '#e2e8f0';
  ctx.font = '13px monospace';
  ctx.fillText('● ● ●  VictorSpace.ts — fahim-shahriar-pubg', 14, 19);

  const lines = [
    { t: 'import { Victor, Dentistry } from "@fahim/pubg";', c: '#c586c0' },
    { t: '', c: '' },
    { t: '// Chattogram Medical College (CMC) Dental Cadet', c: '#6a9955' },
    { t: 'export async function deployBattleground() {', c: '#569cd6' },
    { t: '  const cadet = new VictorWarrior("Fahim Shahriar");', c: '#9cdcfe' },
    { t: '  const loadout = ["Stethoscope", "React", "Node", "ThreeJS"];', c: '#4ec9b0' },
    { t: '  await cadet.lootAirdropCrate(loadout);', c: '#dcdcaa' },
    { t: '  return { winnerWinner: true, chickenDinner: true };', c: '#ce9178' },
    { t: '}', c: '#d4d4d4' }
  ];

  let y = 56;
  lines.forEach((line, idx) => {
    ctx.fillStyle = '#858585';
    ctx.font = '13px monospace';
    ctx.fillText(String(idx + 1).padStart(2, ' '), 12, y);

    if (line.t) {
      ctx.fillStyle = line.c;
      ctx.fillText(line.t, 42, y);
    }
    y += 24;
  });

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

// ==========================================
// 3. MAIN VIRTUAL WORLD CLASS
// ==========================================
export class VirtualWorld {
  constructor(container) {
    this.container = container;
    this.clock = new THREE.Clock();

    // Scene & Objects
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.interactiveObjects = [];
    this.doors = [];
    this.gateDoors = { left: null, right: null, isOpen: false, targetAngle: 0 };
    this.lights = {};

    // Camera Modes: 'third-person' (default) or 'first-person'
    this.cameraMode = 'third-person';
    this.orbitYaw = Math.PI; // Look North (-Z)
    this.orbitPitch = 0.15;
    this.isDragging = false;
    this.prevMousePos = { x: 0, y: 0 };

    // Movement & Character Victor
    this.character = null;
    this.moveSpeed = 8.5; // Base jog speed
    this.sprintMultiplier = 1.65; // High-speed sprint
    this.isSprinting = false;
    this.isCrouched = false;
    this.verticalVelocity = 0;
    this.gravity = 22.0;

    this.keys = { forward: false, backward: false, left: false, right: false, sprint: false };
    this.joystickVector = { x: 0, y: 0 };
    this.footstepTimer = 0;

    // Dynamic Proximity State
    this.currentNearestInteractive = null;

    // Atmosphere
    this.atmosphere = 'day';

    this.init();
  }

  init() {
    // 1. Scene & Atmospheric Fog (Erangel Battleground Ambience)
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(0xbbf7d0, 0.009);

    // 2. Camera
    const aspect = this.container.clientWidth / this.container.clientHeight;
    this.camera = new THREE.PerspectiveCamera(60, aspect, 0.1, 280);

    // 3. Renderer with Software GL Fallback Guard
    this.renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      powerPreference: 'high-performance',
      alpha: false
    });
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    this.renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.18;
    this.renderer.shadowMap.enabled = !isSoftwareGl;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    this.container.appendChild(this.renderer.domElement);

    // 4. Studio Environment Reflection Map
    try {
      const pmrem = new THREE.PMREMGenerator(this.renderer);
      const envScene = new THREE.Scene();
      const roomGeo = new THREE.BoxGeometry(32, 28, 28);
      const roomMat = new THREE.MeshStandardMaterial({ side: THREE.BackSide, color: 0xffffff, roughness: 0.85 });
      envScene.add(new THREE.Mesh(roomGeo, roomMat));

      const mainLight = new THREE.PointLight(0xffffff, 850, 30, 2);
      mainLight.position.set(0.4, 16, 0.3);
      envScene.add(mainLight);

      const fill1 = new THREE.PointLight(0xf59e0b, 350, 20, 2);
      fill1.position.set(-8, 8, -5);
      envScene.add(fill1);

      this.scene.environment = pmrem.fromScene(envScene, 0.04).texture;
      pmrem.dispose();
      roomGeo.dispose();
      roomMat.dispose();
    } catch (e) {
      console.warn('Studio environment fallback note:', e);
    }

    // 5. Build World Architecture
    this.buildLighting();
    this.buildGroundAndCourtyard();
    this.buildGrandEntranceGate();
    this.buildAirdropCrate();
    this.buildCentralRotundaHall();
    this.buildWallExhibits();
    this.buildSixFurnishedRoomsAndDoors();

    // 6. Build PUBG Victor 3D Character
    this.buildVictorCharacter();

    // 7. Event Listeners & Inputs
    this.setupEventListeners();

    // 8. Start Animation Loop
    this.animate();
  }

  // ------------------------------------------
  // LIGHTING RIG
  // ------------------------------------------
  buildLighting() {
    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x475569, 0.95);
    hemiLight.position.set(0, 50, 0);
    this.scene.add(hemiLight);
    this.lights.hemi = hemiLight;

    const sunLight = new THREE.DirectionalLight(0xfffbeb, 1.45);
    sunLight.position.set(32, 45, 26);
    if (!isSoftwareGl) {
      sunLight.castShadow = true;
      sunLight.shadow.mapSize.width = 1024;
      sunLight.shadow.mapSize.height = 1024;
      sunLight.shadow.camera.near = 0.5;
      sunLight.shadow.camera.far = 130;
      sunLight.shadow.camera.left = -38;
      sunLight.shadow.camera.right = 38;
      sunLight.shadow.camera.top = 38;
      sunLight.shadow.camera.bottom = -38;
      sunLight.shadow.bias = -0.0005;
    }
    this.scene.add(sunLight);
    this.lights.sun = sunLight;

    // Chandelier warm glow in rotunda
    const chandelier = new THREE.PointLight(0xf59e0b, 1.8, 32, 1.2);
    chandelier.position.set(0, 6.2, 0);
    this.scene.add(chandelier);
    this.lights.chandelier = chandelier;

    // Gate lanterns
    [-5.5, 5.5].forEach((x) => {
      const lanternLight = new THREE.PointLight(0xf59e0b, 1.6, 14);
      lanternLight.position.set(x, 4.2, 32);
      this.scene.add(lanternLight);
    });
  }

  // ------------------------------------------
  // LUSH BOTANICAL GARDEN & COURTYARD
  // ------------------------------------------
  buildGroundAndCourtyard() {
    const groundGroup = new THREE.Group();

    // Terrain Ground (Erangel Military Green)
    const grassGeo = new THREE.PlaneGeometry(180, 180);
    const grassMat = new THREE.MeshStandardMaterial({
      color: 0x16532b,
      roughness: 0.92,
      metalness: 0.05
    });
    const grassMesh = new THREE.Mesh(grassGeo, grassMat);
    grassMesh.rotation.x = -Math.PI / 2;
    grassMesh.receiveShadow = !isSoftwareGl;
    groundGroup.add(grassMesh);

    // Stone Paver Walkway from garden spawn
    const paverTex = createStonePaverTexture();
    paverTex.repeat.set(2, 12);
    const walkGeo = new THREE.PlaneGeometry(7.5, 42);
    const walkMat = new THREE.MeshStandardMaterial({
      map: paverTex,
      roughness: 0.75,
      metalness: 0.12
    });
    const walkMesh = new THREE.Mesh(walkGeo, walkMat);
    walkMesh.rotation.x = -Math.PI / 2;
    walkMesh.position.set(0, 0.02, 34);
    walkMesh.receiveShadow = !isSoftwareGl;
    groundGroup.add(walkMesh);

    // Walkway Stone Curbs
    const curbGeo = new THREE.BoxGeometry(0.35, 0.25, 42);
    const curbMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, roughness: 0.6 });
    [-3.85, 3.85].forEach((x) => {
      const curb = new THREE.Mesh(curbGeo, curbMat);
      curb.position.set(x, 0.12, 34);
      groundGroup.add(curb);
    });

    // Flower plots flanking walkway
    const flowerColors = [0xef4444, 0xf59e0b, 0xa855f7, 0x38bdf8, 0xec4899];
    const flowerBedGeo = new THREE.BoxGeometry(4.5, 0.45, 8.5);
    const bedWallMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.8 });
    const soilMat = new THREE.MeshStandardMaterial({ color: 0x271c19, roughness: 0.95 });

    [
      { x: -6.8, z: 46 },
      { x: -6.8, z: 36 },
      { x: 6.8, z: 46 },
      { x: 6.8, z: 36 }
    ].forEach((bed) => {
      const wall = new THREE.Mesh(flowerBedGeo, bedWallMat);
      wall.position.set(bed.x, 0.22, bed.z);
      wall.castShadow = !isSoftwareGl;
      groundGroup.add(wall);

      const soil = new THREE.Mesh(new THREE.PlaneGeometry(4.1, 8.1), soilMat);
      soil.rotation.x = -Math.PI / 2;
      soil.position.set(bed.x, 0.46, bed.z);
      groundGroup.add(soil);

      for (let f = 0; f < 16; f++) {
        const fx = bed.x + (Math.random() - 0.5) * 3.4;
        const fz = bed.z + (Math.random() - 0.5) * 7.2;
        const color = flowerColors[f % flowerColors.length];

        const blossom = new THREE.Mesh(
          new THREE.DodecahedronGeometry(0.22 + Math.random() * 0.1),
          new THREE.MeshStandardMaterial({ color, roughness: 0.5 })
        );
        blossom.position.set(fx, 0.7 + Math.random() * 0.25, fz);
        blossom.castShadow = !isSoftwareGl;
        groundGroup.add(blossom);

        const stem = new THREE.Mesh(
          new THREE.CylinderGeometry(0.03, 0.04, 0.5, 6),
          new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.8 })
        );
        stem.position.set(fx, 0.5, fz);
        groundGroup.add(stem);
      }
    });

    // Sculpted Cypress Trees
    const trunkMat = new THREE.MeshStandardMaterial({ color: 0x451a03, roughness: 0.9 });
    const foliageMat1 = new THREE.MeshStandardMaterial({ color: 0x14532d, roughness: 0.75 });
    const foliageMat2 = new THREE.MeshStandardMaterial({ color: 0x064e3b, roughness: 0.8 });

    [
      { x: -10.5, z: 50 },
      { x: -10.5, z: 41 },
      { x: -10.5, z: 32 },
      { x: 10.5, z: 50 },
      { x: 10.5, z: 41 },
      { x: 10.5, z: 32 }
    ].forEach((pos) => {
      const treeGroup = new THREE.Group();
      treeGroup.position.set(pos.x, 0, pos.z);

      const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.38, 3.5, 8), trunkMat);
      trunk.position.y = 1.75;
      trunk.castShadow = !isSoftwareGl;
      treeGroup.add(trunk);

      for (let l = 0; l < 3; l++) {
        const cone = new THREE.Mesh(
          new THREE.ConeGeometry(1.6 - l * 0.35, 2.6 - l * 0.4, 8),
          l % 2 === 0 ? foliageMat1 : foliageMat2
        );
        cone.position.y = 3.5 + l * 1.6;
        cone.castShadow = !isSoftwareGl;
        treeGroup.add(cone);
      }

      groundGroup.add(treeGroup);
    });

    // Garden Benches
    const benchWoodMat = new THREE.MeshStandardMaterial({ color: 0xb45309, roughness: 0.4 });
    const benchIronMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.8, roughness: 0.3 });
    [-4.5, 4.5].forEach((bx) => {
      const bench = new THREE.Group();
      bench.position.set(bx, 0, 48);
      bench.rotation.y = bx < 0 ? Math.PI / 2 : -Math.PI / 2;

      const seat = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.1, 0.6), benchWoodMat);
      seat.position.set(0, 0.55, 0);
      bench.add(seat);

      const back = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.6, 0.08), benchWoodMat);
      back.position.set(0, 0.95, -0.28);
      back.rotation.x = -0.15;
      bench.add(back);

      [-1.0, 1.0].forEach((lx) => {
        const leg = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.55, 0.55), benchIronMat);
        leg.position.set(lx, 0.275, 0);
        bench.add(leg);
      });

      groundGroup.add(bench);
    });

    // Welcome Garden Entrance Archway
    const archGroup = new THREE.Group();
    archGroup.position.set(0, 0, 52);
    const archMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.4, roughness: 0.3 });

    [-3.8, 3.8].forEach((ax) => {
      const p = new THREE.Mesh(new THREE.BoxGeometry(0.8, 5.0, 0.8), archMat);
      p.position.set(ax, 2.5, 0);
      archGroup.add(p);
    });

    const archTop = new THREE.Mesh(new THREE.BoxGeometry(8.4, 0.45, 0.8), archMat);
    archTop.position.set(0, 5.2, 0);
    archGroup.add(archTop);

    // Archway Banner Sign
    const archCanvas = document.createElement('canvas');
    archCanvas.width = 1024;
    archCanvas.height = 160;
    const archCtx = archCanvas.getContext('2d');
    archCtx.fillStyle = '#0f172a';
    archCtx.fillRect(0, 0, 1024, 160);
    archCtx.strokeStyle = '#f59e0b';
    archCtx.lineWidth = 6;
    archCtx.strokeRect(4, 4, 1016, 152);
    archCtx.fillStyle = '#f8fafc';
    archCtx.font = 'bold 36px "Inter", sans-serif';
    archCtx.textAlign = 'center';
    archCtx.fillText('★ BATTLEGROUND COURTYARD · VICTOR 3D SPACE ★', 512, 68);
    archCtx.fillStyle = '#f59e0b';
    archCtx.font = '600 24px "Kalpurush", sans-serif';
    archCtx.fillText('ডেন্টিস্ট্রি · টেকনোলজি · রিসার্চ · এয়ারড্রপ ক্রেট', 512, 120);

    const archSignTex = new THREE.CanvasTexture(archCanvas);
    const archSignMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(7.6, 1.2),
      new THREE.MeshStandardMaterial({ map: archSignTex, roughness: 0.3 })
    );
    archSignMesh.position.set(0, 4.3, 0.42);
    archGroup.add(archSignMesh);
    groundGroup.add(archGroup);

    this.scene.add(groundGroup);
  }

  // ------------------------------------------
  // GRAND ENTRANCE GATE
  // ------------------------------------------
  buildGrandEntranceGate() {
    const gateGroup = new THREE.Group();
    gateGroup.position.set(0, 0, 32);

    const pillarMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.35, metalness: 0.15 });
    [-4.5, 4.5].forEach((x) => {
      const pillar = new THREE.Mesh(new THREE.BoxGeometry(1.4, 5.6, 1.4), pillarMat);
      pillar.position.set(x, 2.8, 0);
      pillar.castShadow = !isSoftwareGl;
      gateGroup.add(pillar);

      const cap = new THREE.Mesh(new THREE.BoxGeometry(1.7, 0.4, 1.7), pillarMat);
      cap.position.set(x, 5.8, 0);
      gateGroup.add(cap);

      const goldBall = new THREE.Mesh(
        new THREE.SphereGeometry(0.35, 16, 16),
        new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.95, roughness: 0.15 })
      );
      goldBall.position.set(x, 6.2, 0);
      gateGroup.add(goldBall);
    });

    const archBeam = new THREE.Mesh(new THREE.BoxGeometry(10.2, 0.55, 1.2), pillarMat);
    archBeam.position.set(0, 5.4, 0);
    gateGroup.add(archBeam);

    // Gate Overhead Crest
    const crestCanvas = document.createElement('canvas');
    crestCanvas.width = 1024;
    crestCanvas.height = 180;
    const cCtx = crestCanvas.getContext('2d');
    cCtx.fillStyle = '#0f172a';
    cCtx.fillRect(0, 0, 1024, 180);
    cCtx.strokeStyle = '#f59e0b';
    cCtx.lineWidth = 6;
    cCtx.strokeRect(6, 6, 1012, 168);
    cCtx.fillStyle = '#f59e0b';
    cCtx.font = 'bold 36px "Inter", sans-serif';
    cCtx.textAlign = 'center';
    cCtx.fillText('★ PUBG MOBILE · VICTOR\'S FAHIM SHAHRIAR SPACE ★', 512, 70);
    cCtx.fillStyle = '#38bdf8';
    cCtx.font = '600 24px "Inter", sans-serif';
    cCtx.fillText('STEP FORWARD TO ENTER ROTUNDA, AIRDROP CRATE & ROOMS', 512, 125);

    const crestTex = new THREE.CanvasTexture(crestCanvas);
    const crestMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(8.6, 1.5),
      new THREE.MeshStandardMaterial({ map: crestTex, roughness: 0.3 })
    );
    crestMesh.position.set(0, 6.4, 0.62);
    gateGroup.add(crestMesh);

    // Left Gate Door Leaf
    const leftPivot = new THREE.Group();
    leftPivot.position.set(-3.8, 0, 0);
    const ironMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.85, roughness: 0.25 });
    const goldTrimMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.95, roughness: 0.15 });

    const leftLeaf = new THREE.Group();
    leftLeaf.position.set(1.9, 0, 0);

    const frameOuter = new THREE.Mesh(new THREE.BoxGeometry(3.7, 4.8, 0.12), ironMat);
    frameOuter.position.set(0, 2.4, 0);
    frameOuter.castShadow = !isSoftwareGl;
    leftLeaf.add(frameOuter);

    const leftEmblem = new THREE.Mesh(new THREE.TorusGeometry(0.8, 0.08, 12, 24), goldTrimMat);
    leftEmblem.position.set(0, 2.4, 0.08);
    leftLeaf.add(leftEmblem);

    leftPivot.add(leftLeaf);
    gateGroup.add(leftPivot);

    // Right Gate Door Leaf
    const rightPivot = new THREE.Group();
    rightPivot.position.set(3.8, 0, 0);

    const rightLeaf = new THREE.Group();
    rightLeaf.position.set(-1.9, 0, 0);

    const rFrame = new THREE.Mesh(new THREE.BoxGeometry(3.7, 4.8, 0.12), ironMat);
    rFrame.position.set(0, 2.4, 0);
    rFrame.castShadow = !isSoftwareGl;
    rightLeaf.add(rFrame);

    const rightEmblem = new THREE.Mesh(new THREE.TorusGeometry(0.8, 0.08, 12, 24), goldTrimMat);
    rightEmblem.position.set(0, 2.4, 0.08);
    rightLeaf.add(rightEmblem);

    rightPivot.add(rightLeaf);
    gateGroup.add(rightPivot);

    this.gateDoors = { left: leftPivot, right: rightPivot, isOpen: false, targetAngle: 0 };
    this.scene.add(gateGroup);
  }

  // ------------------------------------------
  // ICONIC PUBG AIRDROP SUPPLY CRATE
  // ------------------------------------------
  buildAirdropCrate() {
    const crateGroup = new THREE.Group();
    crateGroup.position.set(7.5, 0, 24);

    // 1. Lower Red Metal Container Base
    const redMat = new THREE.MeshStandardMaterial({ color: 0xb91c1c, roughness: 0.35, metalness: 0.4 });
    const blackCornerMat = new THREE.MeshStandardMaterial({ color: 0x09090b, roughness: 0.5, metalness: 0.8 });

    const baseBox = new THREE.Mesh(new THREE.BoxGeometry(2.4, 1.2, 2.4), redMat);
    baseBox.position.y = 0.6;
    baseBox.castShadow = !isSoftwareGl;
    crateGroup.add(baseBox);

    // 2. Upper Blue Vinyl Rain Tarp Cover
    const blueTarpMat = new THREE.MeshStandardMaterial({ color: 0x1d4ed8, roughness: 0.65 });
    const tarp = new THREE.Mesh(new THREE.BoxGeometry(2.5, 0.8, 2.5), blueTarpMat);
    tarp.position.y = 1.5;
    tarp.castShadow = !isSoftwareGl;
    crateGroup.add(tarp);

    // 3. Yellow Tie-down Webbing Straps
    const yellowStrapMat = new THREE.MeshStandardMaterial({ color: 0xfacc15, roughness: 0.4 });
    [-0.7, 0.7].forEach((sx) => {
      const strapX = new THREE.Mesh(new THREE.BoxGeometry(0.12, 1.9, 2.54), yellowStrapMat);
      strapX.position.set(sx, 0.95, 0);
      crateGroup.add(strapX);

      const strapZ = new THREE.Mesh(new THREE.BoxGeometry(2.54, 1.9, 0.12), yellowStrapMat);
      strapZ.position.set(0, 0.95, sx);
      crateGroup.add(strapZ);
    });

    // 4. Corner Reinforcement Brackets
    [-1.22, 1.22].forEach((cx) => {
      [-1.22, 1.22].forEach((cz) => {
        const corner = new THREE.Mesh(new THREE.BoxGeometry(0.18, 1.95, 0.18), blackCornerMat);
        corner.position.set(cx, 0.98, cz);
        crateGroup.add(corner);
      });
    });

    // 5. Rising Red Flare Smoke Particles
    const smokeGeo = new THREE.BufferGeometry();
    const smokeCount = 45;
    const smokePos = new Float32Array(smokeCount * 3);
    for (let i = 0; i < smokeCount * 3; i += 3) {
      smokePos[i] = (Math.random() - 0.5) * 0.8;
      smokePos[i + 1] = 1.9 + Math.random() * 6.5;
      smokePos[i + 2] = (Math.random() - 0.5) * 0.8;
    }
    smokeGeo.setAttribute('position', new THREE.BufferAttribute(smokePos, 3));
    const smokeMat = new THREE.PointsMaterial({
      size: 0.45,
      color: 0xef4444,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending
    });
    const smoke = new THREE.Points(smokeGeo, smokeMat);
    crateGroup.add(smoke);
    this.airdropSmoke = smoke;

    // Glowing red flare beacon point light
    const flareLight = new THREE.PointLight(0xef4444, 2.2, 10);
    flareLight.position.set(0, 2.2, 0);
    crateGroup.add(flareLight);

    // Airdrop Crate Interactive Trigger
    const trigger = new THREE.Mesh(new THREE.BoxGeometry(3.5, 3.0, 3.5), new THREE.MeshBasicMaterial({ visible: false }));
    trigger.position.y = 1.5;
    trigger.userData = {
      type: 'airdrop',
      id: 'pubg-airdrop',
      title: 'Airdrop Supply Crate (Level 3 Loot)',
      category: 'Special Military Supply Drop',
      desc: 'Exclusive Battleground Airdrop containing Fahim Shahriar’s BDS dentistry curriculum, Full-Stack developer portfolio, verified CV document, and direct contact line.',
      buttonText: 'Open Airdrop Loot ➜'
    };
    crateGroup.add(trigger);
    this.interactiveObjects.push(trigger);

    this.scene.add(crateGroup);
  }

  buildAirdropSupplyCrate() {
    return this.buildAirdropCrate();
  }

  // ------------------------------------------
  // CENTRAL ROTUNDA HALL
  // ------------------------------------------
  buildCentralRotundaHall() {
    const rotundaGroup = new THREE.Group();
    rotundaGroup.position.set(0, 0, 0);

    const marbleTex = createMarbleTexture();
    marbleTex.repeat.set(8, 8);
    const floor = new THREE.Mesh(
      new THREE.CylinderGeometry(15.5, 15.5, 0.4, 32),
      new THREE.MeshStandardMaterial({ map: marbleTex, roughness: 0.18, metalness: 0.15 })
    );
    floor.position.y = 0.2;
    floor.receiveShadow = !isSoftwareGl;
    rotundaGroup.add(floor);

    const wallMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.65 });
    const wallGeo = new THREE.CylinderGeometry(15.6, 15.6, 7.5, 32, 1, true, 0, Math.PI * 2);
    const rotundaWall = new THREE.Mesh(wallGeo, wallMat);
    rotundaWall.position.y = 3.95;
    rotundaGroup.add(rotundaWall);

    const dome = new THREE.Mesh(
      new THREE.SphereGeometry(15.6, 24, 16, 0, Math.PI * 2, 0, Math.PI * 0.4),
      new THREE.MeshStandardMaterial({
        color: 0xf59e0b,
        transparent: true,
        opacity: 0.35,
        roughness: 0.1,
        metalness: 0.8,
        side: THREE.DoubleSide
      })
    );
    dome.position.y = 7.6;
    rotundaGroup.add(dome);

    // Center Gold Compass Rose Inlay
    const compass = new THREE.Mesh(
      new THREE.RingGeometry(0.8, 3.2, 16),
      new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.8, roughness: 0.2, side: THREE.DoubleSide })
    );
    compass.rotation.x = -Math.PI / 2;
    compass.position.y = 0.42;
    rotundaGroup.add(compass);

    // Chandelier
    const chandelierGroup = new THREE.Group();
    chandelierGroup.position.set(0, 6.8, 0);
    const goldRingMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.95, roughness: 0.15 });
    [2.4, 1.6, 0.8].forEach((r, idx) => {
      const ring = new THREE.Mesh(new THREE.TorusGeometry(r, 0.06, 8, 24), goldRingMat);
      ring.rotation.x = Math.PI / 2;
      ring.position.y = -idx * 0.45;
      chandelierGroup.add(ring);
    });
    rotundaGroup.add(chandelierGroup);

    this.scene.add(rotundaGroup);
  }

  // ------------------------------------------
  // ROTUNDA WALL EXHIBIT PLAQUES
  // ------------------------------------------
  buildWallExhibits() {
    const exhibitsGroup = new THREE.Group();

    // 1. DENTISTRY EXHIBIT (North Wall)
    const p1Tex = createPlaqueCanvas(
      'DENTISTRY & CLINICAL CARE',
      'Chattogram Medical College (CMC) · Dental Unit',
      [
        'Undergraduate dental cadet at Chattogram Medical College (CMC)',
        'Focus on preventive oral health, patient comfort & clinical empathy',
        'Active participant in clinical seminars, diagnostics & community camps',
        'Advancing patient oral hygiene awareness across Bangladesh'
      ],
      '#f59e0b'
    );
    const p1 = new THREE.Mesh(new THREE.PlaneGeometry(6.4, 4.0), new THREE.MeshStandardMaterial({ map: p1Tex, roughness: 0.25 }));
    p1.position.set(0, 3.8, -14.6);
    p1.userData = {
      type: 'exhibit',
      id: 'dentistry',
      title: 'Dentistry & Clinical Medicine',
      category: 'Chattogram Medical College · Dental Unit',
      desc: 'Hi, I’m Fahim Shahriar — a dedicated dental student at Chattogram Medical College (CMC). My clinical mission focuses on evidence-based dental care, preventive oral hygiene advocacy, patient comfort, and advancing clinical dentistry through continuous research and empathy.',
      buttonText: 'View Clinical Journey ➜',
      link: '#about'
    };
    exhibitsGroup.add(p1);
    this.interactiveObjects.push(p1);

    // Anatomical Tooth Pedestal & 3D Model
    const toothPedestal = new THREE.Group();
    toothPedestal.position.set(0, 0, -11.5);
    const pedBase = new THREE.Mesh(
      new THREE.CylinderGeometry(0.9, 1.1, 1.2, 16),
      new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.3, metalness: 0.4 })
    );
    pedBase.position.y = 0.6;
    toothPedestal.add(pedBase);

    const crownMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.12, metalness: 0.15 });
    const molarGroup = new THREE.Group();
    molarGroup.position.y = 1.8;

    [
      [-0.25, -0.25],
      [0.25, -0.25],
      [-0.25, 0.25],
      [0.25, 0.25]
    ].forEach(([cx, cz]) => {
      const cusp = new THREE.Mesh(new THREE.SphereGeometry(0.38, 16, 16), crownMat);
      cusp.position.set(cx, 0.35, cz);
      molarGroup.add(cusp);
    });

    const crownBody = new THREE.Mesh(new THREE.BoxGeometry(0.95, 0.75, 0.95), crownMat);
    crownBody.position.y = 0.1;
    molarGroup.add(crownBody);

    [-0.22, 0.22].forEach((rx) => {
      const root = new THREE.Mesh(new THREE.ConeGeometry(0.22, 0.95, 12), crownMat);
      root.rotation.x = Math.PI;
      root.position.set(rx, -0.5, 0);
      molarGroup.add(root);
    });

    toothPedestal.add(molarGroup);
    exhibitsGroup.add(toothPedestal);

    // 2. TECH & PROJECTS EXHIBIT (East Wall)
    const p2Tex = createPlaqueCanvas(
      'TECHNOLOGY & WEB PROJECTS',
      'Full-Stack Web Development, Modern UI & Creative Coding',
      [
        'Modern Web Architecture: React, Next.js, Vite, TypeScript & Node.js',
        'Interactive 3D WebGL Experiences using Three.js & Tailwind CSS',
        'Google Workspace API & Real-time Cloud Sheet Integration',
        'Building high-performance apps that solve real-world problems'
      ],
      '#10b981'
    );
    const p2 = new THREE.Mesh(new THREE.PlaneGeometry(6.4, 4.0), new THREE.MeshStandardMaterial({ map: p2Tex, roughness: 0.25 }));
    p2.position.set(14.6, 3.8, 0);
    p2.rotation.y = -Math.PI / 2;
    p2.userData = {
      type: 'exhibit',
      id: 'tech',
      title: 'Technology & Web Innovation',
      category: 'Software Engineering & Interactive Web',
      desc: 'Beyond Dentistry, I am deeply fascinated by technology and software engineering. I create high-performance web applications, modern responsive UI systems, interactive Three.js 3D environments, and real-time data sync tools.',
      buttonText: 'Explore Projects & Code ➜',
      link: '#projects'
    };
    exhibitsGroup.add(p2);
    this.interactiveObjects.push(p2);

    // 3. RESEARCH & PUBLICATIONS EXHIBIT (West Wall)
    const p3Tex = createPlaqueCanvas(
      'RESEARCH & SCIENTIFIC NOTES',
      'Evidence-Based Medicine, Methodology & Case Analysis',
      [
        'Biomedical Literature Appraisal, PubMed & Clinical Studies',
        'Systematic Case Note Syntheses & Dental Pathology Reviews',
        'Integrating Clinical Evidence into Daily Patient-Centered Practice',
        'Continuous lifelong medical learning, publishing & academic notes'
      ],
      '#38bdf8'
    );
    const p3 = new THREE.Mesh(new THREE.PlaneGeometry(6.4, 4.0), new THREE.MeshStandardMaterial({ map: p3Tex, roughness: 0.25 }));
    p3.position.set(-14.6, 3.8, 0);
    p3.rotation.y = Math.PI / 2;
    p3.userData = {
      type: 'exhibit',
      id: 'research',
      title: 'Research & Scientific Studies',
      category: 'Biomedical Science & Methodology',
      desc: 'I conduct scientific literature reviews, study dental case methodologies, and write academic research notes. My goal is bridging evidence-based science with practical clinical dentistry to deliver superior patient care.',
      buttonText: 'Read Research Notes & Blog ➜',
      link: '#blog'
    };
    exhibitsGroup.add(p3);
    this.interactiveObjects.push(p3);

    this.scene.add(exhibitsGroup);
  }

  // -------------------------------------------------------------
  // SIX THEMED ROOMS & ARCHITECTURAL DOORS WITH HEADER MENUS
  // -------------------------------------------------------------
  buildSixFurnishedRoomsAndDoors() {
    const roomsGroup = new THREE.Group();

    const createRoomDoorway = (x, z, rotY, englishTitle, banglaSubtitle, icon, roomId, accentColor = '#f59e0b') => {
      const doorGroup = new THREE.Group();
      doorGroup.position.set(x, 0, z);
      doorGroup.rotation.y = rotY;

      const frameMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.8, roughness: 0.25 });

      [-1.6, 1.6].forEach((fx) => {
        const post = new THREE.Mesh(new THREE.BoxGeometry(0.35, 4.4, 0.35), frameMat);
        post.position.set(fx, 2.2, 0);
        doorGroup.add(post);
      });

      const lintel = new THREE.Mesh(new THREE.BoxGeometry(3.55, 0.45, 0.35), frameMat);
      lintel.position.set(0, 4.42, 0);
      doorGroup.add(lintel);

      const signTex = createDoorSignCanvas(englishTitle, banglaSubtitle, icon, accentColor);
      const signBox = new THREE.Mesh(
        new THREE.BoxGeometry(4.2, 1.05, 0.16),
        new THREE.MeshStandardMaterial({ map: signTex, roughness: 0.2, metalness: 0.2 })
      );
      signBox.position.set(0, 5.15, 0.12);
      doorGroup.add(signBox);

      const ledBar = new THREE.Mesh(new THREE.BoxGeometry(4.0, 0.08, 0.08), new THREE.MeshBasicMaterial({ color: 0x10b981 }));
      ledBar.position.set(0, 5.72, 0.2);
      doorGroup.add(ledBar);

      // Swinging Wooden Door Leaf
      const doorLeafPivot = new THREE.Group();
      doorLeafPivot.position.set(-1.42, 0, 0);

      const woodTex = createParquetTexture();
      const doorMat = new THREE.MeshStandardMaterial({ map: woodTex, roughness: 0.35, metalness: 0.1 });
      const doorMesh = new THREE.Mesh(new THREE.BoxGeometry(2.84, 4.15, 0.12), doorMat);
      doorMesh.position.set(1.42, 2.1, 0);
      doorMesh.castShadow = !isSoftwareGl;
      doorLeafPivot.add(doorMesh);

      const handleMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.95, roughness: 0.15 });
      const handle = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.38, 8), handleMat);
      handle.position.set(2.55, 2.05, 0.12);
      doorLeafPivot.add(handle);

      doorGroup.add(doorLeafPivot);

      const trigger = new THREE.Mesh(new THREE.BoxGeometry(3.6, 4.5, 1.5), new THREE.MeshBasicMaterial({ visible: false }));
      trigger.position.set(0, 2.2, 0);
      trigger.userData = {
        type: 'door',
        roomId,
        englishTitle,
        banglaSubtitle,
        doorPivot: doorLeafPivot,
        isOpen: false,
        targetAngle: 0,
        doorPos: new THREE.Vector3(x, 0, z)
      };
      doorGroup.add(trigger);

      this.interactiveObjects.push(trigger);
      this.doors.push(trigger.userData);

      return doorGroup;
    };

    // 1. Dentistry Door
    roomsGroup.add(createRoomDoorway(9.5, -14.6, 0, 'Dentistry & Clinical Care', 'ডেন্টিস্ট্রি ও ক্লিনিক্যাল ইউনিট (CMC)', '🩺', 'clinic', '#0284c7'));
    // 2. Tech Studio Door
    roomsGroup.add(createRoomDoorway(14.6, 8.5, -Math.PI / 2, 'Tech & Web Studio', 'প্রযুক্তি, কোডিং ও ডিজিটাল প্রজেক্টস', '💻', 'tech', '#10b981'));
    // 3. Research Library Door
    roomsGroup.add(createRoomDoorway(-9.5, -14.6, 0, 'Research & Library', 'মেডিকেল গবেষণা ও প্রকাশনা', '🔬', 'library', '#f59e0b'));
    // 4. Creative Lounge Door
    roomsGroup.add(createRoomDoorway(-14.6, 8.5, Math.PI / 2, 'Creative Lounge & Art', 'সৃজনশীল কাজ, ফটোগ্রাফি ও ড্রয়িং রুম', '🎨', 'lounge', '#ec4899'));
    // 5. CV & Achievements Door
    roomsGroup.add(createRoomDoorway(-10.2, 12.5, Math.PI / 4, 'CV & Achievements', 'জীবনবৃত্তান্ত, দক্ষতা ও অর্জন', '📄', 'cv', '#8b5cf6'));
    // 6. Contact & Reception Door
    roomsGroup.add(createRoomDoorway(10.2, 12.5, -Math.PI / 4, 'Contact & Reception', 'যোগাযোগ, বার্তা ও সোশ্যাল নেটওয়ার্ক', '📬', 'contact', '#06b6d4'));

    // ------------------------------------------
    // ROOM 1: DENTISTRY INTERIOR
    // ------------------------------------------
    const clinic = new THREE.Group();
    clinic.position.set(12, 0, -25);

    const cFloor = new THREE.Mesh(new THREE.PlaneGeometry(14, 16), new THREE.MeshStandardMaterial({ color: 0xe0f2fe, roughness: 0.15, metalness: 0.2 }));
    cFloor.rotation.x = -Math.PI / 2;
    clinic.add(cFloor);

    const xrayTex = createDentalXRayTexture();
    const xrayBox = new THREE.Mesh(
      new THREE.PlaneGeometry(4.8, 3.0),
      new THREE.MeshStandardMaterial({ map: xrayTex, roughness: 0.1, emissive: 0x1e3a8a, emissiveIntensity: 0.4 })
    );
    xrayBox.position.set(0, 3.8, -7.92);
    xrayBox.userData = {
      type: 'exhibit',
      id: 'dentistry-xray',
      title: 'Panoramic Dental Radiography (OPG)',
      category: 'Clinical Diagnostic Imaging',
      desc: 'Radiographic evaluation is fundamental to dental diagnostics. From detecting caries to mapping impacted third molars, radiographic precision ensures safe, compassionate patient outcomes.',
      buttonText: 'View Clinical Skills ➜',
      link: '#about'
    };
    clinic.add(xrayBox);
    this.interactiveObjects.push(xrayBox);

    // Dental Chair
    const dentalChair = new THREE.Group();
    dentalChair.position.set(0, 0, 0);

    const chairBase = new THREE.Mesh(new THREE.CylinderGeometry(0.7, 0.9, 0.4, 16), new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.9 }));
    chairBase.position.y = 0.2;
    dentalChair.add(chairBase);

    const leatherMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.35 });
    const seat = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.25, 1.4), leatherMat);
    seat.position.set(0, 1.1, 0);
    dentalChair.add(seat);

    const backrest = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.2, 1.6), leatherMat);
    backrest.position.set(0, 1.6, -1.1);
    backrest.rotation.x = 0.55;
    dentalChair.add(backrest);

    const headrest = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.15, 0.5), leatherMat);
    headrest.position.set(0, 2.1, -1.8);
    headrest.rotation.x = 0.55;
    dentalChair.add(headrest);

    const lampLight = new THREE.PointLight(0xfffbeb, 2.0, 6, 1.5);
    lampLight.position.set(-0.5, 3.0, -0.3);
    dentalChair.add(lampLight);

    clinic.add(dentalChair);
    roomsGroup.add(clinic);

    // ------------------------------------------
    // ROOM 2: TECH STUDIO INTERIOR
    // ------------------------------------------
    const techRoom = new THREE.Group();
    techRoom.position.set(25, 0, 10);

    const tFloor = new THREE.Mesh(new THREE.PlaneGeometry(16, 14), new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.7, metalness: 0.2 }));
    tFloor.rotation.x = -Math.PI / 2;
    techRoom.add(tFloor);

    const deskTop = new THREE.Mesh(new THREE.BoxGeometry(4.2, 0.12, 1.8), new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.4 }));
    deskTop.position.set(0, 1.2, -3.5);
    techRoom.add(deskTop);

    const codeScreenTex = createCodeScreenTexture();
    const techArchTex = createPlaqueCanvas(
      'SYSTEM ARCHITECTURE',
      'Full-Stack Frameworks & Cloud Pipelines',
      [
        'Frontend: React, TypeScript, Tailwind CSS, Three.js',
        'Backend: Node.js Express server & REST APIs',
        'Storage: Google Sheets Cloud Database integration',
        'Performance: Procedural WebGL rendering'
      ],
      '#10b981'
    );

    [-1.2, 1.2].forEach((mx, idx) => {
      const monitor = new THREE.Mesh(
        new THREE.BoxGeometry(1.8, 1.1, 0.08),
        new THREE.MeshStandardMaterial({
          map: idx === 0 ? codeScreenTex : techArchTex,
          emissive: 0x38bdf8,
          emissiveIntensity: 0.25
        })
      );
      monitor.position.set(mx, 2.0, -3.4);
      monitor.rotation.y = idx === 0 ? 0.12 : -0.12;
      monitor.userData = {
        type: 'exhibit',
        id: 'tech-screen',
        title: 'Full-Stack Web Development Architecture',
        category: 'Web Applications & Systems',
        desc: 'Interactive code workbench showcasing responsive modern UI, RESTful architectures, Google Cloud integrations, and real-time client-side databases.',
        buttonText: 'View GitHub & Projects ➜',
        link: '#projects'
      };
      techRoom.add(monitor);
      this.interactiveObjects.push(monitor);
    });

    const serverRack = new THREE.Mesh(new THREE.BoxGeometry(1.4, 4.2, 1.4), new THREE.MeshStandardMaterial({ color: 0x020617, metalness: 0.9 }));
    serverRack.position.set(5.5, 2.1, -4.5);
    techRoom.add(serverRack);

    const serverLight = new THREE.PointLight(0x10b981, 1.5, 6);
    serverLight.position.set(5.5, 2.5, -3.7);
    techRoom.add(serverLight);

    roomsGroup.add(techRoom);

    // ------------------------------------------
    // ROOM 3: RESEARCH & LIBRARY INTERIOR
    // ------------------------------------------
    const library = new THREE.Group();
    library.position.set(-12, 0, -25);

    const lFloor = new THREE.Mesh(new THREE.PlaneGeometry(14, 16), new THREE.MeshStandardMaterial({ color: 0x451a03, roughness: 0.5 }));
    lFloor.rotation.x = -Math.PI / 2;
    library.add(lFloor);

    const shelfBack = new THREE.Mesh(new THREE.BoxGeometry(12, 5.5, 0.8), new THREE.MeshStandardMaterial({ color: 0x271406, roughness: 0.6 }));
    shelfBack.position.set(0, 2.75, -7.4);
    library.add(shelfBack);

    const bookColors = [0x991b1b, 0x1e3a8a, 0x065f46, 0x854d0e, 0x581c87];
    for (let shelf = 0; shelf < 4; shelf++) {
      const sy = 1.0 + shelf * 1.2;
      for (let b = 0; b < 24; b++) {
        const bx = -5.2 + b * 0.45;
        const bHeight = 0.75 + Math.random() * 0.25;
        const book = new THREE.Mesh(
          new THREE.BoxGeometry(0.12, bHeight, 0.55),
          new THREE.MeshStandardMaterial({ color: bookColors[b % bookColors.length], roughness: 0.5 })
        );
        book.position.set(bx, sy + bHeight / 2, -7.0);
        library.add(book);
      }
    }

    const scholarDesk = new THREE.Mesh(new THREE.BoxGeometry(3.6, 0.15, 1.8), new THREE.MeshStandardMaterial({ color: 0x3f1d0b, roughness: 0.35 }));
    scholarDesk.position.set(0, 1.2, -3.0);
    library.add(scholarDesk);

    const deskLight = new THREE.PointLight(0xfef08a, 1.4, 5);
    deskLight.position.set(1.1, 1.75, -3.0);
    library.add(deskLight);

    roomsGroup.add(library);

    // ------------------------------------------
    // ROOM 4: CREATIVE LOUNGE INTERIOR
    // ------------------------------------------
    const lounge = new THREE.Group();
    lounge.position.set(-25, 0, 10);

    const loungeParquet = createParquetTexture();
    loungeParquet.repeat.set(4, 4);
    const lgFloor = new THREE.Mesh(new THREE.PlaneGeometry(16, 14), new THREE.MeshStandardMaterial({ map: loungeParquet, roughness: 0.35 }));
    lgFloor.rotation.x = -Math.PI / 2;
    lounge.add(lgFloor);

    const sofaMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.6 });
    const sofa = new THREE.Group();
    sofa.position.set(0, 0, -3.2);

    const sofaSeat = new THREE.Mesh(new THREE.BoxGeometry(3.6, 0.45, 1.4), sofaMat);
    sofaSeat.position.set(0, 0.45, 0);
    sofa.add(sofaSeat);

    const sofaBack = new THREE.Mesh(new THREE.BoxGeometry(3.6, 0.9, 0.35), sofaMat);
    sofaBack.position.set(0, 0.95, -0.6);
    sofa.add(sofaBack);
    lounge.add(sofa);

    [-3.0, 0, 3.0].forEach((px, idx) => {
      const photoFrame = new THREE.Mesh(
        new THREE.PlaneGeometry(2.2, 1.6),
        new THREE.MeshStandardMaterial({ color: idx === 1 ? 0x0284c7 : 0xf43f5e, roughness: 0.2 })
      );
      photoFrame.position.set(px, 3.2, -6.9);
      photoFrame.userData = {
        type: 'exhibit',
        id: 'photo-' + idx,
        title: idx === 1 ? 'Medical Campus & Daily Life Moments' : 'Visual Storytelling & Landscape Photo',
        category: 'Creative Works & Photography',
        desc: 'Through photography, I capture the spirit of Chattogram Medical College, clinical camaraderie, and the vibrant beauty of Bangladesh.',
        buttonText: 'Open Full Photo Gallery ➜',
        link: '#gallery'
      };
      lounge.add(photoFrame);
      this.interactiveObjects.push(photoFrame);
    });

    roomsGroup.add(lounge);

    // ------------------------------------------
    // ROOM 5: CV & ACHIEVEMENTS
    // ------------------------------------------
    const cvRoom = new THREE.Group();
    cvRoom.position.set(-18, 0, 22);

    const cvFloor = new THREE.Mesh(new THREE.PlaneGeometry(12, 12), new THREE.MeshStandardMaterial({ color: 0x1e1b4b, roughness: 0.4 }));
    cvFloor.rotation.x = -Math.PI / 2;
    cvRoom.add(cvFloor);

    const trophy = new THREE.Mesh(
      new THREE.CylinderGeometry(0.25, 0.1, 0.6, 12),
      new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.98, roughness: 0.12 })
    );
    trophy.position.set(0, 1.5, 0);
    cvRoom.add(trophy);

    const cvPlaqueTex = createPlaqueCanvas(
      'CURRICULUM VITAE & HONORS',
      'Fahim Shahriar · BDS Dental Cadet, CMC',
      [
        'Chattogram Medical College (CMC) — BDS Dental Unit',
        'Academic excellence, clinical mentorship & community leadership',
        'Technical proficiency: Full-stack web, Google APIs, UI/UX systems',
        'Download verified password-protected CV directly from website'
      ],
      '#8b5cf6'
    );
    const cvPlaque = new THREE.Mesh(new THREE.PlaneGeometry(5.2, 3.4), new THREE.MeshStandardMaterial({ map: cvPlaqueTex, roughness: 0.25 }));
    cvPlaque.position.set(0, 3.0, -5.8);
    cvPlaque.userData = {
      type: 'exhibit',
      id: 'cv-wall',
      title: 'Curriculum Vitae & Academic Credentials',
      category: 'Education & Career Milestones',
      desc: 'Access verified credentials, clinical achievements, academic journey, and official CV downloads.',
      buttonText: 'Open CV Download Modal ➜',
      link: '#cv'
    };
    cvRoom.add(cvPlaque);
    this.interactiveObjects.push(cvPlaque);
    roomsGroup.add(cvRoom);

    // ------------------------------------------
    // ROOM 6: CONTACT & RECEPTION
    // ------------------------------------------
    const contactRoom = new THREE.Group();
    contactRoom.position.set(18, 0, 22);

    const conFloor = new THREE.Mesh(new THREE.PlaneGeometry(12, 12), new THREE.MeshStandardMaterial({ color: 0x083344, roughness: 0.35 }));
    conFloor.rotation.x = -Math.PI / 2;
    contactRoom.add(conFloor);

    const counter = new THREE.Mesh(new THREE.BoxGeometry(4.2, 1.1, 1.2), new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.6, roughness: 0.3 }));
    counter.position.set(0, 0.55, 0);
    contactRoom.add(counter);

    const socials = [
      { name: 'WhatsApp', color: 0x22c55e, icon: '💬', link: 'https://wa.me/8801316831199' },
      { name: 'Messenger', color: 0x0084ff, icon: '⚡', link: 'https://m.me/fahim.shahriar.cumilla' },
      { name: 'LinkedIn', color: 0x0a66c2, icon: '💼', link: 'https://www.linkedin.com/in/drfahimshahriar/' },
      { name: 'Direct Email', color: 0xef4444, icon: '✉️', link: 'mailto:fahim.shahriar.bds@gmail.com' }
    ];

    socials.forEach((soc, idx) => {
      const sp = new THREE.Mesh(
        new THREE.CylinderGeometry(0.35, 0.4, 0.9, 12),
        new THREE.MeshStandardMaterial({ color: soc.color, metalness: 0.5, roughness: 0.2 })
      );
      sp.position.set(-2.2 + idx * 1.45, 1.55, 0);
      sp.userData = {
        type: 'exhibit',
        id: 'contact-' + soc.name.toLowerCase(),
        title: soc.name + ' — Direct Connect',
        category: 'Quick Contact Channel',
        desc: `Connect directly with Fahim Shahriar via ${soc.name}. Feel free to drop a message regarding dentistry, web development, research, or collaboration.`,
        buttonText: 'Open ' + soc.name + ' ➜',
        link: soc.link
      };
      contactRoom.add(sp);
      this.interactiveObjects.push(sp);
    });

    roomsGroup.add(contactRoom);
    this.scene.add(roomsGroup);
  }

  // -------------------------------------------------------------
  // PUBG VICTOR 3D CHARACTER MODEL (ICONIC TACTICAL WARRIOR)
  // -------------------------------------------------------------
  buildVictorCharacter() {
    const charGroup = new THREE.Group();
    charGroup.position.set(0, 0, 46);
    charGroup.rotation.y = Math.PI;

    // Contact Floor Shadow
    const shadow = new THREE.Mesh(
      new THREE.PlaneGeometry(1.3, 1.3),
      new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.45, depthWrite: false })
    );
    shadow.rotation.x = -Math.PI / 2;
    shadow.position.y = 0.03;
    charGroup.add(shadow);

    // Root Hips
    const hips = new THREE.Group();
    hips.position.y = 0.95;

    // Tactical Jacket Torso (Victor's signature dark tactical leather & olive combat vest)
    const jacketMat = new THREE.MeshStandardMaterial({ color: 0x27272a, roughness: 0.45, metalness: 0.2 });
    const vestMat = new THREE.MeshStandardMaterial({ color: 0x36453b, roughness: 0.6, metalness: 0.1 });
    const goldAccentMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.85, roughness: 0.2 });

    const torsoMesh = new THREE.Mesh(new THREE.BoxGeometry(0.72, 0.82, 0.4), jacketMat);
    torsoMesh.position.y = 0.41;
    torsoMesh.castShadow = !isSoftwareGl;
    hips.add(torsoMesh);

    // Tactical Combat Chest Rig / Ammo Pouches
    const chestRig = new THREE.Mesh(new THREE.BoxGeometry(0.58, 0.45, 0.12), vestMat);
    chestRig.position.set(0, 0.44, 0.18);
    hips.add(chestRig);

    // Ammo Pouches & Medical Stethoscope Holster
    [-0.18, 0, 0.18].forEach((px) => {
      const pouch = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.2, 0.06), goldAccentMat);
      pouch.position.set(px, 0.38, 0.24);
      hips.add(pouch);
    });

    // Cross-body Tactical Webbing Harness Strap
    const strap = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.95, 0.04), goldAccentMat);
    strap.position.set(0.05, 0.41, 0.2);
    strap.rotation.z = -0.45;
    hips.add(strap);

    // Head Group (Victor's Chiseled Face, Scar & Undercut)
    const headGroup = new THREE.Group();
    headGroup.position.set(0, 1.05, 0);

    const skinMat = new THREE.MeshStandardMaterial({ color: 0xdfab8e, roughness: 0.55 });
    const headMesh = new THREE.Mesh(new THREE.SphereGeometry(0.25, 16, 16), skinMat);
    headMesh.position.y = 0;
    headMesh.castShadow = !isSoftwareGl;
    headGroup.add(headMesh);

    // Victor's Signature Dark Brown Undercut Hair
    const hairMat = new THREE.MeshStandardMaterial({ color: 0x261c14, roughness: 0.7 });
    const hairTop = new THREE.Mesh(new THREE.SphereGeometry(0.26, 16, 16, 0, Math.PI * 2, 0, Math.PI * 0.45), hairMat);
    hairTop.position.set(0, 0.08, -0.02);
    headGroup.add(hairTop);

    // Hair Side Fringe
    const fringe = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.18, 0.12), hairMat);
    fringe.position.set(0.15, 0.15, 0.18);
    fringe.rotation.z = -0.3;
    headGroup.add(fringe);

    // Victor's Tactical Cheek Scar / Combat Bandage
    const scar = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.03, 0.02), new THREE.MeshStandardMaterial({ color: 0x991b1b }));
    scar.position.set(0.14, -0.02, 0.22);
    scar.rotation.z = 0.25;
    headGroup.add(scar);

    // Tactical Audio Earpiece Communicator
    const earpiece = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.08, 0.04), goldAccentMat);
    earpiece.position.set(-0.25, 0.02, 0);
    headGroup.add(earpiece);

    hips.add(headGroup);

    // Tactical Cargo Pants (Military Dark Khaki)
    const pantsMat = new THREE.MeshStandardMaterial({ color: 0x3f3f46, roughness: 0.65 });
    const kneePadMat = new THREE.MeshStandardMaterial({ color: 0x09090b, roughness: 0.4, metalness: 0.6 });
    const bootMat = new THREE.MeshStandardMaterial({ color: 0x18181b, roughness: 0.35, metalness: 0.3 });

    // Left Leg
    const leftLegGroup = new THREE.Group();
    leftLegGroup.position.set(-0.2, 0, 0);

    const leftLegMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.09, 0.85, 8), pantsMat);
    leftLegMesh.position.y = -0.42;
    leftLegMesh.castShadow = !isSoftwareGl;
    leftLegGroup.add(leftLegMesh);

    // Tactical Knee Pad
    const leftKnee = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.18, 0.08), kneePadMat);
    leftKnee.position.set(0, -0.45, 0.1);
    leftLegGroup.add(leftKnee);

    // Heavy Combat Boot
    const leftBoot = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.14, 0.36), bootMat);
    leftBoot.position.set(0, -0.88, 0.08);
    leftLegGroup.add(leftBoot);

    hips.add(leftLegGroup);

    // Right Leg
    const rightLegGroup = new THREE.Group();
    rightLegGroup.position.set(0.2, 0, 0);

    const rightLegMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.09, 0.85, 8), pantsMat);
    rightLegMesh.position.y = -0.42;
    rightLegMesh.castShadow = !isSoftwareGl;
    rightLegGroup.add(rightLegMesh);

    const rightKnee = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.18, 0.08), kneePadMat);
    rightKnee.position.set(0, -0.45, 0.1);
    rightLegGroup.add(rightKnee);

    const rightBoot = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.14, 0.36), bootMat);
    rightBoot.position.set(0, -0.88, 0.08);
    rightLegGroup.add(rightBoot);

    hips.add(rightLegGroup);

    // Arms with Fingerless Combat Gloves
    const gloveMat = new THREE.MeshStandardMaterial({ color: 0x18181b, roughness: 0.4, metalness: 0.5 });

    // Left Arm
    const leftArmGroup = new THREE.Group();
    leftArmGroup.position.set(-0.46, 0.72, 0);

    const leftArmMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.085, 0.075, 0.72, 8), jacketMat);
    leftArmMesh.position.y = -0.36;
    leftArmGroup.add(leftArmMesh);

    const leftGlove = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.16, 0.12), gloveMat);
    leftGlove.position.y = -0.74;
    leftArmGroup.add(leftGlove);

    hips.add(leftArmGroup);

    // Right Arm
    const rightArmGroup = new THREE.Group();
    rightArmGroup.position.set(0.46, 0.72, 0);

    const rightArmMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.085, 0.075, 0.72, 8), jacketMat);
    rightArmMesh.position.y = -0.36;
    rightArmGroup.add(rightArmMesh);

    const rightGlove = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.16, 0.12), gloveMat);
    rightGlove.position.y = -0.74;
    rightArmGroup.add(rightGlove);

    hips.add(rightArmGroup);

    charGroup.add(hips);
    this.scene.add(charGroup);

    this.character = {
      group: charGroup,
      hips,
      head: headGroup,
      leftLeg: leftLegGroup,
      rightLeg: rightLegGroup,
      leftArm: leftArmGroup,
      rightArm: rightArmGroup,
      pos: charGroup.position,
      walkCycle: 0,
      idleTime: 0,
      isMoving: false,
      targetAngle: Math.PI
    };
  }

  // ------------------------------------------
  // CAMERA MODE TOGGLE
  // ------------------------------------------
  toggleCameraMode() {
    this.cameraMode = this.cameraMode === 'third-person' ? 'first-person' : 'third-person';
    if (this.character && this.character.group) {
      this.character.group.visible = this.cameraMode === 'third-person';
    }
    audio.playChime(659.25, 0.3);
    return this.cameraMode;
  }

  // ------------------------------------------
  // TACTICAL ACTIONS: SPRINT, JUMP, CROUCH
  // ------------------------------------------
  toggleSprint() {
    this.isSprinting = !this.isSprinting;
    audio.playChime(this.isSprinting ? 784 : 440, 0.2);
    return this.isSprinting;
  }

  triggerJump() {
    if (!this.character) return;
    if (this.character.pos.y <= 0.05) {
      this.verticalVelocity = 8.0;
      audio.playJumpSound();
    }
  }

  toggleCrouch() {
    this.isCrouched = !this.isCrouched;
    audio.playChime(this.isCrouched ? 330 : 523, 0.2);
    return this.isCrouched;
  }

  // ------------------------------------------
  // GATE CONTROL
  // ------------------------------------------
  toggleGate() {
    this.gateDoors.isOpen = !this.gateDoors.isOpen;
    this.gateDoors.targetAngle = this.gateDoors.isOpen ? Math.PI * 0.48 : 0;
    audio.playDoorSound();
  }

  openGate() {
    if (!this.gateDoors.isOpen) {
      this.gateDoors.isOpen = true;
      this.gateDoors.targetAngle = Math.PI * 0.48;
      audio.playDoorSound();
      audio.playChime(784, 0.4);
    }
  }

  // ------------------------------------------
  // ATMOSPHERE (Day, Sunset, Night)
  // ------------------------------------------
  setAtmosphere(mode) {
    this.atmosphere = mode;
    if (mode === 'day') {
      this.scene.fog.color.setHex(0xbbf7d0);
      this.renderer.setClearColor(0xbbf7d0);
      if (this.lights.hemi) this.lights.hemi.intensity = 0.95;
      if (this.lights.sun) {
        this.lights.sun.color.setHex(0xfffbeb);
        this.lights.sun.intensity = 1.45;
      }
    } else if (mode === 'sunset') {
      this.scene.fog.color.setHex(0xfdba74);
      this.renderer.setClearColor(0xfdba74);
      if (this.lights.hemi) this.lights.hemi.intensity = 0.7;
      if (this.lights.sun) {
        this.lights.sun.color.setHex(0xf97316);
        this.lights.sun.intensity = 1.6;
      }
    } else if (mode === 'night') {
      this.scene.fog.color.setHex(0x020617);
      this.renderer.setClearColor(0x020617);
      if (this.lights.hemi) this.lights.hemi.intensity = 0.3;
      if (this.lights.sun) {
        this.lights.sun.color.setHex(0x38bdf8);
        this.lights.sun.intensity = 0.4;
      }
    }
    audio.playChime(440, 0.2);
  }

  // ------------------------------------------
  // TELEPORT PRESETS
  // ------------------------------------------
  teleportTo(preset) {
    if (!this.character) return;
    const presets = {
      gate: { x: 0, z: 46, yaw: Math.PI },
      hall: { x: 0, z: 8, yaw: Math.PI },
      clinic: { x: 12, z: -20, yaw: Math.PI },
      tech: { x: 22, z: 10, yaw: -Math.PI / 2 },
      library: { x: -12, z: -20, yaw: Math.PI },
      lounge: { x: -22, z: 10, yaw: Math.PI / 2 },
      cv: { x: -16, z: 20, yaw: Math.PI / 4 },
      contact: { x: 16, z: 20, yaw: -Math.PI / 4 }
    };

    const target = presets[preset];
    if (target) {
      this.character.pos.set(target.x, 0, target.z);
      this.character.targetAngle = target.yaw;
      this.orbitYaw = target.yaw;
      audio.playChime(587.33, 0.35);

      if (target.z < 30) {
        this.openGate();
      }

      const pills = document.querySelectorAll('.teleport-pill');
      pills.forEach((p) => p.classList.toggle('active', p.dataset.preset === preset));
    }
  }

  // ------------------------------------------
  // PROXIMITY ACTION / LOOT TRIGGER
  // ------------------------------------------
  triggerProximityAction() {
    if (!this.currentNearestInteractive) return;
    const obj = this.currentNearestInteractive;

    if (obj.userData.type === 'door') {
      obj.userData.isOpen = !obj.userData.isOpen;
      obj.userData.targetAngle = obj.userData.isOpen ? Math.PI * 0.55 : 0;
      audio.playDoorSound();
    } else if (obj.userData.type === 'airdrop') {
      if (window.openAirdropModal) {
        window.openAirdropModal();
      } else {
        this.showExhibitModal(obj.userData);
      }
      audio.playLootSound();
    } else if (obj.userData.type === 'exhibit') {
      this.showExhibitModal(obj.userData);
      audio.playLootSound();
    }
  }

  showExhibitModal(data) {
    const modal = document.getElementById('inspectModal');
    const cat = document.getElementById('inspectCategory');
    const title = document.getElementById('inspectTitle');
    const desc = document.getElementById('inspectDesc');
    const actionBtn = document.getElementById('inspectActionBtn');

    if (modal && title && desc) {
      if (cat) cat.textContent = data.category || 'Battleground Intel';
      title.textContent = data.title;
      desc.textContent = data.desc;

      if (actionBtn) {
        actionBtn.textContent = data.buttonText || 'Loot Intel ➜';
        actionBtn.onclick = () => {
          modal.classList.remove('active');
          if (data.link && data.link.startsWith('#')) {
            if (window.toggle3DView) window.toggle3DView(false);
            window.location.hash = data.link;
          } else if (data.link) {
            window.open(data.link, '_blank');
          }
        };
      }
      modal.classList.add('active');
      audio.playChime(659.25, 0.4);
    }
  }

  // ------------------------------------------
  // EVENT LISTENERS & PC/MOBILE INPUTS
  // ------------------------------------------
  setupEventListeners() {
    const canvas = this.renderer.domElement;

    window.addEventListener('resize', () => {
      if (!this.container || !this.renderer || !this.camera) return;
      this.camera.aspect = this.container.clientWidth / this.container.clientHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    });

    // Keyboard (WASD, Arrows, Shift, Space, C, F, E)
    window.addEventListener('keydown', (e) => {
      if (['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName)) return;
      switch (e.code) {
        case 'KeyW':
        case 'ArrowUp':
          this.keys.forward = true;
          break;
        case 'KeyS':
        case 'ArrowDown':
          this.keys.backward = true;
          break;
        case 'KeyA':
        case 'ArrowLeft':
          this.keys.left = true;
          break;
        case 'KeyD':
        case 'ArrowRight':
          this.keys.right = true;
          break;
        case 'ShiftLeft':
        case 'ShiftRight':
          this.keys.sprint = true;
          break;
        case 'Space':
          e.preventDefault();
          this.triggerJump();
          break;
        case 'KeyC':
          this.toggleCrouch();
          break;
        case 'KeyF':
        case 'KeyE':
          this.triggerProximityAction();
          break;
      }
    });

    window.addEventListener('keyup', (e) => {
      switch (e.code) {
        case 'KeyW':
        case 'ArrowUp':
          this.keys.forward = false;
          break;
        case 'KeyS':
        case 'ArrowDown':
          this.keys.backward = false;
          break;
        case 'KeyA':
        case 'ArrowLeft':
          this.keys.left = false;
          break;
        case 'KeyD':
        case 'ArrowRight':
          this.keys.right = false;
          break;
        case 'ShiftLeft':
        case 'ShiftRight':
          this.keys.sprint = false;
          break;
      }
    });

    // Mouse Drag to Orbit Camera
    canvas.addEventListener('mousedown', (e) => {
      this.isDragging = true;
      this.prevMousePos = { x: e.clientX, y: e.clientY };
    });

    window.addEventListener('mousemove', (e) => {
      if (!this.isDragging) return;
      const dx = e.clientX - this.prevMousePos.x;
      const dy = e.clientY - this.prevMousePos.y;

      this.orbitYaw -= dx * 0.0055;
      this.orbitPitch = Math.max(-0.25, Math.min(0.65, this.orbitPitch + dy * 0.0055));
      this.prevMousePos = { x: e.clientX, y: e.clientY };
    });

    window.addEventListener('mouseup', () => {
      this.isDragging = false;
    });

    // Touch Drag to Look Around (Right Half of Mobile Screen)
    let touchLookActive = false;
    let prevTouchLook = { x: 0, y: 0 };

    canvas.addEventListener('touchstart', (e) => {
      const touch = e.touches[0];
      if (touch.clientX > window.innerWidth * 0.35) {
        touchLookActive = true;
        prevTouchLook = { x: touch.clientX, y: touch.clientY };
      }
    });

    canvas.addEventListener('touchmove', (e) => {
      if (!touchLookActive) return;
      const touch = e.touches[0];
      const dx = touch.clientX - prevTouchLook.x;
      const dy = touch.clientY - prevTouchLook.y;

      this.orbitYaw -= dx * 0.0065;
      this.orbitPitch = Math.max(-0.25, Math.min(0.65, this.orbitPitch + dy * 0.0065));
      prevTouchLook = { x: touch.clientX, y: touch.clientY };
    });

    canvas.addEventListener('touchend', () => {
      touchLookActive = false;
    });

    // Click / Tap Direct Object Raycaster
    canvas.addEventListener('click', (e) => {
      const rect = canvas.getBoundingClientRect();
      _pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      _pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      _raycaster.setFromCamera(_pointer, this.camera);
      const hits = _raycaster.intersectObjects(this.interactiveObjects, true);

      if (hits.length > 0) {
        let current = hits[0].object;
        while (current && !current.userData?.type && current.parent) {
          current = current.parent;
        }

        if (current && current.userData) {
          if (current.userData.type === 'door') {
            current.userData.isOpen = !current.userData.isOpen;
            current.userData.targetAngle = current.userData.isOpen ? Math.PI * 0.55 : 0;
            audio.playDoorSound();
          } else if (current.userData.type === 'airdrop') {
            if (window.openAirdropModal) window.openAirdropModal();
            else this.showExhibitModal(current.userData);
          } else if (current.userData.type === 'exhibit') {
            this.showExhibitModal(current.userData);
          }
        }
      }
    });

    // Mobile Virtual Joystick (PUBG Style with Sprint Drag Tab)
    const joyStick = document.getElementById('virtualJoystick');
    const joyThumb = document.getElementById('joystickThumb');
    if (joyStick && joyThumb) {
      let joyActive = false;
      const joyRadius = 45;

      const handleJoy = (touchX, touchY) => {
        const rect = joyStick.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        let dx = touchX - cx;
        let dy = touchY - cy;
        const dist = Math.sqrt(dx * dx + dy * dy);

        // Sprint lock when dragged past top threshold
        if (dy < -joyRadius * 1.3) {
          this.isSprinting = true;
        }

        if (dist > joyRadius) {
          dx = (dx / dist) * joyRadius;
          dy = (dy / dist) * joyRadius;
        }
        joyThumb.style.transform = `translate(${dx}px, ${dy}px)`;
        this.joystickVector.x = dx / joyRadius;
        this.joystickVector.y = -dy / joyRadius;
      };

      joyStick.addEventListener('touchstart', (e) => {
        e.preventDefault();
        joyActive = true;
        handleJoy(e.touches[0].clientX, e.touches[0].clientY);
      });

      window.addEventListener('touchmove', (e) => {
        if (!joyActive) return;
        handleJoy(e.touches[0].clientX, e.touches[0].clientY);
      });

      const resetJoy = () => {
        joyActive = false;
        joyThumb.style.transform = 'translate(0px, 0px)';
        this.joystickVector.x = 0;
        this.joystickVector.y = 0;
      };

      window.addEventListener('touchend', resetJoy);
      window.addEventListener('touchcancel', resetJoy);
    }
  }

  // -------------------------------------------------------------
  // ANIMATION LOOP (VICTOR RUN/SPRINT/JUMP, COMPASS, RADAR)
  // -------------------------------------------------------------
  animate() {
    const delta = Math.min(this.clock.getDelta(), 0.1);

    if (this.character) {
      // 1. Process Movement Vector relative to Camera View
      const forwardVec = _v1.set(Math.sin(this.orbitYaw), 0, Math.cos(this.orbitYaw)).normalize();
      const rightVec = _v2.set(Math.cos(this.orbitYaw), 0, -Math.sin(this.orbitYaw)).normalize();

      let moveX = 0;
      let moveZ = 0;

      if (this.keys.forward) moveZ -= 1;
      if (this.keys.backward) moveZ += 1;
      if (this.keys.left) moveX -= 1;
      if (this.keys.right) moveX += 1;

      if (Math.abs(this.joystickVector.x) > 0.05 || Math.abs(this.joystickVector.y) > 0.05) {
        moveX += this.joystickVector.x;
        moveZ -= this.joystickVector.y;
      }

      const isMoving = Math.abs(moveX) > 0.05 || Math.abs(moveZ) > 0.05;
      this.character.isMoving = isMoving;

      const isRunningSprint = (this.keys.sprint || this.isSprinting) && isMoving && !this.isCrouched;
      const currentSpeed = isRunningSprint
        ? this.moveSpeed * this.sprintMultiplier
        : this.isCrouched
        ? this.moveSpeed * 0.55
        : this.moveSpeed;

      if (isMoving) {
        const step = currentSpeed * delta;
        const dir = new THREE.Vector3();
        dir.addScaledVector(forwardVec, moveZ);
        dir.addScaledVector(rightVec, moveX);
        dir.normalize();

        this.character.pos.addScaledVector(dir, step);

        // World Containment Boundaries
        this.character.pos.x = Math.max(-28, Math.min(28, this.character.pos.x));
        this.character.pos.z = Math.max(-32, Math.min(52, this.character.pos.z));

        // Smoothly rotate Victor to face movement direction
        const targetAngle = Math.atan2(dir.x, dir.z);
        this.character.group.rotation.y = THREE.MathUtils.lerp(
          this.character.group.rotation.y,
          targetAngle,
          Math.min(delta * 14, 1)
        );

        // Victor Walk / Sprint Cycle Animations
        const cycleSpeed = isRunningSprint ? 17 : 11;
        this.character.walkCycle += delta * cycleSpeed;
        const wc = this.character.walkCycle;

        const legAmp = isRunningSprint ? 0.95 : 0.65;
        const armAmp = isRunningSprint ? 0.85 : 0.55;

        this.character.leftLeg.rotation.x = Math.sin(wc) * legAmp;
        this.character.rightLeg.rotation.x = -Math.sin(wc) * legAmp;
        this.character.leftArm.rotation.x = -Math.sin(wc) * armAmp;
        this.character.rightArm.rotation.x = Math.sin(wc) * armAmp;

        const baseHipsY = this.isCrouched ? 0.65 : 0.95;
        this.character.hips.position.y = baseHipsY + Math.abs(Math.sin(wc * 2)) * (isRunningSprint ? 0.1 : 0.06);
        this.character.hips.rotation.z = Math.sin(wc) * (isRunningSprint ? 0.05 : 0.03);

        this.footstepTimer += delta;
        const stepInterval = isRunningSprint ? 0.22 : 0.32;
        if (this.footstepTimer > stepInterval) {
          audio.playFootstep();
          this.footstepTimer = 0;
        }
      } else {
        // Idle Animation Cycle (Natural breathing, reset limbs)
        this.character.idleTime += delta;
        const it = this.character.idleTime;

        this.character.leftLeg.rotation.x = THREE.MathUtils.damp(this.character.leftLeg.rotation.x, 0, 8, delta);
        this.character.rightLeg.rotation.x = THREE.MathUtils.damp(this.character.rightLeg.rotation.x, 0, 8, delta);
        this.character.leftArm.rotation.x = THREE.MathUtils.damp(this.character.leftArm.rotation.x, 0, 8, delta);
        this.character.rightArm.rotation.x = THREE.MathUtils.damp(this.character.rightArm.rotation.x, 0, 8, delta);

        const baseHipsY = this.isCrouched ? 0.65 : 0.95;
        this.character.hips.position.y = THREE.MathUtils.damp(
          this.character.hips.position.y,
          baseHipsY + Math.sin(it * 2.5) * 0.012,
          6,
          delta
        );
        this.character.head.rotation.y = Math.sin(it * 0.7) * 0.06;
      }

      // Vertical Gravity & Jump Physics
      if (this.character.pos.y > 0 || this.verticalVelocity !== 0) {
        this.verticalVelocity -= this.gravity * delta;
        this.character.pos.y += this.verticalVelocity * delta;

        // Airborne tuck pose
        this.character.leftLeg.rotation.x = 0.4;
        this.character.rightLeg.rotation.x = -0.3;

        if (this.character.pos.y <= 0) {
          this.character.pos.y = 0;
          this.verticalVelocity = 0;
          audio.playFootstep();
        }
      }

      // ---------------------------------------------------------
      // CAMERA FOLLOW SYSTEM
      // ---------------------------------------------------------
      if (this.cameraMode === 'third-person') {
        const camDist = 4.8;
        const camHeight = this.isCrouched ? 1.8 : 2.4;
        const cx = this.character.pos.x + Math.sin(this.orbitYaw) * Math.cos(this.orbitPitch) * camDist;
        const cy = this.character.pos.y + camHeight + Math.sin(this.orbitPitch) * 2.0;
        const cz = this.character.pos.z + Math.cos(this.orbitYaw) * Math.cos(this.orbitPitch) * camDist;

        this.camera.position.x = THREE.MathUtils.damp(this.camera.position.x, cx, 8, delta);
        this.camera.position.y = THREE.MathUtils.damp(this.camera.position.y, cy, 8, delta);
        this.camera.position.z = THREE.MathUtils.damp(this.camera.position.z, cz, 8, delta);

        const lookTarget = _v1.set(this.character.pos.x, this.character.pos.y + 1.45, this.character.pos.z);
        this.camera.lookAt(lookTarget);
      } else {
        // First Person POV
        const eyeY = this.isCrouched ? 1.2 : 1.75;
        this.camera.position.set(this.character.pos.x, this.character.pos.y + eyeY, this.character.pos.z);
        const lookDist = 10;
        const lx = this.camera.position.x - Math.sin(this.orbitYaw) * Math.cos(this.orbitPitch) * lookDist;
        const ly = this.camera.position.y + Math.sin(this.orbitPitch) * lookDist;
        const lz = this.camera.position.z - Math.cos(this.orbitYaw) * Math.cos(this.orbitPitch) * lookDist;
        this.camera.lookAt(lx, ly, lz);
      }

      // ---------------------------------------------------------
      // GATE AUTO-OPENING
      // ---------------------------------------------------------
      const distToGate = this.character.pos.distanceTo(new THREE.Vector3(0, 0, 32));
      if (distToGate < 8.5 && !this.gateDoors.isOpen && this.character.pos.z > 20) {
        this.openGate();
      }

      // ---------------------------------------------------------
      // PROXIMITY DETECTION & PUBG LOOT PROMPT
      // ---------------------------------------------------------
      let closestObj = null;
      let minDistance = 5.0;

      this.interactiveObjects.forEach((obj) => {
        const worldPos = new THREE.Vector3();
        obj.getWorldPosition(worldPos);
        const dist = this.character.pos.distanceTo(worldPos);

        if (dist < minDistance) {
          minDistance = dist;
          closestObj = obj;
        }

        if (obj.userData?.type === 'door' && dist < 4.0 && !obj.userData.isOpen) {
          obj.userData.isOpen = true;
          obj.userData.targetAngle = Math.PI * 0.55;
          audio.playDoorSound();
        }
      });

      this.currentNearestInteractive = closestObj;

      // Update On-Screen Dynamic Proximity & Loot Banner
      const banner = document.getElementById('proximityBanner');
      const bannerText = document.getElementById('proximityText');
      const bannerIcon = document.getElementById('proximityIcon');
      const bannerLabel = document.getElementById('proximityLabel');
      const bannerPill = document.getElementById('proximityActionPill');

      if (banner && bannerText) {
        if (closestObj && closestObj.userData) {
          banner.style.display = 'flex';
          if (bannerPill) bannerPill.style.display = 'flex';

          if (closestObj.userData.type === 'airdrop') {
            if (bannerIcon) bannerIcon.textContent = '📦';
            if (bannerLabel) bannerLabel.textContent = 'AIRDROP SUPPLY CRATE';
            bannerText.textContent = 'Level 3 Fahim Shahriar Portfolio Loot Drop';
            if (bannerPill) bannerPill.innerHTML = '<span class="pubg-key-badge">F</span> Open Crate';
          } else if (closestObj.userData.type === 'door') {
            if (bannerIcon) bannerIcon.textContent = '🚪';
            if (bannerLabel) bannerLabel.textContent = 'ROOM PORTAL DOOR';
            bannerText.textContent = `${closestObj.userData.englishTitle} — ${closestObj.userData.banglaSubtitle}`;
            if (bannerPill) bannerPill.innerHTML = closestObj.userData.isOpen ? '<span class="pubg-key-badge">F</span> Enter Room' : '<span class="pubg-key-badge">F</span> Open Door';
          } else if (closestObj.userData.type === 'exhibit') {
            if (bannerIcon) bannerIcon.textContent = '🔍';
            if (bannerLabel) bannerLabel.textContent = 'INTELLIGENCE INTEL';
            bannerText.textContent = `${closestObj.userData.title} (Press [F] to Loot)`;
            if (bannerPill) bannerPill.innerHTML = '<span class="pubg-key-badge">F</span> Loot Intel';
          }
        } else {
          if (bannerPill) bannerPill.style.display = 'none';
          if (bannerLabel) bannerLabel.textContent = 'BATTLEGROUND ZONE';
          if (this.character.pos.z > 33) {
            if (bannerIcon) bannerIcon.textContent = '🌸';
            bannerText.textContent = 'Botanical Grounds · Head forward through the Gate';
          } else if (this.character.pos.z > 14) {
            if (bannerIcon) bannerIcon.textContent = '⛩️';
            bannerText.textContent = 'Courtyard Entry · Proceed into the Central Rotunda Hall';
          } else {
            if (bannerIcon) bannerIcon.textContent = '🏛️';
            bannerText.textContent = 'Grand Rotunda · Choose any doorway menu above';
          }
        }
      }

      // ---------------------------------------------------------
      // PUBG COMPASS & RADAR MINIMAP REAL-TIME SYNC
      // ---------------------------------------------------------
      // 1. Compass Heading (0° - 360°)
      let deg = Math.round((this.orbitYaw * 180) / Math.PI) % 360;
      if (deg < 0) deg += 360;

      const headingEl = document.getElementById('pubgHeadingDeg');
      if (headingEl) {
        let card = 'N';
        if (deg >= 23 && deg < 68) card = 'NE';
        else if (deg >= 68 && deg < 113) card = 'E';
        else if (deg >= 113 && deg < 158) card = 'SE';
        else if (deg >= 158 && deg < 203) card = 'S';
        else if (deg >= 203 && deg < 248) card = 'SW';
        else if (deg >= 248 && deg < 293) card = 'W';
        else if (deg >= 293 && deg < 338) card = 'NW';
        headingEl.textContent = `${deg}° ${card}`;
      }

      // 2. Compass Ribbon Horizontal Translation
      const ribbon = document.getElementById('pubgCompassRibbon');
      if (ribbon) {
        // Shift ribbon smoothly
        const shift = ((deg - 180) / 180) * 120;
        ribbon.style.transform = `translateX(${-shift}px)`;
      }

      // 3. Radar Minimap Arrow Rotation & Coordinates
      const radarArrow = document.getElementById('pubgRadarArrow');
      if (radarArrow) {
        const charRotDeg = Math.round((this.character.group.rotation.y * 180) / Math.PI);
        radarArrow.style.transform = `translate(-50%, -50%) rotate(${-charRotDeg + 180}deg)`;
      }

      const coordsEl = document.getElementById('pubgCoords');
      if (coordsEl) {
        const rx = Math.round(this.character.pos.x);
        const rz = Math.round(this.character.pos.z);
        coordsEl.textContent = `ERANGEL · X: ${rx}, Z: ${rz}`;
      }
    }

    // Smooth Hinged Door Rotations
    if (this.gateDoors.left && this.gateDoors.targetAngle !== undefined) {
      this.gateDoors.left.rotation.y = THREE.MathUtils.damp(
        this.gateDoors.left.rotation.y,
        -this.gateDoors.targetAngle,
        5,
        delta
      );
      this.gateDoors.right.rotation.y = THREE.MathUtils.damp(
        this.gateDoors.right.rotation.y,
        this.gateDoors.targetAngle,
        5,
        delta
      );
    }

    this.doors.forEach((door) => {
      if (door.doorPivot && door.targetAngle !== undefined) {
        door.doorPivot.rotation.y = THREE.MathUtils.damp(
          door.doorPivot.rotation.y,
          door.targetAngle,
          6,
          delta
        );
      }
    });

    // Airdrop Smoke Rise Animation
    if (this.airdropSmoke) {
      const pos = this.airdropSmoke.geometry.attributes.position.array;
      for (let i = 1; i < pos.length; i += 3) {
        pos[i] += delta * 1.5;
        if (pos[i] > 8.5) pos[i] = 1.9;
      }
      this.airdropSmoke.geometry.attributes.position.needsUpdate = true;
    }

    // Render frame
    this.renderer.render(this.scene, this.camera);

    requestAnimationFrame(() => this.animate());
  }
}

// Global hooks
window.VirtualWorld = VirtualWorld;
window.audioSynthesizer = audio;
