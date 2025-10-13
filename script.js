// Dynamically populate pillars, why-us, and team cards
const pillars = [
    {
      title: "M&A Execution & Digital-First Advisory",
      bullets: ["Pre-LOI Advisory", "Buy-Side & Sell-Side Due Diligence", "First 100 Days Post-Close", "Post-Sale Transition"]
    },
    {
      title: "Operational Transformation & AI-Driven Growth",
      bullets: ["Enterprise Value Creation", "Pre-Sale Preparation & Exit Readiness", "AI & Digital Transformation Execution", "Interim Leadership for Optimization"]
    },
    {
      title: "Industry & Capability Depth",
      bullets: ["Data-Driven KPIs & EBITDA Impact", "Integration Playbooks & PMOs", "Cloud, Automation, Cybersecurity", "Commercial Acceleration & RevOps"]
    }
  ];
  
  const whyus = [
    { h: "Real-World Leaders, Not Career Consultants", p: "Seasoned executives who have led transactions and transformations hands-on." },
    { h: "High-Speed Teams, No Wasted Motion", p: "Lean executive teams that integrate quickly and execute without delays." },
    { h: "Execution That’s Digital-First & Results-Driven", p: "AI-driven insights, automation, and real-time tracking from day one." }
  ];
  
  const team = [
    { name: "Dr. Sean Saunders", title: "Managing Partner & Founder", blurb: "Hands-on leader driving M&A, turnarounds, and AI strategy execution across PE-backed companies." },
    { name: "Seth Weiss", title: "Managing Partner", blurb: "25+ years scaling SaaS/AI growth, commercial engines, and executive teams; creator of Beyond A Sale methodology." }
  ];
  
  function renderCards() {
    const pc = document.getElementById("pillar-cards");
    pillars.forEach(p => {
      const card = document.createElement("div");
      card.className = "rounded-2xl border border-white/10 p-6 bg-white/5";
      card.innerHTML = `<h3 class="font-semibold text-lg">${p.title}</h3>
        <ul class="mt-3 space-y-1 text-sm text-white/80 list-disc pl-5">
          ${p.bullets.map(b => `<li>${b}</li>`).join("")}
        </ul>`;
      pc.appendChild(card);
    });
  
    const wc = document.getElementById("whyus-cards");
    whyus.forEach(w => {
      const card = document.createElement("div");
      card.className = "rounded-2xl border border-white/10 p-6 bg-white/5";
      card.innerHTML = `<h3 class="font-semibold">${w.h}</h3><p class="mt-2 text-white/80 text-sm">${w.p}</p>`;
      wc.appendChild(card);
    });
  
    const tc = document.getElementById("team-cards");
    team.forEach(t => {
      const card = document.createElement("div");
      card.className = "rounded-2xl p-6 border border-white/10 bg-white/5";
      card.innerHTML = `<p class="font-semibold">${t.name}</p>
        <p class="text-sm text-white/70">${t.title}</p>
        <p class="mt-2 text-sm text-white/80">${t.blurb}</p>`;
      tc.appendChild(card);
    });
  }
  
  renderCards();
  
// Form handler (guard for pages without form)
const contactFormEl = document.getElementById("contact-form");
if (contactFormEl) {
  contactFormEl.addEventListener("submit", e => {
    e.preventDefault();
    alert("Thank you! We'll be in touch soon.");
  });
}

// Navigation handler used by pillars
window.navigateToService = function(section) {
  // Normalize casing of the Services page reference
  const target = `Services.html#${section}`;
  window.location.href = target;
}

function navigateToService(section) {
  // Navigate to Services page with specific section
  window.location.href = `Services.html#${section}`;
}

// Add some interactive feedback
document.querySelectorAll('.pillar-section').forEach(section => {
  section.addEventListener('mouseenter', function() {
    this.style.filter = 'brightness(1.1)';
  });
  
  section.addEventListener('mouseleave', function() {
    this.style.filter = 'brightness(1)';
  });
});
  


