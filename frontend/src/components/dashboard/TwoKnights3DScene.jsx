import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

/**
 * Procedural 3D Staunton Knight geometry builder.
 * Combines an extruded profile shape with curved mane & snout, 
 * plus a turned pedestal base and facial details.
 */
function createKnightMesh(material) {
  const knightGroup = new THREE.Group();

  // 1. Pedestal Base
  const baseMat = material;

  const baseBottom = new THREE.Mesh(
    new THREE.CylinderGeometry(0.72, 0.82, 0.18, 36),
    baseMat
  );
  baseBottom.position.y = -1.15;
  baseBottom.castShadow = true;
  baseBottom.receiveShadow = true;
  knightGroup.add(baseBottom);

  const torusRing = new THREE.Mesh(
    new THREE.TorusGeometry(0.68, 0.07, 16, 36),
    baseMat
  );
  torusRing.rotation.x = Math.PI / 2;
  torusRing.position.y = -1.04;
  knightGroup.add(torusRing);

  const baseStem = new THREE.Mesh(
    new THREE.CylinderGeometry(0.5, 0.66, 0.32, 36),
    baseMat
  );
  baseStem.position.y = -0.82;
  knightGroup.add(baseStem);

  const collarRing = new THREE.Mesh(
    new THREE.CylinderGeometry(0.56, 0.5, 0.1, 36),
    baseMat
  );
  collarRing.position.y = -0.62;
  knightGroup.add(collarRing);

  // 2. Sculpted Knight Head & Neck Shape
  const shape = new THREE.Shape();
  shape.moveTo(-0.42, -0.6);
  // Back of neck curving up
  shape.quadraticCurveTo(-0.52, 0.0, -0.56, 0.4);
  // Serrated mane detail 1
  shape.lineTo(-0.66, 0.6);
  shape.lineTo(-0.55, 0.66);
  // Mane detail 2
  shape.lineTo(-0.68, 0.9);
  shape.lineTo(-0.53, 0.96);
  // Mane detail 3
  shape.lineTo(-0.65, 1.22);
  shape.lineTo(-0.48, 1.28);
  // Crest to ear
  shape.quadraticCurveTo(-0.4, 1.6, -0.22, 1.85);
  shape.lineTo(-0.16, 2.12); // Ear tip
  shape.lineTo(-0.04, 1.82); // Ear front base
  // Forehead slope
  shape.quadraticCurveTo(0.12, 1.7, 0.3, 1.5);
  // Snout top
  shape.lineTo(0.64, 1.34);
  // Muzzle nose curve
  shape.quadraticCurveTo(0.78, 1.22, 0.72, 1.04);
  // Mouth groove
  shape.lineTo(0.56, 1.0);
  shape.lineTo(0.66, 0.94);
  // Chin
  shape.quadraticCurveTo(0.58, 0.8, 0.38, 0.8);
  // Throat curving down into chest
  shape.quadraticCurveTo(0.2, 0.55, 0.3, 0.1);
  // Lower breast into base
  shape.quadraticCurveTo(0.42, -0.3, 0.4, -0.6);
  shape.closePath();

  const extrudeSettings = {
    steps: 2,
    depth: 0.38,
    bevelEnabled: true,
    bevelThickness: 0.1,
    bevelSize: 0.08,
    bevelOffset: 0,
    bevelSegments: 5,
  };

  const headGeo = new THREE.ExtrudeGeometry(shape, extrudeSettings);
  headGeo.center();
  const headMesh = new THREE.Mesh(headGeo, material);
  headMesh.position.y = 0.42;
  headMesh.castShadow = true;
  headMesh.receiveShadow = true;
  knightGroup.add(headMesh);

  // 3. Eye indents (sculpted spheres)
  const eyeGeo = new THREE.SphereGeometry(0.065, 16, 16);
  const leftEye = new THREE.Mesh(eyeGeo, material);
  leftEye.position.set(0.18, 0.98, 0.22);
  leftEye.scale.set(1.2, 0.7, 0.8);
  knightGroup.add(leftEye);

  const rightEye = new THREE.Mesh(eyeGeo, material);
  rightEye.position.set(0.18, 0.98, -0.22);
  rightEye.scale.set(1.2, 0.7, 0.8);
  knightGroup.add(rightEye);

  // 4. Nostril details
  const nostrilGeo = new THREE.CylinderGeometry(0.035, 0.035, 0.45, 12);
  nostrilGeo.rotateX(Math.PI / 2);
  const nostril = new THREE.Mesh(nostrilGeo, material);
  nostril.position.set(0.58, 0.88, 0);
  knightGroup.add(nostril);

  return knightGroup;
}

