import { Component, ElementRef, ViewChild, AfterViewInit, OnDestroy, HostListener } from '@angular/core';
import * as THREE from 'three';

@Component({
  selector: 'app-airport-background',
  standalone: true,
  template: `<canvas #bgCanvas class="airport-bg"></canvas>`,
  styles: [`
    .airport-bg {
      position: fixed; top: 0; left: 0;
      width: 100vw; height: 100vh;
      z-index: 0; pointer-events: none;
      display: block;
    }
  `]
})
export class AirportBackgroundComponent implements AfterViewInit, OnDestroy {
  @ViewChild('bgCanvas') canvasRef!: ElementRef<HTMLCanvasElement>;

  private renderer!: THREE.WebGLRenderer;
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private clock = new THREE.Clock();
  private animId!: number;

  private plane1!: THREE.Group;
  private plane2!: THREE.Group;
  private beaconMeshes: THREE.Mesh[] = [];
  private runwayLights: THREE.Mesh[] = [];
  private stars!: THREE.Points;

  ngAfterViewInit() { this.init(); }
  ngOnDestroy() { cancelAnimationFrame(this.animId); this.renderer?.dispose(); }

  @HostListener('window:resize') onResize() {
    if (!this.renderer) return;
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  private init() {
    const canvas = this.canvasRef.nativeElement;
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: false });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));

    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(0x05080f, 0.012);
    this.scene.background = new THREE.Color(0x050810);

    this.camera = new THREE.PerspectiveCamera(72, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.camera.position.set(0, 3, 22);
    this.camera.lookAt(0, 6, 0);

    this.buildSky();
    this.buildGround();
    this.buildRunway();
    this.buildTerminals();
    this.buildControlTower();
    this.buildCityLine();
    this.buildStars();
    this.buildMoon();
    this.buildLights();

    this.plane1 = this.makePlane(1.0);
    this.scene.add(this.plane1);
    this.plane2 = this.makePlane(0.85);
    this.plane2.rotation.y = Math.PI;
    this.scene.add(this.plane2);

    const loop = () => {
      this.animId = requestAnimationFrame(loop);
      this.tick();
      this.renderer.render(this.scene, this.camera);
    };
    loop();
  }

  // ── Sky dome ───────────────────────────────────────────────────────────────
  private buildSky() {
    const geo = new THREE.SphereGeometry(500, 16, 10);
    const pos = geo.attributes['position'];
    const cols = new Float32Array(pos.count * 3);
    for (let i = 0; i < pos.count; i++) {
      const y = (pos.getY(i) + 500) / 1000;
      // Deep navy at top → purple-teal horizon
      cols[i*3]   = THREE.MathUtils.lerp(0.22, 0.02, y); // R
      cols[i*3+1] = THREE.MathUtils.lerp(0.08, 0.03, y); // G
      cols[i*3+2] = THREE.MathUtils.lerp(0.20, 0.10, y); // B
    }
    geo.setAttribute('color', new THREE.BufferAttribute(cols, 3));
    geo.scale(-1,1,1);
    this.scene.add(new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ vertexColors: true, side: THREE.BackSide })));
  }

  // ── Ground ─────────────────────────────────────────────────────────────────
  private buildGround() {
    const g = new THREE.PlaneGeometry(600, 600);
    const m = new THREE.MeshLambertMaterial({ color: 0x080c12 });
    const mesh = new THREE.Mesh(g, m);
    mesh.rotation.x = -Math.PI/2;
    this.scene.add(mesh);
  }

  // ── Runway ─────────────────────────────────────────────────────────────────
  private buildRunway() {
    // Runway surface
    const rwy = new THREE.Mesh(
      new THREE.PlaneGeometry(20, 500),
      new THREE.MeshLambertMaterial({ color: 0x181818 })
    );
    rwy.rotation.x = -Math.PI/2; rwy.position.y = 0.01;
    this.scene.add(rwy);

    // Center dashes
    const dashM = new THREE.MeshBasicMaterial({ color: 0xffffff });
    for (let z = -230; z < 22; z += 14) {
      const d = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.01, 7), dashM);
      d.position.set(0, 0.02, z);
      this.scene.add(d);
    }

    // Threshold stripes
    const tM = new THREE.MeshBasicMaterial({ color: 0xffffff });
    for (let x = -8; x <= 8; x += 2.8) {
      const t = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.01, 8), tM);
      t.position.set(x, 0.02, 14);
      this.scene.add(t);
    }

    // Edge lights
    const eM = new THREE.MeshBasicMaterial({ color: 0xffeedd });
    for (let z = -230; z < 15; z += 9) {
      [-10.5, 10.5].forEach(lx => {
        const l = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.15, 6), eM);
        l.position.set(lx, 0.08, z);
        this.scene.add(l);
        this.runwayLights.push(l);
      });
    }

    // Taxiway blue edge lights
    const bM = new THREE.MeshBasicMaterial({ color: 0x3366ff });
    for (let z = -200; z < 0; z += 18) {
      [-13.5, 13.5].forEach(lx => {
        const l = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.12, 6), bM);
        l.position.set(lx, 0.06, z);
        this.scene.add(l);
      });
    }

    // Approach light bars
    const appM = new THREE.MeshBasicMaterial({ color: 0xff4400 });
    const appW = new THREE.MeshBasicMaterial({ color: 0xffffff });
    [0,1,2,3].forEach(i => {
      const l = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.3, 0.3), i < 2 ? appM : appW);
      l.position.set(-15.5 + i * 1.4, 0.15, 14.5);
      this.scene.add(l);
    });
  }

  // ── Terminals ──────────────────────────────────────────────────────────────
  private buildTerminals() {
    this.addTerminal(-58, 7, -25, 42, 14, 16);
    this.addTerminal( 60, 7, -35, 38, 14, 16);
    this.addTerminal(-65, 5,  5,  22, 10, 18);

    // Parked aircraft
    [[-55,0,-8,0.4],[-63,0,5,0.35],[58,0,-4,0.4]] .forEach(([x,y,z,s]) => {
      const p = this.makePlane(s as number);
      p.position.set(x as number, y as number, z as number);
      p.rotation.y = Math.random() * Math.PI * 0.4 - 0.2;
      this.scene.add(p);
    });
  }

  private addTerminal(cx: number, cy: number, cz: number, w: number, h: number, d: number) {
    const g = new THREE.Group();

    const body = new THREE.Mesh(
      new THREE.BoxGeometry(w, h, d),
      new THREE.MeshLambertMaterial({ color: 0x111828 })
    );
    g.add(body);

    // Glass facade
    g.add(Object.assign(new THREE.Mesh(
      new THREE.BoxGeometry(w, h * 0.85, 0.2),
      new THREE.MeshLambertMaterial({ color: 0x0a1535, transparent: true, opacity: 0.85 })
    ), { position: new THREE.Vector3(0, 0, d/2 + 0.1) }));

    // Window grid
    const litM  = new THREE.MeshBasicMaterial({ color: 0xffdc80 });
    const darkM = new THREE.MeshBasicMaterial({ color: 0x1a2d50 });
    const cols = Math.floor(w / 3.2), rows = Math.floor(h / 2.8);
    for (let c = 0; c < cols; c++) {
      for (let r = 0; r < rows; r++) {
        const lit = Math.random() > 0.3;
        const win = new THREE.Mesh(new THREE.PlaneGeometry(1.8, 1.5), lit ? litM : darkM);
        win.position.set(-w/2 + 2 + c * 3.2, -h/2 + 2 + r * 2.8, d/2 + 0.22);
        g.add(win);
      }
    }

    // Roof
    g.add(Object.assign(new THREE.Mesh(
      new THREE.BoxGeometry(w + 2, 1.2, d + 0.5),
      new THREE.MeshLambertMaterial({ color: 0x0a1020 })
    ), { position: new THREE.Vector3(0, h/2 + 0.6, 0) }));

    // Jetways
    for (let j = -w/3; j <= w/3; j += w/3) {
      const jw = new THREE.Mesh(
        new THREE.BoxGeometry(1.8, 2.5, d * 0.7),
        new THREE.MeshLambertMaterial({ color: 0x1a2a40 })
      );
      jw.position.set(j, -0.5, d * 0.65);
      g.add(jw);
    }

    g.position.set(cx, cy, cz);
    this.scene.add(g);
  }

  // ── Control Tower ──────────────────────────────────────────────────────────
  private buildControlTower() {
    const g = new THREE.Group();

    g.add(Object.assign(new THREE.Mesh(
      new THREE.CylinderGeometry(1.6, 2.2, 24, 8),
      new THREE.MeshLambertMaterial({ color: 0x162036 })
    )));

    const cab = new THREE.Mesh(
      new THREE.CylinderGeometry(3.2, 2.8, 4.5, 10),
      new THREE.MeshLambertMaterial({ color: 0x0c1a30 })
    );
    cab.position.y = 14;
    g.add(cab);

    const cabGlass = new THREE.Mesh(
      new THREE.CylinderGeometry(3.1, 2.75, 3.5, 10),
      new THREE.MeshBasicMaterial({ color: 0xff9933, transparent: true, opacity: 0.65 })
    );
    cabGlass.position.y = 14;
    g.add(cabGlass);

    const beaconGeo = new THREE.SphereGeometry(0.35, 8, 6);
    const beaconMat = new THREE.MeshBasicMaterial({ color: 0xff1100, transparent: true });
    const beacon = new THREE.Mesh(beaconGeo, beaconMat);
    beacon.position.y = 18.5;
    g.add(beacon);
    this.beaconMeshes.push(beacon);

    const ant = new THREE.Mesh(
      new THREE.CylinderGeometry(0.06, 0.06, 5, 4),
      new THREE.MeshBasicMaterial({ color: 0x888888 })
    );
    ant.position.y = 22;
    g.add(ant);

    g.position.set(-44, 0, -22);
    this.scene.add(g);
  }

  // ── City skyline in distance ────────────────────────────────────────────────
  private buildCityLine() {
    const buildings = [
      {x:-130,h:32,w:9},{x:-115,h:50,w:6},{x:-100,h:28,w:11},{x:-88,h:60,w:5},
      {x:-78,h:38,w:7},{x:-68,h:22,w:12},{x:68,h:45,w:6},{x:80,h:55,w:5},
      {x:92,h:30,w:9},{x:104,h:48,w:6},{x:116,h:38,w:7},{x:128,h:65,w:4},
    ];
    buildings.forEach(b => {
      const bGeo = new THREE.BoxGeometry(b.w, b.h, b.w * 0.9);
      const bMat = new THREE.MeshLambertMaterial({ color: 0x0a1018 });
      const bld = new THREE.Mesh(bGeo, bMat);
      bld.position.set(b.x, b.h / 2, -130);
      this.scene.add(bld);
      // Lit windows
      const litM  = [
        new THREE.MeshBasicMaterial({ color: 0xffe880 }),
        new THREE.MeshBasicMaterial({ color: 0x99bbff }),
      ];
      for (let r = 1; r < Math.floor(b.h / 4); r++) {
        if (Math.random() > 0.4) {
          const win = new THREE.Mesh(new THREE.PlaneGeometry(1.4, 1.2), litM[Math.floor(Math.random()*2)]);
          win.position.set(b.x + (Math.random()-0.5)*(b.w-1.5), r*4 - b.h/2 + 1, -130 + b.w*0.5 + 0.1);
          this.scene.add(win);
        }
      }
    });
  }

  // ── Stars ─────────────────────────────────────────────────────────────────
  private buildStars() {
    const n = 2500;
    const pos = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi   = Math.acos(Math.random() * 0.75);
      const r     = 380 + Math.random() * 60;
      pos[i*3]   = r * Math.sin(phi) * Math.cos(theta);
      pos[i*3+1] = r * Math.cos(phi);
      pos[i*3+2] = r * Math.sin(phi) * Math.sin(theta);
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    this.stars = new THREE.Points(geo, new THREE.PointsMaterial({
      color: 0xffffff, size: 0.9, sizeAttenuation: false, transparent: true, opacity: 0.75
    }));
    this.scene.add(this.stars);
  }

  // ── Moon ──────────────────────────────────────────────────────────────────
  private buildMoon() {
    const moon = new THREE.Mesh(
      new THREE.SphereGeometry(9, 18, 14),
      new THREE.MeshBasicMaterial({ color: 0xddd8c0 })
    );
    moon.position.set(-160, 130, -320);
    this.scene.add(moon);

    const halo = new THREE.Mesh(
      new THREE.SphereGeometry(14, 16, 12),
      new THREE.MeshBasicMaterial({ color: 0xb8b0a0, transparent: true, opacity: 0.12, side: THREE.BackSide })
    );
    halo.position.copy(moon.position);
    this.scene.add(halo);

    const moonLight = new THREE.DirectionalLight(0x8899cc, 0.45);
    moonLight.position.copy(moon.position);
    this.scene.add(moonLight);
  }

  // ── Lights ────────────────────────────────────────────────────────────────
  private buildLights() {
    this.scene.add(new THREE.AmbientLight(0x091424, 2.2));
    const rL = new THREE.PointLight(0xff9944, 1.2, 50);
    rL.position.set(0, 1.5, 0);
    this.scene.add(rL);
    const tL = new THREE.PointLight(0xffe880, 1.5, 80);
    tL.position.set(-58, 10, -22);
    this.scene.add(tL);
    const tR = new THREE.PointLight(0xffe880, 1.2, 75);
    tR.position.set(60, 10, -30);
    this.scene.add(tR);
  }

  // ── Plane mesh factory ────────────────────────────────────────────────────
  private makePlane(scale: number): THREE.Group {
    const g = new THREE.Group();
    const w = new THREE.MeshLambertMaterial({ color: 0xe8edf2 });
    const gr = new THREE.MeshLambertMaterial({ color: 0x556677 });
    const nv = new THREE.MeshLambertMaterial({ color: 0x1a3a6e });

    // Fuselage
    const f = new THREE.Mesh(new THREE.CylinderGeometry(0.52, 0.46, 9, 12), w);
    f.rotation.z = Math.PI/2;
    g.add(f);
    // Nose
    const n = new THREE.Mesh(new THREE.ConeGeometry(0.46, 1.8, 10), w);
    n.rotation.z = -Math.PI/2; n.position.set(5.3, 0, 0);
    g.add(n);
    // Tail cone
    const tc = new THREE.Mesh(new THREE.ConeGeometry(0.46, 2.2, 10), w);
    tc.rotation.z = Math.PI/2; tc.position.set(-5.5, 0, 0);
    g.add(tc);
    // Wings
    const wing = new THREE.Mesh(new THREE.BoxGeometry(11, 0.1, 2), w);
    wing.position.set(0.5, -0.1, 0);
    g.add(wing);
    // Winglets
    [-5.6, 5.6].forEach(x => {
      const wl = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.6, 0.65), nv);
      wl.position.set(x, 0.25, 0);
      g.add(wl);
    });
    // H-stabiliser
    const hs = new THREE.Mesh(new THREE.BoxGeometry(4.5, 0.07, 1), w);
    hs.position.set(-5, 0.1, 0);
    g.add(hs);
    // V-stabiliser
    const vs = new THREE.Mesh(new THREE.BoxGeometry(0.1, 1.4, 1.6), nv);
    vs.position.set(-4.8, 0.8, 0);
    g.add(vs);
    // Engines
    [-2.2, 2.2].forEach(ex => {
      const eng = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.28, 2, 10), gr);
      eng.rotation.z = Math.PI/2; eng.position.set(ex, -0.5, 0.55);
      g.add(eng);
      const intake = new THREE.Mesh(new THREE.CylinderGeometry(0.33, 0.33, 0.12, 10),
        new THREE.MeshBasicMaterial({ color: 0x111111 }));
      intake.rotation.z = Math.PI/2; intake.position.set(ex + 1.05, -0.5, 0.55);
      g.add(intake);
    });
    // Livery stripe
    const stripe = new THREE.Mesh(new THREE.BoxGeometry(8, 0.09, 1.05), nv);
    stripe.position.set(0, 0.5, 0);
    g.add(stripe);
    // Nav lights
    [[-5.7,0xee0000],[ 5.7,0x00ee00],[-6.5,0xffffff]].forEach(([x,c]) => {
      const l = new THREE.Mesh(new THREE.SphereGeometry(0.09,6,4),
        new THREE.MeshBasicMaterial({ color: c as number }));
      l.position.set(x as number, 0, 0);
      g.add(l);
    });
    g.scale.setScalar(scale);
    return g;
  }

  // ── Animation tick ─────────────────────────────────────────────────────────
  private tick() {
    const t = this.clock.getElapsedTime();

    // Beacon blink
    this.beaconMeshes.forEach(b => {
      (b.material as THREE.MeshBasicMaterial).opacity = Math.sin(t * Math.PI * 1.4) > 0.7 ? 1 : 0.05;
    });

    // Runway light shimmer
    this.runwayLights.forEach((l, i) => {
      const s = 0.72 + Math.sin(t * 1.4 + i * 0.18) * 0.28;
      (l.material as THREE.MeshBasicMaterial).color.setRGB(s, s*0.93, s*0.86);
    });

    // Stars twinkle
    if (this.stars) (this.stars.material as THREE.PointsMaterial).opacity = 0.55 + Math.sin(t*0.25)*0.2;

    // Plane 1 — TAKEOFF (28s loop)
    const s1 = t % 28;
    if (this.plane1) {
      this.plane1.visible = true;
      if (s1 < 5) {
        const p = s1 / 5;
        this.plane1.position.set(1.5, 0.55, 20 - p * 50);
        this.plane1.rotation.set(0,0,0);
      } else if (s1 < 11) {
        const p = (s1-5)/6;
        this.plane1.position.set(1.5, 0.55 + p*p*28, -30 - p*55);
        this.plane1.rotation.set(p*0.22, 0, 0);
      } else if (s1 < 23) {
        const p = (s1-11)/12;
        this.plane1.position.set(1.5 + p*20, 28 + p*70, -85 - p*160);
        this.plane1.rotation.set(0.2-p*0.2, 0, Math.sin(p*Math.PI)*0.12);
        this.plane1.visible = p < 0.88;
      } else { this.plane1.visible = false; }
      if (s1 > 26 && !this.plane1.visible) {
        this.plane1.position.set(1.5, 0.55, 20);
        this.plane1.rotation.set(0,0,0);
      }
    }

    // Plane 2 — LANDING (38s loop, offset 18s)
    const s2 = (t + 18) % 38;
    if (this.plane2) {
      if (s2 < 14) {
        const p = s2 / 14;
        this.plane2.position.set(-2, 42-p*32, -220+p*130);
        this.plane2.rotation.set(0.1, Math.PI, 0);
        this.plane2.visible = true;
      } else if (s2 < 20) {
        const p = (s2-14)/6;
        this.plane2.position.set(-2, 10-p*9.5, -90+p*100);
        this.plane2.rotation.set(0.06-p*0.06, Math.PI, 0);
        this.plane2.visible = true;
      } else if (s2 < 24) {
        const p = (s2-20)/4;
        this.plane2.position.set(-2, 0.55, 10+p*18);
        this.plane2.rotation.set(0, Math.PI, 0);
        this.plane2.visible = true;
      } else { this.plane2.visible = false; }
    }

    // Slow camera sway
    this.camera.position.x = Math.sin(t * 0.06) * 1.2;
    this.camera.position.y = 3 + Math.sin(t * 0.1) * 0.4;
  }
}
