import { Component, Input, OnChanges, AfterViewInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import * as THREE from 'three';

const MESSAGES = [
  { text: "Welcome aboard! ✈\nI'm Aria, your SkyLux\ntravel guide. Let's get\nyou booked in style!", anim: 'wave' },
  { text: "Choose your seat! 💺\nWindow seats have\namazing views. Exit rows\noffer extra legroom!", anim: 'point' },
  { text: "Passenger details 📋\nPlease enter names\nexactly as they appear\non your passport.", anim: 'nod' },
  { text: "Secure payment 🔒\nYour card details are\nencrypted with 256-bit\nSSL — completely safe!", anim: 'thumbsup' },
  { text: "You're all set! 🎉\nHave a wonderful\njourney! Bon voyage\nfrom all of us at SkyLux!", anim: 'celebrate' },
];

@Component({
  selector: 'app-air-hostess',
  standalone: true,
  template: `
    <div class="hostess-wrap">
      <canvas #hCanvas class="hostess-canvas"></canvas>
      <div class="speech-bubble" [class.visible]="bubbleVisible">
        <div class="bubble-header">
          <div class="bubble-avatar">A</div>
          <span class="bubble-name">Aria · SkyLux</span>
          <span class="bubble-dot"></span>
        </div>
        <div class="bubble-text">{{ currentText }}</div>
        <div class="bubble-tail"></div>
      </div>
    </div>
  `,
  styleUrl: './air-hostess.component.scss'
})
export class AirHostessComponent implements AfterViewInit, OnChanges, OnDestroy {
  @Input() step = 0;
  @ViewChild('hCanvas') canvasRef!: ElementRef<HTMLCanvasElement>;

  currentText = '';
  bubbleVisible = false;

  private renderer!: THREE.WebGLRenderer;
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private clock = new THREE.Clock();
  private animId!: number;
  private hostess!: THREE.Group;

  // Animated parts
  private rightArm!: THREE.Group;
  private leftArm!: THREE.Group;
  private head!: THREE.Mesh;
  private body!: THREE.Group;

  private animState = 'wave';
  private animTime = 0;

  ngAfterViewInit() {
    this.initScene();
    this.setStep(this.step);
  }

  ngOnChanges() {
    if (this.renderer) this.setStep(this.step);
  }

  ngOnDestroy() {
    cancelAnimationFrame(this.animId);
    this.renderer?.dispose();
  }

  private setStep(s: number) {
    const msg = MESSAGES[Math.min(s, MESSAGES.length - 1)];
    this.currentText = msg.text;
    this.animState = msg.anim;
    this.animTime = 0;
    this.bubbleVisible = false;
    setTimeout(() => (this.bubbleVisible = true), 200);
  }

  private initScene() {
    const canvas = this.canvasRef.nativeElement;
    const W = 220, H = 420;
    canvas.width = W; canvas.height = H;

    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    this.renderer.setSize(W, H);
    this.renderer.setClearColor(0x000000, 0);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    this.scene = new THREE.Scene();

    this.camera = new THREE.PerspectiveCamera(42, W / H, 0.1, 100);
    this.camera.position.set(0, 0.5, 9);
    this.camera.lookAt(0, 0.5, 0);

    // Lights
    this.scene.add(new THREE.AmbientLight(0xffeedd, 1.8));
    const key = new THREE.DirectionalLight(0xfff0e0, 2.2);
    key.position.set(2, 4, 5);
    this.scene.add(key);
    const fill = new THREE.DirectionalLight(0x8899cc, 0.8);
    fill.position.set(-3, 1, 2);
    this.scene.add(fill);
    const back = new THREE.DirectionalLight(0xd4a017, 0.6);
    back.position.set(0, 2, -4);
    this.scene.add(back);

    this.buildHostess();

    const loop = () => {
      this.animId = requestAnimationFrame(loop);
      this.animate();
      this.renderer.render(this.scene, this.camera);
    };
    loop();
  }

  private buildHostess() {
    this.hostess = new THREE.Group();

    const skin  = new THREE.MeshPhongMaterial({ color: 0xfdbcb4, shininess: 30 });
    const navy  = new THREE.MeshPhongMaterial({ color: 0x0d2252, shininess: 60 });
    const gold  = new THREE.MeshPhongMaterial({ color: 0xd4a017, shininess: 80 });
    const dark  = new THREE.MeshPhongMaterial({ color: 0x1a0c08 }); // hair
    const white = new THREE.MeshPhongMaterial({ color: 0xfafafa });
    const black = new THREE.MeshPhongMaterial({ color: 0x111111 });
    const lips  = new THREE.MeshPhongMaterial({ color: 0xc04040 });

    // ── Shoes ───────────────────────────────────────────────────────────
    [-0.22, 0.22].forEach(x => {
      const shoe = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.14, 0.38), black);
      shoe.position.set(x, -2.8, 0.06);
      this.hostess.add(shoe);
      const heel = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.04, 0.35, 6), black);
      heel.position.set(x, -2.72, -0.14);
      this.hostess.add(heel);
    });

    // ── Legs (stockings) ────────────────────────────────────────────────
    const legMat = new THREE.MeshPhongMaterial({ color: 0xc8a090 });
    [-0.22, 0.22].forEach(x => {
      const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.10, 0.85, 10), legMat);
      leg.position.set(x, -2.25, 0);
      this.hostess.add(leg);
    });

    // ── Skirt ────────────────────────────────────────────────────────────
    const skirt = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.32, 0.75, 12), navy);
    skirt.position.set(0, -1.65, 0);
    this.hostess.add(skirt);

    // ── Torso ────────────────────────────────────────────────────────────
    this.body = new THREE.Group();
    const torso = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.36, 1.1, 12), navy);
    torso.position.set(0, -1.05, 0);
    this.body.add(torso);

    // Belt buckle
    const buckle = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.12, 0.08), gold);
    buckle.position.set(0, -1.5, 0.33);
    this.body.add(buckle);

    // Jacket lapels
    [-0.12, 0.12].forEach(x => {
      const lapel = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.48, 0.08), navy);
      lapel.position.set(x, -0.85, 0.3);
      this.body.add(lapel);
    });

    // Blouse / white shirt
    const blouse = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.5, 0.08), white);
    blouse.position.set(0, -0.9, 0.34);
    this.body.add(blouse);

    // Neck scarf (gold)
    const scarf = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.22, 0.07), gold);
    scarf.position.set(0, -0.6, 0.35);
    this.body.add(scarf);

    // Name badge
    const badge = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.08, 0.04), gold);
    badge.position.set(0.18, -0.9, 0.38);
    this.body.add(badge);

    // Shoulders
    const shoulder = new THREE.Mesh(new THREE.BoxGeometry(0.88, 0.14, 0.38), navy);
    shoulder.position.set(0, -0.48, 0);
    this.body.add(shoulder);

    // ── Left Arm ─────────────────────────────────────────────────────────
    this.leftArm = new THREE.Group();
    this.leftArm.position.set(-0.5, -0.5, 0);
    const lUpper = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.09, 0.65, 10), navy);
    lUpper.position.set(0, -0.35, 0); lUpper.rotation.z = 0.15;
    this.leftArm.add(lUpper);
    const lLower = new THREE.Mesh(new THREE.CylinderGeometry(0.085, 0.075, 0.6, 10), skin);
    lLower.position.set(-0.04, -0.98, 0); lLower.rotation.z = 0.1;
    this.leftArm.add(lLower);
    const lHand = new THREE.Mesh(new THREE.SphereGeometry(0.1, 8, 6), skin);
    lHand.position.set(-0.08, -1.3, 0);
    this.leftArm.add(lHand);
    this.body.add(this.leftArm);

    // ── Right Arm ─────────────────────────────────────────────────────────
    this.rightArm = new THREE.Group();
    this.rightArm.position.set(0.5, -0.5, 0);
    const rUpper = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.09, 0.65, 10), navy);
    rUpper.position.set(0, -0.35, 0); rUpper.rotation.z = -0.15;
    this.rightArm.add(rUpper);
    const rLower = new THREE.Mesh(new THREE.CylinderGeometry(0.085, 0.075, 0.6, 10), skin);
    rLower.position.set(0.04, -0.98, 0); rLower.rotation.z = -0.1;
    this.rightArm.add(rLower);
    const rHand = new THREE.Mesh(new THREE.SphereGeometry(0.1, 8, 6), skin);
    rHand.position.set(0.08, -1.3, 0);
    this.rightArm.add(rHand);
    this.body.add(this.rightArm);

    this.hostess.add(this.body);

    // ── Neck ─────────────────────────────────────────────────────────────
    const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.13, 0.28, 10), skin);
    neck.position.set(0, -0.24, 0);
    this.hostess.add(neck);

    // ── Head ─────────────────────────────────────────────────────────────
    this.head = new THREE.Mesh(new THREE.SphereGeometry(0.35, 20, 16), skin) as THREE.Mesh;
    this.head.position.set(0, 0.15, 0);
    this.head.scale.set(0.95, 1.05, 0.92);
    this.hostess.add(this.head);

    // Eyes
    [-0.12, 0.12].forEach(x => {
      const eyeW = new THREE.Mesh(new THREE.SphereGeometry(0.072, 10, 8), white);
      eyeW.position.set(x, 0.2, 0.3); eyeW.scale.set(1, 0.85, 0.7);
      this.hostess.add(eyeW);
      const iris = new THREE.Mesh(new THREE.SphereGeometry(0.045, 8, 6),
        new THREE.MeshPhongMaterial({ color: 0x3d2b1f }));
      iris.position.set(x, 0.2, 0.34);
      this.hostess.add(iris);
      const pupil = new THREE.Mesh(new THREE.SphereGeometry(0.025, 6, 4),
        new THREE.MeshPhongMaterial({ color: 0x050505 }));
      pupil.position.set(x, 0.2, 0.37);
      this.hostess.add(pupil);
      // Lashes
      const lash = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.012, 0.02), dark);
      lash.position.set(x, 0.255, 0.34);
      this.hostess.add(lash);
    });

    // Eyebrows
    [-0.12, 0.12].forEach(x => {
      const brow = new THREE.Mesh(new THREE.BoxGeometry(0.13, 0.02, 0.02), dark);
      brow.position.set(x, 0.28, 0.32);
      brow.rotation.z = x > 0 ? -0.12 : 0.12;
      this.hostess.add(brow);
    });

    // Nose
    const nose = new THREE.Mesh(new THREE.SphereGeometry(0.035, 8, 6), skin);
    nose.position.set(0, 0.1, 0.34); nose.scale.set(1, 0.7, 0.9);
    this.hostess.add(nose);

    // Lips
    const lipTop = new THREE.Mesh(new THREE.BoxGeometry(0.13, 0.03, 0.03), lips);
    lipTop.position.set(0, 0.02, 0.34);
    this.hostess.add(lipTop);
    const lipBot = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.04, 0.03), lips);
    lipBot.position.set(0, -0.02, 0.34);
    this.hostess.add(lipBot);

    // Cheeks (blush)
    [-0.19, 0.19].forEach(x => {
      const cheek = new THREE.Mesh(new THREE.CircleGeometry(0.07, 10),
        new THREE.MeshBasicMaterial({ color: 0xffaaaa, transparent: true, opacity: 0.35 }));
      cheek.position.set(x, 0.09, 0.34);
      this.hostess.add(cheek);
    });

    // ── Hair ────────────────────────────────────────────────────────────
    const hairTop = new THREE.Mesh(new THREE.SphereGeometry(0.37, 16, 10), dark);
    hairTop.position.set(0, 0.28, -0.04); hairTop.scale.set(0.97, 0.7, 0.95);
    this.hostess.add(hairTop);
    // Side hair
    [-1, 1].forEach(s => {
      const sH = new THREE.Mesh(new THREE.SphereGeometry(0.18, 10, 8), dark);
      sH.position.set(s * 0.32, 0.1, 0.02);
      this.hostess.add(sH);
    });
    // Back hair (bun)
    const bun = new THREE.Mesh(new THREE.SphereGeometry(0.22, 10, 8), dark);
    bun.position.set(0, 0.15, -0.3); bun.scale.set(0.9, 0.85, 0.8);
    this.hostess.add(bun);
    // Fringe
    const fringe = new THREE.Mesh(new THREE.BoxGeometry(0.52, 0.12, 0.12), dark);
    fringe.position.set(0, 0.44, 0.2); fringe.rotation.x = -0.3;
    this.hostess.add(fringe);

    // ── Airline Cap ─────────────────────────────────────────────────────
    const capTop = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.3, 0.14, 12), navy);
    capTop.position.set(0, 0.55, 0.04);
    this.hostess.add(capTop);
    const capBrim = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.38, 0.05, 12), navy);
    capBrim.position.set(0, 0.47, 0.06); capBrim.scale.set(1, 1, 0.7);
    this.hostess.add(capBrim);
    const capBadge = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.06, 8), gold);
    capBadge.position.set(0, 0.56, 0.25); capBadge.rotation.x = 0.3;
    this.hostess.add(capBadge);

    this.hostess.position.set(0, 0, 0);
    this.scene.add(this.hostess);
  }

  private animate() {
    const t = this.clock.getElapsedTime();
    this.animTime += 0.016;

    // Idle breathing
    if (this.body) {
      this.body.scale.y = 1 + Math.sin(t * 1.4) * 0.012;
      this.body.position.y = Math.sin(t * 1.4) * 0.008;
    }

    // Head micro-bob
    if (this.head) {
      this.head.rotation.y = Math.sin(t * 0.5) * 0.06;
      this.head.rotation.z = Math.sin(t * 0.35) * 0.03;
    }

    switch (this.animState) {
      case 'wave':
        if (this.rightArm) {
          this.rightArm.rotation.z = -0.6 + Math.sin(this.animTime * 5) * 0.55;
          this.rightArm.rotation.x = -0.4;
        }
        break;
      case 'point':
        if (this.rightArm) {
          this.rightArm.rotation.z = -Math.PI * 0.35 + Math.sin(t * 1.5) * 0.06;
          this.rightArm.rotation.x = -0.2;
        }
        break;
      case 'nod':
        if (this.head) this.head.rotation.x = Math.sin(t * 2) * 0.12;
        if (this.rightArm) {
          this.rightArm.rotation.z = -0.25;
          this.rightArm.rotation.x = Math.sin(t * 1.2) * 0.05;
        }
        break;
      case 'thumbsup':
        if (this.rightArm) {
          this.rightArm.rotation.z = -Math.PI * 0.4;
          this.rightArm.rotation.x = 0.3;
          this.rightArm.position.y = -0.3;
        }
        break;
      case 'celebrate':
        if (this.rightArm) {
          this.rightArm.rotation.z = -Math.PI * 0.5 + Math.sin(t * 4) * 0.3;
          this.rightArm.rotation.x = -0.5;
        }
        if (this.leftArm) {
          this.leftArm.rotation.z = Math.PI * 0.5 + Math.sin(t * 4 + 0.5) * 0.3;
          this.leftArm.rotation.x = -0.5;
        }
        break;
      default:
        if (this.rightArm) { this.rightArm.rotation.z = 0; this.rightArm.rotation.x = 0; }
        if (this.leftArm)  { this.leftArm.rotation.z  = 0; this.leftArm.rotation.x  = 0; }
    }

    // Reset left arm if not celebrating
    if (this.animState !== 'celebrate' && this.leftArm) {
      this.leftArm.rotation.z = THREE.MathUtils.lerp(this.leftArm.rotation.z, 0, 0.08);
      this.leftArm.rotation.x = THREE.MathUtils.lerp(this.leftArm.rotation.x, 0, 0.08);
    }
  }
}
