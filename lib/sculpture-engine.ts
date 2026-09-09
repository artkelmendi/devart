import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

export type SceneState = { mode: string; paused: boolean };
type Pose = { at: number; x: number; y: number; scale: number; rx: number; ry: number; rz: number; spread: number };

// A swept, softly squared ribbon: geometry is generated once, not per frame.
function createRibbon(index: number, mobile: boolean) {
  const segments = mobile ? 120 : 200;
  const sides = 20;
  const positions: number[] = [];
  const indices: number[] = [];
  const signPow = (v: number, p: number) => Math.sign(v) * Math.pow(Math.abs(v), p);
  for (let i = 0; i <= segments; i++) {
    const u = i / segments * Math.PI * 2;
    const radius = 1.23 + .11 * Math.cos(u * 3 + index);
    const twist = .35 * Math.sin(u * 2 + index);
    for (let j = 0; j <= sides; j++) {
      const v = j / sides * Math.PI * 2;
      const crossR = signPow(Math.cos(v), .48) * .24;
      const crossZ = signPow(Math.sin(v), .48) * .135;
      const r = crossR * Math.cos(twist) - crossZ * Math.sin(twist);
      const z = crossR * Math.sin(twist) + crossZ * Math.cos(twist);
      positions.push(Math.cos(u) * (radius + r), Math.sin(u) * (radius + r) * 1.06, .22 * Math.sin(u * 2) + z);
      if (i < segments && j < sides) {
        const a = i * (sides + 1) + j, b = a + sides + 1;
        indices.push(a, b, a + 1, b, b + 1, a + 1);
      }
    }
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return geometry;
}

export function mountSculpture(canvas: HTMLCanvasElement, state: SceneState, onReady: () => void, onFail: () => void) {
  const mobile = matchMedia('(max-width: 700px)').matches;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: !mobile, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(devicePixelRatio, mobile ? 1.25 : 1.65));
  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.2;
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(33, innerWidth / innerHeight, .1, 60);
  camera.position.z = 10;
  const environment = new RoomEnvironment();
  const pmrem = new THREE.PMREMGenerator(renderer);
  const environmentTarget = pmrem.fromScene(environment, .04);
  scene.environment = environmentTarget.texture;
  environment.dispose();
  pmrem.dispose();
  scene.add(new THREE.AmbientLight(0xbec5db, .6));
  const key = new THREE.DirectionalLight(0xf9eee1, 4); key.position.set(-3, 4, 5); scene.add(key);
  const rim = new THREE.DirectionalLight(0x8791ee, 5); rim.position.set(4, 0, -2); scene.add(rim);
  const fill = new THREE.DirectionalLight(0xe8e6ff, 2); fill.position.set(2, -4, 4); scene.add(fill);
  const group = new THREE.Group(); scene.add(group);
  const colors = [0xbfc0c9, 0x747682, 0x404659];
  const ribbons = colors.map((color, index) => {
    const material = new THREE.MeshPhysicalMaterial({ color, metalness: .98, roughness: .2 + index * .025, clearcoat: 1, clearcoatRoughness: .12, envMapIntensity: 1.35, side: THREE.DoubleSide });
    const mesh = new THREE.Mesh(createRibbon(index, mobile), material);
    group.add(mesh);
    return mesh;
  });
  const pointer = new THREE.Vector2();
  const smoothPointer = new THREE.Vector2();
  const velocity = new THREE.Vector2();
  const raycaster = new THREE.Raycaster();
  const rayPointer = new THREE.Vector2();
  let hover = 0, hoverTarget = 0, scroll = window.scrollY, targetScroll = scroll;
  let width = innerWidth, height = innerHeight, frame = 0, elapsed = 0, previous = performance.now(), lastRender = 0;
  let visible = !document.hidden, disposed = false, lost = false, lastMode = '', poses: Pose[] = [], aboutAt = Infinity;
  let resizeTimer: ReturnType<typeof setTimeout>;
  const current: Pose = { at: 0, x: 1.7, y: .12, scale: 1.12, rx: .42, ry: -.42, rz: -.2, spread: .15 };
  const top = (id: string, fallback: number) => document.getElementById(id)?.getBoundingClientRect().top! + window.scrollY || fallback;
  function measure() {
    width = innerWidth; height = innerHeight;
    renderer.setSize(width, height, false); camera.aspect = width / height; camera.updateProjectionMatrix();
    const narrow = width < 700;
    aboutAt = top('about', height * 6);
    poses = [
      { at: 0, x: narrow ? .3 : 1.72, y: narrow ? -.15 : .14, scale: narrow ? .8 : 1.18, rx: .44, ry: -.45, rz: -.28, spread: .16 },
      { at: top('perspective', height) - height * .18, x: narrow ? .55 : 1.35, y: .05, scale: narrow ? .72 : 1.03, rx: 1.1, ry: .45, rz: .6, spread: .9 },
      { at: top('work', height * 2) - height * .25, x: narrow ? 2.1 : 4.5, y: 1.6, scale: .52, rx: 1.5, ry: 1.3, rz: 1.1, spread: .4 },
      { at: top('lab', height * 5) - height * .65, x: narrow ? 1.4 : 3.7, y: .8, scale: .65, rx: .8, ry: 2.5, rz: .3, spread: .25 },
      { at: top('lab', height * 5), x: narrow ? 0 : -1.6, y: narrow ? -.6 : -.15, scale: narrow ? .72 : 1, rx: .3, ry: 2.9, rz: -.35, spread: .16 },
      { at: top('about', height * 6) - height * .2, x: narrow ? 1.7 : 3.6, y: .9, scale: .55, rx: .4, ry: 4, rz: -.8, spread: .5 },
      { at: top('contact', height * 7) - height * .18, x: narrow ? .6 : 1.7, y: narrow ? -.9 : -.1, scale: narrow ? .75 : 1.12, rx: .75, ry: 4.6, rz: .2, spread: .12 },
    ].sort((a,b)=>a.at-b.at);
  }
  const resize = () => { clearTimeout(resizeTimer); resizeTimer = setTimeout(measure, 120); };
  const onScroll = () => { targetScroll = window.scrollY; };
  let rayTime = 0;
  const onPointer = (event: PointerEvent) => {
    if (event.pointerType === 'touch') return;
    pointer.set(event.clientX / width * 2 - 1, -(event.clientY / height * 2 - 1));
    if (performance.now() - rayTime > 70) {
      rayTime = performance.now(); rayPointer.copy(pointer); raycaster.setFromCamera(rayPointer, camera);
      hoverTarget = raycaster.intersectObjects(ribbons, false).length ? 1 : 0;
    }
  };
  const leave = () => { pointer.set(0, 0); hoverTarget = 0; };
  const visibility = () => { visible = !document.hidden; previous = performance.now(); };
  const onLost = (event: Event) => { event.preventDefault(); lost = true; onFail(); };
  const onRestored = () => { lost = false; onReady(); measure(); };
  measure();
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', resize);
  window.addEventListener('pointermove', onPointer, { passive: true });
  document.addEventListener('pointerleave', leave);
  document.addEventListener('visibilitychange', visibility);
  canvas.addEventListener('webglcontextlost', onLost);
  canvas.addEventListener('webglcontextrestored', onRestored);
  const observer = new ResizeObserver(resize); observer.observe(document.body);
  function tick(now: number) {
    if (disposed) return;
    frame = requestAnimationFrame(tick);
    if (!visible || lost) return;
    const stopped = state.paused || reduce.matches;
    if (stopped && Math.abs(targetScroll - scroll) < 1 && lastMode === state.mode) return;
    if (mobile && now - lastRender < 30) return;
    const dt = Math.min((now - previous) / 1000, .04); previous = now; lastRender = now;
    if (!stopped) elapsed += dt;
    const damping = 1 - Math.exp(-dt * 7);
    scroll += (targetScroll - scroll) * (stopped ? 1 : damping);
    if (!stopped) {
      velocity.x += (pointer.x - smoothPointer.x) * .065; velocity.y += (pointer.y - smoothPointer.y) * .065;
      velocity.multiplyScalar(.78); smoothPointer.add(velocity);
    } else { smoothPointer.set(0, 0); velocity.set(0, 0); }
    hover += ((stopped ? 0 : hoverTarget) - hover) * damping;
    let a = poses[0], b = poses[poses.length - 1];
    for (let i = 0; i < poses.length - 1; i++) if (scroll >= poses[i].at && scroll < poses[i+1].at) { a = poses[i]; b = poses[i+1]; break; }
    if (scroll >= poses[poses.length-1].at) a = b;
    let t = Math.max(0, Math.min(1, (scroll-a.at) / Math.max(1,b.at-a.at))); t = t*t*(3-2*t);
    for (const key of ['x','y','scale','rx','ry','rz','spread'] as const) current[key] = a[key] + (b[key] - a[key]) * t;
    const labTop = poses.find(p=>p.ry===2.9)?.at ?? Infinity;
    const labActive = scroll > labTop - height * .25 && scroll < aboutAt - height * .55;
    const expanded = labActive && state.mode === 'exploded';
    const wireframe = labActive && state.mode === 'structure';
    const spread = current.spread + (expanded ? .9 : 0) + hover * .17;
    group.position.set(current.x + smoothPointer.x * .16, current.y + smoothPointer.y * .12, 0);
    group.scale.setScalar(current.scale);
    group.rotation.set(current.rx + smoothPointer.y * .18, current.ry + smoothPointer.x * .24 + Math.sin(elapsed*.18)*.06, current.rz + Math.sin(elapsed*.22)*.035);
    ribbons.forEach((mesh,index) => {
      const material = mesh.material;
      material.wireframe = wireframe;
      material.roughness = wireframe ? .8 : .2 + index*.025;
      const targetX = (index-1) * spread * .95;
      mesh.position.x += (targetX-mesh.position.x) * (stopped?1:damping);
      mesh.position.y += (((index===1?-.1:.12) + (index-1)*spread*.3)-mesh.position.y) * (stopped?1:damping);
      mesh.position.z = (index-1)*.3;
      mesh.rotation.set(index===0?.15:index===1?1.25:-.55, index===0?.1:index===1?.35:1.15, (index-1)*.7 + Math.sin(elapsed*.28+index)*.028);
    });
    renderer.render(scene,camera); lastMode = state.mode;
  }
  renderer.render(scene,camera); onReady(); frame = requestAnimationFrame(tick);
  return () => {
    disposed = true; cancelAnimationFrame(frame); clearTimeout(resizeTimer); observer.disconnect();
    window.removeEventListener('scroll',onScroll); window.removeEventListener('resize',resize); window.removeEventListener('pointermove',onPointer);
    document.removeEventListener('pointerleave',leave); document.removeEventListener('visibilitychange',visibility);
    canvas.removeEventListener('webglcontextlost',onLost); canvas.removeEventListener('webglcontextrestored',onRestored);
    ribbons.forEach(mesh=>{mesh.geometry.dispose();mesh.material.dispose();}); environmentTarget.dispose(); renderer.dispose();
  };
}
