import { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import './CuteAnimeBot.css';

/**
 * CuteAnimeBot Component
 * An ultra-cute, interactive 3D Chibi Anime Robot Companion built with Three.js.
 * 
 * Guarantees:
 * 1. ALWAYS TWO clearly visible, large, sparkling anime eyes (never hidden or clipped).
 * 2. Realistically turns head and shifts gaze directly to the active card in full 3D (hubuhu realistic looking).
 * 3. Upper cards (role-1, role-2): Head tilts UP + pupils look UP.
 *    Lower cards (role-3, role-4): Head tilts DOWN + pupils look DOWN.
 *    Left cards (role-1, role-3): Head turns LEFT + pupils look LEFT + left paw points.
 *    Right cards (role-2, role-4): Head turns RIGHT + pupils look RIGHT + right paw points.
 * 4. Zero text underneath the bot.
 * 5. Interactive click celebration with floating hearts & stars.
 */
/**
 * Synthesizes a sweet, adorable melodic anime chirp sound
 * using the browser's native Web Audio API (zero external asset dependencies).
 */
function playCuteAnimeChirp() {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    const now = ctx.currentTime;

    // Sweet cheerful ascending notes: D6 (1174Hz) -> G6 (1568Hz) -> C7 (2093Hz)
    const notes = [
      { freq: 1174.66, time: 0, dur: 0.11 },
      { freq: 1567.98, time: 0.06, dur: 0.13 },
      { freq: 2093.0, time: 0.13, dur: 0.26 },
    ];

    notes.forEach(({ freq, time: noteTime, dur }) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + noteTime);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.08, now + noteTime + dur);

      gain.gain.setValueAtTime(0, now + noteTime);
      gain.gain.linearRampToValueAtTime(0.12, now + noteTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + noteTime + dur);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + noteTime);
      osc.stop(now + noteTime + dur);
    });
  } catch {
    // Non-critical audio error handling
  }
}

