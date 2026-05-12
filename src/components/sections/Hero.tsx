import { useEffect, useRef } from "react";
import * as THREE from "three";

function RubiksCube() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.set(0, 0, 7);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mount.appendChild(renderer.domElement);

    scene.add(new THREE.AmbientLight(0xffffff, 0.6));
    const amber = new THREE.PointLight(0xf59e0b, 1.6, 50);
    amber.position.set(3, 4, 3);
    scene.add(amber);
    const fill = new THREE.PointLight(0x3b82f6, 0.6, 50);
    fill.position.set(-4, -2, 3);
    scene.add(fill);

    // Build 3x3x3 cube
    const group = new THREE.Group();
    const FACE_COLORS = {
      right: 0xc41e3a,
      left: 0xff5800,
      top: 0xffffff,
      bottom: 0xffd500,
      front: 0x009b48,
      back: 0x0051a2,
    };
    const INNER = 0x111111;
    const SIZE = 0.95;
    const GAP = 0.05;
    const STEP = SIZE + GAP;

    for (let x = -1; x <= 1; x++) {
      for (let y = -1; y <= 1; y++) {
        for (let z = -1; z <= 1; z++) {
          const mats = [
            new THREE.MeshStandardMaterial({
              color: x === 1 ? FACE_COLORS.right : INNER,
              roughness: 0.4,
              metalness: 0.1,
            }),
            new THREE.MeshStandardMaterial({
              color: x === -1 ? FACE_COLORS.left : INNER,
              roughness: 0.4,
              metalness: 0.1,
            }),
            new THREE.MeshStandardMaterial({
              color: y === 1 ? FACE_COLORS.top : INNER,
              roughness: 0.4,
              metalness: 0.1,
            }),
            new THREE.MeshStandardMaterial({
              color: y === -1 ? FACE_COLORS.bottom : INNER,
              roughness: 0.4,
              metalness: 0.1,
            }),
            new THREE.MeshStandardMaterial({
              color: z === 1 ? FACE_COLORS.front : INNER,
              roughness: 0.4,
              metalness: 0.1,
            }),
            new THREE.MeshStandardMaterial({
              color: z === -1 ? FACE_COLORS.back : INNER,
              roughness: 0.4,
              metalness: 0.1,
            }),
          ];
          const cube = new THREE.Mesh(new THREE.BoxGeometry(SIZE, SIZE, SIZE), mats);
          cube.position.set(x * STEP, y * STEP, z * STEP);
          group.add(cube);
        }
      }
    }

    // Apply scrambled visual: rotate a few cubies for "scrambled" look
    group.children.forEach((c, i) => {
      const m = c as THREE.Mesh;
      if (i % 3 === 0) m.rotation.y = Math.PI / 2;
      if (i % 5 === 0) m.rotation.x = Math.PI / 2;
    });

    group.rotation.x = -0.4;
    group.rotation.y = 0.6;
    scene.add(group);

    let targetX = group.rotation.x;
    let targetY = group.rotation.y;
    let hovering = false;

    const onMove = (e: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const ny = ((e.clientY - rect.top) / rect.height) * 2 - 1;
      targetX = -ny * 0.6;
      targetY = nx * 0.8;
    };
    renderer.domElement.addEventListener("mousemove", onMove);
    renderer.domElement.addEventListener("mouseenter", () => (hovering = true));
    renderer.domElement.addEventListener("mouseleave", () => (hovering = false));

    const resize = () => {
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(mount);

    let raf = 0;
    const tick = () => {
      const speed = hovering ? 0.012 : 0.005;
      group.rotation.y += speed;
      group.rotation.x += speed * 0.6;
      // Parallax lerp
      group.rotation.x += (targetX - group.rotation.x) * 0.02;
      group.rotation.y += (targetY - group.rotation.y) * 0.02;
      renderer.render(scene, camera);
      raf = requestAnimationFrame(tick);
    };
    tick();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      renderer.domElement.removeEventListener("mousemove", onMove);
      renderer.dispose();
      mount.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} className="w-full h-[420px] md:h-[500px]" />;
}

export function Hero() {
  return (
    <section
      data-section="hero"
      className="min-h-screen grid items-center md:grid-cols-[55fr_45fr] gap-10 md:gap-6 px-5 md:pl-[80px] md:pr-[80px] pt-24 md:pt-0 pb-16"
    >
      <div className="reveal" style={{ "--i": 0 } as React.CSSProperties}>
        <span className="inline-flex items-center pulse-dot text-[11px] font-semibold tracking-[0.18em] text-[#0A0A0A] bg-[#F59E0B] px-3 py-1.5 rounded-sm uppercase">
          Available for work
        </span>

        <h1
          className="font-serif text-[#F5F0E8] mt-6"
          style={{
            fontSize: "clamp(56px, 8vw, 120px)",
            lineHeight: 0.9,
            letterSpacing: "-0.03em",
          }}
        >
          <span className="block">JAY</span>
          <span className="block">HARISH<span className="text-[#F59E0B]">.</span></span>
        </h1>

        <p className="mt-5 text-[15px] md:text-base text-[#F5F0E8]/55 max-w-md">
          Full-stack developer. Safety-tech. Privacy-first.
        </p>

        <div className="mt-9 flex flex-wrap gap-4">
          <button
            onClick={() =>
              document.querySelector('[data-section="projects"]')?.scrollIntoView({ behavior: "smooth" })
            }
            className="bg-[#F59E0B] text-[#0A0A0A] font-semibold px-7 py-3 rounded-sm hover:bg-[#D97706] transition-colors text-sm tracking-wide"
          >
            View Work
          </button>
          <button
            onClick={() =>
              document.querySelector('[data-section="contact"]')?.scrollIntoView({ behavior: "smooth" })
            }
            className="border border-[#F5F0E8]/30 text-[#F5F0E8] px-7 py-3 rounded-sm hover:border-[#F59E0B] hover:text-[#F59E0B] transition-colors text-sm tracking-wide"
          >
            Contact
          </button>
        </div>

        <div className="mt-12 flex flex-wrap gap-3">
          {["39 Repos", "React Native · TypeScript", "Coimbatore, IN"].map((p) => (
            <span
              key={p}
              className="text-[12px] text-[#F5F0E8]/40 px-3.5 py-1.5 rounded-sm"
              style={{ border: "1px solid rgba(245,240,232,0.12)" }}
            >
              {p}
            </span>
          ))}
        </div>
      </div>

      <div className="reveal" style={{ "--i": 2 } as React.CSSProperties}>
        <RubiksCube />
      </div>
    </section>
  );
}
