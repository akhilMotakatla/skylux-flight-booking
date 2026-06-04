import {
  Component, OnDestroy, AfterViewInit,
  ElementRef, ViewChild, HostListener, signal
} from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AirportAutocompleteComponent } from '../../shared/components/airport-autocomplete/airport-autocomplete.component';
import { Airport } from '../../core/models/airport.model';
import * as THREE from 'three';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [FormsModule, AirportAutocompleteComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements AfterViewInit, OnDestroy {
  @ViewChild('particleCanvas') particleCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('globeCanvas')    globeCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('fromInput') fromRef!: AirportAutocompleteComponent;
  @ViewChild('toInput')   toRef!: AirportAutocompleteComponent;

  tripType    = signal<'one-way'|'round-trip'>('one-way');
  flightClass = signal('Economy');
  passengers  = signal(1);
  departDate  = signal('');
  returnDate  = signal('');
  fromAirport = signal<Airport | null>(null);
  toAirport   = signal<Airport | null>(null);
  scrollY     = signal(0);

  private renderer!: THREE.WebGLRenderer;
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private globe!: THREE.Mesh;
  private wireGlobe!: THREE.Mesh;
  private animFrameId!: number;
  private pCtx!: CanvasRenderingContext2D;
  private particles: Array<{x:number;y:number;vx:number;vy:number;r:number;op:number;gold:boolean}> = [];
  private pAnimId!: number;

  readonly airlines = [
    { name: 'Emirates' },     { name: 'Qatar Airways' },
    { name: 'Singapore Air' }, { name: 'Lufthansa' },
    { name: 'British Airways' },{ name: 'United Airlines' },
    { name: 'Air France' },    { name: 'Cathay Pacific' },
    { name: 'Turkish Airlines' },{ name: 'Delta' },
    { name: 'Etihad Airways' }, { name: 'American Airlines' }
  ];

  readonly popularRoutes = [
    { from:'New York', to:'London',    fromIata:'JFK', toIata:'LHR', price:299, img:'🗼' },
    { from:'Dubai',    to:'Singapore', fromIata:'DXB', toIata:'SIN', price:199, img:'🌆' },
    { from:'LA',       to:'Tokyo',     fromIata:'LAX', toIata:'NRT', price:449, img:'🗾' },
    { from:'London',   to:'Sydney',    fromIata:'LHR', toIata:'SYD', price:699, img:'🦘' },
    { from:'Paris',    to:'Dubai',     fromIata:'CDG', toIata:'DXB', price:349, img:'🗼' },
    { from:'Singapore',to:'Tokyo',     fromIata:'SIN', toIata:'NRT', price:259, img:'🌸' },
  ] as const;

  constructor(private router: Router) {}

  ngAfterViewInit() {
    this.setMinDate();
    this.initParticles();
    this.initGlobe();
  }

  ngOnDestroy() {
    cancelAnimationFrame(this.animFrameId);
    cancelAnimationFrame(this.pAnimId);
    this.renderer?.dispose();
  }

  @HostListener('window:scroll')
  onScroll() { this.scrollY.set(window.scrollY); }

  @HostListener('window:resize')
  onResize() { this.resizeParticleCanvas(); }

  // ─── Globe ──────────────────────────────────────────────────────────────────
  initGlobe() {
    try {
      const canvas = this.globeCanvas.nativeElement;
      const W = canvas.offsetWidth  || 500;
      const H = canvas.offsetHeight || 500;

      this.renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
      this.renderer.setSize(W, H);
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

      this.scene  = new THREE.Scene();
      this.camera = new THREE.PerspectiveCamera(45, W / H, 0.1, 100);
      this.camera.position.z = 3;

      const geo  = new THREE.SphereGeometry(1, 64, 64);
      const mat  = new THREE.MeshPhongMaterial({ color:0x0d2240, emissive:0x051428, specular:0x1a3a6e, shininess:25 });
      this.globe = new THREE.Mesh(geo, mat);
      this.scene.add(this.globe);

      const wireMat    = new THREE.MeshBasicMaterial({ color:0x1a3a6e, wireframe:true, transparent:true, opacity:0.25 });
      this.wireGlobe   = new THREE.Mesh(new THREE.SphereGeometry(1.001, 20, 20), wireMat);
      this.scene.add(this.wireGlobe);

      const atmMat = new THREE.MeshPhongMaterial({ color:0x1a5fad, transparent:true, opacity:0.1, side:THREE.BackSide });
      this.scene.add(new THREE.Mesh(new THREE.SphereGeometry(1.18, 32, 32), atmMat));

      this.scene.add(new THREE.AmbientLight(0x334466, 1.5));
      const sun = new THREE.DirectionalLight(0xffd080, 2.5);
      sun.position.set(3, 2, 3);
      this.scene.add(sun);

      this.addFlightArcs();

      const animate = () => {
        this.animFrameId = requestAnimationFrame(animate);
        this.globe.rotation.y      += 0.002;
        this.wireGlobe.rotation.y  += 0.002;
        this.renderer.render(this.scene, this.camera);
      };
      animate();
    } catch (e) {
      console.warn('WebGL unavailable, skipping globe:', e);
    }
  }

  private ll2v3(lat: number, lon: number, r = 1): THREE.Vector3 {
    const phi   = (90 - lat) * (Math.PI / 180);
    const theta = (lon + 180) * (Math.PI / 180);
    return new THREE.Vector3(
      -r * Math.sin(phi) * Math.cos(theta),
       r * Math.cos(phi),
       r * Math.sin(phi) * Math.sin(theta)
    );
  }

  private addFlightArcs() {
    const routes: [number,number,number,number][] = [
      [40.64,-73.78, 51.47,-0.45],
      [25.25,55.37,  1.36,103.99],
      [33.94,-118.41, 35.77,140.39],
      [51.47,-0.45, -33.94,151.18],
      [49.01,2.55,   25.25,55.37],
      [37.62,-122.38, 37.46,126.44],
    ];

    routes.forEach(([la1,lo1,la2,lo2]) => {
      const v1  = this.ll2v3(la1, lo1, 1.02);
      const v2  = this.ll2v3(la2, lo2, 1.02);
      const mid = v1.clone().add(v2).multiplyScalar(0.5).normalize().multiplyScalar(1.55);
      const curve = new THREE.QuadraticBezierCurve3(v1, mid, v2);
      const geo = new THREE.BufferGeometry().setFromPoints(curve.getPoints(60));
      this.scene.add(new THREE.Line(geo, new THREE.LineBasicMaterial({ color:0xd4a017, transparent:true, opacity:0.55 })));

      const dot = new THREE.Mesh(
        new THREE.SphereGeometry(0.014, 8, 8),
        new THREE.MeshBasicMaterial({ color:0xf5c842 })
      );
      dot.position.copy(v1);
      this.scene.add(dot);
    });
  }

  // ─── Particles ──────────────────────────────────────────────────────────────
  initParticles() {
    const canvas = this.particleCanvas.nativeElement;
    this.pCtx = canvas.getContext('2d')!;
    this.resizeParticleCanvas();
    for (let i = 0; i < 130; i++) {
      this.particles.push({
        x: Math.random() * canvas.width,  y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3,  vy: (Math.random() - 0.5) * 0.3,
        r: Math.random() * 1.5 + 0.3,
        op: Math.random() * 0.5 + 0.15,
        gold: Math.random() > 0.65
      });
    }
    let tick = 0;
    const draw = () => {
      this.pAnimId = requestAnimationFrame(draw);
      const { width: W, height: H } = canvas;
      this.pCtx.clearRect(0, 0, W, H);
      this.particles.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
        if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
        this.pCtx.beginPath();
        this.pCtx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        this.pCtx.fillStyle = p.gold ? `rgba(212,160,23,${p.op})` : `rgba(255,255,255,${p.op * 0.6})`;
        this.pCtx.fill();
      });
      if (++tick % 200 === 0) this.spawnStreak(W, H);
    };
    draw();
  }

  private spawnStreak(W: number, H: number) {
    const y = Math.random() * H * 0.7, len = 150 + Math.random() * 200;
    let x = -len;
    const step = () => {
      if (x > W + len) return;
      const g = this.pCtx.createLinearGradient(x, y, x + len, y);
      g.addColorStop(0, 'rgba(212,160,23,0)');
      g.addColorStop(0.5, 'rgba(212,160,23,0.35)');
      g.addColorStop(1, 'rgba(212,160,23,0)');
      this.pCtx.strokeStyle = g;
      this.pCtx.lineWidth = 1;
      this.pCtx.beginPath();
      this.pCtx.moveTo(x, y);
      this.pCtx.lineTo(x + len, y);
      this.pCtx.stroke();
      x += 10;
      requestAnimationFrame(step);
    };
    step();
  }

  private resizeParticleCanvas() {
    const c = this.particleCanvas.nativeElement;
    c.width = window.innerWidth; c.height = window.innerHeight;
  }

  // ─── Form ───────────────────────────────────────────────────────────────────
  setMinDate() {
    const d = new Date(); d.setDate(d.getDate() + 1);
    this.departDate.set(d.toISOString().split('T')[0]);
  }

  swapAirports() {
    const f = this.fromAirport(), t = this.toAirport();
    this.fromAirport.set(t); this.toAirport.set(f);
    if (t) this.fromRef.setValue(t.iata, t.city);
    if (f) this.toRef.setValue(f.iata, f.city);
  }

  adjustPassengers(d: number) { this.passengers.update(p => Math.max(1, Math.min(9, p + d))); }

  search() {
    const from = this.fromAirport(), to = this.toAirport();
    if (!from || !to || !this.departDate()) return;
    this.router.navigate(['/flights/search'], { queryParams: {
      from: from.iata, to: to.iata,
      date: this.departDate(),
      passengers: this.passengers(),
      class: this.flightClass()
    }});
  }

  quickSearch(fromIata: string, toIata: string) {
    const d = new Date(); d.setDate(d.getDate() + 7);
    this.router.navigate(['/flights/search'], { queryParams: {
      from: fromIata, to: toIata,
      date: d.toISOString().split('T')[0],
      passengers: 1, class: 'Economy'
    }});
  }
}
