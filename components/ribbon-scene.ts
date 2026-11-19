import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";

// Values from design-research/screens/README.md ("Matching the poster in three.js") and design-tokens.json.
const IDLE_SECONDS = 48;
const MAX_TILT = THREE.MathUtils.degToRad(8);
const MAX_DPR = 1.5;
const ELEVATION = THREE.MathUtils.degToRad(12);
const BASE = new THREE.Color("#A9B8FF");

const isDark = () => {
  const t = document.documentElement.dataset.theme;
  return t ? t === "dark" : matchMedia("(prefers-color-scheme: dark)").matches;
};

export async function mountRibbon(canvas: HTMLCanvasElement, slot: HTMLElement, onReady: () => void) {
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, MAX_DPR));

  const draco = new DRACOLoader().setDecoderPath("/draco/");
  const gltf = await new GLTFLoader()
    .setDRACOLoader(draco)
    .loadAsync("/3d/accent.glb")
    .catch((e) => {
      renderer.dispose();
      throw e;
    })
    .finally(() => draco.dispose());

  const scene = new THREE.Scene();
  const key = new THREE.DirectionalLight("#ffffff", 2.3);
  key.position.set(-1, 1, 1);
  const fill = new THREE.DirectionalLight("#ffffff", 2.3 * 0.28);
  fill.position.set(1, 0, 0.4);
  const rim = new THREE.DirectionalLight("#E4E8FF", 0);
  rim.position.set(0.3, 0.6, -1);
  scene.add(key, fill, rim, new THREE.AmbientLight("#ffffff", 1.1));

  const pivot = new THREE.Group();
  pivot.add(gltf.scene);
  scene.add(pivot);

  // Re-centre the model on the pivot so spinning stays in place.
  const box = new THREE.Box3().setFromObject(gltf.scene);
  const sphere = box.getBoundingSphere(new THREE.Sphere());
  gltf.scene.position.sub(sphere.center);

  // The poster frames the ring at 75% of the slot, slightly above centre to leave room for the shadow.
  const half = sphere.radius * 0.79;
  const camera = new THREE.OrthographicCamera(-half, half, half * 0.95, -half * 1.05, 0.01, 100);
  camera.position.set(0, Math.sin(ELEVATION) * 10, Math.cos(ELEVATION) * 10);
  camera.lookAt(0, 0, 0);

  let material: THREE.MeshStandardMaterial | undefined;
  gltf.scene.traverse((o) => {
    if ((o as THREE.Mesh).isMesh) material = (o as THREE.Mesh).material as THREE.MeshStandardMaterial;
  });
  const tint = BASE.clone();

  const resize = () => {
    const { width, height } = slot.getBoundingClientRect();
    renderer.setSize(width, height, false);
  };
  const applyTheme = () => {
    rim.intensity = isDark() ? 1.2 : 0;
    key.intensity = isDark() ? 1.8 : 2.3;
  };
  resize();
  applyTheme();

  let visible = true;
  let tiltX = 0;
  let tiltY = 0;
  let targetX = 0;
  let targetY = 0;
  let drag = 0;
  let dragging = false;
  let lastX = 0;
  let idle = 0;
  let prev = performance.now();
  let raf = 0;

  const frame = (now: number) => {
    raf = 0;
    const dt = Math.min((now - prev) / 1000, 0.1);
    prev = now;
    if (!dragging) {
      idle += (dt * Math.PI * 2) / IDLE_SECONDS;
      drag *= Math.exp(-dt * 2.5); // Settle back with damping.
    }
    tiltX += (targetX - tiltX) * (1 - Math.exp(-dt * 8));
    tiltY += (targetY - tiltY) * (1 - Math.exp(-dt * 8));
    pivot.rotation.set(tiltX, drag + tiltY - idle, 0);
    material?.color.lerp(tint, 1 - Math.exp(-dt * 5));
    renderer.render(scene, camera);
    schedule();
  };
  const schedule = () => {
    if (visible && !document.hidden && !raf) raf = requestAnimationFrame(frame);
  };
  const wake = () => {
    prev = performance.now();
    schedule();
  };

  const onMove = (e: PointerEvent) => {
    const r = slot.getBoundingClientRect();
    if (dragging) {
      drag += ((e.clientX - lastX) / r.width) * Math.PI;
      lastX = e.clientX;
      return;
    }
    if (e.pointerType === "mouse") {
      targetY = ((e.clientX - r.left) / r.width - 0.5) * 2 * MAX_TILT;
      targetX = ((e.clientY - r.top) / r.height - 0.5) * 2 * MAX_TILT;
    }
  };
  const onLeave = () => {
    targetX = 0;
    targetY = 0;
  };
  const onDown = (e: PointerEvent) => {
    dragging = true;
    lastX = e.clientX;
    slot.setPointerCapture(e.pointerId);
  };
  const onUp = () => {
    dragging = false;
  };
  const onTint = (e: Event) => {
    tint.set((e as CustomEvent<string | null>).detail ?? BASE);
  };

  const observer = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    wake();
  });
  observer.observe(slot);
  const sizer = new ResizeObserver(resize);
  sizer.observe(slot);
  const media = matchMedia("(prefers-color-scheme: dark)");

  slot.addEventListener("pointermove", onMove);
  slot.addEventListener("pointerleave", onLeave);
  slot.addEventListener("pointerdown", onDown);
  slot.addEventListener("pointerup", onUp);
  slot.addEventListener("pointercancel", onUp);
  window.addEventListener("ribbon-tint", onTint);
  window.addEventListener("themechange", applyTheme);
  media.addEventListener("change", applyTheme);
  document.addEventListener("visibilitychange", wake);

  renderer.render(scene, camera);
  onReady();
  wake();

  return () => {
    if (raf) cancelAnimationFrame(raf);
    observer.disconnect();
    sizer.disconnect();
    slot.removeEventListener("pointermove", onMove);
    slot.removeEventListener("pointerleave", onLeave);
    slot.removeEventListener("pointerdown", onDown);
    slot.removeEventListener("pointerup", onUp);
    slot.removeEventListener("pointercancel", onUp);
    window.removeEventListener("ribbon-tint", onTint);
    window.removeEventListener("themechange", applyTheme);
    media.removeEventListener("change", applyTheme);
    document.removeEventListener("visibilitychange", wake);
    gltf.scene.traverse((o) => {
      const mesh = o as THREE.Mesh;
      if (mesh.isMesh) {
        mesh.geometry.dispose();
        (mesh.material as THREE.Material).dispose();
      }
    });
    renderer.dispose();
    renderer.forceContextLoss();
  };
}
