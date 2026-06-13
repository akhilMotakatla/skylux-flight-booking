import { Component, ElementRef, ViewChild, AfterViewInit, OnDestroy, HostListener } from '@angular/core';

interface Airport { code: string; name: string; lon: number; lat: number; }
interface Flight {
  fromIdx: number; toIdx: number;
  progress: number; speed: number;
  trail: Array<{ x: number; y: number }>;
  r: number; g: number; b: number;
}

@Component({
  selector: 'app-airport-background',
  standalone: true,
  template: `<canvas #bgCanvas class="world-map-bg"></canvas>`,
  styles: [`
    .world-map-bg {
      position: fixed; top: 0; left: 0;
      width: 100vw; height: 100vh;
      z-index: -1; pointer-events: none;
      display: block; background: #020814;
    }
  `]
})
export class AirportBackgroundComponent implements AfterViewInit, OnDestroy {
  @ViewChild('bgCanvas') canvasRef!: ElementRef<HTMLCanvasElement>;

  private canvas!: HTMLCanvasElement;
  private ctx!: CanvasRenderingContext2D;
  private staticCanvas!: HTMLCanvasElement;
  private animId!: number;
  private tick = 0;
  private flights: Flight[] = [];

  private readonly AIRPORTS: Airport[] = [
    { code: 'JFK', name: 'New York',     lon: -73.78, lat:  40.64 },
    { code: 'LHR', name: 'London',       lon:  -0.45, lat:  51.47 },
    { code: 'CDG', name: 'Paris',        lon:   2.55, lat:  49.01 },
    { code: 'DXB', name: 'Dubai',        lon:  55.37, lat:  25.25 },
    { code: 'SIN', name: 'Singapore',    lon: 103.99, lat:   1.36 },
    { code: 'NRT', name: 'Tokyo',        lon: 140.39, lat:  35.77 },
    { code: 'LAX', name: 'Los Angeles',  lon:-118.41, lat:  33.94 },
    { code: 'SYD', name: 'Sydney',       lon: 151.18, lat: -33.94 },
    { code: 'HKG', name: 'Hong Kong',    lon: 113.92, lat:  22.31 },
    { code: 'ICN', name: 'Seoul',        lon: 126.45, lat:  37.46 },
    { code: 'BOM', name: 'Mumbai',       lon:  72.87, lat:  19.09 },
    { code: 'GRU', name: 'São Paulo',    lon: -46.47, lat: -23.43 },
    { code: 'JNB', name: 'Johannesburg', lon:  28.25, lat: -26.13 },
    { code: 'YYZ', name: 'Toronto',      lon: -79.63, lat:  43.68 },
    { code: 'ORD', name: 'Chicago',      lon: -87.90, lat:  41.98 },
    { code: 'AMS', name: 'Amsterdam',    lon:   4.76, lat:  52.31 },
    { code: 'IST', name: 'Istanbul',     lon:  28.75, lat:  40.98 },
    { code: 'SVO', name: 'Moscow',       lon:  37.41, lat:  55.97 },
    { code: 'PEK', name: 'Beijing',      lon: 116.58, lat:  40.07 },
    { code: 'DEL', name: 'Delhi',        lon:  77.10, lat:  28.57 },
    { code: 'MIA', name: 'Miami',        lon: -80.29, lat:  25.79 },
    { code: 'MAD', name: 'Madrid',       lon:  -3.57, lat:  40.47 },
    { code: 'DOH', name: 'Doha',         lon:  51.61, lat:  25.27 },
    { code: 'BKK', name: 'Bangkok',      lon: 100.75, lat:  13.69 },
    { code: 'FCO', name: 'Rome',         lon:  12.25, lat:  41.80 },
    { code: 'FRA', name: 'Frankfurt',    lon:   8.57, lat:  50.03 },
    { code: 'CPT', name: 'Cape Town',    lon:  18.60, lat: -33.97 },
    { code: 'MEX', name: 'Mexico City',  lon: -99.07, lat:  19.44 },
    { code: 'KUL', name: 'Kuala Lumpur', lon: 101.71, lat:   2.75 },
    { code: 'CGK', name: 'Jakarta',      lon: 106.65, lat:  -6.13 },
    { code: 'ZRH', name: 'Zurich',       lon:   8.55, lat:  47.46 },
    { code: 'BCN', name: 'Barcelona',    lon:   2.07, lat:  41.30 },
  ];

