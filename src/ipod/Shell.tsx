/**
 * [INPUT]: React 插槽、three 连续网格/前板与钢壳独立反射/程序微纹理、gl-utils DPR、共享几何与甲板 data-lens-slot 边界。
 * [OUTPUT]: Shell 与 ShellProps，38px 连续曲面与0.8px浅凹金属中心键；追踪限横向 ±40°、纵向 ±16°、侧歪 ±8°。
 * [POS]: 当前甲板内全屏鼠标驱动侧倾；同材质合批，静态时停绘并复用资源，按下冻结角度，宿主保留拖拽。
 * [PROTOCOL]: 变更时更新此头部，然后检查 AGENTS.md
 */
"use client";

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";
import { clampedDpr } from "@/components/gl/gl-utils";
import { IPOD_BEZEL, IPOD_SCALE } from "./geometry";
import styles from "./shell.module.css";

export interface ShellProps {
  theme: "classic" | "black" | "u2";
  screen: ReactNode;
  wheel: ReactNode;
}

// ---- 一张索引网格：前面、倒角、接缝和侧壳共用顶点，不拼 DOM 面片 ----
const WIDTH = 230;
const HEIGHT = 388;
const DEPTH = 38;
const RADIUS = 23;
const PERSPECTIVE = 1000;
const SURFACE_PAD = 40;
const CORNER_SEGMENTS = 32;
const WHEEL_SIZE = 142;
const WHEEL_TOP = 202.5;
const CENTER_RADIUS = 25.75;
const CENTER_DISH_DEPTH = 0.8;
// depth / inset / material；0 哑光前板，1 暗缝，2 抛光侧壳。
const PROFILE = [
  [0, 7, 0], [0.2, 4.7, 0], [0.7, 2.6, 0], [1.6, 1, 0],
  [2.7, 0.2, 0], [4.3, 0.1, 0], [5, 0.5, 1], [5.7, 0.5, 2],
  [6.3, 0.3, 2], [7.5, 0.2, 2], [10, 0.1, 2], [17, 0, 2],
  [24, 0.35, 2], [28, 0.85, 2], [31, 1.5, 2], [33.5, 2.4, 2],
  [35.5, 3.6, 2], [37, 5.1, 2],
  [DEPTH, 7, 2],
];

