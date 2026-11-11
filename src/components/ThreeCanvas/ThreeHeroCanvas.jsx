import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import './ThreeHeroCanvas.css';

export default function ThreeHeroCanvas() {
  const mountRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Reduced motion check
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 6.5;

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const group = new THREE.Group();
    scene.add(group);

    // ── 1. Elegant Geometric Core (Icosahedron with subtle wireframe) ──
    const outerGeo = new THREE.IcosahedronGeometry(2.0, 1);
    const wireframeMat = new THREE.MeshBasicMaterial({
      color: 0x60a5fa,
      wireframe: true,
      transparent: true,
      opacity: 0.28,
    });
    const outerMesh = new THREE.Mesh(outerGeo, wireframeMat);
    group.add(outerMesh);

    // Inner octahedron core
    const innerGeo = new THREE.OctahedronGeometry(1.15, 0);
    const innerMat = new THREE.MeshStandardMaterial({
      color: 0x0d1528,
      emissive: 0x3b82f6,
      emissiveIntensity: 0.45,
      roughness: 0.3,
      metalness: 0.8,
    });
    const innerMesh = new THREE.Mesh(innerGeo, innerMat);
    group.add(innerMesh);

    // Subtle orbital ring
    const ringGeo = new THREE.TorusGeometry(2.6, 0.015, 16, 90);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x22d3ee,
      transparent: true,
      opacity: 0.35,
    });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    ringMesh.rotation.x = Math.PI / 3;
    ringMesh.rotation.y = Math.PI / 6;
    group.add(ringMesh);

    // ── 2. Subtle Micro Particles ──
    const particleCount = 80;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const c1 = new THREE.Color(0x60a5fa);
    const c2 = new THREE.Color(0x22d3ee);

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 14;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 8;

      const c = Math.random() > 0.5 ? c1 : c2;
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const particleMat = new THREE.PointsMaterial({
      size: 0.05,
      vertexColors: true,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
    });

    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // ── 3. Lighting ──
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0x3b82f6, 1.8, 40);
    pointLight.position.set(4, 4, 5);
    scene.add(pointLight);

    // ── 4. Mouse Interactive Parallax ──
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;

    const handleMouseMove = (e) => {
      const { innerWidth, innerHeight } = window;
      targetX = (e.clientX / innerWidth - 0.5) * 1.2;
      targetY = (e.clientY / innerHeight - 0.5) * 1.2;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // ── 5. Resize Handling ──
    // ── 5. Theme Color Synchronization ──
    const updateThemeColors = () => {
      const isLight = document.documentElement.getAttribute('data-theme') === 'light';
      if (isLight) {
        wireframeMat.color.set(0x0284c7);
        wireframeMat.opacity = 0.52;
        innerMat.color.set(0xbae6fd);
        innerMat.emissive.set(0x38bdf8);
        innerMat.emissiveIntensity = 0.65;
        ringMat.color.set(0x0284c7);
        ringMat.opacity = 0.55;
        pointLight.color.set(0x0284c7);
      } else {
        wireframeMat.color.set(0x60a5fa);
        wireframeMat.opacity = 0.28;
        innerMat.color.set(0x0d1528);
        innerMat.emissive.set(0x3b82f6);
        innerMat.emissiveIntensity = 0.45;
        ringMat.color.set(0x22d3ee);
        ringMat.opacity = 0.35;
        pointLight.color.set(0x3b82f6);
      }
    };
    updateThemeColors();

    const themeObserver = new MutationObserver(updateThemeColors);
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

    const handleResize = () => {
      if (!container) return;
      const width = container.clientWidth;
      const height = container.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    // ── 6. Animation Loop ──
    let animationFrameId;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      if (!prefersReducedMotion) {
        outerMesh.rotation.x += 0.002;
        outerMesh.rotation.y += 0.0025;
        innerMesh.rotation.x -= 0.003;
        innerMesh.rotation.y -= 0.002;
        ringMesh.rotation.z += 0.004;
        particles.rotation.y += 0.0004;
      }

      currentX += (targetX - currentX) * 0.04;
      currentY += (targetY - currentY) * 0.04;

      group.rotation.y = currentX * 0.5;
      group.rotation.x = -currentY * 0.5;

      renderer.render(scene, camera);
    };

    animate();

    // ── Cleanup ──
    return () => {
      themeObserver.disconnect();
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);

      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }

      outerGeo.dispose();
      wireframeMat.dispose();
      innerGeo.dispose();
      innerMat.dispose();
      ringGeo.dispose();
      ringMat.dispose();
      particleGeo.dispose();
      particleMat.dispose();
      renderer.dispose();
    };
  }, []);

  return <div className="three-hero-container" ref={mountRef} aria-hidden="true" />;
}
