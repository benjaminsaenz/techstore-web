import { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * HeroThree
 * - Fondo visual (Three.js) liviano para el hero.
 * - No bloquea clicks (pointer-events: none desde CSS).
 * - Se desactiva automáticamente si el usuario tiene "reduced motion".
 */
export default function HeroThree() {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Si no queremos animación, no montamos WebGL.
    if (prefersReduced) return;

    let raf = 0;
    let renderer;
    let scene;
    let camera;
    let mesh;
    let resizeObserver;
    let handleResize;

    try {
      scene = new THREE.Scene();

      const w = mount.clientWidth || 1;
      const h = mount.clientHeight || 1;
      camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 100);
      camera.position.set(0, 0, 6);

      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.setSize(w, h);
      renderer.setClearColor(0x000000, 0);
      mount.appendChild(renderer.domElement);

      // Luz suave
      const amb = new THREE.AmbientLight(0xffffff, 0.9);
      scene.add(amb);
      const dir = new THREE.DirectionalLight(0xffffff, 0.8);
      dir.position.set(2, 2, 4);
      scene.add(dir);

      // Geometría "tech" simple
      const geo = new THREE.TorusKnotGeometry(1.2, 0.32, 160, 24);
      const mat = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        metalness: 0.55,
        roughness: 0.25,
        transparent: true,
        opacity: 0.22,
      });
      mesh = new THREE.Mesh(geo, mat);
      mesh.rotation.set(0.4, 0.2, 0);
      scene.add(mesh);

      const clock = new THREE.Clock();
      const animate = () => {
        raf = window.requestAnimationFrame(animate);
        const t = clock.getElapsedTime();

        // Rotación suave
        mesh.rotation.y = t * 0.28;
        mesh.rotation.x = 0.35 + Math.sin(t * 0.6) * 0.05;

        renderer.render(scene, camera);
      };

      animate();

      // Resize
      handleResize = () => {
        const nw = mount.clientWidth || 1;
        const nh = mount.clientHeight || 1;
        camera.aspect = nw / nh;
        camera.updateProjectionMatrix();
        renderer.setSize(nw, nh);
      };

      // ResizeObserver (mejor que window.onresize en layouts responsive)
      if ("ResizeObserver" in window) {
        resizeObserver = new ResizeObserver(handleResize);
        resizeObserver.observe(mount);
      } else {
        window.addEventListener("resize", handleResize);
      }
    } catch {
      // Si WebGL falla, simplemente no mostramos nada.
    }

    return () => {
      if (raf) window.cancelAnimationFrame(raf);
      if (resizeObserver) resizeObserver.disconnect();
      if (handleResize) window.removeEventListener("resize", handleResize);

      try {
        if (mesh) {
          mesh.geometry?.dispose?.();
          mesh.material?.dispose?.();
        }
        renderer?.dispose?.();
        if (renderer?.domElement && renderer.domElement.parentNode) {
          renderer.domElement.parentNode.removeChild(renderer.domElement);
        }
      } catch {
        // ignore
      }
    };
  }, []);

  return <div ref={mountRef} className="ts-hero-three" aria-hidden="true" />;
}
