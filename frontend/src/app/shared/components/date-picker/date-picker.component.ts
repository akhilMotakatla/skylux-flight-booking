import {
  Component, Input, Output, EventEmitter,
  signal, HostListener, OnChanges, OnDestroy, ElementRef, inject
} from '@angular/core';

// Inject global keyframes once
let _stylesInjected = false;
function injectPortalStyles() {
  if (_stylesInjected) return;
  _stylesInjected = true;
  const s = document.createElement('style');
  s.textContent = `
    @keyframes dp-portal-pop {
      from { opacity:0; transform:translateY(-6px) scale(0.97); }
      to   { opacity:1; transform:translateY(0)   scale(1);    }
    }
    .dp-portal-wrap {
      position: fixed;
      z-index: 99999;
      width: 300px;
      background: rgba(8,18,40,0.97);
      border: 1px solid rgba(212,160,23,0.30);
      border-radius: 16px;
      padding: 18px 16px 14px;
      backdrop-filter: blur(24px);
      box-shadow: 0 24px 60px rgba(0,0,0,0.70), inset 0 1px 0 rgba(212,160,23,0.18);
      font-family: inherit;
      color: #fff;
      animation: dp-portal-pop 0.18s cubic-bezier(0.34,1.56,0.64,1) both;
    }
    .dp-pnav { display:flex; align-items:center; justify-content:space-between; margin-bottom:14px; }
    .dp-pnav-btn {
      width:32px; height:32px; display:flex; align-items:center; justify-content:center;
      background:rgba(255,255,255,0.06); border:1px solid rgba(212,160,23,0.22);
      border-radius:8px; color:#d4a017; font-size:22px; line-height:1; cursor:pointer;
    }
    .dp-pnav-btn:hover { background:rgba(212,160,23,0.14); border-color:rgba(212,160,23,0.50); }
    .dp-month-lbl { font-size:15px; font-weight:700; }
    .dp-wdays { display:grid; grid-template-columns:repeat(7,1fr); border-bottom:1px solid rgba(212,160,23,0.12); padding-bottom:6px; margin-bottom:8px; }
    .dp-wday  { text-align:center; font-size:11px; font-weight:600; color:rgba(212,160,23,0.65); }
    .dp-grid  { display:grid; grid-template-columns:repeat(7,1fr); gap:2px; }
    .dp-cell  {
      width:36px; height:36px; margin:auto; display:flex; align-items:center; justify-content:center;
      font-size:13px; font-weight:500; border-radius:8px; border:1px solid transparent;
      background:transparent; color:#fff; cursor:pointer;
    }
    .dp-cell:hover:not(.dp-cell--dis):not(.dp-cell--blank) { background:rgba(212,160,23,0.14); border-color:rgba(212,160,23,0.42); transform:scale(1.08); }
    .dp-cell--today:not(.dp-cell--sel) { border-color:rgba(212,160,23,0.55); color:#f5c842; font-weight:700; }
    .dp-cell--sel  { background:linear-gradient(135deg,#d4a017,#f5c842); color:#0a0a0a; font-weight:700; border-color:#d4a017; box-shadow:0 4px 16px rgba(212,160,23,0.40); transform:scale(1.10); }
    .dp-cell--dis  { color:rgba(255,255,255,0.20); cursor:not-allowed; }
    .dp-cell--blank{ visibility:hidden; pointer-events:none; }
    .dp-shortcuts { display:flex; align-items:center; gap:6px; margin-top:14px; padding-top:12px; border-top:1px solid rgba(212,160,23,0.12); flex-wrap:wrap; }
    .dp-qlabel { font-size:10px; font-weight:600; letter-spacing:0.8px; text-transform:uppercase; color:rgba(255,255,255,0.55); }
    .dp-qbtn {
      padding:4px 10px; background:rgba(212,160,23,0.08); border:1px solid rgba(212,160,23,0.25);
      border-radius:20px; color:#f5c842; font-size:11px; font-weight:600; cursor:pointer;
    }
    .dp-qbtn:hover { background:rgba(212,160,23,0.22); border-color:rgba(212,160,23,0.55); }
  `;
  document.head.appendChild(s);
}