  // [r, g, b] — gold, cyan, purple, amber, emerald, rose
  private readonly COLORS = [
    [212, 160,  23],
    [ 34, 211, 238],
    [139,  92, 246],
    [245, 158,  11],
    [ 16, 185, 129],
    [248, 113, 113],
  ];

  // Simplified world land masses — each entry is [[lon, lat], ...]
  private readonly LAND: number[][][] = [
    // North America
    [[-168,72],[-162,60],[-152,59],[-147,60],[-136,56],[-132,56],
     [-126,50],[-124,47],[-122,37],[-118,33],[-117,32],[-110,24],
     [-90,16],[-83,10],[-78,8],[-67,12],[-61,11],
     [-65,13],[-67,18],[-78,22],[-82,24],[-82,26],
     [-80,26],[-81,31],[-77,35],[-75,38],[-70,43],[-64,44],
     [-60,46],[-64,46],[-66,47],[-70,48],[-75,47],[-80,47],
     [-84,46],[-88,47],[-90,47],[-97,49],[-110,49],[-123,49],
     [-132,56],[-136,58],[-140,59],[-152,59],[-162,60],[-168,63],[-168,72]],
    // Greenland
    [[-46,84],[-17,83],[-18,77],[-22,71],[-26,70],[-30,72],
     [-44,65],[-52,66],[-55,70],[-53,77],[-46,84]],
    // South America
    [[-78,8],[-66,12],[-61,11],[-52,5],[-50,2],
     [-44,-2],[-35,-5],[-35,-9],[-38,-15],[-38,-20],
     [-41,-22],[-47,-24],[-49,-30],[-52,-34],[-58,-38],
     [-65,-42],[-67,-49],[-69,-55],[-69,-57],
     [-66,-51],[-65,-47],[-70,-42],[-72,-36],
     [-72,-30],[-71,-25],[-70,-18],[-70,-14],[-73,-5],
     [-77,0],[-79,2],[-78,8]],
    // Europe
    [[-10,36],[-7,37],[-9,39],[-9,44],[-2,44],[1,43],[5,43],
     [7,44],[10,44],[13,45],[15,45],[16,47],[19,47],[22,46],
     [25,44],[27,44],[29,46],[29,60],[27,60],[25,65],
     [20,65],[18,70],[14,70],[12,65],[9,63],[5,62],
     [4,58],[5,55],[8,55],[10,55],[12,56],[15,57],[18,58],
     [22,59],[25,60],[26,60],[28,57],[26,55],[22,54],
     [18,54],[14,54],[10,54],[8,55],[4,54],[2,51],
     [-2,51],[-5,48],[-5,44],[-8,42],[-10,40],[-10,36]],
    // Scandinavia
    [[5,58],[6,57],[8,57],[10,58],[12,56],[14,55],[16,55],
     [18,57],[20,60],[22,60],[25,65],[28,69],[30,70],
     [28,72],[25,70],[22,70],[20,70],[18,68],[16,66],
     [14,65],[12,63],[10,63],[8,62],[6,60],[5,58]],
    // Africa
    [[-17,15],[-15,12],[-12,9],[-10,7],[-8,5],[-5,4],
     [-2,5],[2,5],[5,6],[8,4],[10,2],[9,-2],
     [12,-5],[13,-8],[13,-17],[15,-23],[17,-28],[19,-34],
     [22,-34],[26,-34],[30,-30],[34,-24],[37,-17],[40,-10],
     [42,-1],[44,3],[42,12],[40,17],[38,22],[37,27],
     [34,30],[32,30],[25,22],[15,22],[10,22],[5,18],
     [0,15],[-5,15],[-12,15],[-17,15]],
    // Russia + Asia (combined simplified)
    [[30,67],[36,72],[42,70],[50,72],[60,72],[70,73],
     [80,74],[90,78],[100,77],[110,76],[120,73],[130,72],
     [140,70],[145,60],[140,55],[135,47],[130,44],[127,38],
     [130,33],[122,32],[120,24],[110,22],[100,21],[100,13],
     [104,2],[108,-2],[116,-8],[120,-10],[125,-8],
     [130,-2],[135,6],[140,10],[145,15],[150,20],[150,30],
     [140,35],[135,38],[130,42],[130,47],[135,52],[140,56],
     [140,60],[145,60],[150,55],[155,52],[163,58],[170,65],
     [168,72],[160,73],[150,74],[140,74],[130,72],[120,75],
     [110,74],[90,78],[80,74],[70,73],[60,72],[50,72],
     [40,70],[30,67]],
    // Indian Subcontinent
    [[66,24],[68,24],[70,23],[72,22],[74,20],[74,16],
     [76,14],[79,11],[80,9],[78,8],[80,10],[82,14],
     [80,18],[78,22],[76,25],[72,24],[68,24],[66,24]],
    // SE Asia Peninsula
    [[100,20],[104,20],[106,18],[106,15],[104,13],[102,11],
     [100,9],[100,6],[103,4],[104,4],[103,2],[104,0],
     [105,5],[107,12],[108,14],[110,16],[108,18],[106,20],[100,20]],
    // Australia
    [[114,-22],[116,-20],[122,-18],[126,-14],[130,-12],
     [133,-12],[136,-12],[138,-14],[140,-18],[142,-18],
     [144,-14],[146,-16],[148,-20],[150,-22],[152,-24],
     [154,-28],[152,-32],[150,-36],[148,-38],[146,-39],
     [144,-38],[142,-38],[140,-36],[138,-35],[136,-36],
     [132,-32],[130,-30],[128,-33],[122,-34],[120,-34],
     [118,-32],[116,-30],[114,-24],[114,-22]],
    // Japan
    [[130,32],[131,34],[133,35],[136,36],[138,37],
     [140,38],[142,40],[143,42],[144,44],[143,43],
     [141,41],[139,38],[136,35],[134,34],[132,33],[130,32]],
    // UK
    [[-5,50],[-1,50],[2,51],[0,53],[-2,54],[-4,54],
     [-5,56],[-3,58],[-1,59],[0,57],[-1,55],[-3,54],[-3,51],[-5,50]],
    // Ireland
    [[-10,52],[-8,51],[-7,52],[-6,54],[-8,55],[-10,54],[-10,52]],
    // Iceland
    [[-25,64],[-20,63],[-13,63],[-14,65],[-17,66],[-23,66],[-25,64]],
    // Madagascar
    [[44,-12],[47,-12],[50,-18],[50,-24],[46,-25],[44,-22],[44,-12]],
    // Arabian Peninsula
    [[36,30],[38,22],[44,12],[46,15],[50,17],[56,23],[57,26],
     [58,28],[56,30],[52,30],[46,30],[42,30],[36,30]],
    // New Zealand (North Island)
    [[172,-34],[174,-36],[176,-38],[178,-38],[178,-41],
     [175,-42],[172,-40],[170,-38],[172,-34]],
    // Borneo
    [[109,-2],[116,-2],[118,2],[118,7],[116,7],[114,6],[112,4],[109,2],[109,-2]],
    // Sumatra
    [[95,6],[104,4],[107,1],[107,-4],[105,-5],[100,-4],[96,-2],[95,2],[95,6]],
    // Philippines (Luzon)
    [[118,18],[120,18],[122,16],[122,14],[121,12],[120,14],[118,16],[118,18]],
    // Cuba
    [[-85,22],[-82,22],[-76,20],[-74,20],[-77,22],[-82,23],[-85,22]],
    // Sri Lanka
    [[80,10],[81,9],[82,8],[81,7],[80,8],[80,10]],
    // Taiwan
    [[121,25],[122,25],[122,23],[121,22],[120,23],[121,25]],
    // Korea
    [[124,38],[126,36],[128,35],[130,37],[129,38],[127,38],[124,38]],
    // Java
    [[106,-6],[108,-7],[111,-8],[113,-8],[115,-8],[112,-9],[108,-8],[106,-7],[106,-6]],
  ];

