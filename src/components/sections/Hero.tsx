import { useEffect, useRef, useState, useCallback } from "react";
import * as THREE from "three";
import { useSound } from "@/hooks/useSound";

interface Move {
  axis: "x" | "y" | "z";
  layer: number;
  angle: number;
}

const NOTATIONS = [
  "U",
  "U'",
  "U2",
  "D",
  "D'",
  "D2",
  "R",
  "R'",
  "R2",
  "L",
  "L'",
  "L2",
  "F",
  "F'",
  "F2",
  "B",
  "B'",
  "B2",
];

function moveFromNotation(n: string): Move {
  const axisMap: Record<string, "x" | "y" | "z"> = {
    U: "y",
    D: "y",
    R: "x",
    L: "x",
    F: "z",
    B: "z",
  };
  const layerMap: Record<string, number> = { U: 1, D: -1, R: 1, L: -1, F: 1, B: -1 };
  const letter = n[0];
  const prime = n.includes("'");
  const half = n.includes("2");
  const axis = axisMap[letter] ?? "y";
  const layer = layerMap[letter] ?? 1;
  let angle = Math.PI / 2;
  if (letter === "U" || letter === "D") angle *= -1;
  if (prime) angle *= -1;
  if (half) angle *= 2;
  if (letter === "D" || letter === "L" || letter === "B") angle *= -1;
  return { axis, layer, angle };
}

function inverseMove(m: Move): Move {
  return { ...m, angle: -m.angle };
}