@Component({
  selector: 'app-date-picker',
  standalone: true,
  imports: [],
  templateUrl: './date-picker.component.html',
  styleUrl: './date-picker.component.scss'
})
export class DatePickerComponent implements OnChanges, OnDestroy {
  @Input() label = 'Date';
  @Input() placeholder = 'Select a date';
  @Input() value = '';
  @Input() min = '';
  @Input() max = '';
  @Output() valueChange = new EventEmitter<string>();

  private el    = inject(ElementRef);
  isOpen        = signal(false);
  private portal: HTMLDivElement | null = null;

  // Internal view state (not signals — portal redraws directly)
  private viewYear  = new Date().getFullYear();
  private viewMonth = new Date().getMonth();

  readonly WEEKDAYS = ['Su','Mo','Tu','We','Th','Fr','Sa'];
  readonly MONTHS   = ['January','February','March','April','May','June',
                       'July','August','September','October','November','December'];

  constructor() { injectPortalStyles(); }

  ngOnChanges() {
    if (this.value) {
      const d = new Date(this.value + 'T00:00:00');
      if (!isNaN(d.getTime())) { this.viewYear = d.getFullYear(); this.viewMonth = d.getMonth(); }
    }
    if (this.portal) this.redraw(); // update open portal if value/min/max changed
  }

  ngOnDestroy() { this.closePortal(); }

  // ── Display value for the trigger button ──────────────────────────────────
  get displayValue(): string {
    if (!this.value) return '';
    const d = new Date(this.value + 'T00:00:00');
    return isNaN(d.getTime()) ? '' :
      d.toLocaleDateString('en-US', { weekday:'short', month:'short', day:'numeric', year:'numeric' });
  }

  // ── Open / close ──────────────────────────────────────────────────────────
  toggle() {
    if (this.portal) { this.closePortal(); return; }
    if (this.value) {
      const d = new Date(this.value + 'T00:00:00');
      if (!isNaN(d.getTime())) { this.viewYear = d.getFullYear(); this.viewMonth = d.getMonth(); }
    }
    this.openPortal();
  }

  private openPortal() {
    const triggerEl = (this.el.nativeElement as HTMLElement).querySelector('.dp-trigger')!;
    const rect = triggerEl.getBoundingClientRect();
    const left = Math.min(rect.left, window.innerWidth - 308);
    const top  = rect.bottom + 8;

    const wrap = document.createElement('div');
    wrap.className = 'dp-portal-wrap';
    wrap.style.top  = `${top}px`;
    wrap.style.left = `${left}px`;
    this.portal = wrap;
    this.redraw();
    document.body.appendChild(wrap);
    this.isOpen.set(true);
  }

  private closePortal() {
    this.portal?.remove();
    this.portal = null;
    this.isOpen.set(false);
  }

  // ── Rebuild calendar inside portal ────────────────────────────────────────
  private redraw() {
    if (!this.portal) return;
    this.portal.innerHTML = '';

    // Month navigator
    const nav = this.mk('div', 'dp-pnav');
    const prevBtn = this.mk('button', 'dp-pnav-btn');
    prevBtn.textContent = '‹';
    prevBtn.onclick = (e) => { e.stopPropagation(); this.prevMonth(); };
    const lbl = this.mk('span', 'dp-month-lbl');
    lbl.textContent = `${this.MONTHS[this.viewMonth]} ${this.viewYear}`;
    const nextBtn = this.mk('button', 'dp-pnav-btn');
    nextBtn.textContent = '›';
    nextBtn.onclick = (e) => { e.stopPropagation(); this.nextMonth(); };
    nav.append(prevBtn, lbl, nextBtn);
    this.portal.appendChild(nav);

    // Weekday headers
    const wdays = this.mk('div', 'dp-wdays');
    for (const wd of this.WEEKDAYS) {
      const cell = this.mk('div', 'dp-wday');
      cell.textContent = wd;
      wdays.appendChild(cell);
    }
    this.portal.appendChild(wdays);

    // Day grid
    const grid = this.mk('div', 'dp-grid');
    for (const day of this.buildDays()) {
      const btn = this.mk('button', 'dp-cell') as HTMLButtonElement;
      btn.textContent = day.label;
      if (day.otherMonth) btn.classList.add('dp-cell--blank');
      else if (day.disabled) { btn.classList.add('dp-cell--dis'); btn.disabled = true; }
      else {
        if (day.isToday)    btn.classList.add('dp-cell--today');
        if (day.isSelected) btn.classList.add('dp-cell--sel');
        btn.onclick = (e) => { e.stopPropagation(); this.selectDay(day.dateStr); };
      }
      grid.appendChild(btn);
    }
    this.portal.appendChild(grid);

    // Quick shortcuts
    const sc = this.mk('div', 'dp-shortcuts');
    const qlbl = this.mk('span', 'dp-qlabel');
    qlbl.textContent = 'Quick:';
    sc.appendChild(qlbl);
    for (const offset of [7, 14, 30, 90]) {
      const btn = this.mk('button', 'dp-qbtn');
      btn.textContent = `+${offset}d`;
      btn.onclick = (e) => { e.stopPropagation(); this.selectOffset(offset); };
      sc.appendChild(btn);
    }
    this.portal.appendChild(sc);
  }