export default function CuteAnimeBot({
  targetGaze = { x: 0, y: 0 },
  activeCard = null,
  onBotClick = null,
}) {
  const mountRef = useRef(null);
  const [isHappy, setIsHappy] = useState(false);
  const [particles, setParticles] = useState([]);
  const isHappyRef = useRef(false);
  const targetGazeRef = useRef({ x: 0, y: 0 });
  const activeCardRef = useRef(null);

  useEffect(() => {
    targetGazeRef.current = targetGaze;
  }, [targetGaze]);

  useEffect(() => {
    activeCardRef.current = activeCard;
  }, [activeCard]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const isLightMode = document.documentElement.getAttribute('data-theme') === 'light';

    // ── Scene, Camera & Renderer ──
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      40,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    );
    camera.position.set(0, 0.1, 5.8);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = isLightMode ? 1.25 : 1.35;
    container.appendChild(renderer.domElement);

    // ── Lighting (Pure Crisp White & Crystal Ice-Blue - Zero Pink Tint) ──
    const ambientLight = new THREE.AmbientLight(
      0xffffff,
      isLightMode ? 1.7 : 1.5
    );
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.2);
    keyLight.position.set(3, 4, 4);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xdbeafe, 1.2);
    fillLight.position.set(-3, -2, 3);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0x38bdf8, 1.8);
    rimLight.position.set(0, 4, -3);
    scene.add(rimLight);

    // ── Main Bot Root Group ──
    const botRoot = new THREE.Group();
    scene.add(botRoot);

    // ── Materials ──
    // Pure Snow White / Porcelain Pearl Body Material (Hubuhu Original)
    const bodyMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      roughness: 0.15,
      metalness: 0.04,
      clearcoat: 0.95,
      clearcoatRoughness: 0.05,
    });

    // Accent Cyber Neon Material (Electric Sky Blue / Cyan)
    const eyeColor = 0x00b4d8;
    const eyeMaterial = new THREE.MeshBasicMaterial({
      color: eyeColor,
      depthTest: false,
    });

    const pupilMaterial = new THREE.MeshBasicMaterial({
      color: 0x021526,
      depthTest: false,
    });

    const catchlightMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      depthTest: false,
    });

    const lashMaterial = new THREE.MeshBasicMaterial({
      color: 0x0f172a,
      depthTest: false,
    });

    const blushMaterial = new THREE.MeshBasicMaterial({
      color: 0xff6b8b,
      transparent: true,
      opacity: 0.65,
    });

    // Royal Blue Headphone Ear Caps (Exact match with original screenshot)
    const earHubMaterial = new THREE.MeshStandardMaterial({
      color: 0x1d4ed8,
      roughness: 0.25,
      metalness: 0.75,
    });

    // ── 1. TORSO GROUP ──
    const torsoGroup = new THREE.Group();
    botRoot.add(torsoGroup);

    // Chibi Rounded Chubby Torso
    const torsoGeo = new THREE.SphereGeometry(0.56, 32, 32);
    torsoGeo.scale(1.0, 1.15, 0.9);
    const torsoMesh = new THREE.Mesh(torsoGeo, bodyMaterial);
    torsoMesh.position.y = -0.65;
    torsoGroup.add(torsoMesh);

    // Glowing Heart / Energy Crystal Core
    const coreGeo = new THREE.OctahedronGeometry(0.16, 0);
    coreGeo.scale(1.0, 1.2, 0.8);
    const coreMat = new THREE.MeshBasicMaterial({ color: eyeColor });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    coreMesh.position.set(0, -0.55, 0.48);
    torsoGroup.add(coreMesh);

    // ── Floating Magnetic Chibi Paws ──
    const handGeo = new THREE.SphereGeometry(0.22, 24, 24);
    handGeo.scale(1.0, 0.85, 0.9);

    // Left Paw Group
    const leftHand = new THREE.Group();
    leftHand.position.set(-0.88, -0.6, 0.2);
    torsoGroup.add(leftHand);

    const leftHandMesh = new THREE.Mesh(handGeo, bodyMaterial);
    leftHand.add(leftHandMesh);

    const padGeo = new THREE.SphereGeometry(0.08, 16, 16);
    const padMat = new THREE.MeshBasicMaterial({ color: eyeColor });
    const leftPad = new THREE.Mesh(padGeo, padMat);
    leftPad.position.set(0, -0.05, 0.16);
    leftHand.add(leftPad);

    // Right Paw Group
    const rightHand = new THREE.Group();
    rightHand.position.set(0.88, -0.6, 0.2);
    torsoGroup.add(rightHand);

    const rightHandMesh = new THREE.Mesh(handGeo, bodyMaterial);
    rightHand.add(rightHandMesh);

    const rightPad = new THREE.Mesh(padGeo, padMat);
    rightPad.position.set(0, -0.05, 0.16);
    rightHand.add(rightPad);

    // ── 2. HEAD GROUP (Smooth 3D Pitch, Yaw & Roll) ──
    const headGroup = new THREE.Group();
    headGroup.position.set(0, 0.38, 0);
    botRoot.add(headGroup);

    // Extra-Chibi Adorable Head
    const headGeo = new THREE.SphereGeometry(1.05, 36, 36);
    headGeo.scale(1.12, 0.96, 1.0);
    const headMesh = new THREE.Mesh(headGeo, bodyMaterial);
    headGroup.add(headMesh);

    // ── 3. TWO BEAUTIFUL ANIME EYES (Guaranteed Always 2 Eyes Visible) ──
    // Left & Right Eyes are placed in front of the visor
    const eyeContourGeo = new THREE.SphereGeometry(0.25, 24, 24);
    eyeContourGeo.scale(0.88, 1.3, 0.25);

    // LEFT EYE ASSEMBLY
    const leftEyeGroup = new THREE.Group();
    leftEyeGroup.position.set(-0.35, 0.05, 1.15);
    leftEyeGroup.renderOrder = 99;
    headGroup.add(leftEyeGroup);

    const leftIris = new THREE.Mesh(eyeContourGeo, eyeMaterial);
    leftIris.renderOrder = 100;
    leftEyeGroup.add(leftIris);

    // Left Pupil
    const pupilGeo = new THREE.SphereGeometry(0.14, 20, 20);
    pupilGeo.scale(0.85, 1.25, 0.25);
    const leftPupil = new THREE.Mesh(pupilGeo, pupilMaterial);
    leftPupil.position.set(0, 0, 0.04);
    leftPupil.renderOrder = 101;
    leftEyeGroup.add(leftPupil);

    // Left Catchlights (Sparkles)
    const catchlightBigGeo = new THREE.SphereGeometry(0.065, 16, 16);
    const catchlightSmallGeo = new THREE.SphereGeometry(0.035, 16, 16);

    const leftSparkle1 = new THREE.Mesh(catchlightBigGeo, catchlightMat);
    leftSparkle1.position.set(0.05, 0.1, 0.08);
    leftSparkle1.renderOrder = 102;
    leftEyeGroup.add(leftSparkle1);

    const leftSparkle2 = new THREE.Mesh(catchlightSmallGeo, catchlightMat);
    leftSparkle2.position.set(-0.06, -0.08, 0.07);
    leftSparkle2.renderOrder = 102;
    leftEyeGroup.add(leftSparkle2);

    // Cute Anime Papri (Eyelashes) — Left Eye
    const lashArcGeo = new THREE.TorusGeometry(0.24, 0.03, 12, 32, Math.PI * 0.72);
    lashArcGeo.rotateZ(Math.PI * 0.14);
    const leftLashArc = new THREE.Mesh(lashArcGeo, lashMaterial);
    leftLashArc.position.set(0, 0.16, 0.05);
    leftLashArc.renderOrder = 104;
    leftEyeGroup.add(leftLashArc);

    const wingGeo = new THREE.ConeGeometry(0.045, 0.16, 12);
    wingGeo.scale(1.0, 1.0, 0.35);

    const leftWing1 = new THREE.Mesh(wingGeo, lashMaterial);
    leftWing1.position.set(-0.21, 0.22, 0.05);
    leftWing1.rotation.set(0, 0, Math.PI * 0.35);
    leftWing1.renderOrder = 105;
    leftEyeGroup.add(leftWing1);

    const leftWing2 = new THREE.Mesh(wingGeo, lashMaterial);
    leftWing2.scale.set(0.75, 0.75, 0.75);
    leftWing2.position.set(-0.23, 0.13, 0.05);
    leftWing2.rotation.set(0, 0, Math.PI * 0.48);
    leftWing2.renderOrder = 105;
    leftEyeGroup.add(leftWing2);

    // RIGHT EYE ASSEMBLY
    const rightEyeGroup = new THREE.Group();
    rightEyeGroup.position.set(0.35, 0.05, 1.15);
    rightEyeGroup.renderOrder = 99;
    headGroup.add(rightEyeGroup);

    const rightIris = new THREE.Mesh(eyeContourGeo, eyeMaterial);
    rightIris.renderOrder = 100;
    rightEyeGroup.add(rightIris);

    const rightPupil = new THREE.Mesh(pupilGeo, pupilMaterial);
    rightPupil.position.set(0, 0, 0.04);
    rightPupil.renderOrder = 101;
    rightEyeGroup.add(rightPupil);

    const rightSparkle1 = new THREE.Mesh(catchlightBigGeo, catchlightMat);
    rightSparkle1.position.set(0.05, 0.1, 0.08);
    rightSparkle1.renderOrder = 102;
    rightEyeGroup.add(rightSparkle1);

    const rightSparkle2 = new THREE.Mesh(catchlightSmallGeo, catchlightMat);
    rightSparkle2.position.set(-0.06, -0.08, 0.07);
    rightSparkle2.renderOrder = 102;
    rightEyeGroup.add(rightSparkle2);

    // Cute Anime Papri (Eyelashes) — Right Eye (Symmetrically Mirrored)
    const rightLashArcGeo = new THREE.TorusGeometry(0.24, 0.03, 12, 32, Math.PI * 0.72);
    rightLashArcGeo.rotateZ(Math.PI * 0.14);
    rightLashArcGeo.rotateY(Math.PI);
    const rightLashArc = new THREE.Mesh(rightLashArcGeo, lashMaterial);
    rightLashArc.position.set(0, 0.16, 0.05);
    rightLashArc.renderOrder = 104;
    rightEyeGroup.add(rightLashArc);

    const rightWing1 = new THREE.Mesh(wingGeo, lashMaterial);
    rightWing1.position.set(0.21, 0.22, 0.05);
    rightWing1.rotation.set(0, 0, -Math.PI * 0.35);
    rightWing1.renderOrder = 105;
    rightEyeGroup.add(rightWing1);

    const rightWing2 = new THREE.Mesh(wingGeo, lashMaterial);
    rightWing2.scale.set(0.75, 0.75, 0.75);
    rightWing2.position.set(0.23, 0.13, 0.05);
    rightWing2.rotation.set(0, 0, -Math.PI * 0.48);
    rightWing2.renderOrder = 105;
    rightEyeGroup.add(rightWing2);

    // Cute Anime Smile (‿)
    const mouthGeo = new THREE.TorusGeometry(0.12, 0.024, 12, 28, Math.PI * 0.85);
    mouthGeo.rotateX(Math.PI);
    mouthGeo.rotateZ(-Math.PI * 0.08);
    const mouthMesh = new THREE.Mesh(mouthGeo, eyeMaterial);
    mouthMesh.position.set(0, -0.22, 1.14);
    mouthMesh.renderOrder = 100;
    headGroup.add(mouthMesh);

    // Flushed Glowing Rosy Pink Cheeks
    const blushGeo = new THREE.SphereGeometry(0.14, 16, 16);
    blushGeo.scale(1.4, 0.65, 0.2);

    const leftBlush = new THREE.Mesh(blushGeo, blushMaterial);
    leftBlush.position.set(-0.54, -0.18, 1.05);
    headGroup.add(leftBlush);

    const rightBlush = new THREE.Mesh(blushGeo, blushMaterial);
    rightBlush.position.set(0.54, -0.18, 1.05);
    headGroup.add(rightBlush);

    // ── 4. MECHA-KITTY EARS & FLOATING HALO ──
    const earGeo = new THREE.ConeGeometry(0.3, 0.68, 4);
    earGeo.scale(0.85, 1.2, 0.6);

    // Left Ear
    const leftEarMesh = new THREE.Mesh(earGeo, bodyMaterial);
    leftEarMesh.position.set(-0.68, 0.98, 0.05);
    leftEarMesh.rotation.set(-0.12, 0, 0.48);
    headGroup.add(leftEarMesh);

    const innerEarGeo = new THREE.ConeGeometry(0.2, 0.5, 4);
    innerEarGeo.scale(0.7, 1.1, 0.4);
    const leftInnerEar = new THREE.Mesh(innerEarGeo, eyeMaterial);
    leftInnerEar.position.set(-0.65, 0.95, 0.12);
    leftInnerEar.rotation.set(-0.12, 0, 0.48);
    headGroup.add(leftInnerEar);

    // Right Ear
    const rightEarMesh = new THREE.Mesh(earGeo, bodyMaterial);
    rightEarMesh.position.set(0.68, 0.98, 0.05);
    rightEarMesh.rotation.set(-0.12, 0, -0.48);
    headGroup.add(rightEarMesh);

    const rightInnerEar = new THREE.Mesh(innerEarGeo, eyeMaterial);
    rightInnerEar.position.set(0.65, 0.95, 0.12);
    rightInnerEar.rotation.set(-0.12, 0, -0.48);
    headGroup.add(rightInnerEar);

    // Headphone Hubs with Royal Blue Accent
    const earHubGeo = new THREE.CylinderGeometry(0.26, 0.26, 0.18, 24);
    earHubGeo.rotateZ(Math.PI / 2);

    const leftEarHub = new THREE.Mesh(earHubGeo, earHubMaterial);
    leftEarHub.position.set(-1.18, 0.05, 0);
    headGroup.add(leftEarHub);

    const rightEarHub = new THREE.Mesh(earHubGeo, earHubMaterial);
    rightEarHub.position.set(1.18, 0.05, 0);
    headGroup.add(rightEarHub);

    // Floating Angelic Cyber Halo
    const haloGroup = new THREE.Group();
    haloGroup.position.set(0, 1.48, 0);
    headGroup.add(haloGroup);

    const haloGeo = new THREE.TorusGeometry(0.48, 0.026, 16, 42);
    haloGeo.rotateX(Math.PI / 2.2);
    const haloMat = new THREE.MeshBasicMaterial({
      color: eyeColor,
      transparent: true,
      opacity: 0.85,
    });
    const haloMesh = new THREE.Mesh(haloGeo, haloMat);
    haloGroup.add(haloMesh);

    // ── 5. HOLOGRAPHIC FLOATING PLATFORM UNDERNEATH ──
    const hoverRingGroup = new THREE.Group();
    hoverRingGroup.position.set(0, -1.35, 0);
    botRoot.add(hoverRingGroup);

    const ring1Geo = new THREE.TorusGeometry(1.25, 0.022, 16, 48);
    ring1Geo.rotateX(Math.PI / 2);
    const ring1Mat = new THREE.MeshBasicMaterial({
      color: eyeColor,
      transparent: true,
      opacity: 0.45,
    });
    const ring1 = new THREE.Mesh(ring1Geo, ring1Mat);
    hoverRingGroup.add(ring1);

    const ring2Geo = new THREE.TorusGeometry(0.85, 0.016, 16, 48);
    ring2Geo.rotateX(Math.PI / 2);
    const ring2 = new THREE.Mesh(ring2Geo, ring1Mat);
    hoverRingGroup.add(ring2);

    // ── Animation Variables ──
    let animId;
    let lastTime = performance.now();
    let startTime = performance.now();
    let currentHeadRotY = 0;
    let currentHeadRotX = 0;
    let currentHeadTiltZ = 0;
    let currentPupilShiftX = 0;
    let currentPupilShiftY = 0;
    let blinkTimer = 0;
    let isBlinking = false;
    let nextBlinkTime = 2.2;

    const lerp = (start, end, factor) => start + (end - start) * factor;

    // ── Main Render Loop ──
    const animate = () => {
      animId = requestAnimationFrame(animate);
      const now = performance.now();
      const delta = Math.min((now - lastTime) * 0.001, 0.1);
      const time = (now - startTime) * 0.001;
      lastTime = now;

      const gaze = targetGazeRef.current;
      const activeCardId = activeCardRef.current;

      // ── ACCURATE 3D HEAD ORIENTATION TO LOOK DIRECTLY AT CARDS ──
      // gaze.x: -1 (Left), +1 (Right)
      // gaze.y: -0.88 (Upper), +0.88 (Lower)
      const targetRotY = gaze.x * 0.72; // Turns Left/Right towards card
      const targetRotX = gaze.y * 0.48; // Tilts UP for upper card (negative), DOWN for lower card (positive)
      const targetTiltZ = -gaze.x * 0.14; // Natural curious head tilt

      currentHeadRotY = lerp(currentHeadRotY, targetRotY, 0.14);
      currentHeadRotX = lerp(currentHeadRotX, targetRotX, 0.14);
      currentHeadTiltZ = lerp(currentHeadTiltZ, targetTiltZ, 0.14);

      headGroup.rotation.y = currentHeadRotY;
      headGroup.rotation.x = currentHeadRotX;
      headGroup.rotation.z = currentHeadTiltZ;

      // Subtle torso turn aligned with head
      torsoGroup.rotation.y = currentHeadRotY * 0.32;

      // ── ACCURATE PUPIL SHIFT TOWARDS THE CARD (Looking Hubuhu At Card) ──
      const targetPupilX = gaze.x * 0.085;
      const targetPupilY = -gaze.y * 0.075; // -gaze.y is UP when gaze.y is negative

      currentPupilShiftX = lerp(currentPupilShiftX, targetPupilX, 0.2);
      currentPupilShiftY = lerp(currentPupilShiftY, targetPupilY, 0.2);

      // Both eyes shift pupils symmetrically towards the card
      leftPupil.position.x = currentPupilShiftX;
      leftPupil.position.y = currentPupilShiftY;
      leftSparkle1.position.x = 0.05 + currentPupilShiftX * 0.5;
      leftSparkle1.position.y = 0.1 + currentPupilShiftY * 0.5;
      leftSparkle2.position.x = -0.06 + currentPupilShiftX * 0.5;
      leftSparkle2.position.y = -0.08 + currentPupilShiftY * 0.5;

      rightPupil.position.x = currentPupilShiftX;
      rightPupil.position.y = currentPupilShiftY;
      rightSparkle1.position.x = 0.05 + currentPupilShiftX * 0.5;
      rightSparkle1.position.y = 0.1 + currentPupilShiftY * 0.5;
      rightSparkle2.position.x = -0.06 + currentPupilShiftX * 0.5;
      rightSparkle2.position.y = -0.08 + currentPupilShiftY * 0.5;

      // Floating Bobbing Motion
      const floatOffset = Math.sin(time * 2.3) * 0.09;
      botRoot.position.y = floatOffset;

      // Halo Hover Spin & Wobble
      haloGroup.rotation.y = time * 0.9;
      haloGroup.position.y = 1.48 + Math.sin(time * 3.5) * 0.04;

      // ── REALISTIC CARD GESTURES ──
      // Bot leans forward and points paw directly at the card!
      if (activeCardId) {
        botRoot.position.z = lerp(botRoot.position.z, 0.22, 0.12); // Curious lean forward!
      } else {
        botRoot.position.z = lerp(botRoot.position.z, 0, 0.1);
      }

      if (activeCardId === 'role-1') {
        // Point Upper-Left
        leftHand.position.x = lerp(leftHand.position.x, -1.05, 0.16);
        leftHand.position.y = lerp(leftHand.position.y, -0.15 + Math.sin(time * 7) * 0.06, 0.18);
        leftHand.position.z = lerp(leftHand.position.z, 0.45, 0.16);
        leftHand.rotation.z = lerp(leftHand.rotation.z, -0.5, 0.16);
        rightHand.position.y = lerp(rightHand.position.y, -0.65 + Math.sin(time * 2.5) * 0.04, 0.1);
      } else if (activeCardId === 'role-2') {
        // Point Upper-Right
        rightHand.position.x = lerp(rightHand.position.x, 1.05, 0.16);
        rightHand.position.y = lerp(rightHand.position.y, -0.15 + Math.sin(time * 7) * 0.06, 0.18);
        rightHand.position.z = lerp(rightHand.position.z, 0.45, 0.16);
        rightHand.rotation.z = lerp(rightHand.rotation.z, 0.5, 0.16);
        leftHand.position.y = lerp(leftHand.position.y, -0.65 + Math.sin(time * 2.5) * 0.04, 0.1);
      } else if (activeCardId === 'role-3') {
        // Point Lower-Left
        leftHand.position.x = lerp(leftHand.position.x, -1.05, 0.16);
        leftHand.position.y = lerp(leftHand.position.y, -0.85 + Math.sin(time * 7) * 0.06, 0.18);
        leftHand.position.z = lerp(leftHand.position.z, 0.45, 0.16);
        leftHand.rotation.z = lerp(leftHand.rotation.z, -0.3, 0.16);
        rightHand.position.y = lerp(rightHand.position.y, -0.65 + Math.sin(time * 2.5) * 0.04, 0.1);
      } else if (activeCardId === 'role-4') {
        // Point Lower-Right
        rightHand.position.x = lerp(rightHand.position.x, 1.05, 0.16);
        rightHand.position.y = lerp(rightHand.position.y, -0.85 + Math.sin(time * 7) * 0.06, 0.18);
        rightHand.position.z = lerp(rightHand.position.z, 0.45, 0.16);
        rightHand.rotation.z = lerp(rightHand.rotation.z, 0.3, 0.16);
        leftHand.position.y = lerp(leftHand.position.y, -0.65 + Math.sin(time * 2.5) * 0.04, 0.1);
      } else {
        // Natural adorable floating paws
        leftHand.position.x = lerp(leftHand.position.x, -0.88, 0.1);
        leftHand.position.y = -0.6 + Math.sin(time * 2.6 + 0.6) * 0.08;
        leftHand.position.z = lerp(leftHand.position.z, 0.2, 0.1);
        leftHand.rotation.z = lerp(leftHand.rotation.z, 0, 0.1);

        rightHand.position.x = lerp(rightHand.position.x, 0.88, 0.1);
        rightHand.position.y = -0.6 + Math.cos(time * 2.6 + 0.6) * 0.08;
        rightHand.position.z = lerp(rightHand.position.z, 0.2, 0.1);
        rightHand.rotation.z = lerp(rightHand.rotation.z, 0, 0.1);
      }

      // Platform Ring Rotation & Wave
      hoverRingGroup.rotation.y = time * 0.75;
      ring1.scale.setScalar(1 + Math.sin(time * 3.2) * 0.05);
      ring2.scale.setScalar(1 - Math.cos(time * 3.2) * 0.05);

      // Heart Core & Blush Pulse
      const corePulse = 1 + Math.sin(time * 4.5) * 0.14;
      coreMesh.scale.setScalar(corePulse);
      coreMesh.rotation.y = time * 1.2;

      // ── LAL TUKTUKE BLUSHING & CELEBRATION WHEN CLICKED ──
      const isClicked = isHappyRef.current;
      if (isClicked) {
        // Bright vivid crimson-pink blushing cheeks (Lal Tuktuke!)
        blushMaterial.color.setHex(0xff0044);
        blushMaterial.opacity = 0.95;
        leftBlush.scale.set(1.9, 0.95, 0.35);
        rightBlush.scale.set(1.9, 0.95, 0.35);

        // Excited celebratory happy hand wave
        leftHand.position.y = lerp(leftHand.position.y, -0.22 + Math.sin(time * 12) * 0.08, 0.25);
        rightHand.position.y = lerp(rightHand.position.y, -0.22 + Math.cos(time * 12) * 0.08, 0.25);
        leftHand.rotation.z = -0.55;
        rightHand.rotation.z = 0.55;

        // Big cute open smile
        mouthMesh.scale.set(1.35, 1.35, 1.35);
      } else {
        blushMaterial.color.setHex(0xff6b8b);
        blushMaterial.opacity = 0.55 + Math.sin(time * 3) * 0.1;
        leftBlush.scale.set(1.4, 0.65, 0.2);
        rightBlush.scale.set(1.4, 0.65, 0.2);
        mouthMesh.scale.set(1.0, 1.0, 1.0);
      }

      // ── NATURAL ORGANIC BLINKING WHEN IDLE ──
      // When card is not hovered, blinks smoothly every 2.0 - 3.5s!
      if (!activeCardId) {
        blinkTimer += delta;
        if (!isBlinking && blinkTimer > nextBlinkTime) {
          isBlinking = true;
          blinkTimer = 0;
          nextBlinkTime = 2.0 + Math.random() * 1.5;
        }

        if (isBlinking) {
          const blinkDuration = 0.16; // 160ms smooth blink
          const progress = Math.min(1, blinkTimer / blinkDuration);
          // Smooth sine curve: 0 -> 1 -> 0
          const blinkCurve = Math.sin(progress * Math.PI);
          const eyeScaleY = Math.max(0.04, 1.0 - blinkCurve * 0.94);

          leftEyeGroup.scale.y = eyeScaleY;
          rightEyeGroup.scale.y = eyeScaleY;

          if (progress >= 1) {
            isBlinking = false;
            blinkTimer = 0;
            leftEyeGroup.scale.y = 1.0;
            rightEyeGroup.scale.y = 1.0;
          }
        } else {
          leftEyeGroup.scale.y = 1.0;
          rightEyeGroup.scale.y = 1.0;
        }
      } else {
        // While looking at a card, eyes stay wide, bright & focused!
        isBlinking = false;
        blinkTimer = 0;
        leftEyeGroup.scale.y = 1.05;
        rightEyeGroup.scale.y = 1.05;
      }

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animId) cancelAnimationFrame(animId);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      scene.clear();
    };
  }, []);

  // Click on bot triggers lal tuktuke blushing, cute chime sound & floating hearts
  const handleBotClick = useCallback((e) => {
    setIsHappy(true);
    isHappyRef.current = true;
    playCuteAnimeChirp();
    if (onBotClick) {
      onBotClick();
    }

    setTimeout(() => {
      setIsHappy(false);
      isHappyRef.current = false;
    }, 1800);

    const rect = mountRef.current?.getBoundingClientRect();
    const clientX = e?.clientX ?? (e?.touches && e.touches[0] ? e.touches[0].clientX : ((rect?.left || 0) + (rect?.width || 200) / 2));
    const clientY = e?.clientY ?? (e?.touches && e.touches[0] ? e.touches[0].clientY : ((rect?.top || 0) + (rect?.height || 200) / 2));
    const x = clientX - (rect?.left || 0);
    const y = clientY - (rect?.top || 0);

    const symbols = ['💖', '✨', '🌸', '★', '💫'];
    const newItems = Array.from({ length: 4 }).map((_, i) => ({
      id: Date.now() + i,
      x: x + (Math.random() - 0.5) * 70,
      y: y + (Math.random() - 0.5) * 40,
      symbol: symbols[Math.floor(Math.random() * symbols.length)],
      delay: i * 0.08,
    }));

    setParticles((prev) => [...prev, ...newItems]);
    setTimeout(() => {
      setParticles((prev) => prev.filter((p) => !newItems.find((n) => n.id === p.id)));
    }, 1500);
  }, [onBotClick]);

  return (
    <div
      className={`cute-anime-bot-container ${isHappy ? 'cute-anime-bot--happy' : ''}`}
      onClick={handleBotClick}
      title="Click me! (^_^)"
    >
      {/* 3D WebGL Canvas Mount */}
      <div ref={mountRef} className="cute-anime-bot-canvas" />

      {/* Cyber Reticle Aura Behind Bot */}
      <div className="cute-bot-reticle-ring" aria-hidden="true">
        <svg viewBox="0 0 300 300" className="cute-reticle-svg">
          <circle cx="150" cy="150" r="135" className="cute-reticle-circle" />
          <line x1="150" y1="5" x2="150" y2="20" className="cute-reticle-mark" />
          <line x1="150" y1="280" x2="150" y2="295" className="cute-reticle-mark" />
          <line x1="5" y1="150" x2="20" y2="150" className="cute-reticle-mark" />
          <line x1="280" y1="150" x2="295" y2="150" className="cute-reticle-mark" />
        </svg>
      </div>

      {/* Floating Click Particles */}
      {particles.map((p) => (
        <span
          key={p.id}
          className="cute-bot-particle"
          style={{
            left: `${p.x}px`,
            top: `${p.y}px`,
            animationDelay: `${p.delay}s`,
          }}
        >
          {p.symbol}
        </span>
      ))}
    </div>
  );
}