function cubicBez(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function normalizeAngle(a: number): number {
  while (a > Math.PI) a -= 2 * Math.PI;
  while (a <= -Math.PI) a += 2 * Math.PI;
  return a;
}

function RubiksCube({ onRotate }: { onRotate?: () => void }) {
  const mountRef = useRef<HTMLDivElement>(null);
  const [moveCount, setMoveCount] = useState(0);
  const [shuffling, setShuffling] = useState(false);
  const [fixing, setFixing] = useState(false);

  const groupRef = useRef(new THREE.Group());
  const cubiesRef = useRef<THREE.Mesh[]>([]);
  const rafRef = useRef(0);

  const isAnimating = useRef(false);
  const autoRotate = useRef(false);
  const interactionMode = useRef<"none" | "layer" | "orbit">("none");
  const pointerStart = useRef({ x: 0, y: 0 });
  const dragMoved = useRef(false);
  const hitCubie = useRef<THREE.Mesh | null>(null);
  const hitNormal = useRef(new THREE.Vector3());
  const moveHistory = useRef<Move[]>([]);
  const idleTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const layerDrag = useRef<{
    axis: "x" | "y" | "z";
    layer: number;
    pivot: THREE.Group;
    cubies: THREE.Mesh[];
  } | null>(null);

  const snapAnim = useRef<{
    pivot: THREE.Group;
    axis: "x" | "y" | "z";
    cubies: THREE.Mesh[];
    startAngle: number;
    targetAngle: number;
    progress: number;
    layer: number;
  } | null>(null);

  const animRef = useRef<{
    axis: "x" | "y" | "z";
    angle: number;
    cubies: THREE.Mesh[];
    progress: number;
    pivot: THREE.Group;
    onComplete?: () => void;
  } | null>(null);

  const raycaster = useRef(new THREE.Raycaster());
  const mouse = useRef(new THREE.Vector2());

  const snapshotCube = useCallback(() => {
    for (const c of cubiesRef.current) {
      c.position.x = Math.round(c.position.x);
      c.position.y = Math.round(c.position.y);
      c.position.z = Math.round(c.position.z);
      for (const k of ["x", "y", "z"] as const) {
        c.rotation[k] = Math.round(c.rotation[k] / (Math.PI / 2)) * (Math.PI / 2);
      }
    }
  }, []);

  const resumeAutoRotate = useCallback(() => {
    if (idleTimeoutRef.current) clearTimeout(idleTimeoutRef.current);
    idleTimeoutRef.current = setTimeout(() => {
      autoRotate.current = true;
    }, 2000);
  }, []);

  const executeMove = useCallback(
    (move: Move, onComplete?: () => void) => {
      if (isAnimating.current) {
        onComplete?.();
        return;
      }
      const { axis, layer, angle } = move;
      const layerCubies = cubiesRef.current.filter((c) => Math.round(c.position[axis]) === layer);
      if (layerCubies.length === 0) {
        onComplete?.();
        return;
      }

      const pivot = new THREE.Group();
      groupRef.current.add(pivot);
      for (const c of layerCubies) pivot.attach(c);

      isAnimating.current = true;
      autoRotate.current = false;
      if (idleTimeoutRef.current) clearTimeout(idleTimeoutRef.current);

      animRef.current = {
        axis,
        angle,
        cubies: layerCubies,
        progress: 0,
        pivot,
        onComplete: () => {
          snapshotCube();
          for (const c of layerCubies) groupRef.current.attach(c);
          groupRef.current.remove(pivot);
          isAnimating.current = false;
          onComplete?.();
          resumeAutoRotate();
        },
      };
    },
    [snapshotCube, resumeAutoRotate],
  );

  const generateShuffle = useCallback(() => {
    const moves: Move[] = [];
    const count = 18 + Math.floor(Math.random() * 5);
    let last = "";
    for (let i = 0; i < count; i++) {
      let n: string;
      do {
        n = NOTATIONS[Math.floor(Math.random() * NOTATIONS.length)];
      } while (n[0] === last[0]);
      last = n;
      moves.push(moveFromNotation(n));
    }
    return moves;
  }, []);

  const runMoveSequence = useCallback(
    (moves: Move[], onCount?: () => void, onDone?: () => void) => {
      let i = 0;
      const next = () => {
        if (i >= moves.length) {
          onDone?.();
          return;
        }
        executeMove(moves[i], () => {
          onCount?.();
          i++;
          setTimeout(next, 200);
        });
      };
      next();
    },
    [executeMove],
  );

  const handleShuffle = useCallback(() => {
    if (isAnimating.current || snapAnim.current) return;
    setShuffling(true);
    const moves = generateShuffle();
    for (const m of moves) moveHistory.current.push(m);
    runMoveSequence(
      moves,
      () => setMoveCount(moveHistory.current.length),
      () => {
        setShuffling(false);
        resumeAutoRotate();
      },
    );
  }, [generateShuffle, runMoveSequence, resumeAutoRotate]);

  const handleFix = useCallback(() => {
    if (isAnimating.current || snapAnim.current || moveHistory.current.length === 0) return;
    setFixing(true);
    const inverses: Move[] = [];
    while (moveHistory.current.length > 0) {
      inverses.push(inverseMove(moveHistory.current.pop()!));
    }
    setMoveCount(0);
    runMoveSequence(inverses, undefined, () => {
      setFixing(false);
      resumeAutoRotate();
    });
  }, [runMoveSequence, resumeAutoRotate]);

  const handleUndo = useCallback(() => {
    if (isAnimating.current || snapAnim.current || moveHistory.current.length === 0) return;
    const m = moveHistory.current.pop()!;
    setMoveCount((c) => Math.max(0, c - 1));
    executeMove(inverseMove(m), resumeAutoRotate);
  }, [executeMove, resumeAutoRotate]);

  const resumeAutoRef = useRef(resumeAutoRotate);
  resumeAutoRef.current = resumeAutoRotate;
  const handleUndoRef = useRef(handleUndo);
  handleUndoRef.current = handleUndo;
  const onRotateRef = useRef(onRotate);
  onRotateRef.current = onRotate;

  // Three.js setup — runs once
  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.set(0, 0, 7);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    scene.add(new THREE.AmbientLight(0xffffff, 0.6));
    const amber = new THREE.PointLight(0xf59e0b, 1.6, 50);
    amber.position.set(3, 4, 3);
    scene.add(amber);
    const fill = new THREE.PointLight(0x3b82f6, 0.6, 50);
    fill.position.set(-4, -2, 3);
    scene.add(fill);

    const group = groupRef.current;
    group.rotation.x = -0.4;
    group.rotation.y = 0.6;
    scene.add(group);

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
    const cubies: THREE.Mesh[] = [];

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
          cubies.push(cube);
        }
      }
    }
    cubiesRef.current = cubies;

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

    const getNDC = (e: PointerEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      return {
        x: ((e.clientX - rect.left) / rect.width) * 2 - 1,
        y: -((e.clientY - rect.top) / rect.height) * 2 + 1,
      };
    };

    const getAxis = (normal: THREE.Vector3): "x" | "y" | "z" => {
      const n = normal.clone().normalize();
      const absX = Math.abs(n.x),
        absY = Math.abs(n.y),
        absZ = Math.abs(n.z);
      if (absX >= absY && absX >= absZ) return "x";
      if (absY >= absX && absY >= absZ) return "y";
      return "z";
    };

    const cleanupLayerDrag = (cubies: THREE.Mesh[], pivot: THREE.Group) => {
      for (const c of cubies) group.attach(c);
      group.remove(pivot);
    };

    const onPointerDown = (e: PointerEvent) => {
      if (isAnimating.current || snapAnim.current) return;
      const ndc = getNDC(e);
      pointerStart.current = { x: e.clientX, y: e.clientY };
      dragMoved.current = false;
      hitCubie.current = null;
      interactionMode.current = "none";

      autoRotate.current = false;
      if (idleTimeoutRef.current) clearTimeout(idleTimeoutRef.current);

      mouse.current.set(ndc.x, ndc.y);
      raycaster.current.setFromCamera(mouse.current, camera);
      const intersects = raycaster.current.intersectObjects(cubies);
      if (intersects.length > 0) {
        const hit = intersects[0];
        hitCubie.current = hit.object as THREE.Mesh;
        const n = hit.face!.normal.clone();
        n.transformDirection(hit.object.matrixWorld);
        hitNormal.current.copy(n);
      }
    };

    const onPointerMove = (e: PointerEvent) => {
      if (isAnimating.current || snapAnim.current) return;
      const dx = e.clientX - pointerStart.current.x;
      const dy = e.clientY - pointerStart.current.y;

      if (Math.abs(dx) > 3 || Math.abs(dy) > 3) dragMoved.current = true;

      if (interactionMode.current === "layer" && layerDrag.current) {
        const { axis, pivot } = layerDrag.current;
        const sens = 0.012;
        const dragAngle = axis === "x" ? dy * sens : dx * sens;
        pivot.rotation[axis] += dragAngle;
        pointerStart.current = { x: e.clientX, y: e.clientY };
      } else if (interactionMode.current === "orbit") {
        group.rotation.y += dx * 0.008;
        group.rotation.x += dy * 0.008;
        group.rotation.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, group.rotation.x));
        pointerStart.current = { x: e.clientX, y: e.clientY };
      } else if (dragMoved.current && interactionMode.current === "none") {
        if (hitCubie.current) {
          // Start layer drag
          const axis = getAxis(hitNormal.current);
          const layer = Math.round(hitCubie.current.position[axis]);
          const layerCubies = cubies.filter((c) => Math.round(c.position[axis]) === layer);
          if (layerCubies.length > 0) {
            const pivot = new THREE.Group();
            group.add(pivot);
            for (const c of layerCubies) pivot.attach(c);
            layerDrag.current = { axis, layer, pivot, cubies: layerCubies };
            interactionMode.current = "layer";
          }
        } else {
          interactionMode.current = "orbit";
        }
      }
    };

    const onPointerUp = () => {
      if (isAnimating.current) {
        resumeAutoRef.current?.();
        return;
      }

      if (snapAnim.current) {
        resumeAutoRef.current?.();
        return;
      }

      if (interactionMode.current === "layer" && layerDrag.current) {
        const { pivot, axis, cubies, layer } = layerDrag.current;
        const currentAngle = pivot.rotation[axis];
        let snapped = Math.round(currentAngle / (Math.PI / 2)) * (Math.PI / 2);
        snapped = normalizeAngle(snapped);

        if (Math.abs(snapped) > 0.001) {
          // Snap animation
          const snapTarget = snapped === -Math.PI ? Math.PI : snapped;
          snapAnim.current = {
            pivot,
            axis,
            cubies,
            startAngle: currentAngle,
            targetAngle: snapTarget,
            progress: 0,
            layer,
          };
        } else {
          // No move, clean up
          cleanupLayerDrag(cubies, pivot);
          layerDrag.current = null;
          interactionMode.current = "none";
        }
      }

      if (interactionMode.current === "orbit") {
        interactionMode.current = "none";
      }

      resumeAutoRef.current?.();
    };

    const onPointerLeave = () => {
      if (interactionMode.current === "layer" && layerDrag.current) {
        const { pivot, axis, cubies } = layerDrag.current;
        cleanupLayerDrag(cubies, pivot);
        layerDrag.current = null;
        interactionMode.current = "none";
      }
      if (interactionMode.current === "orbit") {
        interactionMode.current = "none";
      }
      resumeAutoRef.current?.();
    };

    const onContext = (e: Event) => e.preventDefault();

    renderer.domElement.addEventListener("pointerdown", onPointerDown);
    renderer.domElement.addEventListener("pointermove", onPointerMove);
    renderer.domElement.addEventListener("pointerup", onPointerUp);
    renderer.domElement.addEventListener("pointerleave", onPointerLeave);
    renderer.domElement.addEventListener("contextmenu", onContext);

    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "z") {
        e.preventDefault();
        handleUndoRef.current?.();
      }
    };
    window.addEventListener("keydown", onKey);

    const tick = () => {
      // Snap animation (layer drag release)
      const snap = snapAnim.current;
      if (snap) {
        snap.progress += 1 / 10;
        if (snap.progress >= 1) {
          snap.pivot.rotation[snap.axis] = snap.targetAngle;
          // Finalize
          snapshotCube();
          cleanupLayerDrag(snap.cubies, snap.pivot);
          const angle = normalizeAngle(snap.targetAngle);
          if (Math.abs(angle) > 0.001) {
            moveHistory.current.push({ axis: snap.axis, layer: snap.layer, angle });
            setMoveCount((c) => c + 1);
            onRotateRef.current?.();
          }
          snapAnim.current = null;
          layerDrag.current = null;
          interactionMode.current = "none";
        } else {
          const t = 1 - Math.pow(1 - snap.progress, 3);
          snap.pivot.rotation[snap.axis] =
            snap.startAngle + (snap.targetAngle - snap.startAngle) * t;
        }
      }

      // Animated move (shuffle/fix)
      const anim = animRef.current;
      if (anim) {
        anim.progress += 1 / 18;
        if (anim.progress >= 1) {
          anim.pivot.rotation[anim.axis] = anim.angle * 1;
          renderer.render(scene, camera);
          const cb = anim.onComplete;
          animRef.current = null;
          cb?.();
        } else {
          const eased = cubicBez(anim.progress);
          anim.pivot.rotation[anim.axis] = anim.angle * eased;
        }
      }

      renderer.render(scene, camera);
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafRef.current);
      ro.disconnect();
      renderer.domElement.removeEventListener("pointerdown", onPointerDown);
      renderer.domElement.removeEventListener("pointermove", onPointerMove);
      renderer.domElement.removeEventListener("pointerup", onPointerUp);
      renderer.domElement.removeEventListener("pointerleave", onPointerLeave);
      renderer.domElement.removeEventListener("contextmenu", onContext);
      window.removeEventListener("keydown", onKey);
      renderer.dispose();
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const disabled = shuffling || fixing || isAnimating.current || snapAnim.current !== null;

  return (
    <div ref={mountRef} className="w-full h-[320px] md:h-[500px] relative select-none" style={{ touchAction: "none" }}>
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-3 z-10">
        <button
          onClick={handleShuffle}
          disabled={disabled}
          className="text-[11px] tracking-[0.15em] font-semibold px-5 py-2 rounded-sm transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
          style={{ border: "1px solid #F59E0B", color: "#F59E0B", background: "transparent" }}
        >
          SHUFFLE
        </button>
        <button
          onClick={handleFix}
          disabled={disabled || moveHistory.current.length === 0}
          className="text-[11px] tracking-[0.15em] font-semibold px-5 py-2 rounded-sm transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#D97706]"
          style={{ background: "#F59E0B", color: "#0A0A0A", border: "none" }}
        >
          FIX
        </button>
        <span
          className="text-[11px] font-mono tracking-wider"
          style={{ color: "rgba(245,240,232,0.4)", minWidth: 60 }}
        >
          {moveCount > 0 ? `Moves: ${moveCount}` : ""}
        </span>
      </div>
    </div>
  );
}

export function Hero() {
  const { playRotate } = useSound();

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
          style={{ fontSize: "clamp(56px, 8vw, 120px)", lineHeight: 0.9, letterSpacing: "-0.03em" }}
        >
          <span className="block">JAY</span>
          <span className="block">
            HARISH<span className="text-[#F59E0B]">.</span>
          </span>
        </h1>
        <p className="mt-5 text-[15px] md:text-base text-[#F5F0E8]/55 max-w-md">
          Full-stack developer. Safety-tech. Privacy-first.
        </p>
        <div className="mt-9 flex flex-wrap gap-4">
          <button
            onClick={() =>
              document
                .querySelector('[data-section="projects"]')
                ?.scrollIntoView({ behavior: "smooth" })
            }
            className="bg-[#F59E0B] text-[#0A0A0A] font-semibold px-7 py-3 rounded-sm hover:bg-[#D97706] transition-colors text-sm tracking-wide"
          >
            View Work
          </button>
          <button
            onClick={() =>
              document
                .querySelector('[data-section="contact"]')
                ?.scrollIntoView({ behavior: "smooth" })
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
        <RubiksCube onRotate={playRotate} />
      </div>
    </section>
  );
}