  ngAfterViewInit() {
    this.canvas = this.canvasRef.nativeElement;
    this.ctx    = this.canvas.getContext('2d')!;
    this.resize();
    this.buildStaticLayer();
    this.initFlights();
    this.animate();
  }

  ngOnDestroy() { cancelAnimationFrame(this.animId); }

  @HostListener('window:resize')
  onResize() {
    this.resize();
    this.buildStaticLayer();
  }

  private resize() {
    this.canvas.width  = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  private proj(lon: number, lat: number, W: number, H: number) {
    return { x: (lon + 180) / 360 * W, y: (90 - lat) / 180 * H };
  }

  private buildStaticLayer() {
    if (!this.staticCanvas) this.staticCanvas = document.createElement('canvas');
    const W = this.canvas.width, H = this.canvas.height;
    this.staticCanvas.width = W; this.staticCanvas.height = H;
    const ctx = this.staticCanvas.getContext('2d')!;

    // Ocean gradient
    const bg = ctx.createLinearGradient(0, 0, 0, H);
    bg.addColorStop(0,   '#020814');
    bg.addColorStop(0.5, '#030d1c');
    bg.addColorStop(1,   '#010610');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);

    // Faint lat/lon grid
    ctx.lineWidth = 0.4;
    for (let lat = -80; lat <= 80; lat += 20) {
      const y = (90 - lat) / 180 * H;
      ctx.strokeStyle = lat === 0 ? 'rgba(20,80,180,0.2)' : 'rgba(14,48,120,0.1)';
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
    }
    for (let lon = -160; lon <= 160; lon += 20) {
      const x = (lon + 180) / 360 * W;
      ctx.strokeStyle = 'rgba(14,48,120,0.06)';
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
    }

    // Land fill
    this.LAND.forEach(pts => {
      if (pts.length < 3) return;
      ctx.beginPath();
      pts.forEach((pt, i) => {
        const p = this.proj(pt[0], pt[1], W, H);
        i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y);
      });
      ctx.closePath();
      ctx.fillStyle = 'rgba(10,22,46,0.94)';
      ctx.fill();
    });