// Replace interval-based motion with a smooth RAF loop
function initOrb(el, options) {
  const sizeRatio = options.sizeRatio || 0.28; // portion of the shortest viewport side
  const computeSize = () => {
    const minDim = Math.min(window.innerWidth, window.innerHeight);
    // clamp to reasonable bounds
    return options.size || Math.max(220, Math.min(520, Math.round(minDim * sizeRatio)));
  };
  let size = computeSize();
  // Ensure element reflects computed size
  el.style.width = size + 'px';
  el.style.height = size + 'px';

  const pad = options.padding != null ? options.padding : 0; // allow full-screen travel by default
  const speed = options.speed || 0.06;
  const driftAmp = options.driftAmp || { x: 18, y: 14 };
  const phaseX = options.phaseX != null ? options.phaseX : Math.random() * Math.PI * 2;
  const phaseY = options.phaseY != null ? options.phaseY : Math.random() * Math.PI * 2;

  // Percentage-based anchor support
  const anchor = options.anchor;
  const computeAnchor = () => {
    if (!anchor) return null;
    const vw = window.innerWidth, vh = window.innerHeight;
    const fx = anchor.fx, fy = anchor.fy;
    const dxPct = anchor.dxPct || 0, dyPct = anchor.dyPct || 0;
    const dx = (dxPct / 100) * vw;
    const dy = (dyPct / 100) * vh;
    const x = Math.min(Math.max(fx * vw - size / 2 + dx, 0), Math.max(0, vw - size));
    const y = Math.min(Math.max(fy * vh - size / 2 + dy, 0), Math.max(0, vh - size));
    return { x, y };
  };

  const start = options.startPos || computeAnchor() || {
    x: Math.random() * Math.max(0, window.innerWidth - size - pad),
    y: Math.random() * Math.max(0, window.innerHeight - size - pad),
    z: Math.random() * 500 - 250
  };
  
  const state = {
    el,
    x: start.x,
    y: start.y,
    z: start.z || 0,
    size,
    pad,
    target: { x: 0, y: 0, z: 0 },
    speed,
    anchor
  };

  const rand = (min, max) => Math.random() * (max - min) + min;
  const within = () => ({
    x: rand(0, Math.max(0, window.innerWidth - state.size - state.pad)),
    y: rand(0, Math.max(0, window.innerHeight - state.size - state.pad)),
    z: rand(-250, 250)
  });
  const pickNewTarget = () => { state.target = within(); };
  pickNewTarget();

  let lastTs = 0;
  let targetTimer = 0;
  function tick(ts) {
    const { el, target } = state;
    state.x += (target.x - state.x) * speed;
    state.y += (target.y - state.y) * speed;
    state.z += (target.z - state.z) * speed;

    const scale = 1 + (state.z / 1200);
    const t = ts * 0.001;
    const driftX = Math.sin(t * 0.8 + phaseX) * driftAmp.x;
    const driftY = Math.cos(t * 0.9 + phaseY) * driftAmp.y;
    const finalX = state.x + driftX;
    const finalY = state.y + driftY;
    el.style.transform = `translate3d(${finalX}px, ${finalY}px, ${state.z}px) scale(${scale})`;
    
    if (!lastTs) lastTs = ts;
    const dt = ts - lastTs;
    targetTimer += dt;
    if (targetTimer > 2000 + Math.random() * 1500) {
      pickNewTarget();
      targetTimer = 0;
    }
    lastTs = ts;
    requestAnimationFrame(tick);
  }

  requestAnimationFrame(tick);

  window.addEventListener('resize', () => {
    // recompute size responsively
    size = computeSize();
    state.size = size;
    el.style.width = size + 'px';
    el.style.height = size + 'px';
    // clamp to new bounds
    state.x = Math.min(state.x, Math.max(0, window.innerWidth - size - state.pad));
    state.y = Math.min(state.y, Math.max(0, window.innerHeight - size - state.pad));
    // Re-anchor to percentage location on resize
    const a = computeAnchor();
    if (a) {
      state.x = a.x;
      state.y = a.y;
    }
    pickNewTarget();
  });
}

// Initialize the existing orb
(function initBackgroundOrbs() {
  const base = document.querySelector('.background-orb');
  if (base) {
    // ensure it has a visible size class in case CSS width/height are not applied
    if (!base.className.includes('size-')) base.className += ' size-l';
    // Anchor near top-left ~15% x 15%
    initOrb(base, { sizeRatio: 0.28, padding: 0, speed: 0.06, driftAmp: { x: 18, y: 14 }, anchor: { fx: 0.15, fy: 0.15 } });
  }

  // Spawn additional orbs with same configuration and percentage anchors
  const makeOrb = (anchor, sizeClass = 'size-l') => {
    const el = document.createElement('div');
    el.className = `background-orb ${sizeClass}`;
    document.body.appendChild(el);
    initOrb(el, { sizeRatio: 0.28, padding: 0, speed: 0.06, driftAmp: { x: 18, y: 14 }, anchor });
  };

  // Second orb: right-center (fx=1.0, fy=0.5) with slight left inset via dxPct
  makeOrb({ fx: 1.0, fy: 0.5, dxPct: -8, dyPct: 0 }, 'size-m');
  // Third orb: bottom-left area (fx=0.33, fy=1.0) with slight upward inset via dyPct
  makeOrb({ fx: 0.33, fy: 1.0, dxPct: 0, dyPct: -8 }, 'size-s');
})();

// Mobile menu toggle
(function initMobileMenu(){
  console.log('Initializing mobile menu...');
  const btn = document.getElementById('mobile-menu-button');
  const menu = document.getElementById('mobile-menu');
  
  console.log('Button found:', btn);
  console.log('Menu found:', menu);
  
  if (!btn || !menu) {
    console.log('Mobile menu elements not found!');
    return;
  }
  
  let open = false;
  const setOpen = (v) => {
    console.log('Setting menu open to:', v);
    open = v;
    if (open) {
      menu.classList.remove('hidden');
    } else {
      menu.classList.add('hidden');
    }
  };
  
  btn.addEventListener('click', (e) => {
    console.log('Hamburger clicked!');
    e.preventDefault();
    setOpen(!open);
  });
  
  // Close when clicking links
  menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => setOpen(false)));
  // Close on escape
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setOpen(false); });
  
  console.log('Mobile menu initialized successfully');
})();
