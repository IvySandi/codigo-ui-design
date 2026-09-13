"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import * as THREE from "three";

type ThreeWalkCharacterProps = {
  active: boolean;
  className?: string;
  motion?: "idle" | "float" | "walk";
};

type Pose = {
  x: number;
  y: number;
  walkerRotation: number;
  characterRotation: number;
  shadowScale: number;
  shadowOpacity: number;
};

export function ThreeWalkCharacter({ active, className = "", motion = "walk" }: ThreeWalkCharacterProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef(active);
  const motionRef = useRef(motion);
  const previousMotionRef = useRef(motion);
  const motionChangedAtRef = useRef(0);

  useEffect(() => {
    activeRef.current = active;
  }, [active]);

  useEffect(() => {
    if (motionRef.current !== motion) {
      previousMotionRef.current = motionRef.current;
      motionChangedAtRef.current = performance.now();
    }
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
    let resizeTimer: number | undefined;
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

    const scheduleResize = () => {
      if (resizeTimer !== undefined) window.clearTimeout(resizeTimer);
      // Keep the canvas geometry stable while the parent is moving between slides.
      resizeTimer = window.setTimeout(resize, 180);
    };

    const getPose = (motionName: ThreeWalkCharacterProps["motion"], time: number): Pose => {
      const stride = time * 0.007;
      const step = Math.sin(stride);
      const lift = Math.max(0, Math.sin(stride * 2));

      if (!activeRef.current) {
        return { x: 0, y: 0, walkerRotation: 0, characterRotation: 0, shadowScale: 1.24, shadowOpacity: 0.1 };
      }

      if (motionName === "walk") {
        return {
          x: Math.sin(time * 0.00065) * 0.13,
          y: lift * 0.055 - 0.02,
          walkerRotation: -0.045 + step * 0.045,
          characterRotation: step * 0.018,
          shadowScale: 1.26 - lift * 0.16,
          shadowOpacity: 0.13 - lift * 0.045,
        };
      }

      if (motionName === "float") {
        return {
          x: Math.sin(time * 0.00042) * 0.045,
          y: Math.sin(time * 0.0011) * 0.06,
          walkerRotation: Math.sin(time * 0.0008) * 0.025,
          characterRotation: 0,
          shadowScale: 1.22,
          shadowOpacity: 0.11,
        };
      }

      return {
        x: 0,
        y: Math.sin(time * 0.0014) * 0.025,
        walkerRotation: Math.sin(time * 0.001) * 0.015,
        characterRotation: 0,
        shadowScale: 1.24,
        shadowOpacity: 0.1,
      };
    };

    const animate = (time: number) => {
      const elapsed = Math.max(0, time - motionChangedAtRef.current - 160);
      const blend = THREE.MathUtils.smoothstep(elapsed / 820, 0, 1);
      const previousPose = getPose(previousMotionRef.current, time);
      const nextPose = getPose(motionRef.current, time);
      const pose = {
        x: THREE.MathUtils.lerp(previousPose.x, nextPose.x, blend),
        y: THREE.MathUtils.lerp(previousPose.y, nextPose.y, blend),
        walkerRotation: THREE.MathUtils.lerp(previousPose.walkerRotation, nextPose.walkerRotation, blend),
        characterRotation: THREE.MathUtils.lerp(previousPose.characterRotation, nextPose.characterRotation, blend),
        shadowScale: THREE.MathUtils.lerp(previousPose.shadowScale, nextPose.shadowScale, blend),
        shadowOpacity: THREE.MathUtils.lerp(previousPose.shadowOpacity, nextPose.shadowOpacity, blend),
      };

      walker.position.x = THREE.MathUtils.lerp(walker.position.x, pose.x, 0.1);
      walker.position.y = THREE.MathUtils.lerp(walker.position.y, pose.y, 0.1);
      walker.rotation.z = THREE.MathUtils.lerp(walker.rotation.z, pose.walkerRotation, 0.1);
      character.rotation.z = THREE.MathUtils.lerp(character.rotation.z, pose.characterRotation, 0.1);
      shadow.scale.x = THREE.MathUtils.lerp(shadow.scale.x, pose.shadowScale, 0.1);
      shadow.material.opacity = THREE.MathUtils.lerp(shadow.material.opacity, pose.shadowOpacity, 0.1);

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
        frameId = window.requestAnimationFrame(animate);
      },
    );

    const observer = new ResizeObserver(scheduleResize);
    observer.observe(host);
    resize();

    return () => {
      disposed = true;
      if (frameId !== undefined) window.cancelAnimationFrame(frameId);
      if (resizeTimer !== undefined) window.clearTimeout(resizeTimer);
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
  }, []);

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
