import { useEffect, useRef } from 'react';
import * as THREE from 'three';

/**
 * ExperienceTreeCanvas
 * Immersive 3D Cyber-Tree of Knowledge with Winding Pathway & Walking Explorer
 * Supports Day (Crystal Ice-Blue) and Night (Dark Cyber) visual modes.
 */
export default function ExperienceTreeCanvas({ progress = 0, isVisible = true }) {
  const mountRef = useRef(null);
  const stateRef = useRef({
    progress: 0,
    targetProgress: 0,
    walkTime: 0,
    character: null,
    pathCurve: null,
    branchNodes: [],
    updateTheme: null,
  });

  // Keep target progress and visibility in sync
  useEffect(() => {
    stateRef.current.targetProgress = Math.max(0, Math.min(1, progress));
    stateRef.current.isVisible = isVisible;
  }, [progress, isVisible]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Check motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // 1. Scene & Camera Setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    );
    camera.position.set(0, 0, 11.5);

    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: !isMobile,
      powerPreference: 'high-performance',
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.25 : 2));
    container.appendChild(renderer.domElement);

    const mainGroup = new THREE.Group();
    scene.add(mainGroup);

    // 2. Dynamic Materials Setup (Theme Reactive)
    const treeMat = new THREE.MeshStandardMaterial({
      color: 0x0f1b36,
      emissive: 0x1e3a8a,
      emissiveIntensity: 0.35,
      roughness: 0.45,
      metalness: 0.65,
    });

    const energyVeinMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.75,
      wireframe: false,
    });

    const stoneMat = new THREE.MeshStandardMaterial({
      color: 0x111e38,
      emissive: 0x0284c7,
      emissiveIntensity: 0.4,
      roughness: 0.3,
      metalness: 0.8,
    });

    const blossomMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.85,
    });

    const charSuitMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      emissive: 0x1d4ed8,
      emissiveIntensity: 0.4,
      roughness: 0.3,
      metalness: 0.85,
    });

    const visorMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
    });

    // 3. Central Tree Trunk Architecture
    const trunkCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0.0, -4.8, 0.0),
      new THREE.Vector3(-0.15, -2.6, 0.1),
      new THREE.Vector3(0.2, -0.6, -0.1),
      new THREE.Vector3(-0.18, 1.4, 0.12),
      new THREE.Vector3(0.12, 3.2, -0.08),
      new THREE.Vector3(0.0, 4.6, 0.0),
    ]);

    const trunkGeo = new THREE.TubeGeometry(trunkCurve, 48, 0.38, 12, false);
    const trunkMesh = new THREE.Mesh(trunkGeo, treeMat);
    mainGroup.add(trunkMesh);

    // Trunk Spiral Energy Vein
    const veinPoints = [];
    for (let t = 0; t <= 1; t += 0.02) {
      const pt = trunkCurve.getPointAt(t);
      const angle = t * Math.PI * 8;
      const radius = 0.42;
      pt.x += Math.cos(angle) * radius;
      pt.z += Math.sin(angle) * radius;
      veinPoints.push(pt);
    }
    const veinCurve = new THREE.CatmullRomCurve3(veinPoints);
    const veinGeo = new THREE.TubeGeometry(veinCurve, 72, 0.028, 6, false);
    const veinMesh = new THREE.Mesh(veinGeo, energyVeinMat);
    mainGroup.add(veinMesh);

    // 4. Alternating Tree Branches (4 Primary Branches for 4 Experience Cards)
    // Branch 0: Left (Upper-Mid) -> Card 1
    // Branch 1: Right (Mid-High) -> Card 2
    // Branch 2: Left (Mid-Low)   -> Card 3
    // Branch 3: Right (Bottom)   -> Card 4
    const branchConfigs = [
      {
        id: 0,
        side: 'left',
        origin: new THREE.Vector3(-0.15, 2.6, 0.05),
        control1: new THREE.Vector3(-1.4, 2.7, 0.25),
        control2: new THREE.Vector3(-2.6, 2.3, 0.45),
        tip: new THREE.Vector3(-3.4, 2.0, 0.6),
        revealThreshold: 0.15,
      },
      {
        id: 1,
        side: 'right',
        origin: new THREE.Vector3(0.15, 1.0, -0.05),
        control1: new THREE.Vector3(1.3, 1.15, 0.25),
        control2: new THREE.Vector3(2.5, 0.75, 0.45),
        tip: new THREE.Vector3(3.4, 0.45, 0.6),
        revealThreshold: 0.40,
      },
      {
        id: 2,
        side: 'left',
        origin: new THREE.Vector3(-0.12, -0.8, 0.05),
        control1: new THREE.Vector3(-1.3, -0.65, 0.25),
        control2: new THREE.Vector3(-2.5, -1.05, 0.45),
        tip: new THREE.Vector3(-3.4, -1.35, 0.6),
        revealThreshold: 0.65,
      },
      {
        id: 3,
        side: 'right',
        origin: new THREE.Vector3(0.12, -2.4, -0.05),
        control1: new THREE.Vector3(1.3, -2.25, 0.25),
        control2: new THREE.Vector3(2.5, -2.65, 0.45),
        tip: new THREE.Vector3(3.4, -2.95, 0.6),
        revealThreshold: 0.88,
      },
    ];

    const branchNodes = [];

    branchConfigs.forEach((cfg) => {
      const curve = new THREE.CatmullRomCurve3([
        cfg.origin,
        cfg.control1,
        cfg.control2,
        cfg.tip,
      ]);
      const branchGeo = new THREE.TubeGeometry(curve, 32, 0.16, 8, false);
      const branchMesh = new THREE.Mesh(branchGeo, treeMat);
      mainGroup.add(branchMesh);

      // Branch energy filament
      const branchVeinGeo = new THREE.TubeGeometry(curve, 32, 0.022, 5, false);
      const branchVeinMesh = new THREE.Mesh(branchVeinGeo, energyVeinMat);
      mainGroup.add(branchVeinMesh);

      // Branch Tip Crystal Blossom & Anchor
      const tipGroup = new THREE.Group();
      tipGroup.position.copy(cfg.tip);

      const blossomGeo = new THREE.IcosahedronGeometry(0.18, 1);
      const blossomMesh = new THREE.Mesh(blossomGeo, blossomMat);
      tipGroup.add(blossomMesh);

      const ringGeo = new THREE.TorusGeometry(0.28, 0.016, 8, 24);
      const ringMesh = new THREE.Mesh(ringGeo, energyVeinMat);
      ringMesh.rotation.x = Math.PI / 2;
      tipGroup.add(ringMesh);

      // Hanging Tether Line down to card anchor
      const tetherPts = [
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(0, -0.9, 0),
      ];
      const tetherCurve = new THREE.CatmullRomCurve3(tetherPts);
      const tetherGeo = new THREE.TubeGeometry(tetherCurve, 12, 0.012, 4, false);
      const tetherMesh = new THREE.Mesh(tetherGeo, energyVeinMat);
      tipGroup.add(tetherMesh);

      mainGroup.add(tipGroup);

      branchNodes.push({
        config: cfg,
        tipGroup,
        blossomMesh,
        ringMesh,
        tetherMesh,
      });
    });

    stateRef.current.branchNodes = branchNodes;

    // 5. Winding Pathway Running Vertically through the Middle
    const pathSpline = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0.2, 4.3, 0.85),
      new THREE.Vector3(-0.6, 2.8, 0.95),
      new THREE.Vector3(0.55, 1.2, 1.05),
      new THREE.Vector3(-0.55, -0.6, 1.05),
      new THREE.Vector3(0.45, -2.2, 0.95),
      new THREE.Vector3(0.0, -4.3, 0.85),
    ]);
    stateRef.current.pathCurve = pathSpline;

    // Luminous pathway energy guide
    const pathGuideGeo = new THREE.TubeGeometry(pathSpline, 64, 0.022, 6, false);
    const pathGuideMesh = new THREE.Mesh(pathGuideGeo, energyVeinMat);
    mainGroup.add(pathGuideMesh);

    // Stepping Stones along the pathway
    const stoneCount = 28;
    const stoneGeo = new THREE.CylinderGeometry(0.16, 0.2, 0.05, 7);
    for (let s = 0; s < stoneCount; s++) {
      const u = s / (stoneCount - 1);
      const pt = pathSpline.getPointAt(u);
      const stoneMesh = new THREE.Mesh(stoneGeo, stoneMat);
      stoneMesh.position.copy(pt);
      stoneMesh.position.z -= 0.04;
      stoneMesh.rotation.x = Math.PI / 2;
      stoneMesh.rotation.z = Math.sin(s * 1.5) * 0.4;
      mainGroup.add(stoneMesh);
    }

    // 6. Stylized 3D Walking Explorer Character
    const charGroup = new THREE.Group();
    charGroup.scale.set(0.68, 0.68, 0.68);

    // Torso
    const torsoGeo = new THREE.BoxGeometry(0.3, 0.45, 0.22);
    const torsoMesh = new THREE.Mesh(torsoGeo, charSuitMat);
    torsoMesh.position.y = 0.22;
    charGroup.add(torsoMesh);

    // Backpack
    const packGeo = new THREE.BoxGeometry(0.22, 0.32, 0.14);
    const packMesh = new THREE.Mesh(packGeo, charSuitMat);
    packMesh.position.set(0, 0.24, -0.16);
    charGroup.add(packMesh);

    // Head & Glowing Visor
    const headGroup = new THREE.Group();
    headGroup.position.set(0, 0.58, 0);
    const headGeo = new THREE.SphereGeometry(0.16, 12, 12);
    const headMesh = new THREE.Mesh(headGeo, charSuitMat);
    headGroup.add(headMesh);

    const visorGeo = new THREE.BoxGeometry(0.2, 0.07, 0.1);
    const visorMesh = new THREE.Mesh(visorGeo, visorMat);
    visorMesh.position.set(0, 0.02, 0.12);
    headGroup.add(visorMesh);
    charGroup.add(headGroup);

    // Articulated Legs
    const legGeo = new THREE.BoxGeometry(0.1, 0.38, 0.12);
    const leftLeg = new THREE.Mesh(legGeo, charSuitMat);
    leftLeg.position.set(-0.1, -0.18, 0);
    charGroup.add(leftLeg);

    const rightLeg = new THREE.Mesh(legGeo, charSuitMat);
    rightLeg.position.set(0.1, -0.18, 0);
    charGroup.add(rightLeg);

    // Articulated Arms
    const armGeo = new THREE.BoxGeometry(0.08, 0.36, 0.09);
    const leftArm = new THREE.Mesh(armGeo, charSuitMat);
    leftArm.position.set(-0.22, 0.22, 0);
    charGroup.add(leftArm);

    const rightArm = new THREE.Mesh(armGeo, charSuitMat);
    rightArm.position.set(0.22, 0.22, 0);
    charGroup.add(rightArm);

    // Character lantern light (casts glow along the path)
    const charLight = new THREE.PointLight(0x38bdf8, 1.4, 3.5);
    charLight.position.set(0, 0.35, 0.4);
    charGroup.add(charLight);

    mainGroup.add(charGroup);
    stateRef.current.character = {
      group: charGroup,
      leftLeg,
      rightLeg,
      leftArm,
      rightArm,
      torso: torsoMesh,
      head: headGroup,
      light: charLight,
    };

    // 7. Ambient Bioluminescent Spores / Particles
    const sporeCount = 45;
    const sporeGeo = new THREE.BufferGeometry();
    const sporePos = new Float32Array(sporeCount * 3);
    for (let p = 0; p < sporeCount; p++) {
      sporePos[p * 3] = (Math.random() - 0.5) * 8.5;
      sporePos[p * 3 + 1] = (Math.random() - 0.5) * 9.5;
      sporePos[p * 3 + 2] = (Math.random() - 0.5) * 3.5;
    }
    sporeGeo.setAttribute('position', new THREE.BufferAttribute(sporePos, 3));
    const sporeMat = new THREE.PointsMaterial({
      color: 0x38bdf8,
      size: 0.07,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending,
    });
    const spores = new THREE.Points(sporeGeo, sporeMat);
    mainGroup.add(spores);

    // 8. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0x60a5fa, 1.2);
    dirLight.position.set(4, 6, 8);
    scene.add(dirLight);

    // 9. Day / Night Theme Adaptation
    const updateTheme = () => {
      const isLight = document.documentElement.getAttribute('data-theme') === 'light';
      if (isLight) {
        // Crystal Ice-Blue Theme
        treeMat.color.set(0xbae6fd);
        treeMat.emissive.set(0x0284c7);
        treeMat.emissiveIntensity = 0.35;
        treeMat.roughness = 0.25;

        energyVeinMat.color.set(0x0284c7);
        blossomMat.color.set(0x0284c7);
        visorMat.color.set(0x0284c7);
        charLight.color.set(0x0284c7);
        sporeMat.color.set(0x0284c7);

        charSuitMat.color.set(0xe2e8f0);
        charSuitMat.emissive.set(0x38bdf8);
        charSuitMat.emissiveIntensity = 0.3;

        stoneMat.color.set(0xdbeafe);
        stoneMat.emissive.set(0x0284c7);
        dirLight.color.set(0x0284c7);
      } else {
        // Dark Cyber Futuristic Theme
        treeMat.color.set(0x0f1b36);
        treeMat.emissive.set(0x1e3a8a);
        treeMat.emissiveIntensity = 0.35;
        treeMat.roughness = 0.45;

        energyVeinMat.color.set(0x38bdf8);
        blossomMat.color.set(0x38bdf8);
        visorMat.color.set(0x38bdf8);
        charLight.color.set(0x38bdf8);
        sporeMat.color.set(0x38bdf8);

        charSuitMat.color.set(0x0f172a);
        charSuitMat.emissive.set(0x1d4ed8);
        charSuitMat.emissiveIntensity = 0.4;

        stoneMat.color.set(0x111e38);
        stoneMat.emissive.set(0x0284c7);
        dirLight.color.set(0x60a5fa);
      }
    };
    updateTheme();
    stateRef.current.updateTheme = updateTheme;

    const themeObserver = new MutationObserver(updateTheme);
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    });

    // 10. Resize Handling
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // 11. Animation Loop
    let animId;
    let lastTime = performance.now();

    const animate = () => {
      animId = requestAnimationFrame(animate);

      const state = stateRef.current;
      if (state.isVisible === false) return;

      const now = performance.now();
      const delta = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;

      // Smooth progress interpolation towards target
      state.progress += (state.targetProgress - state.progress) * 0.08;
      const curProg = Math.max(0.001, Math.min(0.999, state.progress));

      // Update 3D Character along Winding Path
      if (state.character && state.pathCurve) {
        const char = state.character;
        const pt = state.pathCurve.getPointAt(curProg);
        char.group.position.copy(pt);

        // Path orientation tangent
        const tangent = state.pathCurve.getTangentAt(curProg);
        const lookTarget = pt.clone().add(tangent);
        char.group.lookAt(lookTarget);

        // Natural walking cycle (faster when moving toward target)
        const moveDist = Math.abs(state.targetProgress - state.progress);
        const walkSpeedMultiplier = moveDist > 0.005 ? 12 : 3;
        state.walkTime += delta * walkSpeedMultiplier;

        if (!prefersReducedMotion) {
          const cycle = Math.sin(state.walkTime * 8);
          char.leftLeg.rotation.x = cycle * 0.65;
          char.rightLeg.rotation.x = -cycle * 0.65;
          char.leftArm.rotation.x = -cycle * 0.55;
          char.rightArm.rotation.x = cycle * 0.55;
          char.torso.position.y = 0.22 + Math.abs(Math.sin(state.walkTime * 16)) * 0.035;
        }
      }

      // Update Branch Nodes Illumination based on Character Proximity
      if (state.branchNodes) {
        state.branchNodes.forEach((node) => {
          const isReached = curProg >= node.config.revealThreshold;
          const targetScale = isReached ? 1.25 : 0.85;
          node.blossomMesh.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);

          if (!prefersReducedMotion) {
            node.ringMesh.rotation.z += 0.015;
          }
        });
      }

      // Spores subtle float
      if (spores && !prefersReducedMotion) {
        spores.rotation.y += 0.001;
      }

      // Gentle tree breathing tilt
      if (!prefersReducedMotion) {
        mainGroup.rotation.y = Math.sin(clock.getElapsedTime() * 0.6) * 0.025;
      }

      renderer.render(scene, camera);
    };

    animate();

    // 12. Cleanup
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      themeObserver.disconnect();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      scene.clear();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="exp-tree-canvas-container"
      aria-hidden="true"
    />
  );
}