async function loadSurface() {
  const [THREE, { RoomEnvironment }, { RectAreaLightUniformsLib }] = await Promise.all([
    import("three"), import("three/addons/environments/RoomEnvironment.js"),
    import("three/addons/lights/RectAreaLightUniformsLib.js"),
  ]);
  if (!("LTC_FLOAT_1" in THREE.UniformsLib)) RectAreaLightUniformsLib.init();
  return (canvas: HTMLCanvasElement, theme: ShellProps["theme"]) => {
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    const resources: Array<{ dispose: () => void }> = [renderer];
    try {
      const width = WIDTH + SURFACE_PAD * 2;
      const height = HEIGHT + SURFACE_PAD * 2;
      renderer.setPixelRatio(clampedDpr());
      renderer.setSize(width * IPOD_SCALE, height * IPOD_SCALE, false);
      renderer.setClearColor(0x000000, 0);
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 0.8;
      const world = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(
        2 * Math.atan(height / (2 * PERSPECTIVE)) * 180 / Math.PI, width / height, 1, 2000,
      );
      camera.position.z = PERSPECTIVE;
      // 摄影棚反射只进入金属材质：背侧长灯带映入弧面，灰场保留暗部层次。
      const environment = new THREE.Scene();
      environment.background = new THREE.Color(0x85898d);
      const panelGeometry = new THREE.PlaneGeometry(1, 1);
      resources.push(panelGeometry);
      const panels = [
        [-9, 1, -7, 7, 18, 3], [9, 1, -7, 7, 18, 2.6],
        [0, 10, 0, 16, 8, 2], [0, -9, -3, 16, 6, 1.2],
        [0, 2, 9, 12, 15, 0.8],
      ];
      for (const [x, y, z, w, h, intensity] of panels) {
        const material = new THREE.MeshBasicMaterial({ color: new THREE.Color().setScalar(intensity) });
        resources.push(material);
        const panel = new THREE.Mesh(panelGeometry, material);
        panel.position.set(x, y, z);
        panel.scale.set(w, h, 1);
        panel.lookAt(0, 0, 0);
        environment.add(panel);
      }
      const pmrem = new THREE.PMREMGenerator(renderer);
      resources.push(pmrem);
      const lighting = pmrem.fromScene(environment, 0.025);
      resources.push(lighting);
      world.environment = lighting.texture;
      world.environmentIntensity = 0.65;
      // 前板保留原来的漫反射层次；钢壳灯带不改变磨砂铝的灰阶。
      const frontEnvironment = new RoomEnvironment();
      resources.push(frontEnvironment);
      const frontLighting = pmrem.fromScene(frontEnvironment, 0.06);
      resources.push(frontLighting);
      // 近场柔光箱产生真实的亮区与衰减；反射随法线转动，不把明暗画进底色。
      const key = new THREE.RectAreaLight(0xfffaf2, 2.5, 360, 440);
      key.position.set(-180, 200, 270);
      key.lookAt(0, 0, 0);
      world.add(key);
      const strip = new THREE.RectAreaLight(0xf2f7ff, 2, 90, 460);
      strip.position.set(300, 30, 150);
      strip.lookAt(0, 0, 0);
      world.add(strip);
      const fill = new THREE.HemisphereLight(0xffffff, 0x747a80, 0.25);
      world.add(fill);
      // 同一批细颗粒分别控制底色、粗糙度和微凹凸；mipmap 抑制转动时的闪烁。
      const textureSize = 256;
      const grainData = new Uint8Array(textureSize * textureSize * 4);
      const finishData = new Uint8Array(grainData.length);
      let seed = 17;
      for (let i = 0; i < grainData.length; i += 4) {
        seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
        const noise = seed / 0xffffffff;
        grainData[i] = grainData[i + 1] = grainData[i + 2] = 238 + noise * 17;
        grainData[i + 3] = 255;
        finishData[i] = noise * 255;
        finishData[i + 1] = 220 + noise * 35;
        finishData[i + 2] = 0;
        finishData[i + 3] = 255;
      }
      const grain = new THREE.DataTexture(grainData, textureSize, textureSize);
      const finish = new THREE.DataTexture(finishData, textureSize, textureSize);
      grain.colorSpace = THREE.SRGBColorSpace;
      for (const texture of [grain, finish]) {
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(2, 2 * HEIGHT / WIDTH);
        texture.magFilter = THREE.LinearFilter;
        texture.minFilter = THREE.LinearMipmapLinearFilter;
        texture.generateMipmaps = true;
        texture.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
        texture.needsUpdate = true;
        resources.push(texture);
      }
      const materials = [
        new THREE.MeshStandardMaterial({
          color: theme === "classic" ? 0xbcbdbd : 0x303335,
          metalness: 0.88, roughness: 0.56, map: grain,
          envMap: frontLighting.texture, envMapIntensity: 0.65,
          roughnessMap: finish, bumpMap: finish, bumpScale: 0.015,
          dithering: true,
        }),
        new THREE.MeshStandardMaterial({ color: 0x353b3f, metalness: 0.45, roughness: 0.45 }),
        new THREE.MeshStandardMaterial({ color: 0xd5d9dc, metalness: 1, roughness: 0.12, dithering: true }),
      ];
      resources.push(...materials);
      const positions: number[] = [];
      const normals: number[] = [];
      const uvs: number[] = [];
      const indices: number[] = [];
      const corners = [
        [RADIUS, RADIUS, Math.PI], [WIDTH - RADIUS, RADIUS, Math.PI * 1.5],
        [WIDTH - RADIUS, HEIGHT - RADIUS, 0], [RADIUS, HEIGHT - RADIUS, Math.PI * 0.5],
      ];
      for (const [ring, [depth, inset]] of PROFILE.entries()) {
        const previous = PROFILE[Math.max(0, ring - 1)];
        const next = PROFILE[Math.min(PROFILE.length - 1, ring + 1)];
        const normalZ = ring === 0 ? 1 : previous[1] - next[1];
        const radial = ring === 0 ? 0 : next[0] - previous[0];
        const magnitude = Math.hypot(radial, normalZ);
        for (const [cx, cy, start] of corners) {
          for (let i = 0; i <= CORNER_SEGMENTS; i++) {
            const angle = start + i / CORNER_SEGMENTS * Math.PI / 2;
            positions.push(
              cx + (RADIUS - inset) * Math.cos(angle) - WIDTH / 2,
              HEIGHT / 2 - cy - (RADIUS - inset) * Math.sin(angle),
              DEPTH / 2 - depth,
            );
            uvs.push((cx + (RADIUS - inset) * Math.cos(angle)) / WIDTH,
              1 - (cy + (RADIUS - inset) * Math.sin(angle)) / HEIGHT);
            // 解析截面法线避免长直边三角形的面积权重拉歪圆角光照。
            normals.push(radial * Math.cos(angle) / magnitude, -radial * Math.sin(angle) / magnitude, normalZ / magnitude);
          }
        }
      }
      const ringSize = corners.length * (CORNER_SEGMENTS + 1);
      const geometry = new THREE.BufferGeometry();
      resources.push(geometry);
      const centre = positions.length / 3;
      positions.push(0, 0, DEPTH / 2);
      normals.push(0, 0, 1);
      uvs.push(0.5, 0.5);
      for (let j = 0; j < ringSize; j++) indices.push(centre, (j + 1) % ringSize, j);
      // 前板与倒角连续排列，同材质截面合批；外壳只绘制铝板、接缝、钢壳三组。
      let groupStart = 0;
      let groupMaterial = 0;
      for (let ring = 0; ring < PROFILE.length - 1; ring++) {
        const material = PROFILE[ring][2];
        if (material !== groupMaterial) {
          geometry.addGroup(groupStart, indices.length - groupStart, groupMaterial);
          groupStart = indices.length;
          groupMaterial = material;
        }
        for (let j = 0; j < ringSize; j++) {
          const a = ring * ringSize + j;
          const b = ring * ringSize + (j + 1) % ringSize;
          const c = a + ringSize;
          const d = b + ringSize;
          indices.push(a, b, c, b, d, c);
        }
      }
      geometry.addGroup(groupStart, indices.length - groupStart, groupMaterial);
      geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
      geometry.setAttribute("normal", new THREE.Float32BufferAttribute(normals, 3));
      geometry.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));
      geometry.setIndex(indices);
      const mesh = new THREE.Mesh(geometry, materials);
      mesh.position.z = -DEPTH / 2;
      // 中心键共用机身坐标、面光源与时钟；DOM 只保留按钮命中和焦点环。
      const dishRadius = CENTER_RADIUS - 0.95;
      const centerProfile = [
        new THREE.Vector2(CENTER_RADIUS, -0.25),
        new THREE.Vector2(CENTER_RADIUS, 0.5),
        new THREE.Vector2(CENTER_RADIUS - 0.35, 0.78),
      ];
      // 六道抛物线截面，凹深相对键沿；最低点仍在前板之前，避免相交。
      for (let ring = 5; ring >= 0; ring--) {
        const fraction = ring / 5;
        centerProfile.push(new THREE.Vector2(dishRadius * fraction, CENTER_DISH_DEPTH * fraction ** 2));
      }
      const centerGeometry = new THREE.LatheGeometry(centerProfile, 64);
      centerGeometry.rotateX(Math.PI / 2);
      const centerPosition = centerGeometry.getAttribute("position");
      const centerNormal = centerGeometry.getAttribute("normal");
      const centerUv = centerGeometry.getAttribute("uv");
      const dishSlope = 2 * CENTER_DISH_DEPTH / dishRadius ** 2;
      for (let i = 0; i < centerPosition.count; i++) {
        const x = centerPosition.getX(i);
        const y = centerPosition.getY(i);
        centerUv.setXY(i, x / WIDTH + 0.5, y / HEIGHT + 0.5);
        if (Math.hypot(x, y) <= dishRadius + 0.001) {
          // 解析法线朝凹面中心收束，消除环带折线与圆心三角扇的光照接缝。
          const length = Math.hypot(dishSlope * x, dishSlope * y, 1);
          centerNormal.setXYZ(i, -dishSlope * x / length, -dishSlope * y / length, 1 / length);
        }
      }
      const centerMaterial = new THREE.MeshStandardMaterial({
        color: theme === "classic" ? 0xb0b2b4 : 0x35393d,
        metalness: 0.9, roughness: 0.5,
        envMap: frontLighting.texture, envMapIntensity: 0.65,
        map: grain, bumpMap: finish, bumpScale: 0.0015,
        dithering: true,
      });
      resources.push(centerGeometry, centerMaterial);
      const centerButton = new THREE.Mesh(centerGeometry, centerMaterial);
      centerButton.position.set(0, HEIGHT / 2 - WHEEL_TOP - WHEEL_SIZE / 2, DEPTH / 2 + 0.1);
      mesh.add(centerButton);
      world.add(mesh);
      return {
        render(x: number, y: number) {
          // CSS y 向下，Three y 向上；同一角度与透视距离精确对齐真实 DOM 插槽。
          mesh.rotation.set(-x * Math.PI / 180, y * Math.PI / 180, y * MAX_ROLL / MAX_YAW * Math.PI / 180, "XYZ");
          renderer.render(world, camera);
        },
        resize() {
          renderer.setPixelRatio(clampedDpr());
          renderer.setSize(width * IPOD_SCALE, height * IPOD_SCALE, false);
        },
        dispose() {
          resources.reverse().forEach((resource) => resource.dispose());
        },
      };
    } catch (error) {
      resources.reverse().forEach((resource) => resource.dispose());
      throw error;
    }
  };
}

