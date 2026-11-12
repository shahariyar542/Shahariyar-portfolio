import { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import './CuteAnimeBot.css';

/**
 * CuteAnimeBot Component
 * Interactive 3D Anime Robot Companion built with Three.js.
 * Features real-time head and eye turning ("cokh mukh ghurabe"), natural blinking,
 * cute breathing bob, glowing anime eyes, and interactive card lock-on.
 */
export default function CuteAnimeBot({
  targetGaze = { x: 0, y: 0 },
  activeCard = null,
}) {
  const mountRef = useRef(null);
  const [isHappy, setIsHappy] = useState(false);
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

    // Detect theme
    const isLightMode = document.documentElement.getAttribute('data-theme') === 'light';

    // ── Scene, Camera & Renderer ──
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      42,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    );
    camera.position.set(0, 0.2, 5.8);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.appendChild(renderer.domElement);

    // ── Lighting ──
    const ambientLight = new THREE.AmbientLight(
      isLightMode ? 0xdbeafe : 0x1e293b,
      isLightMode ? 1.6 : 0.9
    );
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0x38bdf8, 2.2);
    keyLight.position.set(3, 4, 4);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xc084fc, 1.4);
    fillLight.position.set(-3, -2, 3);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0x00f0ff, 2.0);
    rimLight.position.set(0, 4, -3);
    scene.add(rimLight);

    // ── Main Bot Root Group ──
    const botRoot = new THREE.Group();
    scene.add(botRoot);

    // ── Materials ──
    // Glossy White / Ceramic Body Material
    const bodyMaterial = new THREE.MeshPhysicalMaterial({
      color: isLightMode ? 0xffffff : 0xf1f5f9,
      roughness: 0.18,
      metalness: 0.12,
      clearcoat: 0.9,
      clearcoatRoughness: 0.1,
    });

    // Dark Visor Glass
    const visorMaterial = new THREE.MeshPhysicalMaterial({
      color: isLightMode ? 0x0f172a : 0x030712,
      roughness: 0.05,
      metalness: 0.95,
      clearcoat: 1.0,
      clearcoatRoughness: 0.05,
    });

    // Accent Cyber Neon Material (Eyes & Antenna)
    const eyeColor = isLightMode ? 0x0284c7 : 0x00f0ff;
    const eyeMaterial = new THREE.MeshBasicMaterial({
      color: eyeColor,
    });

    const blushMaterial = new THREE.MeshBasicMaterial({
      color: 0xf43f5e,
      transparent: true,
      opacity: 0.45,
    });

    const metalAccentMaterial = new THREE.MeshStandardMaterial({
      color: 0x334155,
      roughness: 0.25,
      metalness: 0.85,
    });

    // ── 1. TORSO GROUP ──
    const torsoGroup = new THREE.Group();
    botRoot.add(torsoGroup);

    // Torso Chassis (Rounded Capsule-like)
    const torsoGeo = new THREE.CylinderGeometry(0.55, 0.45, 1.0, 32);
    const torsoMesh = new THREE.Mesh(torsoGeo, bodyMaterial);
    torsoMesh.position.y = -0.55;
    torsoGroup.add(torsoMesh);

    // Cute Cyber Chest Core (Pulsing glowing orb)
    const coreGeo = new THREE.SphereGeometry(0.18, 24, 24);
    const coreMat = new THREE.MeshBasicMaterial({
      color: eyeColor,
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    coreMesh.position.set(0, -0.45, 0.5);
    torsoGroup.add(coreMesh);

    // Core Outer Ring
    const coreRingGeo = new THREE.TorusGeometry(0.24, 0.025, 16, 32);
    const coreRingMesh = new THREE.Mesh(coreRingGeo, metalAccentMaterial);
    coreRingMesh.position.set(0, -0.45, 0.5);
    torsoGroup.add(coreRingMesh);

    // Floating Magnetic Left & Right Hands (Orbs)
    const handGeo = new THREE.SphereGeometry(0.2, 24, 24);
    const leftHand = new THREE.Mesh(handGeo, bodyMaterial);
    leftHand.position.set(-0.95, -0.55, 0.1);
    torsoGroup.add(leftHand);

    const rightHand = new THREE.Mesh(handGeo, bodyMaterial);
    rightHand.position.set(0.95, -0.55, 0.1);
    torsoGroup.add(rightHand);

    // ── 2. HEAD GROUP (Rotates to track mouse & cards) ──
    const headGroup = new THREE.Group();
    headGroup.position.set(0, 0.4, 0);
    botRoot.add(headGroup);

    // Chibi Rounded Head
    const headGeo = new THREE.SphereGeometry(1.05, 36, 36);
    headGeo.scale(1.08, 0.96, 1.0);
    const headMesh = new THREE.Mesh(headGeo, bodyMaterial);
    headGroup.add(headMesh);

    // Glossy Dark Visor Faceplate
    const visorGeo = new THREE.SphereGeometry(0.85, 32, 32, 0, Math.PI);
    visorGeo.scale(1.02, 0.78, 0.65);
    const visorMesh = new THREE.Mesh(visorGeo, visorMaterial);
    visorMesh.position.set(0, -0.02, 0.62);
    visorMesh.rotation.y = -Math.PI / 2;
    headGroup.add(visorMesh);

    // ── 3. EYES GROUP (Track gaze & blink inside the visor) ──
    const eyesGroup = new THREE.Group();
    eyesGroup.position.set(0, 0.02, 1.05);
    headGroup.add(eyesGroup);

    // Big Cute Anime Eyes (Left & Right)
    // Using rounded capsule/ellipsoid for adorable expressive anime look
    const eyeGeo = new THREE.SphereGeometry(0.22, 24, 24);
    eyeGeo.scale(0.8, 1.25, 0.3);

    const leftEyeMesh = new THREE.Mesh(eyeGeo, eyeMaterial);
    leftEyeMesh.position.set(-0.38, 0, 0);
    eyesGroup.add(leftEyeMesh);

    const rightEyeMesh = new THREE.Mesh(eyeGeo, eyeMaterial);
    rightEyeMesh.position.set(0.38, 0, 0);
    eyesGroup.add(rightEyeMesh);

    // Adorable Anime Eye Catchlights (White sparkle dots)
    const catchlightGeo = new THREE.SphereGeometry(0.06, 16, 16);
    const catchlightMat = new THREE.MeshBasicMaterial({ color: 0xffffff });

    const leftCatchlight = new THREE.Mesh(catchlightGeo, catchlightMat);
    leftCatchlight.position.set(-0.33, 0.1, 0.08);
    eyesGroup.add(leftCatchlight);

    const rightCatchlight = new THREE.Mesh(catchlightGeo, catchlightMat);
    rightCatchlight.position.set(0.43, 0.1, 0.08);
    eyesGroup.add(rightCatchlight);

    // Cute Pink Cheeks / Blush
    const blushGeo = new THREE.SphereGeometry(0.12, 16, 16);
    blushGeo.scale(1.3, 0.6, 0.2);

    const leftBlush = new THREE.Mesh(blushGeo, blushMaterial);
    leftBlush.position.set(-0.52, -0.22, -0.04);
    eyesGroup.add(leftBlush);

    const rightBlush = new THREE.Mesh(blushGeo, blushMaterial);
    rightBlush.position.set(0.52, -0.22, -0.04);
    eyesGroup.add(rightBlush);

    // ── 4. HEAD ACCESSORIES (Ears & Antenna) ──
    // Cute Cylindrical Headphone Ears with Glowing Ring
    const earGeo = new THREE.CylinderGeometry(0.28, 0.28, 0.22, 24);
    earGeo.rotateZ(Math.PI / 2);

    const leftEar = new THREE.Mesh(earGeo, metalAccentMaterial);
    leftEar.position.set(-1.18, 0.05, 0);
    headGroup.add(leftEar);

    const rightEar = new THREE.Mesh(earGeo, metalAccentMaterial);
    rightEar.position.set(1.18, 0.05, 0);
    headGroup.add(rightEar);

    const earRingGeo = new THREE.TorusGeometry(0.26, 0.02, 16, 32);
    earRingGeo.rotateY(Math.PI / 2);

    const leftEarRing = new THREE.Mesh(earRingGeo, coreMat);
    leftEarRing.position.set(-1.28, 0.05, 0);
    headGroup.add(leftEarRing);

    const rightEarRing = new THREE.Mesh(earRingGeo, coreMat);
    rightEarRing.position.set(1.28, 0.05, 0);
    headGroup.add(rightEarRing);

    // Cute Antenna on Top
    const antennaStemGeo = new THREE.CylinderGeometry(0.035, 0.045, 0.35, 16);
    const antennaStem = new THREE.Mesh(antennaStemGeo, metalAccentMaterial);
    antennaStem.position.set(0, 1.15, 0);
    headGroup.add(antennaStem);

    const antennaTipGeo = new THREE.SphereGeometry(0.12, 24, 24);
    const antennaTip = new THREE.Mesh(antennaTipGeo, coreMat);
    antennaTip.position.set(0, 1.35, 0);
    headGroup.add(antennaTip);

    // ── 5. HOLOGRAPHIC HOVER RINGS (Underneath Bot) ──
    const hoverRingGroup = new THREE.Group();
    hoverRingGroup.position.set(0, -1.35, 0);
    botRoot.add(hoverRingGroup);

    const ring1Geo = new THREE.TorusGeometry(1.2, 0.02, 16, 48);
    ring1Geo.rotateX(Math.PI / 2);
    const ring1Mat = new THREE.MeshBasicMaterial({
      color: eyeColor,
      transparent: true,
      opacity: 0.5,
    });
    const ring1 = new THREE.Mesh(ring1Geo, ring1Mat);
    hoverRingGroup.add(ring1);

    const ring2Geo = new THREE.TorusGeometry(0.8, 0.015, 16, 48);
    ring2Geo.rotateX(Math.PI / 2);
    const ring2 = new THREE.Mesh(ring2Geo, ring1Mat);
    hoverRingGroup.add(ring2);

    // ── Animation Variables ──
    let animId;
    let clock = new THREE.Clock();
    let currentHeadRotY = 0;
    let currentHeadRotX = 0;
    let currentHeadTiltZ = 0;
    let currentEyeShiftX = 0;
    let currentEyeShiftY = 0;
    let blinkTimer = 0;
    let isBlinking = false;
    let nextBlinkTime = 3.0;

    // Helper: smooth lerp
    const lerp = (start, end, factor) => start + (end - start) * factor;

    // ── Main Render Loop ──
    const animate = () => {
      animId = requestAnimationFrame(animate);
      const time = clock.getElapsedTime();
      const delta = clock.getDelta();

      // Target head angles calculated from targetGaze
      // Gaze X ranges from -1.0 (left) to +1.0 (right)
      // Gaze Y ranges from -1.0 (up) to +1.0 (down)
      const gaze = targetGazeRef.current;
      const targetRotY = gaze.x * 0.65; // ~37 degrees max yaw
      const targetRotX = -gaze.y * 0.42; // ~24 degrees max pitch
      const targetTiltZ = -gaze.x * 0.12; // Cute subtle head tilt!

      // Smooth lerp for head rotation
      currentHeadRotY = lerp(currentHeadRotY, targetRotY, 0.14);
      currentHeadRotX = lerp(currentHeadRotX, targetRotX, 0.14);
      currentHeadTiltZ = lerp(currentHeadTiltZ, targetTiltZ, 0.14);

      headGroup.rotation.y = currentHeadRotY;
      headGroup.rotation.x = currentHeadRotX;
      headGroup.rotation.z = currentHeadTiltZ;

      // Eye displacement inside visor (independent gaze tracking)
      const targetEyeX = gaze.x * 0.08;
      const targetEyeY = -gaze.y * 0.06;
      currentEyeShiftX = lerp(currentEyeShiftX, targetEyeX, 0.18);
      currentEyeShiftY = lerp(currentEyeShiftY, targetEyeY, 0.18);

      eyesGroup.position.x = currentEyeShiftX;
      eyesGroup.position.y = 0.02 + currentEyeShiftY;

      // Cute Floating Bobbing Motion
      const floatOffset = Math.sin(time * 2.2) * 0.09;
      botRoot.position.y = floatOffset;

      // Floating Hands Swaying
      leftHand.position.y = -0.55 + Math.sin(time * 2.5 + 0.5) * 0.06;
      rightHand.position.y = -0.55 + Math.cos(time * 2.5 + 0.5) * 0.06;

      // Hover Rings Rotation & Pulsing
      hoverRingGroup.rotation.y = time * 0.8;
      ring1.scale.setScalar(1 + Math.sin(time * 3) * 0.04);
      ring2.scale.setScalar(1 - Math.cos(time * 3) * 0.04);

      // Core Light Pulse
      const corePulse = 1 + Math.sin(time * 4) * 0.15;
      coreMesh.scale.setScalar(corePulse);
      antennaTip.scale.setScalar(1 + Math.sin(time * 4) * 0.12);

      // ── Natural Anime Blinking ──
      blinkTimer += delta;
      if (!isBlinking && blinkTimer > nextBlinkTime) {
        isBlinking = true;
        blinkTimer = 0;
        nextBlinkTime = 3.0 + Math.random() * 2.5;
      }

      if (isBlinking) {
        // Close eyes smoothly
        leftEyeMesh.scale.y = 0.12;
        rightEyeMesh.scale.y = 0.12;
        leftCatchlight.visible = false;
        rightCatchlight.visible = false;
        if (blinkTimer > 0.14) {
          isBlinking = false;
          blinkTimer = 0;
        }
      } else {
        // Eyes open normally or happy arcs when hovered
        leftEyeMesh.scale.y = 1.25;
        rightEyeMesh.scale.y = 1.25;
        leftCatchlight.visible = true;
        rightCatchlight.visible = true;
      }

      renderer.render(scene, camera);
    };

    animate();

    // Resize Handler
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
      // Dispose materials & geometries
      scene.clear();
    };
  }, []);

  // Click on bot toggles happy reaction
  const handleBotClick = useCallback(() => {
    setIsHappy(true);
    setTimeout(() => setIsHappy(false), 2000);
  }, []);

  // Target label
  const getBotStatus = () => {
    if (!activeCard) return isHappy ? 'ANIME BOT: HAPPY! (^_^)★' : 'ANIME BOT: OBSERVING (CENTER)';
    switch (activeCard) {
      case 'role-1':
        return 'BOT LOOKING: ↖ SOFTWARE ENGINEERING';
      case 'role-2':
        return 'BOT LOOKING: ↗ PROJECT ARCHITECTURE';
      case 'role-3':
        return 'BOT LOOKING: ↙ RESEARCH ENTHUSIAST';
      case 'role-4':
        return 'BOT LOOKING: ↘ AI & NEURAL SYSTEMS';
      default:
        return 'BOT TRACKING: ACTIVE';
    }
  };

  return (
    <div
      className={`cute-anime-bot-container ${isHappy ? 'cute-anime-bot--happy' : ''}`}
      onClick={handleBotClick}
      title="Click me for a happy reaction! (^_^)"
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

      {/* Realtime Status HUD Pill */}
      <div className="cute-bot-hud-pill">
        <span className="cute-bot-status-dot" />
        <span className="cute-bot-status-text">{getBotStatus()}</span>
      </div>

      {/* Pedestal Tag */}
      <div className="cute-bot-pedestal-label">
        <span className="cute-bot-name">SHAHARIYAR.AI COMPANION</span>
        <span className="cute-bot-sub">INTERACTIVE 3D ANIME BOT • REALTIME GAZE ENGINE</span>
      </div>
    </div>
  );
}