  private prevMonth() {
    if (this.viewMonth === 0) { this.viewMonth = 11; this.viewYear--; }
    else { this.viewMonth--; }
    this.redraw();
  }

  private nextMonth() {
    if (this.viewMonth === 11) { this.viewMonth = 0; this.viewYear++; }
    else { this.viewMonth++; }
    this.redraw();
  }

  private selectDay(ds: string) {
    this.value = ds;
    this.valueChange.emit(ds);
    this.closePortal();
  }

  private selectOffset(days: number) {
    const d = new Date();
    d.setDate(d.getDate() + days);
    const ds = this.fmt(d);
    const minD = this.min ? new Date(this.min + 'T00:00:00') : null;
    const maxD = this.max ? new Date(this.max + 'T00:00:00') : null;
    if ((minD && d < minD) || (maxD && d > maxD)) return;
    this.value = ds;
    this.valueChange.emit(ds);
    this.closePortal();
  }

  // ── Calendar day builder ──────────────────────────────────────────────────
  private buildDays() {
    const yr = this.viewYear, mo = this.viewMonth;
    const today = new Date(); today.setHours(0,0,0,0);
    const minD  = this.min ? new Date(this.min + 'T00:00:00') : null;
    const maxD  = this.max ? new Date(this.max + 'T00:00:00') : null;
    const firstDow = new Date(yr, mo, 1).getDay();
    const daysInMo = new Date(yr, mo + 1, 0).getDate();
    const out: { label:string; dateStr:string; disabled:boolean; isToday:boolean; isSelected:boolean; otherMonth:boolean }[] = [];

    for (let i = 0; i < firstDow; i++)
      out.push({ label:'', dateStr:'', disabled:true, isToday:false, isSelected:false, otherMonth:true });

    for (let d = 1; d <= daysInMo; d++) {
      const date = new Date(yr, mo, d); date.setHours(0,0,0,0);
      const ds   = this.fmt(date);
      const off  = (minD && date < minD) || (maxD && date > maxD);
      out.push({ label:String(d), dateStr:ds, disabled:!!off, isToday:date.getTime()===today.getTime(), isSelected:ds===this.value, otherMonth:false });
    }

    while (out.length % 7 !== 0)
      out.push({ label:'', dateStr:'', disabled:true, isToday:false, isSelected:false, otherMonth:true });

    return out;
  }

  // ── Helpers ───────────────────────────────────────────────────────────────
  private mk(tag: string, cls: string): HTMLElement {
    const el = document.createElement(tag);
    el.className = cls;
    return el;
  }

  private fmt(d: Date): string {
    return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
  }

  // ── Close on outside click ────────────────────────────────────────────────
  @HostListener('document:click', ['$event'])
  onClickOutside(e: MouseEvent) {
    const target = e.target as Node;
    const inside = this.el.nativeElement.contains(target) || this.portal?.contains(target);
    if (!inside) this.closePortal();
  }
}