// ---- 鼠标侧倾：视口归一化坐标，甲板中心命中才启用全屏追踪 ----
const MAX_YAW = 40;
const MAX_PITCH = 16;
const MAX_ROLL = 8;
const FOLLOW_TIME = 0.065;

export function Shell({ theme, screen, wheel }: ShellProps) {
  const scene = useRef<HTMLDivElement>(null);
  const rotor = useRef<HTMLDivElement>(null);
  const surfaceCanvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const node = scene.current;
    const body = rotor.current;
    const canvas = surfaceCanvas.current;
    if (!node || !body || !canvas) return;
    let disposed = false;
    let loading = false;
    let failed = false;
    let surface: ReturnType<Awaited<ReturnType<typeof loadSurface>>> | null = null;
    const host = node.closest<HTMLElement>(".z1-ipod") ?? node;
    const deckSlot = node.closest("[data-lens-slot]");
    let activeCard = !deckSlot;
    const staticView = window.matchMedia("(prefers-reduced-motion: reduce), (hover: none)");
    let inView = false;
    let pointerPresent = false;
    let pressed = false;
    let focused = false;
    let frame: number | null = null;
    let lastTime = 0;
    const pointer = { x: 0, y: 0 };
    const current = { x: 0, y: 0 };
    const target = { x: 0, y: 0 };

    const render = () => {
      body.style.transform = `rotateX(${current.x}deg) rotateY(${current.y}deg) rotateZ(${-current.y * MAX_ROLL / MAX_YAW}deg)`;
      if (surface && !document.hidden && !staticView.matches) surface.render(current.x, current.y);
    };
    const ensureSurface = () => {
      if (surface) {
        node.dataset.surface = "webgl";
        return;
      }
      if (loading || failed) return;
      loading = true;
      void loadSurface().then((create) => {
        if (disposed || staticView.matches || !inView || !activeCard || document.hidden) return;
        surface = create(canvas, theme);
        render();
        node.dataset.surface = "webgl";
      }).catch(() => {
        if (disposed) return;
        // 与站内 GL 层保持同一降级边界：失败即收起，保留原生界面。
        failed = true;
        node.dataset.surface = "fallback";
        sync();
      }).finally(() => { loading = false; });
    };
    const stop = () => {
      if (frame !== null) cancelAnimationFrame(frame);
      frame = null;
      lastTime = 0;
    };
    const tick = (time: number) => {
      frame = null;
      const dt = lastTime ? Math.min((time - lastTime) / 1000, 0.032) : 1 / 60;
      lastTime = time;
      const blend = 1 - Math.exp(-dt / FOLLOW_TIME);
      current.x += (target.x - current.x) * blend;
      current.y += (target.y - current.y) * blend;
      if (Math.max(Math.abs(target.x - current.x), Math.abs(target.y - current.y)) < 0.01) {
        current.x = target.x;
        current.y = target.y;
        lastTime = 0;
        if (!pointerPresent || focused) node.dataset.motion = "front";
      } else {
        frame = requestAnimationFrame(tick);
      }
      render();
    };
    const sync = () => {
      if (failed) {
        surface?.dispose();
        surface = null;
      }
      if (staticView.matches || failed) {
        node.dataset.surface = "fallback";
      }
      if (staticView.matches || failed || !inView || !activeCard || document.hidden) {
        stop();
        current.x = current.y = target.x = target.y = 0;
        render();
        node.dataset.motion = staticView.matches ? "static" : "paused";
        return;
      }
      ensureSurface();
      // 按下期间冻结姿态，轮盘的连续环转和长按共用稳定的命中平面。
      if (pressed) {
        stop();
        node.dataset.motion = "holding";
        return;
      }
      target.x = pointerPresent && !focused ? pointer.x : 0;
      target.y = pointerPresent && !focused ? pointer.y : 0;
      node.dataset.motion = pointerPresent && !focused ? "following" : "returning";
      if (frame === null) frame = requestAnimationFrame(tick);
    };
    const move = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      const x = event.clientX / window.innerWidth * 2 - 1;
      const y = event.clientY / window.innerHeight * 2 - 1;
      pointerPresent = true;
      pointer.x = -Math.max(-1, Math.min(1, y)) * MAX_PITCH;
      pointer.y = Math.max(-1, Math.min(1, x)) * MAX_YAW;
      if (inView && activeCard && !document.hidden && !staticView.matches) sync();
    };
    const leave = () => { pointerPresent = false; sync(); };
    const focus = () => {
      focused = host.contains(document.activeElement)
        && document.activeElement?.matches(":focus-visible") === true;
      sync();
    };
    const blur = (event: FocusEvent) => {
      const next = event.relatedTarget;
      focused = next instanceof Element && host.contains(next) && next.matches(":focus-visible");
      sync();
    };
    const press = () => { focused = false; pressed = true; sync(); };
    const release = (event: PointerEvent) => {
      if (!pressed) return;
      pressed = false;
      move(event);
      if (event.pointerType !== "mouse") sync();
    };
    const cancel = () => { pressed = pointerPresent = false; sync(); };
    const visibility = () => {
      if (document.hidden) pressed = pointerPresent = false;
      sync();
    };
    const observer = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting && entry.intersectionRatio >= 0.1;
      if (!inView) pressed = false;
      sync();
    }, { threshold: 0.1 });
    observer.observe(node);
    const resize = () => { surface?.resize(); render(); };
    const contextLost = (event: Event) => {
      event.preventDefault();
      failed = true;
      sync();
    };
    canvas.addEventListener("webglcontextlost", contextLost);
    window.addEventListener("resize", resize);
    // 消费甲板实际几何；只有经过视口中心的卡片启用，不把邻卡露边视作当前卡。
    const cardObserver = deckSlot ? new IntersectionObserver(([entry]) => {
      activeCard = entry.isIntersecting;
      if (!activeCard) pressed = false;
      sync();
    }, { rootMargin: "0px -49.9% 0px -49.9%" }) : null;
    if (deckSlot) cardObserver?.observe(deckSlot);
    window.addEventListener("pointermove", move, true);
    document.documentElement.addEventListener("pointerleave", leave);
    node.addEventListener("pointerdown", press, true);
    window.addEventListener("pointerup", release, true);
    window.addEventListener("pointercancel", cancel, true);
    window.addEventListener("blur", cancel);
    host.addEventListener("focusin", focus);
    host.addEventListener("focusout", blur);
    document.addEventListener("visibilitychange", visibility);
    staticView.addEventListener("change", sync);
    return () => {
      disposed = true;
      surface?.dispose();
      surface = null;
      delete node.dataset.surface;
      canvas.removeEventListener("webglcontextlost", contextLost);
      window.removeEventListener("resize", resize);
      observer.disconnect();
      cardObserver?.disconnect();
      stop();
      body.style.removeProperty("transform");
      window.removeEventListener("pointermove", move, true);
      document.documentElement.removeEventListener("pointerleave", leave);
      node.removeEventListener("pointerdown", press, true);
      window.removeEventListener("pointerup", release, true);
      window.removeEventListener("pointercancel", cancel, true);
      window.removeEventListener("blur", cancel);
      host.removeEventListener("focusin", focus);
      host.removeEventListener("focusout", blur);
      document.removeEventListener("visibilitychange", visibility);
      staticView.removeEventListener("change", sync);
    };
  }, [theme]);

  return (
    <div
      ref={scene}
      className={styles.scene}
      data-ipod-device=""
      data-theme={theme}
      style={{
        zoom: IPOD_SCALE, width: WIDTH, height: HEIGHT,
        "--ipod-radius": `${RADIUS}px`, "--ipod-perspective": `${PERSPECTIVE}px`,
        "--ipod-surface-pad": `${SURFACE_PAD}px`,
        "--ipod-wheel-size": `${WHEEL_SIZE}px`, "--ipod-wheel-top": `${WHEEL_TOP}px`,
        "--ipod-center-radius": `${CENTER_RADIUS}px`,
      } as CSSProperties}
    >
      <canvas key={theme} ref={surfaceCanvas} className={styles.surface} aria-hidden="true" />
      <div ref={rotor} className={styles.rotor} data-ipod-rotor="" style={{ transformOrigin: `50% 50% ${-DEPTH / 2}px` }}>
        <div className={styles.shell} data-theme={theme}>
          <div
            className={styles.screenBezel}
            style={{
              width: IPOD_BEZEL.width,
              height: IPOD_BEZEL.height,
              padding: IPOD_BEZEL.padding,
            }}
          >
            <div className={styles.screenViewport} data-ipod-slot="screen">
              <div className={styles.screenScale}>{screen}</div>
            </div>
          </div>
          <div className={styles.wheelSlot} data-ipod-slot="wheel">
            {wheel}
          </div>
        </div>
      </div>
    </div>
  );
}