    // Land border glow
    this.LAND.forEach(pts => {
      if (pts.length < 3) return;
      ctx.beginPath();
      pts.forEach((pt, i) => {
        const p = this.proj(pt[0], pt[1], W, H);
        i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y);
      });
      ctx.closePath();
      ctx.strokeStyle = 'rgba(38,98,220,0.30)';
      ctx.lineWidth = 0.8;
      ctx.stroke();
      // Outer glow pass
      ctx.strokeStyle = 'rgba(60,140,255,0.08)';
      ctx.lineWidth = 3;
      ctx.stroke();
    });

    // Airport dots with glow
    this.AIRPORTS.forEach(ap => {
      const p = this.proj(ap.lon, ap.lat, W, H);
      const grd = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, 8);
      grd.addColorStop(0, 'rgba(212,160,23,0.55)');
      grd.addColorStop(1, 'rgba(212,160,23,0)');
      ctx.beginPath(); ctx.arc(p.x, p.y, 8, 0, Math.PI * 2);
      ctx.fillStyle = grd; ctx.fill();
      ctx.beginPath(); ctx.arc(p.x, p.y, 1.8, 0, Math.PI * 2);
      ctx.fillStyle = '#d4a017'; ctx.fill();
    });
  }

  private initFlights() {
    for (let i = 0; i < 24; i++) this.flights.push(this.newFlight(i / 24));
  }

  private newFlight(startProgress = 0): Flight {
    const col = this.COLORS[Math.floor(Math.random() * this.COLORS.length)];
    let from = Math.floor(Math.random() * this.AIRPORTS.length);
    let to   = Math.floor(Math.random() * this.AIRPORTS.length);
    while (to === from) to = Math.floor(Math.random() * this.AIRPORTS.length);
    return {
      fromIdx: from, toIdx: to,
      progress: startProgress,
      speed: 0.0005 + Math.random() * 0.0007,
      trail: [],
      r: col[0], g: col[1], b: col[2],
    };
  }

  private bezierPt(t: number, from: Airport, to: Airport, W: number, H: number) {
    const p0 = this.proj(from.lon, from.lat, W, H);
    const p2 = this.proj(to.lon,   to.lat,   W, H);
    const dx = p2.x - p0.x, dy = p2.y - p0.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const p1 = { x: (p0.x + p2.x) / 2, y: (p0.y + p2.y) / 2 - dist * 0.3 };
    const mt = 1 - t;
    return {
      x: mt * mt * p0.x + 2 * mt * t * p1.x + t * t * p2.x,
      y: mt * mt * p0.y + 2 * mt * t * p1.y + t * t * p2.y,
    };
  }

  private animate() {
    this.animId = requestAnimationFrame(() => this.animate());
    this.tick++;

    const ctx = this.ctx;
    const W = this.canvas.width, H = this.canvas.height;

    ctx.drawImage(this.staticCanvas, 0, 0);

    this.flights.forEach((f, idx) => {
      f.progress += f.speed;
      const pos = this.bezierPt(Math.min(f.progress, 1),
        this.AIRPORTS[f.fromIdx], this.AIRPORTS[f.toIdx], W, H);

      f.trail.push({ x: pos.x, y: pos.y });
      if (f.trail.length > 55) f.trail.shift();

      // Trail gradient
      for (let i = 1; i < f.trail.length; i++) {
        const alpha = (i / f.trail.length) * 0.6;
        ctx.beginPath();
        ctx.moveTo(f.trail[i - 1].x, f.trail[i - 1].y);
        ctx.lineTo(f.trail[i].x,     f.trail[i].y);
        ctx.strokeStyle = `rgba(${f.r},${f.g},${f.b},${alpha.toFixed(2)})`;
        ctx.lineWidth   = 1.4;
        ctx.stroke();
      }

      // Head dot + glow
      const last = f.trail[f.trail.length - 1];
      if (last) {
        const grd = ctx.createRadialGradient(last.x, last.y, 0, last.x, last.y, 14);
        grd.addColorStop(0, `rgba(${f.r},${f.g},${f.b},0.8)`);
        grd.addColorStop(1, `rgba(${f.r},${f.g},${f.b},0)`);
        ctx.beginPath(); ctx.arc(last.x, last.y, 14, 0, Math.PI * 2);
        ctx.fillStyle = grd; ctx.fill();
        ctx.beginPath(); ctx.arc(last.x, last.y, 2.8, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,0.9)`; ctx.fill();
      }

      if (f.progress >= 1) this.flights[idx] = this.newFlight();
    });

    // Animated airport pulse rings
    const t = this.tick * 0.018;
    this.AIRPORTS.forEach((ap, i) => {
      if ((i + this.tick) % 5 !== 0) return;
      const p = this.proj(ap.lon, ap.lat, W, H);
      const pulse = (Math.sin(t + i * 0.97) * 0.5 + 0.5);
      ctx.beginPath();
      ctx.arc(p.x, p.y, 5 + pulse * 9, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(212,160,23,${(0.22 * (1 - pulse)).toFixed(2)})`;
      ctx.lineWidth = 1; ctx.stroke();
    });
  }
}