export function TwoKnights3DScene({ isHovered = false }) {
  const mountRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 280;
    const height = container.clientHeight || 360;

    // 1. Scene setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0e0e12, 0.12);

    // 2. Camera setup
    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
    camera.position.set(0, 0.2, 5.8);

    // 3. Renderer setup
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;
    container.appendChild(renderer.domElement);

    // 4. Materials
    // White Knight: Marble / Frosted Alabaster with high specular and subtle subsurface feel
    const whiteMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xf4f1ea,
      emissive: 0x111c26,
      roughness: 0.18,
      metalness: 0.08,
      clearcoat: 0.85,
      clearcoatRoughness: 0.15,
      reflectivity: 0.75,
    });

    // Black Knight: Polished Obsidian / Dark Metal with deep rim reflection
    const blackMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x141418,
      emissive: 0x1f0b09,
      roughness: 0.22,
      metalness: 0.82,
      clearcoat: 0.95,
      clearcoatRoughness: 0.1,
      reflectivity: 0.9,
    });

    // 5. Build Knights
    const whiteKnight = createKnightMesh(whiteMaterial);
    whiteKnight.position.set(-1.08, -0.35, 0);
    whiteKnight.rotation.y = Math.PI * 0.78; // Facing left/forward in profile
    whiteKnight.scale.set(0.95, 0.95, 0.95);
    scene.add(whiteKnight);

    const blackKnight = createKnightMesh(blackMaterial);
    blackKnight.position.set(1.08, -0.35, 0);
    blackKnight.rotation.y = -Math.PI * 0.78; // Facing right/forward in profile
    blackKnight.scale.set(0.95, 0.95, 0.95);
    scene.add(blackKnight);

    // 6. Lighting (Matches image: Cool Cyan on Left, Fiery Terracotta on Right)
    const ambientLight = new THREE.AmbientLight(0x181a24, 0.8);
    scene.add(ambientLight);

    // Left Key Light (Cyan / Lunar Blue)
    const leftKey = new THREE.DirectionalLight(0x7dd3fc, 2.6);
    leftKey.position.set(-3.5, 2.5, 3.0);
    scene.add(leftKey);

    // Left Rim / Backlight (creates the bright white-cyan glow on White Knight's spine & ears)
    const leftRim = new THREE.DirectionalLight(0xe0f2fe, 4.5);
    leftRim.position.set(-4.0, 1.8, -2.5);
    scene.add(leftRim);

    // Right Key Light (Terracotta / Warm Coral)
    const rightKey = new THREE.DirectionalLight(0xf87171, 2.2);
    rightKey.position.set(3.5, 2.5, 3.0);
    scene.add(rightKey);

    // Right Rim / Backlight (creates the intense terracotta contour on Black Knight)
    const rightRim = new THREE.DirectionalLight(0xef4444, 4.8);
    rightRim.position.set(4.0, 1.8, -2.5);
    scene.add(rightRim);

    // Subtle bottom glow
    const bottomFill = new THREE.PointLight(0x38bdf8, 0.6, 6);
    bottomFill.position.set(-0.8, -1.8, 1);
    scene.add(bottomFill);

    const bottomFillRed = new THREE.PointLight(0xe11d48, 0.7, 6);
    bottomFillRed.position.set(0.8, -1.8, 1);
    scene.add(bottomFillRed);

    // 7. Floating 3D Dust / Ember Particles
    const particleCount = 45;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 4.5;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 3.5;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 3;

      // Half cyan particles, half terracotta particles
      if (i % 2 === 0) {
        colors[i * 3] = 0.45;
        colors[i * 3 + 1] = 0.85;
        colors[i * 3 + 2] = 1.0;
      } else {
        colors[i * 3] = 0.95;
        colors[i * 3 + 1] = 0.35;
        colors[i * 3 + 2] = 0.25;
      }
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const particleMat = new THREE.PointsMaterial({
      size: 0.055,
      vertexColors: true,
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending,
    });

    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // 8. Mouse tracking and animation loop
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handlePointerMove = (e) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      mouseX = x * 0.4;
      mouseY = y * 0.3;
    };

    window.addEventListener('mousemove', handlePointerMove);

    let animationFrameId;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth mouse lerp
      targetX += (mouseX - targetX) * 0.06;
      targetY += (mouseY - targetY) * 0.06;

      camera.position.x = targetX * 1.2;
      camera.position.y = 0.2 + targetY * 0.8;
      camera.lookAt(0, 0.15, 0);

      // Idle breathing motions (opposing phase)
      const breath = Math.sin(elapsedTime * 1.5) * 0.035;
      const bob = Math.cos(elapsedTime * 1.2) * 0.025;

      whiteKnight.position.y = -0.35 + bob;
      whiteKnight.rotation.y = Math.PI * 0.78 + Math.sin(elapsedTime * 0.8) * 0.05 + targetX * 0.3;
      whiteKnight.rotation.z = breath * 0.4;

      blackKnight.position.y = -0.35 - bob;
      blackKnight.rotation.y = -Math.PI * 0.78 - Math.sin(elapsedTime * 0.8) * 0.05 + targetX * 0.3;
      blackKnight.rotation.z = -breath * 0.4;

      // Particle upward drift
      const posAttr = particleGeo.attributes.position;
      for (let i = 0; i < particleCount; i++) {
        let py = posAttr.getY(i) + 0.003;
        if (py > 2.0) py = -2.0;
        posAttr.setY(i, py);
      }
      posAttr.needsUpdate = true;
      particles.rotation.y = elapsedTime * 0.04;

      renderer.render(scene, camera);
    };

    animate();

    // 9. Resize handler
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      particleGeo.dispose();
      particleMat.dispose();
      whiteMaterial.dispose();
      blackMaterial.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="w-full h-full relative flex items-center justify-center cursor-grab active:cursor-grabbing overflow-hidden"
    />
  );
}

export default TwoKnights3DScene;
