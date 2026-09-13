"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import * as THREE from "three";

type ThreeWalkCharacterProps = {
  active: boolean;
  className?: string;
  motion?: "idle" | "float" | "walk";
};

export function ThreeWalkCharacter({ active, className = "", motion = "walk" }: ThreeWalkCharacterProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const motionRef = useRef(motion);

  useEffect(() => {
    motionRef.current = motion;
  }, [motion]);

  useEffect(() => {
    const host = hostRef.current;
    if (!host || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    } catch {
      return;
    }

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
    camera.position.z = 2;

    const walker = new THREE.Group();
    walker.rotation.z = -0.04;
    scene.add(walker);

    const characterMaterial = new THREE.MeshBasicMaterial({
      transparent: true,
      depthWrite: false,
    });
    const character = new THREE.Mesh(new THREE.PlaneGeometry(1.45, 1.45), characterMaterial);
    walker.add(character);

    const shadow = new THREE.Mesh(
      new THREE.CircleGeometry(0.34, 32),
      new THREE.MeshBasicMaterial({ color: "#2946a0", opacity: 0.13, transparent: true, depthWrite: false }),
    );
    shadow.position.set(0, -0.62, -0.01);
    shadow.scale.set(1.35, 0.3, 1);
    walker.add(shadow);

    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.domElement.className = "three-walk-character-canvas";
    host.prepend(renderer.domElement);

    let frameId: number | undefined;
    let disposed = false;
    const resize = () => {
      const { width, height } = host.getBoundingClientRect();
      if (!width || !height) return;

      const aspect = width / height;
      camera.left = -aspect;
      camera.right = aspect;
      camera.top = 1;
      camera.bottom = -1;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);
      renderer.render(scene, camera);
    };

    const animate = (time: number) => {
      const stride = time * 0.007;
      const step = Math.sin(stride);
      const lift = Math.max(0, Math.sin(stride * 2));

      if (motionRef.current === "walk") {
        walker.position.x = Math.sin(time * 0.00065) * 0.13;
        walker.position.y = lift * 0.055 - 0.02;
        walker.rotation.z = -0.045 + step * 0.045;
        character.rotation.z = step * 0.018;
        shadow.scale.x = 1.26 - lift * 0.16;
        shadow.material.opacity = 0.13 - lift * 0.045;
      } else if (motionRef.current === "float") {
        walker.position.x = Math.sin(time * 0.00042) * 0.045;
        walker.position.y = Math.sin(time * 0.0011) * 0.06;
        walker.rotation.z = Math.sin(time * 0.0008) * 0.025;
        character.rotation.z = 0;
        shadow.scale.x = 1.22;
        shadow.material.opacity = 0.11;
      } else {
        walker.position.x = 0;
        walker.position.y = Math.sin(time * 0.0014) * 0.025;
        walker.rotation.z = Math.sin(time * 0.001) * 0.015;
        character.rotation.z = 0;
        shadow.scale.x = 1.24;
        shadow.material.opacity = 0.1;
      }

      renderer.render(scene, camera);
      frameId = window.requestAnimationFrame(animate);
    };

    const textureLoader = new THREE.TextureLoader();
    textureLoader.load(
      "/assets/transhumans/Chillin.svg",
      (texture) => {
        if (disposed) {
          texture.dispose();
          return;
        }
        texture.colorSpace = THREE.SRGBColorSpace;
        characterMaterial.map = texture;
        characterMaterial.needsUpdate = true;
        host.classList.add("has-webgl-character");
        resize();
        if (active) frameId = window.requestAnimationFrame(animate);
      },
    );

    const observer = new ResizeObserver(resize);
    observer.observe(host);
    resize();

    return () => {
      disposed = true;
      if (frameId !== undefined) window.cancelAnimationFrame(frameId);
      observer.disconnect();
      host.classList.remove("has-webgl-character");
      character.geometry.dispose();
      characterMaterial.map?.dispose();
      characterMaterial.dispose();
      shadow.geometry.dispose();
      (shadow.material as THREE.Material).dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [active]);

  return (
    <div ref={hostRef} className={`three-walk-character ${className}`} aria-hidden="true">
      <Image
        className="three-walk-character-fallback"
        src="/assets/transhumans/Chillin.svg"
        alt=""
        width={1080}
        height={1080}
        unoptimized
      />
    </div>
  );
}
